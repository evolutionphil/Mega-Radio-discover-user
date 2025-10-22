# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV and large screen interfaces. It offers access to global radio stations from over 238 countries, categorized by genres and countries. Key features include an onboarding process, station discovery, favorites management, and continuous audio playback, all tailored for an immersive television viewing experience.

## Project Structure (LGTV Simple Pattern)

```
Root (Main Development Project)
├── client/           ← React frontend source
├── server/           ← Express backend source
├── shared/           ← Shared types/schemas
├── package.json      ← Dependencies & scripts
├── vite.config.ts    ← Vite configuration
└── tv-app/           ← Samsung TV build output (deploy this folder)
    ├── index.html           ← Single entry point (LGTV pattern)
    ├── assets/              ← Compiled React bundle
    ├── images/              ← All SVG icons/images
    ├── js/                  ← TV scripts (keys, audio, polyfills)
    ├── css/                 ← Styles
    ├── config.xml           ← Samsung TV config
    └── build-samsung-tv.sh  ← Build script
```

**Development:** Run `npm run dev` from root
**Samsung TV Build:** `cd tv-app && bash build-samsung-tv.sh`
**Deploy:** Upload entire `tv-app/` folder to Samsung TV

## Recent Changes

### October 19, 2025 - Simplified to Single Index (LGTV Pattern)
- Consolidated project structure: Root is main development, tv-app/ is Samsung TV build output only
- Implemented single index.html pattern (like LGTV reference) - ONE file, manually editable
- Build script now updates bundle references IN-PLACE instead of regenerating HTML
- Fixed FocusRouter to use window.location.hash directly for Samsung TV hash-based routing
- Added base tag (`<base href="/">`) to fix image loading (no more file:/// errors)
- All assets (images, scripts) in correct locations for Samsung TV deployment
- Cache-busting with timestamps on all TV scripts

### October 19, 2025 - LGTV Focus Pattern Migration
- Migrated ALL 9 pages to LGTV focus pattern with `useFocusManager` + `usePageKeyHandler` + `getFocusClasses`
- Fixed critical bug: Dynamic array lengths prevent focus landing on non-existent elements
- Custom navigation logic for multi-section layouts with different grid column counts
- Focus system adapts dynamically to sparse datasets and empty arrays

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
-   **Remote Control Navigation:** Migrated to LGTV focus pattern with `useFocusManager` + `usePageKeyHandler` + `getFocusClasses`. All main pages (DiscoverNoUser, DiscoverUser, Genres, GenreDetail, Search, RadioPlaying, Settings, Favorites, GenreList) use state-based focus tracking with dynamic array lengths to prevent focus landing on non-existent elements.
-   **Focus Index Mapping:** Sidebar (0-5) + Country Selector (6) + Page Content (7+). Each page implements custom navigation logic for multi-section layouts with different grid column counts.
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