import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { extractIngredientsFromFridge, extractIngredientsFromReceipt, generateRecipesFromIngredients } from "./openai";
import { insertReceiptSchema, savedRecipes, insertSavedRecipeSchema, type Recipe } from "@shared/schema";
import { z } from "zod";
import { affiliateService } from "./services/affiliateService";
import { eq, and, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate object storage environment variables at startup
  let objectStorageService: ObjectStorageService | null = null;
  let objectStorageError: string | null = null;
  
  try {
    objectStorageService = new ObjectStorageService();
    // Test access to environment variables
    objectStorageService.getPrivateObjectDir();
  } catch (error: any) {
    console.error("Object storage configuration error:", error.message);
    objectStorageError = error.message;
  }

  // Route to get upload URL for receipt images
  app.post("/api/receipts/upload", async (req, res) => {
    try {
      if (objectStorageError || !objectStorageService) {
        return res.status(500).json({ 
          error: "Object storage not configured", 
          details: objectStorageError 
        });
      }

      // Get the signed PUT URL for upload
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      // Compute the stable readable path from the upload URL
      const readablePath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      
      res.json({ 
        uploadURL,  // For uploading the file
        readablePath  // For storing in database and later reading
      });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.post("/api/fridge/scan", async (req, res) => {
    try {
      const { base64Image } = req.body ?? {};

      if (typeof base64Image !== "string" || !base64Image.trim()) {
        return res.status(400).json({ error: "base64Image is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const ingredients = await extractIngredientsFromFridge(base64Image);

      res.json({ ingredients });
    } catch (error) {
      console.error("Error scanning fridge:", error);
      res.status(500).json({ error: "Failed to scan fridge" });
    }
  });

  app.post("/api/meal-plans/generate", async (req, res) => {
    try {
      const schema = z.object({
        ingredients: z.array(z.string().trim().min(1)).min(1)
      });

      const parsed = schema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid ingredient list" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const mealPlans = await generateRecipesFromIngredients(parsed.data.ingredients);
      res.json({ mealPlans });
    } catch (error) {
      console.error("Error generating meal plans:", error);
      res.status(500).json({ error: "Failed to generate meal plans" });
    }
  });

  // Route to create a receipt record after upload
  app.post("/api/receipts", async (req, res) => {
    try {
      const validatedData = insertReceiptSchema.parse(req.body);
      const receipt = await storage.createReceipt(validatedData);
      res.json(receipt);
    } catch (error) {
      console.error("Error creating receipt:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create receipt" });
    }
  });

  // Route to process receipt with OpenAI Vision
  app.post("/api/receipts/:id/process", async (req, res) => {
    try {
      const { id } = req.params;
      const receipt = await storage.getReceipt(id);
      
      if (!receipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      let base64Image: string;
      
      // Handle different image URL formats
      if (receipt.imageUrl.startsWith('/objects/')) {
        // This is a readable path, fetch through our object storage service
        if (objectStorageError || !objectStorageService) {
          return res.status(500).json({ 
            error: "Object storage not configured", 
            details: objectStorageError 
          });
        }
        
        try {
          const objectFile = await objectStorageService.getObjectEntityFile(receipt.imageUrl);
          const stream = objectFile.createReadStream();
          
          // Convert stream to buffer
          const chunks: Buffer[] = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          const imageBuffer = Buffer.concat(chunks);
          base64Image = imageBuffer.toString('base64');
        } catch (objectError) {
          console.error("Error fetching from object storage:", objectError);
          return res.status(400).json({ error: "Failed to fetch receipt image from storage" });
        }
      } else {
        // This is a direct URL, fetch normally
        const imageResponse = await fetch(receipt.imageUrl);
        if (!imageResponse.ok) {
          return res.status(400).json({ error: "Failed to fetch receipt image" });
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        base64Image = Buffer.from(imageBuffer).toString('base64');
      }

      // Extract ingredients using OpenAI Vision
      const ingredients = await extractIngredientsFromReceipt(base64Image);
      
      // Generate recipes from ingredients
      const mealPlans = await generateRecipesFromIngredients(ingredients);

      // Update receipt with extracted data
      const updatedReceipt = await storage.updateReceipt(id, {
        ingredients,
        mealPlans
      });

      res.json(updatedReceipt);
    } catch (error) {
      console.error("Error processing receipt:", error);
      res.status(500).json({ error: "Failed to process receipt" });
    }
  });

  // Route to get all receipts
  app.get("/api/receipts", async (req, res) => {
    try {
      const receipts = await storage.getAllReceipts();
      res.json(receipts);
    } catch (error) {
      console.error("Error getting receipts:", error);
      res.status(500).json({ error: "Failed to get receipts" });
    }
  });

  // Route to get a specific receipt
  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const receipt = await storage.getReceipt(id);
      
      if (!receipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      res.json(receipt);
    } catch (error) {
      console.error("Error getting receipt:", error);
      res.status(500).json({ error: "Failed to get receipt" });
    }
  });

  // Route to serve uploaded objects (simplified for public access)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      if (objectStorageError || !objectStorageService) {
        console.error("Object storage not configured for serving objects", objectStorageError);
        return res.sendStatus(500);
      }
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Route to get affiliate product recommendations (GET and POST)
  const handleAffiliateProducts = async (req: any, res: any) => {
    try {
      const { context, recipeType, ingredients, maxItems } = req.query;
      const { recipes } = req.body || {};

      const products = await affiliateService.getProducts(
        (context as any) || 'general',
        {
          recipeType: recipeType as string,
          ingredients: ingredients ? (ingredients as string).split(',') : undefined,
          recipes: recipes || undefined,
          maxItems: maxItems ? parseInt(maxItems as string) : undefined
        }
      );

      res.json(products);
    } catch (error) {
      console.error("Error getting affiliate products:", error);
      res.status(500).json({ error: "Failed to get product recommendations" });
    }
  };

  // Saved Recipes Routes
  // For now, using a temporary user ID until authentication is implemented
  const TEMP_USER_ID = "temp-user-123";

  // Get all saved recipes for user
  app.get("/api/saved-recipes", async (req, res) => {
    try {
      const userSavedRecipes = await storage.select()
        .from(savedRecipes)
        .where(eq(savedRecipes.userId, TEMP_USER_ID))
        .orderBy(savedRecipes.createdAt);

      res.json(userSavedRecipes.map(sr => sr.recipe));
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      res.status(500).json({ error: "Failed to fetch saved recipes" });
    }
  });

  // Save a recipe
  app.post("/api/saved-recipes", async (req, res) => {
    try {
      const recipe: Recipe = req.body;

      if (!recipe || !recipe.id) {
        return res.status(400).json({ error: "Valid recipe required" });
      }

      // Check if recipe is already saved
      const existing = await storage.select()
        .from(savedRecipes)
        .where(and(
          eq(savedRecipes.userId, TEMP_USER_ID),
          sql`${savedRecipes.recipe}->>'id' = ${recipe.id}`
        ))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({ error: "Recipe already saved" });
      }

      // Save the recipe
      await storage.insert(savedRecipes).values({
        userId: TEMP_USER_ID,
        recipe: recipe
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error saving recipe:", error);
      res.status(500).json({ error: "Failed to save recipe" });
    }
  });

  // Delete a saved recipe
  app.delete("/api/saved-recipes/:recipeId", async (req, res) => {
    try {
      const { recipeId } = req.params;

      if (!recipeId) {
        return res.status(400).json({ error: "Recipe ID required" });
      }

      await storage.delete(savedRecipes)
        .where(and(
          eq(savedRecipes.userId, TEMP_USER_ID),
          sql`${savedRecipes.recipe}->>'id' = ${recipeId}`
        ));

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting saved recipe:", error);
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  });

  // Check if a recipe is saved
  app.get("/api/saved-recipes/:recipeId/status", async (req, res) => {
    try {
      const { recipeId } = req.params;

      if (!recipeId) {
        return res.status(400).json({ error: "Recipe ID required" });
      }

      const saved = await storage.select()
        .from(savedRecipes)
        .where(and(
          eq(savedRecipes.userId, TEMP_USER_ID),
          sql`${savedRecipes.recipe}->>'id' = ${recipeId}`
        ))
        .limit(1);

      res.json({ saved: saved.length > 0 });
    } catch (error) {
      console.error("Error checking recipe status:", error);
      res.status(500).json({ error: "Failed to check recipe status" });
    }
  });

  app.get("/api/affiliate/products", handleAffiliateProducts);
  app.post("/api/affiliate/products", handleAffiliateProducts);

  // Route to track affiliate clicks
  app.post("/api/affiliate/track", async (req, res) => {
    try {
      const { productId, context } = req.body;

      if (!productId) {
        return res.status(400).json({ error: "Product ID required" });
      }

      await affiliateService.trackClick(productId, context || 'unknown');

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking affiliate click:", error);
      res.status(500).json({ error: "Failed to track click" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
