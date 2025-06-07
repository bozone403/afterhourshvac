import { users, productAccess, products, galleryImages, carouselImages, blogPosts, forumCategories, forumTopics, forumPosts, customerReviews, blogCategories, hvacEquipment, hvacMaterials, hvacAccessories, customers, contactSubmissions, emergencyRequests, quoteRequests, userSessions, pageViews, calculatorUsage, systemMetrics, type User, type InsertUser, type Product, type InsertProduct, type ProductAccess, type InsertProductAccess, type GalleryImage, type InsertGalleryImage, type CarouselImage, type InsertCarouselImage, type BlogPost, type InsertBlogPost, type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic, type ForumPost, type InsertForumPost, type CustomerReview, type InsertCustomerReview, type BlogCategory, type InsertBlogCategory, type HvacEquipment, type InsertHvacEquipment, type HvacMaterial, type InsertHvacMaterial, type HvacAccessory, type InsertHvacAccessory, type Customer, type InsertCustomer, type ContactSubmission, type InsertContactSubmission, type EmergencyRequest, type InsertEmergencyRequest, type QuoteRequest, type InsertQuoteRequest, type UserSession, type InsertUserSession, type PageView, type InsertPageView, type CalculatorUsage, type InsertCalculatorUsage, type SystemMetric, type InsertSystemMetric } from "@shared/schema";
import { eq, and, gte, desc, count } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
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
    await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return true;
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
}

export const storage = new DatabaseStorage();
