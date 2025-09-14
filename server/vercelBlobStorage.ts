// Vercel Blob Storage service for the Recipe Generator app
// Replaces Replit Object Storage with Vercel Blob
import { put, head, del } from '@vercel/blob';
import { randomUUID } from "crypto";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class VercelBlobStorageService {
  private token: string;

  constructor() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN not set. Create a Vercel Blob store and set the environment variable."
      );
    }
    this.token = token;
  }

  // Gets the upload URL for an object entity (simplified for Vercel Blob)
  async getObjectEntityUploadURL(): Promise<string> {
    // With Vercel Blob, we generate a unique filename and return it
    // The actual upload will happen via the put() function
    const objectId = randomUUID();
    const filename = `receipts/${objectId}.jpg`; // assuming receipt images are JPEGs

    // Return the filename that will be used for upload
    // Note: Vercel Blob doesn't use signed URLs like S3, it uploads directly
    return filename;
  }

  // Upload file directly to Vercel Blob
  async uploadFile(filename: string, file: ArrayBuffer | Buffer | ReadableStream, contentType = 'image/jpeg'): Promise<string> {
    try {
      const blob = await put(filename, file, {
        access: 'public', // or 'private' based on your needs
        contentType,
        token: this.token,
      });

      return blob.url;
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw new Error('Failed to upload file to Vercel Blob');
    }
  }

  // Get file as base64 (for OpenAI Vision API)
  async getObjectEntityBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new ObjectNotFoundError();
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString('base64');
    } catch (error) {
      console.error('Error fetching blob for base64:', error);
      if (error instanceof ObjectNotFoundError) {
        throw error;
      }
      throw new Error('Failed to fetch file from Vercel Blob');
    }
  }

  // Check if file exists
  async fileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Delete file from Vercel Blob
  async deleteFile(url: string): Promise<void> {
    try {
      await del(url, { token: this.token });
    } catch (error) {
      console.error('Error deleting from Vercel Blob:', error);
      throw new Error('Failed to delete file from Vercel Blob');
    }
  }

  // Get file metadata
  async getFileMetadata(url: string) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new ObjectNotFoundError();
      }

      return {
        size: response.headers.get('content-length'),
        contentType: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified'),
      };
    } catch (error) {
      console.error('Error getting blob metadata:', error);
      if (error instanceof ObjectNotFoundError) {
        throw error;
      }
      throw new Error('Failed to get file metadata from Vercel Blob');
    }
  }

  // Normalize paths (simplified since Vercel Blob uses direct URLs)
  normalizeObjectEntityPath(rawPath: string): string {
    // Vercel Blob returns direct URLs, so we can return them as-is
    return rawPath;
  }

  // For backward compatibility, create a simple method that matches your current interface
  async getObjectEntityFile(objectPath: string): Promise<{ url: string; exists: boolean }> {
    // Since Vercel Blob uses URLs, we treat the objectPath as a URL
    const exists = await this.fileExists(objectPath);
    return { url: objectPath, exists };
  }
}