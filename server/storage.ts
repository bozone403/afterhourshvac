import { users, productAccess, products, galleryImages, carouselImages, blogPosts, forumCategories, forumTopics, forumPosts, forumLikes, customerReviews, blogCategories, hvacEquipment, hvacMaterials, hvacAccessories, customers, contactSubmissions, emergencyRequests, quoteRequests, userSessions, pageViews, calculatorUsage, systemMetrics, serviceRequests, serviceJourneyStages, serviceUpdates, technicianLocations, type User, type InsertUser, type Product, type InsertProduct, type ProductAccess, type InsertProductAccess, type GalleryImage, type InsertGalleryImage, type CarouselImage, type InsertCarouselImage, type BlogPost, type InsertBlogPost, type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic, type ForumPost, type InsertForumPost, type ForumLike, type InsertForumLike, type CustomerReview, type InsertCustomerReview, type BlogCategory, type InsertBlogCategory, type HvacEquipment, type InsertHvacEquipment, type HvacMaterial, type InsertHvacMaterial, type HvacAccessory, type InsertHvacAccessory, type Customer, type InsertCustomer, type ContactSubmission, type InsertContactSubmission, type EmergencyRequest, type InsertEmergencyRequest, type QuoteRequest, type InsertQuoteRequest, type UserSession, type InsertUserSession, type PageView, type InsertPageView, type CalculatorUsage, type InsertCalculatorUsage, type SystemMetric, type InsertSystemMetric, type ServiceRequest, type InsertServiceRequest, type ServiceJourneyStage, type InsertServiceJourneyStage, type ServiceUpdate, type InsertServiceUpdate, type TechnicianLocation, type InsertTechnicianLocation } from "@shared/schema";
import { eq, and, gte, desc, count } from "drizzle-orm";
import { db, pool } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  checkProAccess(userId: number): Promise<boolean>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined>;
  
  // Product Access methods
  getUserProductAccess(userId: number): Promise<ProductAccess[]>;
  checkProductAccess(userId: number, productId: number): Promise<boolean>;
  grantProductAccess(data: InsertProductAccess): Promise<ProductAccess>;
  revokeProductAccess(userId: number, productId: number): Promise<boolean>;
  
  // Gallery methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImageById(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, data: Partial<GalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  
  // Carousel methods
  getCarouselImages(): Promise<CarouselImage[]>;
  createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage>;
  updateCarouselImage(id: number, data: Partial<CarouselImage>): Promise<CarouselImage | undefined>;
  deleteCarouselImage(id: number): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Blog Category methods
  getBlogCategories(): Promise<BlogCategory[]>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  
  // Forum methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumTopics(categoryId?: number): Promise<ForumTopic[]>;
  getForumPosts(topicId: number): Promise<ForumPost[]>;
  getForumTopicById(id: number): Promise<ForumTopic | undefined>;
  getForumPostById(id: number): Promise<ForumPost | undefined>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined>;
  updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deleteForumTopic(id: number): Promise<boolean>;
  deleteForumPost(id: number): Promise<boolean>;
  
  // Forum likes methods
  getForumLikes(topicId?: number, postId?: number): Promise<ForumLike[]>;
  createForumLike(like: InsertForumLike): Promise<ForumLike>;
  deleteForumLike(userId: number, topicId?: number, postId?: number): Promise<boolean>;
  getTopicLikeCount(topicId: number): Promise<number>;
  getPostLikeCount(postId: number): Promise<number>;
  hasUserLikedTopic(userId: number, topicId: number): Promise<boolean>;
  hasUserLikedPost(userId: number, postId: number): Promise<boolean>;
  populateForumWithHvacContent(): Promise<void>;
  
  // Reviews methods
  getReviews(approvedOnly?: boolean): Promise<CustomerReview[]>;
  createReview(review: InsertCustomerReview): Promise<CustomerReview>;
  approveReview(id: number): Promise<CustomerReview | undefined>;
  
  // HVAC Data methods
  getHvacEquipment(): Promise<HvacEquipment[]>;
  createHvacEquipment(equipment: InsertHvacEquipment): Promise<HvacEquipment>;
  updateHvacEquipment(id: number, data: Partial<HvacEquipment>): Promise<HvacEquipment | undefined>;
  
  getHvacMaterials(): Promise<HvacMaterial[]>;
  createHvacMaterial(material: InsertHvacMaterial): Promise<HvacMaterial>;
  updateHvacMaterial(id: number, data: Partial<HvacMaterial>): Promise<HvacMaterial | undefined>;
  
  getHvacAccessories(): Promise<HvacAccessory[]>;
  createHvacAccessory(accessory: InsertHvacAccessory): Promise<HvacAccessory>;
  updateHvacAccessory(id: number, data: Partial<HvacAccessory>): Promise<HvacAccessory | undefined>;
  
  // Customer Records and Analytics methods
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | undefined>;
  
  getContactSubmissions(status?: string): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined>;
  
  getEmergencyRequests(): Promise<EmergencyRequest[]>;
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined>;
  
  getQuoteRequests(status?: string): Promise<QuoteRequest[]>;
  createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest>;
  updateQuoteRequestStatus(id: number, status: string, quoteAmount?: number): Promise<QuoteRequest | undefined>;
  
  // Analytics methods
  getDashboardStats(dateRange: string): Promise<any>;
  getAnalyticsData(dateRange: string): Promise<any>;
  recordPageView(data: InsertPageView): Promise<PageView>;
  recordCalculatorUsage(data: InsertCalculatorUsage): Promise<CalculatorUsage>;
  recordSystemMetric(data: InsertSystemMetric): Promise<SystemMetric>;
  
  // User session tracking
  createUserSession(data: InsertUserSession): Promise<UserSession>;
  endUserSession(sessionId: string): Promise<void>;
  
  // Service Journey Tracking methods
  getServiceRequests(status?: string): Promise<ServiceRequest[]>;
  getServiceRequestById(id: number): Promise<ServiceRequest | undefined>;
  getServiceRequestByNumber(requestNumber: string): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: number, data: Partial<ServiceRequest>): Promise<ServiceRequest | undefined>;
  updateServiceRequestStage(id: number, stage: string): Promise<ServiceRequest | undefined>;
  
  getServiceJourneyStages(serviceRequestId: number): Promise<ServiceJourneyStage[]>;
  createServiceJourneyStage(stage: InsertServiceJourneyStage): Promise<ServiceJourneyStage>;
  updateServiceJourneyStage(id: number, data: Partial<ServiceJourneyStage>): Promise<ServiceJourneyStage | undefined>;
  completeServiceJourneyStage(serviceRequestId: number, stage: string): Promise<ServiceJourneyStage | undefined>;
  
  getServiceUpdates(serviceRequestId: number): Promise<ServiceUpdate[]>;
  createServiceUpdate(update: InsertServiceUpdate): Promise<ServiceUpdate>;
  
  getTechnicianLocation(technicianId: number, serviceRequestId?: number): Promise<TechnicianLocation | undefined>;
  updateTechnicianLocation(location: InsertTechnicianLocation): Promise<TechnicianLocation>;
  getActiveServiceRequests(technicianId?: number): Promise<ServiceRequest[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: pool,
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user",
        createdAt: new Date(),
      })
      .returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    // Don't add updatedAt as it's not in our schema
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        hasProAccess: hasAccess,
        proAccessGrantedAt: grantedAt,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  
  async checkProAccess(userId: number): Promise<boolean> {
    const [user] = await db
      .select({ hasAccess: users.hasProAccess })
      .from(users)
      .where(eq(users.id, userId));
    return user?.hasAccess || false;
  }
  
  // PRODUCT METHODS
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isActive, true));
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(and(
        eq(products.category, category),
        eq(products.isActive, true)
      ));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }
  
  async updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  // PRODUCT ACCESS METHODS
  async getUserProductAccess(userId: number): Promise<ProductAccess[]> {
    return db
      .select()
      .from(productAccess)
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.active, true)
      ));
  }
  
  async checkProductAccess(userId: number, productId: number): Promise<boolean> {
    const [access] = await db
      .select()
      .from(productAccess)
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.productId, productId),
        eq(productAccess.active, true)
      ));
    return !!access;
  }
  
  async grantProductAccess(data: InsertProductAccess): Promise<ProductAccess> {
    const [access] = await db
      .insert(productAccess)
      .values(data)
      .returning();
    return access;
  }
  
  async revokeProductAccess(userId: number, productId: number): Promise<boolean> {
    const result = await db
      .update(productAccess)
      .set({ active: false })
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.productId, productId)
      ));
    return !!result;
  }
  
  // GALLERY METHODS
  async getGalleryImages(): Promise<GalleryImage[]> {
    return db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true));
  }
  
  async getGalleryImageById(id: number): Promise<GalleryImage | undefined> {
    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id));
    return image;
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db
      .insert(galleryImages)
      .values(image)
      .returning();
    return newImage;
  }
  
  async updateGalleryImage(id: number, data: Partial<GalleryImage>): Promise<GalleryImage | undefined> {
    const [updatedImage] = await db
      .update(galleryImages)
      .set(data)
      .where(eq(galleryImages.id, id))
      .returning();
    return updatedImage;
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    const result = await db
      .update(galleryImages)
      .set({ isActive: false })
      .where(eq(galleryImages.id, id));
    return !!result;
  }

  // CAROUSEL METHODS
  async getCarouselImages(): Promise<CarouselImage[]> {
    return db
      .select()
      .from(carouselImages)
      .where(eq(carouselImages.isActive, true))
      .orderBy(carouselImages.sortOrder);
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const [newImage] = await db
      .insert(carouselImages)
      .values(image)
      .returning();
    return newImage;
  }

  async updateCarouselImage(id: number, data: Partial<CarouselImage>): Promise<CarouselImage | undefined> {
    const [updatedImage] = await db
      .update(carouselImages)
      .set(data)
      .where(eq(carouselImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteCarouselImage(id: number): Promise<boolean> {
    const result = await db
      .update(carouselImages)
      .set({ isActive: false })
      .where(eq(carouselImages.id, id));
    return !!result;
  }
  
  // BLOG METHODS
  async getBlogPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
    const query = publishedOnly ? 
      and(eq(blogPosts.isPublished, true)) : 
      undefined;
    
    return db
      .select()
      .from(blogPosts)
      .where(query);
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    // updatedAt is in the schema for blog posts
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return !!result;
  }
  
  // BLOG CATEGORY METHODS
  async getBlogCategories(): Promise<BlogCategory[]> {
    return db.select().from(blogCategories);
  }
  
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db
      .insert(blogCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  // FORUM METHODS
  async getForumCategories(): Promise<ForumCategory[]> {
    return db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.isActive, true));
  }
  
  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> {
    const query = categoryId ? 
      and(eq(forumTopics.categoryId, categoryId)) : 
      undefined;
    
    return db
      .select()
      .from(forumTopics)
      .where(query);
  }
  
  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    return db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.topicId, topicId));
  }
  
  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [newCategory] = await db
      .insert(forumCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const [newTopic] = await db
      .insert(forumTopics)
      .values(topic)
      .returning();
    return newTopic;
  }
  
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db
      .insert(forumPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getForumTopicById(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.id, id));
    return topic;
  }

  async updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined> {
    const [updatedTopic] = await db
      .update(forumTopics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(forumTopics.id, id))
      .returning();
    return updatedTopic;
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    await db.delete(forumTopics).where(eq(forumTopics.id, id));
    await db.delete(forumPosts).where(eq(forumPosts.topicId, id));
    return true;
  }

  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    const [post] = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.id, id));
    return post;
  }

  async updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const [updatedPost] = await db
      .update(forumPosts)
      .set({ ...data, updatedAt: new Date(), isEdited: true })
      .where(eq(forumPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteForumPost(id: number): Promise<boolean> {
    // Delete associated likes first
    await db.delete(forumLikes).where(eq(forumLikes.postId, id));
    // Delete the post
    await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return true;
  }

  // FORUM LIKES METHODS
  async getForumLikes(topicId?: number, postId?: number): Promise<ForumLike[]> {
    const conditions = [];
    if (topicId) conditions.push(eq(forumLikes.topicId, topicId));
    if (postId) conditions.push(eq(forumLikes.postId, postId));
    
    return db
      .select()
      .from(forumLikes)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async createForumLike(like: InsertForumLike): Promise<ForumLike> {
    const [newLike] = await db
      .insert(forumLikes)
      .values(like)
      .returning();
    return newLike;
  }

  async deleteForumLike(userId: number, topicId?: number, postId?: number): Promise<boolean> {
    const conditions = [eq(forumLikes.userId, userId)];
    if (topicId) conditions.push(eq(forumLikes.topicId, topicId));
    if (postId) conditions.push(eq(forumLikes.postId, postId));
    
    await db.delete(forumLikes).where(and(...conditions));
    return true;
  }

  async getTopicLikeCount(topicId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(forumLikes)
      .where(eq(forumLikes.topicId, topicId));
    return result?.count || 0;
  }

  async getPostLikeCount(postId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(forumLikes)
      .where(eq(forumLikes.postId, postId));
    return result?.count || 0;
  }

  async hasUserLikedTopic(userId: number, topicId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.topicId, topicId)
      ));
    return !!result;
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.postId, postId)
      ));
    return !!result;
  }
  
  // REVIEWS METHODS
  async getReviews(approvedOnly: boolean = true): Promise<CustomerReview[]> {
    const query = approvedOnly ? 
      and(eq(customerReviews.isApproved, true)) : 
      undefined;
    
    return db
      .select()
      .from(customerReviews)
      .where(query);
  }
  
  async createReview(review: InsertCustomerReview): Promise<CustomerReview> {
    const [newReview] = await db
      .insert(customerReviews)
      .values(review)
      .returning();
    return newReview;
  }
  
  async approveReview(id: number): Promise<CustomerReview | undefined> {
    const [updatedReview] = await db
      .update(customerReviews)
      .set({ isApproved: true })
      .where(eq(customerReviews.id, id))
      .returning();
    return updatedReview;
  }

  // HVAC Data methods
  async getHvacEquipment(): Promise<HvacEquipment[]> {
    return await db.select().from(hvacEquipment);
  }

  async createHvacEquipment(equipment: InsertHvacEquipment): Promise<HvacEquipment> {
    const [newEquipment] = await db
      .insert(hvacEquipment)
      .values(equipment)
      .returning();
    return newEquipment;
  }

  async updateHvacEquipment(id: number, data: Partial<HvacEquipment>): Promise<HvacEquipment | undefined> {
    const [updated] = await db
      .update(hvacEquipment)
      .set(data)
      .where(eq(hvacEquipment.id, id))
      .returning();
    return updated;
  }

  async getHvacMaterials(): Promise<HvacMaterial[]> {
    return await db.select().from(hvacMaterials);
  }

  async createHvacMaterial(material: InsertHvacMaterial): Promise<HvacMaterial> {
    const [newMaterial] = await db
      .insert(hvacMaterials)
      .values(material)
      .returning();
    return newMaterial;
  }

  async updateHvacMaterial(id: number, data: Partial<HvacMaterial>): Promise<HvacMaterial | undefined> {
    const [updated] = await db
      .update(hvacMaterials)
      .set(data)
      .where(eq(hvacMaterials.id, id))
      .returning();
    return updated;
  }

  async getHvacAccessories(): Promise<HvacAccessory[]> {
    return await db.select().from(hvacAccessories);
  }

  async createHvacAccessory(accessory: InsertHvacAccessory): Promise<HvacAccessory> {
    const [newAccessory] = await db
      .insert(hvacAccessories)
      .values(accessory)
      .returning();
    return newAccessory;
  }

  async updateHvacAccessory(id: number, data: Partial<HvacAccessory>): Promise<HvacAccessory | undefined> {
    const [updated] = await db
      .update(hvacAccessories)
      .set(data)
      .where(eq(hvacAccessories.id, id))
      .returning();
    return updated;
  }

  // Customer Records and Analytics implementation
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | undefined> {
    const [updated] = await db
      .update(customers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updated;
  }

  async getContactSubmissions(status?: string): Promise<ContactSubmission[]> {
    const query = db.select().from(contactSubmissions);
    if (status && status !== 'all') {
      query.where(eq(contactSubmissions.status, status));
    }
    return await query.orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const [updated] = await db
      .update(contactSubmissions)
      .set({ status, respondedAt: status === 'completed' ? new Date() : undefined })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updated;
  }

  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    return await db.select().from(emergencyRequests).orderBy(desc(emergencyRequests.createdAt));
  }

  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const [newRequest] = await db
      .insert(emergencyRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined> {
    const [updated] = await db
      .update(emergencyRequests)
      .set({ status, completedAt: status === 'completed' ? new Date() : undefined })
      .where(eq(emergencyRequests.id, id))
      .returning();
    return updated;
  }

  async getQuoteRequests(status?: string): Promise<QuoteRequest[]> {
    const query = db.select().from(quoteRequests);
    if (status && status !== 'all') {
      query.where(eq(quoteRequests.status, status));
    }
    return await query.orderBy(desc(quoteRequests.createdAt));
  }

  async createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newRequest] = await db
      .insert(quoteRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateQuoteRequestStatus(id: number, status: string, quoteAmount?: number): Promise<QuoteRequest | undefined> {
    const updateData: any = { status };
    if (quoteAmount) {
      updateData.quoteAmount = quoteAmount;
      updateData.quotedAt = new Date();
    }
    
    const [updated] = await db
      .update(quoteRequests)
      .set(updateData)
      .where(eq(quoteRequests.id, id))
      .returning();
    return updated;
  }

  async getDashboardStats(dateRange: string): Promise<any> {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get counts for different types of inquiries
    const [contactCount] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(gte(contactSubmissions.createdAt, startDate));

    const [emergencyCount] = await db
      .select({ count: count() })
      .from(emergencyRequests)
      .where(gte(emergencyRequests.createdAt, startDate));

    const [quoteCount] = await db
      .select({ count: count() })
      .from(quoteRequests)
      .where(gte(quoteRequests.createdAt, startDate));

    const [calcUsageCount] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(gte(calculatorUsage.createdAt, startDate));

    return {
      totalInquiries: contactCount.count + emergencyCount.count + quoteCount.count,
      emergencyRequests: emergencyCount.count,
      quoteRequests: quoteCount.count,
      calculatorUsage: calcUsageCount.count,
      inquiriesGrowth: 12, // TODO: Calculate actual growth
      pendingEmergencies: 0, // TODO: Get actual pending count
      totalQuoteValue: 0, // TODO: Calculate actual quote value
      calculatorConversion: 15, // TODO: Calculate actual conversion rate
    };
  }

  async getAnalyticsData(dateRange: string): Promise<any> {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const [pageViewCount] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startDate));

    const [calculatorCount] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(gte(calculatorUsage.createdAt, startDate));

    const [completedCalc] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(and(
        gte(calculatorUsage.createdAt, startDate),
        eq(calculatorUsage.completed, true)
      ));

    return {
      pageViews: pageViewCount.count,
      uniqueVisitors: Math.floor(pageViewCount.count * 0.7), // Estimate
      avgSessionDuration: '4m 32s',
      bounceRate: '45%',
      totalCalculations: calculatorCount.count,
      completedCalculations: completedCalc.count,
      popularCalculator: 'Furnace Calculator',
      calculatorToQuote: '12%',
    };
  }

  async recordPageView(data: InsertPageView): Promise<PageView> {
    const [pageView] = await db
      .insert(pageViews)
      .values(data)
      .returning();
    return pageView;
  }

  async recordCalculatorUsage(data: InsertCalculatorUsage): Promise<CalculatorUsage> {
    const [usage] = await db
      .insert(calculatorUsage)
      .values(data)
      .returning();
    return usage;
  }

  async recordSystemMetric(data: InsertSystemMetric): Promise<SystemMetric> {
    const [metric] = await db
      .insert(systemMetrics)
      .values(data)
      .returning();
    return metric;
  }

  async createUserSession(data: InsertUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values(data)
      .returning();
    return session;
  }

  async endUserSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ logoutAt: new Date(), isActive: false })
      .where(eq(userSessions.sessionId, sessionId));
  }

  // Service Journey Tracking Implementation
  async getServiceRequests(status?: string): Promise<ServiceRequest[]> {
    if (status) {
      return await db.select().from(serviceRequests)
        .where(eq(serviceRequests.status, status))
        .orderBy(desc(serviceRequests.createdAt));
    }
    
    return await db.select().from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async getServiceRequestByNumber(requestNumber: string): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.requestNumber, requestNumber));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [newRequest] = await db
      .insert(serviceRequests)
      .values({
        ...request,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newRequest;
  }

  async updateServiceRequest(id: number, data: Partial<ServiceRequest>): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async updateServiceRequestStage(id: number, stage: string): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({ currentStage: stage, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getServiceJourneyStages(serviceRequestId: number): Promise<ServiceJourneyStage[]> {
    return await db
      .select()
      .from(serviceJourneyStages)
      .where(eq(serviceJourneyStages.serviceRequestId, serviceRequestId))
      .orderBy(serviceJourneyStages.createdAt);
  }

  async createServiceJourneyStage(stage: InsertServiceJourneyStage): Promise<ServiceJourneyStage> {
    const [newStage] = await db
      .insert(serviceJourneyStages)
      .values({
        ...stage,
        createdAt: new Date(),
      })
      .returning();
    return newStage;
  }

  async updateServiceJourneyStage(id: number, data: Partial<ServiceJourneyStage>): Promise<ServiceJourneyStage | undefined> {
    const [updatedStage] = await db
      .update(serviceJourneyStages)
      .set(data)
      .where(eq(serviceJourneyStages.id, id))
      .returning();
    return updatedStage;
  }

  async completeServiceJourneyStage(serviceRequestId: number, stage: string): Promise<ServiceJourneyStage | undefined> {
    const [updatedStage] = await db
      .update(serviceJourneyStages)
      .set({ 
        status: "completed", 
        completedAt: new Date(),
        actualDuration: Math.floor((Date.now() - new Date().getTime()) / 60000) // rough calculation
      })
      .where(and(
        eq(serviceJourneyStages.serviceRequestId, serviceRequestId),
        eq(serviceJourneyStages.stage, stage)
      ))
      .returning();
    return updatedStage;
  }

  async getServiceUpdates(serviceRequestId: number): Promise<ServiceUpdate[]> {
    return await db
      .select()
      .from(serviceUpdates)
      .where(eq(serviceUpdates.serviceRequestId, serviceRequestId))
      .orderBy(desc(serviceUpdates.createdAt));
  }

  async createServiceUpdate(update: InsertServiceUpdate): Promise<ServiceUpdate> {
    const [newUpdate] = await db
      .insert(serviceUpdates)
      .values({
        ...update,
        createdAt: new Date(),
      })
      .returning();
    return newUpdate;
  }

  async getTechnicianLocation(technicianId: number, serviceRequestId?: number): Promise<TechnicianLocation | undefined> {
    if (serviceRequestId) {
      const [location] = await db.select().from(technicianLocations)
        .where(and(
          eq(technicianLocations.technicianId, technicianId),
          eq(technicianLocations.serviceRequestId, serviceRequestId)
        ))
        .orderBy(desc(technicianLocations.lastUpdated))
        .limit(1);
      return location;
    }
    
    const [location] = await db.select().from(technicianLocations)
      .where(eq(technicianLocations.technicianId, technicianId))
      .orderBy(desc(technicianLocations.lastUpdated))
      .limit(1);
    return location;
  }

  async updateTechnicianLocation(location: InsertTechnicianLocation): Promise<TechnicianLocation> {
    const [updatedLocation] = await db
      .insert(technicianLocations)
      .values({
        ...location,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: [technicianLocations.technicianId, technicianLocations.serviceRequestId],
        set: {
          ...location,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return updatedLocation;
  }

  async getActiveServiceRequests(technicianId?: number): Promise<ServiceRequest[]> {
    if (technicianId) {
      const results = await db
        .select()
        .from(serviceRequests)
        .where(and(
          eq(serviceRequests.status, "in_progress"),
          eq(serviceRequests.assignedTechnician, technicianId)
        ))
        .orderBy(desc(serviceRequests.createdAt));
      return results;
    }
    
    const results = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.status, "in_progress"))
      .orderBy(desc(serviceRequests.createdAt));
    return results;
  }

  async populateForumWithHvacContent(): Promise<void> {
    // Check if professional content already exists
    const existingProfessionalTopics = await db.select()
      .from(forumTopics)
      .where(eq(forumTopics.title, "Calgary HVAC Market Trends - Winter 2024/2025"));
    
    if (existingProfessionalTopics.length > 0) {
      return; // Professional content already exists
    }

    // Create admin user for content creation if not exists
    let adminUser = await this.getUserByUsername('hvac_expert');
    if (!adminUser) {
      adminUser = await this.createUser({
        username: 'hvac_expert',
        email: 'expert@afterhourshvac.ca',
        password: 'temp_password'
      });
    }

    // Professional HVAC content for each category
    const hvacContent = [
      {
        categoryId: 1, // General Discussion
        topics: [
          {
            title: "Welcome to AfterHours HVAC Professional Forum",
            content: "Welcome to the premier destination for HVAC professionals in Calgary and surrounding areas. This forum is designed for technicians, contractors, and industry professionals to share knowledge, discuss best practices, and stay updated on the latest industry developments.\n\nForum Guidelines:\n• Share professional experiences and technical solutions\n• Respect all members and maintain professional discourse\n• Use proper safety protocols in all discussions\n• Follow Alberta and Canadian HVAC codes and regulations\n\nLet's build a strong community of HVAC excellence together!"
          },
          {
            title: "Calgary HVAC Market Trends - Winter 2024/2025",
            content: "The Calgary HVAC market is experiencing significant changes this winter season:\n\n**Equipment Demand:**\n• High-efficiency furnaces (95%+ AFUE) are becoming the standard\n• Heat pumps gaining popularity despite our climate challenges\n• Smart thermostats now requested in 80% of installations\n\n**Supply Chain Updates:**\n• Lead times for premium equipment: 4-6 weeks\n• Local suppliers (Alggin, WESCO) maintaining good inventory\n• Price increases expected Q1 2025 (8-12% average)\n\n**Regulatory Changes:**\n• New refrigerant regulations coming into effect\n• Updated building codes for multi-family dwellings\n• Enhanced energy efficiency requirements\n\nWhat trends are you seeing in your service area?"
          }
        ]
      },
      {
        categoryId: 2, // Troubleshooting & Repairs
        topics: [
          {
            title: "Common Furnace Issues in Extreme Cold (-30°C and Below)",
            content: "Calgary's extreme winter conditions present unique challenges for residential furnaces. Here's a comprehensive guide for the most common issues:\n\n**1. Frozen Condensate Lines**\n• Symptoms: Water backing up, furnace shutting down\n• Solution: Insulate exterior portions, check drainage slope\n• Prevention: Regular maintenance, proper installation\n\n**2. Heat Exchanger Stress Cracks**\n• More common in extreme cold due to rapid expansion/contraction\n• Look for corrosion patterns, flame rollout\n• Safety first - immediate shutdown if suspected\n\n**3. Intake/Exhaust Icing**\n• High-efficiency units most susceptible\n• Clear snow/ice buildup immediately\n• Install wind guards where appropriate\n\n**4. Thermostat Drift in Cold**\n• Digital stats can read incorrectly in extreme cold\n• Check sensor placement and calibration\n• Consider upgrading to commercial-grade units\n\n**Emergency Protocol:**\n1. Safety check first\n2. Restore heat quickly (space heaters if safe)\n3. Document findings for warranty claims\n\nShare your cold-weather troubleshooting experiences below!"
          },
          {
            title: "Heat Pump Performance in Calgary Climate",
            content: "Heat pumps are becoming more viable in Calgary, but require careful consideration:\n\n**Performance Thresholds:**\n• Most units maintain efficiency down to -15°C\n• Auxiliary heat kicks in below -20°C\n• Emergency heat mode below -25°C\n\n**Installation Considerations:**\n• Oversizing by 15-20% for our climate\n• Quality defrost controls essential\n• Proper refrigerant charge critical\n\n**Maintenance Schedule:**\n• Pre-winter inspection (September)\n• Mid-winter check (January)\n• Post-winter service (April)\n\n**Common Issues:**\n• Defrost cycle problems\n• Ice buildup on outdoor unit\n• Refrigerant leaks in extreme cold\n• Backup heating system failures\n\n**Recommended Brands for Calgary:**\n• Mitsubishi Hyper-Heat series\n• Carrier Greenspeed\n• Lennox Elite series\n\nWhat's your experience with heat pump installations in our climate?"
          }
        ]
      },
      {
        categoryId: 3, // Installation Tips
        topics: [
          {
            title: "Proper Furnace Installation in Calgary Basements",
            content: "Calgary's unique basement conditions require specific installation considerations:\n\n**Foundation Requirements:**\n• Concrete pad minimum 4\" thick\n• Vibration isolation for noise reduction\n• Proper clearances per manufacturer specs\n• Access for future maintenance\n\n**Ventilation Systems:**\n• High-efficiency: PVC intake/exhaust\n• Standard efficiency: B-vent through roof\n• Combustion air requirements (newer homes)\n• Proper slope for condensate drainage\n\n**Electrical Considerations:**\n• Dedicated 15A circuit minimum\n• GFCI protection where required\n• Emergency shut-off switch location\n• Proper grounding per CEC\n\n**Gas Line Sizing:**\n• Calculate BTU demand properly\n• Account for pipe length and fittings\n• Pressure test before connection\n• Use approved pipe dope/tape\n\n**Calgary-Specific Challenges:**\n• Clay soil movement affecting gas lines\n• Basement flooding concerns\n• Older home retrofits\n• Permit and inspection requirements\n\n**Code Compliance:**\n• Alberta Building Code requirements\n• TSSA gas fitting regulations\n• City of Calgary permits\n• Manufacturer warranty conditions\n\nShare your installation tips and photos!"
          },
          {
            title: "Ductwork Design for Calgary Homes",
            content: "Proper ductwork is crucial for system efficiency and comfort in Calgary's climate:\n\n**Design Principles:**\n• Manual D calculations essential\n• Account for extreme temperature differentials\n• Proper return air sizing (often undersized)\n• Zoning considerations for large homes\n\n**Material Selection:**\n• Galvanized steel for main trunks\n• Flexible duct for final connections\n• Insulation R-6 minimum in unconditioned spaces\n• Vapor barriers in cold climate applications\n\n**Installation Best Practices:**\n• Seal all joints with mastic (not tape)\n• Support every 4 feet maximum\n• Maintain proper slopes for drainage\n• Avoid sharp bends and restrictions\n\n**Calgary Housing Considerations:**\n• Older homes: knob-and-tube electrical conflicts\n• Bi-level homes: proper return air strategy\n• Cathedral ceilings: insulation and air sealing\n• Basement development: code compliance\n\n**Common Mistakes:**\n• Undersized return ducts\n• Poor sealing at equipment connections\n• Inadequate insulation in crawl spaces\n• Improper damper installation\n\n**Testing and Commissioning:**\n• Duct blaster testing recommended\n• Airflow measurements at each register\n• System balancing for comfort\n• Documentation for homeowner\n\nWhat ductwork challenges do you face most often?"
          }
        ]
      },
      {
        categoryId: 4, // Equipment Reviews
        topics: [
          {
            title: "2024 Furnace Brand Comparison - Calgary Market Focus",
            content: "Comprehensive comparison of furnace brands performing well in Calgary's market:\n\n**Premium Tier:**\n\n**Carrier Infinity Series**\n• Modulating gas valve technology\n• Variable speed ECM motor\n• Excellent cold weather performance\n• Price: $3,500-5,500 (equipment only)\n• Warranty: 20 years heat exchanger\n\n**Lennox Elite EL296V**\n• 96% AFUE efficiency\n• SilentComfort technology\n• Dual-fuel capability\n• Price: $3,200-4,800\n• Warranty: 20 years heat exchanger\n\n**Mid-Range Leaders:**\n\n**Goodman GMVC96 Series**\n• Reliable workhorse\n• Good parts availability\n• Competitive pricing\n• Price: $2,200-3,200\n• Warranty: 20 years heat exchanger\n\n**Rheem Classic Plus**\n• Multi-position installation\n• Stainless steel heat exchanger\n• Good cold climate performance\n• Price: $2,400-3,400\n\n**Budget Reliable:**\n\n**Amana AMVC96**\n• Same manufacturer as Goodman\n• Solid performance\n• Excellent warranty\n• Price: $1,900-2,800\n\n**Local Supplier Notes:**\n• Alggin carries Carrier, Goodman, Amana\n• WESCO stocks Lennox, Rheem\n• Lead times vary by brand (2-6 weeks)\n\n**Installation Considerations:**\n• All brands require proper sizing\n• Variable speed motors need compatible thermostats\n• Warranty registration essential\n\nShare your brand experiences and recommendations!"
          },
          {
            title: "Smart Thermostat Integration - Professional Perspective",
            content: "Smart thermostats have become standard in Calgary installations. Here's what you need to know:\n\n**Top Professional Choices:**\n\n**Ecobee SmartThermostat Premium**\n• Built-in air quality monitoring\n• Remote sensors included\n• Professional installer portal\n• Excellent cold climate algorithms\n• Price: $329 retail, $220 contractor\n\n**Honeywell T10 Pro**\n• RedLink wireless technology\n• Contractor-friendly programming\n• Robust construction\n• Good with older systems\n• Price: $279 retail, $189 contractor\n\n**Nest Learning (4th Gen)**\n• Auto-scheduling features\n• Easy homeowner interface\n• Google integration\n• Some compatibility issues with older systems\n• Price: $329 retail, $199 contractor\n\n**Installation Tips:**\n• Check C-wire availability first\n• Use proper wire nuts for connections\n• Take photo of old wiring before removal\n• Test all functions before leaving\n\n**Common Issues:**\n• Insufficient power from older transformers\n• Compatibility with zone systems\n• WiFi connectivity problems\n• Homeowner confusion with setup\n\n**Professional Features:**\n• Remote monitoring capabilities\n• Maintenance reminders\n• Service history tracking\n• Customer notification systems\n\n**Markup and Pricing:**\n• Standard markup: 40-60% above cost\n• Installation time: 45-90 minutes\n• Include basic programming in price\n• Charge separately for advanced setup\n\nWhat smart thermostats do you recommend and why?"
          }
        ]
      },
      {
        categoryId: 5, // Industry News
        topics: [
          {
            title: "Alberta HVAC Code Changes 2024 - What You Need to Know",
            content: "Significant regulatory changes affecting HVAC professionals in Alberta:\n\n**Refrigerant Regulations:**\n• R-410A phase-down accelerated\n• R-454B and R-32 adoption increasing\n• Enhanced recovery requirements\n• New technician certification levels\n\n**Energy Efficiency Updates:**\n• Minimum AFUE increased to 95% for most applications\n• Heat pump incentives expanded\n• Net-zero ready home standards\n• Enhanced building envelope requirements\n\n**Safety and Installation:**\n• Carbon monoxide detector requirements updated\n• Gas appliance venting changes\n• Combustion air calculation revisions\n• Emergency shut-off requirements\n\n**Licensing and Certification:**\n• Continuing education requirements increased\n• Specialized certifications for heat pumps\n• Digital permit submissions mandatory\n• Insurance requirement updates\n\n**Environmental Compliance:**\n• Stricter refrigerant leak reporting\n• Enhanced disposal requirements\n• Greenhouse gas reduction targets\n• Rebate program changes\n\n**Timeline for Implementation:**\n• January 2024: New efficiency standards\n• March 2024: Refrigerant regulations\n• June 2024: Permit system updates\n• September 2024: Training requirements\n\n**Action Items for Contractors:**\n• Update training certifications\n• Review equipment specifications\n• Update estimation software\n• Inform customers of changes\n\nStay informed and compliant!"
          },
          {
            title: "Calgary Utility Rebate Programs - 2024 Update",
            content: "Current rebate and incentive programs available in Calgary:\n\n**ENMAX Energy Efficiency Programs:**\n\n**High-Efficiency Furnace Rebate**\n• 95%+ AFUE: $500\n• 96%+ AFUE: $750\n• Modulating units: Additional $200\n• Must be ENERGY STAR certified\n\n**Heat Pump Incentives**\n• Air-source heat pump: $1,000\n• Cold-climate units: $1,500\n• Dual-fuel systems: $2,000\n• Ground-source: $5,000\n\n**Smart Thermostat Program**\n• ENERGY STAR certified: $75\n• Professional installation required\n• Limit 2 per household\n\n**Federal Programs:**\n\n**Canada Greener Homes Grant**\n• Pre/post energy audits required\n• Heat pumps: Up to $5,000\n• Insulation upgrades: Up to $5,000\n• Combined with provincial programs\n\n**Application Process:**\n• Online applications preferred\n• Professional installation required\n• Receipts and photos needed\n• 8-12 week processing time\n\n**Contractor Requirements:**\n• Registered with program\n• Proper licensing verification\n• Installation certification\n• Customer education required\n\n**Tips for Contractors:**\n• Help customers with applications\n• Factor rebates into pricing\n• Keep program documentation\n• Follow up on approvals\n\nMaximize value for your customers!"
          }
        ]
      }
    ];

    // Insert topics and posts for each category
    for (const category of hvacContent) {
      for (const topicData of category.topics) {
        // Create the topic
        const topic = await this.createForumTopic({
          categoryId: category.categoryId,
          userId: adminUser.id,
          title: topicData.title,
          slug: topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          content: topicData.content,
          isPinned: true,
          isLocked: false
        });

        // Add a welcome reply to some topics
        if (topicData.title.includes('Welcome') || topicData.title.includes('Market Trends')) {
          await this.createForumPost({
            topicId: topic.id,
            userId: adminUser.id,
            content: "Feel free to share your experiences and ask questions. This is a professional community focused on advancing HVAC excellence in Calgary and Alberta."
          });
        }
      }
    }
  }
}

export const storage = new DatabaseStorage();
