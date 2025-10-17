# Mega Radio - TV Application

## Overview

Mega Radio is a full-stack web radio streaming application designed for TV/large screen interfaces. The application provides users with access to radio stations from around the world, organized by genres and countries. It features an onboarding flow, authentication system, station discovery, favorites management, and playback controls.

The application is built as a single-page application (SPA) with a React frontend and Express backend, designed to run on platforms like Replit with PostgreSQL database support via Neon.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18 with TypeScript as the core UI framework
- Wouter for lightweight client-side routing
- TV-optimized interface with large touch targets and fixed dimensions (1920x1080px)

**UI Component System**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design system based on "new-york" style with neutral color scheme
- Custom CSS variables for theming and consistent spacing

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- Custom query client with credential-based authentication
- Optimistic updates disabled (staleTime: Infinity)
- Custom API request wrapper with automatic error handling

**Key Design Patterns**
- Component-based architecture with reusable UI primitives
- Page-based routing structure mirroring the navigation flow
- Shared schema definitions between client and server via `@shared` imports
- Form validation using Zod schemas with React Hook Form integration

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Vite dev server integration for development with HMR
- Session-based authentication (infrastructure in place via connect-pg-simple)

**Data Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via Neon serverless)
- In-memory storage implementation (MemStorage) as fallback/development mode
- Schema-first design with Zod validation

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Credential-based authentication flow
- Request logging middleware with response capture

**Development Environment**
- TypeScript with strict mode enabled
- ESM module system throughout
- Separate build processes for client (Vite) and server (esbuild)
- Hot module replacement in development

### Database Schema

**Users Table**
- `id`: UUID primary key (auto-generated)
- `username`: Unique text field
- `password`: Text field (hashed)

The schema uses Drizzle's PostgreSQL adapter with type inference for Insert and Select operations. Zod schemas are auto-generated from Drizzle tables for runtime validation.

### Application Flow

**Authentication Flow**
1. Splash screen (auto-redirects to login)
2. Multiple login options (Apple, Facebook, Google, Email)
3. Email-based authentication with forgot password flow
4. Password reset via email confirmation

**Onboarding Flow**
1. Guide 1: Discover feature (red button)
2. Guide 2: Genres feature (green button)
3. Guide 3: Search feature (blue button)
4. Guide 4: Favorites feature (yellow button)

**Main Application Pages**
- Discover: Home page with popular stations from API and genre discovery
- Genres: Browse all genres with real station counts from API
- GenreList: View stations filtered by specific genre
- Search: Real-time search with API integration
- Favorites: User's saved stations (UI ready, requires authentication)
- Settings: User preferences and country selection (UI ready, requires authentication)
- Radio Playing: Full-screen playback with real station data, similar stations, and metadata

**API Integration (Mega Radio API - themegaradio.com)**
- All pages use real API data from themegaradio.com
- Station endpoints: getStationById, getSimilarStations, getPopularStations, searchStations
- Genre endpoints: getAllGenres, getDiscoverableGenres, getStationsByGenre
- Metadata endpoint: getStationMetadata (now playing info with 30s refresh)
- Helper functions handle API response formats (stations wrapped in {stations:[]}, genres in {data:[]})
- Tags field parsed from comma-separated string to array
- Station images use favicon field or fallback to proxy endpoint

### External Dependencies

**Core Infrastructure**
- Neon Database (@neondatabase/serverless): Serverless PostgreSQL hosting
- Drizzle ORM (drizzle-orm): Type-safe database toolkit
- Vite: Build tool and dev server

**Authentication & Sessions**
- connect-pg-simple: PostgreSQL session store for Express
- Express sessions (implied by session store dependency)

**UI Framework**
- Radix UI: Unstyled, accessible component primitives
- Tailwind CSS: Utility-first CSS framework
- Lucide React: Icon library

**Data & Forms**
- React Hook Form (@hookform/resolvers): Form state management
- Zod: Schema validation library
- TanStack Query: Async state management

**Development Tools**
- TypeScript: Type safety and developer experience
- Wouter: Minimal routing library
- Replit-specific plugins for development environment integration

**Font Resources**
- Ubuntu font family (primary typeface)
- Google Fonts integration

**Asset Management**
- Figma-exported assets stored in `/figmaAssets` directory
- SVG icons and PNG images for radio station logos
- Wave animations and visual effects

### TV Platform Support (LG webOS & Samsung Tizen)

**Platform Detection**
- Automatic platform detection via user agent (client/public/js/platform-detect.js)
- LG webOS: Detected by "web0s" in user agent
- Samsung Tizen: Detected by "tizen" in user agent or tizen API presence
- Web Browser: Default fallback for non-TV platforms

**Remote Control Navigation**
- Global key event handler (client/public/js/tv-remote-keys.js)
- Platform-specific key codes mapping:
  - RETURN: 10009 (Samsung), 461 (LG)
  - CH_UP/DOWN: 427/428 (Samsung), 33/34 (LG)
  - Directional keys (UP/DOWN/LEFT/RIGHT): 38/40/37/39 (both platforms)
  - ENTER/SELECT: 13 (both platforms)
- Focus management system with visual indicators (.tv-focused CSS class)
- Automatic focus navigation using data-tv-focusable attributes on interactive elements

**Audio Playback System**
- Dual audio player implementation (client/public/js/tv-audio-player.js)
- Samsung Tizen: Uses webapis.avplay API for AVPlay streaming
- LG webOS: Uses HTML5 Audio/Video elements
- Web Browser: Standard HTML5 Audio with controls
- Unified interface with event handlers (onPlay, onPause, onStop, onBuffering, onError)
- Auto-play support when station changes
- Volume control and playback state management

**TV-Specific Styling**
- Custom CSS for TV focus states (client/public/css/tv-styles.css)
- Pink focus outline with glow effect (#ff4199)
- Scale transformations on focus for better visibility
- Hidden cursor on TV platforms
- Scrollbar hiding for cleaner TV interface
- Platform-specific visibility classes (.lg-only, .samsung-only, .tv-only)

**SDK Integration**
- LG webOS SDK (webOSTVjs-1.2.0) included in client/public/
- Samsung Tizen: Uses native webapis (no separate SDK needed)
- Platform scripts loaded globally via index.html

**Configuration Files**
- LG webOS: appinfo.json (app ID: com.megaradio.tv, resolution: 1920x1080)
- Samsung Tizen: config.xml (package ID: MegaRadioTV, Tizen version 6.0)

**Interactive Element Support**
- All interactive elements tagged with data-tv-focusable="true"
- Pages with TV navigation support:
  - RadioPlaying: Full playback controls, station navigation
  - DiscoverNoUser: Station cards, genre pills, sidebar navigation
  - Genres: Genre cards, sidebar navigation
  - GenreList: Station cards, back button, sidebar navigation
  - Search: Search input, station cards, sidebar navigation
  - Favorites & Settings: Full TV navigation support with all interactive elements

### TV App Deployment

**Samsung Tizen TV App (Primary)**
The `tv-app/` folder contains the official Samsung Tizen TV project extracted from `MegaRadioTVAPP.zip`:

```
tv-app/
├── config.xml          # Samsung Tizen configuration (lJoKY533ah.MegaRadioTVAPP)
├── .project            # Tizen Studio project file
├── .tproject           # Platform: tv-samsung-9.0
├── .settings/          # Eclipse/Tizen Studio settings
├── index.html          # Main entry point (auto-generated)
├── icon.png            # App icon (57KB)
├── assets/             # Built React app
│   ├── index-[hash].js
│   └── index-[hash].css
├── css/
│   └── style.css       # TV styles
├── js/                 # Platform scripts
│   ├── platform-detect.js
│   ├── tv-remote-keys.js
│   └── tv-audio-player.js
├── webOSTVjs-1.2.0/    # LG webOS SDK (cross-platform support)
└── images/             # Additional images
```

**Build Process**
1. Run `./build-samsung-tv.sh` to build and prepare the Samsung TV app
2. The script builds the React app with Vite
3. Copies built assets from `dist/public/` to `tv-app/assets/`
4. Generates `index.html` with all TV scripts and React app integrated
5. Uses relative paths for all resources (required for TV platforms)

**Important**: Configuration files (`config.xml`, `.project`, `.tproject`, `.settings/`) are from the original Samsung project and must NOT be modified. The build script only updates `index.html` and `assets/`.

**Deploying to Samsung TV (Tizen Studio)**
1. Open Tizen Studio
2. File > Open Projects from File System
3. Select the `tv-app` folder
4. Platform detected as `tv-samsung-9.0`
5. Right-click project > Run As > Tizen Web Application
6. Select Samsung TV emulator or real device

**App Configuration**
- App ID: `lJoKY533ah.MegaRadioTVAPP`
- Package: `lJoKY533ah`
- Platform: Samsung Tizen TV 9.0
- Resolution: 1920x1080

**Platform Detection Requirements**
- Samsung Tizen: Requires `config.xml`, `.project`, `.tproject` at root
- LG webOS: Requires `appinfo.json` at root
- Both: Require `index.html` at root with flat asset structure

**Key Configuration Files**
- `config.xml`: Samsung Tizen widget configuration (app ID, package, privileges)
- `appinfo.json`: LG webOS app metadata (app ID, resolution, permissions)
- `.project`: Eclipse project file for Tizen Studio recognition
- `.tproject`: Tizen platform version specification (tv-samsung-6.0)