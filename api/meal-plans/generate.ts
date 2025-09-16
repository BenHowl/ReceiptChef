import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { generateRecipesFromIngredients } from '../_lib/openai';

const requestSchema = z.object({
  ingredients: z.array(z.string().trim().min(1)).min(1)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = requestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const mealPlans = await generateRecipesFromIngredients(parsed.data.ingredients);
    return res.json({ mealPlans });
  } catch (error) {
    console.error('Error generating meal plans:', error);
    return res.status(500).json({ error: 'Failed to generate meal plans' });
  }
}
