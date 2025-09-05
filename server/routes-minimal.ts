import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import type { Express, Request, Response } from "express";
import { db } from "./db";
import { users, contactSubmissions, blogPosts, teamMembers } from "@shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import path from "path";
import Stripe from 'stripe';

const scryptAsync = promisify(scrypt);

// Debug Stripe environment variable
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0);

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
}) : null;

export function registerRoutes(app: Express) {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Contact form submission
  app.post("/api/admin/contacts", async (req, res) => {
    try {
      const { name, email, phone, message, source } = req.body;
      
      const result = await db.insert(contactSubmissions).values({
        name,
        email,
        phone: phone || null,
        message: message || null,
        source: source || 'website',
        createdAt: new Date().toISOString(),
        isRead: false
      }).returning();

      res.json({ success: true, id: result[0].id });
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({ error: 'Failed to submit contact form' });
    }
  });

  // Get contact submissions
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
      res.json(contacts);
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ error: 'Failed to get contacts' });
    }
  });

  // Blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
      res.json(posts);
    } catch (error) {
      console.error('Get blog posts error:', error);
      res.status(500).json({ error: 'Failed to get blog posts' });
    }
  });

  app.post("/api/admin/blog-posts", async (req, res) => {
    try {
      const { title, content, author, tags, published } = req.body;
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const result = await db.insert(blogPosts).values({
        title,
        slug,
        content,
        author: author || 'Admin',
        tags: tags || null,
        publishedAt: published ? new Date().toISOString() : null,
        createdAt: new Date().toISOString()
      }).returning();

      res.json({ success: true, post: result[0] });
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  });

  // Team members
  app.get("/api/team-members", async (req, res) => {
    try {
      const members = await db.select().from(teamMembers);
      res.json(members);
    } catch (error) {
      console.error('Get team members error:', error);
      res.status(500).json({ error: 'Failed to get team members' });
    }
  });

  app.post("/api/admin/team-members", async (req, res) => {
    try {
      const { name, role, experience, specialties, photoUrl } = req.body;
      
      const result = await db.insert(teamMembers).values({
        name,
        role,
        experience: experience || null,
        specialties: specialties || null,
        photoUrl: photoUrl || null,
        createdAt: new Date().toISOString()
      }).returning();

      res.json({ success: true, member: result[0] });
    } catch (error) {
      console.error('Create team member error:', error);
      res.status(500).json({ error: 'Failed to create team member' });
    }
  });

  // Stripe checkout
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      const { priceId, quantity = 1, metadata = {} } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: metadata,
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // User authentication (basic)
  app.post("/api/login", async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      
      // Use raw SQL query to avoid schema issues
      const userQuery = db.$client.prepare("SELECT * FROM users WHERE email = ? OR username = ?");
      const user = userQuery.get(usernameOrEmail, usernameOrEmail) as any;
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const [hash, salt] = user.password.split('.');
      const hashBuffer = await scryptAsync(password, salt, 64) as Buffer;
      const keyBuffer = Buffer.from(hash, 'hex');
      const match = timingSafeEqual(hashBuffer, keyBuffer);

      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set session (simplified)
      (req as any).session = { userId: user.id, email: user.email };
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    const session = (req as any).session;
    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const userQuery = db.$client.prepare("SELECT id, email, username, role FROM users WHERE id = ?");
      const user = userQuery.get(session.userId) as any;
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // Admin endpoints
  app.get("/api/admin/users", (req, res) => {
    try {
      const usersQuery = db.$client.prepare("SELECT id, email, username, role, createdAt FROM users");
      const allUsers = usersQuery.all();
      res.json(allUsers);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  app.get("/api/admin/job-applications", (req, res) => {
    res.json([]); // Placeholder - no job applications table in minimal schema
  });

  app.get("/api/admin/bookings", (req, res) => {
    res.json([]); // Placeholder - no bookings table in minimal schema
  });

  app.get("/api/admin/emergency-requests", (req, res) => {
    res.json([]); // Placeholder - no emergency requests table in minimal schema
  });

  app.get("/api/admin/forum-posts", (req, res) => {
    res.json([]); // Placeholder - no forum posts table in minimal schema
  });

  app.get("/api/admin/blog", (req, res) => {
    try {
      const posts = db.select().from(blogPosts).all();
      res.json(posts);
    } catch (error) {
      console.error('Get blog posts error:', error);
      res.status(500).json({ error: 'Failed to get blog posts' });
    }
  });

  app.post("/api/admin/blog", async (req, res) => {
    try {
      const { title, content, author, tags, published } = req.body;
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const result = await db.insert(blogPosts).values({
        title,
        slug,
        content,
        author: author || 'Admin',
        tags: tags || null,
        publishedAt: published ? new Date().toISOString() : null,
        createdAt: new Date().toISOString()
      }).returning();

      res.json({ success: true, post: result[0] });
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  });

  app.get("/api/admin/team-members", (req, res) => {
    try {
      const members = db.select().from(teamMembers).all();
      res.json(members);
    } catch (error) {
      console.error('Get team members error:', error);
      res.status(500).json({ error: 'Failed to get team members' });
    }
  });
}
