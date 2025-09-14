import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import OpenAI from "openai";

// Simple in-memory storage for this endpoint
const receipts = new Map();

// Recipe and MealPlan types
interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealPlan {
  id: string;
  day: string;
  recipes: Recipe[];
  generatedAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST' && !req.query.id && !req.query.action) {
      // Create receipt with direct file upload
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }

      const id = randomUUID();
      const receipt = {
        id,
        imageUrl,
        ingredients: [],
        mealPlans: [],
        createdAt: new Date().toISOString()
      };

      receipts.set(id, receipt);

      // Immediately process the receipt
      try {
        // Check environment variables
        if (!process.env.OPENAI_API_KEY) {
          return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        // Get image as base64
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          return res.status(404).json({ error: 'Receipt image not found' });
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Extract ingredients using OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert at analyzing grocery receipts. Extract all food ingredients from the receipt image. Return only a JSON object with an 'ingredients' array containing the food items."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this grocery receipt and extract all the food ingredients. Return a JSON object with an 'ingredients' array."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ],
            },
          ],
          max_tokens: 1000,
          response_format: { type: "json_object" },
        });

        const ingredientResult = JSON.parse(visionResponse.choices[0].message.content || '{"ingredients": []}');
        const ingredients = ingredientResult.ingredients || [];

        // Generate meal plans
        const mealPlanResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional chef and meal planning expert. Create personalized meal plans using the provided ingredients. Generate 3 different meal plans for different days, each containing breakfast, lunch, and dinner recipes.

Return a JSON object with this structure:
{
  "mealPlans": [
    {
      "id": "unique-id",
      "day": "Day 1",
      "recipes": [
        {
          "id": "unique-id",
          "title": "Recipe Name",
          "description": "Brief description",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "cookingTime": 30,
          "servings": 4,
          "difficulty": "easy",
          "mealType": "breakfast"
        }
      ],
      "generatedAt": "2025-09-12T19:00:00.000Z"
    }
  ]
}`
            },
            {
              role: "user",
              content: `Generate meal plans using these ingredients: ${ingredients.join(", ")}`
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 3000,
        });

        const mealPlanResult = JSON.parse(mealPlanResponse.choices[0].message.content || '{"mealPlans": []}');
        const mealPlans = mealPlanResult.mealPlans || [];

        // Update receipt
        receipt.ingredients = ingredients;
        receipt.mealPlans = mealPlans;
        receipts.set(id, receipt);

        return res.json(receipt);
      } catch (error) {
        console.error('Error processing receipt:', error);
        // Return the receipt even if processing fails
        return res.json(receipt);
      }
    }

    if (req.method === 'POST' && req.query.action === 'upload') {
      // Handle file upload directly in this endpoint
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(500).json({ error: 'Blob storage not configured' });
      }

      try {
        const filename = `receipts/${randomUUID()}.jpg`;

        // Get file from request body
        let fileBuffer: Buffer;
        if (req.body instanceof Buffer) {
          fileBuffer = req.body;
        } else {
          fileBuffer = Buffer.from(req.body);
        }

        // Upload to Vercel Blob
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          contentType: req.headers['content-type'] || 'image/jpeg',
        });

        return res.json({
          url: blob.url,
          downloadUrl: blob.downloadUrl,
        });
      } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
      }
    }

    if (req.method === 'POST' && req.query.id) {
      // Process receipt
      const { id } = req.query;
      const receipt = receipts.get(id);

      if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found' });
      }

      // Check environment variables
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      // Get image as base64
      try {
        const imageResponse = await fetch(receipt.imageUrl);
        if (!imageResponse.ok) {
          return res.status(404).json({ error: 'Receipt image not found' });
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Extract ingredients using OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert at analyzing grocery receipts. Extract all food ingredients from the receipt image. Return only a JSON object with an 'ingredients' array containing the food items."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this grocery receipt and extract all the food ingredients. Return a JSON object with an 'ingredients' array."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ],
            },
          ],
          max_tokens: 1000,
          response_format: { type: "json_object" },
        });

        const ingredientResult = JSON.parse(visionResponse.choices[0].message.content || '{"ingredients": []}');
        const ingredients = ingredientResult.ingredients || [];

        // Generate meal plans
        const mealPlanResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional chef and meal planning expert. Create personalized meal plans using the provided ingredients. Generate 3 different meal plans for different days, each containing breakfast, lunch, and dinner recipes.

Return a JSON object with this structure:
{
  "mealPlans": [
    {
      "id": "unique-id",
      "day": "Day 1",
      "recipes": [
        {
          "id": "unique-id",
          "title": "Recipe Name",
          "description": "Brief description",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "cookingTime": 30,
          "servings": 4,
          "difficulty": "easy",
          "mealType": "breakfast"
        }
      ],
      "generatedAt": "2025-09-12T19:00:00.000Z"
    }
  ]
}`
            },
            {
              role: "user",
              content: `Generate meal plans using these ingredients: ${ingredients.join(", ")}`
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 3000,
        });

        const mealPlanResult = JSON.parse(mealPlanResponse.choices[0].message.content || '{"mealPlans": []}');
        const mealPlans = mealPlanResult.mealPlans || [];

        // Update receipt
        receipt.ingredients = ingredients;
        receipt.mealPlans = mealPlans;
        receipts.set(id, receipt);

        return res.json(receipt);
      } catch (error) {
        console.error('Error processing receipt:', error);
        return res.status(500).json({ error: 'Failed to process receipt' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}