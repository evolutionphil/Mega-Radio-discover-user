---

## 6. Sidebar (Persistent Left Navigation)

### 6.1 Visual specification

* **Width:** 108 px (the left edge of every page reserves this column)
* **Height:** 1080 px (full screen)
* **Background:** transparent on top of page background `#0e0e0e` (no fill)
* **Position:** `absolute; left: 0; top: 0`
* **Z-order:** `z-40` (always above page content, below modals)

### 6.2 Sidebar header (brand "M")

* **Position:** `top: 36 px; left: 36 px`
* **Size:** 32 × 32 px container; SVG fits at 32 × 32 (with 0 padding)
* **Asset:** `assets/logos/path-8.svg` (pink #FF4199)
* **Animation:** none

### 6.3 Sidebar item tile

* **Tile size:** 90 × 90 px
* **Tile pitch (vertical step):** 108 px (so tiles sit at top values 156, 264, 372, 480, 588, 696, 804)
* **Tile horizontal position:** `left: 9 px` (so the tile is centered in the 108-px-wide sidebar with 9px each side)
* **Border radius:** `rounded-[10px]`
* **Default appearance:** transparent background, no border
* **Focused appearance:**
  * Background: `rgba(255, 65, 153, 0.30)` (30% pink fill)
  * Border: `2px solid #ff4199`
  * Glow: `box-shadow: 0 0 20px rgba(255,65,153,0.6)`
  * Scale: `1.05`
  * Pulse: continuous `pulse-glow` 1.5s infinite (defined in §3.5)
* **Active (current-page) appearance** (even when not focused):
  * Background: `rgba(255, 65, 153, 0.12)` (12% pink fill)
  * No border / no glow

### 6.4 Sidebar item icon

* **Icon size:** 32 × 32 px (centered in the 90×90 tile, so icon top = tile top + 29, icon left = tile left + 29)
* **Icon fill:** `#ffffff` (white) when not focused/active; pink `#ff4199` when active *or* focused

### 6.5 Sidebar item label

* **Position:** below the icon, **inside** the tile (vertical center of icon at tile-center -8, label at tile-center +18). Specifically: `top: tile_top + 60 px`
* **Font:** Ubuntu Medium (500), `text-[14px]`, `leading-[normal]`
* **Color:** `#ffffff` when not focused; `#ff4199` when active or focused
* **Alignment:** centered horizontally within the tile

### 6.6 Sidebar items (in order)

| Index | Icon asset | Label key (i18n) | Default English | Route |
|---|---|---|---|---|
| 0 | `radio-icon.svg` | `sidebar.discover` | "Discover" | `/discover-no-user` |
| 1 | `music-icon.svg` | `sidebar.genres` | "Genres" | `/genres` |
| 2 | `search-icon.svg` | `sidebar.search` | "Search" | `/search` |
| 3 | `heart-icon.svg` | `sidebar.favorites` | "Favorites" | `/favorites` |
| 4 | (Lucide `Globe` 24px) or `globe-icon.svg` | `sidebar.country` | "Country" | `/country-select` |
| 5 | `settings-icon.svg` | `sidebar.settings` | "Settings" | `/settings` |

> **Note:** there are **6** sidebar items. The historical "Login" tile was removed; login is now reachable from Settings → Account.

### 6.7 Tile vertical layout (top values)

| Index | Tile `top` (px) |
|---|---|
| 0 — Discover | 156 |
| 1 — Genres | 264 |
| 2 — Search | 372 |
| 3 — Favorites | 480 |
| 4 — Country | 588 |
| 5 — Settings | 696 |

Total icon column height: `156 + 6 × 108 = 804 px`. Bottom padding to player bar: 276 px.

### 6.8 Focus / activation behaviour

* Sidebar focus is owned by the page-level `useFocusManager`. Pressing **RIGHT** at any sidebar tile transfers focus to the page content. Pressing **UP/DOWN** on the sidebar moves between tiles (clamped at 0..5).
* Pressing **OK** (Enter / 13) on a tile navigates to its route via `setLocation(route)`.
* The currently active route is highlighted with the "Active" appearance (12% pink) regardless of focus.

### 6.9 Verbatim TSX (`tv-app/src/components/Sidebar.tsx`)

```tsx
import { useLocation } from 'wouter';
import { Globe, Settings as SettingsIcon } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

const ICONS = {
  discover:  '/images/radio-icon.svg',
  genres:    '/images/music-icon.svg',
  search:    '/images/search-icon.svg',
  favorites: '/images/heart-icon.svg',
};

interface SidebarProps {
  focusedIndex: number | null;          // null => focus is in page content
  setFocusedIndex: (i: number) => void;
}

export default function Sidebar({ focusedIndex, setFocusedIndex }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { t } = useLocalization();

  const items = [
    { route: '/discover-no-user', label: t('sidebar.discover'),  icon: ICONS.discover },
    { route: '/genres',           label: t('sidebar.genres'),    icon: ICONS.genres },
    { route: '/search',           label: t('sidebar.search'),    icon: ICONS.search },
    { route: '/favorites',        label: t('sidebar.favorites'), icon: ICONS.favorites },
    { route: '/country-select',   label: t('sidebar.country'),   lucide: Globe },
    { route: '/settings',         label: t('sidebar.settings'),  lucide: SettingsIcon },
  ];

  return (
    <aside
      className="absolute left-0 top-0 w-[108px] h-[1080px] z-40"
      data-testid="sidebar"
    >
      {/* Brand "M" mark */}
      <img
        src="/images/path-8.svg"
        alt="Radio Mega"
        className="absolute left-[36px] top-[36px] w-[32px] h-[32px]"
      />

      {items.map((item, i) => {
        const focused = focusedIndex === i;
        const active  = location.startsWith(item.route);
        const top = 156 + i * 108;
        const Icon = item.lucide;
        return (
          <button
            key={item.route}
            tabIndex={0}
            onFocus={() => setFocusedIndex(i)}
            onClick={() => setLocation(item.route)}
            data-testid={`sidebar-${item.route.replace(/\W+/g,'')}`}
            className={`
              absolute left-[9px] w-[90px] h-[90px] rounded-[10px]
              flex flex-col items-center justify-center
              transition-all duration-150 outline-none
              ${focused
                ? 'bg-[rgba(255,65,153,0.30)] border-2 border-[#ff4199] scale-105 z-10 shadow-[0_0_20px_rgba(255,65,153,0.6)]'
                : active
                  ? 'bg-[rgba(255,65,153,0.12)]'
                  : 'bg-transparent'}
            `}
            style={{ top: `${top}px` }}
          >
            {Icon
              ? <Icon size={24} color={focused || active ? '#ff4199' : '#ffffff'} />
              : <img src={item.icon} alt="" className="w-[32px] h-[32px]" />}
            <span
              className={`
                font-['Ubuntu',Helvetica] font-medium text-[14px] leading-[normal] mt-1
                ${focused || active ? 'text-[#ff4199]' : 'text-white'}
              `}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
```

### 6.10 Native equivalents (suggested)

* **Apple TV (SwiftUI):** Use a `VStack` with fixed-frame items inside a `ZStack` that overlays the page. Use `.focusable()` and bind the focus ring style via `.focused($field, equals:)`. Manage cross-component focus with `@FocusState`.
* **Android TV Compose:** A `Column` of `Box` components with `Modifier.focusRequester().focusable()`. Use `LocalFocusManager` to move focus from sidebar to page on RIGHT press.
* **Windows WinUI 3:** A `Grid` with `RowDefinitions` of fixed 108-pt height. Each item is a `Button` with custom `Style` defining the focus visuals.
