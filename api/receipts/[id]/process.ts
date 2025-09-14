import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../server/storage';
import { VercelBlobStorageService, ObjectNotFoundError } from '../../../server/vercelBlobStorage';
import { extractIngredientsFromReceipt, generateRecipesFromIngredients } from '../../../server/openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const receipt = await storage.getReceipt(id as string);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    let base64Image: string;
    try {
      const blobStorageService = new VercelBlobStorageService();
      base64Image = await blobStorageService.getObjectEntityBase64(receipt.imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Receipt image not found" });
      }
      return res.status(500).json({ error: "Failed to fetch receipt image" });
    }

    // Extract ingredients from receipt using OpenAI Vision
    const ingredients = await extractIngredientsFromReceipt(base64Image);

    // Generate meal plans from extracted ingredients
    const mealPlans = await generateRecipesFromIngredients(ingredients);

    // Update receipt with extracted ingredients and meal plans
    const updatedReceipt = await storage.updateReceipt(id as string, { ingredients, mealPlans });

    res.json(updatedReceipt);
  } catch (error) {
    console.error("Error processing receipt:", error);
    res.status(500).json({ error: "Failed to process receipt" });
  }
}