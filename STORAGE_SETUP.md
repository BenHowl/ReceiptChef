# Vercel Blob Storage Setup Guide

## What Changed
✅ **Replaced Replit Object Storage with Vercel Blob Storage**

Your app now uses Vercel Blob Storage for receipt image uploads and processing.

## Required Environment Variables

### 1. Get Vercel Blob Storage Token

1. **Go to Vercel Dashboard** → Your Project → Storage tab
2. **Create a new Blob Store** (if you don't have one)
3. **Copy the `BLOB_READ_WRITE_TOKEN`**

### 2. Set Environment Variables

**Option A: Via Vercel CLI**
```bash
vercel env add BLOB_READ_WRITE_TOKEN
# Paste your token when prompted
```

**Option B: Via Vercel Dashboard**
- Go to Project Settings → Environment Variables
- Add `BLOB_READ_WRITE_TOKEN` with your token

**Option C: Local Development (.env.local)**
```bash
# Create .env.local file
echo "BLOB_READ_WRITE_TOKEN=your-actual-token-here" > .env.local
```

## How the New Storage Works

### Upload Flow:
1. **Client** → `POST /api/receipts/upload`
2. **Server** returns upload endpoint info
3. **Client** → `POST /api/upload-direct` with base64 image
4. **Vercel Blob** stores image and returns public URL
5. **Database** stores the public URL

### Processing Flow:
1. **Client** → `POST /api/receipts/[id]/process`
2. **Server** fetches image from Vercel Blob URL
3. **OpenAI Vision** processes base64 image
4. **Database** stores extracted ingredients

## API Changes Summary

**New Endpoints:**
- `/api/upload-direct` - Direct file upload to Vercel Blob

**Updated Endpoints:**
- `/api/receipts/upload` - Now returns Vercel Blob upload info
- `/api/receipts/[id]/process` - Uses Vercel Blob for image fetching

## Testing Storage Setup

### 1. Test Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/receipts/upload
```

### 2. Test Direct Upload
```bash
curl -X POST http://localhost:3000/api/upload-direct \\
  -H "Content-Type: application/json" \\
  -d '{"file": "base64-image-data-here", "contentType": "image/jpeg"}'
```

### 3. Check Vercel Blob Dashboard
- Go to Vercel Dashboard → Storage → Blob
- Verify uploaded files appear

## Troubleshooting

**❌ "BLOB_READ_WRITE_TOKEN not set"**
- Make sure environment variable is set correctly
- For local development, use `.env.local` file

**❌ "Failed to upload file"**
- Check token permissions in Vercel dashboard
- Verify file data is valid base64

**❌ "Receipt image not found"**
- Image URL might be invalid
- Check Vercel Blob dashboard for uploaded files

## Benefits of Vercel Blob Storage

✅ **Seamless Vercel integration**
✅ **Public URLs for easy access**
✅ **Automatic CDN distribution**
✅ **Simple API, no signed URLs needed**
✅ **Built-in access control**

## Migration Notes

- **Old Replit Object Storage code removed**
- **New VercelBlobStorageService class created**
- **API endpoints updated to use Vercel Blob**
- **No changes needed to frontend code** (same API interface)