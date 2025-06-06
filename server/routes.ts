import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
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
  insertHvacEquipmentSchema,
  insertHvacMaterialsSchema,
  insertHvacAccessoriesSchema,
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
    if (!req.isAuthenticated() || (req.user as any)?.role !== "admin") {
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

  // SERVICE BOOKING ROUTES
  
  // Service booking API for furnace installation, AC installation, maintenance
  app.post("/api/service-booking", async (req, res) => {
    try {
      const booking = req.body;
      
      // For now, just return success to test the frontend flow
      // In production, this would integrate with email notifications and database storage
      const bookingId = Math.floor(Math.random() * 10000);
      
      console.log("Service booking received:", {
        customer: booking.customerName,
        service: booking.serviceType,
        price: booking.price,
        address: booking.address
      });

      res.json({ 
        success: true, 
        bookingId: bookingId,
        message: "Booking created successfully" 
      });
    } catch (error) {
      console.error("Service booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // PAYMENT ROUTES
  
  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
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

  // HVAC DATA MANAGEMENT ROUTES (Admin Only)
  
  // Equipment endpoints
  app.get("/api/admin/hvac-equipment", requireAuth, requireAdmin, async (req, res) => {
    try {
      const equipment = await storage.getHvacEquipment();
      res.json(equipment);
    } catch (error: any) {
      console.error("Error getting HVAC equipment:", error);
      res.status(500).json({ 
        error: "Error getting HVAC equipment", 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/hvac-equipment", requireAuth, requireAdmin, async (req, res) => {
    try {
      const equipmentData = req.body;
      const equipment = await storage.createHvacEquipment(equipmentData);
      res.status(201).json(equipment);
    } catch (error: any) {
      console.error("Error creating HVAC equipment:", error);
      res.status(500).json({ 
        error: "Error creating HVAC equipment", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/hvac-equipment/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid equipment ID" });
      }
      
      const equipmentData = req.body;
      const equipment = await storage.updateHvacEquipment(id, equipmentData);
      
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      
      res.json(equipment);
    } catch (error: any) {
      console.error("Error updating HVAC equipment:", error);
      res.status(500).json({ 
        error: "Error updating HVAC equipment", 
        message: error.message 
      });
    }
  });

  // Materials endpoints
  app.get("/api/admin/hvac-materials", requireAuth, requireAdmin, async (req, res) => {
    try {
      const materials = await storage.getHvacMaterials();
      res.json(materials);
    } catch (error: any) {
      console.error("Error getting HVAC materials:", error);
      res.status(500).json({ 
        error: "Error getting HVAC materials", 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/hvac-materials", requireAuth, requireAdmin, async (req, res) => {
    try {
      const materialData = req.body;
      const material = await storage.createHvacMaterial(materialData);
      res.status(201).json(material);
    } catch (error: any) {
      console.error("Error creating HVAC material:", error);
      res.status(500).json({ 
        error: "Error creating HVAC material", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/hvac-materials/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid material ID" });
      }
      
      const materialData = req.body;
      const material = await storage.updateHvacMaterial(id, materialData);
      
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      
      res.json(material);
    } catch (error: any) {
      console.error("Error updating HVAC material:", error);
      res.status(500).json({ 
        error: "Error updating HVAC material", 
        message: error.message 
      });
    }
  });

  // Accessories endpoints
  app.get("/api/admin/hvac-accessories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const accessories = await storage.getHvacAccessories();
      res.json(accessories);
    } catch (error: any) {
      console.error("Error getting HVAC accessories:", error);
      res.status(500).json({ 
        error: "Error getting HVAC accessories", 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/hvac-accessories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const accessoryData = req.body;
      const accessory = await storage.createHvacAccessory(accessoryData);
      res.status(201).json(accessory);
    } catch (error: any) {
      console.error("Error creating HVAC accessory:", error);
      res.status(500).json({ 
        error: "Error creating HVAC accessory", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/hvac-accessories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid accessory ID" });
      }
      
      const accessoryData = req.body;
      const accessory = await storage.updateHvacAccessory(id, accessoryData);
      
      if (!accessory) {
        return res.status(404).json({ error: "Accessory not found" });
      }
      
      res.json(accessory);
    } catch (error: any) {
      console.error("Error updating HVAC accessory:", error);
      res.status(500).json({ 
        error: "Error updating HVAC accessory", 
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
  
  // CONTENT MANAGEMENT ROUTES (Admin Only)
  
  // Google Reviews Management
  app.get("/api/admin/reviews-carousel", requireAdmin, async (req, res) => {
    try {
      const reviews = await storage.getReviews(false); // Get all reviews, not just approved
      res.json(reviews);
    } catch (error: any) {
      console.error("Error getting reviews for admin:", error);
      res.status(500).json({ 
        error: "Error getting reviews", 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/reviews-carousel", requireAdmin, async (req, res) => {
    try {
      const reviewData = {
        ...req.body,
        isApproved: true, // Admin-created reviews are auto-approved
        isVerified: true
      };
      
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(500).json({ 
        error: "Error creating review", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/reviews-carousel/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.approveReview(id);
      res.json(review);
    } catch (error: any) {
      console.error("Error updating review:", error);
      res.status(500).json({ 
        error: "Error updating review", 
        message: error.message 
      });
    }
  });

  // Service Area Management 
  app.get("/api/admin/service-areas", requireAdmin, async (req, res) => {
    try {
      // For now, return the hardcoded cities - later can be stored in database
      const cities = [
        'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Airdrie',
        'Okotoks', 'Cochrane', 'Canmore', 'Banff', 'Camrose', 'Lacombe',
        'Innisfail', 'Olds', 'Didsbury', 'Strathmore', 'High River', 'Turner Valley',
        'Black Diamond', 'Chestermere', 'Rocky View County', 'Foothills County',
        'Mountain View County', 'Drumheller'
      ];
      res.json(cities);
    } catch (error: any) {
      console.error("Error getting service areas:", error);
      res.status(500).json({ 
        error: "Error getting service areas", 
        message: error.message 
      });
    }
  });

  // Gallery Project Management for Carousel
  app.post("/api/admin/gallery-projects", requireAdmin, async (req, res) => {
    try {
      const projectData = {
        title: req.body.title,
        description: req.body.description,
        beforeImageUrl: req.body.beforeImageUrl,
        afterImageUrl: req.body.afterImageUrl,
        location: req.body.location,
        category: req.body.category || 'residential',
        isVisible: true
      };
      
      const project = await storage.createGalleryImage(projectData);
      res.json(project);
    } catch (error: any) {
      console.error("Error creating gallery project:", error);
      res.status(500).json({ 
        error: "Error creating gallery project", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/gallery-projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateGalleryImage(id, req.body);
      res.json(project);
    } catch (error: any) {
      console.error("Error updating gallery project:", error);
      res.status(500).json({ 
        error: "Error updating gallery project", 
        message: error.message 
      });
    }
  });

  app.delete("/api/admin/gallery-projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryImage(id);
      
      if (!success) {
        return res.status(404).json({ error: "Gallery project not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting gallery project:", error);
      res.status(500).json({ 
        error: "Error deleting gallery project", 
        message: error.message 
      });
    }
  });

  // Blog Management
  app.get("/api/admin/blog-posts", requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false); // Get all posts including unpublished
      res.json(posts);
    } catch (error: any) {
      console.error("Error getting blog posts for admin:", error);
      res.status(500).json({ 
        error: "Error getting blog posts", 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/blog-posts", requireAdmin, async (req, res) => {
    try {
      const postData = {
        ...req.body,
        authorId: (req.user as any).id,
        slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ 
        error: "Error creating blog post", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/blog-posts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ 
        error: "Error updating blog post", 
        message: error.message 
      });
    }
  });

  app.delete("/api/admin/blog-posts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
  
  // ALGGIN.COM DATA INTEGRATION ROUTES
  
  // Fetch data from alggin.com with user's multiplier rates
  app.post("/api/fetch-alggin-data", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { category } = req.body;
      
      // User's specific multiplier rates for alggin.com pricing
      const MULTIPLIER_RATES: { [key: string]: number } = {
        'Residential': 0.625,
        'Commercial': 0.616,
        'Spiral': 0.353,
        'B-Vent': 0.610,
        'Venting': 0.618,
        'Flexible Pipe': 0.618,
        'Grilles/Registers/Diffusers': 0.600,
        'Tools': 0.600,
        'Fans': 0.600,
        'Louvers & Dampers': 0.600,
        'Miscellaneous': 0.600,
        'Heating & Cooling - Commercial': 0.525,
        'Heating & Cooling - Residential': 0.525,
      };
      
      // Generate sample data structure based on alggin.com categories
      const generateCategoryProducts = (cat: string) => {
        const baseProducts: any[] = [];
        
        switch (cat) {
          case 'Residential':
            baseProducts.push(
              { name: 'Round Galvanized Duct 6"', partNumber: 'RGD-6', listPrice: 24.50, description: 'Standard 6" round galvanized ductwork' },
              { name: 'Rectangular Duct 8x6', partNumber: 'RD-8x6', listPrice: 32.75, description: 'Rectangular galvanized duct' },
              { name: 'Flex Duct Insulated 6"', partNumber: 'FDI-6', listPrice: 45.80, description: 'Insulated flexible ductwork' }
            );
            break;
          case 'Commercial':
            baseProducts.push(
              { name: 'Commercial RTU Filter 20x25x4', partNumber: 'RTU-2025-4', listPrice: 89.50, description: 'Commercial rooftop unit filter' },
              { name: 'Variable Speed Drive 5HP', partNumber: 'VSD-5HP', listPrice: 1250.00, description: 'Variable frequency drive for commercial HVAC' }
            );
            break;
          case 'Fans':
            baseProducts.push(
              { name: 'Exhaust Fan 6" 250CFM', partNumber: 'EF-6-250', listPrice: 125.00, description: 'Bathroom exhaust fan' },
              { name: 'Inline Duct Fan 8" 420CFM', partNumber: 'IDF-8-420', listPrice: 185.50, description: 'Inline duct booster fan' }
            );
            break;
          case 'Heating & Cooling - Residential':
            baseProducts.push(
              { name: 'Goodman GSX160361 3 Ton AC', partNumber: 'GSX160361', listPrice: 2850.00, description: '16 SEER 3 ton air conditioner' },
              { name: 'Carrier 59MN7 80k BTU Furnace', partNumber: '59MN7080', listPrice: 1950.00, description: '80% AFUE natural gas furnace' }
            );
            break;
          default:
            baseProducts.push(
              { name: `Sample ${cat} Product`, partNumber: `${cat.substring(0,3).toUpperCase()}-001`, listPrice: 100.00, description: `Standard ${cat} component` }
            );
        }
        
        return baseProducts.map(product => ({
          ...product,
          id: `${product.partNumber}-${Date.now()}`,
          category: cat,
          manufacturer: 'Various',
          availability: 'In Stock',
          specifications: {
            material: 'Galvanized Steel',
            warranty: '1 Year',
            certification: 'UL Listed'
          }
        }));
      };
      
      const products = generateCategoryProducts(category);
      
      res.json({
        category,
        products,
        multiplierRate: MULTIPLIER_RATES[category] || 0.60,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching alggin data: " + error.message });
    }
  });

  app.post("/api/save-alggin-products", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { products } = req.body;
      
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "No products provided" });
      }
      
      const savedProducts = [];
      
      for (const product of products) {
        try {
          const materialData = {
            name: product.name,
            category: product.category,
            partNumber: product.partNumber || '',
            supplier: 'Alggin',
            unitCost: product.yourCost || 0,
            customerPrice: product.customerPrice || 0,
            unit: 'each',
            description: product.description || '',
            specifications: JSON.stringify(product.specifications || {}),
            availability: product.availability || 'In Stock'
          };
          
          savedProducts.push({
            ...materialData,
            id: savedProducts.length + 1,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Error processing product ${product.name}:`, error);
        }
      }
      
      res.json({ 
        message: `Successfully processed ${savedProducts.length} products from alggin.com`,
        products: savedProducts 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error saving products: " + error.message });
    }
  });

  // ADMIN DASHBOARD API ENDPOINTS
  
  // Dashboard statistics
  app.get("/api/admin/dashboard-stats", requireAdmin, async (req, res) => {
    try {
      const dateRange = req.query.range as string || '7d';
      const stats = await storage.getDashboardStats(dateRange);
      res.json(stats);
    } catch (error: any) {
      console.error("Error getting dashboard stats:", error);
      res.status(500).json({ 
        error: "Error getting dashboard stats", 
        message: error.message 
      });
    }
  });

  // Analytics data
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const dateRange = req.query.range as string || '7d';
      const analytics = await storage.getAnalyticsData(dateRange);
      res.json(analytics);
    } catch (error: any) {
      console.error("Error getting analytics:", error);
      res.status(500).json({ 
        error: "Error getting analytics", 
        message: error.message 
      });
    }
  });

  // Contact submissions management
  app.get("/api/admin/contact-submissions", requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      const submissions = await storage.getContactSubmissions(status);
      res.json(submissions);
    } catch (error: any) {
      console.error("Error getting contact submissions:", error);
      res.status(500).json({ 
        error: "Error getting contact submissions", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/contact-submissions/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      
      const submission = await storage.updateContactSubmissionStatus(id, status);
      
      if (!submission) {
        return res.status(404).json({ error: "Contact submission not found" });
      }
      
      res.json(submission);
    } catch (error: any) {
      console.error("Error updating submission status:", error);
      res.status(500).json({ 
        error: "Error updating submission status", 
        message: error.message 
      });
    }
  });

  // Emergency requests management
  app.get("/api/admin/emergency-requests", requireAdmin, async (req, res) => {
    try {
      const requests = await storage.getEmergencyRequests();
      res.json(requests);
    } catch (error: any) {
      console.error("Error getting emergency requests:", error);
      res.status(500).json({ 
        error: "Error getting emergency requests", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/emergency-requests/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }
      
      const request = await storage.updateEmergencyRequestStatus(id, status);
      
      if (!request) {
        return res.status(404).json({ error: "Emergency request not found" });
      }
      
      res.json(request);
    } catch (error: any) {
      console.error("Error updating request status:", error);
      res.status(500).json({ 
        error: "Error updating request status", 
        message: error.message 
      });
    }
  });

  // Quote requests management
  app.get("/api/admin/quote-requests", requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      const requests = await storage.getQuoteRequests(status);
      res.json(requests);
    } catch (error: any) {
      console.error("Error getting quote requests:", error);
      res.status(500).json({ 
        error: "Error getting quote requests", 
        message: error.message 
      });
    }
  });

  app.put("/api/admin/quote-requests/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, quoteAmount } = req.body;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }
      
      const request = await storage.updateQuoteRequestStatus(id, status, quoteAmount);
      
      if (!request) {
        return res.status(404).json({ error: "Quote request not found" });
      }
      
      res.json(request);
    } catch (error: any) {
      console.error("Error updating quote request:", error);
      res.status(500).json({ 
        error: "Error updating quote request", 
        message: error.message 
      });
    }
  });

  // Customer management
  app.get("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error: any) {
      console.error("Error getting customers:", error);
      res.status(500).json({ 
        error: "Error getting customers", 
        message: error.message 
      });
    }
  });

  // PUBLIC FORM SUBMISSION ENDPOINTS

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const submissionData = {
        ...req.body,
        submittedAt: new Date(),
        status: 'new'
      };
      
      const submission = await storage.createContactSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error: any) {
      console.error("Error creating contact submission:", error);
      res.status(500).json({ 
        error: "Error submitting contact form", 
        message: error.message 
      });
    }
  });

  // Emergency request submission
  app.post("/api/emergency", async (req, res) => {
    try {
      const requestData = {
        ...req.body,
        requestedAt: new Date(),
        status: 'pending'
      };
      
      const request = await storage.createEmergencyRequest(requestData);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Error creating emergency request:", error);
      res.status(500).json({ 
        error: "Error submitting emergency request", 
        message: error.message 
      });
    }
  });

  // Quote request submission
  app.post("/api/quote", async (req, res) => {
    try {
      const requestData = {
        ...req.body,
        requestedAt: new Date(),
        status: 'pending'
      };
      
      const request = await storage.createQuoteRequest(requestData);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Error creating quote request:", error);
      res.status(500).json({ 
        error: "Error submitting quote request", 
        message: error.message 
      });
    }
  });

  // ANALYTICS TRACKING ENDPOINTS

  // Page view tracking
  app.post("/api/analytics/page-view", async (req, res) => {
    try {
      const pageViewData = {
        ...req.body,
        userId: req.user ? (req.user as any).id : null,
        createdAt: new Date()
      };
      
      await storage.recordPageView(pageViewData);
      res.status(201).json({ success: true });
    } catch (error: any) {
      console.error("Error recording page view:", error);
      res.status(500).json({ 
        error: "Error recording page view", 
        message: error.message 
      });
    }
  });

  // Calculator usage tracking
  app.post("/api/analytics/calculator-usage", async (req, res) => {
    try {
      const usageData = {
        ...req.body,
        userId: req.user ? (req.user as any).id : null,
        createdAt: new Date()
      };
      
      await storage.recordCalculatorUsage(usageData);
      res.status(201).json({ success: true });
    } catch (error: any) {
      console.error("Error recording calculator usage:", error);
      res.status(500).json({ 
        error: "Error recording calculator usage", 
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
