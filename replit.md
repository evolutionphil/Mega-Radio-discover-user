# Mega Radio - TV Application

## Overview
Mega Radio is a full-stack web radio streaming application optimized for TV and large screen interfaces. It provides access to global radio stations from over 238 countries, categorized by genres and countries, with features like intuitive onboarding, station discovery, favorites management, and continuous audio playback. The project aims to deliver a high-quality radio streaming service on smart TVs.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application is designed for a fixed 1920x1080px resolution with large, focusable elements and an auto-hide header. It uses Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, following a "new-york" design system.

### Technical Implementations
**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter, utilizing hash-based routing for Samsung TV compatibility.
-   **State Management:** TanStack Query for server state.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, and Zod with React Hook Form for validation.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, communicating in JSON.

**Platform Compatibility:**
-   **Unified TV Build:** A single `tv-app/` folder for Samsung Tizen and LG webOS configurations.
-   **Target Platforms:** Samsung Tizen TV (Chromium 76 with polyfills) and LG webOS (HTML5 Audio/Video, `webOSTVjs-1.2.0` SDK).
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Custom focus management (`useFocusManager`, `usePageKeyHandler`, `getFocusClasses`) for dynamic layout adaptation.
-   **Audio Playback:** Unified interface managing `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None).

**Localization & Internationalization:**
-   Supports 48 languages via API translations and automatic language detection.

### System Design Choices
**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar with song metadata display.

**Fixed Layout:**
-   Uses `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS for consistent rendering.

**Navigation and Focus Management:**
-   Implemented robust focus management across the application, including seamless transitions between components and pages (e.g., sidebar, player bar, search inputs, lists).
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

## Recent Changes (October 24, 2025 - Latest)

### Samsung TV Build v3.17 (HORIZONTAL GENRE NAVIGATION FIX):
**Fixed horizontal swiping for genre rows on Discover page**
   - Created production build with timestamp: `1761297195453`
   - Bundle: `tv-app/assets/index-1761297195453.js` (435.96 KB - production-ready)
   - **CRITICAL NAVIGATION FIX:**
     - ✅ **Horizontal Swipe Fixed**: RIGHT/LEFT keys now properly navigate through genre pills horizontally
     - ✅ **preventDefault() Added**: Prevents default vertical navigation from overriding custom logic
     - ✅ **Auto-Scroll**: Genre container automatically scrolls to keep focused item visible
     - ✅ **Consistent UX**: Matches horizontal navigation pattern from RadioPlaying similar stations
   - **ARCHITECT APPROVED**: Navigation fix works correctly, no side effects on other pages
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS

### Samsung TV Build v3.16 (FLOWING WAVE SPLASH ANIMATION):
**Beautiful animated splash screen with fluid wave motion**
   - Created production build with timestamp: `1761296865275`
   - Bundle: `tv-app/assets/index-1761296865275.js` (435.87 KB - production-ready)
   - **SPLASH SCREEN ANIMATION UPGRADE:**
     - ✅ **Flowing Wave Effect**: Custom keyframe animation replacing basic pulse
     - ✅ **Multi-Dimensional Motion**: Combines scale (1.0→1.15), rotation (±1deg), opacity (0.3→0.5), vertical float (-12px)
     - ✅ **Smooth & Elegant**: 6-second duration with ease-in-out timing for premium feel
     - ✅ **GPU-Optimized**: Uses transform and opacity for smooth 60fps animation
     - ✅ **Breathing Effect**: Waves expand, rotate gently, and float upward in seamless loop
   - **ARCHITECT APPROVED**: Smooth fluid motion, negligible performance impact, no visual glitches
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS