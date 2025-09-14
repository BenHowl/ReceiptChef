import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../server/storage';

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

    res.json(receipt);
  } catch (error) {
    console.error("Error getting receipt:", error);
    res.status(500).json({ error: "Failed to get receipt" });
  }
}