# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV and large screen interfaces. It offers access to global radio stations from over 238 countries, categorized by genres and countries. Key features include an onboarding process, station discovery, favorites management, and continuous audio playback, all tailored for an immersive television viewing experience. The project aims to deliver a seamless and engaging radio streaming experience specifically tailored for television environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application is optimized for TV with a fixed 1920x1080px resolution, featuring large, easily focusable elements. It includes an auto-hide header with smooth transitions. The UI is built using Shadcn/ui components (based on Radix UI primitives) and styled with Tailwind CSS, following a "new-york" design system with custom CSS variables.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter (hash-based routing is **REQUIRED** for Samsung TV compatibility).
-   **State Management:** TanStack Query for server state, custom API wrapper for error handling, infinite scroll.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, Zod for validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing, integrated with Vite.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, JSON format.

**Platform Compatibility:**
-   **Samsung Tizen TV:** Targets Chromium 76 (ES2015/ES6) with polyfills for ES2019+ features, `&&` checks instead of optional chaining, IIFE bundle format, and a custom fetch polyfill using `XMLHttpRequest`.
-   **LG webOS:** Uses HTML5 Audio/Video for playback and `webOSTVjs-1.2.0` SDK.
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Global key event handler, platform-specific key codes, `useTVNavigation` hook for focus management (though simplified for Guide pages).
-   **Audio Playback:** Dual implementation using `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers, with a unified interface.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursor, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for Discover, Genres, Search, and Favorites.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, Radio Playing (full-screen playback).
-   **Auto-Play:** Supports "Last Played", "Random", "Favorite", or "None" modes on startup.

**Localization & Internationalization:**
-   Automatic language detection (Samsung Tizen, LG webOS, browser).
-   Supports 48 languages via API translations using `LocalizationProvider` context.

### System Design Choices

**Global Player:**
-   `GlobalPlayerContext` manages continuous audio playback across all pages with a persistent player bar.

**Fixed Layout:**
-   Uses `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` for consistent layout rendering across TV platforms and web browsers.

## External Dependencies

-   **Database:** Neon Database (@neondatabase/serverless) for PostgreSQL.
-   **ORM:** Drizzle ORM (drizzle-orm).
-   **Build Tool:** Vite.
-   **UI Components:** Radix UI primitives, Tailwind CSS, Lucide React (icons - though mostly replaced by custom SVGs), Shadcn/ui.
-   **Forms & Validation:** React Hook Form (@hookform/resolvers), Zod.
-   **Async State:** TanStack Query.
-   **Routing:** Wouter.
-   **Typing:** TypeScript.
-   **Fonts:** Ubuntu font family (Google Fonts).
-   **API Integration:** themegaradio.com API (for station data, genres, metadata, translations).