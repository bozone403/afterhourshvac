import { users, productAccess, products, galleryImages, blogPosts, forumCategories, forumTopics, forumPosts, customerReviews, blogCategories, type User, type InsertUser, type Product, type InsertProduct, type ProductAccess, type InsertProductAccess, type GalleryImage, type InsertGalleryImage, type BlogPost, type InsertBlogPost, type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic, type ForumPost, type InsertForumPost, type CustomerReview, type InsertCustomerReview, type BlogCategory, type InsertBlogCategory } from "@shared/schema";
import { eq, and } from "drizzle-orm";
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
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
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
}

export const storage = new DatabaseStorage();
