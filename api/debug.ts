import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const envVars = {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      blobTokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
      openaiTokenLength: process.env.OPENAI_API_KEY?.length || 0
    };

    res.json(envVars);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}