import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication Tables
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  role: text("role").default("user"),
  userType: text("user_type").default("customer"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  hasProAccess: integer("has_pro_access", { mode: "boolean" }).default(false),
  hasPro: integer("has_pro", { mode: "boolean" }).default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  proAccessGrantedAt: text("pro_access_granted_at"),
  membershipType: text("membership_type"),
  membershipExpiresAt: text("membership_expires_at"),
  isLifetimeMember: integer("is_lifetime_member", { mode: "boolean" }).default(false),
  profileImageUrl: text("profile_image_url"),
  phoneVerified: integer("phone_verified", { mode: "boolean" }).default(false),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationExpiresAt: text("phone_verification_expires_at"),
  phoneVerifiedAt: text("phone_verified_at"),
  corporateAccountId: integer("corporate_account_id"),
  isCorporateAdmin: integer("is_corporate_admin", { mode: "boolean" }).default(false),
  maxSessions: integer("max_sessions").default(1),
  deviceFingerprint: text("device_fingerprint"),
  lastDeviceFingerprint: text("last_device_fingerprint"),
  suspiciousLoginDetected: integer("suspicious_login_detected", { mode: "boolean" }).default(false),
  accountLocked: integer("account_locked", { mode: "boolean" }).default(false),
  lockedAt: text("locked_at"),
  lockReason: text("lock_reason"),
  createdAt: text("created_at"),
  lastLogin: text("last_login"),
});

// Simple tables for basic functionality
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  formData: text("form_data"), // JSON string
  source: text("source"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const emergencyRequests = sqliteTable("emergency_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"),
  status: text("status").default("pending"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const quoteRequests = sqliteTable("quote_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  estimatedCost: real("estimated_cost"),
  status: text("status").default("pending"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
});

export const serviceBookings = sqliteTable("service_bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  serviceType: text("service_type").notNull(),
  scheduledDate: text("scheduled_date"),
  status: text("status").default("scheduled"),
  cost: real("cost"),
  paymentStatus: text("payment_status").default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const jobApplications = sqliteTable("job_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position"),
  experience: text("experience"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status").default("pending"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const hvacEquipment = sqliteTable("hvac_equipment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"),
  brand: text("brand"),
  model: text("model"),
  price: real("price"),
  description: text("description"),
  specifications: text("specifications"), // JSON string
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const enhancedQuotes = sqliteTable("enhanced_quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  quoteData: text("quote_data"), // JSON string
  totalCost: real("total_cost"),
  status: text("status").default("draft"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at"),
});

export const hvacMaterials = sqliteTable("hvac_materials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"),
  unitPrice: real("unit_price"),
  unit: text("unit"),
  supplier: text("supplier"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const hvacAccessories = sqliteTable("hvac_accessories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"),
  price: real("price"),
  description: text("description"),
  compatibility: text("compatibility"), // JSON array as string
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const proCalculatorQuotes = sqliteTable("pro_calculator_quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  calculatorType: text("calculator_type"),
  inputData: text("input_data"), // JSON string
  results: text("results"), // JSON string
  totalCost: real("total_cost"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const jobSchedules = sqliteTable("job_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  serviceBookingId: integer("service_booking_id"),
  technicianId: integer("technician_id"),
  scheduledStart: text("scheduled_start"),
  scheduledEnd: text("scheduled_end"),
  actualStart: text("actual_start"),
  actualEnd: text("actual_end"),
  status: text("status").default("scheduled"),
  notes: text("notes"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const maintenancePlans = sqliteTable("maintenance_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id"),
  planType: text("plan_type").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  cost: real("cost"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  paymentStatus: text("payment_status").default("pending"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

// Blog and content tables
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  author: text("author"),
  tags: text("tags"), // JSON array as string
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role"),
  experience: text("experience"),
  specialties: text("specialties"), // JSON array as string
  photoUrl: text("photo_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests);
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests);
export const insertServiceBookingSchema = createInsertSchema(serviceBookings);
export const insertJobApplicationSchema = createInsertSchema(jobApplications);
export const insertHvacEquipmentSchema = createInsertSchema(hvacEquipment);
export const insertEnhancedQuoteSchema = createInsertSchema(enhancedQuotes);
export const insertHvacMaterialsSchema = createInsertSchema(hvacMaterials);
export const insertHvacAccessoriesSchema = createInsertSchema(hvacAccessories);
export const insertProCalculatorQuoteSchema = createInsertSchema(proCalculatorQuotes);
export const insertJobScheduleSchema = createInsertSchema(jobSchedules);
export const insertMaintenancePlanSchema = createInsertSchema(maintenancePlans);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertTeamMemberSchema = createInsertSchema(teamMembers);

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type ServiceBooking = typeof serviceBookings.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type HvacEquipment = typeof hvacEquipment.$inferSelect;
export type EnhancedQuote = typeof enhancedQuotes.$inferSelect;
export type HvacMaterial = typeof hvacMaterials.$inferSelect;
export type HvacAccessory = typeof hvacAccessories.$inferSelect;
export type ProCalculatorQuote = typeof proCalculatorQuotes.$inferSelect;
export type JobSchedule = typeof jobSchedules.$inferSelect;
export type MaintenancePlan = typeof maintenancePlans.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
