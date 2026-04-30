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
