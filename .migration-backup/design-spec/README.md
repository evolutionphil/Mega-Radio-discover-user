# Radio Mega — TV App Cross-Platform Design Specification (V2)

This package contains **everything** the implementation teams need to rebuild the Radio Mega TV experience natively on Apple TV, macOS, Windows, and Android TV.

## What is in this package

```
design-spec/
├── README.md                            ← (this file)
├── RADIO_MEGA_DESIGN_SPEC_V2.md         ← THE main design specification (~3000 lines)
├── RADIO_MEGA_DESIGN_SPEC.md            ← V1 spec (kept for reference; V2 supersedes it)
│
├── screenshots/v2/                      ← 15 reference screenshots @ 1920×1080
│   ├── 01-splash.jpg
│   ├── 02-guide-1.jpg ... 05-guide-4.jpg     (onboarding)
│   ├── 06-login.jpg
│   ├── 07-discover.jpg
│   ├── 08-genres.jpg
│   ├── 09-genre-list-pop.jpg
│   ├── 10-genre-list-rock.jpg
│   ├── 11-search-empty.jpg
│   ├── 12-favorites-empty.jpg
│   ├── 13-settings.jpg
│   ├── 14-country-select.jpg
│   └── 17-radio-playing-empty.jpg
│
├── assets/                              ← ALL design assets bundled (4.0 MB)
│   ├── onboarding-screens/               (Splash + 4 guides + login screenshots — for visual reference)
│   │   ├── 01-splash.jpg
│   │   ├── 02-guide-1.jpg ... 05-guide-4.jpg
│   │   └── 06-login.jpg
│   ├── screen-references/                (All 15 reference screenshots @ 1920×1080 — duplicated here for convenience)
│   ├── logos/                            (5 files: brand "M", logos, app icons)
│   │   ├── path-8.svg                       (Brand "M" pink mark — used in Splash, Sidebar, Ambient, GlobalPlayer)
│   │   ├── logo.png                         (1024×1024 PNG launcher logo)
│   │   ├── icon.png                         (117×117 favicon / Tizen launcher)
│   │   ├── globe-icon.svg / globe-icon.png  (Country selector "Global")
│   ├── icons/                            (17 SVG icons for sidebar, controls, decorations)
│   │   ├── radio-icon.svg                   (Sidebar Discover)
│   │   ├── music-icon.svg                   (Sidebar Genres)
│   │   ├── search-icon.svg                  (Sidebar Search)
│   │   ├── heart-icon.svg                   (Sidebar Favorites)
│   │   ├── settings-icon.svg                (Sidebar Settings)
│   │   ├── cast-icon.svg                    (GlobalPlayer cast indicator)
│   │   ├── logout-icon.svg                  (Settings → Account logout)
│   │   ├── arrow.svg                        (Onboarding pointer)
│   │   ├── waves.svg / ellipse2.svg         (Splash decorations)
│   │   ├── monitor.svg / tablet.svg / phone.svg (Splash device row)
│   │   └── fallback-favicon.svg             (Station fallback)
│   ├── backgrounds/                      (3 PNG backgrounds)
│   │   ├── discover-background.png          (Onboarding 1920×1080 bg)
│   │   ├── hand-crowd-disco-1.png           (Login right-column art)
│   │   └── frame445.png                     (Splash decoration)
│   └── images/                           (Misc raster images)
│       ├── fallback-station.png             (Default station artwork — RadioPlaying / GlobalPlayer / Cards)
│       └── fallback-favicon.svg             (Vector duplicate of station fallback)
│
├── full-source/                         ← FULL TV APP SOURCE CODE (137 files, 5.3 MB)
│   │                                       Use this for deep analysis (Emergent / AI codegen / QA).
│   ├── src/                                 (All React TSX/TS — pages, contexts, components, hooks, services, utils)
│   ├── images/                              (All raw bundled assets — same as /assets/)
│   ├── css/                                 (Production CSS bundles)
│   ├── js/                                  (Production JS bundles + polyfills)
│   ├── webOSTVjs-1.2.0/                     (LG webOS SDK)
│   ├── _server/                             (Express backend: index.ts, routes.ts, vite.ts — stream-proxy, stream-resolve)
│   ├── _root-configs/                       (Root package.json, vite.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.js)
│   ├── config.xml                           (Tizen application manifest)
│   ├── index.html / index-dev.html / index.production.html / index.template.html
│   ├── vite.config.tv.ts                    (Dev server + stream-proxy / stream-check / stream-resolve endpoints)
│   ├── tailwind.config.cjs / postcss.config.js / tsconfig.json
│   ├── appinfo.json                         (LG webOS appinfo)
│   ├── build-samsung-tv.sh / build-lg-webos.sh    (Production build scripts)
│   ├── BACKEND_OPTIMIZATION_GUIDE.md
│   ├── TEST_LOCALIZATION.md
│   └── TRANSLATION_KEYS_MAPPING.md
│
├── source-extracts/                     ← Hand-curated subset of full-source (for quick reading)
│   ├── App.tsx
│   ├── index.css                            (Full root CSS with all keyframes)
│   ├── tailwind.config.cjs
│   ├── config.xml                           (Tizen privileges manifest)
│   ├── contexts/                            (All 13 React Contexts)
│   ├── pages/                               (All page components)
│   ├── components/                          (Sidebar, GlobalPlayer, CountrySelector...)
│   ├── services/                            (megaRadioApi, castService, recently-played, recommendation, autoPlay, cache)
│   ├── hooks/                               (useFocusManager, useIdleDetection, useTVNavigation...)
│   └── lib/                                 (analytics, queryClient, utils)
│
└── parts/                               ← Source markdown files for the V2 spec
    ├── 00-asset-manifest.md
    ├── 01-overview.md
    ├── 02-design-system.md
    ├── 03-routing-providers.md
    ├── 04-remote-focus.md
    ├── 05-sidebar.md
    ├── 06-splash-onboarding.md
    ├── 07-login-discover.md
    ├── 08-genres-search.md
    ├── 09-country-favorites-settings.md
    ├── 10-radioplaying-globalplayer.md
    ├── 11-modals-contexts.md
    ├── 12-services-localization-storage.md
    └── 13-screenshots-final.md
```

## How to use this spec

### For visual designers

1. Open the screenshots in `screenshots/v2/` — these are the canonical visual reference at exactly 1920 × 1080 px.
2. Use the assets from `assets/` directly — they are the **production** art.
3. Cross-check colors, fonts, sizes against `RADIO_MEGA_DESIGN_SPEC_V2.md` §2 (color palette), §3 (design system), and the per-page sections (§7-§19).

### For implementation engineers

1. **Read `RADIO_MEGA_DESIGN_SPEC_V2.md` cover-to-cover first.** It is the source of truth.
2. For any UI question, the order of authority is:
   1. The verbatim TSX/CSS in `source-extracts/`
   2. The exact pixel/color/animation values in the V2 spec
   3. The screenshots in `screenshots/v2/`
3. Re-implement contexts (`source-extracts/contexts/`) as platform-equivalent state stores. The public API surface (state shape + methods) is documented in §21 and must match exactly.
4. Re-implement services (`source-extracts/services/`) as platform-native HTTP/storage layers. The behaviour contracts in §22 must match exactly.
5. Use the localStorage key reference in §24 — these keys must be the EXACT same strings if your native app shares state with the web app via the backend (e.g. Cast pairing).

### For QA

* The Implementation Checklist in §27 of the V2 doc is the QA acceptance gate. Walk through each item per platform.
* Every animation in §3.4 has an exact duration and easing — verify with a slow-motion screen capture.

## Document statistics

* V2 main spec: **~3000 lines** of markdown
* Verbatim TSX/CSS code blocks: **40+** complete components / pages / contexts
* Asset count: **24 SVG/PNG files** (3.8 MB)
* Reference screenshots: **15** at 1920 × 1080
* Animations documented: **27 keyframe sets**
* Color tokens: **17**
* Type sizes: **11**
* localStorage keys: **17**
* Supported languages: **48** (UI) + **13** (keyboard layouts)
* API endpoints: **15+**
* Remote-control key codes: **20+** (Samsung + LG)

## Versions

| Version | Date | Notes |
|---|---|---|
| V1 | 2026-04-29 | Initial 768-line draft |
| **V2** | **2026-04-30** | **Full pixel/CSS/code spec + bundled assets + 15 screenshots + verbatim source** |

## Contact

If anything is unclear or contradicts the live web TV implementation, the live web TV implementation **wins** — file a discrepancy report against this document and the source repo.
