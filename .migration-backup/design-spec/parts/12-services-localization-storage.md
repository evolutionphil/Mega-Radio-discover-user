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
