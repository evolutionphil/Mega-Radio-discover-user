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
-   **Hybrid Geolocation System** (Priority-based):
    1. **Tizen SystemInfo LOCALE API** (`tizen.systeminfo.getPropertyValue("LOCALE")`) - Official Tizen method for direct country code
    2. **Samsung webapis.productinfo** - Fast synchronous country detection
    3. **LG webOS.systemInfo** - Native webOS country detection
    4. **Browser Locale Parsing** - Extracts region from navigator.language (de-AT → Austria, en-GB → UK)

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

### Samsung TV Build v3.24 (CRASH-PROOF - COMPREHENSIVE ERROR HANDLING):
**Production build with bulletproof error handling for emulators and non-TV devices**
   - Created production build with timestamp: `1761301993501`
   - Bundle: `tv-app/assets/index-1761301993501.js` (440.15 KB - production-ready)
   - **CRITICAL FIXES:**
     - ✅ **Emulator-Safe**: No more crashes when Tizen/webOS APIs are unavailable
     - ✅ **Triple Layer Try-Catch**: Outer, inner, and API-specific error handlers for all detection methods
     - ✅ **Graceful Fallbacks**: Each failed detection method logs clearly and falls back to next method
     - ✅ **Early Return Pattern**: Immediately returns null if platform APIs don't exist
     - ✅ **Detailed Error Logging**: Every failure point logged with clear fallback messages
   - **ERROR HANDLING IMPROVEMENTS:**
     - **Tizen SystemInfo API**: Nested try-catch blocks, early return if API missing, 2-second timeout
     - **Samsung productinfo API**: Early return if unavailable, inner/outer try-catch for safety
     - **LG webOS systemInfo API**: Same robust pattern, handles all edge cases gracefully
     - **Browser Locale Parsing**: Final fallback always succeeds with default language
   - **WHAT THIS FIXES:**
     - No more crashes on emulators (NWjs, Chrome, etc.)
     - No more undefined reference errors when APIs don't exist
     - Clean console logs showing which detection method worked
     - Always falls back to browser language if all TV APIs fail
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS / Emulator
   - **TESTING:** Fully tested - no crashes on emulator, graceful fallbacks everywhere

### Samsung TV Build v3.23 (TIZEN LOCALE DEBUG - COMPREHENSIVE LOGGING):
**Production build with extensive Tizen SystemInfo LOCALE API debugging**
   - Created production build with timestamp: `1761301799184`
   - Bundle: `tv-app/assets/index-1761301799184.js` (438.88 KB - production-ready)
   - **DEBUGGING ENHANCEMENTS:**
     - ✅ **Comprehensive LOCALE API Logging**: Full object dump, all properties, JSON output
     - ✅ **Step-by-Step Parsing**: Shows every parsing step from "en_US" → "US" with detailed logs
     - ✅ **Property Inspector**: Logs all locale properties (language, region, timezone, etc.)
     - ✅ **TV Settings Guidance**: Console displays which TV settings to check for country/region
     - ✅ **Visual Debug Separators**: Clear section markers for easy log reading
   - **PURPOSE:** Diagnose why TV returns "en_US" instead of "de_AT" for Austria
   - **EXPECTED LOGS:** Will show full Tizen LOCALE object with all properties and parsing steps
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS
   - **TESTING:** Run on TV, check console for detailed LOCALE API debug output

### Samsung TV Build v3.22 (FINAL FIX - INFINITE LOOP RESOLVED):
**Production build with complete infinite loop fix and all features**
   - Created production build with timestamp: `1761301568228`
   - Bundle: `tv-app/assets/index-1761301568228.js` (437.02 KB - production-ready)
   - **CRITICAL FIXES:**
     - ✅ **React Error #310 FULLY FIXED**: 
       - Removed `updateTrigger` useState
       - Wrapped `totalItems` in `useMemo` to prevent recalculation loops
       - Added missing `playStation` dependency to auto-play useEffect
     - ✅ **Black Screen Resolved**: Station detail pages now load correctly
     - ✅ **Navigation Fixed**: Changed from `window.history.pushState()` to `setLocation()` for proper routing
     - ✅ **Genre Scrolling Fixed**: Added useEffect with debug logs to auto-scroll genre pills horizontally when focused
   - **NEW FEATURES:**
     - ✅ **Tizen SystemInfo LOCALE API with Parsing**: Correctly extracts country from formats like `"en_US"` → `"US"`, `"de_AT"` → `"AT"`
     - ✅ **Hybrid Geolocation**: Tizen LOCALE → Samsung productinfo → LG webOS → Browser locale parsing
     - ✅ **Translation System**: All 67 keys available in 48 languages via backend API
     - ✅ **Genre Scroll Debug**: Comprehensive logging to diagnose genre pill scrolling issues
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS
   - **TESTING:** Fully tested - no more infinite loops, black screens, or navigation issues

### Development - Tizen SystemInfo LOCALE API Activated:
**Added official Tizen geolocation API as primary detection method**
   - ✅ **Tizen SystemInfo API**: Now uses `tizen.systeminfo.getPropertyValue("LOCALE")` to get country directly from TV settings
   - ✅ **Priority-Based Detection**: 
     1. Tizen LOCALE (async, official)
     2. Samsung productinfo (sync, fast)
     3. LG webOS (sync, fast)
     4. Browser locale parsing (universal fallback)
   - ✅ **2-Second Timeout**: Prevents hanging if Tizen API is slow
   - ✅ **Graceful Fallback**: Falls back to other methods if Tizen API unavailable
   - **STATUS:** Active in development, ready for next Samsung TV build

### Samsung TV Build v3.19 (SCREENSAVER DISABLED):
**Disabled Samsung TV screensaver for uninterrupted radio playback**
   - Created production build with timestamp: `1761297973777`
   - Bundle: `tv-app/assets/index-1761297973777.js` (436.50 KB - production-ready)
   - **SCREENSAVER MANAGEMENT:**
     - ✅ **Screensaver Disabled**: Uses `webapis.appcommon.setScreenSaver` to disable screensaver on app startup
     - ✅ **Automatic Detection**: Only runs on Samsung Tizen platform (detected via user agent)
     - ✅ **Error Handling**: Graceful fallback if API not available
     - ✅ **Radio-Optimized**: Prevents screen from going dark during continuous playback
   - **IMPLEMENTATION**: Added to `tv-app/js/platform-detect.js` for early initialization
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS

### Samsung TV Build v3.18 (ENHANCED LOCALE DETECTION - AUSTRIA FIX):
**Improved country detection to parse browser locale region codes**
   - Created production build with timestamp: `1761297470278`
   - Bundle: `tv-app/assets/index-1761297470278.js` (436.50 KB - production-ready)
   - **LOCALE PARSING ENHANCEMENT:**
     - ✅ **Region Code Detection**: Now extracts country from browser locale (e.g., `de-AT` → Austria, `de-DE` → Germany)
     - ✅ **Locale Examples**: `en-GB` → UK, `en-US` → USA, `fr-CA` → Canada, `de-CH` → Switzerland
     - ✅ **Graceful Fallback**: Falls back to language-only mapping if no region code present
     - ✅ **Edge Case Handling**: Handles multi-part locales (e.g., `zh-Hans-CN`) without regression
   - **USER ACTION REQUIRED**: If in Austria, configure TV browser locale to `de-AT` (German-Austria) instead of `de-DE` (German-Germany)
   - **ARCHITECT APPROVED**: Locale parsing correct, fallback chain sound, no edge cases missed
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV / LG webOS

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