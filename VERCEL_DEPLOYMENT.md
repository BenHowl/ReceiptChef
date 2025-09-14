# Vercel Deployment Guide

## Migration from Replit to Vercel

### What Changed
- ✅ **Frontend**: No changes needed - Vite build works perfectly
- ✅ **API Routes**: Converted Express routes to Vercel serverless functions in `/api` directory
- ⚠️  **Object Storage**: Need to replace Replit Object Storage

### Pre-deployment Steps

1. **Install Dependencies**
   ```bash
   npm install @vercel/node
   ```

2. **Set Up Object Storage Alternative**

   **Option A: Vercel Blob Storage (Recommended)**
   ```bash
   npm install @vercel/blob
   ```
   - Create a new blob store in Vercel dashboard
   - Add `BLOB_READ_WRITE_TOKEN` environment variable

   **Option B: AWS S3**
   ```bash
   npm install aws-sdk
   ```

   **Option C: Google Cloud Storage (Already installed)**
   - Update `server/objectStorage.ts` to use GCS instead of Replit

### Deployment Commands

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **First Deployment**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Environment Variables Setup

Run these commands to set environment variables:

```bash
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add BLOB_READ_WRITE_TOKEN  # If using Vercel Blob
```

Or set them in the Vercel dashboard under Project Settings > Environment Variables.

### API Route Changes

Your Express routes have been converted to:
- `/api/receipts/upload` → Upload receipt images
- `/api/receipts` → Create new receipts
- `/api/receipts/all` → Get all receipts
- `/api/receipts/[id]` → Get specific receipt
- `/api/receipts/[id]/process` → Process receipt with AI
- `/api/receipts/[id]/meal-plan` → Generate meal plan

### Storage Migration Required

⚠️ **Important**: You'll need to update `server/objectStorage.ts` to work with a new storage provider since Replit Object Storage won't work on Vercel.

**Quick Fix**: Replace Replit Object Storage with Vercel Blob Storage or AWS S3.

### Testing

1. Test locally:
   ```bash
   vercel dev
   ```

2. Test API endpoints:
   ```bash
   curl http://localhost:3000/api/receipts/all
   ```

3. Deploy to preview:
   ```bash
   vercel
   ```

### Next Steps After Deployment

1. Update frontend API calls if domain changes
2. Test receipt upload and processing
3. Migrate existing receipt images if needed
4. Update database connections for production