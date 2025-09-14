import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    res.json({
      message: 'Receipts test endpoint working',
      body: req.body,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Receipts test error:', error);
    res.status(500).json({ error: 'Test failed', details: String(error) });
  }
}