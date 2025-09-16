import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractIngredientsFromReceipt } from './_lib/openai.js';

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

    const ingredients = await extractIngredientsFromReceipt(base64Image);

    res.json({ ingredients });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process receipt', details: String(error) });
  }
}
