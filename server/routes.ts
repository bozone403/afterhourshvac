import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertProductAccessSchema, 
  insertForumCategorySchema, 
  insertForumTopicSchema, 
  insertForumPostSchema, 
  insertGalleryImageSchema, 
  insertCustomerReviewSchema, 
  insertBlogPostSchema, 
  insertBlogCategorySchema,
  users
} from "@shared/schema";
import { WebSocketServer } from 'ws';
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";

// Initialize Stripe with the provided secret key
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Payment functionality will be limited.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

// Utility functions for password hashing
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Authentication setup
function setupAuth(app: Express) {
  // Set up session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "afterhours-hvac-secret",
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // Set up passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport to use local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Admin authentication middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };

  // Auth routes
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate the request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return the user data without the password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Update last login time
        storage.updateUser(user.id, { lastLogin: new Date() })
          .catch(err => console.error("Failed to update last login:", err));
        
        // Return the user data without the password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Return the user data without the password
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  return { requireAuth, requireAdmin };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { requireAuth, requireAdmin } = setupAuth(app);

  // PAYMENT ROUTES
  
  // Payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          error: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable." 
        });
      }

      const { amount, productId, tier, category } = req.body;
      
      // Validate the required fields
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      
      // Get the user ID from the session
      const userId = (req.user as any).id;
      
      // Create a payment intent with the amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: userId.toString(),
          productId: productId.toString(),
          tier: tier || "",
          category: category || "",
        }
      });
      
      // Return the client secret to the client
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creating payment intent", 
        message: error.message 
      });
    }
  });

  // Check if user has access to a specific product
  app.get("/api/check-product-access/:productId", requireAuth, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const userId = (req.user as any).id;
      
      if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const hasAccess = await storage.checkProductAccess(userId, productId);
      res.json({ hasAccess });
    } catch (error: any) {
      console.error("Error checking product access:", error);
      res.status(500).json({ 
        error: "Error checking product access", 
        message: error.message 
      });
    }
  });
  
  // Get user's product access list
  app.get("/api/user-product-access", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const accessList = await storage.getUserProductAccess(userId);
      res.json(accessList);
    } catch (error: any) {
      console.error("Error getting user product access:", error);
      res.status(500).json({ 
        error: "Error getting user product access", 
        message: error.message 
      });
    }
  });

  // Check if user has Pro Calculator access (legacy endpoint)
  app.get("/api/check-pro-access", async (req, res) => {
    try {
      // Get user ID from session if authenticated, otherwise from query param
      let userId: number;
      
      if (req.isAuthenticated()) {
        userId = (req.user as any).id;
      } else {
        userId = parseInt(req.query.userId as string);
        if (!userId || isNaN(userId)) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      }
      
      const hasAccess = await storage.checkProAccess(userId);
      res.json({ hasAccess });
    } catch (error: any) {
      console.error("Error checking pro access:", error);
      res.status(500).json({ 
        error: "Error checking pro access", 
        message: error.message 
      });
    }
  });
  
  // Update user's Pro Calculator access status (admin only)
  app.post("/api/update-pro-access", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.body.userId);
      const { hasAccess, grantedAt } = req.body;
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Convert string date to Date object
      const grantedDate = grantedAt ? new Date(grantedAt) : new Date();
      
      // Update the user's pro access status
      const user = await storage.updateUserProAccess(userId, hasAccess, grantedDate);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true, user });
    } catch (error: any) {
      console.error("Error updating pro access:", error);
      res.status(500).json({ 
        error: "Error updating pro access", 
        message: error.message 
      });
    }
  });
  
  // Grant product access (admin only)
  app.post("/api/grant-product-access", requireAdmin, async (req, res) => {
    try {
      const accessData = insertProductAccessSchema.parse(req.body);
      const productAccess = await storage.grantProductAccess(accessData);
      res.status(201).json(productAccess);
    } catch (error: any) {
      console.error("Error granting product access:", error);
      res.status(500).json({ 
        error: "Error granting product access", 
        message: error.message 
      });
    }
  });
  
  // Revoke product access (admin only)
  app.post("/api/revoke-product-access", requireAdmin, async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!userId || !productId) {
        return res.status(400).json({ error: "User ID and Product ID are required" });
      }
      
      const success = await storage.revokeProductAccess(userId, productId);
      
      if (!success) {
        return res.status(404).json({ error: "Product access not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error revoking product access:", error);
      res.status(500).json({ 
        error: "Error revoking product access", 
        message: error.message 
      });
    }
  });

  // Handle Stripe webhook for payment confirmation
  app.post('/api/webhook', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      // In production, you would verify the webhook signature
      // const signature = req.headers['stripe-signature'];
      // const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
      
      // For demo purposes, we'll directly use the body
      const event = req.body;
      
      // Handle specific event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const { userId, productId } = paymentIntent.metadata;
          
          if (userId && productId) {
            // Grant product access
            const userIdNum = parseInt(userId);
            const productIdNum = parseInt(productId);
            
            // Grant product access
            await storage.grantProductAccess({
              userId: userIdNum,
              productId: productIdNum,
              purchasedAt: new Date(),
              active: true,
              paymentIntentId: paymentIntent.id
            });
            
            console.log(`[Payment Success] Granted access to product ${productId} for user ${userId}`);
          }
          
          // Legacy: If this was a Pro Calculator purchase, grant access
          if (paymentIntent.metadata.isProCalculator === 'true' && userId) {
            await storage.updateUserProAccess(parseInt(userId), true, new Date());
            console.log(`[Payment Success] Pro Calculator access for user ${userId}`);
          }
          
          break;
        case 'payment_intent.payment_failed':
          console.log(`[Payment Failed] Payment ${event.data.object.id} failed`);
          break;
      }

      res.status(200).send({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });
  
  // FORUM ROUTES
  
  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error getting forum categories:", error);
      res.status(500).json({ 
        error: "Error getting forum categories", 
        message: error.message 
      });
    }
  });
  
  // Get forum topics by category ID
  app.get("/api/forum/categories/:categoryId/topics", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const topics = await storage.getForumTopics(categoryId);
      res.json(topics);
    } catch (error: any) {
      console.error("Error getting forum topics:", error);
      res.status(500).json({ 
        error: "Error getting forum topics", 
        message: error.message 
      });
    }
  });
  
  // Get forum posts by topic ID
  app.get("/api/forum/topics/:topicId/posts", async (req, res) => {
    try {
      const topicId = parseInt(req.params.topicId);
      
      if (!topicId || isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }
      
      const posts = await storage.getForumPosts(topicId);
      res.json(posts);
    } catch (error: any) {
      console.error("Error getting forum posts:", error);
      res.status(500).json({ 
        error: "Error getting forum posts", 
        message: error.message 
      });
    }
  });
  
  // Create forum category (admin only)
  app.post("/api/forum/categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating forum category:", error);
      res.status(500).json({ 
        error: "Error creating forum category", 
        message: error.message 
      });
    }
  });
  
  // Create forum topic
  app.post("/api/forum/topics", requireAuth, async (req, res) => {
    try {
      const topicData = {
        ...req.body,
        userId: (req.user as any).id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = insertForumTopicSchema.parse(topicData);
      const topic = await storage.createForumTopic(result);
      res.status(201).json(topic);
    } catch (error: any) {
      console.error("Error creating forum topic:", error);
      res.status(500).json({ 
        error: "Error creating forum topic", 
        message: error.message 
      });
    }
  });
  
  // Create forum post
  app.post("/api/forum/posts", requireAuth, async (req, res) => {
    try {
      const postData = {
        ...req.body,
        userId: (req.user as any).id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false
      };
      
      const result = insertForumPostSchema.parse(postData);
      const post = await storage.createForumPost(result);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ 
        error: "Error creating forum post", 
        message: error.message 
      });
    }
  });
  
  // PRODUCT ROUTES
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      console.error("Error getting products:", error);
      res.status(500).json({ 
        error: "Error getting products", 
        message: error.message 
      });
    }
  });
  
  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error: any) {
      console.error("Error getting products by category:", error);
      res.status(500).json({ 
        error: "Error getting products by category", 
        message: error.message 
      });
    }
  });
  
  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      console.error("Error getting product:", error);
      res.status(500).json({ 
        error: "Error getting product", 
        message: error.message 
      });
    }
  });
  
  // Create product (admin only)
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(500).json({ 
        error: "Error creating product", 
        message: error.message 
      });
    }
  });
  
  // Update product (admin only)
  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const productData = req.body;
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ 
        error: "Error updating product", 
        message: error.message 
      });
    }
  });

  // USER PRODUCT ACCESS ROUTES
  
  // Get user's product access
  app.get("/api/user/product-access", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userAccess = await storage.getUserProductAccess(userId);
      
      // Transform to include category and tier from products
      const accessWithDetails = await Promise.all(
        userAccess.map(async (access) => {
          const product = await storage.getProductById(access.productId);
          return {
            productId: access.productId,
            category: product?.category || '',
            tier: product?.tier || '',
            purchasedAt: access.purchasedAt,
            active: access.active
          };
        })
      );
      
      res.json(accessWithDetails);
    } catch (error: any) {
      console.error("Error getting user product access:", error);
      res.status(500).json({ 
        error: "Error getting user product access", 
        message: error.message 
      });
    }
  });
  
  // GALLERY ROUTES
  
  // Get all gallery images
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error: any) {
      console.error("Error getting gallery images:", error);
      res.status(500).json({ 
        error: "Error getting gallery images", 
        message: error.message 
      });
    }
  });
  
  // Create gallery image (admin only)
  app.post("/api/gallery", requireAdmin, async (req, res) => {
    try {
      const imageData = insertGalleryImageSchema.parse({
        ...req.body,
        createdBy: (req.user as any).id
      });
      
      const image = await storage.createGalleryImage(imageData);
      res.status(201).json(image);
    } catch (error: any) {
      console.error("Error creating gallery image:", error);
      res.status(500).json({ 
        error: "Error creating gallery image", 
        message: error.message 
      });
    }
  });
  
  // Update gallery image (admin only)
  app.put("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid gallery image ID" });
      }
      
      const imageData = req.body;
      const image = await storage.updateGalleryImage(id, imageData);
      
      if (!image) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      
      res.json(image);
    } catch (error: any) {
      console.error("Error updating gallery image:", error);
      res.status(500).json({ 
        error: "Error updating gallery image", 
        message: error.message 
      });
    }
  });
  
  // Delete gallery image (admin only)
  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid gallery image ID" });
      }
      
      const success = await storage.deleteGalleryImage(id);
      
      if (!success) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ 
        error: "Error deleting gallery image", 
        message: error.message 
      });
    }
  });
  
  // BLOG ROUTES
  
  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      // Only admins can see unpublished posts
      const publishedOnly = !(req.isAuthenticated() && (req.user as any).role === "admin");
      const posts = await storage.getBlogPosts(publishedOnly);
      res.json(posts);
    } catch (error: any) {
      console.error("Error getting blog posts:", error);
      res.status(500).json({ 
        error: "Error getting blog posts", 
        message: error.message 
      });
    }
  });
  
  // Get blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Only allow viewing unpublished posts if admin
      if (!post.isPublished && !(req.isAuthenticated() && (req.user as any).role === "admin")) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error: any) {
      console.error("Error getting blog post:", error);
      res.status(500).json({ 
        error: "Error getting blog post", 
        message: error.message 
      });
    }
  });
  
  // Create blog post (admin only)
  app.post("/api/blog", requireAdmin, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: (req.user as any).id
      });
      
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ 
        error: "Error creating blog post", 
        message: error.message 
      });
    }
  });
  
  // Update blog post (admin only)
  app.put("/api/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      
      const postData = req.body;
      const post = await storage.updateBlogPost(id, postData);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ 
        error: "Error updating blog post", 
        message: error.message 
      });
    }
  });
  
  // Delete blog post (admin only)
  app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ 
        error: "Error deleting blog post", 
        message: error.message 
      });
    }
  });
  
  // Get blog categories
  app.get("/api/blog-categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error getting blog categories:", error);
      res.status(500).json({ 
        error: "Error getting blog categories", 
        message: error.message 
      });
    }
  });
  
  // Create blog category (admin only)
  app.post("/api/blog-categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating blog category:", error);
      res.status(500).json({ 
        error: "Error creating blog category", 
        message: error.message 
      });
    }
  });
  
  // FORUM ROUTES
  
  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error getting forum categories:", error);
      res.status(500).json({ 
        error: "Error getting forum categories", 
        message: error.message 
      });
    }
  });
  
  // Get topics in a category
  app.get("/api/forum/categories/:id/topics", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const topics = await storage.getForumTopics(categoryId);
      res.json(topics);
    } catch (error: any) {
      console.error("Error getting forum topics:", error);
      res.status(500).json({ 
        error: "Error getting forum topics", 
        message: error.message 
      });
    }
  });
  
  // Get posts in a topic
  app.get("/api/forum/topics/:id/posts", async (req, res) => {
    try {
      const topicId = parseInt(req.params.id);
      
      if (!topicId || isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }
      
      const posts = await storage.getForumPosts(topicId);
      res.json(posts);
    } catch (error: any) {
      console.error("Error getting forum posts:", error);
      res.status(500).json({ 
        error: "Error getting forum posts", 
        message: error.message 
      });
    }
  });
  
  // Create forum category (admin only)
  app.post("/api/forum/categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating forum category:", error);
      res.status(500).json({ 
        error: "Error creating forum category", 
        message: error.message 
      });
    }
  });
  
  // Create forum topic (requires authentication)
  app.post("/api/forum/topics", requireAuth, async (req, res) => {
    try {
      const topicData = insertForumTopicSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      const topic = await storage.createForumTopic(topicData);
      res.status(201).json(topic);
    } catch (error: any) {
      console.error("Error creating forum topic:", error);
      res.status(500).json({ 
        error: "Error creating forum topic", 
        message: error.message 
      });
    }
  });
  
  // Create forum post (requires authentication)
  app.post("/api/forum/posts", requireAuth, async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ 
        error: "Error creating forum post", 
        message: error.message 
      });
    }
  });
  
  // REVIEWS ROUTES
  
  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      // Only admins can see unapproved reviews
      const approvedOnly = !(req.isAuthenticated() && (req.user as any).role === "admin");
      const reviews = await storage.getReviews(approvedOnly);
      res.json(reviews);
    } catch (error: any) {
      console.error("Error getting reviews:", error);
      res.status(500).json({ 
        error: "Error getting reviews", 
        message: error.message 
      });
    }
  });
  
  // Create review
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertCustomerReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(500).json({ 
        error: "Error creating review", 
        message: error.message 
      });
    }
  });
  
  // Approve review (admin only)
  app.post("/api/reviews/:id/approve", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      
      const review = await storage.approveReview(id);
      
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      res.json(review);
    } catch (error: any) {
      console.error("Error approving review:", error);
      res.status(500).json({ 
        error: "Error approving review", 
        message: error.message 
      });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial message
    ws.send(JSON.stringify({
      type: 'info',
      message: 'Connected to AfterHours HVAC WebSocket server',
      timestamp: new Date().toISOString()
    }));
    
    // Handle messages from clients
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'chat':
            // Broadcast chat message to all clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  user: data.user,
                  message: data.message,
                  timestamp: new Date().toISOString()
                }));
              }
            });
            break;
            
          case 'ping':
            // Respond to ping
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }));
            break;
            
          default:
            console.log('Received unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
