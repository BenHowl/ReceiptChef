import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../server/storage';
import { generateRecipesFromIngredients } from '../../../server/openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const receipt = await storage.getReceipt(id as string);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (!receipt.ingredients || receipt.ingredients.length === 0) {
      return res.status(400).json({ error: "Receipt has no ingredients. Please process the receipt first." });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Generate meal plans from ingredients
    const mealPlans = await generateRecipesFromIngredients(receipt.ingredients);

    // Update receipt with generated meal plans
    const updatedReceipt = await storage.updateReceipt(id as string, { mealPlans });

    res.json(updatedReceipt);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
}