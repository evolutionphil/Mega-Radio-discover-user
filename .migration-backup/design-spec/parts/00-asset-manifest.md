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
