# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV and large screen interfaces, offering access to global radio stations from over 238 countries, categorized by genres and countries. Its purpose is to provide an intuitive onboarding, station discovery, favorites management, and continuous audio playback, all optimized for an immersive television viewing experience. The project aims to deliver a high-quality radio streaming service on smart TVs with significant market potential.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application is optimized for TV with a fixed 1920x1080px resolution, featuring large, easily focusable elements and an auto-hide header with smooth transitions. It utilizes Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, adhering to a "new-york" design system with custom CSS variables.

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
-   **Unified TV Build:** A single `tv-app/` folder contains configurations for both Samsung Tizen and LG webOS.
-   **Samsung Tizen TV:** Targets Chromium 76, requiring polyfills and specific JavaScript syntax workarounds.
-   **LG webOS:** Leverages HTML5 Audio/Video for playback and the `webOSTVjs-1.2.0` SDK.
-   **Platform Detection:** Automatic detection via user agent.
-   **Remote Control Navigation:** Implements an LGTV focus pattern using `useFocusManager`, `usePageKeyHandler`, and `getFocusClasses` for dynamic adaptation to layouts.
-   **Audio Playback:** A unified interface manages `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS handles focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None).

**Localization & Internationalization:**
-   Supports 48 languages via API translations and automatic language detection.

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar.

**Fixed Layout:**
-   The application uses a `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property for consistent rendering across platforms.

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

### Samsung TV Build v3.7 (TWO-STEP RETURN BUTTON):
**Fixed RETURN button behavior** - Two-step back button: first closes keyboard, second closes modal
   - Created production build with timestamp: `1761292418170`
   - Bundle: `tv-app/assets/index-1761292418170.js` (425KB - full React app)
   - **TWO-STEP RETURN FIX:**
     - ✅ **CountrySelector.tsx**: Implemented two-step RETURN button behavior
     - **First RETURN press**: Closes keyboard (blurs input, sets isSearchFocused=false)
     - **Second RETURN press**: Closes the modal (only when keyboard is already closed)
     - Prevents accidental modal closure when user just wants to exit keyboard
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.6 (COUNTRY SELECTOR DOWN KEY FIX):
**Fixed focus stuck on search input** - DOWN key now properly navigates to country list
   - Created production build with timestamp: `1761254491910`
   - Bundle: `tv-app/assets/index-1761254491910.js` (425KB - full React app)
   - **COUNTRY SELECTOR FIX:**
     - ✅ **CountrySelector.tsx**: Added onKeyDown handler directly to input element
     - Fixed issue where pressing DOWN key wouldn't exit search input
     - Now pressing DOWN from search input properly moves focus to country list
     - Input properly blurs and first country gets focused
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.5 (ALL GENRES FIX):
**Fixed genre limit - Now shows all 184 genres for Austria** - API was limiting to 9 genres per page
   - Created production build with timestamp: `1761254145567`
   - Bundle: `tv-app/assets/index-1761254145567.js` (425KB - full React app)
   - **GENRE LIMIT FIX:**
     - ✅ **megaRadioApi.ts**: Added `limit=500` parameter to getAllGenres API call
     - Fixed issue where only 9 genres were showing (API default pagination)
     - Austria now shows all 184 genres instead of just 9
     - API was returning: `count: 184, perPage: 9, totalPages: 21`
     - Now fetches all genres in single request with limit=500
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.4 (SIDEBAR FOCUS FIX):
**Fixed sidebar focus behavior** - Focus properly jumps between sidebar elements
   - Created production build with timestamp: `1761253902949`
   - Bundle: `tv-app/assets/index-1761253902949.js` (425KB - full React app)
   - **SIDEBAR FIX:**
     - ✅ **Sidebar.tsx**: Removed persistent white opacity background from all sidebar items
     - Now sidebar items only show focus ring when actually focused
     - Fixed issue where Discovery had white opacity cover even when not focused
     - Focus properly jumps between all sidebar elements (Discover, Genres, Search, Favorites, Settings)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.3 (TRUE INFINITE SCROLL):
**Implemented true lazy loading with API pagination** - Users can now scroll through 1000+ stations
   - Created production build with timestamp: `1761253575071`
   - Bundle: `tv-app/assets/index-1761253575071.js` (425KB - full React app)
   - CSS: `tv-app/assets/style.css` (69KB - Full Tailwind CSS)
   - **INFINITE SCROLL IMPLEMENTATION:**
     - ✅ **DiscoverNoUser.tsx**: Changed from 50-station limit to true infinite scroll
       - Fetches 100 stations per batch with offset-based pagination
       - Dual triggers: Scroll-based (< 1000px from bottom) + Focus-based (last 2 rows)
       - API call: `getWorkingStations({ limit: 100, country, offset })`
     - ✅ **GenreList.tsx**: Changed from 200-station limit to true infinite scroll
       - Fetches 100 stations per batch with offset-based pagination
       - Dual triggers: Scroll-based (< 1000px from bottom) + Focus-based (last 2 rows)
       - API call: `getStationsByGenre(genre, { country, limit: 100, offset, sort: 'votes' })`
     - ✅ **megaRadioApi.ts**: Added offset parameter support to both methods
   - **Technical Details**:
     - Offset-based pagination: offset=0, offset=100, offset=200, etc.
     - Automatic loading when approaching last 2 rows (14 stations)
     - hasMore flag prevents unnecessary API calls
     - Loading indicators provide user feedback
   - **Result**: Users can scroll through all available stations (Austria: 1000+, Germany: 2000+)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.2 (UI CLEANUP):
**Removed "See all" texts from Discover page** - Cleaner interface
   - Removed "See all" text from Popular Stations section
   - Removed "See all" text from More from Country section

### Samsung TV Build v3.1 (COMPLETE NAVIGATION FIXES):
**Fixed all three navigation issues on Samsung TV** - GenreList sidebar jump, CountrySelector search navigation, Discover genre scrolling
   - GenreList: LEFT/UP from first station now jumps to Genres sidebar (index 1)
   - CountrySelector: DOWN key from search input properly navigates to country list
   - Discover: Shows ALL genres (removed 8-item limit) enabling horizontal scrolling through 50+ genres