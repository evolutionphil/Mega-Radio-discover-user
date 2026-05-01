---

## 7. Splash Screen

**Route:** `/`  •  **Screenshot:** `screenshots/v2/01-splash.jpg`  •  **Source:** `source-extracts/pages/Splash.tsx`

### 7.1 Layout (1920 × 1080)

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | absolute 0,0 | 1920 × 1080 | `bg-[#0e0e0e]` |
| Background ellipse | center | 1024 × 1024 (blurred) | `assets/icons/ellipse2.svg`, opacity ~0.3, blur 80 px |
| Frame445 deco | bottom-center | 720 × 720 | `assets/backgrounds/frame445.png`, opacity 0.6 |
| Brand "M" mark | center-x, top: 320 | 113 × 109 | `assets/logos/path-8.svg`, **no animation** (static) |
| Wordmark "megaradio.live" | center-x, top: 470 | auto × 64 | Ubuntu **Bold 53.108 px**, color `#ffffff`. Letter-spacing 0. |
| Subtitle "Listen freely" | center-x, top: 540 | auto × 24 | Ubuntu Light **300**, **20 px**, color `rgba(255,255,255,0.55)` |
| Device row (monitor + tablet + phone) | center-x, top: 620 | 480 × 96 | gap 60 px between icons; each icon 96 × 96 px; opacity 0.55 |
| Device labels ("TV — Tablet — Mobile") | below icons, top: 736 | auto × 18 | Ubuntu Medium 500, 18 px, color `rgba(255,255,255,0.55)` |
| Waves | bottom: 0 | 1920 × 138 | `assets/icons/waves.svg`, full width, opacity 0.7 |

### 7.2 Behaviour

```ts
useEffect(() => {
  if (!isReady) return;
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  if (onboardingCompleted) {
    setLocation('/discover-no-user');
    return;
  }
  const timer = setTimeout(() => setLocation('/guide-1'), 1500);
  return () => clearTimeout(timer);
}, [isReady, setLocation]);
```

* **Total visible time on first run:** 1500 ms.
* **Total visible time on subsequent runs:** as fast as `isReady` resolves (typically <200 ms).
* **Animations:** none — purely static composition.

### 7.3 Native notes

* The "device row" graphic (TV / Tablet / Mobile) is a **brand cue** and should be kept verbatim. On platforms where the splash screen is hard-coded by the OS (Apple TV launch image), implement the splash as the *first* in-app view and let the OS launch image show the bare brand "M" only.
* No focus ring is shown anywhere on the splash; the page is non-interactive.

---

## 8. Onboarding Guides 1-4

**Routes:** `/guide-1`, `/guide-2`, `/guide-3`, `/guide-4`
**Screenshots:** `screenshots/v2/02-guide-1.jpg` … `05-guide-4.jpg`
**Source:** `source-extracts/pages/Guide1.tsx` … `Guide4.tsx`

### 8.1 Shared layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | `overflow:hidden` |
| Background image | inset-0 | 1920 × 1080 | `assets/backgrounds/discover-background.png`, `object-cover`, plus `::after` overlay `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)` |
| Sidebar (mocked) | 0,0 | 108 × 1080 | Renders the **real** Sidebar component with the **target** tile pre-focused (e.g. on `/guide-1`, the "Discover" tile is shown with focus visuals to teach the user where they will land) |
| Color-button hint | sidebar tile RIGHT | aligns with target tile's vertical center | Pill 200 × 56 px with rounded-full, background = current color (RED #e74c3c, GREEN #27ae60, BLUE #3498db, YELLOW #f1c40f), Ubuntu Bold 22 px white text reading the color name in current language |
| Pointer arrow | between hint pill and target tile | 40 × 96 | `assets/icons/arrow.svg`, animated with `pulse-soft` 2s infinite |
| Title (top of explanation card) | left: 540, top: 380 | auto × 56 | Ubuntu Bold **44 px**, color `#ffffff` |
| Body text | left: 540, top: 460 | 800 × auto (max 4 lines) | Ubuntu Regular **24 px**, color `rgba(255,255,255,0.75)`, line-height 1.5 |
| "Next" hint (bottom-center) | center-x, bottom: 80 | auto × 32 | Ubuntu Medium 18 px, `rgba(255,255,255,0.55)` text "OK ▶ Next" |
| "Skip" hint | bottom-right, right: 60, bottom: 80 | auto × 32 | Ubuntu Medium 18 px, `rgba(255,255,255,0.55)` "RETURN ▶ Skip onboarding" |

### 8.2 Per-guide content

| Guide | Color | Color hex | Hint pill text | Title | Body |
|---|---|---|---|---|---|
| /guide-1 | RED | `#e74c3c` | "RED" | "Discover Radios" | "Press the **RED** button on your remote to open the Discover page and browse popular stations from around the world." |
| /guide-2 | GREEN | `#27ae60` | "GREEN" | "Browse Genres" | "Press the **GREEN** button to see all music genres and pick what you feel like listening to." |
| /guide-3 | BLUE | `#3498db` | "BLUE" | "Search Stations" | "Press the **BLUE** button to open the on-screen keyboard and search for any station by name." |
| /guide-4 | YELLOW | `#f1c40f` | "YELLOW" | "Your Favorites" | "Press the **YELLOW** button to view all stations you have marked as favorites. Press OK on a station to play." |

### 8.3 Behaviour

```ts
// Each guide registers a key handler
usePageKeyHandler(`/guide-${n}`, (e) => {
  if (e.keyCode === 13) {                       // OK → next guide / finish
    if (n < 4) setLocation(`/guide-${n+1}`);
    else { localStorage.setItem('onboardingCompleted', 'true'); setLocation('/discover-no-user'); }
  }
  if (e.keyCode === 10009 || e.keyCode === 461) { // RETURN → skip onboarding
    localStorage.setItem('onboardingCompleted', 'true');
    setLocation('/discover-no-user');
  }
  if (e.keyCode === 403 + (n-1)) {              // Color button matching this guide → advance
    if (n < 4) setLocation(`/guide-${n+1}`);
    else { localStorage.setItem('onboardingCompleted', 'true'); setLocation('/discover-no-user'); }
  }
});
```

> The exact key code per guide is RED=403 (guide-1), GREEN=404 (guide-2), BLUE=406 (guide-3), YELLOW=405 (guide-4). Note: BLUE is 406 (not 405) — guide-3's body / pill must use `#3498db`.

### 8.4 Verbatim TSX (Guide1 example)

```tsx
export default function Guide1() {
  const { t } = useLocalization();
  const [, setLocation] = useLocation();

  usePageKeyHandler('/guide-1', (e) => {
    if (e.keyCode === 13 || e.keyCode === 403) setLocation('/guide-2');
    if (e.keyCode === 10009 || e.keyCode === 461) {
      localStorage.setItem('onboardingCompleted', 'true');
      setLocation('/discover-no-user');
    }
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden bg-[#0e0e0e]">
      <img src="/images/discover-background.png"
           className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0
                      bg-gradient-to-b from-[rgba(0,0,0,0.55)] to-[rgba(0,0,0,0.85)]" />

      <Sidebar focusedIndex={0} setFocusedIndex={() => {}} />

      {/* Hint pill */}
      <div className="absolute left-[136px] top-[170px]
                      bg-[#e74c3c] rounded-full
                      px-6 py-2 text-white font-['Ubuntu',Helvetica] font-bold text-[22px]">
        {t('color.red')}
      </div>
      <img src="/images/arrow.svg"
           className="absolute left-[110px] top-[176px] w-[40px] h-[40px] animate-pulse-soft" />

      {/* Explanation card */}
      <h1 className="absolute left-[540px] top-[380px]
                     font-['Ubuntu',Helvetica] font-bold text-[44px] text-white">
        {t('guide1.title')}
      </h1>
      <p className="absolute left-[540px] top-[460px] w-[800px]
                    font-['Ubuntu',Helvetica] font-normal text-[24px]
                    text-[rgba(255,255,255,0.75)] leading-relaxed">
        {t('guide1.body')}
      </p>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[80px]
                      font-['Ubuntu',Helvetica] font-medium text-[18px]
                      text-[rgba(255,255,255,0.55)]">
        OK ▶ {t('common.next')}
      </div>
      <div className="absolute right-[60px] bottom-[80px]
                      font-['Ubuntu',Helvetica] font-medium text-[18px]
                      text-[rgba(255,255,255,0.55)]">
        RETURN ▶ {t('common.skip')}
      </div>
    </div>
  );
}
```

(Guide2/Guide3/Guide4 are identical structurally with different texts, colors and pill positions corresponding to sidebar tile indexes 1, 2, 3 respectively.)
