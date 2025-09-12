import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { extractIngredientsFromReceipt, generateRecipesFromIngredients } from "./openai";
import { insertReceiptSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
