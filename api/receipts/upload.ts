import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        error: 'Blob storage not configured',
        details: 'BLOB_READ_WRITE_TOKEN environment variable not set'
      });
    }

    // Generate a unique filename for this upload
    const filename = `receipts/${randomUUID()}.jpg`;

    // Since Vercel Blob doesn't support signed URLs like S3,
    // we'll return our direct upload endpoint with the filename
    res.json({
      uploadURL: `/api/upload-direct?filename=${encodeURIComponent(filename)}`,
      readablePath: filename  // This will become the final blob URL after upload
    });
  } catch (error) {
    console.error("Error preparing upload:", error);
    res.status(500).json({ error: "Failed to prepare upload" });
  }
}