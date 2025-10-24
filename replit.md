# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV and large screen interfaces. It offers access to global radio stations from over 238 countries, categorized by genres and countries. The application aims to provide intuitive onboarding, station discovery, favorites management, and continuous audio playback, all optimized for an immersive television experience. The project's ambition is to deliver a high-quality radio streaming service on smart TVs with significant market potential.

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
-   **Localization & Internationalization:** Supports 48 languages via API translations and automatic language detection.

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar.
-   Fetches "Now Playing" metadata from themegaradio.com API every 30 seconds via `megaRadioApi.getStationMetadata()`.
-   Displays metadata in pink (#ff4199) on global player bar (visible on Discover, Genres, Search, Favorites, Settings).
-   Global player bar is automatically hidden on RadioPlaying page to avoid duplication with full-screen player.

**Fixed Layout:**
-   The application uses a `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property for consistent rendering across platforms.

**Infinite Scrolling:**
-   Implemented true lazy loading with API pagination for station lists (Discover, GenreList), fetching 100 stations per batch with offset-based pagination. This supports scrolling through thousands of stations.

**Navigation Enhancements:**
-   Focus management ensures proper navigation with TV remote controls, including specific fixes for sidebar focus, country selector interactions, and two-step return button behavior for modals and keyboards.

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

### Samsung TV Build v3.20 (SIMILAR STATIONS SPACING FIX):
**Fixed Similar Stations Padding on Samsung TV** - Replaced gap with margin-right for better compatibility
   - Created production build with timestamp: `1761312151071`
   - Bundle: `tv-app/assets/index-1761312151071.js` (426.43KB - full React app)
   - **SAMSUNG TV COMPATIBILITY FIX:**
     - ✅ Replaced `gap-[24px]` with `mr-[24px]` on similar station cards
     - ✅ Chromium 76 on Samsung TV doesn't fully support CSS gap property
     - ✅ Each station card now has explicit 24px margin-right spacing
     - ✅ Ensures consistent spacing between similar stations on all platforms
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.19 (PAGE_UP/DOWN + GLOW FIX):
**Fixed Global Player Navigation & Focus Glow** - PAGE_UP/DOWN keys jump to player, CSS-based glow effects
   - Created production build with timestamp: `1761309977335`
   - Bundle: `tv-app/assets/index-1761309977335.js` (426.43KB - full React app)
   - **KEY NAVIGATION FIXES:**
     - ✅ PAGE_UP (33) and PAGE_DOWN (34) now jump to global player
     - ✅ CH_UP (427) and CH_DOWN (428) also jump to global player
     - ✅ All keys focus the play/pause button of global player bar
     - ✅ Works on DiscoverNoUser page (more pages to follow)
   - **FOCUS GLOW IMPROVEMENTS:**
     - ✅ Switched to CSS focus pseudo-classes (`:focus`) for better TV compatibility
     - ✅ Added `tabIndex={0}` to all global player buttons for proper DOM focus
     - ✅ Pink glow: `shadow-[0_0_30px_rgba(255,65,153,0.8),0_0_60px_rgba(255,65,153,0.5)]`
     - ✅ Play/Pause: 4px pink border + glow when focused
     - ✅ Next: 4px pink border + glow when focused
     - ✅ Previous: Pink glow (already has pink border)
     - ✅ Favorite: Pink border + glow when focused (if not favorited)
     - ✅ Equalizer: Pink border + glow when focused (if not playing)
   - **PLAYBACK CONTINUITY:**
     - ✅ Verified back button on RadioPlaying page does NOT stop playback
     - ✅ GlobalPlayerContext continues playing when navigating between pages
   - **Technical Details:**
     - Uses Tailwind `focus:` pseudo-classes instead of JavaScript event handlers
     - More compatible with TV spatial navigation system
     - Maintains smooth transitions and pulse animations
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.18 (GLOBAL PLAYER GLOW EFFECTS - DEPRECATED):
**Added CH_UP/CH_DOWN Keys to Jump to Global Player** - Samsung TV remote channel keys now jump to global player controls
   - Created production build with timestamp: `1761309508602`
   - Bundle: `tv-app/assets/index-1761309508602.js` (425.88KB - full React app)
   - **NEW FEATURE:**
     - ✅ CH_UP (keycode 427) and CH_DOWN (keycode 428) now jump to global player
     - ✅ Implemented on DiscoverNoUser page (additional pages coming soon)
     - ✅ Focuses the play/pause button of the global player bar
     - ✅ Only works when global player is visible (station is playing)
   - **Technical Details:**
     - Detects Samsung TV-specific channel keycodes
     - Uses DOM querySelector to find and focus global player button
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.16 (GENRES SMOOTH SCROLL):
**Improved Popular Genres Horizontal Scrolling** - Genres now scroll smoothly like similar stations
   - Created production build with timestamp: `1761309229112`
   - Bundle: `tv-app/assets/index-1761309229112.js` (425.66KB - full React app)
   - **SCROLL IMPROVEMENTS:**
     - ✅ Added genreScrollRef for direct scroll control
     - ✅ Replaced scrollIntoView with scrollTo for smoother scrolling
     - ✅ Matches similar stations scroll behavior
     - ✅ Calculates scroll position based on genre width + gap
   - **Technical Details:**
     - Uses scrollTo({ left: position, behavior: 'smooth' }) instead of scrollIntoView
     - More responsive to LEFT/RIGHT remote control inputs
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.15 (GLOBAL PLAYER HIDE FIX):
**Fixed Global Player Bar Hiding on RadioPlaying Page** - GlobalPlayer now correctly hides on station detail page
   - Created production build with timestamp: `1761309003382`
   - Bundle: `tv-app/assets/index-1761309003382.js` (425.75KB - full React app)
   - **CRITICAL BUG FIX:**
     - ✅ GlobalPlayer component moved inside Router (was outside, couldn't detect routes)
     - ✅ GlobalPlayer now correctly uses wouter's useLocation hook
     - ✅ Properly hides on `/radio-playing` page to avoid duplication
     - ✅ Shows on all other pages (Discover, Genres, Search, Favorites, Settings)
   - **Technical Details:**
     - Issue: GlobalPlayer was rendered outside WouterRouter in App.tsx
     - Fix: Moved <GlobalPlayer /> inside WouterRouter after <Switch>
     - Result: location hook now returns "/radio-playing" instead of "/"
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV