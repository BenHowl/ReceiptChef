import { type User, type InsertUser, type Receipt, type InsertReceipt } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt methods
  getReceipt(id: string): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  updateReceipt(id: string, receipt: Partial<Receipt>): Promise<Receipt | undefined>;
  getAllReceipts(): Promise<Receipt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private receipts: Map<string, Receipt>;

  constructor() {
    this.users = new Map();
    this.receipts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getReceipt(id: string): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = randomUUID();
    const receipt: Receipt = { 
      ...insertReceipt, 
      id,
      ingredients: [],
      mealPlans: [],
      createdAt: new Date()
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async updateReceipt(id: string, updates: Partial<Receipt>): Promise<Receipt | undefined> {
    const receipt = this.receipts.get(id);
    if (!receipt) return undefined;
    
    const updatedReceipt = { ...receipt, ...updates };
    this.receipts.set(id, updatedReceipt);
    return updatedReceipt;
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return Array.from(this.receipts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
