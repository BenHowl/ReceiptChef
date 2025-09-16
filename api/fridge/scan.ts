import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractIngredientsFromFridge } from '../_lib/openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Image } = req.body ?? {};

    if (typeof base64Image !== 'string' || !base64Image.trim()) {
      return res.status(400).json({ error: 'base64Image is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const ingredients = await extractIngredientsFromFridge(base64Image);

    return res.json({ ingredients });
  } catch (error) {
    console.error('Error scanning fridge:', error);
    return res.status(500).json({ error: 'Failed to scan fridge' });
  }
}
