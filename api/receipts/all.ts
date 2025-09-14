import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const receipts = await storage.getAllReceipts();
    res.json(receipts);
  } catch (error) {
    console.error("Error getting receipts:", error);
    res.status(500).json({ error: "Failed to get receipts" });
  }
}