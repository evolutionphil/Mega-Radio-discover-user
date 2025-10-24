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

### Samsung TV Build v3.46 (PULSE + GLOW EFFECT):
**Added Pulse Animation to Control Buttons** - Enhanced visual feedback
   - Created production build with timestamp: `1761323068810`
   - Bundle: `tv-app/assets/index-1761323068810.js` (433.95KB - full React app)
   - **NEW FEATURE:**
     - ✅ **Pulse + Glow**: Control buttons now show both pulse animation AND pink glow when focused
     - ✅ **Visual Feedback**: Subtle pulsing makes it even clearer which button is selected
     - ✅ **Better UX**: Combined pulse and glow create a more dynamic and noticeable effect
   - **APPLIES TO:**
     - Previous Button (focus index 6)
     - Play/Pause Button (focus index 7)
     - Next Button (focus index 8)
     - Heart/Favorite Button (focus index 9)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.45 (DISCOVER PAGE SWIPE LOGIC):
**Applied Discover Page Swipe Logic to Similar & Popular Radios** - Smooth horizontal scrolling
   - Created production build with timestamp: `1761322957721`
   - Bundle: `tv-app/assets/index-1761322957721.js` (433.87KB - full React app)
   - **IMPROVEMENT:**
     - ✅ **Smooth Scrolling**: Similar and Popular radios now use the exact same swipe logic as Discover page popular genres
     - ✅ **Better Navigation**: Horizontal scrolling is smoother and more responsive
     - ✅ **Consistent UX**: Same scroll behavior across all horizontal sections in the app
   - **TECHNICAL:**
     - Implemented `scrollSimilarIntoView()` and `scrollPopularIntoView()` functions
     - Calculates scroll position: `stationIndex * (cardWidth + gap)`
     - Uses `scrollTo({ left: position, behavior: 'smooth' })`
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.44 (4 GENRE CARDS PER ROW):
**Changed All Genres Section to 4 Cards Per Row** - Consistent layout with Popular Genres
   - Created production build with timestamp: `1761322752520`
   - Bundle: `tv-app/assets/index-1761322752520.js` (433.77KB - full React app)
   - **CHANGE:**
     - ✅ **4 Cards Per Row**: All Genres section now displays 4 genre cards per row (was 6)
     - ✅ **Wider Cards**: Genre cards are now 386-387px wide (was 248px)
     - ✅ **Consistent Layout**: Matches the Popular Genres section layout
     - ✅ **Better Readability**: Larger cards make genre names and station counts easier to read
   - **APPLIES TO:**
     - All Genres grid section (below Popular Genres)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.43 (CONTROL BUTTONS PINK GLOW):
**Added Pink Glow Effect to Control Buttons** - Enhanced focus visibility
   - Created production build with timestamp: `1761322632651`
   - Bundle: `tv-app/assets/index-1761322632651.js` (433.82KB - full React app)
   - **NEW FEATURE:**
     - ✅ **Pink Glow on Focus**: Previous, Play/Pause, Next, and Heart buttons now show pink glow when focused
     - ✅ **Pink Border**: 4px pink (#ff4199) border appears when button is focused
     - ✅ **Box Shadow**: 30px pink glow (rgba(255, 65, 153, 0.8)) for better visibility
     - ✅ **Remote Navigation**: Use LEFT/RIGHT arrows to move between control buttons
   - **APPLIES TO:**
     - Previous Button (focus index 6)
     - Play/Pause Button (focus index 7)
     - Next Button (focus index 8)
     - Heart/Favorite Button (focus index 9)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.42 (SEE MORE POPULAR RADIOS + AUTO-SCROLL):
**Added "See More" Button for Popular Radios** - Load 50 more stations on demand
   - Created production build with timestamp: `1761322260793`
   - Bundle: `tv-app/assets/index-1761322260793.js` (433.50KB - full React app)
   - **NEW FEATURES:**
     - ✅ **See More Button**: A special "See More" card appears at the end of Popular Radios section
     - ✅ **Load More Stations**: Clicking "See More" loads 50 additional random global popular stations
     - ✅ **Infinite Loading**: Keep clicking to load more stations (up to API limits)
     - ✅ **Remote Navigation**: Navigate to "See More" card with LEFT/RIGHT buttons
     - ✅ **Auto-Scroll Horizontal**: Focused cards automatically scroll into view horizontally
     - ✅ **Auto-Scroll Vertical**: Container automatically scrolls down when navigating from Similar to Popular sections
   - **HOW IT WORKS:**
     - Initially shows 20 random popular stations
     - "See More" card appears as the last item
     - Each click loads 50 more random stations from global catalog
     - Navigation focus automatically extends to new stations
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.41 (UNIFIED GENRE CARD SIZES):
**All Genre Cards Now Same Size** - Consistent text sizing across Popular and All sections
   - Created production build with timestamp: `1761321826279`
   - Bundle: `tv-app/assets/index-1761321826279.js` (432.50KB - full React app)
   - **FIX:**
     - ✅ **Consistent Text Sizes**: All genre cards now use 24px genre name + 22px station count
     - ✅ **Visual Consistency**: Popular Genres and All Genres sections now look identical
   - **TEXT SIZES:**
     - Genre name: 24px (was 20px in All Genres section)
     - Station count: 22px (was 18px in All Genres section)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

### Samsung TV Build v3.40 (FIXED NAVIGATION & SCROLL):
**Fixed Similar/Popular Navigation & Card Spacing** - Proper horizontal scroll and remote control navigation
   - Created production build with timestamp: `1761321725329`
   - Bundle: `tv-app/assets/index-1761321725329.js` (432.50KB - full React app)
   - **FIXES:**
     - ✅ **DOWN Navigation Works**: Remote DOWN button now moves from Similar to Popular stations
     - ✅ **UP Navigation Works**: Remote UP button moves from Popular back to Similar stations
     - ✅ **Card Spacing Fixed**: 24px gap between all station cards (using inline marginRight for Chromium 76 compatibility)
     - ✅ **Horizontal Scroll Works**: Both sections scroll horizontally as you navigate with LEFT/RIGHT
     - ✅ **Auto-Scroll**: Focused cards automatically scroll into view
     - ✅ **Click Selection**: Both Similar and Popular stations are clickable
   - **NAVIGATION:**
     - Similar Radios: Focus index 10-29 (LEFT/RIGHT to navigate, DOWN to go to Popular)
     - Popular Radios: Focus index 30-49 (LEFT/RIGHT to navigate, UP to go back to Similar)
   - **DEPLOY:** Entire `tv-app/` folder to Samsung TV

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