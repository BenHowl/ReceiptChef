// Shared OpenAI helpers for both server and serverless functions
import OpenAI from "openai";
import type { MealPlan } from "../../shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

async function tryOpenAIWithFallback<T>(
  requestFn: (client: OpenAI, model: string) => Promise<T>,
  modelOrder: string[] = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"]
): Promise<T> {
  const client = getOpenAIClient();

  for (let i = 0; i < modelOrder.length; i++) {
    const model = modelOrder[i];
    try {
      console.log(`Attempting OpenAI request with model: ${model}`);
      return await requestFn(client, model);
    } catch (error: any) {
      console.error(`Error with model ${model}:`, error?.message || error);

      if (i === modelOrder.length - 1) {
        throw error;
      }

      if (
        error?.status === 404 ||
        error?.code === "model_not_found" ||
        error?.message?.includes("model") ||
        error?.message?.includes("Model")
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("All OpenAI models failed");
}

export async function extractIngredientsFromReceipt(base64Image: string): Promise<string[]> {
  try {
    const visionResponse = await tryOpenAIWithFallback(async (client, model) => {
      return await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at analyzing grocery receipts. Extract all food ingredients from the receipt image. Return only a JSON object with an 'ingredients' array containing the food items. Focus on actual food ingredients, not non-food items like paper towels or cleaning supplies.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this grocery receipt and extract all the food ingredients. Return a JSON object with an 'ingredients' array.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });
    });

    const result = JSON.parse(visionResponse.choices[0].message.content || '{"ingredients": []}');
    return result.ingredients || [];
  } catch (error) {
    console.error("Error extracting ingredients:", error);
    throw new Error("Failed to extract ingredients from receipt");
  }
}

export async function extractIngredientsFromFridge(base64Image: string): Promise<string[]> {
  try {
    const visionResponse = await tryOpenAIWithFallback(async (client, model) => {
      return await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You inspect refrigerator photos and list groceries you can clearly identify. Return only JSON with an 'ingredients' array describing distinct food items. Use generic ingredient names, combine duplicate items, and skip anything you can't confidently recognize or that's not edible.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Look at this fridge photo and list every edible ingredient. Return JSON only." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });
    });

    const result = JSON.parse(visionResponse.choices[0].message.content || '{"ingredients": []}');
    return result.ingredients || [];
  } catch (error) {
    console.error("Error extracting fridge ingredients:", error);
    throw new Error("Failed to extract ingredients from fridge photo");
  }
}

export async function generateRecipesFromIngredients(ingredients: string[]): Promise<MealPlan[]> {
  try {
    const response = await tryOpenAIWithFallback(async (client, model) => {
      return await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: `You are a professional chef and meal planning expert. Create personalized meal plans using the provided ingredients. Generate 3 different meal plans for different days, each containing breakfast, lunch, and dinner recipes. \n\nReturn a JSON object with this structure:\n{\n  \"mealPlans\": [\n    {\n      \"id\": \"unique-id\",\n      \"day\": \"Day 1\",\n      \"recipes\": [\n        {\n          \"id\": \"unique-id\",\n          \"title\": \"Recipe Name\",\n          \"description\": \"Brief description\",\n          \"ingredients\": [\"ingredient1\", \"ingredient2\"],\n          \"instructions\": [\"step1\", \"step2\"],\n          \"cookingTime\": 30,\n          \"servings\": 4,\n          \"difficulty\": \"easy\",\n          \"mealType\": \"breakfast\"\n        }\n      ],\n      \"generatedAt\": \"2025-09-12T19:00:00.000Z\"\n    }\n  ]\n}\n\nMake sure each meal plan has exactly 3 recipes (breakfast, lunch, dinner). Use as many of the provided ingredients as possible across all recipes. Be creative and practical.`
          },
          {
            role: "user",
            content: `Generate meal plans using these ingredients: ${ingredients.join(", ")}`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });
    });

    const result = JSON.parse(response.choices[0].message.content || '{"mealPlans": []}');
    return result.mealPlans || [];
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes from ingredients");
  }
}
