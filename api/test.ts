import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.json({
      message: 'Test endpoint working',
      method: req.method,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
      openaiLength: process.env.OPENAI_API_KEY?.length || 0,
      blobLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint failed', details: String(error) });
  }
}