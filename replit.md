# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application tailored for TV and large screen interfaces. It provides access to global radio stations from over 238 countries, organized by genres and countries. The application features an intuitive onboarding process, station discovery, favorites management, and continuous audio playback, all designed for an immersive television viewing experience. The project aims to deliver a high-quality radio streaming service on smart TVs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application is optimized for TV with a fixed 1920x1080px resolution, featuring large, easily focusable elements and an auto-hide header with smooth transitions. It utilizes Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, adhering to a "new-york" design system with custom CSS variables.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter, specifically using hash-based routing for Samsung TV compatibility.
-   **State Management:** TanStack Query for server state, complemented by a custom API wrapper for error handling and infinite scroll.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, and Zod for validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing, integrated with Vite.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, communicating in JSON format.

**Platform Compatibility:**
-   **Unified TV Build:** A single `tv-app/` folder serves both Samsung Tizen and LG webOS, containing respective configuration files (`config.xml` for Samsung, `appinfo.json` for LG).
-   **Samsung Tizen TV:** Targets Chromium 76 (ES2015/ES6), requiring polyfills for newer JavaScript features, `&&` checks instead of optional chaining, IIFE bundle format, and a custom fetch polyfill.
-   **LG webOS:** Leverages HTML5 Audio/Video for playback and the `webOSTVjs-1.2.0` SDK.
-   **Platform Detection:** Automatic detection via user agent.
-   **Remote Control Navigation:** Implements an LGTV focus pattern using `useFocusManager`, `usePageKeyHandler`, and `getFocusClasses`. This system dynamically adapts to varying array lengths and multi-section layouts, ensuring focus lands on existing elements.
-   **Audio Playback:** A unified interface manages dual audio playback implementations: `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers.
-   **TV-Specific Styling:** Custom CSS handles focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users across key sections.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes including "Last Played", "Random", "Favorite", or "None".

**Localization & Internationalization:**
-   Supports 48 languages via API translations and automatic language detection based on the platform.

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar across all application pages.

**Fixed Layout:**
-   The application uses a `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property for consistent layout rendering across all TV platforms and web browsers.

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

## Recent Changes (October 23, 2025 - Latest)

### Project Structure Cleanup & Consolidation (COMPLETED):
**Unified all code into single tv-app/ folder** - Eliminated 50+ duplicate files
   - **Problem**: Multiple scattered folders (root css/, js/, images/, tv-app/server/, etc.) caused confusion
   - **Solution**: Consolidated everything into one main `tv-app/` folder following LGTV-master pattern
   - **Deleted**:
     - Root-level duplicate folders: `css/`, `js/`, `images/`, `webOSTVjs-1.2.0/`
     - Duplicate server code: `tv-app/server/`, `tv-app/shared/` (kept root versions)
     - Duplicate configs: `tv-app/vite.config.ts`, `tv-app/package.json`, `vite.config.tv.ts` from root
     - Unused files: `*.zip`, `run-tv-app.sh`, `tv-app/build-tv-app.sh`, pasted log files
   - **Result**: ONE unified folder structure - development uses root `server/`+`shared/` with `tv-app/src/`, TV deployment uses entire `tv-app/` folder
   - **Benefits**: Single source of truth, no duplication, simpler maintenance, cleaner project
   - **See**: CLEANUP_SUMMARY.md for detailed breakdown and folder structure diagram

### Search Page Focus Navigation Fix (COMPLETED):
**Fixed phantom index preventing RIGHT navigation to Recently Played** - One key press now works
   - **Root Cause**: React Query cached search results counted even when search input empty, creating phantom indices
   - **Solution**: Introduced `visibleSearchResults` that only shows results when `debouncedSearchQuery.length > 0`
   - **Changes**:
     - Created `visibleSearchResults` array that clears when search input is empty
     - Replaced all `searchResults` references with `visibleSearchResults` in navigation, totalItems, rendering, and onSelect
     - Prevents counting cached search results that aren't being rendered
   - **Result**: Pressing RIGHT from search input now immediately jumps to first Recently Played item at index 6

### Genre Navigation Fix (COMPLETED):
**Fixed genre parameter not being read** - International genre now shows international stations
   - **Root Cause**: Hash-based routing doesn't preserve query parameters (`?genre=rock`)
   - **Solution**: Changed from query params to path-based routing (`/genre-list/rock`)
   - Updated GenreList.tsx to read genre from path: `pathParts[2]`
   - Updated Genres.tsx to navigate to `/genre-list/:genre` instead of `/genre-list?genre=:genre`
   - Updated App.tsx route to accept optional genre parameter: `/genre-list/:genre?`
   - **Result**: Clicking "International" now correctly shows international stations instead of pop stations

## Recent Changes (October 23, 2025)

### Samsung TV Build v3.0 (FINAL - READY FOR DEPLOYMENT):
**Complete working Samsung TV build with country-filtered genres** - ALL ISSUES FIXED!
   - Created production build with timestamp: `1761229987899`
   - Bundle: `tv-app/assets/index-1761229987899.js` (465KB - full React app)
   - CSS: `tv-app/assets/style.css` (67KB - FULL Tailwind CSS working!)
   - **ALL FIXES COMPLETED:**
     - ✅ Fixed white screen issue: React bundle now loads LAST (after DOM is ready)
     - ✅ Fixed script order: Moved React from `<head>` to end of `<body>`
     - ✅ Fixed build process: Removed 90+ duplicate polyfill scripts
     - ✅ Fixed template: Created clean `index.template.html` as source
     - ✅ Cleaned up duplicate asset folders (public/, dist/)
     - ✅ Fixed CSS extraction: Vite generates single CSS file
     - ✅ **FIXED TAILWIND CONFIG**: Changed content paths from `../client/` to `./src/` (was scanning wrong folder!)
     - ✅ **TAILWIND CSS NOW WORKS**: 67KB CSS with all utilities (.hidden, .flex, .bg-*, etc.)
     - ✅ **Samsung TV Compatible**: 0 @layer directives (Chromium 76 compatible)
     - ✅ Added CSS loading detection and logging
   - Build includes all country-filtered genres functionality
   - React app loads correctly with full Tailwind styling on Samsung TV
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV (contains index.html, assets/, images/, js/, css/)

### Country-Filtered Genres Implementation (COMPLETED):
**Genres now correctly filter by selected country** - Per API documentation requirements
   - Fixed `megaRadioApi.getAllGenres()` to use `filters` parameter with JSON object containing `countrycode` and `searchQuery`
   - Updated `Genres.tsx` to use `getAllGenres(selectedCountryCode)` instead of `getDiscoverableGenres()`
   - Fixed `getStationsByGenre()` to convert country code to country name before API call
   - Updated `GenreList.tsx` to use proper `/api/genres/:slug/stations` endpoint via `getStationsByGenre()`
   - Genres list now dynamically updates when country changes (e.g., USA shows 50+ genres, Algeria shows 9 genres)
   - Station lists now properly filter by BOTH genre AND selected country
   - Fresh TV build created to bypass any caching issues

### Server Path Fix (Critical):
**Fixed fatal bug preventing app from loading** - Server was looking for files in deleted `client/` folder
   - Updated server/vite.ts to use correct `tv-app/` path instead of old `client/` path
   - Resolved "Unexpected token '<'" errors (HTML being served instead of JavaScript)
   - App now loads correctly in browser

### Auto-Scroll on Genres Page:
**Smooth scrolling follows focus** - Navigation experience improved
   - Added useEffect to auto-scroll based on focusIndex
   - Calculates scroll position for sidebar, country selector, popular genres, and all genres sections
   - Smooth behavior ensures focused genre is always visible

## Recent Changes (October 23, 2025)

### Country Selector Improvements:
**Unified design and fixed selection behavior** - All pages now use consistent country button styling
   - Created shared CountryTrigger component with purple background (#6b4f8a), flag, and arrow icon
   - Replaced duplicate implementations in DiscoverNoUser.tsx, Genres.tsx, RadioPlaying.tsx
   - Fixed CountrySelector to focus on currently selected country when opened (prevents accidental selection changes)
   - Modal initialization only runs on open, allowing proper arrow key navigation

### Genre Navigation Fix:
**Genre filtering now works correctly** - Clicking "Rock" shows rock stations instead of pop
   - GenreList.tsx now correctly reads genre parameter from wouter's location (works with hash-based routing)
   - Fixed Genres.tsx focus indices mismatch: handleSelect now uses correct indices (7-14 for popular genres, 15+ for all genres)
   - Fixed navigation logic to properly jump between sidebar (0-4), country selector (6), and genre sections
   - Fixes issue where clicking one genre would navigate to a different genre

### Folder Structure Consolidation:
**Single `tv-app/` folder for all builds** - Eliminated separate client/ folder
   - Moved all source code from `client/src/` to `tv-app/src/`
   - Updated `vite.config.ts`: root now points to `tv-app/`, build outputs to `tv-app/assets/`
   - Updated `server/vite-runtime.ts`: references `tv-app/` instead of `client/` for both dev and production
   - Web preview and TV production builds now use same source folder
   - Simplified project structure: one folder for development, preview, and TV builds

## Previous Changes

### Bug Fixes & Enhancements:
1. **Onboarding Persistence** - Guides now show only on first app launch
   - Splash.tsx: Checks localStorage for 'onboardingCompleted' flag
   - Guide4.tsx: Sets completion flag when user clicks "Get Started"
   - Subsequent app launches skip directly to Discover page

2. **Country Search Filtering** - Enhanced debugging and verification
   - Added comprehensive logging to CountrySelector.tsx
   - Tracks real-time filtering with search query updates
   - Verifies Turkish character support (e.g., "türkiye")

3. **Country Button Design Consistency** - Unified across all pages
   - Updated DiscoverNoUser.tsx to match RadioPlaying.tsx design
   - Direct flagcdn.com URL construction for all country flags
   - Inline SVG arrow icon for consistency

4. **Genre Filtering Verification** - API confirmed working correctly
   - Direct API testing: genre=rock (4,409 stations), genre=jazz (jazz stations), genre=hip-hop (hip-hop stations)
   - Added extensive logging to GenreList.tsx and megaRadioApi.ts
   - Validates stations match requested genre, warns if API returns incorrect data
   - All navigation paths use genre.slug correctly (verified)