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
