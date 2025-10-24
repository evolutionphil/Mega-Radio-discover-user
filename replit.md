# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application optimized for TV and large screen interfaces. It provides access to global radio stations from over 238 countries with intuitive onboarding, station discovery, favorites management, and continuous audio playback. The project aims to deliver a high-quality radio streaming service on smart TVs with significant market potential.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application is optimized for TV with a fixed 1920x1080px resolution, utilizing large, easily focusable elements and an auto-hide header with smooth transitions. It uses Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, following a "new-york" design system with custom CSS variables. The layout uses a fixed `inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property for consistent rendering. Focus glow effects are implemented using CSS `:focus` and `tabIndex={0}`.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter, using hash-based routing for Samsung TV compatibility.
-   **State Management:** TanStack Query for server state.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, and Zod for validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, communicating in JSON format.

**Platform Compatibility:**
-   **Unified TV Build:** A single `tv-app/` folder contains configurations for both Samsung Tizen (targeting Chromium 76 with polyfills) and LG webOS (leveraging HTML5 Audio/Video and `webOSTVjs-1.2.0` SDK).
-   **Platform Detection:** Automatic detection via user agent.
-   **Remote Control Navigation:** Implements an LGTV focus pattern using `useFocusManager`, `usePageKeyHandler`, and `getFocusClasses` for dynamic adaptation, including specific fixes for sidebar focus, country selector interactions, and two-step return button behavior. PAGE_UP/DOWN and CH_UP/CH_DOWN keys jump to the global player.
-   **Audio Playback:** A unified interface manages `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS handles focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None), with "None" as the default.
-   **Localization & Internationalization:** Supports 48 languages via API translations and automatic language detection.
-   **Global Country Support:** Defaults to "Global" country if no country is saved, allowing browsing of worldwide stations and genres, with a dedicated globe icon.

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar, fetching "Now Playing" metadata from themegaradio.com API every 30 seconds.
-   Metadata is displayed in pink (#ff4199) and truncates long song titles.
-   The global player bar is automatically hidden on the RadioPlaying page to avoid duplication.
-   Playback continues uninterrupted when navigating between pages.

**Infinite Scrolling:**
-   Implemented true lazy loading with API pagination for station lists (Discover, GenreList), fetching 100 stations per batch with offset-based pagination.

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
-   **Analytics:** Google Analytics 4.

## Recent Changes (October 24, 2025 - Latest)

### Samsung TV Build v3.39 (VERTICAL GENRE CARDS):
**Changed Genre Cards to Vertical Layout** - Genre name on top, station count below
   - Created production build with timestamp: `1761321485160`
   - Bundle: `tv-app/assets/index-1761321485160.js` (432.10KB - full React app)
   - **UI CHANGE:**
     - ✅ **Vertical Layout**: Genre cards now show genre name on top, station count below it
     - ✅ **Left-Aligned**: Both genre name and station count aligned to the left
     - ✅ **Cleaner Look**: Stacked layout provides better visual hierarchy
   - **APPLIES TO:**
     - Popular Genres Row 1 (4 cards)
     - Popular Genres Row 2 (4 cards)
     - All Genres Grid (6 columns, scrollable)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.38 (SCROLLABLE SIMILAR & POPULAR SECTIONS):
**Made Similar & Popular Radios Scrollable** - Both sections now in a single scrollable container
   - Created production build with timestamp: `1761321263994`
   - Bundle: `tv-app/assets/index-1761321263994.js` (432.13KB - full React app)
   - **IMPROVEMENT:**
     - ✅ **Scrollable Container**: Both Similar and Popular Radios sections now in a single 521px-high scrollable area
     - ✅ **Vertical Scrolling**: Users can scroll down to see all stations (20 Similar + 20 Popular)
     - ✅ **Full-Size Cards**: Back to 200px x 264px cards with 132px logos (matching Discover page design)
     - ✅ **Clean Layout**: Sections stack vertically with proper spacing between them
   - **LAYOUT:**
     - Container: left-236px, top-559px, width-1610px, height-521px
     - Similar Radios: First section with title + horizontal scroll
     - Popular Radios: Second section below Similar with title + horizontal scroll
     - Each horizontal row scrolls left/right, container scrolls up/down
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV