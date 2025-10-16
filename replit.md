# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV/large screen interfaces. The application provides users with access to radio stations from around the world, organized by genres and countries. It features an onboarding flow, authentication system, station discovery, favorites management, and playback controls.

The application is built as a single-page application (SPA) with a React frontend and Express backend, designed to run on platforms like Replit with PostgreSQL database support via Neon.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18 with TypeScript as the core UI framework
- Wouter for lightweight client-side routing
- TV-optimized interface with large touch targets and fixed dimensions (1920x1080px)

**UI Component System**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design system based on "new-york" style with neutral color scheme
- Custom CSS variables for theming and consistent spacing

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- Custom query client with credential-based authentication
- Optimistic updates disabled (staleTime: Infinity)
- Custom API request wrapper with automatic error handling

**Key Design Patterns**
- Component-based architecture with reusable UI primitives
- Page-based routing structure mirroring the navigation flow
- Shared schema definitions between client and server via `@shared` imports
- Form validation using Zod schemas with React Hook Form integration

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Vite dev server integration for development with HMR
- Session-based authentication (infrastructure in place via connect-pg-simple)

**Data Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via Neon serverless)
- In-memory storage implementation (MemStorage) as fallback/development mode
- Schema-first design with Zod validation

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Credential-based authentication flow
- Request logging middleware with response capture

**Development Environment**
- TypeScript with strict mode enabled
- ESM module system throughout
- Separate build processes for client (Vite) and server (esbuild)
- Hot module replacement in development

### Database Schema

**Users Table**
- `id`: UUID primary key (auto-generated)
- `username`: Unique text field
- `password`: Text field (hashed)

The schema uses Drizzle's PostgreSQL adapter with type inference for Insert and Select operations. Zod schemas are auto-generated from Drizzle tables for runtime validation.

### Application Flow

**Authentication Flow**
1. Splash screen (auto-redirects to login)
2. Multiple login options (Apple, Facebook, Google, Email)
3. Email-based authentication with forgot password flow
4. Password reset via email confirmation

**Onboarding Flow**
1. Guide 1: Discover feature (red button)
2. Guide 2: Genres feature (green button)
3. Guide 3: Search feature (blue button)
4. Guide 4: Favorites feature (yellow button)

**Main Application Pages**
- Discover: Home page with recently played and popular stations
- Genres: Browse stations by music/content genre
- Search: Search stations with recently played suggestions
- Favorites: User's saved stations
- Settings: User preferences and country selection
- Radio Playing: Full-screen playback interface with similar stations

### External Dependencies

**Core Infrastructure**
- Neon Database (@neondatabase/serverless): Serverless PostgreSQL hosting
- Drizzle ORM (drizzle-orm): Type-safe database toolkit
- Vite: Build tool and dev server

**Authentication & Sessions**
- connect-pg-simple: PostgreSQL session store for Express
- Express sessions (implied by session store dependency)

**UI Framework**
- Radix UI: Unstyled, accessible component primitives
- Tailwind CSS: Utility-first CSS framework
- Lucide React: Icon library

**Data & Forms**
- React Hook Form (@hookform/resolvers): Form state management
- Zod: Schema validation library
- TanStack Query: Async state management

**Development Tools**
- TypeScript: Type safety and developer experience
- Wouter: Minimal routing library
- Replit-specific plugins for development environment integration

**Font Resources**
- Ubuntu font family (primary typeface)
- Google Fonts integration

**Asset Management**
- Figma-exported assets stored in `/figmaAssets` directory
- SVG icons and PNG images for radio station logos
- Wave animations and visual effects