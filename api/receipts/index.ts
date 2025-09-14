import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertReceiptSchema } from '../../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}