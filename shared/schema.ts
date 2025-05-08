import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  hasProAccess: boolean("has_pro_access").default(false),
  proAccessGrantedAt: timestamp("pro_access_granted_at"),
});

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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
});

export const insertHvacEquipmentSchema = createInsertSchema(hvacEquipment);
export const insertHvacMaterialsSchema = createInsertSchema(hvacMaterials);
export const insertHvacAccessoriesSchema = createInsertSchema(hvacAccessories);
export const insertProCalculatorQuoteSchema = createInsertSchema(proCalculatorQuotes);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HvacEquipment = typeof hvacEquipment.$inferSelect;
export type HvacMaterial = typeof hvacMaterials.$inferSelect;
export type HvacAccessory = typeof hvacAccessories.$inferSelect;
export type ProCalculatorQuote = typeof proCalculatorQuotes.$inferSelect;
