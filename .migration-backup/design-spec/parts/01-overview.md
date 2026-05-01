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
