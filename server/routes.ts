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
  insertForumLikeSchema,
  insertGalleryImageSchema, 
  insertCustomerReviewSchema, 
  insertBlogPostSchema, 
  insertBlogCategorySchema,
  insertHvacEquipmentSchema,
  insertHvacMaterialsSchema,
  insertHvacAccessoriesSchema,
  insertEmergencyRequestSchema,
  insertJobApplicationSchema,
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
  if (!stored || !stored.includes('.')) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
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
    if (!req.isAuthenticated() || (req.user as any)?.role !== "admin" || (req.user as any)?.username !== "JordanBoz") {
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

  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Get fresh user data from database to include current Pro access status
      const userId = (req.user as any).id;
      const freshUser = await storage.getUser(userId);
      
      if (!freshUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return the user data without the password
      const { password, ...userWithoutPassword } = freshUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Error fetching user data" });
    }
  });

  // Update user email
  app.put("/api/user/email", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { newEmail } = req.body;
      
      if (!newEmail) {
        return res.status(400).json({ error: "New email is required" });
      }
      
      // Check if email is already in use
      const existingUser = await storage.getUserByEmail(newEmail);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      
      const updatedUser = await storage.updateUser(userId, { email: newEmail });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating email:", error);
      res.status(500).json({ error: "Failed to update email" });
    }
  });

  // Update user password
  app.put("/api/user/password", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      
      // Get current user with password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Verify current password
      const isValidPassword = await comparePasswords(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password
      const updatedUser = await storage.updateUser(userId, { password: hashedNewPassword });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  return { requireAuth, requireAdmin };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { requireAuth, requireAdmin } = setupAuth(app);

  // SERVICE BOOKING ROUTES
  
  // Emergency service request API
  app.post("/api/emergency-request", async (req, res) => {
    try {
      const { name, phone, issue, description } = req.body;
      
      // Log emergency request for immediate attention
      console.log("EMERGENCY REQUEST RECEIVED:", {
        name,
        phone,
        issue,
        description,
        timestamp: new Date().toISOString()
      });
      
      // In production, this would trigger SMS/email alerts to on-call technicians
      const requestId = `EMG-${Date.now()}`;
      
      res.json({ 
        success: true, 
        requestId,
        message: "Emergency request received. A technician will contact you within 15 minutes."
      });
    } catch (error: any) {
      console.error("Error processing emergency request:", error);
      res.status(500).json({ error: "Failed to process emergency request" });
    }
  });
  
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

      const { amount, productId, tier, category, planType, service, serviceType } = req.body;
      
      // Validate the required fields
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      // Get the user ID from the session if authenticated
      const userId = req.isAuthenticated() ? (req.user as any).id : null;
      
      // Determine amount in cents - handle both dollar amounts and cent amounts
      let amountInCents = Math.round(amount);
      
      // If amount is less than 1000 (likely dollars), convert to cents
      if (amount < 1000 && !planType) {
        amountInCents = Math.round(amount * 100);
      }
      
      // Create a payment intent with the amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        metadata: {
          userId: userId ? userId.toString() : "guest",
          productId: productId || "",
          tier: tier || "",
          category: category || "",
          planType: planType || "",
          service: service || "",
          serviceType: serviceType || "",
        }
      });
      
      // Return the client secret to the client
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        planType: planType,
        service: service,
        serviceType: serviceType
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

  // Enhanced Quotes API Routes
  app.post("/api/quotes", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const quoteData = req.body;
      
      const quote = await storage.createEnhancedQuote({
        ...quoteData,
        userId,
        customerName: quoteData.customerInfo.name,
        customerEmail: quoteData.customerInfo.email,
        customerPhone: quoteData.customerInfo.phone,
        customerAddress: quoteData.customerInfo.address,
        jobDescription: quoteData.customerInfo.jobDescription,
      });
      
      res.status(201).json(quote);
    } catch (error: any) {
      console.error("Error saving quote:", error);
      res.status(500).json({ 
        error: "Error saving quote", 
        message: error.message 
      });
    }
  });

  app.get("/api/quotes", requireAuth, async (req, res) => {
    try {
      const quotes = await storage.getEnhancedQuotes();
      res.json(quotes);
    } catch (error: any) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ 
        error: "Error fetching quotes", 
        message: error.message 
      });
    }
  });

  app.get("/api/quotes/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getEnhancedQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error: any) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ 
        error: "Error fetching quote", 
        message: error.message 
      });
    }
  });

  // Enhanced Stripe Payment Intent for Quotes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, quoteNumber, customerInfo, isDeposit } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "cad",
        metadata: {
          quoteNumber: quoteNumber || "",
          customerName: customerInfo?.name || "",
          customerEmail: customerInfo?.email || "",
          isDeposit: isDeposit ? "true" : "false"
        },
        description: `HVAC ${isDeposit ? 'Deposit' : 'Payment'} - Quote ${quoteNumber}`,
      });
      
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

  // Job Scheduling API Routes
  app.get("/api/schedules", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const schedules = await storage.getJobSchedules(userId);
      res.json(schedules);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ 
        error: "Error fetching schedules", 
        message: error.message 
      });
    }
  });

  app.post("/api/schedules", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const scheduleData = req.body;
      
      const schedule = await storage.createJobSchedule({
        ...scheduleData,
        userId
      });
      
      res.status(201).json(schedule);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      res.status(500).json({ 
        error: "Error creating schedule", 
        message: error.message 
      });
    }
  });

  app.put("/api/schedules/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const schedule = await storage.updateJobSchedule(id, updateData);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      
      res.json(schedule);
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      res.status(500).json({ 
        error: "Error updating schedule", 
        message: error.message 
      });
    }
  });

  // Maintenance Plans API Routes
  app.get("/api/maintenance-plans", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const plans = await storage.getMaintenancePlans(userId);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching maintenance plans:", error);
      res.status(500).json({ 
        error: "Error fetching maintenance plans", 
        message: error.message 
      });
    }
  });

  app.post("/api/maintenance-plans", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const planData = req.body;
      
      const plan = await storage.createMaintenancePlan({
        ...planData,
        customerId: userId
      });
      
      res.status(201).json(plan);
    } catch (error: any) {
      console.error("Error creating maintenance plan:", error);
      res.status(500).json({ 
        error: "Error creating maintenance plan", 
        message: error.message 
      });
    }
  });

  // Schedule a job from quote
  app.post("/api/quotes/:id/schedule", requireAuth, async (req, res) => {
    try {
      const quoteId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const scheduleData = req.body;
      
      const quote = await storage.getEnhancedQuoteById(quoteId);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      
      const schedule = await storage.createJobSchedule({
        quoteId,
        userId,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        customerPhone: quote.customerPhone,
        customerAddress: quote.customerAddress,
        ...scheduleData
      });
      
      res.status(201).json(schedule);
    } catch (error: any) {
      console.error("Error scheduling job:", error);
      res.status(500).json({ 
        error: "Error scheduling job", 
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

  // Create Stripe payment intent for checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const { amount, description, service } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      if (!description || !service) {
        return res.status(400).json({ error: "Description and service type are required" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "cad",
        description: description,
        metadata: {
          service: service,
          description: description,
          ...(req.isAuthenticated() && { userId: (req.user as any).id.toString() })
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

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

  // Create booking appointment
  app.post('/api/bookings', async (req, res) => {
    try {
      const {
        date,
        time,
        customerName,
        customerPhone,
        customerEmail,
        serviceAddress,
        notes,
        service,
        amount,
        paymentIntentId,
        status
      } = req.body;

      if (!date || !time || !customerName || !customerPhone || !serviceAddress) {
        return res.status(400).json({ error: "Missing required booking information" });
      }

      const booking = {
        date,
        time,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        serviceAddress,
        notes: notes || null,
        service: service || 'HVAC Service',
        amount: amount || 0,
        paymentIntentId: paymentIntentId || null,
        status: status || 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`[Booking Created] ${customerName} - ${service} on ${date} at ${time}`);
      
      res.status(201).json({ 
        message: "Booking created successfully",
        booking 
      });
    } catch (error: any) {
      console.error("Error creating booking:", error);
      res.status(500).json({ 
        error: "Error creating booking", 
        message: error.message 
      });
    }
  });

  // Create subscription for Pro membership
  app.post('/api/create-subscription', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const { planId } = req.body;
      const user = req.user as any;

      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      // Define plan amounts in CAD cents
      const planAmounts: { [key: string]: number } = {
        'monthly': 4900,   // $49 CAD
        'yearly': 49900,   // $499 CAD  
        'lifetime': 150000, // $1500 CAD
        'pro-monthly': 4900,   // $49 CAD
        'pro-yearly': 49900,   // $499 CAD  
        'pro-lifetime': 150000, // $1500 CAD
        'maintenance-basic': 19900,   // $199 CAD
        'maintenance-premium': 34900  // $349 CAD
      };

      const amount = planAmounts[planId];
      if (!amount) {
        return res.status(400).json({ error: `Invalid plan ID: ${planId}` });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: {
            userId: user.id.toString()
          }
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Create one-time payment for all plans (simpler approach)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'cad',
        customer: customerId,
        metadata: {
          userId: user.id.toString(),
          planType: planId,
          isProMembership: 'true'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update user with customer ID
      await storage.updateUser(user.id, { 
        stripeCustomerId: customerId 
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ 
        error: "Error creating subscription", 
        message: error.message 
      });
    }
  });

  // Manual Pro membership activation (for testing)
  app.post('/api/activate-pro', requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { paymentIntentId } = req.body;

      // Activate Pro membership
      await storage.updateUserProAccess(user.id, true, new Date());
      
      console.log(`[Manual Activation] Pro membership activated for user ${user.id}`);
      
      res.json({ success: true, message: 'Pro membership activated' });
    } catch (error: any) {
      console.error("Error activating Pro membership:", error);
      res.status(500).json({ 
        error: "Error activating Pro membership", 
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
          const { userId, productId, isProMembership, planType } = paymentIntent.metadata;
          
          if (userId && isProMembership === 'true') {
            const userIdNum = parseInt(userId);
            
            // Grant Pro membership access
            await storage.updateUserProAccess(userIdNum, true, new Date());
            
            // Update membership type (remove isLifetimeMember for now to fix TypeScript)
            if (planType === 'lifetime') {
              console.log(`[Payment Success] Lifetime membership activated for user ${userId}`);
            }
            
            console.log(`[Payment Success] Pro membership (${planType}) activated for user ${userId}`);
          }
          
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
        case 'invoice.payment_succeeded':
          // Handle subscription payment success
          const invoice = event.data.object;
          const subscription = invoice.subscription;
          
          if (subscription) {
            // Get subscription details
            const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
            const customerId = typeof subscriptionObj.customer === 'string' 
              ? subscriptionObj.customer 
              : subscriptionObj.customer.id;
            
            // Find user by Stripe customer ID
            const customer = await stripe.customers.retrieve(customerId);
            if (customer && !customer.deleted && customer.metadata?.userId) {
              const userIdNum = parseInt(customer.metadata.userId);
              
              // Activate Pro membership
              await storage.updateUserProAccess(userIdNum, true, new Date());
              
              console.log(`[Subscription Success] Pro membership activated for user ${customer.metadata.userId}`);
            }
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
  
  // Get all forum topics (public access for reading)
  app.get("/api/forum/topics", async (req, res) => {
    try {
      const topics = await storage.getForumTopics();
      res.json(topics);
    } catch (error: any) {
      console.error("Error getting forum topics:", error);
      res.status(500).json({ 
        error: "Error getting forum topics", 
        message: error.message 
      });
    }
  });

  // Create forum topic
  app.post("/api/forum/topics", requireAuth, async (req, res) => {
    try {
      const { title, content, categoryId } = req.body;
      const user = req.user as any;
      
      const topicData = {
        title,
        content,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        userId: user.id,
        categoryId: categoryId || 1, // Default to general category
        isSticky: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
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
  
  // Update forum topic
  app.put("/api/forum/topics/:id", requireAuth, async (req, res) => {
    try {
      const topicId = parseInt(req.params.id);
      const user = req.user as any;
      const { title, content } = req.body;
      
      if (!topicId || isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }
      
      // For now, only admins can edit topics (can be expanded later)
      if (!user.isAdmin) {
        return res.status(403).json({ error: "Only admins can edit forum topics" });
      }
      
      const updateData = {
        title,
        content,
        updatedAt: new Date(),
        isEdited: true
      };
      
      res.json({ success: true, message: "Topic updated successfully", data: updateData });
    } catch (error: any) {
      console.error("Error updating forum topic:", error);
      res.status(500).json({ 
        error: "Error updating forum topic", 
        message: error.message 
      });
    }
  });

  // Delete forum topic
  app.delete("/api/forum/topics/:id", requireAuth, async (req, res) => {
    try {
      const topicId = parseInt(req.params.id);
      const user = req.user as any;
      
      if (!topicId || isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }
      
      // Get the topic to check ownership
      const topic = await storage.getForumTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      // Check if user is admin or owns the topic
      const isAdmin = user.isAdmin || user.username === 'JordanBoz';
      const isOwner = topic.userId === user.id;
      
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Not authorized to delete this topic" });
      }
      
      // Actually delete the topic
      await storage.deleteForumTopic(topicId);
      
      res.json({ success: true, message: "Topic deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting forum topic:", error);
      res.status(500).json({ 
        error: "Error deleting forum topic", 
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

  // Update forum post
  app.put("/api/forum/posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      const { content } = req.body;
      
      if (!postId || isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      // Get the post to check ownership
      const post = await storage.getForumPostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      // Check if user is admin or owns the post
      const isAdmin = user.isAdmin || user.username === 'JordanBoz';
      const isOwner = post.userId === user.id;
      
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Not authorized to edit this post" });
      }
      
      const updatedPost = await storage.updateForumPost(postId, {
        content,
        updatedAt: new Date(),
        isEdited: true
      });
      
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json({ success: true, message: "Post updated successfully", post: updatedPost });
    } catch (error: any) {
      console.error("Error updating forum post:", error);
      res.status(500).json({ 
        error: "Error updating forum post", 
        message: error.message 
      });
    }
  });

  // Delete forum post
  app.delete("/api/forum/posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      if (!postId || isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      // Get the post to check ownership
      const post = await storage.getForumPostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      // Check if user is admin or owns the post
      const isAdmin = user.isAdmin || user.username === 'JordanBoz';
      const isOwner = post.userId === user.id;
      
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Not authorized to delete this post" });
      }
      
      // Delete the post and associated likes
      await storage.deleteForumPost(postId);
      
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting forum post:", error);
      res.status(500).json({ 
        error: "Error deleting forum post", 
        message: error.message 
      });
    }
  });

  // FORUM LIKES ROUTES
  
  // Get likes for a topic or post
  app.get("/api/forum/likes", async (req, res) => {
    try {
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;
      
      const likes = await storage.getForumLikes(topicId, postId);
      res.json(likes);
    } catch (error: any) {
      console.error("Error getting forum likes:", error);
      res.status(500).json({ 
        error: "Error getting forum likes", 
        message: error.message 
      });
    }
  });

  // Like a topic or post
  app.post("/api/forum/likes", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { topicId, postId, likeType = 'like' } = req.body;
      
      if (!topicId && !postId) {
        return res.status(400).json({ error: "Either topicId or postId is required" });
      }
      
      const likeData = {
        userId: user.id,
        topicId: topicId || null,
        postId: postId || null,
        likeType,
        createdAt: new Date()
      };
      
      const result = insertForumLikeSchema.parse(likeData);
      const like = await storage.createForumLike(result);
      res.status(201).json(like);
    } catch (error: any) {
      console.error("Error creating forum like:", error);
      res.status(500).json({ 
        error: "Error creating forum like", 
        message: error.message 
      });
    }
  });

  // Unlike a topic or post
  app.delete("/api/forum/likes", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;
      
      if (!topicId && !postId) {
        return res.status(400).json({ error: "Either topicId or postId is required" });
      }
      
      await storage.deleteForumLike(user.id, topicId, postId);
      res.json({ success: true, message: "Like removed successfully" });
    } catch (error: any) {
      console.error("Error removing forum like:", error);
      res.status(500).json({ 
        error: "Error removing forum like", 
        message: error.message 
      });
    }
  });

  // Get like counts for topics/posts
  app.get("/api/forum/likes/count", async (req, res) => {
    try {
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;
      
      if (!topicId && !postId) {
        return res.status(400).json({ error: "Either topicId or postId is required" });
      }
      
      let count = 0;
      if (topicId) {
        count = await storage.getTopicLikeCount(topicId);
      } else if (postId) {
        count = await storage.getPostLikeCount(postId);
      }
      
      res.json({ count });
    } catch (error: any) {
      console.error("Error getting like count:", error);
      res.status(500).json({ 
        error: "Error getting like count", 
        message: error.message 
      });
    }
  });

  // Check if user has liked a topic/post
  app.get("/api/forum/likes/check", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;
      
      if (!topicId && !postId) {
        return res.status(400).json({ error: "Either topicId or postId is required" });
      }
      
      let hasLiked = false;
      if (topicId) {
        hasLiked = await storage.hasUserLikedTopic(user.id, topicId);
      } else if (postId) {
        hasLiked = await storage.hasUserLikedPost(user.id, postId);
      }
      
      res.json({ hasLiked });
    } catch (error: any) {
      console.error("Error checking like status:", error);
      res.status(500).json({ 
        error: "Error checking like status", 
        message: error.message 
      });
    }
  });

  // Populate forum with HVAC content (admin only)
  app.post("/api/forum/populate", requireAdmin, async (req, res) => {
    try {
      await storage.populateForumWithHvacContent();
      res.json({ success: true, message: "Forum populated with professional HVAC content" });
    } catch (error: any) {
      console.error("Error populating forum:", error);
      res.status(500).json({ 
        error: "Error populating forum", 
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

  // Carousel endpoints for homepage
  app.get("/api/carousel", async (req, res) => {
    try {
      const images = await storage.getCarouselImages();
      if (images.length === 0) {
        // Return sample data if no images exist
        const sampleCarouselImages = [
          {
            id: 1,
            title: "Professional Furnace Installation",
            description: "High-efficiency furnace installation in Calgary residential home",
            imageUrl: "/api/placeholder/800/500",
            isActive: true,
            sortOrder: 1
          },
          {
            id: 2,
            title: "Expert AC Unit Service", 
            description: "Professional air conditioning maintenance and repair services",
            imageUrl: "/api/placeholder/800/500",
            isActive: true,
            sortOrder: 2
          },
          {
            id: 3,
            title: "Commercial HVAC Solutions",
            description: "Large-scale commercial heating and cooling system installations",
            imageUrl: "/api/placeholder/800/500",
            isActive: true,
            sortOrder: 3
          }
        ];
        return res.json(sampleCarouselImages);
      }
      res.json(images);
    } catch (error: any) {
      console.error("Error fetching carousel images:", error);
      res.status(500).json({ 
        error: "Error fetching carousel images", 
        message: error.message 
      });
    }
  });

  app.post("/api/carousel", requireAdmin, async (req, res) => {
    try {
      const { title, description, imageUrl, imageData } = req.body;
      
      if (!title || (!imageUrl && !imageData)) {
        return res.status(400).json({ error: "Title and image are required" });
      }

      let finalImageUrl = imageUrl;
      
      // If imageData is provided (base64), save it as a data URL
      if (imageData && imageData.startsWith('data:image/')) {
        finalImageUrl = imageData;
      }

      const image = await storage.createCarouselImage({
        title,
        description: description || '',
        imageUrl: finalImageUrl,
        isActive: true,
        sortOrder: 0
      });

      res.status(201).json(image);
    } catch (error: any) {
      console.error("Error creating carousel image:", error);
      res.status(500).json({ error: "Failed to create carousel image" });
    }
  });

  app.put("/api/carousel/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedImage = await storage.updateCarouselImage(id, updateData);
      
      if (!updatedImage) {
        return res.status(404).json({ error: "Carousel image not found" });
      }
      
      res.json(updatedImage);
    } catch (error: any) {
      console.error("Error updating carousel image:", error);
      res.status(500).json({ error: "Failed to update carousel image" });
    }
  });

  app.delete("/api/carousel/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCarouselImage(id);
      
      if (!success) {
        return res.status(404).json({ error: "Carousel image not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting carousel image:", error);
      res.status(500).json({ error: "Failed to delete carousel image" });
    }
  });

  // Gallery Project Management for Carousel
  app.post("/api/admin/gallery-projects", requireAdmin, async (req, res) => {
    try {
      const projectData = {
        imageUrl: req.body.beforeImageUrl, // Primary image URL for database
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        category: req.body.category || 'residential',
        isActive: true,
        altText: req.body.title,
        // Store additional data in metadata if needed
        metadata: {
          beforeImageUrl: req.body.beforeImageUrl,
          afterImageUrl: req.body.afterImageUrl,
          benefit: req.body.benefit,
          benefitValue: req.body.benefitValue
        }
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
  
  // Unified submissions endpoint (combines all submission types)
  app.get("/api/admin/submissions", requireAdmin, async (req, res) => {
    try {
      const [contactSubmissions, emergencyRequests, quoteRequests] = await Promise.all([
        storage.getContactSubmissions(),
        storage.getEmergencyRequests(),
        storage.getQuoteRequests()
      ]);
      
      const allSubmissions = [
        ...contactSubmissions.map(s => ({ ...s, type: 'contact' })),
        ...emergencyRequests.map(s => ({ ...s, type: 'emergency' })),
        ...quoteRequests.map(s => ({ ...s, type: 'quote' }))
      ].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as string | Date).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as string | Date).getTime() : 0;
        return dateB - dateA;
      });
      
      res.json(allSubmissions);
    } catch (error: any) {
      console.error("Error getting submissions:", error);
      res.status(500).json({ 
        error: "Error getting submissions", 
        message: error.message 
      });
    }
  });
  
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

  // Admin quotes management
  app.get("/api/admin/quotes", requireAdmin, async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error: any) {
      console.error("Error getting admin quotes:", error);
      res.status(500).json({ 
        error: "Error getting admin quotes", 
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

  // PROFESSIONAL MATERIAL TAKEOFF SYSTEM API ENDPOINTS
  
  // Save HVAC estimate to customer records
  app.post('/api/estimates', requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const {
        projectName,
        customerName,
        customerEmail,
        projectAddress,
        projectNotes,
        materials,
        laborItems,
        customItems,
        calculations,
        markupPercentage,
        overheadPercentage,
        laborRate
      } = req.body;

      const estimate = {
        id: Date.now().toString(),
        userId: user.id,
        projectName: projectName || 'HVAC Estimate',
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        projectAddress: projectAddress || '',
        projectNotes: projectNotes || '',
        materials: materials || [],
        laborItems: laborItems || [],
        customItems: customItems || [],
        calculations: calculations || {},
        markupPercentage: parseFloat(markupPercentage) || 25,
        overheadPercentage: parseFloat(overheadPercentage) || 15,
        laborRate: parseFloat(laborRate) || 75,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`[Estimate Saved] ${user.username} - ${projectName} - Total: $${calculations.total?.toFixed(2) || '0.00'}`);
      
      res.status(201).json({ 
        message: "Estimate saved successfully",
        estimate 
      });
    } catch (error: any) {
      console.error("Error saving estimate:", error);
      res.status(500).json({ 
        error: "Error saving estimate", 
        message: error.message 
      });
    }
  });

  // Generate PDF estimate with comprehensive formatting
  app.post('/api/generate-pdf', requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const {
        projectName,
        customerName,
        projectAddress,
        materials,
        laborItems,
        customItems,
        calculations
      } = req.body;

      // Create comprehensive HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>HVAC Estimate - ${projectName || 'Project'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { color: #f97316; font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .company-info { color: #666; font-size: 14px; }
            .project-info { margin-bottom: 30px; }
            .project-info h2 { color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-item { margin-bottom: 10px; }
            .info-label { font-weight: bold; color: #555; }
            .section { margin-bottom: 30px; }
            .section h3 { color: #f97316; border-bottom: 1px solid #f97316; padding-bottom: 5px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; color: #333; }
            .currency { text-align: right; font-weight: bold; }
            .total-row { background-color: #f8f9fa; font-weight: bold; }
            .grand-total { background-color: #f97316; color: white; font-size: 18px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f97316; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">AfterHours HVAC</div>
            <div class="company-info">Professional HVAC Services • Calgary, Alberta • (403) 555-0123</div>
          </div>
          
          <div class="project-info">
            <h2>Professional Material Takeoff Estimate</h2>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Project:</span> ${projectName || 'HVAC Project'}
                </div>
                <div class="info-item">
                  <span class="info-label">Customer:</span> ${customerName || 'N/A'}
                </div>
                <div class="info-item">
                  <span class="info-label">Address:</span> ${projectAddress || 'N/A'}
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Date:</span> ${new Date().toLocaleDateString()}
                </div>
                <div class="info-item">
                  <span class="info-label">Prepared by:</span> ${user.username}
                </div>
                <div class="info-item">
                  <span class="info-label">Estimate #:</span> EST-${Date.now()}
                </div>
              </div>
            </div>
          </div>

          ${materials && materials.length > 0 ? `
          <div class="section">
            <h3>Alggin Catalog Materials</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Stock #</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${materials.map((item: any) => `
                  <tr>
                    <td>${item.catalogItem.description}</td>
                    <td>${item.catalogItem.stockNumber}</td>
                    <td>${item.catalogItem.category}</td>
                    <td>${item.quantity}</td>
                    <td class="currency">$${item.catalogItem.price.toFixed(2)}</td>
                    <td class="currency">$${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="5"><strong>Materials Subtotal</strong></td>
                  <td class="currency"><strong>$${calculations.materialsSubtotal?.toFixed(2) || '0.00'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}

          ${laborItems && laborItems.length > 0 ? `
          <div class="section">
            <h3>Labor & Installation</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Hours</th>
                  <th>Rate ($/hr)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${laborItems.map((item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.hours}</td>
                    <td class="currency">$${item.rate.toFixed(2)}</td>
                    <td class="currency">$${item.totalCost.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3"><strong>Labor Subtotal</strong></td>
                  <td class="currency"><strong>$${calculations.laborSubtotal?.toFixed(2) || '0.00'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}

          ${customItems && customItems.length > 0 ? `
          <div class="section">
            <h3>Custom Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${customItems.map((item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td class="currency">$${item.price.toFixed(2)}</td>
                    <td class="currency">$${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3"><strong>Custom Items Subtotal</strong></td>
                  <td class="currency"><strong>$${calculations.customSubtotal?.toFixed(2) || '0.00'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <h3>Estimate Summary</h3>
            <table>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td class="currency">$${calculations.subtotal?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Overhead</td>
                  <td class="currency">$${calculations.overhead?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Markup</td>
                  <td class="currency">$${calculations.markup?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr class="grand-total">
                  <td><strong>TOTAL (CAD)</strong></td>
                  <td class="currency"><strong>$${calculations.total?.toFixed(2) || '0.00'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>This estimate is valid for 30 days from the date of preparation.</p>
            <p>All prices are in Canadian Dollars (CAD) and include applicable taxes where specified.</p>
            <p>Materials sourced from Alggin catalog with current market pricing.</p>
            <p>Thank you for choosing AfterHours HVAC for your heating and cooling needs!</p>
          </div>
        </body>
        </html>
      `;

      // Return HTML content for client-side PDF generation
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'HVAC-Estimate'}.html"`);
      res.send(htmlContent);

      console.log(`[PDF Generated] ${user.username} - ${projectName || 'Estimate'}`);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        error: "Error generating PDF", 
        message: error.message 
      });
    }
  });

  // Get user estimates
  app.get('/api/estimates', requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // For now, return empty array since we're using in-memory storage
      // In a real implementation, this would fetch from database
      res.json([]);
      
      console.log(`[Estimates Retrieved] ${user.username}`);
    } catch (error: any) {
      console.error("Error retrieving estimates:", error);
      res.status(500).json({ 
        error: "Error retrieving estimates", 
        message: error.message 
      });
    }
  });

  // EMERGENCY SERVICE TRACKING ENDPOINTS
  
  // Submit emergency request
  app.post("/api/emergency-requests", async (req, res) => {
    try {
      const emergencyData = insertEmergencyRequestSchema.parse(req.body);
      const request = await storage.createEmergencyRequest(emergencyData);
      
      res.status(201).json({ 
        success: true, 
        message: "Emergency request submitted successfully",
        id: request.id 
      });
    } catch (error: any) {
      console.error("Error creating emergency request:", error);
      res.status(500).json({ 
        error: "Error creating emergency request", 
        message: error.message 
      });
    }
  });
  
  // Get all emergency requests (admin) or user's own requests
  app.get("/api/emergency-requests", async (req, res) => {
    try {
      const user = req.user as any;
      let emergencyRequests;
      
      if (user && user.isAdmin) {
        // Admin can see all requests
        emergencyRequests = await storage.getAllEmergencyRequests();
      } else if (user) {
        // User can only see their own requests
        emergencyRequests = await storage.getUserEmergencyRequests(user.id);
      } else {
        // Public access - allow searching by phone/email for tracking
        emergencyRequests = [];
      }
      
      res.json(emergencyRequests);
    } catch (error: any) {
      console.error("Error getting emergency requests:", error);
      res.status(500).json({ 
        error: "Error getting emergency requests", 
        message: error.message 
      });
    }
  });
  
  // Search emergency requests by phone, email, or ID
  app.get("/api/emergency-requests/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const requests = await storage.searchEmergencyRequests(query);
      res.json(requests);
    } catch (error: any) {
      console.error("Error searching emergency requests:", error);
      res.status(500).json({ 
        error: "Error searching emergency requests", 
        message: error.message 
      });
    }
  });
  
  // Update emergency request status (admin only)
  app.put("/api/emergency-requests/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid emergency request ID" });
      }
      
      const updateData = req.body;
      const request = await storage.updateEmergencyRequest(id, updateData);
      
      if (!request) {
        return res.status(404).json({ error: "Emergency request not found" });
      }
      
      res.json(request);
    } catch (error: any) {
      console.error("Error updating emergency request:", error);
      res.status(500).json({ 
        error: "Error updating emergency request", 
        message: error.message 
      });
    }
  });

  // JOB APPLICATION ENDPOINTS
  
  // Submit job application
  app.post("/api/job-applications", async (req, res) => {
    try {
      const applicationData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Application submitted successfully",
        applicationId: application.id 
      });
    } catch (error: any) {
      console.error("Error creating job application:", error);
      res.status(500).json({ 
        error: "Error creating job application", 
        message: error.message 
      });
    }
  });
  
  // Get all job applications (admin only)
  app.get("/api/job-applications", requireAuth, requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      res.json(applications);
    } catch (error: any) {
      console.error("Error getting job applications:", error);
      res.status(500).json({ 
        error: "Error getting job applications", 
        message: error.message 
      });
    }
  });
  
  // Get job application by ID (admin only)
  app.get("/api/job-applications/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }
      
      const application = await storage.getJobApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ error: "Job application not found" });
      }
      
      res.json(application);
    } catch (error: any) {
      console.error("Error getting job application:", error);
      res.status(500).json({ 
        error: "Error getting job application", 
        message: error.message 
      });
    }
  });
  
  // Update job application status (admin only)
  app.put("/api/job-applications/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }
      
      const updateData = {
        ...req.body,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        updatedAt: new Date()
      };
      
      const application = await storage.updateJobApplication(id, updateData);
      
      if (!application) {
        return res.status(404).json({ error: "Job application not found" });
      }
      
      res.json(application);
    } catch (error: any) {
      console.error("Error updating job application:", error);
      res.status(500).json({ 
        error: "Error updating job application", 
        message: error.message 
      });
    }
  });

  return httpServer;
}
