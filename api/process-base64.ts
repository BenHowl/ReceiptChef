import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";
import { randomUUID } from 'crypto';

// Simple in-memory storage
const receipts = new Map();

// Types
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'base64Image is required' });
    }

    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const id = randomUUID();

    // Process with OpenAI directly using base64
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Extract ingredients
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

    const result = {
      id,
      ingredients,
      mealPlans,
      createdAt: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process receipt', details: String(error) });
  }
}