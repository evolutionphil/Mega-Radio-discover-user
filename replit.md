# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application optimized for TV and large screen interfaces. It provides access to global radio stations from over 238 countries, organized by genres and countries, and includes an onboarding flow, station discovery, favorites management, and continuous playback. The project aims to deliver a seamless and engaging radio streaming experience specifically tailored for television environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application targets TV-optimized interfaces with a fixed 1920x1080px resolution and large, easily targetable elements. It incorporates an auto-hide header with smooth transitions for enhanced user experience on TV platforms. The UI is built using Shadcn/ui components, based on Radix UI primitives, and styled with Tailwind CSS, following a "new-york" design system with custom CSS variables.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter for client-side navigation.
-   **State Management:** TanStack Query for server state, custom API wrapper for error handling, infinite scroll for lists.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, Zod for validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing, integrated with Vite for HMR.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, JSON format.

**Samsung Tizen TV Compatibility:**
-   Targets Chromium 76 (ES2015/ES6), using polyfills for ES2019+ features.
-   Employs `&&` checks instead of optional chaining.
-   Utilizes an IIFE bundle format.
-   Includes a custom fetch polyfill (`tv-app/js/fetch-polyfill-samsung.js`) using `XMLHttpRequest` for CORS handling.

**Application Flow:**
-   **Onboarding:** Guided tour for Discover, Genres, Search, and Favorites features.
-   **Main Pages:** Discover, Genres (with GenreList), Search, Favorites, Settings, Radio Playing (full-screen playback).
-   **Auto-Play:** Supports "Last Played", "Random", "Favorite", or "None" modes on app startup.

**Localization & Internationalization:**
-   Automatic language detection (Samsung Tizen, LG webOS, browser navigator).
-   Supports 48 languages via API translations.
-   `LocalizationProvider` context for `t()` function and language state management.

### System Design Choices

**TV Platform Support (LG webOS & Samsung Tizen):**
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Global key event handler, platform-specific key codes, `data-tv-focusable` attributes for focus management, managed by `useTVNavigation` hook.
-   **Audio Playback:** Dual implementation using `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers, with a unified interface.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursor, scrollbar hiding, and platform-specific visibility.
-   **SDK Integration:** LG webOS SDK (`webOSTVjs-1.2.0`) and Samsung Tizen native `webapis`.

**Global Player:**
-   `GlobalPlayerContext` manages continuous audio playback across all pages with a persistent player bar.

**Fixed Layout:**
-   Uses `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` for consistent layout rendering across TV platforms and web browsers.

## External Dependencies

-   **Database:** Neon Database (@neondatabase/serverless) for PostgreSQL.
-   **ORM:** Drizzle ORM (drizzle-orm).
-   **Build Tool:** Vite.
-   **UI Components:** Radix UI primitives, Tailwind CSS, Lucide React (icons), Shadcn/ui.
-   **Forms & Validation:** React Hook Form (@hookform/resolvers), Zod.
-   **Async State:** TanStack Query.
-   **Routing:** Wouter.
-   **Typing:** TypeScript.
-   **Fonts:** Ubuntu font family (Google Fonts).
-   **API Integration:** themegaradio.com API (for station data, genres, metadata, translations).