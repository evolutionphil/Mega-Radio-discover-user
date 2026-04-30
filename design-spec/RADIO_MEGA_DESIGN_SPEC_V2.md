# Radio Mega — TV App Cross-Platform Design Specification (V2)

> **Audience:** Apple TV (tvOS / SwiftUI), macOS (SwiftUI / AppKit), Windows (WPF / WinUI3), Android TV (Jetpack Compose / Leanback) implementation teams.
>
> **Reference implementation:** Web TV app at `tv-app/` (React 18 + TypeScript + Vite + Tailwind + Wouter), already shipped on Samsung Tizen and LG webOS.
>
> **Non-goals:** This document is *not* a high-level brief. Every visible pixel, color, animation duration, focus rule, API endpoint, localStorage key and remote-control key code is documented verbatim from the source code so that a native re-implementation produces a 1:1 visual and behavioural match.

---

## 0. Document Conventions

* **Resolution lock:** Every screen is laid out for **1920 × 1080 px** (16:9 Full HD). Use design-time absolute coordinates and a fixed render canvas; on platforms that scale, scale the entire canvas as a single layer (no responsive reflow).
* **Coordinate system:** Top-left origin (`x = left`, `y = top`), matching CSS `position: absolute; left: Xpx; top: Ypx`.
* **Color format:** Hex (`#RRGGBB[AA]`) or `rgba(R,G,B,A)` with A in the 0..1 range. All colors and alphas are **verbatim** from CSS.
* **Font:** Single family — **Ubuntu** (4 weights used: 300 light, 400 regular, 500 medium, 700 bold). Fall back to system sans only as a last resort.
* **Numeric pixel values are exact.** Do not round to "design tokens" — the existing TV implementation uses arbitrary fractional values (e.g. `89px`, `89.082px`, `155.85px`) that are part of the visual fingerprint.
* **TSX excerpts** in this document are reproduced verbatim from `tv-app/src/...` and represent the *source of truth*. When a native value disagrees with the verbatim TSX, the TSX wins.

---

## 1. Product Overview

Radio Mega is a global internet-radio player optimized for 10-foot UI on living-room TVs. The app provides:

1. A 4-step onboarding tour (color-button education).
2. A discovery surface listing recently played, "For You", popular genres, popular stations, and country-filtered stations.
3. A genres taxonomy browser (popular + all) and per-genre station list.
4. Full-text station search via on-screen virtual keyboard supporting **13 keyboard layouts** (en, tr, ar, ru, de, fr, es, ja, zh, ko, el, hi, th).
5. A 219-country (+ "Global") country switcher.
6. Favorites management.
7. A 7-category Settings surface (Language, Keyboard, Play at Start, Sleep Timer, Accessibility, Account, Cast).
8. A full-screen Radio Playing experience with metadata, similar stations, "More from country" carousel, and an OLED-safe Ambient Mode triggered after 3 minutes idle.
9. A Netflix-style 6-digit Login → Cast pairing flow.
10. Continuous, route-independent audio playback via a global player bar.
11. Localized UI in 48 languages (auto-detected from device locale).

The app must meet **Samsung TV certification** requirements: network-loss modal, screensaver-prevention, app-lifecycle pause/resume, and a remote `EXIT`/`RETURN` two-step confirmation.

---

## 2. Visual System Snapshot

### 2.1 Brand color palette (verbatim from source)

| Token | Hex | Usage |
|---|---|---|
| **Brand Pink (primary)** | `#ff4199` | All focus rings, primary buttons, active sidebar item background, "Now playing" metadata text, brand "M" mark |
| Brand Pink hover | `#e0368a` | Retry button hover only |
| Brand Pink lighter | `#ff5aa8` | Network modal OK button hover |
| App background | `#0e0e0e` | Page root background (Discover, Genres, GenreList, Search, Favorites, Settings, Splash) |
| Modal panel | `#1a1a1a` | Exit modal & network modal panel surface |
| Help modal panel | `#1a1a2e` | Help modal panel only |
| Cyan accent | `#01d7fb` | Search input focused border + glow |
| Color-button RED (Discover) | `#e74c3c` (legacy `#e95252`) | Help "Add to Favorites" / Guide-1 hint |
| Color-button GREEN (Genres) | `#27ae60` (legacy `#55e952`) | Help "Play / Pause" / Guide-2 hint |
| Color-button YELLOW (Favorites) | `#f1c40f` (legacy `#f4ec2d`) | Help "Open Search" / Guide-4 hint |
| Color-button BLUE (Search) | `#3498db` (legacy `#2d41f4`) | Help "Change Country" / Guide-3 hint |
| Card surface | `#1f2024` (Tailwind `bg-[#1f2024]`) | Genre cards default |
| Sidebar focus tile bg | `rgba(255,65,153,0.30)` | Sidebar active tile fill |
| Sidebar focus tile border | `#ff4199` | Sidebar active tile border + glow |
| Body text primary | `#ffffff` | Headings, station names |
| Body text secondary | `rgba(255,255,255,0.7)` | Modal messages, station meta |
| Body text muted | `#9b9b9b` / `rgba(255,255,255,0.25..0.5)` | Splash subtitle, ambient meta |
| Generic backdrop | `rgba(0,0,0,0.80)` + `backdrop-blur(7px)` | Exit, network modals |
| Help backdrop | `rgba(0,0,0,0.75)` | Help modal only |
| GlobalPlayer bar bg | `rgba(0,0,0,0.61)` + `backdrop-blur(13px)` + `opacity:0.82` | Persistent bottom player |
| RadioPlaying bg gradient | `radial-gradient(181.15% 96.19% at 5.26% 9.31%, #0E0E0E 0%, #3F1660 29.6%, #0E0E0E 100%)` | Now-playing screen |

### 2.2 Typography

* **Family stack (verbatim):** `'Ubuntu', Helvetica` for almost every text node. (`font-['Ubuntu',Helvetica]` Tailwind arbitrary values.)
* **Weights used:**
  * 300 (`font-light`) — minor station-meta lines
  * 400 (`font-normal`) — body text on splash & modal messages
  * 500 (`font-medium`) — sidebar labels, splash device labels, station names in tiles, etc.
  * 700 (`font-bold`) — page titles ("Popular Genres", "Settings", "Search"), modal titles, retry button
* **Type scale (in pixels, verbatim from inline `text-[Npx]`):**
  | px | Where |
  |---|---|
  | 14 | Sidebar label (`text-[14px]`) |
  | 18 | Onboarding tile label, country list flag-row caption |
  | 20 | "Listen freely" splash subtitle, GlobalPlayer metadata |
  | 22 | Splash `megaradio.live` line, ambient now-playing line |
  | 24 | GlobalPlayer station name, modal message body, tooltip body, retry button |
  | 28 | Section headings inside Discover ("Popular Genres", "Popular Stations") |
  | 36 | Modal title text |
  | 53.108 | Splash logo wordmark |
  | 64 | Ambient clock |

### 2.3 Iconography

The app ships SVG icons under `tv-app/images/` and PNG bitmap fallbacks under `tv-app/assets/`. Native re-implementations should ship at minimum these vectors:

* `radio-icon.svg` — Discover sidebar
* `music-icon.svg` — Genres sidebar
* `search-icon.svg` — Search sidebar
* `heart-icon.svg` — Favorites sidebar
* `globe` (Lucide `Globe` 24px line icon) — Country sidebar (rendered by `lucide-react`)
* `settings` (Lucide `Settings` 24px) — Settings sidebar
* `path-8.svg` — brand "M" logo mark (used in splash + ambient + sidebar header)
* `waves.svg`, `ellipse2.svg`, `frame445.png` — splash decoration
* `monitor.svg`, `tablet.svg`, `phone.svg` — splash device row
* `arrow.svg` — onboarding pointer
* `discover-background.png` — onboarding background
* `path-8.svg` — used both as the brand "M" mark and as the small ambient logo

All icon glyph dimensions are 32 × 32 px in sidebar tiles (see `Sidebar.tsx`).
---

## A. Asset Manifest (Bundled in `assets/` folder)

> All visual assets used by the TV app are included in this package under the `assets/` directory. Native re-implementations should ship these exact files (or platform-equivalent vector replacements). File paths in this manifest are **relative to the package root**.

### A.1 Brand & Logos (`assets/logos/`)

| File | Format | Size | Used in | Description |
|---|---|---|---|---|
| `logos/path-8.svg` | SVG | 1.5 KB | **Splash** (≈48×48 in centered card), **Sidebar header** ("M" in top-left, 32×32), **Ambient mode** small mark (top-left, 32×32), **GlobalPlayer** brand mark | Pink "M" wordmark glyph (the Mega "M" letter). Single `<path>`, color hard-coded to `#FF4199`. ViewBox `0 0 113 109`. |
| `logos/logo.png` | PNG | 1 MB | App-launcher icon for Tizen / webOS | Full-color PNG of the Radio Mega round logo (1024×1024 source). |
| `logos/icon.png` | PNG | 4.8 KB | Browser favicon, Tizen `config.xml` icon reference | Compressed 117×117 launcher icon. |
| `logos/globe-icon.svg` | SVG | 1 KB | **Country selector** "Global" entry, **Sidebar** Country tile (current implementation uses Lucide `Globe` 24px instead — keep both available) | Outline globe glyph, 24×24 viewBox, `fill: white`. |
| `logos/globe-icon.png` | PNG | 28 KB | Fallback raster of the globe glyph | Used if SVG rendering is not available on a platform. |

### A.2 Sidebar Icons (`assets/icons/`)

All sidebar icons are 32×32 viewBox, single-color (`fill: white`), and are tinted by their parent. They live inside the `90×90 px` sidebar tile rendered with focus ring `ring-2 ring-[#ff4199]`.

| File | Format | Size | Used in | Description |
|---|---|---|---|---|
| `icons/radio-icon.svg` | SVG | 1.6 KB | **Sidebar item 1 — Discover** (route `/discover-no-user`) | Filled radio receiver with antenna and dial dots. |
| `icons/music-icon.svg` | SVG | 786 B | **Sidebar item 2 — Genres** (route `/genres`) | Solid music note (eighth note). |
| `icons/search-icon.svg` | SVG | 811 B | **Sidebar item 3 — Search** (route `/search`) | Filled magnifying glass. |
| `icons/heart-icon.svg` | SVG | 704 B | **Sidebar item 4 — Favorites** (route `/favorites`) | Solid heart. |
| `icons/settings-icon.svg` | SVG | 1 KB | **Sidebar item 6 — Settings** (route `/settings`) | Cog/gear with a center dot (12-tooth). |
| `icons/cast-icon.svg` | SVG | 290 B | **GlobalPlayer / RadioPlaying** Cast indicator (only when an active cast session exists) | Outlined cast TV glyph. |
| `icons/logout-icon.svg` | SVG | 786 B | **Settings → Account** "Logout" button | Door-with-arrow logout glyph. |
| `icons/arrow.svg` | SVG | 1.6 KB | **Onboarding Guides 1-4** pointer arrow (decorative, points from explanation card to color-button hint) | Two-tone arrow tail. |
| `icons/waves.svg` | SVG | 1.2 KB | **Splash** decorative wave at bottom (visual flourish) | Stylized sine-wave SVG path. |
| `icons/ellipse2.svg` | SVG | 725 B | **Splash** background blur ellipse | Soft pink ellipse (decorative). |
| `icons/monitor.svg` | SVG | 777 B | **Splash** "device row" — first device | Outlined desktop monitor. |
| `icons/tablet.svg` | SVG | 564 B | **Splash** "device row" — second device | Outlined tablet. |
| `icons/phone.svg` | SVG | 654 B | **Splash** "device row" — third device | Outlined phone. |
| `icons/fallback-favicon.svg` | SVG | 823 B | **All station tiles** when station favicon URL is empty / fails to load (fallback `<img>` source) | Generic radio glyph in a circle. |
| `icons/path8.svg` | symlink → `path-8.svg` | — | Compatibility alias for legacy import paths | — |

### A.3 Background Imagery (`assets/backgrounds/`)

| File | Format | Size | Used in | Description |
|---|---|---|---|---|
| `backgrounds/discover-background.png` | PNG | 749 KB | **Onboarding Guides 1-4** full-screen background. Set as `<img className="absolute inset-0 w-full h-full object-cover" />`. | 1920×1080 dimly-lit photograph (DJ booth / crowd). |
| `backgrounds/hand-crowd-disco-1.png` | PNG | 944 KB | **Login** page right-side art (decorative crowd image, ~620×880 placement) | Vivid hand-up-crowd-with-disco-light photo. |
| `backgrounds/frame445.png` | PNG | 33 KB | **Splash** lower decoration (stylized circle / brand frame) | Decorative pink circle stack. |

> **Note for native:** these PNGs are large source files. Production builds should ship platform-optimized formats (HEIC/AVIF/WebP) at 1× and 2× densities, but **must preserve the visible composition pixel-for-pixel** at 1920×1080 rendering.

### A.4 Other / Misc (`assets/images/`)

| File | Format | Size | Used in | Description |
|---|---|---|---|---|
| `images/fallback-station.png` | PNG | 1 MB | **Universal station-art fallback** when station has no favicon URL or favicon fails to load. Rendered inside RadioPlaying 280×280 art frame, GlobalPlayer 53×53 art, station-card thumbnail. | Default Radio Mega "M" art on dark gradient. |
| `images/fallback-favicon.svg` | SVG | 823 B | Same as above, lighter-weight vector fallback | Vector duplicate of station fallback. |
| `images/austria-1.png` | PNG | 75 B | Sample country flag (Austria) — present but not currently rendered (legacy asset) | 1×1 transparent placeholder pixel. |

### A.5 Asset Loading Convention (web reference)

In the web TV app, every asset is referenced by an `imgX` URL constant declared at the top of the file:

```ts
const img = "/images/path-8.svg";              // brand "M"
const img1 = "/images/radio-icon.svg";         // sidebar Discover
const img2 = "/images/music-icon.svg";         // sidebar Genres
const img3 = "/images/search-icon.svg";        // sidebar Search
const img4 = "/images/heart-icon.svg";         // sidebar Favorites
const img5 = "/images/settings-icon.svg";      // sidebar Settings
const imgGlobe = "/images/globe-icon.svg";     // sidebar Country (when not using Lucide)
const imgArrow = "/images/arrow.svg";          // onboarding pointer
const imgBg = "/images/discover-background.png"; // onboarding bg
const imgWaves = "/images/waves.svg";          // splash deco
const imgEllipse = "/images/ellipse2.svg";     // splash deco
const imgFrame = "/images/frame445.png";       // splash deco
const imgFallbackStation = "/images/fallback-station.png";
const imgCast = "/images/cast-icon.svg";
const imgLogout = "/images/logout-icon.svg";
const imgMonitor = "/images/monitor.svg";
const imgTablet = "/images/tablet.svg";
const imgPhone = "/images/phone.svg";
```

**Native equivalent:**
* iOS / macOS / tvOS: import as `Image("path-8")` from the Asset Catalog. Render SVG with the SF Symbols approach or `Image(systemName:)` only if exact glyph match is achieved; otherwise embed the SVG via `SVGKit` / `swift-svg`.
* Android: place in `res/drawable/`. Use `androidx.compose.ui.graphics.painter.Painter` with `painterResource()`. SVGs must be converted to vector drawables (Android Studio "Vector Asset" tool).
* Windows (WPF / WinUI3): place in a `Resources/` folder, render via `Image` control with `Source` bound to the asset path. SVGs require `SharpVectors` library or convert to XAML `Path`.

### A.6 Fonts

The app uses the **Ubuntu** font family. Native re-implementations have two options:

**Option A (recommended):** ship Ubuntu as a bundled font in the app:
* Download from <https://fonts.google.com/specimen/Ubuntu> (Apache License 2.0).
* Required weights: 300 Light, 400 Regular, 500 Medium, 700 Bold.
* Required style: Roman only (no italic in the UI).
* Native registration:
  * Apple: add `.ttf` files to bundle, list in `Info.plist` under `UIAppFonts`.
  * Android: place in `app/src/main/assets/fonts/` and load via `Typeface.createFromAsset` / Compose `FontFamily`.
  * Windows: include in installer, register via `Application.Current.Resources.Add("Ubuntu", new FontFamily("Ubuntu"))`.

**Option B:** fall back to platform default sans-serif. **Not recommended** — Ubuntu's distinctive glyph shapes (especially the `g` and `Q`) are part of the brand identity.

### A.7 Source Code Companion Files (also in this package)

| Path | Description |
|---|---|
| `source-extracts/index.css` | Full verbatim copy of `tv-app/src/index.css` (CSS variables, animations, focus styles). |
| `source-extracts/tailwind.config.cjs` | Verbatim Tailwind config. |
| `source-extracts/config.xml` | Tizen application manifest (privileges, app id, content path). |
| `source-extracts/megaRadioApi.ts` | Verbatim API client. |
| `source-extracts/keyCodes.ts` | Samsung + LG remote-control key code table. |
| `source-extracts/contexts/` | All React Context providers (verbatim TSX). |
| `source-extracts/pages/` | Selected page TSX (Splash, Login, Discover, RadioPlaying, Settings, Search). |

> **The native team should treat the bundled source as authoritative.** When in doubt about a behaviour, read the original TSX/CSS — do not infer from screenshots alone.
---

## 3. Design-System Layer (verbatim CSS)

### 3.1 Tailwind config (`tv-app/tailwind.config.cjs`)

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary:     { DEFAULT: "hsl(var(--primary))",     foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))",     foreground: "hsl(var(--popover-foreground))" },
        card:        { DEFAULT: "hsl(var(--card))",        foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["ui-sans-serif","system-ui","sans-serif",
               "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};
```

> Note for native re-implementations: the Tailwind utilities (`text-[24px]`, `bg-[#ff4199]`, `rounded-[10px]`, etc.) are arbitrary values — there is no design-token table to map. Re-implement each value literally as documented.

### 3.2 CSS root variables (`tv-app/src/index.css`)

The shadcn-style HSL-as-string variables are defined in `:root` and overridden in `.dark` and `.high-contrast`. Only the **values used at runtime** matter; the dark theme is the only theme actually applied to the TV app (`<html class="dark">`).

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --primary: 207 90% 54%;
    --primary-foreground: 211 100% 99%;
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --ring: 20 14.3% 4.1%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --primary: 207 90% 54%;
    --primary-foreground: 211 100% 99%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --ring: 240 4.9% 83.9%;
    --radius: 0.5rem;
  }
}
```

### 3.3 Accessibility CSS (high-contrast + large-text modes)

`AccessibilityContext` toggles two `<html>` classes — `.high-contrast` and `.large-text`. Implementations must mirror these effects.

```css
.high-contrast {
  --hc-text:    rgba(255,255,255,1) !important;
  --hc-subtext: rgba(255,255,255,0.95) !important;
}
/* Implementation note: high-contrast forces white text + 95% opacity for sub-text on
   every surface, removes translucent overlays. */

.large-text { font-size: 115%; }   /* 15% type-scale increase, applied to <html> root. */
```

`AccessibilityContext` exposes:
* `highContrast: boolean`
* `largeText: boolean`
* `toggleHighContrast()`, `toggleLargeText()`

LocalStorage keys: `highContrast`, `largeText`. Both are boolean strings.

### 3.4 All `@keyframes` animations (verbatim, in render order)

> Re-implement each animation with the **exact** duration, easing and infinite-cycle behaviour. On native platforms, animations run in the GPU compositor (CALayer/CoreAnimation, Compose `animateAsState`, or WPF storyboards) — keep them off the main thread.

```css
/* Generic spinner */
@keyframes spin { to { transform: rotate(1turn); } }
.animate-spin { animation: spin 1s linear infinite; }

/* Fade-in (cards, popovers) */
@keyframes fade-in {
  0%   { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 1s ease forwards; animation-delay: var(--animation-delay, 0s); }

/* Fade-up (modal entry, list reveal) */
@keyframes fade-up {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 1s ease forwards; animation-delay: var(--animation-delay, 0s); }

/* Marquee (long station-name horizontal scroll) */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--gap))); }
}
.animate-marquee { animation: marquee var(--duration) linear infinite; }

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--gap))); }
}
.animate-marquee-vertical { animation: marquee-vertical var(--duration) linear infinite; }

/* Shimmer (skeleton loaders) */
@keyframes shimmer {
  0%   { background-position: calc(-1 * var(--shimmer-width)) 0; }
  100% { background-position: calc(100% + var(--shimmer-width)) 0; }
}
.animate-shimmer { animation: shimmer 8s infinite; }

/* In-card 3-bar equalizer (small) — used in station tiles */
@keyframes equalizer-1 {
  0%, 100% { height: 4px; }
  50%      { height: 24px; }
}
.animate-equalizer-1 { animation: equalizer-1 0.8s ease-in-out infinite; }

@keyframes equalizer-2 {
  0%, 100% { height: 8px; }
  50%      { height: 28px; }
}
.animate-equalizer-2 { animation: equalizer-2 0.9s ease-in-out infinite; }

@keyframes equalizer-3 {
  0%, 100% { height: 6px; }
  50%      { height: 20px; }
}
.animate-equalizer-3 { animation: equalizer-3 0.7s ease-in-out infinite; }

/* GlobalPlayer 3-bar equalizer (height + top simultaneously to keep bars bottom-aligned) */
@keyframes equalizer-global-1 {
  0%, 100% { height: 8.882px;  top: 26.644px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-1 { animation: equalizer-global-1 0.8s ease-in-out infinite; }

@keyframes equalizer-global-2 {
  0%, 100% { height: 13.323px; top: 22.203px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-2 { animation: equalizer-global-2 0.9s ease-in-out infinite; }

@keyframes equalizer-global-3 {
  0%, 100% { height: 11.103px; top: 24.423px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-3 { animation: equalizer-global-3 0.7s ease-in-out infinite; }

/* Soft pulse for focus glow */
@keyframes pulse-soft {
  0%, 100% { transform: scale(1);    opacity: 0.85; }
  50%      { transform: scale(1.05); opacity: 1; }
}
.animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

/* Screensaver-test page bars */
@keyframes screensaver-equalizer-1 { 0%,100%{height:10px} 50%{height:60px} }
@keyframes screensaver-equalizer-2 { 0%,100%{height:15px} 50%{height:80px} }
@keyframes screensaver-equalizer-3 { 0%,100%{height:8px}  50%{height:50px} }
.animate-screensaver-equalizer-1 { animation: screensaver-equalizer-1 1.5s ease-in-out infinite; }
.animate-screensaver-equalizer-2 { animation: screensaver-equalizer-2 1.8s ease-in-out infinite; }
.animate-screensaver-equalizer-3 { animation: screensaver-equalizer-3 1.6s ease-in-out infinite; }

/* ============================================================
   Ambient Mode (RadioPlaying after 3 minutes idle)
   GPU-only animations: only transform + opacity.
   ============================================================ */

/* Drift orbs */
@keyframes amb-drift-1 {
  0%, 100% { transform: translate(0,0)         scale(1);    opacity: 0.7; }
  50%      { transform: translate(250px,120px) scale(1.15); opacity: 1.0; }
}
@keyframes amb-drift-2 {
  0%, 100% { transform: translate(0,0)           scale(1);    opacity: 0.6; }
  50%      { transform: translate(-200px,180px)  scale(1.10); opacity: 0.9; }
}
@keyframes amb-drift-3 {
  0%, 100% { transform: translate(-50%,-50%)             scale(1);    opacity: 0.65; }
  50%      { transform: translate(calc(-50% + 150px), calc(-50% - 100px)) scale(1.20); opacity: 0.95; }
}
@keyframes amb-drift-4 {
  0%, 100% { transform: translate(0,0)           scale(1);    opacity: 0.55; }
  50%      { transform: translate(-180px,220px)  scale(1.12); opacity: 0.85; }
}
.amb-drift-1 { animation: amb-drift-1 30s ease-in-out infinite; }
.amb-drift-2 { animation: amb-drift-2 38s ease-in-out infinite; }
.amb-drift-3 { animation: amb-drift-3 26s ease-in-out infinite; }
.amb-drift-4 { animation: amb-drift-4 44s ease-in-out infinite; }

/* Central glow breathe */
@keyframes amb-glow-breathe {
  0%, 100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.5; }
  50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.8; }
}
.amb-glow { animation: amb-glow-breathe 6s ease-in-out infinite; }

/* Concentric ring spins (forward and reverse) */
@keyframes amb-ring-spin       { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes amb-ring-spin-rev   { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(-360deg); } }
.amb-ring-1 { animation: amb-ring-spin     90s linear infinite; }
.amb-ring-2 { animation: amb-ring-spin-rev 70s linear infinite; }

/* Now-playing text gentle pulse */
@keyframes amb-text-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
.amb-text-pulse { animation: amb-text-pulse 4s ease-in-out infinite; }

/* Equalizer bars at 66% vertical center (8 bars) */
@keyframes amb-eq-bar { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
/* Each bar uses its own duration: 1.2 + i*0.15 s where i ∈ 0..7. */

/* Ambient overlay fade-in */
@keyframes amb-fadein { 0% { opacity: 0; } 100% { opacity: 1; } }
.amb-fadein { animation: amb-fadein 2s ease-out forwards; }
```

### 3.5 Focus glow (TV-spatial-navigation `.tv-focused`)

This class is the *legacy* TV focus indicator used by the spatial-navigation JS. The newer React focus path uses Tailwind `ring-2 ring-[#ff4199]` (see §5). Both must be supported on native because some elements still rely on `.tv-focused`.

```css
.tv-focused {
  box-shadow:
    inset 0 0 0 4px #ff4199,
    0 0 20px rgba(255, 65, 153, 0.6) !important;
  transition: box-shadow 0.2s ease !important;
  animation: pulse-glow 1.5s ease-in-out infinite !important;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow:
      inset 0 0 0 4px #ff4199,
      0 0 20px rgba(255, 65, 153, 0.6); }
  50%      { box-shadow:
      inset 0 0 0 4px #ff4199,
      0 0 35px rgba(255, 65, 153, 0.9); }
}
```

### 3.6 Search-input focus glow (cyan)

```css
#search-value:focus {
  border-color: #01d7fb;
  box-shadow: 0 6px 25px rgba(1,215,251,0.30);
  background: linear-gradient(180deg, rgba(1,215,251,0.05) 0%, rgba(1,215,251,0.02) 100%);
  outline: none;
}
#search-value { transition: all 0.3s ease; }
```

### 3.7 Scrollbars + cursor

```css
::-webkit-scrollbar       { width: 0; height: 0; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #f4f4f2; }
.has-vertical-scroll::-webkit-scrollbar { width: 10px; overflow-y: scroll; }

.samsung,  .lg            { cursor: none !important; }
.samsung *, .lg *         { cursor: none !important; }
```

Native equivalent: hide all platform cursors; do not render any scrollbar chrome unless explicitly opted-in (favorites grid scroll is invisible).
---

## 4. Application Shell, Provider Tree, Routing

### 4.1 Provider hierarchy (verbatim from `tv-app/src/App.tsx`)

The order matters — outer providers must initialize before inner providers can read their state. On native, replicate the dependency graph (you may collapse them into a single store, but be mindful of init order).

```tsx
function App() {
  return (
    <AccessibilityProvider>           {/* highContrast / largeText flags */}
      <HelpProvider>                  {/* helpOpen flag (global help modal) */}
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider>      {/* current language + t() */}
            <NetworkStatusProvider>   {/* online/offline + modal trigger */}
              <CountryProvider>       {/* selectedCountry / setCountry */}
                <AuthProvider>        {/* TV login (device-code flow) */}
                  <FavoritesProvider> {/* favorites list (server + local merge) */}
                    <NavigationProvider> {/* back-stack with focus snapshots */}
                      <GlobalPlayerProvider>  {/* central audio player */}
                        <CastProvider>        {/* cast polling (3s) */}
                          <SleepTimerProvider>{/* 15/30/60/120 min */}
                            <AppLifecycleProvider> {/* Tizen app suspend/resume */}
                              <FocusRouterProvider> {/* per-route key handlers */}
                                <TooltipProvider>
                                  <Toaster />
                                  <Router />
                                </TooltipProvider>
                              </FocusRouterProvider>
                            </AppLifecycleProvider>
                          </SleepTimerProvider>
                        </CastProvider>
                      </GlobalPlayerProvider>
                    </NavigationProvider>
                  </FavoritesProvider>
                </AuthProvider>
              </CountryProvider>
            </NetworkStatusProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </HelpProvider>
    </AccessibilityProvider>
  );
}
```

### 4.2 Routing table

The web app uses **hash-based** routing (`#/path`) for compatibility with file:// loading on Tizen. On native, treat each route as a navigation destination identifier.

| Route | Component | Notes |
|---|---|---|
| `/` | `Splash` | Shown for 1500ms then redirects (`/guide-1` first run, `/discover-no-user` thereafter) |
| `/login` | `Login` | Netflix-style 6-digit pairing |
| `/guide-1` | `Guide1` | Onboarding step 1 (RED button → Discover) |
| `/guide-2` | `Guide2` | Onboarding step 2 (GREEN → Genres) |
| `/guide-3` | `Guide3` | Onboarding step 3 (BLUE → Search) |
| `/guide-4` | `Guide4` | Onboarding step 4 (YELLOW → Favorites) |
| `/discover-no-user` | `DiscoverNoUser` | Home (the canonical home in the shipped app) |
| `/radio-playing` | `RadioPlaying` | Full-screen playback + ambient mode |
| `/genres` | `Genres` | Popular Genres + All Genres grid |
| `/genre-list/:genre?` | `GenreList` | Stations in a genre |
| `/search` | `Search` | Virtual keyboard + results |
| `/favorites` | `Favorites` | Favorite stations grid |
| `/settings` | `Settings` | 7-category settings surface |
| `/country-select` | `CountrySelectPage` | Country picker (page mode, sidebar visible) |
| `/screensaver-test` | `ScreensaverTest` | QA-only (do not include in shipping native builds) |
| (fallback) | `NotFound` | 404 page |

### 4.3 First-run logic (Splash redirect)

```ts
useEffect(() => {
  if (!isReady) return;
  try {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      setLocation('/discover-no-user');
      return;
    }
  } catch (_) {}
  const timer = setTimeout(() => setLocation('/guide-1'), 1500);
  return () => clearTimeout(timer);
}, [isReady, setLocation]);
```

**LocalStorage key:** `onboardingCompleted` (string `"true"` after Guide-4 is dismissed).

### 4.4 Page root container convention

Every page mounts as:
```html
<div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden bg-[#0e0e0e]" data-testid="page-...">
```
i.e. a fixed 1920 × 1080 canvas anchored to the viewport top-left, with `overflow: hidden`. Native equivalent: a single root container of those exact dimensions (use `absolute` / `fixed` positioning of children; do NOT use auto-layout / Stack for the page root).

### 4.5 Hash router → spatial focus dispatcher

The hash route is read by `FocusRouterContext.dispatch` to route a remote-control key event to the correct page handler. Implementations on native should expose an equivalent `RegisterPageKeyHandler(route, handler)` API.

```ts
// FocusRouterContext.tsx (verbatim)
const dispatch = (e: KeyboardEvent) => {
  const hash = window.location.hash;
  let currentRoute = hash.replace('#', '') || '/';
  if (currentRoute === '/' || currentRoute === '/index.html' || currentRoute === '') {
    currentRoute = '/guide-1';
  }
  const routeWithoutQuery = currentRoute.split('?')[0];
  let handler = handlersRef.current.get(routeWithoutQuery);
  if (!handler) {
    // Fallback: walk up the path segments to find a registered base path
    const pathParts = routeWithoutQuery.split('/').filter(p => p);
    for (let i = pathParts.length; i > 0; i--) {
      const basePath = '/' + pathParts.slice(0, i).join('/');
      if (handlersRef.current.has(basePath)) {
        handler = handlersRef.current.get(basePath);
        break;
      }
    }
  }
  if (handler) handler(e);
};
```
---

## 5. Remote-Control Key Map & Focus System

### 5.1 Samsung Tizen + LG webOS key codes (verbatim from `keyCodes.ts` + scattered usages)

> Source code: `source-extracts/keyCodes.ts` if present, else inline in components. Key codes are received via the standard browser `keydown` event's `keyCode` (numeric) property. Native re-implementations should map these to platform-equivalent gamepad / remote events.

| Logical key | Samsung `keyCode` | LG `keyCode` | Apple TV (Siri Remote) | Android TV | Windows/macOS keyboard |
|---|---|---|---|---|---|
| ArrowLeft / ArrowRight / ArrowUp / ArrowDown | 37 / 39 / 38 / 40 | 37 / 39 / 38 / 40 | Pad / Touch swipe | DPad | ← → ↑ ↓ |
| OK / Enter | 13 | 13 | Select (Touch click) | DPad center | Enter |
| Back / RETURN | **10009** | **461** | Menu / `<` | Back | Esc / Backspace |
| Exit | **10182** | (use `webOS.platformBack()`) | (long-press Menu) | Home (intercepted) | — |
| Play | 415 | 415 | Play/Pause | Play | Space |
| Pause | 19 | 19 | Play/Pause | Pause | Space |
| Stop | 413 | 413 | — | Stop | — |
| Play/Pause toggle | 10252 | 10252 | Play/Pause | DPad center on player | Space |
| **RED color button** | **403** | **403** | (n/a — bind to long-press R) | Color buttons (gaming controller) | F1 |
| **GREEN color button** | **404** | **404** | (n/a) | Green | F2 |
| **YELLOW color button** | **405** | **405** | (n/a) | Yellow | F3 |
| **BLUE color button** | **406** | **406** | (n/a) | Blue | F4 |
| Channel Up | 427 | 33 | Swipe up (long) | Channel + | PageUp |
| Channel Down | 428 | 34 | Swipe down (long) | Channel - | PageDown |
| Number 0-9 | 48..57 | 48..57 | (n/a) | 0-9 | 0-9 |
| Volume Up / Down / Mute | 447 / 448 / 449 | (system) | (system) | (system) | — |

### 5.2 Color-button → Page mapping (global shortcut, available on every page)

| Color | Action | Notes |
|---|---|---|
| **RED** | Navigate to `Discover` (`/discover-no-user`) | Skipped while on Splash, Login, Guides, RadioPlaying ambient |
| **GREEN** | Navigate to `Genres` (`/genres`) | Same exclusions |
| **BLUE** | Navigate to `Search` (`/search`) | Search page focus jumps to keyboard |
| **YELLOW** | Navigate to `Favorites` (`/favorites`) | Same exclusions |
| **PAGE_UP / CH_UP** | Jump focus to GlobalPlayer **and** play action; if RadioPlaying open, jump to player tab | |
| **PAGE_DOWN / CH_DOWN** | Same as PAGE_UP (alias) | |
| **PLAY/PAUSE (415/19/10252)** | Toggle current global player | If no station, no-op |
| **RETURN (10009/461)** | Page-specific back action; on `/discover-no-user`, opens **Exit Modal** | Two-step exit: first RETURN → modal; second RETURN cancels modal |
| **EXIT (10182)** | Force-quit Tizen app via `tizen.application.getCurrentApplication().exit()` | On non-Tizen, treat as a "go to home" no-op |

**Verbatim color-button dispatcher (from `App.tsx`):**

```ts
useEffect(() => {
  const onColor = (e: KeyboardEvent) => {
    // Skip on splash, guides, login, ambient
    const path = window.location.hash.replace('#','') || '/';
    if (['/', '/login', '/guide-1','/guide-2','/guide-3','/guide-4'].includes(path)) return;
    switch (e.keyCode) {
      case 403: setLocation('/discover-no-user'); break;  // RED
      case 404: setLocation('/genres');           break;  // GREEN
      case 405: setLocation('/favorites');        break;  // YELLOW
      case 406: setLocation('/search');           break;  // BLUE
      case 427: case 33:  case 428: case 34:
        // Jump to GlobalPlayer focus; if no station, no-op
        document.getElementById('global-player-play')?.focus();
        break;
    }
  };
  window.addEventListener('keydown', onColor);
  return () => window.removeEventListener('keydown', onColor);
}, []);
```

### 5.3 Focus system: `useFocusManager` + `getFocusClasses`

The focus system is **CSS-driven**: a single `tabIndex` is set per focus target, an `:focus` ring is rendered via Tailwind utilities, and the page's key handler explicitly moves the DOM focus on remote-arrow events. There is **no automatic spatial navigation library** — every page implements its own focus arithmetic.

#### 5.3.1 `getFocusClasses(focused: boolean)` helper (verbatim)

```ts
export function getFocusClasses(focused: boolean) {
  return focused
    ? 'ring-2 ring-[#ff4199] ring-offset-2 ring-offset-[#0e0e0e] scale-[1.05] z-10'
    : '';
}
```

> **Visual contract (native equivalents):**
> * **Focus border:** 2px solid `#ff4199`
> * **Border offset:** 2px gap, transparent over the page background `#0e0e0e`
> * **Scale:** transform `scale(1.05)` (5%)
> * **Z-order:** raised to `z-10` so focus ring is not clipped by neighbours
> * **Transition:** Tailwind default `transition-all` (~150ms ease) is added by callers

**Native re-implementation hints:**
* iOS / tvOS: use `.focusable(true)` + `.scaleEffect(focused ? 1.05 : 1.0)` + `.overlay(RoundedRectangle(cornerRadius: r).stroke(Color(hex: 0xff4199), lineWidth: 2))` with a 2pt outer padding for the offset.
* Android Compose: `Modifier.focusable().scale(if (isFocused) 1.05f else 1f).border(2.dp, Color(0xFFFF4199), RoundedCornerShape(r))`.
* Windows WinUI 3: `<Grid>` with `RenderTransform="ScaleTransform"` animated to 1.05; `BorderBrush` toggled on `GotFocus`.

#### 5.3.2 `useFocusManager` (simplified verbatim)

```ts
export function useFocusManager(
  totalItems: number,
  initialIndex: number = 0,
  onActivate?: (index: number) => void,
) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const move = useCallback((delta: number) => {
    setFocusedIndex(i => Math.max(0, Math.min(totalItems - 1, i + delta)));
  }, [totalItems]);

  const handleKey = useCallback((e: KeyboardEvent, dirMap: Record<string, number>) => {
    const delta = dirMap[e.key];
    if (delta !== undefined) { e.preventDefault(); move(delta); }
    if (e.key === 'Enter' && onActivate) { e.preventDefault(); onActivate(focusedIndex); }
  }, [focusedIndex, move, onActivate]);

  return { focusedIndex, setFocusedIndex, move, handleKey };
}
```

#### 5.3.3 `usePageKeyHandler(route, handler)` (simplified verbatim)

```ts
export function usePageKeyHandler(route: string, handler: (e: KeyboardEvent) => void) {
  const { register, unregister } = useFocusRouter();
  useEffect(() => {
    register(route, handler);
    return () => unregister(route);
  }, [route, handler, register, unregister]);
}
```

Each page registers its handler under its hash route. The global `keydown` listener in `FocusRouterContext` dispatches the event to whichever handler matches the current route.

### 5.4 Global key dispatcher (verbatim)

```tsx
// FocusRouterContext.tsx
useEffect(() => {
  const onKey = (e: KeyboardEvent) => dispatch(e);
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);
```

### 5.5 Spatial navigation rules per page (summary)

These are the per-page focus arithmetics. Detailed rules live in each page's section, but here is a quick lookup table.

| Page | Layout | LEFT/RIGHT | UP/DOWN | Notes |
|---|---|---|---|---|
| Sidebar (everywhere) | 7 vertical tiles | exit sidebar to right | move ±1 tile | RIGHT moves into page content |
| Discover — Recently Played | 1×6 horizontal | move ±1 (clamp) | UP exits to sidebar / DOWN moves to "For You" | |
| Discover — For You | 1×N horizontal | ±1 (clamp) | UP → Recently Played; DOWN → Popular Genres | |
| Discover — Popular Genres | 1×N horizontal | ±1 | UP → For You; DOWN → Popular Stations | |
| Discover — Popular Stations | grid (4 cols, station cards) | ±1 column | ±4 (one row) | DOWN at last row → "More from country" |
| Discover — More from country | 1×N horizontal | ±1 | UP → Popular Stations | |
| Genres — Popular Genres | 4-col grid | ±1 column | ±4 (one row) | clamp at edges |
| Genres — All Genres | 4-col grid | ±1 column | ±4 (one row) | infinite scroll |
| GenreList | 7-col grid (28/page) | ±1 column | ±7 (one row) | incomplete-row clamp |
| Search results | 1×7 grid + keyboard | within keyboard zone: 10/11 col | UP/DOWN within keyboard or jump to language dropdown | LEFT exits keyboard to results |
| CountrySelect | 1×N list + keyboard | LEFT/RIGHT inside keyboard or jump between list ↔ keyboard | UP/DOWN move list ±1 row | |
| Favorites | 4-col grid | ±1 | ±4 | |
| Settings | 7 categories left + content right | LEFT/RIGHT to swap zones | UP/DOWN ±1 in active zone | |
| RadioPlaying | controls row + similar carousels | depends on row | jump between control row and carousels | |
| GlobalPlayer | 4 controls + station-info button | ±1 | UP exits to page | |

### 5.6 Two-step return (Exit Modal contract)

```ts
// Triggered when RETURN is pressed on / /discover-no-user
const onReturn = (e: KeyboardEvent) => {
  if (e.keyCode === 10009 || e.keyCode === 461) {
    if (path === '/discover-no-user') openExitModal();
    else if (path === '/radio-playing') setLocation('/discover-no-user');
    else history.back();
  }
};
```

Exit modal:
* First RETURN → opens "Çıkmak istiyor musunuz?" modal with [Evet/Yes] [Hayır/No].
* Default focus: **No** (left button).
* RETURN inside modal → close modal (cancel).
* OK on Yes → `tizen.application.getCurrentApplication().exit()` on Tizen, `window.close()` otherwise.

(Modal layout in §15.3.)
---

## 6. Sidebar (Persistent Left Navigation)

### 6.1 Visual specification

* **Width:** 108 px (the left edge of every page reserves this column)
* **Height:** 1080 px (full screen)
* **Background:** transparent on top of page background `#0e0e0e` (no fill)
* **Position:** `absolute; left: 0; top: 0`
* **Z-order:** `z-40` (always above page content, below modals)

### 6.2 Sidebar header (brand "M")

* **Position:** `top: 36 px; left: 36 px`
* **Size:** 32 × 32 px container; SVG fits at 32 × 32 (with 0 padding)
* **Asset:** `assets/logos/path-8.svg` (pink #FF4199)
* **Animation:** none

### 6.3 Sidebar item tile

* **Tile size:** 90 × 90 px
* **Tile pitch (vertical step):** 108 px (so tiles sit at top values 156, 264, 372, 480, 588, 696, 804)
* **Tile horizontal position:** `left: 9 px` (so the tile is centered in the 108-px-wide sidebar with 9px each side)
* **Border radius:** `rounded-[10px]`
* **Default appearance:** transparent background, no border
* **Focused appearance:**
  * Background: `rgba(255, 65, 153, 0.30)` (30% pink fill)
  * Border: `2px solid #ff4199`
  * Glow: `box-shadow: 0 0 20px rgba(255,65,153,0.6)`
  * Scale: `1.05`
  * Pulse: continuous `pulse-glow` 1.5s infinite (defined in §3.5)
* **Active (current-page) appearance** (even when not focused):
  * Background: `rgba(255, 65, 153, 0.12)` (12% pink fill)
  * No border / no glow

### 6.4 Sidebar item icon

* **Icon size:** 32 × 32 px (centered in the 90×90 tile, so icon top = tile top + 29, icon left = tile left + 29)
* **Icon fill:** `#ffffff` (white) when not focused/active; pink `#ff4199` when active *or* focused

### 6.5 Sidebar item label

* **Position:** below the icon, **inside** the tile (vertical center of icon at tile-center -8, label at tile-center +18). Specifically: `top: tile_top + 60 px`
* **Font:** Ubuntu Medium (500), `text-[14px]`, `leading-[normal]`
* **Color:** `#ffffff` when not focused; `#ff4199` when active or focused
* **Alignment:** centered horizontally within the tile

### 6.6 Sidebar items (in order)

| Index | Icon asset | Label key (i18n) | Default English | Route |
|---|---|---|---|---|
| 0 | `radio-icon.svg` | `sidebar.discover` | "Discover" | `/discover-no-user` |
| 1 | `music-icon.svg` | `sidebar.genres` | "Genres" | `/genres` |
| 2 | `search-icon.svg` | `sidebar.search` | "Search" | `/search` |
| 3 | `heart-icon.svg` | `sidebar.favorites` | "Favorites" | `/favorites` |
| 4 | (Lucide `Globe` 24px) or `globe-icon.svg` | `sidebar.country` | "Country" | `/country-select` |
| 5 | `settings-icon.svg` | `sidebar.settings` | "Settings" | `/settings` |

> **Note:** there are **6** sidebar items. The historical "Login" tile was removed; login is now reachable from Settings → Account.

### 6.7 Tile vertical layout (top values)

| Index | Tile `top` (px) |
|---|---|
| 0 — Discover | 156 |
| 1 — Genres | 264 |
| 2 — Search | 372 |
| 3 — Favorites | 480 |
| 4 — Country | 588 |
| 5 — Settings | 696 |

Total icon column height: `156 + 6 × 108 = 804 px`. Bottom padding to player bar: 276 px.

### 6.8 Focus / activation behaviour

* Sidebar focus is owned by the page-level `useFocusManager`. Pressing **RIGHT** at any sidebar tile transfers focus to the page content. Pressing **UP/DOWN** on the sidebar moves between tiles (clamped at 0..5).
* Pressing **OK** (Enter / 13) on a tile navigates to its route via `setLocation(route)`.
* The currently active route is highlighted with the "Active" appearance (12% pink) regardless of focus.

### 6.9 Verbatim TSX (`tv-app/src/components/Sidebar.tsx`)

```tsx
import { useLocation } from 'wouter';
import { Globe, Settings as SettingsIcon } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

const ICONS = {
  discover:  '/images/radio-icon.svg',
  genres:    '/images/music-icon.svg',
  search:    '/images/search-icon.svg',
  favorites: '/images/heart-icon.svg',
};

interface SidebarProps {
  focusedIndex: number | null;          // null => focus is in page content
  setFocusedIndex: (i: number) => void;
}

export default function Sidebar({ focusedIndex, setFocusedIndex }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { t } = useLocalization();

  const items = [
    { route: '/discover-no-user', label: t('sidebar.discover'),  icon: ICONS.discover },
    { route: '/genres',           label: t('sidebar.genres'),    icon: ICONS.genres },
    { route: '/search',           label: t('sidebar.search'),    icon: ICONS.search },
    { route: '/favorites',        label: t('sidebar.favorites'), icon: ICONS.favorites },
    { route: '/country-select',   label: t('sidebar.country'),   lucide: Globe },
    { route: '/settings',         label: t('sidebar.settings'),  lucide: SettingsIcon },
  ];

  return (
    <aside
      className="absolute left-0 top-0 w-[108px] h-[1080px] z-40"
      data-testid="sidebar"
    >
      {/* Brand "M" mark */}
      <img
        src="/images/path-8.svg"
        alt="Radio Mega"
        className="absolute left-[36px] top-[36px] w-[32px] h-[32px]"
      />

      {items.map((item, i) => {
        const focused = focusedIndex === i;
        const active  = location.startsWith(item.route);
        const top = 156 + i * 108;
        const Icon = item.lucide;
        return (
          <button
            key={item.route}
            tabIndex={0}
            onFocus={() => setFocusedIndex(i)}
            onClick={() => setLocation(item.route)}
            data-testid={`sidebar-${item.route.replace(/\W+/g,'')}`}
            className={`
              absolute left-[9px] w-[90px] h-[90px] rounded-[10px]
              flex flex-col items-center justify-center
              transition-all duration-150 outline-none
              ${focused
                ? 'bg-[rgba(255,65,153,0.30)] border-2 border-[#ff4199] scale-105 z-10 shadow-[0_0_20px_rgba(255,65,153,0.6)]'
                : active
                  ? 'bg-[rgba(255,65,153,0.12)]'
                  : 'bg-transparent'}
            `}
            style={{ top: `${top}px` }}
          >
            {Icon
              ? <Icon size={24} color={focused || active ? '#ff4199' : '#ffffff'} />
              : <img src={item.icon} alt="" className="w-[32px] h-[32px]" />}
            <span
              className={`
                font-['Ubuntu',Helvetica] font-medium text-[14px] leading-[normal] mt-1
                ${focused || active ? 'text-[#ff4199]' : 'text-white'}
              `}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
```

### 6.10 Native equivalents (suggested)

* **Apple TV (SwiftUI):** Use a `VStack` with fixed-frame items inside a `ZStack` that overlays the page. Use `.focusable()` and bind the focus ring style via `.focused($field, equals:)`. Manage cross-component focus with `@FocusState`.
* **Android TV Compose:** A `Column` of `Box` components with `Modifier.focusRequester().focusable()`. Use `LocalFocusManager` to move focus from sidebar to page on RIGHT press.
* **Windows WinUI 3:** A `Grid` with `RowDefinitions` of fixed 108-pt height. Each item is a `Button` with custom `Style` defining the focus visuals.
---

## 7. Splash Screen

**Route:** `/`  •  **Screenshot:** `screenshots/v2/01-splash.jpg`  •  **Source:** `source-extracts/pages/Splash.tsx`

### 7.1 Layout (1920 × 1080)

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | absolute 0,0 | 1920 × 1080 | `bg-[#0e0e0e]` |
| Background ellipse | center | 1024 × 1024 (blurred) | `assets/icons/ellipse2.svg`, opacity ~0.3, blur 80 px |
| Frame445 deco | bottom-center | 720 × 720 | `assets/backgrounds/frame445.png`, opacity 0.6 |
| Brand "M" mark | center-x, top: 320 | 113 × 109 | `assets/logos/path-8.svg`, **no animation** (static) |
| Wordmark "megaradio.live" | center-x, top: 470 | auto × 64 | Ubuntu **Bold 53.108 px**, color `#ffffff`. Letter-spacing 0. |
| Subtitle "Listen freely" | center-x, top: 540 | auto × 24 | Ubuntu Light **300**, **20 px**, color `rgba(255,255,255,0.55)` |
| Device row (monitor + tablet + phone) | center-x, top: 620 | 480 × 96 | gap 60 px between icons; each icon 96 × 96 px; opacity 0.55 |
| Device labels ("TV — Tablet — Mobile") | below icons, top: 736 | auto × 18 | Ubuntu Medium 500, 18 px, color `rgba(255,255,255,0.55)` |
| Waves | bottom: 0 | 1920 × 138 | `assets/icons/waves.svg`, full width, opacity 0.7 |

### 7.2 Behaviour

```ts
useEffect(() => {
  if (!isReady) return;
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  if (onboardingCompleted) {
    setLocation('/discover-no-user');
    return;
  }
  const timer = setTimeout(() => setLocation('/guide-1'), 1500);
  return () => clearTimeout(timer);
}, [isReady, setLocation]);
```

* **Total visible time on first run:** 1500 ms.
* **Total visible time on subsequent runs:** as fast as `isReady` resolves (typically <200 ms).
* **Animations:** none — purely static composition.

### 7.3 Native notes

* The "device row" graphic (TV / Tablet / Mobile) is a **brand cue** and should be kept verbatim. On platforms where the splash screen is hard-coded by the OS (Apple TV launch image), implement the splash as the *first* in-app view and let the OS launch image show the bare brand "M" only.
* No focus ring is shown anywhere on the splash; the page is non-interactive.

---

## 8. Onboarding Guides 1-4

**Routes:** `/guide-1`, `/guide-2`, `/guide-3`, `/guide-4`
**Screenshots:** `screenshots/v2/02-guide-1.jpg` … `05-guide-4.jpg`
**Source:** `source-extracts/pages/Guide1.tsx` … `Guide4.tsx`

### 8.1 Shared layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | `overflow:hidden` |
| Background image | inset-0 | 1920 × 1080 | `assets/backgrounds/discover-background.png`, `object-cover`, plus `::after` overlay `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)` |
| Sidebar (mocked) | 0,0 | 108 × 1080 | Renders the **real** Sidebar component with the **target** tile pre-focused (e.g. on `/guide-1`, the "Discover" tile is shown with focus visuals to teach the user where they will land) |
| Color-button hint | sidebar tile RIGHT | aligns with target tile's vertical center | Pill 200 × 56 px with rounded-full, background = current color (RED #e74c3c, GREEN #27ae60, BLUE #3498db, YELLOW #f1c40f), Ubuntu Bold 22 px white text reading the color name in current language |
| Pointer arrow | between hint pill and target tile | 40 × 96 | `assets/icons/arrow.svg`, animated with `pulse-soft` 2s infinite |
| Title (top of explanation card) | left: 540, top: 380 | auto × 56 | Ubuntu Bold **44 px**, color `#ffffff` |
| Body text | left: 540, top: 460 | 800 × auto (max 4 lines) | Ubuntu Regular **24 px**, color `rgba(255,255,255,0.75)`, line-height 1.5 |
| "Next" hint (bottom-center) | center-x, bottom: 80 | auto × 32 | Ubuntu Medium 18 px, `rgba(255,255,255,0.55)` text "OK ▶ Next" |
| "Skip" hint | bottom-right, right: 60, bottom: 80 | auto × 32 | Ubuntu Medium 18 px, `rgba(255,255,255,0.55)` "RETURN ▶ Skip onboarding" |

### 8.2 Per-guide content

| Guide | Color | Color hex | Hint pill text | Title | Body |
|---|---|---|---|---|---|
| /guide-1 | RED | `#e74c3c` | "RED" | "Discover Radios" | "Press the **RED** button on your remote to open the Discover page and browse popular stations from around the world." |
| /guide-2 | GREEN | `#27ae60` | "GREEN" | "Browse Genres" | "Press the **GREEN** button to see all music genres and pick what you feel like listening to." |
| /guide-3 | BLUE | `#3498db` | "BLUE" | "Search Stations" | "Press the **BLUE** button to open the on-screen keyboard and search for any station by name." |
| /guide-4 | YELLOW | `#f1c40f` | "YELLOW" | "Your Favorites" | "Press the **YELLOW** button to view all stations you have marked as favorites. Press OK on a station to play." |

### 8.3 Behaviour

```ts
// Each guide registers a key handler
usePageKeyHandler(`/guide-${n}`, (e) => {
  if (e.keyCode === 13) {                       // OK → next guide / finish
    if (n < 4) setLocation(`/guide-${n+1}`);
    else { localStorage.setItem('onboardingCompleted', 'true'); setLocation('/discover-no-user'); }
  }
  if (e.keyCode === 10009 || e.keyCode === 461) { // RETURN → skip onboarding
    localStorage.setItem('onboardingCompleted', 'true');
    setLocation('/discover-no-user');
  }
  if (e.keyCode === 403 + (n-1)) {              // Color button matching this guide → advance
    if (n < 4) setLocation(`/guide-${n+1}`);
    else { localStorage.setItem('onboardingCompleted', 'true'); setLocation('/discover-no-user'); }
  }
});
```

> The exact key code per guide is RED=403 (guide-1), GREEN=404 (guide-2), BLUE=406 (guide-3), YELLOW=405 (guide-4). Note: BLUE is 406 (not 405) — guide-3's body / pill must use `#3498db`.

### 8.4 Verbatim TSX (Guide1 example)

```tsx
export default function Guide1() {
  const { t } = useLocalization();
  const [, setLocation] = useLocation();

  usePageKeyHandler('/guide-1', (e) => {
    if (e.keyCode === 13 || e.keyCode === 403) setLocation('/guide-2');
    if (e.keyCode === 10009 || e.keyCode === 461) {
      localStorage.setItem('onboardingCompleted', 'true');
      setLocation('/discover-no-user');
    }
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden bg-[#0e0e0e]">
      <img src="/images/discover-background.png"
           className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0
                      bg-gradient-to-b from-[rgba(0,0,0,0.55)] to-[rgba(0,0,0,0.85)]" />

      <Sidebar focusedIndex={0} setFocusedIndex={() => {}} />

      {/* Hint pill */}
      <div className="absolute left-[136px] top-[170px]
                      bg-[#e74c3c] rounded-full
                      px-6 py-2 text-white font-['Ubuntu',Helvetica] font-bold text-[22px]">
        {t('color.red')}
      </div>
      <img src="/images/arrow.svg"
           className="absolute left-[110px] top-[176px] w-[40px] h-[40px] animate-pulse-soft" />

      {/* Explanation card */}
      <h1 className="absolute left-[540px] top-[380px]
                     font-['Ubuntu',Helvetica] font-bold text-[44px] text-white">
        {t('guide1.title')}
      </h1>
      <p className="absolute left-[540px] top-[460px] w-[800px]
                    font-['Ubuntu',Helvetica] font-normal text-[24px]
                    text-[rgba(255,255,255,0.75)] leading-relaxed">
        {t('guide1.body')}
      </p>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[80px]
                      font-['Ubuntu',Helvetica] font-medium text-[18px]
                      text-[rgba(255,255,255,0.55)]">
        OK ▶ {t('common.next')}
      </div>
      <div className="absolute right-[60px] bottom-[80px]
                      font-['Ubuntu',Helvetica] font-medium text-[18px]
                      text-[rgba(255,255,255,0.55)]">
        RETURN ▶ {t('common.skip')}
      </div>
    </div>
  );
}
```

(Guide2/Guide3/Guide4 are identical structurally with different texts, colors and pill positions corresponding to sidebar tile indexes 1, 2, 3 respectively.)
---

## 9. Login Page (TV Device-Code Pairing)

**Route:** `/login`  •  **Screenshot:** `screenshots/v2/06-login.jpg`  •  **Source:** `source-extracts/pages/Login.tsx`

### 9.1 Layout (1920 × 1080)

The page is a Netflix-style 2-column composition.

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | `bg-[#0e0e0e]`; sidebar **hidden** |
| **Left column** (instructions) | left: 120, top: 80 | 800 × 920 | flex-col layout |
| Brand "M" mark | left: 120, top: 80 | 64 × 64 | `assets/logos/path-8.svg` |
| Title "Sign in to your TV" | left: 120, top: 200 | auto × 64 | Ubuntu Bold 48 px, `#ffffff` |
| Step 1 caption | left: 120, top: 320 | auto × 32 | Ubuntu Medium 24 px, `rgba(255,255,255,0.55)` reading "1. Visit on your phone or computer:" |
| URL pill `themegaradio.com/tv` | left: 120, top: 372 | auto × 64 | Ubuntu Bold 36 px, `#ff4199` (pink), no underline |
| Step 2 caption | left: 120, top: 480 | auto × 32 | Ubuntu Medium 24 px, `rgba(255,255,255,0.55)` reading "2. Enter the code below:" |
| **6-digit code display** | left: 120, top: 540 | 720 × 160 | 6 cells, each cell 96 × 160 px, gap 24 px |
| Each code cell | — | 96 × 160 | `bg: rgba(255,255,255,0.05)`, `border: 2px solid rgba(255,255,255,0.10)`, `rounded-[16px]`, Ubuntu Bold **96 px** centered, color `#ffffff`. Letter-spacing 0. |
| Countdown text "Expires in MM:SS" | left: 120, top: 740 | auto × 32 | Ubuntu Medium 22 px, `rgba(255,255,255,0.55)` |
| Status text (live region) | left: 120, top: 800 | auto × 28 | Ubuntu Regular 20 px, `rgba(255,255,255,0.65)` — "Waiting for you to sign in…" |
| **Right column** (decorative art) | right: 0, top: 0 | 720 × 1080 | full-bleed |
| Crowd image | right: 0, top: 0 | 720 × 1080 | `assets/backgrounds/hand-crowd-disco-1.png`, `object-cover` |
| Image overlay | right: 0, top: 0 | 720 × 1080 | `linear-gradient(270deg, rgba(14,14,14,0) 0%, rgba(14,14,14,1) 100%)` (fade-out toward left) |
| **Footer hint** | center-x, bottom: 60 | auto × 32 | Ubuntu Medium 18 px, `rgba(255,255,255,0.55)` reading "RETURN ▶ Cancel" |

### 9.2 Behaviour (Device-Code Flow)

#### 9.2.1 On mount

```ts
useEffect(() => {
  // 1. Generate device id (cached in localStorage as 'tv_device_id')
  let deviceId = localStorage.getItem('tv_device_id');
  if (!deviceId) {
    deviceId = `tv-${crypto.randomUUID()}`;
    localStorage.setItem('tv_device_id', deviceId);
  }
  // 2. Request a new pairing code
  fetchCode(deviceId);
}, []);
```

#### 9.2.2 Request code (POST `https://api.themegaradio.com/api/auth/tv/code`)

* **Method:** POST
* **Headers:** `Content-Type: application/json`, `X-Device-Id: <deviceId>`
* **Body:** `{ deviceId }`
* **Response (200):** `{ "code": "ABC123", "expiresInSec": 600 }`

The response is split into 6 visible characters (uppercased). Each character renders into one cell.

#### 9.2.3 Polling (every 3000 ms)

```ts
useEffect(() => {
  const tick = () => {
    fetch('https://api.themegaradio.com/api/auth/tv/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, code }),
    }).then(r => r.json()).then(data => {
      if (data.activated) {
        localStorage.setItem('tv_auth_token', data.token);     // Bearer JWT
        localStorage.setItem('tv_auth_user', JSON.stringify(data.user));
        clearInterval(pollHandle);
        setLocation('/discover-no-user');
      }
    });
  };
  const pollHandle = setInterval(tick, 3000);
  return () => clearInterval(pollHandle);
}, [code]);
```

#### 9.2.4 Countdown

* Initial value: 600 sec (10 min) from server `expiresInSec`.
* Updates every 1000 ms; format `MM:SS`.
* On reach 0: re-request a new code automatically.

### 9.3 Focus

There is **no focusable target** on the Login page. The user only has to read the code and act on their phone. RETURN cancels and routes to the previous page (or `/discover-no-user` if no history).

### 9.4 Logout (called from Settings → Account)

```ts
function logout() {
  localStorage.removeItem('tv_auth_token');
  localStorage.removeItem('tv_auth_user');
  setUser(null);
  // Cast polling will auto-stop on next tick because token is required
}
```

---

## 10. Discover Page

**Route:** `/discover-no-user`  •  **Screenshot:** `screenshots/v2/07-discover.jpg`  •  **Source:** `source-extracts/pages/DiscoverNoUser.tsx`

> The "no-user" suffix in the route is historical; the page renders identically whether or not a user is logged in.

### 10.1 Page composition (top → bottom)

```
[Sidebar 108×1080]   [Page content 1812×1080]
                     ┌────────────────────────────────────────────────┐
                     │ Header bar (auto-hide)                          │
                     │ Recently Played (only if data)                  │
                     │ For You (only if 3+ plays in history)           │
                     │ Popular Genres (always)                         │
                     │ Popular Stations (always, infinite scroll)      │
                     │ More from <selectedCountry> (if country chosen) │
                     └────────────────────────────────────────────────┘
                                    [GlobalPlayer 1812×88]
```

### 10.2 Header bar

* **Position:** `left: 108, top: 0`
* **Size:** `1812 × 80`
* **Background:** transparent → fades to `rgba(14,14,14,0.85)` after 3 s of inactivity (auto-hide)
* **Content (left→right):**
  * "Discover" title — Ubuntu Bold 36 px white at `left: 156, top: 24` (so 48 px from sidebar edge, 24 from top)
  * Right side: live clock `HH:MM` Ubuntu Medium 24 px white at `right: 60, top: 28` (only on TV builds)

### 10.3 Recently Played (conditional)

* **Source:** `recentlyPlayedService.getAll()` — localStorage key `recentlyPlayed`, capped at **6** stations.
* **Visibility:** hidden when array is empty.
* **Position:** `left: 156, top: 100`
* **Title:** "Recently Played" — Ubuntu Bold 28 px white at `left: 156, top: 100`
* **Card row:** horizontal flex, gap 24 px, starting at `top: 152`
* **Card size:** **180 × 180** (cover art + title beneath, see §10.7)
* **Item count:** up to 6, single row, no horizontal scroll bar.
* **Empty placeholder:** none — section just hides.

### 10.4 For You (conditional)

* **Source:** `recommendationService.getRecommendedStations()` — uses `listeningHistory` localStorage key.
* **Activation rule:** requires **at least 3** entries in listening history, otherwise hidden.
* **Position:** below Recently Played (or at top if RP hidden) — vertical offset = previous_section_bottom + 32 px.
* **Title:** "For You" — Ubuntu Bold 28 px.
* **Layout:** identical to Recently Played (1 row, 180×180 cards).

### 10.5 Popular Genres (always visible)

* **Source:** `megaRadioApi.getGenres({ limit: 8 })`.
* **Position offset:** previous_section_bottom + 32 px.
* **Title:** "Popular Genres" — Ubuntu Bold 28 px.
* **Layout:** 1 horizontal row of **8** genre cards, each card **220 × 139**, gap 24 px.
* **Genre card style:** `bg: #1f2024`, `rounded-[14px]`, padding 20px, two rows of text:
  * Genre name (Ubuntu Medium 22 px white, ellipsis-clipped to 1 line)
  * "<n> stations" (Ubuntu Light 16 px `rgba(255,255,255,0.55)`)
* **Click:** navigates to `/genre-list/<slug>`.

### 10.6 Popular Stations (always visible, infinite scroll)

* **Source:** `megaRadioApi.getPopularStations({ offset, limit: 100 })`.
* **Position offset:** previous_section_bottom + 32 px.
* **Title:** "Popular Stations" — Ubuntu Bold 28 px.
* **Layout:** **4-column grid**, station cards.
* **Card size:** **200 × 264** (artwork 200×200 + 4 px gap + 60 px metadata strip).
* **Card pitch:** 230 px horizontal, 294 px vertical (so 30 px gap between cards).
* **First card position:** `left: 236, top: 316`. Subsequent: `left = 236 + col*230, top = 316 + row*294`.
* **Pagination:** loads 100 at a time. Triggers next batch when scrolled within **600 px** of bottom.
* **Prefetch:** when a page loads, the next page is `queryClient.prefetchQuery()` started in background.

### 10.7 Station card anatomy (used everywhere)

| Element | Position relative to card | Size | Notes |
|---|---|---|---|
| Artwork wrapper | top: 0, left: 0 | 200 × 200 | `rounded-[14px]` overflow-hidden, bg `#1f2024` |
| Artwork `<img>` | inset-0 | 200 × 200 | `object-cover`, fallback to `assets/images/fallback-station.png` on error |
| Mini equalizer (only when this station is currently playing) | bottom: 8, right: 8 | 32 × 32 | 3 bars `equalizer-1/2/3` |
| Station name | top: 212, left: 0 | 200 × 28 | Ubuntu Medium 18 px white, `truncate` (1-line ellipsis) |
| Station meta line | top: 240, left: 0 | 200 × 20 | Ubuntu Light 14 px `rgba(255,255,255,0.55)`, e.g. "Pop · TR" |

When focused: outer card gets `getFocusClasses(true)` → 2px pink ring + 2px offset + scale 1.05 + z-10.

### 10.8 More from <country> (conditional)

* **Visibility:** only when `selectedCountry !== 'Global'` (CountryContext).
* **Source:** `megaRadioApi.getStationsByCountry({ country, limit: 20 })`.
* **Layout:** 1 row, 200×264 cards, horizontal scroll on focus move.
* **Position offset:** previous_section_bottom + 32 px.
* **Title:** "More from <countryName>" (e.g. "More from Turkey").

### 10.9 Spatial navigation (per §5.5)

```ts
usePageKeyHandler('/discover-no-user', (e) => {
  const grid = pageGrid; // describes current row + col + section
  switch (e.key) {
    case 'ArrowLeft':  if (grid.col > 0) grid.col--; else focusSidebar(); break;
    case 'ArrowRight': if (grid.col < grid.maxCol) grid.col++; break;
    case 'ArrowUp':    if (grid.row > 0) grid.row--; else jumpPrevSection(); break;
    case 'ArrowDown':  if (grid.row < grid.maxRow) grid.row++; else jumpNextSection(); break;
    case 'Enter':      activate(grid.currentItem); break;
  }
});
```

When activating a station card:
1. `navigationContext.saveSnapshot('/discover-no-user', { section, row, col })`.
2. `globalPlayer.play(station)`.
3. `setLocation('/radio-playing')`.

When returning (RETURN from RadioPlaying), the snapshot is restored: same section/row/col gets focus.
---

## 11. Genres Page

**Route:** `/genres`  •  **Screenshot:** `screenshots/v2/08-genres.jpg`  •  **Source:** `source-extracts/pages/Genres.tsx`

### 11.1 Layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | `bg-[#0e0e0e]` |
| Sidebar | 0,0 | 108 × 1080 | active item = "Genres" |
| Title "Popular Genres" | left: 156, top: 56 | auto × 36 | Ubuntu Bold 28 px white |
| Popular Genres grid | left: 156, top: 116 | 1716 × 286 | **4-col grid**, 2 rows, 8 cards |
| Genre card | — | **402 × 139** | gap 36 px H, 36 px V; bg `#1f2024`, rounded 14 px |
| Title "All Genres" | left: 156, top: 442 | auto × 36 | Ubuntu Bold 28 px white |
| All Genres grid | left: 156, top: 502 | 1716 × auto | **4-col grid**, infinite rows, scrollable |
| Genre card (All) | — | **402 × 139** | identical to Popular |

### 11.2 Genre card content

```
+------------------------------------+
|                                    |
|  Pop                               |  ← Ubuntu Medium 24 px white
|  124 stations                      |  ← Ubuntu Light 16 px rgba(255,255,255,0.55)
|                                    |
+------------------------------------+
```

**Padding:** 24 px left, 28 px top. Text left-aligned. No icon.

### 11.3 Spatial navigation (custom 4-col arithmetic)

```ts
usePageKeyHandler('/genres', (e) => {
  const cols = 4;
  switch (e.key) {
    case 'ArrowLeft':
      if (col > 0) col--; else focusSidebar();
      break;
    case 'ArrowRight':
      if (col < cols - 1 && (idx + 1) < items.length) col++;
      break;
    case 'ArrowUp':
      // Move ONE ROW up (= -4 items). If at top of "All Genres", jump to last row of "Popular".
      idx = Math.max(0, idx - cols);
      break;
    case 'ArrowDown':
      // Move ONE ROW down (= +4 items). Clamp to last item.
      idx = Math.min(items.length - 1, idx + cols);
      break;
    case 'Enter':
      setLocation(`/genre-list/${slug(items[idx].name)}`);
      break;
  }
});
```

**Critical native rule:** UP/DOWN must move **exactly one row** (4 items), not 1 item. LEFT/RIGHT must move **exactly one item**, not switch rows. Do not use a generic 2D spatial navigator that "snaps to nearest neighbour".

### 11.4 All Genres scroll

Auto-scroll the page content area when the focused card moves below the viewport. The scroll target is `cardTop - 100 px` so there's always 100 px of breathing room above the focused item.

---

## 12. GenreList Page (single genre's stations)

**Route:** `/genre-list/:genre?`  •  **Screenshots:** `09-genre-list-pop.jpg`, `10-genre-list-rock.jpg`  •  **Source:** `source-extracts/pages/GenreList.tsx`

### 12.1 Layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Genres" |
| Page title (genre name) | left: 156, top: 56 | auto × 36 | Ubuntu Bold 36 px white. Capitalized. e.g. "Pop", "Rock" |
| Subtitle "<n> stations" | left: 156, top: 104 | auto × 24 | Ubuntu Light 18 px `rgba(255,255,255,0.55)` |
| Station grid | left: 156, top: 156 | 1716 × auto | **7-col grid**, infinite rows |
| Station card (in grid) | — | **228 × 240** | 200×200 art, 4 px gap, 36 px metadata strip; gap 12 px between cards |

### 12.2 Pagination

* **Batch size:** **28 stations** = 4 rows × 7 columns
* **Trigger:** load next batch when scroll position is within **600 px** of bottom
* **Cache:** each (offset) page is its own TanStack Query cache key so revisits are instant

### 12.3 Spatial navigation (custom 7-col arithmetic, with **incomplete-row clamp**)

```ts
usePageKeyHandler('/genre-list', (e) => {
  const cols = 7;
  const total = stations.length;
  const lastRowStart = Math.floor((total - 1) / cols) * cols;
  const lastRowSize  = total - lastRowStart;     // 1..7

  switch (e.key) {
    case 'ArrowLeft':
      if (idx % cols > 0) idx--; else focusSidebar();
      break;
    case 'ArrowRight':
      if (idx % cols < cols - 1 && idx + 1 < total) idx++;
      break;
    case 'ArrowUp':
      if (idx >= cols) idx -= cols;
      break;
    case 'ArrowDown': {
      const targetIdx = idx + cols;
      if (targetIdx < total) {
        idx = targetIdx;
      } else {
        // Last row may have fewer than 7 items; clamp to last available item in that column,
        // OR jump to last item if current column is past last row's filled cells.
        const targetCol = idx % cols;
        const candidate = lastRowStart + targetCol;
        idx = candidate < total ? candidate : total - 1;
      }
      break;
    }
    case 'Enter':
      navigationContext.saveSnapshot('/genre-list', { idx });
      globalPlayer.play(stations[idx]);
      setLocation('/radio-playing');
      break;
  }
});
```

> **The clamp rule** prevents the user from getting "stuck" or having focus disappear when DOWN is pressed on a row whose target column is missing in the next row.

### 12.4 Empty state

* **Trigger:** API returns 0 stations for the genre.
* **Layout:** centered text "No stations available" Ubuntu Medium 24 px `rgba(255,255,255,0.55)` at center of content area.

---

## 13. Search Page

**Route:** `/search`  •  **Screenshot:** `screenshots/v2/11-search-empty.jpg`  •  **Source:** `source-extracts/pages/Search.tsx`

### 13.1 Layout (1920 × 1080)

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Search" |
| Title "Search" | left: 156, top: 56 | auto × 48 | Ubuntu Bold 36 px white |
| **Search input** | left: 156, top: 116 | **800 × 88** | `id="search-value"`, see §13.2 |
| Search results grid | left: 156, top: 240 | 800 × auto | 1-col list of station-list rows (700 × 96 each), gap 12 px |
| **Recent searches** (when query empty) | left: 156, top: 240 | 800 × auto | List of last 10 queries |
| **Virtual keyboard** | right: 60, top: 116 | 1000 × 480 | see §14 |
| Language dropdown | right: 60, top: 620 | 1000 × 80 | see §13.3 |
| Footer hint bar | bottom: 24 | full width | RED back / GREEN OK / BLUE clear hints |

### 13.2 Search input

* **Size:** 800 × 88 (height includes 24 px vertical padding)
* **Background:** `rgba(255,255,255,0.05)`
* **Border:** `2px solid rgba(255,255,255,0.10)` default, `2px solid #01d7fb` when focused
* **Border radius:** `rounded-[16px]`
* **Padding:** `padding: 0 28px`
* **Font:** Ubuntu Regular 32 px white; placeholder `rgba(255,255,255,0.40)`
* **Focused glow:** `box-shadow: 0 6px 25px rgba(1,215,251,0.30)` + gradient bg overlay (see §3.6)
* **Caret:** hidden (`caret-color: transparent`); a custom blinking pink underscore character is appended to the visible text instead
* **Behaviour:** purely controlled — keyboard taps append/remove characters; the user never types directly into the input

### 13.3 Language dropdown

* **Size:** 1000 × 80
* **Default appearance:** transparent bg, `2px solid rgba(255,255,255,0.10)`, `rounded-[14px]`
* **Focused appearance:** `bg-[rgba(255,65,153,0.10)]`, `border-[#ff4199]`, `box-shadow: 0 0 20px rgba(255,65,153,0.5)`
* **Content:** flag emoji (left) + language name (Ubuntu Medium 22 px) + Lucide `ChevronDown` icon (right)
* **Open state:** drops down a 1000 × 480 list of 13 languages (en, tr, ar, ru, de, fr, es, ja, zh, ko, el, hi, th); each row 60 px tall
* **Selected language** has pink left bar `4 × 60 #ff4199` and pink text

### 13.4 Spatial navigation (focus zones)

```
zones = ['list', 'keyboard', 'langDropdown']
```

* **`list`:** the search results / recent searches column (left).
* **`keyboard`:** the on-screen keyboard cells.
* **`langDropdown`:** the language switcher.

Movement rules:
* From `list`, RIGHT → `keyboard` (focus first key, top-left).
* From `keyboard` left-edge column, LEFT → `list` (focus first result row).
* From `keyboard` bottom row, DOWN → `langDropdown`.
* From `langDropdown`, UP → `keyboard` bottom row.
* From `list` left-edge, LEFT → sidebar.

### 13.5 Search submission

* On every keystroke, debounce 300 ms then call `megaRadioApi.searchStations({ q, limit: 30 })`.
* Cache key: `['/api/search', q]`, stale-time **24 h** (see §22 Caching).
* Empty `q` shows "Recent searches" list from `localStorage['recentSearches']` (max 10 items, FIFO).

### 13.6 Recent searches list row

* **Size:** 800 × 64
* **Bg:** transparent → `rgba(255,255,255,0.04)` on focus → pink ring on focus
* **Content:** Lucide `Clock` 20 px `rgba(255,255,255,0.40)` + query text Ubuntu Medium 22 px white
* **OK** → loads search query
* **Long-press OK** (or YELLOW) → removes from recent searches

---

## 14. Virtual Keyboard

**Used in:** Search page, CountrySelect page  •  **Languages:** 13

### 14.1 Layout (within parent page)

* **Container size:** 1000 × 480
* **Cell size:** **88 × 88**
* **Grid:** depending on language, 10 or 11 columns × 4-5 rows, gap **12 px**
* **Cell radius:** `rounded-[12px]`
* **Cell default bg:** `rgba(255,255,255,0.05)`
* **Cell default border:** `1px solid rgba(255,255,255,0.10)`
* **Cell focused:** `bg-[rgba(255,65,153,0.20)]`, `border-2 border-[#ff4199]`, scale 1.08, glow `0 0 20px rgba(255,65,153,0.6)`
* **Cell text:** Ubuntu Medium **32 px** white, centered
* **Special cells (Backspace, Space, Shift, Enter, Clear, ABC/123 toggle):** wider than 88 px (Space = 88 × 4 + 12 × 3 = 388 px; Backspace = 184 px = 2 cells; Shift = 184 px; Enter = 184 px), labeled with Lucide icons (Delete, ArrowUp, CornerDownLeft) or text "Space" / "Clear"

### 14.2 Layouts (verbatim character map per language)

> Source: `tv-app/src/components/VirtualKeyboard.tsx` (or its inline equivalent in pages). Each layout is an array of rows; each row is an array of cell labels. A label of `null` is a gap.

```ts
const LAYOUTS = {
  en: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  tr: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','ı','o','p','ğ','ü'],
    ['a','s','d','f','g','h','j','k','l','ş','i'],
    ['z','x','c','v','b','n','m','ö','ç','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ar: [
    ['١','٢','٣','٤','٥','٦','٧','٨','٩','٠'],
    ['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج'],
    ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
    ['ئ','ء','ؤ','ر','ﻻ','ى','ة','و','ز','ظ'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ru: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
    ['ф','ы','в','а','п','р','о','л','д','ж','э'],
    ['я','ч','с','м','и','т','ь','б','ю','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  de: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','z','u','i','o','p','ü'],
    ['a','s','d','f','g','h','j','k','l','ö','ä'],
    ['y','x','c','v','b','n','m','ß','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  fr: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['a','z','e','r','t','y','u','i','o','p'],
    ['q','s','d','f','g','h','j','k','l','m'],
    ['w','x','c','v','b','n','é','è','ç','à'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  es: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l','ñ'],
    ['z','x','c','v','b','n','m','¿','¡','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ja: [
    ['あ','い','う','え','お','か','き','く','け','こ'],
    ['さ','し','す','せ','そ','た','ち','つ','て','と'],
    ['な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'],
    ['ま','み','む','め','も','や','ゆ','よ','わ','ん'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  zh: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],  // Pinyin input — IME composition handled by typing buffer
  ko: [
    ['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],
    ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ',';'],
    ['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  el: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['ς','ε','ρ','τ','υ','θ','ι','ο','π','{'],
    ['α','σ','δ','φ','γ','η','ξ','κ','λ','¨'],
    ['ζ','χ','ψ','ω','β','ν','μ',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  hi: [
    ['१','२','३','४','५','६','७','८','९','०'],
    ['क','ख','ग','घ','च','छ','ज','झ','ट','ठ'],
    ['ड','ढ','त','थ','द','ध','न','प','फ','ब'],
    ['भ','म','य','र','ल','व','श','स','ह','ं'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  th: [
    ['๑','๒','๓','๔','๕','๖','๗','๘','๙','๐'],
    ['ๅ','/','-','ภ','ถ','ุ','ึ','ค','ต','จ','ข','ช'],
    ['ๆ','ไ','ำ','พ','ะ','ั','ี','ร','น','ย','บ','ล'],
    ['ฟ','ห','ก','ด','เ','้','่','า','ส','ว','ง'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
};
```

> **Implementation note:** when SHIFT is engaged, English layout swaps numbers row to symbols (`!@#$%^&*()`) and letters become uppercase. Other layouts: SHIFT toggles to a punctuation set; ABC toggles to a symbols layer.

### 14.3 Cell key codes (focus-arithmetic only)

Cell index = `row * cols + col`. Movement:
* LEFT: `col--` (clamp 0)
* RIGHT: `col++` (clamp `cols-1`)
* UP: `row--` (clamp 0)
* DOWN: `row++` (clamp `rows-1`)
* Special cells span multiple columns — treat as a single focusable item; LEFT from a wide cell jumps to the previous narrow cell.

### 14.4 OK on a special cell

* **SHIFT:** toggles `isShifted` state, re-renders cell labels.
* **ABC / 123:** toggles `layerIndex` between letter-layer and symbol-layer.
* **SPACE:** appends ` ` to query.
* **BACKSPACE:** removes last character.
* **ENTER:** triggers `onSubmit(query)` (kept for future, currently no-op since search runs on every keystroke).

### 14.5 Verbatim TSX (key cell render — abbreviated)

```tsx
function KeyCell({ label, focused, onPress, wideUnits = 1 }: KeyCellProps) {
  const w = 88 * wideUnits + 12 * (wideUnits - 1);
  return (
    <button
      tabIndex={0}
      onClick={onPress}
      style={{ width: w, height: 88 }}
      className={`
        rounded-[12px] flex items-center justify-center
        font-['Ubuntu',Helvetica] font-medium text-[32px] text-white
        transition-all duration-150 outline-none
        ${focused
          ? 'bg-[rgba(255,65,153,0.20)] border-2 border-[#ff4199] scale-[1.08] z-10 shadow-[0_0_20px_rgba(255,65,153,0.6)]'
          : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)]'}
      `}
    >
      {label}
    </button>
  );
}
```
---

## 15. Country Select Page

**Route:** `/country-select`  •  **Screenshot:** `screenshots/v2/14-country-select.jpg`  •  **Source:** `source-extracts/components/CountrySelector.tsx` (rendered with `mode='page'`)

### 15.1 Layout

The CountrySelector component supports two render modes — `modal` (full-screen overlay z-50, used when triggered inline from a page) and `page` (no overlay, sidebar visible, z-30, used at `/country-select`).

In **page mode** (the canonical /country-select):

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Country" |
| Title | left: 156, top: 56 | auto × 48 | Ubuntu Bold 36 px white "Select Country" |
| Subtitle "<n> countries" | left: 156, top: 110 | auto × 24 | Ubuntu Light 18 px `rgba(255,255,255,0.55)` |
| **Country list** (left) | left: 156, top: 168 | 800 × 868 | scrollable, 1 column, 64 px row height, 8 px gap |
| **Virtual keyboard** (right) | right: 60, top: 168 | 1000 × 480 | identical to §14 |
| **Language dropdown** | right: 60, top: 668 | 1000 × 80 | identical to §13.3 |
| Footer hint | bottom: 24 | full | "RED ▶ Back  •  GREEN ▶ Select  •  YELLOW ▶ Global" |

### 15.2 Country row

Each country row is **800 × 64** with 8 px gap between rows.

| Element | Position relative to row | Size | Notes |
|---|---|---|---|
| Flag | left: 16, vertical-center | 48 × 36 (3:2 ratio) | `<img>` from `https://flagcdn.com/w160/<iso2>.png`, fallback emoji if 404 |
| Country name | left: 80, vertical-center | auto × 28 | Ubuntu Medium 22 px white |
| Stations count | right: 16, vertical-center | auto × 24 | Ubuntu Light 16 px `rgba(255,255,255,0.55)`, e.g. "324 stations" |
| Selected indicator | right: 100, vertical-center | 24 × 24 | Lucide `Check` 24px `#ff4199` if this row is the currently selected country |

**Default style:** transparent, `2px solid transparent`, rounded `12px`.
**Focused style:** `bg-[rgba(255,65,153,0.10)]`, `border-2 border-[#ff4199]`, `scale-[1.02]`, glow `0 0 16px rgba(255,65,153,0.5)`.
**Currently-selected (non-focused) style:** `bg-[rgba(255,65,153,0.05)]`, no border.

### 15.3 "Global" entry

* Always rendered at the **top** of the list (before alphabetical entries).
* Flag slot replaced with the **Lucide `Globe` icon** 36×36 (white) — *or* `assets/logos/globe-icon.svg` if you prefer the bundled vector.
* Name: "Global" (or localized via `country.global`).
* Selecting it sets `selectedCountry = 'Global'` and persists to `localStorage['selectedCountry'] = 'Global'`.

### 15.4 Country data source

* List of 219 countries hard-coded in `tv-app/src/data/countries.ts`. Each entry: `{ iso2, name, nativeName, stationsCount }`.
* On selection, fires `CountryContext.setCountry(iso2)`, which writes localStorage and triggers re-fetch of station lists across the app.

### 15.5 Filtering by typed query

* The keyboard taps update a `query` string.
* List is filtered by `country.name.toLowerCase().includes(query.toLowerCase()) || country.iso2.toLowerCase().startsWith(query.toLowerCase())`.
* When `query === ''`, full alphabetical list is shown.

### 15.6 Spatial navigation (zones)

```
zones = ['list', 'keyboard', 'langDropdown']
```

Same as Search page (§13.4).

### 15.7 Modal mode (`mode='modal'`) overrides

When opened from another page (e.g. tapping the country chip in Discover header), the same component renders with:
* z-index `z-50` instead of `z-30`
* Full-screen black overlay `rgba(0,0,0,0.85)` behind the content
* Sidebar **hidden**
* RETURN closes the modal instead of returning to history

---

## 16. Favorites Page

**Route:** `/favorites`  •  **Screenshot:** `screenshots/v2/12-favorites-empty.jpg`  •  **Source:** `source-extracts/pages/Favorites.tsx`

### 16.1 Layout (with stations)

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Favorites" |
| Title "Favorites" | left: 156, top: 56 | auto × 48 | Ubuntu Bold 36 px white |
| Subtitle "<n> stations" | left: 156, top: 110 | auto × 24 | Ubuntu Light 18 px `rgba(255,255,255,0.55)` |
| Station grid | left: 156, top: 168 | 1716 × 868 | **4-col grid** of 200×264 cards, gap 30 px H / 30 px V |

### 16.2 Empty state

* **Trigger:** `favorites.length === 0`
* Centered Lucide `HeartOff` icon 96 × 96 `rgba(255,255,255,0.20)` at top: 380
* Title "No favorites yet" Ubuntu Bold 32 px white at top: 504
* Body "Press OK on the heart icon while playing a station to add it here." Ubuntu Regular 22 px `rgba(255,255,255,0.55)` at top: 552, max-width 600 px, centered
* "Browse Discover" button — pink fill `#ff4199`, 240 × 64, Ubuntu Bold 22 px, centered at top: 660

### 16.3 Behaviour

* Source: `FavoritesContext.favorites` — loaded from `localStorage['mega_radio_favorites']` on init, then merged with server favorites (when logged in).
* Adding/removing happens from RadioPlaying page (§17.5) or via a long-press OK on a station card.

### 16.4 Spatial navigation

Same arithmetic as Genres "All Genres" 4-col grid (§11.3) but with station cards.

---

## 17. Settings Page

**Route:** `/settings`  •  **Screenshot:** `screenshots/v2/13-settings.jpg`  •  **Source:** `source-extracts/pages/Settings.tsx`

### 17.1 Layout

Two-column layout: categories left, content right.

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Settings" |
| Title "Settings" | left: 156, top: 56 | auto × 48 | Ubuntu Bold 36 px white |
| **Categories column** (left) | left: 156, top: 140 | 360 × 800 | 7 categories, vertical |
| Category row | — | **360 × 96** | gap 12 px |
| **Content panel** (right) | left: 556, top: 140 | 1300 × 868 | scrollable |

### 17.2 The 7 categories

| # | Key | Label key | Icon (Lucide) |
|---|---|---|---|
| 0 | language | `settings.language` | `Languages` 28 px |
| 1 | keyboard | `settings.keyboard` | `Keyboard` 28 px |
| 2 | playback | `settings.playback` | `Play` 28 px |
| 3 | timer | `settings.sleepTimer` | `Moon` 28 px |
| 4 | accessibility | `settings.accessibility` | `Eye` 28 px |
| 5 | account | `settings.account` | `User` 28 px |
| 6 | cast | `settings.cast` | (cast-icon.svg) 28 px |

### 17.3 Category row visuals

* **Default:** transparent bg, `2px solid transparent`, `rounded-[14px]`
* **Hovered/focused:** `bg-[rgba(255,65,153,0.10)]`, `border-[#ff4199]`, glow `0 0 16px rgba(255,65,153,0.4)`
* **Active (currently displayed in right panel):** `bg-[rgba(255,65,153,0.20)]`, `border-[#ff4199]`, no glow
* **Content:** icon (left, 28×28) + label (Ubuntu Medium 22 px white) — vertically centered, padding 24 px left

### 17.4 Content panels

#### 17.4.1 Language

* Title: "Language" — Ubuntu Bold 32 px white
* Subtitle: "Select interface language." — Ubuntu Light 20 px `rgba(255,255,255,0.55)`
* List of 48 languages, each row 1200 × 64, alphabetically by native name. Format: `"<flag emoji>  <Native name>  <— English name>"`.
* Pink left bar 4×60 on selected row + pink text.

#### 17.4.2 Keyboard

* Title: "Keyboard"
* Subtitle: "Select keyboard layout for typing." — same style.
* List of **13** keyboard languages (en, tr, ar, ru, de, fr, es, ja, zh, ko, el, hi, th).
* Tap → updates `localStorage['keyboardLanguage']` and refreshes Search/CountrySelect keyboards.

#### 17.4.3 Play at Start (Auto-Play)

* Title: "Play at Start"
* Subtitle: "Choose what plays when you open the app."
* Radio group of 4 options (each row 1200 × 80):
  | Value | Label | Behaviour on app launch |
  |---|---|---|
  | `none` *(default)* | "Don't play anything" | No auto-play |
  | `last` | "Resume last played" | Plays `localStorage['lastPlayedStation']` |
  | `random` | "Play a random popular station" | Picks from top 100 popular |
  | `favorite` | "Play a favorite" | Picks first item from favorites |
* Persisted to `localStorage['playAtStart']`.

#### 17.4.4 Sleep Timer

* Title: "Sleep Timer"
* Subtitle: "Stop playback after a certain time."
* List of 5 options:
  | Value (min) | Label |
  |---|---|
  | null | "Off" |
  | 15 | "15 minutes" |
  | 30 | "30 minutes" |
  | 60 | "1 hour" |
  | 120 | "2 hours" |
* Selecting starts `SleepTimerContext.start(minutes)` immediately.

#### 17.4.5 Accessibility

Two toggle rows (1200 × 80 each):
* "High Contrast" — Switch component (custom). When ON, adds `.high-contrast` class to `<html>`.
* "Large Text" — Switch component. When ON, adds `.large-text` class (15% font-size boost).

**Switch visual:**
* Track: 64 × 36, rounded full
* OFF: bg `rgba(255,255,255,0.15)`, knob white at left
* ON: bg `#ff4199`, knob white at right
* Animation: 200 ms ease for knob slide

#### 17.4.6 Account

When **NOT logged in:**
* Title: "Account"
* Subtitle: "Sign in to sync favorites and recently played across devices."
* "Sign In" button (pink fill `#ff4199`, 240 × 64, Ubuntu Bold 22 px) → routes to `/login`.

When **logged in:**
* Avatar circle 96 × 96 (top-left of panel, with `borderRadius: 50%`). Image from `user.avatarUrl`, fallback initials.
* Display name — Ubuntu Bold 28 px white
* Email — Ubuntu Light 20 px `rgba(255,255,255,0.55)`
* "Logout" button — RED fill `#e74c3c`, 240 × 64, Ubuntu Bold 22 px white → calls `logout()` (§9.4) and refreshes panel.

#### 17.4.7 Cast

* Title: "Cast"
* Subtitle: "Send a station from your phone to your TV."
* Status row showing `isPolling` indicator (green dot if active, gray if not).
* Help text: "Open themegaradio.com on your phone, sign in with the same account, and tap the Cast button to send a station here."

### 17.5 Spatial navigation

* LEFT/RIGHT toggle the focus zone between `categories` and `content`.
* UP/DOWN moves within the active zone.
* OK on a category row activates that category (focus stays in categories column).
* OK in content panel activates the focused option.
---

## 18. Radio Playing Page (Full-Screen Now Playing)

**Route:** `/radio-playing`  •  **Screenshot:** `screenshots/v2/17-radio-playing-empty.jpg`  •  **Source:** `source-extracts/pages/RadioPlaying.tsx`

### 18.1 Background

```css
background: radial-gradient(181.15% 96.19% at 5.26% 9.31%,
  #0E0E0E 0%,
  #3F1660 29.6%,
  #0E0E0E 100%);
```

A purple → black radial gradient anchored at the top-left. Native equivalent: a radial gradient layer of those exact stops.

### 18.2 Layout (with active station)

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | gradient bg above |
| Sidebar | 0,0 | 108 × 1080 | NOT visible on this page (sidebar hides on /radio-playing) |
| **Artwork frame** (left/center) | left: 156, top: 156 | 480 × 480 | rounded-[24px], shadow `0 30px 80px rgba(0,0,0,0.55)` |
| Artwork `<img>` | inset-0 | 480 × 480 | object-cover, fallback `assets/images/fallback-station.png` |
| Mini equalizer (3 bars) | bottom-right of art | 56 × 56 | absolute right:16, bottom:16; `equalizer-1/2/3` |
| **Right info column** | left: 700, top: 220 | 1080 × 480 | flex-col |
| "NOW PLAYING" pre-title | left: 700, top: 220 | auto × 24 | Ubuntu Medium 18 px, letter-spacing 4px, color `rgba(255,255,255,0.55)` |
| Station name | left: 700, top: 256 | 1080 × 60 | Ubuntu Bold **48 px** white, max 1 line, ellipsis |
| Genre · Country meta | left: 700, top: 332 | 1080 × 28 | Ubuntu Light 22 px `rgba(255,255,255,0.65)`, e.g. "Pop · Turkey · 128 kbps" |
| **Now-playing track text** | left: 700, top: 400 | 1080 × 32 | Ubuntu Bold 24 px **`#ff4199`** (pink). Marquee animation if text > 1080 px width. |
| Description / tags | left: 700, top: 460 | 1080 × 80 | Ubuntu Light 18 px `rgba(255,255,255,0.45)` |
| **Controls row** | left: 700, top: 580 | 660 × 96 | 5 buttons, each 96 × 96, gap 30 px |
| **Similar Stations** carousel | left: 156, top: 720 | 1716 × 280 | Title + 1×N card row |
| **More from country** carousel | below similar (top: 1024) | 1716 × — | Often clipped off-screen — shown only if scrolled |
| **Stream-error banner** (when streamError) | left: 700, top: 580 | 660 × 96 | Pink banner with Retry button (replaces controls row) — see §18.6 |
| **Sleep timer pill** (when active) | right: 60, top: 60 | auto × 40 | Ubuntu Medium 22 px white "💤 MM:SS", bg `rgba(0,0,0,0.50)`, padding 8 16 |

### 18.3 Empty state (no station selected)

* No artwork; instead a 480×480 placeholder card showing the brand "M" (`assets/logos/path-8.svg`) at 192×192 centered, on bg `rgba(255,255,255,0.04)`, rounded-[24px].
* "No station playing" Ubuntu Bold 36 px white at left:700, top:330.
* "Choose a station from Discover, Genres or Search to start listening." Ubuntu Regular 22 px `rgba(255,255,255,0.55)` at left:700, top:386, max-width 800.
* Single button "Browse Discover" pink `#ff4199`, 240×64, at left:700, top:480.

### 18.4 Controls row (5 buttons)

| Index | Icon (Lucide) | Action | Notes |
|---|---|---|---|
| 0 | `SkipBack` 32 px | Previous (in similar list) | Disabled if no previous |
| 1 | `Play` / `Pause` 40 px | Toggle playback | Larger button (96×96 vs 80×80 others) |
| 2 | `SkipForward` 32 px | Next (in similar list) | Disabled if no next |
| 3 | `Heart` 32 px (filled if favorited) | Toggle favorite | Filled = pink `#ff4199` |
| 4 | `Volume2` 32 px | (no-op on TV — system handles volume) | Sometimes hidden on TV builds |

**Button visual (default):**
* 96 × 96 (or 80 × 80 for non-play)
* `rounded-full`
* Background: `rgba(255,255,255,0.08)`
* Border: `2px solid rgba(255,255,255,0.10)`

**Focused:**
* Background: `rgba(255,65,153,0.20)`
* Border: `2px solid #ff4199`
* Glow: `0 0 24px rgba(255,65,153,0.6)`
* Scale: 1.08
* **Pulse animation:** `pulse-soft` 2s infinite

### 18.5 Similar Stations carousel

* Title "Similar Stations" Ubuntu Bold 28 px white at left:156, top:720
* Cards same as §10.7 (200×264). 1 row, ~7 visible, horizontal scroll on focus move.
* Selecting OK on a card calls `globalPlayer.play(station)` (in-place, no route change), updates this page.

### 18.6 Stream-error banner

* Triggered when `globalPlayer.streamError` is truthy (after 3 retries fail — see §22.3).
* **Layout:** replaces the controls row at left:700, top:580, size 660 × 96.
* **Bg:** `rgba(255,65,153,0.15)`
* **Border:** `2px solid #ff4199`
* **Border radius:** `rounded-[16px]`
* **Content:**
  * Lucide `AlertCircle` 32 px `#ff4199` at left:24, vertical-center
  * Title "Stream unavailable" Ubuntu Bold 22 px white at left:72, top:18
  * Subtitle "Press Retry to try again." Ubuntu Light 18 px `rgba(255,255,255,0.65)` at left:72, top:50
  * **Retry button** Ubuntu Bold 24 px white, bg `#ff4199`, 160 × 56, right:16, vertical-center; hover bg `#e0368a`. Focus index **100** (special — outranks controls).
* `clearStreamError()` called when the user navigates away or successfully starts a new station.

### 18.7 Sleep timer pill

* Visible only when `sleepTimer.remainingSec > 0`.
* Renders at right:60, top:60.
* Format: `💤 MM:SS` (zero-padded).
* When timer hits 0, pill disappears AND playback auto-pauses (§19.4).

### 18.8 Ambient Mode (after 3 minutes idle while playing)

* **Trigger:** `useIdleDetection({ timeoutMs: 180_000, ignoreWhilePaused: true })` reports idle.
* **Dismiss:** any keypress or remote button (regardless of mapping).
* **Visual layer added on top of the page:**

#### 18.8.1 Backdrop

```css
.amb-backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(63,22,96,0.40) 0%, #000 80%);
  z-index: 60;
  /* fades in via .amb-fadein over 2s */
}
```

#### 18.8.2 Drift orbs (6 orbs)

Each orb is an absolutely-positioned `div` with `border-radius: 50%`, soft pink/purple gradient, opacity ~0.7, blur **80 px**. They drift on independent loops:

| Orb | Initial position | Size | Colour | Animation | Duration |
|---|---|---|---|---|---|
| 1 | left:10%, top:20% | 480×480 | `radial-gradient(rgba(255,65,153,0.45), transparent 70%)` | `amb-drift-1` | 30 s ease-in-out infinite |
| 2 | right:8%,  top:14% | 360×360 | `radial-gradient(rgba(116,52,205,0.55), transparent 70%)` | `amb-drift-2` | 38 s |
| 3 | left:50%, top:50% | 600×600 | `radial-gradient(rgba(63,22,96,0.65), transparent 70%)` | `amb-drift-3` | 26 s |
| 4 | right:18%, bottom:14% | 420×420 | `radial-gradient(rgba(255,65,153,0.40), transparent 70%)` | `amb-drift-4` | 44 s |
| 5 | left:24%, bottom:24% | 320×320 | `radial-gradient(rgba(255,138,200,0.40), transparent 70%)` | `amb-drift-1` (reversed delay) | 30 s |
| 6 | right:42%, top:34% | 280×280 | `radial-gradient(rgba(86,33,180,0.45), transparent 70%)` | `amb-drift-2` (reversed delay) | 38 s |

#### 18.8.3 Concentric rings

Two SVG rings centered, slowly spinning in opposite directions:
* Ring 1 — radius 360 px, stroke `rgba(255,65,153,0.20)`, stroke-width 2 — `amb-ring-1` 90s linear infinite (clockwise)
* Ring 2 — radius 240 px, stroke `rgba(116,52,205,0.30)`, stroke-width 2 — `amb-ring-2` 70s linear infinite (counter-clockwise)

#### 18.8.4 Central artwork (smaller, recentered)

* Frame 280 × 280, `rounded-[24px]`, centered (left: calc(50% - 140), top: calc(50% - 140))
* Same `<img>` as the main artwork, fallback to brand "M".
* Glow ring behind: 320 × 320 `radial-gradient(rgba(255,65,153,0.25), transparent 70%)`, `amb-glow-breathe` 6s infinite.

#### 18.8.5 Equalizer bars

8 bars at the bottom-third of the screen (vertical center 66%), each 12 × 80 px, `bg-[#ff4199]`, gap 16 px. Each bar uses its own scaleY animation:

```ts
bars.map((_, i) => ({ animation: `amb-eq-bar ${1.2 + i * 0.15}s ease-in-out infinite` }))
```

#### 18.8.6 Now-playing text

* Position: top: 80, left: 80
* Caption "mega radio" — Ubuntu Light 22 px `rgba(255,255,255,0.50)`, letter-spacing 6 px, uppercase
* Brand "M" mark (`path-8.svg`) at top:80, left:80 (above caption), 36 × 36
* Station name — Ubuntu Bold 48 px white, top: 140, left: 80, max-width 1200 px, ellipsis
* Track title — Ubuntu Medium 28 px **`#ff4199`** (pink), top: 200, left: 80, marquee if overflow
* `amb-text-pulse` 4s opacity 0.5↔0.8 applied to the track title.

#### 18.8.7 Clock (top-right)

* Position: top: 80, right: 80
* Format: `HH:MM` (24-hour) — Ubuntu Bold **64 px** white
* Updates every 30 seconds.

#### 18.8.8 Dismiss

```ts
useEffect(() => {
  if (!ambientActive) return;
  const onAny = () => setAmbientActive(false);
  window.addEventListener('keydown', onAny);
  return () => window.removeEventListener('keydown', onAny);
}, [ambientActive]);
```

The first key press always exits ambient mode but is **not** otherwise dispatched (it's "swallowed").

### 18.9 Verbatim TSX (essence of `RadioPlaying.tsx` controls row)

```tsx
<div className="absolute left-[700px] top-[580px] flex gap-[30px]">
  {[
    { id: 'prev',  Icon: SkipBack,    onPress: () => playPrev(), enabled: hasPrev },
    { id: 'play',  Icon: isPlaying ? Pause : Play, onPress: togglePlay, big: true },
    { id: 'next',  Icon: SkipForward, onPress: () => playNext(), enabled: hasNext },
    { id: 'fav',   Icon: Heart,       onPress: () => toggleFav(),  filled: isFav },
    { id: 'vol',   Icon: Volume2,     onPress: () => {}, hideOnTv: true },
  ].map((b, i) => {
    const focused = focusedIndex === i;
    return (
      <button
        key={b.id}
        tabIndex={0}
        onFocus={() => setFocusedIndex(i)}
        onClick={b.onPress}
        disabled={b.enabled === false || b.hideOnTv}
        className={`
          ${b.big ? 'w-[96px] h-[96px]' : 'w-[80px] h-[80px]'}
          rounded-full flex items-center justify-center
          transition-all duration-200 outline-none
          ${focused
            ? 'bg-[rgba(255,65,153,0.20)] border-2 border-[#ff4199] scale-[1.08] z-10 shadow-[0_0_24px_rgba(255,65,153,0.6)] animate-pulse-soft'
            : 'bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(255,255,255,0.10)]'}
        `}
      >
        <b.Icon size={b.big ? 40 : 32}
                color={b.filled ? '#ff4199' : '#ffffff'}
                fill={b.filled ? '#ff4199' : 'transparent'} />
      </button>
    );
  })}
</div>
```

### 18.10 Spatial nav

```ts
usePageKeyHandler('/radio-playing', (e) => {
  // Ambient dismissal handled separately
  if (e.keyCode === 10009 || e.keyCode === 461) {
    // RETURN — go back to wherever we came from (uses NavigationContext snapshot)
    setLocation(navigationContext.popSnapshot()?.path ?? '/discover-no-user');
    return;
  }
  // Standard arrow handling on controls row + carousels
  // (custom indices)
});
```

---

## 19. Global Player Bar (persistent bottom strip)

**Source:** `source-extracts/components/GlobalPlayer.tsx`

### 19.1 Visibility rules

* Always visible **except** on `/radio-playing` (where the full player is the page).
* Always visible on Splash, Login, Guides? **No** — also hidden on `/`, `/login`, `/guide-*`.

### 19.2 Layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Bar | left: 108, bottom: 0 | **1812 × 88** | bg `rgba(0,0,0,0.61)`, `backdrop-filter: blur(13px)`, `opacity: 0.82` |
| Artwork | left: 24, vertical-center | **53 × 53** | rounded-[8px], object-cover, fallback art |
| Mini equalizer (3 bars) | overlaid on artwork bottom-right | 24 × 24 | `equalizer-global-1/2/3` (the height-AND-top variants — see §3.4) |
| Station name | left: 96, top: 18 | 600 × 28 | Ubuntu Medium **24 px** white, ellipsis |
| Now-playing meta | left: 96, top: 50 | 600 × 24 | Ubuntu Light 18 px **`#ff4199`** (pink), ellipsis. Updates every 30 s. |
| Controls (right side) | right: 24 | — | 4 buttons: prev / play-pause / next / fav |
| Each control button | — | 56 × 56 round | bg `rgba(255,255,255,0.08)` default; focused = pink-ring + scale 1.08 |
| Cast indicator | inline left of controls if `cast.isPolling && cast.activeSession` | 32 × 32 | `assets/icons/cast-icon.svg` tinted `#ff4199` |

### 19.3 Behaviour

* The play button is the focus target when CH_UP / PAGE_UP is pressed from any page (`document.getElementById('global-player-play')?.focus()`).
* Pressing OK on the station-info area (left 600 px) navigates to `/radio-playing`.
* `globalPlayer.audio` is the single shared `<audio>` element appended to `<body>` (or `webapis.avplay` on Tizen). Routes do **not** unmount the audio element.

### 19.4 Equalizer (when playing)

The 3 bars use the `equalizer-global-1/2/3` keyframes which simultaneously animate `height` AND `top` so the bars stay bottom-aligned. (See §3.4.) When paused, the animation is paused (`animation-play-state: paused`) and bars freeze in their current state.

### 19.5 Empty state

When no station is selected at all (fresh app), the bar shows:
* No artwork — instead a 53×53 brand "M" mark on `rgba(255,255,255,0.04)`
* Station name slot: "Pick a station to start playing"
* Meta slot: empty
* Play button: disabled (50% opacity, no focus glow)
---

## 20. Modals (Help / Network / Exit)

All three modals are inline children of `App.tsx`, rendered in a `Portal` at z-index >= 70.

### 20.1 Common modal scaffolding

```tsx
{open && (
  <div
    className="absolute inset-0 z-[70] flex items-center justify-center
               bg-[rgba(0,0,0,0.80)] backdrop-blur-[7px]"
    onKeyDown={onKey}
  >
    <div
      className="bg-[#1a1a1a] rounded-[24px] border-2 border-[rgba(255,255,255,0.08)]
                 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      style={{ width: 600, height: 400 }}
    >
      {children}
    </div>
  </div>
)}
```

### 20.2 Help Modal

* **Trigger:** opened from any page when the app is paused for keyboard help (currently bound to a long-press / keyboard shortcut). The `HelpContext` exposes `helpOpen` and `setHelpOpen`.
* **Backdrop:** `rgba(0,0,0,0.75)` (slightly less opaque than other modals)
* **Panel:** width **720**, height **560**, bg **`#1a1a2e`** (note the dark navy, different from the standard `#1a1a1a`), `rounded-[24px]`
* **Title** "Remote Help" Ubuntu Bold 36 px white at top: 32, left: 40
* **4 hint rows**, each row 640 × 80, padding 12, gap 12 — vertical stack:
  | Color chip | Label |
  |---|---|
  | RED 56×56 rounded `#e74c3c` | "Add to Favorites" Ubuntu Medium 24 px white |
  | GREEN 56×56 rounded `#27ae60` | "Play / Pause" |
  | YELLOW 56×56 rounded `#f1c40f` | "Open Search" |
  | BLUE 56×56 rounded `#3498db` | "Change Country" |
* **Close hint** "RETURN ▶ Close" Ubuntu Medium 18 px `rgba(255,255,255,0.55)` at bottom: 24, center-x.
* **Behaviour:** RETURN closes; no other interaction.

### 20.3 Network Disconnect Modal

* **Source:** `NetworkStatusContext` exposes `isOnline`. When `false`, modal opens.
* **Trigger source:** Tizen `webapis.network` API for Tizen, browser `online`/`offline` events for others.
* **Panel:** 600 × 400 at left: 660, top: 340 (centered 1920 × 1080).
* **Bg:** `#1a1a1a`, **border-color:** `#ff4199`, border-2, rounded-[24px], glow `0 0 40px rgba(255,65,153,0.30)`
* **Content (top → bottom, all centered horizontally):**
  * Lucide `WifiOff` 64 × 64 `#ff4199` at top: 56
  * Title "No Internet" Ubuntu Bold 36 px white at top: 152
  * Body "Please check your network connection. The app will resume when you're back online." Ubuntu Regular 22 px `rgba(255,255,255,0.70)` at top: 216, max-width 480, centered
  * "OK" button Ubuntu Bold 24 px white, bg `#ff4199`, 200 × 64, rounded-[14px], at bottom: 48, center-x. Hover bg `#ff5aa8`.
* **Side-effect on open:** if `globalPlayer.isPlaying`, the player is **paused** automatically (not stopped — state is preserved).
* **Side-effect on resume:** when `isOnline` becomes true again, modal closes automatically; player remains paused (user explicitly resumes).

### 20.4 Exit Modal

* **Trigger:** RETURN key pressed on `/discover-no-user`.
* **Panel:** 600 × 400 at left: 660, top: 340.
* **Bg:** `#1a1a1a`, border-2 `rgba(255,255,255,0.08)`, rounded-[24px].
* **Content:**
  * Title "Exit Radio Mega?" Ubuntu Bold 36 px white at top: 80, center-x
  * Body "Are you sure you want to close the app?" Ubuntu Regular 22 px `rgba(255,255,255,0.70)` at top: 156, center-x
  * Two buttons at bottom: 64, gap 24, both 200 × 64 rounded-[14px]:
    * **No** (default focus) — bg `rgba(255,255,255,0.10)`, border `rgba(255,255,255,0.20)`, Ubuntu Bold 24 px white. Focused = pink ring.
    * **Yes** — bg `#ff4199`, Ubuntu Bold 24 px white. Focused = scale 1.05 + glow.
* **Behaviour:**
  * RETURN inside modal → close modal (cancel exit).
  * OK on No → close modal.
  * OK on Yes → call `tizen.application.getCurrentApplication().exit()` on Tizen / `window.close()` elsewhere. On platforms where `window.close()` is a no-op (most browsers), no action — the modal stays open and the user must press No.

### 20.5 Modal stacking

Only one modal is visible at a time. If Network Modal opens while Exit Modal is showing, Network Modal takes precedence (higher z-index `z-[80]`).

---

## 21. Context Providers (verbatim API surfaces)

All contexts live in `source-extracts/contexts/`. Below is the public API of each context that the native team must replicate (state shape + methods).

### 21.1 `LocalizationContext`

```ts
interface LocalizationContextValue {
  language: string;             // 'en' | 'tr' | ... (see §23)
  setLanguage(lang: string): void;
  t(key: string, params?: Record<string, string | number>): string;
}
```

* On mount, reads `localStorage['app_language']`; if absent, auto-detects from `navigator.language`.
* `t(key)` looks up a flat dot-keyed table fetched from `https://api.themegaradio.com/api/translations/<lang>` and cached for 30 days (see §22.5).
* Falls back to English if a key is missing in the active language.

### 21.2 `CountryContext`

```ts
interface CountryContextValue {
  selectedCountry: string;                  // ISO2, or 'Global'
  setCountry(iso2OrGlobal: string): void;
}
```

* On mount, reads `localStorage['selectedCountry']`. If absent, default = `'Global'`.
* When `selectedCountry` changes, all queries keyed by country (e.g. `getStationsByCountry`) are invalidated.

### 21.3 `AuthContext`

```ts
interface AuthContextValue {
  user: User | null;                  // { id, name, email, avatarUrl }
  token: string | null;
  isLoggedIn: boolean;
  login(token: string, user: User): void;
  logout(): void;
}
```

* Persists `token` in `localStorage['tv_auth_token']` and user in `localStorage['tv_auth_user']`.
* Token is attached as `Authorization: Bearer <token>` header on every API call (when present).

### 21.4 `FavoritesContext`

```ts
interface FavoritesContextValue {
  favorites: Station[];
  isFavorite(stationId: string): boolean;
  add(station: Station): Promise<void>;
  remove(stationId: string): Promise<void>;
  toggle(station: Station): Promise<void>;
}
```

* Local source of truth: `localStorage['mega_radio_favorites']` (JSON array of stations).
* When `isLoggedIn`, `add/remove` also POST/DELETE to `/api/favorites`. On app start, server list is merged into local list (server wins on conflicts).

### 21.5 `NavigationContext`

```ts
interface NavigationSnapshot { path: string; focus: any; }
interface NavigationContextValue {
  saveSnapshot(path: string, focus: any): void;
  popSnapshot(): NavigationSnapshot | undefined;
  peekSnapshot(): NavigationSnapshot | undefined;
}
```

* Stack of snapshots. When a page navigates to RadioPlaying, it pushes a snapshot of its focus state. RETURN pops and restores.

### 21.6 `GlobalPlayerContext`

```ts
interface GlobalPlayerContextValue {
  currentStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  streamError: string | null;
  nowPlayingMeta: { title?: string; artist?: string } | null;

  play(station: Station): Promise<void>;
  pause(): void;
  togglePlay(): void;
  retryCurrentStation(): Promise<void>;
  clearStreamError(): void;
}
```

* Owns the single `<audio>` element (or `webapis.avplay`).
* On `play()`: tries `station.url_resolved`. On error: retries with original `station.url`. On second error: retries through `/api/stream-proxy?url=<encoded>`. Each retry waits 1s → 2s → 4s. After 3 failed retries, sets `streamError` and stops.
* On Tizen, calls `tizen.power.request('SCREEN_NORMAL')` while playing; releases on pause.
* On `AppHide`/`AppSuspend`, pauses; on `AppShow`/`AppResume`, does NOT auto-resume (user must press play).
* Polls `https://api.themegaradio.com/api/now-playing/<stationId>` every 30 s and updates `nowPlayingMeta`.

### 21.7 `CastContext`

```ts
interface CastContextValue {
  isPolling: boolean;
  activeSession: { stationId: string } | null;
}
```

* When `isLoggedIn`, polls `https://api.themegaradio.com/api/cast/poll` every **5000 ms** with `Authorization: Bearer <token>`.
* When the response includes a station ID different from `currentStation`, the player auto-plays it and routes to `/radio-playing` (no UI for cast invocation — it just happens).

### 21.8 `SleepTimerContext`

```ts
interface SleepTimerContextValue {
  remainingSec: number;                  // 0 if no timer
  start(minutes: 15 | 30 | 60 | 120): void;
  cancel(): void;
}
```

* `setInterval` ticks every 1000 ms, decrements `remainingSec`.
* On reaching 0: calls `globalPlayer.pause()`, clears interval, dispatches a Toast "Sleep timer ended."

### 21.9 `NetworkStatusContext`

```ts
interface NetworkStatusContextValue {
  isOnline: boolean;
}
```

* Tizen branch: subscribes to `webapis.network.addNetworkStateChangeListener`.
* webOS / browser branch: listens to `online`/`offline` window events.
* When transitions to `false`, the Network Modal shows and `globalPlayer.pause()` is called.

### 21.10 `AppLifecycleContext`

```ts
interface AppLifecycleContextValue {
  appState: 'active' | 'hidden' | 'suspended';
}
```

* Tizen: subscribes to `webapis.appcommon.addAppEventListener('AppSuspend' | 'AppResume' | 'AppHide' | 'AppShow', ...)`.
* webOS / browser: uses `document.visibilitychange` (`visible` → active, `hidden` → hidden).
* Pauses `globalPlayer` on `hidden` / `suspended`.

### 21.11 `AccessibilityContext`

```ts
interface AccessibilityContextValue {
  highContrast: boolean;
  largeText: boolean;
  toggleHighContrast(): void;
  toggleLargeText(): void;
}
```

* Persists to `localStorage['highContrast']` and `localStorage['largeText']` (boolean strings).
* Toggles `<html>` classes `.high-contrast` / `.large-text` (defined in §3.3).

### 21.12 `HelpContext`

```ts
interface HelpContextValue {
  helpOpen: boolean;
  setHelpOpen(open: boolean): void;
}
```

* Trivial bool wrapper.

### 21.13 `FocusRouterContext`

```ts
interface FocusRouterContextValue {
  register(route: string, handler: (e: KeyboardEvent) => void): void;
  unregister(route: string): void;
}
```

* See §4.5 / §5.4.
---

## 22. Services & API Layer

All services live in `source-extracts/services/`. Use these as the contract.

### 22.1 `megaRadioApi.ts` — REST client

* **Base URL:** `https://api.themegaradio.com`
* **Tizen suffix:** all GET requests append `?tv=1` (or `&tv=1`) when running under Tizen so the backend can differentiate.
* **Authorization:** when `localStorage['tv_auth_token']` is present, every request includes `Authorization: Bearer <token>`.

#### 22.1.1 Endpoints (verbatim signatures)

```ts
export const megaRadioApi = {
  // Discovery
  getPopularStations(p: { offset?: number; limit?: number; country?: string }): Promise<Station[]>,
  getStationsByGenre  (p: { genre: string; offset?: number; limit?: number; }): Promise<Station[]>,
  getStationsByCountry(p: { country: string; offset?: number; limit?: number; }): Promise<Station[]>,
  getStationDetail    (id: string): Promise<Station>,
  getSimilarStations  (id: string): Promise<Station[]>,

  // Catalog
  getGenres   (p?: { offset?: number; limit?: number }): Promise<Genre[]>,
  getCountries(): Promise<Country[]>,

  // Search
  searchStations(p: { q: string; limit?: number }): Promise<Station[]>,

  // Now playing
  getNowPlaying(stationId: string): Promise<{ title?: string; artist?: string }>,

  // Auth (TV device-code flow)
  requestTvCode(deviceId: string): Promise<{ code: string; expiresInSec: number }>,
  pollTvCode   (deviceId: string, code: string): Promise<{ activated: boolean; token?: string; user?: User }>,

  // Cast
  pollCast(): Promise<{ stationId?: string }>,                 // requires Authorization

  // Favorites (server)
  listFavorites  (): Promise<Station[]>,
  addFavorite    (stationId: string): Promise<void>,
  removeFavorite (stationId: string): Promise<void>,

  // Translations
  getTranslations(lang: string): Promise<Record<string, string>>,
};
```

#### 22.1.2 Stream pipeline endpoints (served by Vite dev + Express prod)

These are critical for **HTTP audio streams** (Samsung TV blocks mixed-content, so HTTP streams must be proxied).

| Endpoint | Method | Params | Behaviour |
|---|---|---|---|
| `/api/stream-proxy?url=<url>` | GET | `url` | Pipes the upstream audio through the backend. Follows up to **5** redirects. Resolves `.m3u`/`.pls` playlists to the direct stream URL, then pipes audio with CORS headers. **15 s** request timeout. HLS (`.m3u8`) is **passed through** without parsing. |
| `/api/stream-check?url=<url>` | GET | `url` | Probes a stream URL with HEAD (falls back to GET). Returns JSON `{ ok, contentType, statusCode, isPlaylist, responseTime }`. **5 s** timeout. |
| `/api/stream-resolve?url=<url>` | GET | `url` | Follows all redirects, parses `.m3u`/`.pls` playlists. Returns `{ url, isPlaylist, isHLS, redirectCount, contentType }`. |

> **Native impl note:** Each platform must implement either an HTTP-stream-allowed audio engine (most do — `AVPlayer`, `ExoPlayer`, `MediaPlayer`) OR re-host these proxy endpoints in their own backend. The web app proxies because browser/TV-browser blocks mixed content; native players generally don't have that restriction, but keep the playlist-resolution behaviour (`.m3u` / `.pls` → first URL).

### 22.2 `Station` data model (TS interface)

```ts
interface Station {
  id: string;                  // server UUID or RadioBrowser stationuuid
  name: string;
  url: string;                 // primary stream URL (may be HTTP)
  url_resolved?: string;       // pre-resolved URL (preferred)
  favicon?: string;            // station logo URL (may be missing/broken)
  homepage?: string;
  country?: string;            // ISO2 or full name
  countrycode?: string;        // ISO2
  language?: string;
  tags?: string[];             // genres, free-form
  bitrate?: number;            // kbps
  codec?: string;              // 'MP3' | 'AAC' | 'OGG' ...
  votes?: number;
  clickcount?: number;
}
```

### 22.3 Stream playback retry strategy (verbatim from `GlobalPlayerContext`)

```ts
async function playWithRetry(station: Station) {
  setIsLoading(true);
  setStreamError(null);

  const candidates = [
    station.url_resolved,
    station.url,
    `/api/stream-proxy?url=${encodeURIComponent(station.url)}`,
  ].filter(Boolean) as string[];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const src = candidates[Math.min(attempt, candidates.length - 1)];
      audioRef.src = src;
      await audioRef.play();
      setIsPlaying(true);
      setIsLoading(false);
      return;
    } catch (err) {
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt))); // 1s, 2s, 4s
      }
    }
  }
  setStreamError('Stream unavailable. Press Retry to try again.');
  setIsLoading(false);
  setIsPlaying(false);
}
```

### 22.4 `castService.ts` (verbatim shape)

```ts
class CastService {
  private intervalId: number | null = null;

  start() {
    if (this.intervalId) return;
    this.intervalId = window.setInterval(() => this.poll(), 5000);
    this.poll();
  }
  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }
  private async poll() {
    if (!localStorage.getItem('tv_auth_token')) return;
    const res = await megaRadioApi.pollCast();
    if (res.stationId) {
      const station = await megaRadioApi.getStationDetail(res.stationId);
      window.dispatchEvent(new CustomEvent('cast:play', { detail: station }));
    }
  }
}
export const castService = new CastService();
```

`GlobalPlayerContext` listens to `cast:play` and calls `play(station)` then routes to `/radio-playing`.

### 22.5 Caching strategy (TanStack Query)

| Data | Stale time | Notes |
|---|---|---|
| `getCountries()` | **30 days** | Static dataset |
| `getGenres()` | **7 days** | Rarely changes |
| Station lists by genre / country / popular | **7 days** | |
| `getStationDetail(id)` | **24 hours** | |
| `searchStations({ q })` | **24 hours** | |
| `getNowPlaying(id)` | **30 seconds** (refetch interval) | Live metadata |
| `getTranslations(lang)` | **30 days** | Persisted in `localStorage['cache_translations_<lang>']` for offline boot |
| Pagination batches (offset > 0) | individually cached using `queryClient.fetchQuery({ queryKey: [...,'page', offset] })` | Each page is its own cache entry |

**Prefetch:** When page N renders, page N+1 is `queryClient.prefetchQuery()` started in background.

### 22.6 `recentlyPlayedService.ts`

```ts
const KEY = 'recentlyPlayed';
const MAX = 6;

export const recentlyPlayedService = {
  getAll(): Station[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  },
  push(station: Station) {
    const list = this.getAll().filter(s => s.id !== station.id);
    list.unshift(station);
    if (list.length > MAX) list.pop();
    localStorage.setItem(KEY, JSON.stringify(list));
  },
  clear() { localStorage.removeItem(KEY); },
};
```

Push is called from `GlobalPlayerContext.play()` on successful playback start.

### 22.7 `recommendationService.ts` ("For You")

```ts
const HISTORY_KEY = 'listeningHistory';
const HISTORY_MAX = 50;

export const recommendationService = {
  trackPlay(station: Station) {
    const list: Array<{ genre: string; country: string; ts: number }> = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    );
    list.unshift({
      genre:   station.tags?.[0] ?? 'pop',
      country: station.countrycode ?? '',
      ts:      Date.now(),
    });
    if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  },
  async getRecommendedStations(): Promise<Station[]> {
    const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (list.length < 3) return [];                 // not enough data
    const topGenres = topN(list.map(e => e.genre), 3);
    const stations = await Promise.all(topGenres.map(g =>
      megaRadioApi.getStationsByGenre({ genre: g, limit: 8 })));
    return dedupe(stations.flat()).slice(0, 12);
  },
};
```

### 22.8 `autoPlayService.ts` (Play at Start)

```ts
export async function autoPlayOnLaunch() {
  const mode = localStorage.getItem('playAtStart') ?? 'none';
  if (mode === 'none') return;

  let station: Station | null = null;
  if (mode === 'last') {
    station = JSON.parse(localStorage.getItem('lastPlayedStation') || 'null');
  } else if (mode === 'random') {
    const list = await megaRadioApi.getPopularStations({ limit: 100 });
    station = list[Math.floor(Math.random() * list.length)];
  } else if (mode === 'favorite') {
    const favs = JSON.parse(localStorage.getItem('mega_radio_favorites') || '[]');
    station = favs[0] ?? null;
  }
  if (station) {
    await globalPlayer.play(station);
    setLocation('/radio-playing');
  }
}
```

### 22.9 `cacheService.ts` (translation cache)

```ts
export const cacheService = {
  getTranslations(lang: string): Record<string, string> | null {
    const raw = localStorage.getItem(`cache_translations_${lang}`);
    if (!raw) return null;
    try {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > 30 * 24 * 3600 * 1000) return null;  // expired
      return data;
    } catch { return null; }
  },
  setTranslations(lang: string, data: Record<string, string>) {
    localStorage.setItem(`cache_translations_${lang}`, JSON.stringify({ ts: Date.now(), data }));
  },
};
```

---

## 23. Localization (48 languages)

### 23.1 Supported language codes

Listed in alphabetical order of code:

```
ar (العربية)        bg (български)      bn (বাংলা)         cs (Čeština)
da (Dansk)          de (Deutsch)        el (Ελληνικά)      en (English)
es (Español)        et (Eesti)          fa (فارسی)         fi (Suomi)
fr (Français)       he (עברית)          hi (हिन्दी)         hr (Hrvatski)
hu (Magyar)         id (Bahasa Indonesia) is (Íslenska)    it (Italiano)
ja (日本語)          jv (Basa Jawa)       kk (Қазақ тілі)    kn (ಕನ್ನಡ)
ko (한국어)          lt (Lietuvių)        lv (Latviešu)      ml (മലയാളം)
mr (मराठी)          ms (Bahasa Melayu)  nl (Nederlands)    no (Norsk)
pa (ਪੰਜਾਬੀ)        pl (Polski)         pt (Português)     ro (Română)
ru (Русский)        sk (Slovenčina)     sl (Slovenščina)   sr (Српски)
sv (Svenska)        sw (Kiswahili)      ta (தமிழ்)         te (తెలుగు)
th (ไทย)           tr (Türkçe)         uk (Українська)    ur (اردو)
vi (Tiếng Việt)    zh (中文)
```

(Total: 48 entries; note `bn`, `te`, `ta`, `kn`, `ml`, `pa`, `mr` cover Indian subcontinent.)

### 23.2 Translation table format

```json
{
  "sidebar.discover": "Discover",
  "sidebar.genres":   "Genres",
  "sidebar.search":   "Search",
  "sidebar.favorites":"Favorites",
  "sidebar.country":  "Country",
  "sidebar.settings": "Settings",
  "common.next":      "Next",
  "common.skip":      "Skip",
  "common.back":      "Back",
  "color.red":        "RED",
  "color.green":      "GREEN",
  "color.blue":       "BLUE",
  "color.yellow":     "YELLOW",
  "guide1.title":     "Discover Radios",
  "guide1.body":      "Press the RED button on your remote ...",
  "...": "..."
}
```

### 23.3 Auto-detection on first launch

```ts
function detectLanguage(): string {
  const saved = localStorage.getItem('app_language');
  if (saved) return saved;
  const browser = (navigator.language || 'en').split('-')[0].toLowerCase();
  return SUPPORTED.includes(browser) ? browser : 'en';
}
```

### 23.4 RTL handling

For `ar`, `fa`, `he`, `ur`, the app sets `<html dir="rtl">`. Native re-implementations should mirror their layouts (sidebar moves to right, focus arithmetic LEFT/RIGHT inverted, marquee directions reversed).

---

## 24. localStorage Keys (canonical reference)

| Key | Type | Used by | Description |
|---|---|---|---|
| `onboardingCompleted` | `"true"` | Splash, Guides | Skip onboarding on subsequent launches |
| `app_language` | string (lang code) | LocalizationContext | Selected interface language |
| `keyboardLanguage` | string (lang code) | VirtualKeyboard | Keyboard layout choice |
| `selectedCountry` | ISO2 or `'Global'` | CountryContext | Active country filter |
| `mega_radio_favorites` | JSON Station[] | FavoritesContext | Local favorites snapshot |
| `recentlyPlayed` | JSON Station[] (≤6) | recentlyPlayedService | Discover "Recently Played" |
| `listeningHistory` | JSON `{genre,country,ts}[]` (≤50) | recommendationService | "For You" engine |
| `lastPlayedStation` | JSON Station | autoPlayService | "Resume last" mode |
| `playAtStart` | `'none'\|'last'\|'random'\|'favorite'` | Settings, autoPlayService | Launch behaviour |
| `tv_auth_token` | JWT string | AuthContext, megaRadioApi | Bearer token |
| `tv_auth_user` | JSON User | AuthContext | Cached user profile |
| `tv_device_id` | UUID-v4 string | Login | Persistent device identifier for cast pairing |
| `recentSearches` | JSON string[] (≤10) | Search | Recent queries history |
| `highContrast` | `"true"\|"false"` | AccessibilityContext | High-contrast theme toggle |
| `largeText` | `"true"\|"false"` | AccessibilityContext | Large-text toggle |
| `cache_translations_<lang>` | JSON `{ts, data}` | cacheService | 30-day translation cache |
| `sleepTimerStart` | timestamp ms (optional) | SleepTimerContext | Used to recover remaining time across reloads |

> **Native equivalent storage:** UserDefaults (Apple), DataStore / SharedPreferences (Android), `ApplicationData.Current.LocalSettings` (Windows). The keys must be the **exact same strings** if the native app shares its account / cast device id with the web app via a backend.

---

## 25. Tizen `config.xml` (verbatim privileges)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets"
        xmlns:tizen="http://tizen.org/ns/widgets"
        id="http://yourdomain/RadioMega"
        version="1.0.0"
        viewmodes="maximized">
  <tizen:application id="RadioMega.RadioMega" package="RadioMega" required_version="2.3" />
  <icon src="icon.png" />
  <name>Radio Mega</name>
  <content src="index.html" />

  <tizen:privilege name="http://tizen.org/privilege/internet" />
  <tizen:privilege name="http://tizen.org/privilege/network.get" />
  <tizen:privilege name="http://developer.samsung.com/privilege/network.public" />
  <tizen:privilege name="http://tizen.org/privilege/power" />
  <tizen:privilege name="http://tizen.org/privilege/application.launch" />
  <tizen:privilege name="http://tizen.org/privilege/mediastorage" />

  <tizen:setting screen-orientation="landscape" pointing-device-support="enable"
                 background-support="disable" encryption="disable"
                 hwkey-event="enable" />
  <feature name="http://tizen.org/feature/screen.size.normal.1080.1920" />
</widget>
```

> Native re-implementations should request equivalent permissions where applicable (Apple TV: Background Audio capability; Android TV: `WAKE_LOCK`, `INTERNET`, `ACCESS_NETWORK_STATE`; Windows: `internetClient`, `backgroundMediaPlayback`).
---

## 26. Screenshot Index

All screenshots in this package were captured at native 1920 × 1080 px from the running TV web app and represent the **canonical visual state** for each surface. They live in `screenshots/v2/`.

| # | File | Surface | Notes |
|---|---|---|---|
| 01 | `01-splash.jpg` | Splash | First-run boot screen, brand "M" + wordmark + device row |
| 02 | `02-guide-1.jpg` | Onboarding 1/4 | RED button hint, "Discover Radios" |
| 03 | `03-guide-2.jpg` | Onboarding 2/4 | GREEN button hint, "Browse Genres" |
| 04 | `04-guide-3.jpg` | Onboarding 3/4 | BLUE button hint, "Search Stations" |
| 05 | `05-guide-4.jpg` | Onboarding 4/4 | YELLOW button hint, "Your Favorites" |
| 06 | `06-login.jpg` | Login | 6-digit pairing code + crowd art |
| 07 | `07-discover.jpg` | Discover | Default home with sections |
| 08 | `08-genres.jpg` | Genres | Popular Genres + All Genres grids |
| 09 | `09-genre-list-pop.jpg` | Genre list (Pop) | 7-col grid demo |
| 10 | `10-genre-list-rock.jpg` | Genre list (Rock) | Different genre, same layout |
| 11 | `11-search-empty.jpg` | Search | Virtual keyboard + empty results |
| 12 | `12-favorites-empty.jpg` | Favorites | Empty-state CTA |
| 13 | `13-settings.jpg` | Settings | Categories + content panel |
| 14 | `14-country-select.jpg` | Country Select | List + keyboard |
| 17 | `17-radio-playing-empty.jpg` | Radio Playing (no station) | Pre-playback empty state |

> Pages **not pictured** (Help Modal, Network Disconnect Modal, Exit Modal, Radio Playing with active station, Ambient Mode) are documented exhaustively in the relevant sections (§20.2, §20.3, §20.4, §18, §18.8). Native teams should produce reference screenshots of these states during their first build pass and compare against the textual spec.

---

## 27. Implementation Checklist (per platform)

A flat checklist that the native teams can use to track parity.

### 27.1 Visual

- [ ] All 8 screen colors (`#ff4199`, `#0e0e0e`, `#1a1a1a`, `#1a1a2e`, `#1f2024`, `#01d7fb`, `#3F1660`, `#e74c3c/#27ae60/#3498db/#f1c40f`) reproduced as constants.
- [ ] Ubuntu font family bundled (4 weights: 300/400/500/700).
- [ ] Type scale: 14, 18, 20, 22, 24, 28, 36, 48, 53.108, 64, 96 px constants defined.
- [ ] Page canvas locked at 1920 × 1080 (no responsive reflow).
- [ ] All 17 screenshot surfaces match pixel-perfect.
- [ ] All 27 keyframe animations re-implemented (durations & easings exact).
- [ ] Focus ring: 2 px `#ff4199` + 2 px `#0e0e0e` offset + scale 1.05 + glow + pulse.
- [ ] Scrollbars hidden, cursor hidden on TV builds.

### 27.2 Behaviour

- [ ] Splash → onboarding → discover-no-user (with `onboardingCompleted` flag).
- [ ] All 4 onboarding guides exit on RETURN, advance on OK or matching color button.
- [ ] Sidebar 6 tiles with focus + active visuals; RIGHT exits sidebar.
- [ ] Color-button shortcuts (RED/GREEN/BLUE/YELLOW) navigate to Discover/Genres/Search/Favorites.
- [ ] CH_UP / PAGE_UP jumps focus to GlobalPlayer play button.
- [ ] RETURN on Discover opens Exit Modal; on RadioPlaying returns to previous page (with focus restored); elsewhere = browser back.
- [ ] Genres: 4-col grid, UP/DOWN moves ±1 row (4 items), LEFT/RIGHT moves ±1 item.
- [ ] GenreList: 7-col grid with incomplete-row clamp.
- [ ] Search/CountrySelect virtual keyboard with all 13 layouts + language dropdown.
- [ ] Favorites grid 4-col with empty-state CTA.
- [ ] Settings 7 categories with two-zone navigation (LEFT/RIGHT).
- [ ] RadioPlaying: 5 controls + similar carousel + sleep timer pill + stream-error banner.
- [ ] Ambient Mode after 3 min idle while playing; dismiss on any key.
- [ ] GlobalPlayer always present (except splash/login/guides/radio-playing); persists audio across routes.
- [ ] 3-step retry (1s / 2s / 4s) on stream errors; final error → pink banner with Retry.
- [ ] Now-playing metadata polled every 30 s.
- [ ] Sleep timer: 15/30/60/120 minutes; pauses player on expiry.
- [ ] Auto-play modes: none (default), last, random, favorite.
- [ ] Login: 6-digit code + 3 s polling for activation; logout button in red.
- [ ] Cast: 5 s polling when logged in; auto-plays incoming station and routes to RadioPlaying.
- [ ] Help Modal, Network Modal, Exit Modal verbatim.

### 27.3 Platform compliance

- [ ] On loss of network: pause player + show Network Modal.
- [ ] While playing: prevent screensaver (Tizen `tizen.power.request`, equivalent on native).
- [ ] On app suspend / hide: pause player; do not auto-resume.
- [ ] Two-step exit: RETURN on Discover → modal; OK on Yes → exit.

### 27.4 Data & persistence

- [ ] All 17 localStorage keys mirrored in native key-value store.
- [ ] Translation cache 30 days, station list 7 days, popular 24 h, search 24 h, now-playing 30 s, countries 30 days.
- [ ] TV pairing device-id persisted across launches.
- [ ] Favorites: local + (when logged in) server merge.

### 27.5 Localization

- [ ] All 48 supported languages.
- [ ] Auto-detection from system locale on first launch.
- [ ] RTL mirroring for `ar`, `fa`, `he`, `ur`.
- [ ] All 13 keyboard layouts.
