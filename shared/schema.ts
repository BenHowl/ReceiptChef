import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const receipts = pgTable("receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  ingredients: json("ingredients").$type<string[]>().default([]),
  mealPlans: json("meal_plans").$type<MealPlan[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedRecipes = pgTable("saved_recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipe: json("recipe").$type<Recipe>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  imageUrl: true,
});

export const insertSavedRecipeSchema = createInsertSchema(savedRecipes).pick({
  userId: true,
  recipe: true,
});

// Types for meal plans and recipes
export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
};

export type MealPlan = {
  id: string;
  day: string;
  recipes: Recipe[];
  generatedAt: string;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;
export type InsertSavedRecipe = z.infer<typeof insertSavedRecipeSchema>;
export type SavedRecipe = typeof savedRecipes.$inferSelect;
