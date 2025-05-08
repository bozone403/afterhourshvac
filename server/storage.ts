import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  checkProAccess(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      hasProAccess: false,
      proAccessGrantedAt: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      hasProAccess: hasAccess,
      proAccessGrantedAt: grantedAt
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async checkProAccess(userId: number): Promise<boolean> {
    const user = this.users.get(userId);
    return user?.hasProAccess || false;
  }
}

export const storage = new MemStorage();
