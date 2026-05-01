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
