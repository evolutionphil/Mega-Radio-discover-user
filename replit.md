# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV/large screen interfaces. It offers global radio station access, organized by genres and countries, featuring an onboarding flow, authentication, station discovery, favorites, and playback controls. The application is a single-page React frontend with an Express backend, utilizing a PostgreSQL database via Neon. The project's vision is to provide a seamless radio streaming experience optimized for television environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application targets TV-optimized interfaces with fixed 1920x1080px dimensions and large touch targets. It features an auto-hide header with smooth transitions for improved UX on TV platforms. The UI uses Shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS and a neutral "new-york" design system with custom CSS variables.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter for client-side navigation.
-   **State Management:** TanStack Query for server state, custom API wrapper for error handling, infinite scroll for station lists.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions via `@shared`, Zod for form validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing, integrated with Vite dev server for HMR.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, JSON format, credential-based authentication.
-   **Development:** TypeScript (strict mode), ESM, separate build processes (Vite for client, esbuild for server).

**Samsung Tizen TV Compatibility:**
-   Targets Chromium 76 (ES2015/ES6).
-   Includes polyfills for ES2019+ features (e.g., `globalThis`, `Object.fromEntries`, `Array.prototype.flat`).
-   Uses `&&` checks instead of optional chaining.
-   IIFE bundle format.
-   Fetch polyfill (`tv-app/js/fetch-polyfill-samsung.js`) using `XMLHttpRequest` for CORS handling on Tizen.

**Application Flow:**
-   **Authentication:** Splash screen to login, multiple login options (Apple, Facebook, Google, Email), email-based authentication with password reset.
-   **Onboarding:** Guided tour for Discover, Genres, Search, and Favorites features.
-   **Main Pages:** Discover (popular stations), Genres (browse by genre), GenreList, Search (real-time), Favorites (user-saved), Settings (user preferences), Radio Playing (full-screen playback).

**Samsung Tizen TV App Structure:**
The `tv-app/` directory is the complete Samsung Tizen project. A build script (`build-samsung-tv.sh`) builds the React app, copies assets, and generates `index.html` for Tizen deployment. Configuration files (`config.xml`, `.project`, `.tproject`) are specific to Tizen Studio.

### System Design Choices

**Samsung TV Network Configuration:**
-   `fetch-polyfill-samsung.js` replaces native `fetch()` with `XMLHttpRequest` for better Samsung TV compatibility.
-   Direct API calls to `https://themegaradio.com/api` (CORS headers added on backend).
-   Polyfill loads before the React app in `index.html`.
-   `config.xml` includes `http://tizen.org/privilege/internet` and `http://developer.samsung.com/privilege/network.public` for network access.
-   Backend Express server provides optional `/api/proxy/*` endpoints for development/testing.

**TV Platform Support (LG webOS & Samsung Tizen):**
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Global key event handler, platform-specific key codes, focus management with `data-tv-focusable` attributes, initiated by `useTVNavigation` hook.
-   **Audio Playback:** Dual implementation: `webapis.avplay` for Tizen, HTML5 Audio/Video for webOS/browsers. Unified interface with event handlers.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursor, scrollbar hiding, platform-specific visibility classes.
-   **SDK Integration:** LG webOS SDK (`webOSTVjs-1.2.0`) included; Samsung Tizen uses native `webapis`.

## External Dependencies

-   **Database:** Neon Database (@neondatabase/serverless) for PostgreSQL.
-   **ORM:** Drizzle ORM (drizzle-orm).
-   **Build Tool:** Vite.
-   **Authentication:** `connect-pg-simple` for PostgreSQL session storage.
-   **UI Components:** Radix UI primitives, Tailwind CSS, Lucide React (icons).
-   **Forms & Validation:** React Hook Form (@hookform/resolvers), Zod.
-   **Async State:** TanStack Query.
-   **Routing:** Wouter.
-   **Typing:** TypeScript.
-   **Fonts:** Ubuntu font family (via Google Fonts).
-   **API Integration:** themegaradio.com API (for station data, genres, metadata).