# Mega Radio - TV Application

## Overview
Mega Radio is a full-stack web radio streaming application optimized for TV and large screen interfaces. It offers access to global radio stations from over 238 countries, categorized by genres and countries. Key features include intuitive onboarding, station discovery, favorites management, and continuous audio playback, aiming to deliver a high-quality radio streaming experience on smart TVs.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application targets a fixed 1920x1080px resolution, featuring large, focusable elements and an auto-hide header. It utilizes Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, adhering to a "new-york" design system.

### Technical Implementations
**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter, using hash-based routing for Samsung TV compatibility.
-   **State Management:** TanStack Query for server state.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, and Zod with React Hook Form for validation.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, communicating in JSON.

**Platform Compatibility:**
-   **Unified TV Build:** A single `tv-app/` folder supports both Samsung Tizen and LG webOS configurations.
-   **Target Platforms:** Samsung Tizen TV (Chromium 76 with polyfills) and LG webOS (HTML5 Audio/Video, `webOSTVjs-1.2.0` SDK).
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Custom focus management (`useFocusManager`, `usePageKeyHandler`, `getFocusClasses`) adapts to dynamic layouts.
-   **Audio Playback:** Unified interface managing `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None).

**Localization & Internationalization:**
-   Supports 48 languages via API translations and automatic language detection.
-   **Hybrid Geolocation System** (Priority-based):
    1.  **Tizen SystemInfo LOCALE API** (`tizen.systeminfo.getPropertyValue("LOCALE")`) for direct country code.
    2.  **Samsung webapis.productinfo** for fast synchronous country detection.
    3.  **LG webOS.systemInfo** for native webOS country detection.
    4.  **Browser Locale Parsing** extracts region from `navigator.language` (e.g., `de-AT` → Austria).

### System Design Choices
**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar with song metadata display.

**Fixed Layout:**
-   Uses `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS for consistent rendering.

**Navigation and Focus Management:**
-   Robust focus management across the application, with seamless transitions between components and pages.
-   Enhanced navigation with `PAGE_UP`/`PAGE_DOWN` keys for quick access to the Global Player.
-   Improved infinite scrolling for station lists using offset-based API pagination and dual triggers (scroll/focus).

## External Dependencies

-   **Database:** Neon Database (@neondatabase/serverless) for PostgreSQL.
-   **ORM:** Drizzle ORM (drizzle-orm).
-   **Build Tool:** Vite.
-   **UI Components:** Radix UI primitives, Tailwind CSS, Shadcn/ui.
-   **Forms & Validation:** React Hook Form (@hookform/resolvers), Zod.
-   **Async State:** TanStack Query.
-   **Routing:** Wouter.
-   **Typing:** TypeScript.
-   **Fonts:** Ubuntu font family.
-   **API Integration:** themegaradio.com API (for station data, genres, metadata, translations).