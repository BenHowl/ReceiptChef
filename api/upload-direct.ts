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

    // Handle multipart form data or JSON body
    const contentType = req.headers['content-type'] || '';
    let fileBuffer: Buffer;
    let filename: string;

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form upload (if using form data)
      return res.status(400).json({
        error: 'Multipart uploads not implemented yet. Use JSON body with base64 file data.'
      });
    } else if (contentType.includes('application/json')) {
      // Handle JSON body with base64 file data
      const { file, filename: providedFilename, contentType: fileContentType } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No file data provided' });
      }

      // Generate filename if not provided
      filename = providedFilename || `receipts/${randomUUID()}.jpg`;

      // Convert base64 to buffer
      if (typeof file === 'string') {
        // Remove data URL prefix if present (data:image/jpeg;base64,...)
        const base64Data = file.replace(/^data:[^;]+;base64,/, '');
        fileBuffer = Buffer.from(base64Data, 'base64');
      } else {
        fileBuffer = Buffer.from(file);
      }

      // Upload to Vercel Blob
      const blob = await put(filename, fileBuffer, {
        access: 'public',
        contentType: fileContentType || 'image/jpeg',
      });

      res.json({
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        size: blob.size,
      });
    } else {
      return res.status(400).json({ error: 'Unsupported content type' });
    }
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}