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
