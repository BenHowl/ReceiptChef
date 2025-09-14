# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Type checking:**
```bash
npm run check
```

**Database migrations:**
```bash
npm run db:push
```

## Architecture Overview

This is a full-stack Recipe Generator application built with **React + TypeScript frontend** and **Express.js + TypeScript backend**, designed to transform grocery receipts into AI-powered meal plans.

### Project Structure
- `client/` - React frontend with Vite build system
- `server/` - Express.js API server with TypeScript
- `shared/` - Shared TypeScript types and database schema
- `dist/` - Production build output

### Key Technologies
- **Frontend:** React 18, TypeScript, Wouter routing, React Query state management, Tailwind CSS + shadcn/ui components
- **Backend:** Express.js, Drizzle ORM, PostgreSQL (Neon), OpenAI API integration
- **Database:** PostgreSQL with Drizzle schema in `shared/schema.ts`
- **Build:** Vite (client), esbuild (server), TypeScript compilation

## Database Schema

Core tables defined in `shared/schema.ts`:
- `users` - Authentication (username/password)
- `receipts` - Receipt images, extracted ingredients, generated meal plans

Key types:
- `Recipe` - Individual recipe with ingredients, instructions, cooking time, difficulty
- `MealPlan` - Collection of recipes organized by day

## API Routes

Main API endpoints in `server/routes.ts`:
- `POST /api/receipts/upload` - Get signed URL for receipt image upload
- `POST /api/receipts` - Create receipt record and extract ingredients via OpenAI
- `GET /api/receipts/:id/meal-plan` - Generate meal plan from receipt ingredients

## Key Features

1. **Receipt Processing:** Upload receipt images → OpenAI extracts ingredients → Store in database
2. **Meal Plan Generation:** AI generates recipes and weekly meal plans from detected ingredients
3. **Object Storage:** Integration with Replit Object Storage for receipt images
4. **Responsive UI:** Mobile-first design with camera capture support

## Development Notes

- **Port Configuration:** Development server runs on port 5000 (configurable via PORT env var)
- **Database:** Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **AI Integration:** Uses OpenAI API for ingredient extraction and recipe generation
- **Path Aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`
- **Environment:** Replit-optimized with hot reload and error overlay plugins

## Design System

- **Colors:** Forest green primary (#46 69% 42%), warm orange accent (#25 85% 60%)
- **Typography:** Inter font family throughout
- **Components:** Built on Radix UI primitives via shadcn/ui
- **Theming:** Light/dark mode support with CSS custom properties
- **Layout:** Card-based design with consistent Tailwind spacing (4, 6, 8, 12 units)