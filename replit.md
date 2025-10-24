# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV and large screen interfaces, offering access to global radio stations from over 238 countries. It aims to provide intuitive onboarding, station discovery, favorites management, and continuous audio playback, optimized for an immersive television experience. The project's ambition is to deliver a high-quality radio streaming service on smart TVs with significant market potential.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application is optimized for TV with a fixed 1920x1080px resolution, featuring large, easily focusable elements and an auto-hide header with smooth transitions. It utilizes Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, adhering to a "new-york" design system with custom CSS variables. The layout uses a fixed `inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property for consistent rendering.

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
-   **Remote Control Navigation:** Implements an LGTV focus pattern using `useFocusManager`, `usePageKeyHandler`, and `getFocusClasses` for dynamic adaptation to layouts, including specific fixes for sidebar focus, country selector interactions, and two-step return button behavior for modals and keyboards. PAGE_UP/DOWN and CH_UP/CH_DOWN keys jump to the global player.
-   **Audio Playback:** A unified interface manages `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS handles focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None).
-   **Localization & Internationalization:** Supports 48 languages via API translations and automatic language detection.
-   **Global Country Support:** Defaults to "Global" country if no country is saved, allowing browsing of worldwide stations and genres.

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar, fetching "Now Playing" metadata from themegaradio.com API every 30 seconds.
-   Metadata is displayed in pink (#ff4199).
-   The global player bar is automatically hidden on the RadioPlaying page to avoid duplication.
-   Playback continues uninterrupted when navigating between pages.

**Infinite Scrolling:**
-   Implemented true lazy loading with API pagination for station lists (Discover, GenreList), fetching 100 stations per batch with offset-based pagination.

**Focus Glow Effects:**
-   Uses CSS focus pseudo-classes (`:focus`) and `tabIndex={0}` for improved TV compatibility and glow effects on interactive elements.

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

### Samsung TV Build v3.30 (REAL STATION COUNTS):
**Fixed Station Counts Display** - All countries now show real station counts from API, Global shows actual total
   - Created production build with timestamp: `1761314382921`
   - Bundle: `tv-app/assets/index-1761314382921.js` (430.21KB - full React app)
   - **DATA FIX:**
     - ✅ Global now shows real total station count (sum of all countries)
     - ✅ All countries display their actual station counts from API (even if 0)
     - ✅ Removed hardcoded 999999 for Global
     - ✅ Added number formatting with commas (e.g., "50,000 stations")
     - ✅ Station counts always visible when available from API
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.29 (IMPROVED GLOBE ICON):
**Enhanced Global Country Icon** - Global option now has a beautiful gradient globe icon
   - Created production build with timestamp: `1761314194082`
   - Bundle: `tv-app/assets/index-1761314194082.js` (430.07KB - full React app)
   - **UI IMPROVEMENT:**
     - ✅ Globe icon now features a blue gradient (light to dark blue)
     - ✅ Added meridians and parallels for better globe representation
     - ✅ More visually appealing and recognizable as a world/global icon
     - ✅ Consistent across CountrySelector and CountryTrigger components
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.28 (NO AUTO-PLAY BY DEFAULT):
**Auto-Play Default Changed to "None"** - App no longer auto-plays any station on startup
   - Created production build with timestamp: `1761314020982`
   - Bundle: `tv-app/assets/index-1761314020982.js` (428.51KB - full React app)
   - **BEHAVIOR CHANGE:**
     - ✅ Default auto-play mode changed from "last-played" to "none"
     - ✅ App will not automatically start playing music on first launch
     - ✅ Users must manually select and play a station
     - ✅ Setting can still be changed to "last-played", "random", or "favorite" in Settings
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.27 (SHORTER STATION NAMES):
**Shortened Station Name Display** - Station names now truncate earlier to prevent overflow
   - Created production build with timestamp: `1761313868353`
   - Bundle: `tv-app/assets/index-1761313868353.js` (428.52KB - full React app)
   - **UI FIX:**
     - ✅ RadioPlaying page: Station name max-width reduced from 1200px to 600px
     - ✅ GlobalPlayer bar: Station name max-width reduced from 800px to 450px
     - ✅ Long station names now show as: "WORLD CLUB DOME Radio - Das offizielle Radio ..."
     - ✅ Better readability on TV screens with ellipsis truncation
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV