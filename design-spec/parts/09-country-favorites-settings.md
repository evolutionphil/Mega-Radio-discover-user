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
