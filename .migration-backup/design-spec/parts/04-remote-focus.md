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
