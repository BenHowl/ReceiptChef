import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VercelBlobStorageService } from '../../server/vercelBlobStorage';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For Vercel Blob, we can either:
    // 1. Handle file upload directly in this endpoint (simpler)
    // 2. Return a pre-generated filename for client-side upload

    // Check if this is a direct file upload
    if (req.body && req.body.file) {
      // Direct upload approach
      try {
        const blobStorageService = new VercelBlobStorageService();
        const filename = await blobStorageService.getObjectEntityUploadURL();

        // Convert base64 to buffer if needed
        const fileData = req.body.file;
        let buffer: Buffer;

        if (typeof fileData === 'string') {
          // Assume base64
          buffer = Buffer.from(fileData, 'base64');
        } else {
          buffer = Buffer.from(fileData);
        }

        const url = await blobStorageService.uploadFile(filename, buffer, req.body.contentType || 'image/jpeg');

        res.json({
          uploadURL: url,
          readablePath: url
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
      }
    } else {
      // Return upload endpoint for client-side upload
      try {
        const blobStorageService = new VercelBlobStorageService();
        const filename = await blobStorageService.getObjectEntityUploadURL();

        res.json({
          uploadURL: `/api/upload-direct`,  // New endpoint for direct uploads
          filename: filename,  // Filename to use
          readablePath: filename  // Will be the final URL after upload
        });
      } catch (error) {
        console.error("Error preparing upload:", error);
        res.status(500).json({ error: "Failed to prepare upload" });
      }
    }
  } catch (error) {
    console.error("Error in upload handler:", error);
    res.status(500).json({ error: "Failed to handle upload request" });
  }
}