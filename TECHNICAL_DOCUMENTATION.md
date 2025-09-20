# ReceiptChef Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Core Components](#core-components)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Authentication & Security](#authentication--security)
8. [External Integrations](#external-integrations)
9. [Deployment](#deployment)
10. [Debugging Guide](#debugging-guide)
11. [Common Issues & Solutions](#common-issues--solutions)
12. [Performance Optimization](#performance-optimization)
13. [Upgrade Guide](#upgrade-guide)

## System Overview

**ReceiptChef** is a full-stack web application that transforms grocery receipts into AI-powered meal plans. Users upload photos of receipts, and the system uses OpenAI's vision capabilities to extract ingredients and generate personalized recipes and weekly meal plans.

### Key Features
- Receipt image capture and upload
- AI-powered ingredient extraction from receipt images
- Intelligent meal plan generation based on available ingredients
- Recipe management with difficulty ratings and cooking times
- User authentication and personalized content
- Progressive Web App (PWA) with offline support

### Technology Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Routing | Wouter | Lightweight client-side routing |
| State Management | React Query (TanStack Query) | Server state synchronization |
| Styling | Tailwind CSS + shadcn/ui | Design system |
| Backend | Express.js + TypeScript | API server |
| Database | PostgreSQL (Neon) | Primary data store |
| ORM | Drizzle | Type-safe database queries |
| AI Integration | OpenAI API (GPT-4 Vision) | Receipt processing & recipe generation |
| Storage | Replit Object Storage | Receipt image storage |
| Build Tools | Vite (frontend), esbuild (backend) | Module bundling |

## Architecture

### System Architecture Diagram
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Client   │────▶│  Express Server  │────▶│   PostgreSQL    │
│   (TypeScript)  │     │   (TypeScript)   │     │    (Neon)       │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ├──────────────────────▶ OpenAI API
         │                       │                      (Vision + GPT-4)
         │                       │
         └───────────────────────┴──────────────────────▶ Object Storage
                                                        (Receipt Images)
```

### Directory Structure
```
ReceiptChef/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── ...       # Feature components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── main.tsx      # Application entry point
│   ├── public/           # Static assets
│   └── index.html        # HTML template
├── server/                # Backend application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   └── db.ts            # Database connection
├── shared/               # Shared code between client/server
│   ├── schema.ts        # Database schema (Drizzle)
│   ├── types.ts         # TypeScript type definitions
│   └── openai-helpers.ts # OpenAI utility functions
├── dist/                 # Production build output
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## Development Environment Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)
- OpenAI API key

### Environment Variables
Create `.env` file in project root:
```bash
# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# OpenAI
OPENAI_API_KEY=sk-...

# Server
PORT=5000

# Object Storage (Replit)
REPLIT_DB_URL=...
```

### Installation & Setup
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Available Scripts
| Command | Description |
|---------|------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Apply database migrations |

## Core Components

### Frontend Components

#### ReceiptUpload (`client/src/components/ReceiptUpload.tsx`)
Handles receipt image capture and upload.
- Camera integration for mobile devices
- File upload for desktop
- Image preview before submission
- Upload progress indication

#### MealPlanDisplay (`client/src/components/MealPlanDisplay.tsx`)
Displays generated meal plans.
- Weekly view with daily recipes
- Recipe cards with ingredients and instructions
- Difficulty and cooking time indicators
- Print-friendly layout

#### RecipeCard (`client/src/components/RecipeCard.tsx`)
Individual recipe display component.
- Ingredient list with quantities
- Step-by-step instructions
- Nutritional information (if available)
- Serving size adjustment

### Backend Services

#### Receipt Processing (`server/routes.ts:POST /api/receipts`)
```typescript
// Key responsibilities:
// 1. Validate uploaded image
// 2. Store in object storage
// 3. Extract ingredients via OpenAI Vision
// 4. Save to database
```

#### Meal Plan Generation (`server/routes.ts:GET /api/receipts/:id/meal-plan`)
```typescript
// Key responsibilities:
// 1. Fetch receipt ingredients
// 2. Generate recipes via OpenAI
// 3. Organize into weekly plan
// 4. Cache results
```

## API Reference

### Authentication Endpoints

#### POST /api/login
Authenticate user and create session.
```typescript
Request: {
  username: string;
  password: string;
}
Response: {
  user: { id: number; username: string; }
}
```

#### POST /api/register
Create new user account.
```typescript
Request: {
  username: string;
  password: string;
}
Response: {
  user: { id: number; username: string; }
}
```

### Receipt Endpoints

#### POST /api/receipts/upload
Get signed URL for image upload.
```typescript
Request: {
  filename: string;
  contentType: string;
}
Response: {
  uploadUrl: string;
  imageUrl: string;
}
```

#### POST /api/receipts
Create receipt and extract ingredients.
```typescript
Request: {
  imageUrl: string;
  userId: number;
}
Response: {
  id: number;
  ingredients: string[];
  createdAt: Date;
}
```

#### GET /api/receipts/:id
Get receipt details.
```typescript
Response: {
  id: number;
  imageUrl: string;
  ingredients: string[];
  mealPlan?: MealPlan;
  createdAt: Date;
}
```

#### GET /api/receipts/:id/meal-plan
Generate or retrieve meal plan.
```typescript
Response: {
  mealPlan: {
    recipes: Recipe[];
    weeklySchedule: { [day: string]: Recipe[] };
  }
}
```

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### receipts
```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  image_url TEXT NOT NULL,
  ingredients JSONB,
  meal_plan JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Type Definitions (`shared/types.ts`)
```typescript
interface Recipe {
  id: string;
  name: string;
  ingredients: { item: string; amount: string; }[];
  instructions: string[];
  cookingTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
}

interface MealPlan {
  recipes: Recipe[];
  weeklySchedule: {
    [day: string]: Recipe[];
  };
}
```

## Authentication & Security

### Session Management
- Express-session with secure cookies
- Session stored in PostgreSQL
- 24-hour session timeout
- HTTP-only cookies to prevent XSS

### Password Security
- Bcrypt hashing with salt rounds = 10
- Minimum password length: 8 characters
- No password complexity requirements (user choice)

### API Security
- CORS configured for production domain
- Rate limiting on authentication endpoints
- Input validation on all endpoints
- SQL injection prevention via parameterized queries (Drizzle)

## External Integrations

### OpenAI Integration

#### Configuration (`shared/openai-helpers.ts`)
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

#### Receipt Processing
Uses GPT-4 Vision to extract ingredients:
```typescript
async function extractIngredients(imageUrl: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Extract all food ingredients from this receipt" },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }],
    max_tokens: 1000
  });
  // Parse response and return ingredients
}
```

#### Recipe Generation
Uses GPT-4 to create recipes:
```typescript
async function generateMealPlan(ingredients: string[]): Promise<MealPlan> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are a professional chef creating meal plans..."
    }, {
      role: "user",
      content: `Create recipes using these ingredients: ${ingredients.join(', ')}`
    }],
    response_format: { type: "json_object" }
  });
  // Parse and return meal plan
}
```

### Object Storage (Replit)
Receipt images stored in Replit Object Storage:
- Max file size: 10MB
- Supported formats: JPEG, PNG, WEBP
- Automatic compression for images > 1MB
- CDN distribution for fast access

## Deployment

### Production Build
```bash
# Build both client and server
npm run build

# Output structure:
# dist/
#   ├── client/    # Static frontend files
#   └── server/    # Compiled server code
```

### Vercel Deployment
Configuration in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "server/index.js": {
      "maxDuration": 30
    }
  }
}
```

### Environment Configuration
Production environment variables:
- `NODE_ENV=production`
- `DATABASE_URL` - Production database
- `OPENAI_API_KEY` - API key with usage limits
- `SESSION_SECRET` - Strong random string

## Debugging Guide

### Common Debug Points

#### Frontend Debugging
1. **Network requests failing:**
   - Check browser DevTools Network tab
   - Verify API endpoint URLs in `client/src/lib/api.ts`
   - Check CORS configuration

2. **State management issues:**
   - Use React DevTools extension
   - Check React Query DevTools
   - Verify query keys match between components

3. **UI rendering problems:**
   - Check browser console for React errors
   - Verify Tailwind classes are compiled
   - Test responsive breakpoints

#### Backend Debugging
1. **Database connection issues:**
   ```typescript
   // server/db.ts - Add logging
   db.on('connect', () => console.log('Database connected'));
   db.on('error', (err) => console.error('Database error:', err));
   ```

2. **OpenAI API errors:**
   ```typescript
   // Add detailed error logging
   try {
     const response = await openai.chat.completions.create({...});
   } catch (error) {
     console.error('OpenAI Error:', {
       message: error.message,
       code: error.code,
       type: error.type
     });
   }
   ```

3. **Request validation failures:**
   - Log request body: `console.log('Request:', req.body)`
   - Check middleware order in `server/index.ts`
   - Verify JSON parsing middleware is applied

### Logging Strategy
```typescript
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

// Production logging (structured)
import winston from 'winston';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Common Issues & Solutions

### Issue: "Database connection timeout"
**Symptoms:** API requests hang, timeout errors in logs
**Solution:**
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:pass@host:5432/dbname?sslmode=require

# Test connection
npx drizzle-kit studio

# Check connection pool settings
# server/db.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Issue: "OpenAI rate limit exceeded"
**Symptoms:** 429 errors from OpenAI API
**Solution:**
```typescript
// Implement exponential backoff
async function withRetry(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } else {
        throw error;
      }
    }
  }
}
```

### Issue: "Receipt image upload fails"
**Symptoms:** Upload progress stuck, network errors
**Solution:**
```typescript
// Check file size before upload
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_SIZE) {
  // Compress image client-side
  const compressed = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8
  });
}

// Implement chunked upload for large files
```

### Issue: "Meal plan generation takes too long"
**Symptoms:** Timeout errors, slow API response
**Solution:**
```typescript
// Implement caching strategy
const cacheKey = `meal-plan:${receiptId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Generate in background
queue.add('generate-meal-plan', { receiptId });

// Return immediate response
return { status: 'processing', checkBackIn: 30 };
```

## Performance Optimization

### Frontend Optimizations
1. **Code Splitting:**
   ```typescript
   // Lazy load heavy components
   const MealPlanDisplay = lazy(() => import('./components/MealPlanDisplay'));
   ```

2. **Image Optimization:**
   ```typescript
   // Use responsive images
   <img
     srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
     sizes="(max-width: 320px) 280px, 640px"
   />
   ```

3. **Query Optimization:**
   ```typescript
   // Use React Query caching
   const { data } = useQuery({
     queryKey: ['receipt', id],
     queryFn: fetchReceipt,
     staleTime: 5 * 60 * 1000, // 5 minutes
     cacheTime: 10 * 60 * 1000, // 10 minutes
   });
   ```

### Backend Optimizations
1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_receipts_user_id ON receipts(user_id);
   CREATE INDEX idx_receipts_created_at ON receipts(created_at DESC);
   ```

2. **Query Optimization:**
   ```typescript
   // Use select specific columns
   const receipts = await db
     .select({
       id: receipts.id,
       imageUrl: receipts.imageUrl,
       createdAt: receipts.createdAt
     })
     .from(receipts)
     .where(eq(receipts.userId, userId))
     .limit(10);
   ```

3. **Caching Strategy:**
   - Redis for session storage
   - CDN for static assets
   - Database query result caching
   - OpenAI response caching

## Upgrade Guide

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update minor versions
npm update

# Update major versions (test thoroughly)
npm install package@latest

# Run tests after updates
npm test
npm run check
```

### Database Migrations
```bash
# Generate migration
npx drizzle-kit generate:pg

# Review migration file
cat drizzle/NNNN_migration.sql

# Apply migration
npx drizzle-kit push:pg

# Rollback if needed
npx drizzle-kit drop
```

### Breaking Changes Checklist
Before deploying major updates:
- [ ] Backup database
- [ ] Test migration on staging
- [ ] Update API documentation
- [ ] Notify frontend team of API changes
- [ ] Update environment variables
- [ ] Plan rollback strategy
- [ ] Monitor error rates post-deployment

### Version Compatibility Matrix
| Component | Current | Maximum Compatible |
|-----------|---------|-------------------|
| Node.js | 18.x | 20.x |
| React | 18.2 | 18.x |
| TypeScript | 5.0 | 5.x |
| PostgreSQL | 14 | 16 |
| OpenAI SDK | 4.x | 4.x |

## Monitoring & Observability

### Key Metrics to Monitor
- API response times (P50, P95, P99)
- Database query performance
- OpenAI API usage and costs
- Error rates by endpoint
- User session duration
- Receipt processing success rate

### Health Check Endpoint
```typescript
// GET /api/health
app.get('/api/health', async (req, res) => {
  const checks = {
    server: 'ok',
    database: await checkDatabase(),
    openai: await checkOpenAI(),
    storage: await checkStorage(),
  };

  const healthy = Object.values(checks).every(v => v === 'ok');
  res.status(healthy ? 200 : 503).json(checks);
});
```

### Error Tracking
Implement Sentry or similar:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.errorHandler());
```

## Support & Resources

### Internal Resources
- Repository: `github.com/[org]/ReceiptChef`
- CI/CD Pipeline: GitHub Actions / Vercel
- Monitoring Dashboard: [Internal URL]
- Runbook: [Internal Wiki]

### External Documentation
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [PostgreSQL Manual](https://www.postgresql.org/docs)

### Contact
- Technical Lead: [Email]
- DevOps Team: [Email]
- On-call Rotation: [PagerDuty]

---

*Last Updated: January 2025*
*Version: 1.0.0*