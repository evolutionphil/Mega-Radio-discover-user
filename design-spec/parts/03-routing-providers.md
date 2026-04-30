---

## 4. Application Shell, Provider Tree, Routing

### 4.1 Provider hierarchy (verbatim from `tv-app/src/App.tsx`)

The order matters — outer providers must initialize before inner providers can read their state. On native, replicate the dependency graph (you may collapse them into a single store, but be mindful of init order).

```tsx
function App() {
  return (
    <AccessibilityProvider>           {/* highContrast / largeText flags */}
      <HelpProvider>                  {/* helpOpen flag (global help modal) */}
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider>      {/* current language + t() */}
            <NetworkStatusProvider>   {/* online/offline + modal trigger */}
              <CountryProvider>       {/* selectedCountry / setCountry */}
                <AuthProvider>        {/* TV login (device-code flow) */}
                  <FavoritesProvider> {/* favorites list (server + local merge) */}
                    <NavigationProvider> {/* back-stack with focus snapshots */}
                      <GlobalPlayerProvider>  {/* central audio player */}
                        <CastProvider>        {/* cast polling (3s) */}
                          <SleepTimerProvider>{/* 15/30/60/120 min */}
                            <AppLifecycleProvider> {/* Tizen app suspend/resume */}
                              <FocusRouterProvider> {/* per-route key handlers */}
                                <TooltipProvider>
                                  <Toaster />
                                  <Router />
                                </TooltipProvider>
                              </FocusRouterProvider>
                            </AppLifecycleProvider>
                          </SleepTimerProvider>
                        </CastProvider>
                      </GlobalPlayerProvider>
                    </NavigationProvider>
                  </FavoritesProvider>
                </AuthProvider>
              </CountryProvider>
            </NetworkStatusProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </HelpProvider>
    </AccessibilityProvider>
  );
}
```

### 4.2 Routing table

The web app uses **hash-based** routing (`#/path`) for compatibility with file:// loading on Tizen. On native, treat each route as a navigation destination identifier.

| Route | Component | Notes |
|---|---|---|
| `/` | `Splash` | Shown for 1500ms then redirects (`/guide-1` first run, `/discover-no-user` thereafter) |
| `/login` | `Login` | Netflix-style 6-digit pairing |
| `/guide-1` | `Guide1` | Onboarding step 1 (RED button → Discover) |
| `/guide-2` | `Guide2` | Onboarding step 2 (GREEN → Genres) |
| `/guide-3` | `Guide3` | Onboarding step 3 (BLUE → Search) |
| `/guide-4` | `Guide4` | Onboarding step 4 (YELLOW → Favorites) |
| `/discover-no-user` | `DiscoverNoUser` | Home (the canonical home in the shipped app) |
| `/radio-playing` | `RadioPlaying` | Full-screen playback + ambient mode |
| `/genres` | `Genres` | Popular Genres + All Genres grid |
| `/genre-list/:genre?` | `GenreList` | Stations in a genre |
| `/search` | `Search` | Virtual keyboard + results |
| `/favorites` | `Favorites` | Favorite stations grid |
| `/settings` | `Settings` | 7-category settings surface |
| `/country-select` | `CountrySelectPage` | Country picker (page mode, sidebar visible) |
| `/screensaver-test` | `ScreensaverTest` | QA-only (do not include in shipping native builds) |
| (fallback) | `NotFound` | 404 page |

### 4.3 First-run logic (Splash redirect)

```ts
useEffect(() => {
  if (!isReady) return;
  try {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      setLocation('/discover-no-user');
      return;
    }
  } catch (_) {}
  const timer = setTimeout(() => setLocation('/guide-1'), 1500);
  return () => clearTimeout(timer);
}, [isReady, setLocation]);
```

**LocalStorage key:** `onboardingCompleted` (string `"true"` after Guide-4 is dismissed).

### 4.4 Page root container convention

Every page mounts as:
```html
<div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden bg-[#0e0e0e]" data-testid="page-...">
```
i.e. a fixed 1920 × 1080 canvas anchored to the viewport top-left, with `overflow: hidden`. Native equivalent: a single root container of those exact dimensions (use `absolute` / `fixed` positioning of children; do NOT use auto-layout / Stack for the page root).

### 4.5 Hash router → spatial focus dispatcher

The hash route is read by `FocusRouterContext.dispatch` to route a remote-control key event to the correct page handler. Implementations on native should expose an equivalent `RegisterPageKeyHandler(route, handler)` API.

```ts
// FocusRouterContext.tsx (verbatim)
const dispatch = (e: KeyboardEvent) => {
  const hash = window.location.hash;
  let currentRoute = hash.replace('#', '') || '/';
  if (currentRoute === '/' || currentRoute === '/index.html' || currentRoute === '') {
    currentRoute = '/guide-1';
  }
  const routeWithoutQuery = currentRoute.split('?')[0];
  let handler = handlersRef.current.get(routeWithoutQuery);
  if (!handler) {
    // Fallback: walk up the path segments to find a registered base path
    const pathParts = routeWithoutQuery.split('/').filter(p => p);
    for (let i = pathParts.length; i > 0; i--) {
      const basePath = '/' + pathParts.slice(0, i).join('/');
      if (handlersRef.current.has(basePath)) {
        handler = handlersRef.current.get(basePath);
        break;
      }
    }
  }
  if (handler) handler(e);
};
```
