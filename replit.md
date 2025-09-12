# Recipe Generator Application

## Overview

This is a full-stack Recipe Generator application that transforms grocery receipts into personalized meal plans using AI-powered recipe suggestions. Users can upload receipt images, extract ingredient information, and receive customized recipes and meal plans based on their purchased ingredients. The application features a modern, clean interface with support for both light and dark themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript for type safety and better developer experience
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** React Query (@tanstack/react-query) for server state management with built-in caching, background updates, and error handling
- **Styling:** Tailwind CSS with custom design system implementation
- **UI Components:** shadcn/ui component library built on Radix UI primitives for accessibility and consistency

**Component Structure:**
- Modular component architecture with clear separation of concerns
- Custom hooks for shared logic (theme management, mobile detection)
- Example components for development and testing purposes
- Responsive design with mobile-first approach using Tailwind breakpoints

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js framework
- **Language:** TypeScript for full-stack type safety
- **Database ORM:** Drizzle ORM for type-safe database operations
- **Database:** PostgreSQL via Neon serverless database
- **Development:** Vite for fast development server and hot module replacement

**API Design:**
- RESTful API structure with `/api` prefix for all routes
- Centralized error handling middleware
- Request/response logging for debugging
- Storage abstraction layer with in-memory implementation for development

### Database Schema

**Core Tables:**
- **users:** User authentication with username/password
- **receipts:** Receipt storage with image URLs, extracted ingredients, and generated meal plans
- **Embedded Types:** Recipe and MealPlan types stored as JSON fields for flexibility

**Data Models:**
- Strongly typed schemas using Drizzle Zod integration
- Support for complex nested data structures (recipes within meal plans)
- UUID primary keys for all entities

### Authentication and Authorization

Currently implements a basic storage interface with user management capabilities. The system is designed to support session-based authentication with potential for extension to more sophisticated auth systems.

### Design System

**Visual Identity:**
- Custom color palette with forest green primary (#46 69% 42%) and warm orange accent (#25 85% 60%)
- Inter font family for clean, readable typography
- Consistent spacing using Tailwind's 4-unit system
- Support for both light and dark themes with CSS custom properties

**Component Design:**
- Card-based layouts for content organization
- Subtle shadows and rounded corners for modern appearance
- Hover and active states with elevation effects
- Mobile-responsive design with drawer/dialog patterns

## External Dependencies

### Core Framework Dependencies

- **@tanstack/react-query:** Server state management and caching
- **wouter:** Lightweight routing library
- **drizzle-orm & drizzle-kit:** Type-safe ORM and migration tools
- **@neondatabase/serverless:** Neon PostgreSQL serverless driver

### UI and Styling Dependencies

- **tailwindcss:** Utility-first CSS framework
- **@radix-ui/*:** Accessible UI primitives for components
- **class-variance-authority:** Type-safe CSS class composition
- **lucide-react:** Icon library for consistent iconography

### Development and Build Tools

- **vite:** Build tool and development server
- **typescript:** Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal:** Development error overlay
- **@replit/vite-plugin-cartographer:** Replit integration for development

### Image and Media Handling

The application includes camera and file upload capabilities for receipt processing, with built-in image compression and validation features.

### Database and Storage

- **PostgreSQL:** Primary database via Neon serverless
- **connect-pg-simple:** Session storage adapter
- **File Storage:** Currently using in-memory storage with interfaces designed for easy extension to persistent storage solutions

The architecture is designed for scalability and maintainability, with clear separation between frontend and backend concerns, type safety throughout the stack, and a component-based approach that facilitates testing and future enhancements.