# Radio Mega - TV Application

## Overview

Radio Mega is a full-stack web radio streaming application designed for TV and large screens. It offers access to global radio stations from over 238 countries, featuring intuitive onboarding, station discovery, favorites management, and continuous audio playback. The project aims to deliver a high-quality radio streaming experience on smart TVs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application targets a fixed 1920x1080px resolution for TV optimization, using large, focusable elements and an auto-hide header. It leverages Shadcn/ui components (based on Radix UI primitives) and Tailwind CSS, adhering to a "new-york" design system with custom CSS variables. A fixed `inset-0 w-[1920px] h-[1080px] overflow-hidden` CSS property ensures consistent rendering. Focus glow effects are implemented using CSS `:focus` and `tabIndex={0}`.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter, utilizing hash-based routing for Samsung TV compatibility.
-   **State Management:** TanStack Query for server state.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions, and Zod for validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, communicating in JSON format.

**Platform Compatibility:**
-   **Unified TV Build:** A single `tv-app/` folder supports both Samsung Tizen (targeting Chromium 76 with polyfills) and LG webOS (HTML5 Audio/Video and `webOSTVjs-1.2.0` SDK).
-   **Platform Detection:** Automatic detection via user agent.
-   **Remote Control Navigation:** Implements an LGTV focus pattern using `useFocusManager`, `usePageKeyHandler`, and `getFocusClasses` for dynamic adaptation, including specific fixes for sidebar, country selector, and two-step return button behavior. PAGE_UP/DOWN and CH_UP/CH_DOWN keys jump to the global player. 
    -   **Genres Page:** Uses 4-column grid layout for both "Popular Genres" and "All Genres" sections with custom navigation that properly handles DOWN/UP (moves 4 items = 1 row) and LEFT/RIGHT (moves 1 item horizontally).
    -   **GenreList Page:** Uses 7-column grid with custom navigation logic that properly handles incomplete rows and ensures DOWN/UP only moves vertically and LEFT/RIGHT only moves horizontally.
-   **Audio Playback:** A unified interface manages `webapis.avplay` for Tizen and HTML5 Audio/Video for webOS/browsers. Includes automatic retry logic with exponential backoff (up to 3 retries with 1s → 2s → 4s delays) to recover from stream errors.
-   **Samsung TV Certification Compliance:**
    -   **Network Monitoring:** `NetworkStatusContext` monitors network connectivity using Samsung's `webapis.network` API for Tizen and browser `online`/`offline` events for webOS/browsers. Automatically pauses audio playback when network disconnects and displays a localized pink-themed modal.
    -   **Screensaver Prevention:** `GlobalPlayerContext` uses `tizen.power.request/release` API to prevent screensaver during audio playback on Samsung TVs, with Web Wake Lock API fallback for other platforms.
    -   **Multitasking Support:** `AppLifecycleContext` handles Samsung app lifecycle events (`AppSuspend`, `AppResume`, `AppHide`, `AppShow`) via `webapis.appcommon.addAppEventListener`, pausing audio when app goes to background, with `document.visibilitychange` fallback for cross-platform compatibility.
    -   **Exit Modal:** Implements Samsung-compliant exit modal using `tizen.application.getCurrentApplication().exit()` on home page.
    -   **Required Privileges:** config.xml includes `http://tizen.org/privilege/power` for screensaver prevention and `http://developer.samsung.com/privilege/network.public` for network monitoring.
-   **TV-Specific Styling:** Custom CSS handles focus states, hidden cursors, scrollbar hiding, and platform-specific visibility.

**Application Flow:**
-   **Onboarding:** Guided tour for new users.
-   **Main Pages:** Discover, Genres, Search, Favorites, Settings, Country Select, and a full-screen Radio Playing interface.
-   **Auto-Play:** Configurable startup modes (Last Played, Random, Favorite, None), with "None" as the default.
-   **Localization & Internationalization:** Supports 48 languages via API translations and automatic language detection.
-   **Global Country Support:** Defaults to "Global" country if no country is saved, allowing browsing of worldwide stations and genres, with a dedicated globe icon. Country selection accessible via sidebar navigation (6th item) and as a standalone page at `/country-select` with sidebar visible.
-   **CountrySelector Modes:** Supports `mode='modal'` (full-screen overlay, z-50) for inline use from pages, and `mode='page'` (lower z-index z-30, no overlay background) for standalone page use with sidebar visible.
-   **Navigation History:** `NavigationContext` tracks page navigation and focus state for proper back button behavior. Implemented across multiple pages:
    -   **Discover Page:** When clicking on Popular Genres or More From Country stations, saves focus state before navigating to RadioPlaying. Back button restores focus to the exact station clicked.
    -   **GenreList Page:** When clicking on stations, saves focus state before navigating to RadioPlaying. Back button restores focus to the exact station clicked.
    -   Navigation flow example: Discover → RadioPlaying → Back → Discover (focus restored to clicked station).

### System Design Choices

**Global Player:**
-   A `GlobalPlayerContext` ensures continuous audio playback and manages a persistent player bar, fetching "Now Playing" metadata from themegaradio.com API every 30 seconds.
-   Metadata is displayed in pink and truncates long song titles.
-   The global player bar is automatically hidden on the RadioPlaying page to avoid duplication.
-   Playback continues uninterrupted when navigating between pages.

**Pagination:**
-   **GenreList Page:** Implements paginated loading with 28 stations per batch (4 rows × 7 columns) for improved navigation performance. Automatically loads next batch when scrolling within 600px of bottom.
-   **Discover Page:** Uses 100 stations per batch with offset-based pagination for infinite scrolling.

**Caching Strategy:**
-   A multi-tiered caching strategy is implemented using TanStack Query v5. Cache durations vary based on data volatility: Countries (30 days), Genres & Station Lists (7 days), Popular Stations & Station Details (24 hours), Search Results (24 hours), and Live Metadata (30 seconds refresh).

**UI Enhancements:**
-   Control buttons feature pulse animations and pink glow effects when focused for enhanced visual feedback.
-   Horizontal sections like Similar and Popular Radios use smooth swipe logic for navigation.
-   Genre card layouts are consistent across sections, displaying 4 cards per row with genre name on top and station count below, all left-aligned.
-   "See More" buttons are available for popular radio sections to load additional stations on demand, with auto-scrolling for focused cards.

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