# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV/large screen interfaces. It offers global radio station access from 238+ countries, organized by genres and countries, featuring an onboarding flow, authentication, station discovery, favorites, and playback controls. The application is a single-page React frontend with an Express backend, utilizing a PostgreSQL database via Neon. The project's vision is to provide a seamless radio streaming experience optimized for television environments.

## Recent Changes (October 18, 2025)

**Favorites Functionality Implementation (Build: index-DBDnoY9y.js):**
- Created FavoritesContext for global favorites state management with localStorage persistence
- Added heart button to RadioPlaying page that toggles favorite status (pink when favorited)
- Implemented Favorites page based on Figma design (1650:3932) with 7-column grid layout
- Favorites page shows all saved stations with same design as GenreList
- Heart button visual feedback: changes to pink background when station is favorited
- Click station card to play, works seamlessly with existing radio playback
- Empty state based on Figma design (2170:7931): centered pink heart icon, two-line message, pink CTA with arrow
- Empty state CTA links to Discover page for easy station discovery
- All favorites persist across app sessions via localStorage

**Genre List Page Implementation (Build: index-CWtQTVq8.js):**
- Implemented genre content page based on Figma design (1623:6928)
- Uses AppLayout for consistent header/sidebar across all pages
- Shows stations filtered by genre AND selected country (global context)
- 7-column grid layout (21 stations per page) matching exact Figma positions
- Infinite scroll for loading more stations (client-side pagination)
- Back button navigates to Genres page
- Dynamic genre title from URL parameters
- Integrated with global country selection context

**Fixed Layout for Samsung TV (Build: index-DmIq4fBv.js):**
- Fixed AppLayout to use exact 1920x1080 fixed dimensions instead of `min-h-[1080px]`
- Changed from `relative w-[1920px] min-h-[1080px]` to `fixed inset-0 w-[1920px] h-[1080px] overflow-hidden`
- Ensures consistent layout rendering across Samsung TV, LG webOS, and web browsers
- All pages now use exact 1920x1080 viewport with no vertical expansion
- Critical fix for Samsung Tizen TV hardware compatibility

**Global Country Selection Fix (Build: index-B0FgqF_j.js):**
- Fixed RadioPlaying page to use global `CountryContext` instead of local state
- RadioPlaying was hardcoded to "United States" - now uses global country selection
- All pages now share same country state: Discover, Genres, Search, RadioPlaying
- Country selection persists across ALL pages via `CountryContext` + localStorage
- Removed "Popular Radios" section from station detail page
- Fixed missing SVG images in Country Selector (changed to relative paths)

**Global Country Selection & Shared Layout Implementation:**
- Created `CountryContext` to provide global country state across all pages
- Built `AppLayout` component with shared header and sidebar for all main pages
- Refactored Discover, Genres, and Search pages to use shared AppLayout
- Country selection now persists globally - when user changes country on any page, all pages update automatically
- Eliminated code duplication by centralizing header/sidebar in single component

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The application targets TV-optimized interfaces with fixed 1920x1080px dimensions and large touch targets. It features an auto-hide header with smooth transitions for improved UX on TV platforms. The UI uses Shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS and a neutral "new-york" design system with custom CSS variables.

### Technical Implementations

**Frontend:**
-   **Framework:** React 18 with TypeScript.
-   **Routing:** Wouter for client-side navigation.
-   **State Management:** TanStack Query for server state, custom API wrapper for error handling, infinite scroll for station lists.
-   **Design Patterns:** Component-based architecture, page-based routing, shared schema definitions via `@shared`, Zod for form validation with React Hook Form.

**Backend:**
-   **Framework:** Express.js for HTTP server and API routing, integrated with Vite dev server for HMR.
-   **Data Layer:** Drizzle ORM for type-safe PostgreSQL operations (Neon serverless), with Zod for schema validation.
-   **API:** RESTful API endpoints under `/api`, JSON format, credential-based authentication.
-   **Development:** TypeScript (strict mode), ESM, separate build processes (Vite for client, esbuild for server).

**Samsung Tizen TV Compatibility:**
-   Targets Chromium 76 (ES2015/ES6).
-   Includes polyfills for ES2019+ features (e.g., `globalThis`, `Object.fromEntries`, `Array.prototype.flat`).
-   Uses `&&` checks instead of optional chaining.
-   IIFE bundle format.
-   Fetch polyfill (`tv-app/js/fetch-polyfill-samsung.js`) using `XMLHttpRequest` for CORS handling on Tizen.

**Application Flow:**
-   **Authentication:** Splash screen to login, multiple login options (Apple, Facebook, Google, Email), email-based authentication with password reset.
-   **Onboarding:** Guided tour for Discover, Genres, Search, and Favorites features.
-   **Main Pages:** Discover (popular stations), Genres (browse by genre), GenreList, Search (real-time), Favorites (user-saved), Settings (user preferences), Radio Playing (full-screen playback).

**Samsung Tizen TV App Structure:**
The `tv-app/` directory is the complete Samsung Tizen project. A build script (`build-samsung-tv.sh`) builds the React app, copies assets, and generates `index.html` for Tizen deployment. Configuration files (`config.xml`, `.project`, `.tproject`) are specific to Tizen Studio.

### System Design Choices

**Samsung TV Network Configuration:**
-   `fetch-polyfill-samsung.js` replaces native `fetch()` with `XMLHttpRequest` for better Samsung TV compatibility.
-   Direct API calls to `https://themegaradio.com/api` (CORS headers added on backend).
-   Polyfill loads before the React app in `index.html`.
-   `config.xml` includes `http://tizen.org/privilege/internet` and `http://developer.samsung.com/privilege/network.public` for network access.
-   Backend Express server provides optional `/api/proxy/*` endpoints for development/testing.

**TV Platform Support (LG webOS & Samsung Tizen):**
-   **Platform Detection:** Automatic via user agent.
-   **Remote Control Navigation:** Global key event handler, platform-specific key codes, focus management with `data-tv-focusable` attributes, initiated by `useTVNavigation` hook.
-   **Audio Playback:** Dual implementation: `webapis.avplay` for Tizen, HTML5 Audio/Video for webOS/browsers. Unified interface with event handlers.
-   **TV-Specific Styling:** Custom CSS for focus states, hidden cursor, scrollbar hiding, platform-specific visibility classes.
-   **SDK Integration:** LG webOS SDK (`webOSTVjs-1.2.0`) included; Samsung Tizen uses native `webapis`.

## External Dependencies

-   **Database:** Neon Database (@neondatabase/serverless) for PostgreSQL.
-   **ORM:** Drizzle ORM (drizzle-orm).
-   **Build Tool:** Vite.
-   **Authentication:** `connect-pg-simple` for PostgreSQL session storage.
-   **UI Components:** Radix UI primitives, Tailwind CSS, Lucide React (icons).
-   **Forms & Validation:** React Hook Form (@hookform/resolvers), Zod.
-   **Async State:** TanStack Query.
-   **Routing:** Wouter.
-   **Typing:** TypeScript.
-   **Fonts:** Ubuntu font family (via Google Fonts).
-   **API Integration:** themegaradio.com API (for station data, genres, metadata, translations).

## Localization & Internationalization

**Auto Language Detection:**
-   Detects device language on startup using Samsung Tizen (`webapis.tv.info.getLanguage()`), LG webOS (`webOS.systemInfo.locale`), or browser navigator.
-   Supports 48 languages via API: en, es, fr, de, it, pt, ru, ja, zh, ar, tr, pl, nl, sv, no, da, fi, cs, hu, ro, el, th, ko, vi, id, ms, hi, bn, ta, te, ur, fa, he, uk, bg, sr, hr, sk, sl, et, lv, lt, is, ga, sq, mk, am, sw.
-   Maps detected language to default country for station filtering.

**Translation System:**
-   `LocalizationProvider` context wraps the app, providing `t()` function and language state.
-   `useLocalization()` hook provides: `language`, `translations`, `setLanguage()`, `t()`, `detectedCountry`, `detectedCountryCode`.
-   Translations fetched from `/api/translations/:lang` endpoint.
-   Language preference saved to localStorage.

**Usage Example:**
```tsx
import { useLocalization } from '@/contexts/LocalizationContext';

const { t, language, setLanguage, detectedCountryCode } = useLocalization();
// Use translations: {t('popular_genres')}
// Change language: setLanguage('es')
// Get detected country: detectedCountryCode
```