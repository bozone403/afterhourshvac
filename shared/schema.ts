import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  role: text("role").default("user"), // user, admin, moderator
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  hasProAccess: boolean("has_pro_access").default(false),
  hasPro: boolean("has_pro").default(false),
  isAdmin: boolean("is_admin").default(false),
  proAccessGrantedAt: timestamp("pro_access_granted_at"),
  membershipType: text("membership_type"), // 'monthly', 'yearly', 'lifetime'
  membershipExpiresAt: timestamp("membership_expires_at"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Product Access Tracking for different systems
export const productAccess = pgTable("product_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // for time-limited access
  active: boolean("active").default(true),
  paymentIntentId: text("payment_intent_id"),
});

// Products that can be purchased/accessed
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // furnace, ac, pro_tools, maintenance
  tier: text("tier"), // economy, mid_range, premium
  features: jsonb("features"), // Array of features included
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum and Discussion
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order"),
  isActive: boolean("is_active").default(true),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  views: integer("views").default(0),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => forumTopics.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery for photos
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  category: text("category"), // residential, commercial, etc.
  sortOrder: integer("sort_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

// Carousel Images for Homepage
export const carouselImages = pgTable("carousel_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews
export const customerReviews = pgTable("customer_reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  serviceType: text("service_type"), // what service was performed
  isApproved: boolean("is_approved").default(false),
  serviceDate: timestamp("service_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImageUrl: text("cover_image_url"),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// Many-to-many relationship between blog posts and categories
export const blogPostCategories = pgTable("blog_post_categories", {
  postId: integer("post_id").notNull().references(() => blogPosts.id),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.categoryId] }),
}));

// Tables for HVAC data and equipment
export const hvacEquipmentCategories = pgTable("hvac_equipment_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const hvacEquipment = pgTable("hvac_equipment", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => hvacEquipmentCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  efficiency: text("efficiency"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }),
  installationCost: numeric("installation_cost", { precision: 10, scale: 2 }),
  annualOperatingCost: numeric("annual_operating_cost", { precision: 10, scale: 2 }),
  lifespan: integer("lifespan"),
  type: text("type"), // furnace, AC, heat pump, etc.
  btuOutput: integer("btu_output"),
  seerRating: numeric("seer_rating", { precision: 4, scale: 1 }),
  afueRating: numeric("afue_rating", { precision: 4, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hvacMaterials = pgTable("hvac_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull(), // feet, square feet, pieces, etc.
  costPerUnit: numeric("cost_per_unit", { precision: 10, scale: 2 }),
  type: text("type"), // ductwork, insulation, refrigerant, etc.
  isActive: boolean("is_active").default(true),
});

export const hvacLabor = pgTable("hvac_labor", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // technician, installer, etc.
  description: text("description"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  averageTimePerJob: numeric("average_time_per_job", { precision: 5, scale: 2 }),
});

export const hvacAccessories = pgTable("hvac_accessories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  installationTime: numeric("installation_time", { precision: 5, scale: 2 }),
  compatibility: text("compatibility").array(), // what systems this is compatible with
  isActive: boolean("is_active").default(true),
});

export const proCalculatorQuotes = pgTable("pro_calculator_quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  propertyType: text("property_type"),
  squareFootage: integer("square_footage"),
  equipmentDetails: jsonb("equipment_details"),
  materialsDetails: jsonb("materials_details"),
  laborDetails: jsonb("labor_details"),
  accessoriesDetails: jsonb("accessories_details"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  annualSavings: numeric("annual_savings", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  notes: text("notes"),
});

// Customer Records and Analytics
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  company: text("company"),
  customerType: text("customer_type").default("residential"), // residential, commercial
  source: text("source"), // website, referral, marketing
  notes: text("notes"),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Form Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  source: text("source").default("contact_form"), // contact_form, emergency_form, quote_request
  priority: text("priority").default("normal"), // low, normal, high, urgent
  status: text("status").default("new"), // new, in_progress, completed, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  responseRequired: boolean("response_required").default(true),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency Service Requests
export const emergencyRequests = pgTable("emergency_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  emergencyType: text("emergency_type").notNull(), // no_heat, no_cooling, gas_leak, etc
  description: text("description").notNull(),
  severity: text("severity").default("high"), // medium, high, critical
  status: text("status").default("received"), // received, dispatched, in_progress, completed
  assignedTechnician: integer("assigned_technician").references(() => users.id),
  estimatedArrival: timestamp("estimated_arrival"),
  completedAt: timestamp("completed_at"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quote Requests
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  serviceType: text("service_type").notNull(), // installation, repair, maintenance
  systemType: text("system_type"), // furnace, ac, heat_pump, etc
  description: text("description"),
  preferredContactMethod: text("preferred_contact_method").default("email"), // email, phone, text
  preferredContactTime: text("preferred_contact_time"),
  budget: text("budget"),
  timeline: text("timeline"),
  status: text("status").default("pending"), // pending, quoted, approved, declined, completed
  quoteAmount: numeric("quote_amount", { precision: 10, scale: 2 }),
  quotedAt: timestamp("quoted_at"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Sessions and Activity Tracking
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  loginAt: timestamp("login_at").defaultNow(),
  logoutAt: timestamp("logout_at"),
  isActive: boolean("is_active").default(true),
});

// Website Analytics
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  duration: integer("duration"), // time spent on page in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Calculator Usage Analytics
export const calculatorUsage = pgTable("calculator_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculatorType: text("calculator_type").notNull(), // furnace, ac, maintenance
  tier: text("tier"), // economy, mid_range, premium
  inputData: jsonb("input_data"),
  completed: boolean("completed").default(false),
  conversionToQuote: boolean("conversion_to_quote").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Performance Metrics
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // response_time, error_count, user_count
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// USER AND AUTH
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  company: true,
});

export const insertUserAdminSchema = createInsertSchema(users);

// PRODUCTS AND ACCESS
export const insertProductSchema = createInsertSchema(products);
export const insertProductAccessSchema = createInsertSchema(productAccess);

// FORUM
export const insertForumCategorySchema = createInsertSchema(forumCategories);
export const insertForumTopicSchema = createInsertSchema(forumTopics);
export const insertForumPostSchema = createInsertSchema(forumPosts);

// GALLERY
export const insertGalleryImageSchema = createInsertSchema(galleryImages);

// REVIEWS
export const insertCustomerReviewSchema = createInsertSchema(customerReviews);

// BLOG
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertBlogCategorySchema = createInsertSchema(blogCategories);

// HVAC EQUIPMENT
export const insertHvacEquipmentSchema = createInsertSchema(hvacEquipment);
export const insertHvacMaterialsSchema = createInsertSchema(hvacMaterials);
export const insertHvacAccessoriesSchema = createInsertSchema(hvacAccessories);
export const insertProCalculatorQuoteSchema = createInsertSchema(proCalculatorQuotes);

// TYPES
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductAccess = z.infer<typeof insertProductAccessSchema>;
export type ProductAccess = typeof productAccess.$inferSelect;

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export const insertCarouselImageSchema = createInsertSchema(carouselImages);
export type InsertCarouselImage = z.infer<typeof insertCarouselImageSchema>;
export type CarouselImage = typeof carouselImages.$inferSelect;

export type InsertCustomerReview = z.infer<typeof insertCustomerReviewSchema>;
export type CustomerReview = typeof customerReviews.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;

export type InsertHvacEquipment = z.infer<typeof insertHvacEquipmentSchema>;
export type HvacEquipment = typeof hvacEquipment.$inferSelect;

export type InsertHvacMaterial = z.infer<typeof insertHvacMaterialsSchema>;
export type HvacMaterial = typeof hvacMaterials.$inferSelect;

export type InsertHvacAccessory = z.infer<typeof insertHvacAccessoriesSchema>;
export type HvacAccessory = typeof hvacAccessories.$inferSelect;

export type InsertProCalculatorQuote = z.infer<typeof insertProCalculatorQuoteSchema>;
export type ProCalculatorQuote = typeof proCalculatorQuotes.$inferSelect;

// Customer and Analytics Types
export type InsertCustomer = typeof customers.$inferInsert;
export type Customer = typeof customers.$inferSelect;

export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertEmergencyRequest = typeof emergencyRequests.$inferInsert;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;

export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

export type InsertUserSession = typeof userSessions.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;

export type InsertPageView = typeof pageViews.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;

export type InsertCalculatorUsage = typeof calculatorUsage.$inferInsert;
export type CalculatorUsage = typeof calculatorUsage.$inferSelect;

export type InsertSystemMetric = typeof systemMetrics.$inferInsert;
export type SystemMetric = typeof systemMetrics.$inferSelect;
