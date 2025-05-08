import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Initialize Stripe with the provided secret key
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Payment functionality will be limited.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          error: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable." 
        });
      }

      const { amount, service } = req.body;
      
      // Validate the amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      // Create a payment intent with the amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service,
          // Include additional metadata for pro calculator access if applicable
          isProCalculator: service === "pro" ? "true" : "false"
        }
      });
      
      // Return the client secret to the client
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creating payment intent", 
        message: error.message 
      });
    }
  });

  // Check if user has Pro Calculator access
  app.get("/api/check-pro-access", async (req, res) => {
    try {
      // In a real implementation with authentication, we would get userId from session
      // For demonstration, we're using a query parameter
      const userId = parseInt(req.query.userId as string);
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
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
  
  // Update user's Pro Calculator access status
  app.post("/api/update-pro-access", async (req, res) => {
    try {
      // In a real implementation with authentication, we would get userId from session
      // For demonstration, we're using a query parameter
      const userId = parseInt(req.query.userId as string);
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
          
          // If this was a Pro Calculator purchase, grant access
          if (paymentIntent.metadata.isProCalculator === 'true') {
            // In a real app, we would update the user's record in the database
            console.log(`[Payment Success] Pro Calculator access for payment ${paymentIntent.id}`);
            
            // In a real app with real auth, we would do:
            // await storage.updateUserProAccess(userId, true, new Date());
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

  const httpServer = createServer(app);

  return httpServer;
}
