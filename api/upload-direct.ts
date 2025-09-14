import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
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

    // Get filename from query parameter
    const { filename } = req.query;
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename parameter required' });
    }

    // Get file data from request body (raw binary data from frontend)
    const contentType = req.headers['content-type'] || 'image/jpeg';

    // Convert the request body to a buffer
    let fileBuffer: Buffer;
    if (req.body instanceof Buffer) {
      fileBuffer = req.body;
    } else if (typeof req.body === 'string') {
      fileBuffer = Buffer.from(req.body, 'binary');
    } else {
      fileBuffer = Buffer.from(req.body);
    }

    // Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType,
    });

    // Return the blob URL that matches what the client expects
    res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}