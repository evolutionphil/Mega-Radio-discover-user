---

## 11. Genres Page

**Route:** `/genres`  •  **Screenshot:** `screenshots/v2/08-genres.jpg`  •  **Source:** `source-extracts/pages/Genres.tsx`

### 11.1 Layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Page root | 0,0 | 1920 × 1080 | `bg-[#0e0e0e]` |
| Sidebar | 0,0 | 108 × 1080 | active item = "Genres" |
| Title "Popular Genres" | left: 156, top: 56 | auto × 36 | Ubuntu Bold 28 px white |
| Popular Genres grid | left: 156, top: 116 | 1716 × 286 | **4-col grid**, 2 rows, 8 cards |
| Genre card | — | **402 × 139** | gap 36 px H, 36 px V; bg `#1f2024`, rounded 14 px |
| Title "All Genres" | left: 156, top: 442 | auto × 36 | Ubuntu Bold 28 px white |
| All Genres grid | left: 156, top: 502 | 1716 × auto | **4-col grid**, infinite rows, scrollable |
| Genre card (All) | — | **402 × 139** | identical to Popular |

### 11.2 Genre card content

```
+------------------------------------+
|                                    |
|  Pop                               |  ← Ubuntu Medium 24 px white
|  124 stations                      |  ← Ubuntu Light 16 px rgba(255,255,255,0.55)
|                                    |
+------------------------------------+
```

**Padding:** 24 px left, 28 px top. Text left-aligned. No icon.

### 11.3 Spatial navigation (custom 4-col arithmetic)

```ts
usePageKeyHandler('/genres', (e) => {
  const cols = 4;
  switch (e.key) {
    case 'ArrowLeft':
      if (col > 0) col--; else focusSidebar();
      break;
    case 'ArrowRight':
      if (col < cols - 1 && (idx + 1) < items.length) col++;
      break;
    case 'ArrowUp':
      // Move ONE ROW up (= -4 items). If at top of "All Genres", jump to last row of "Popular".
      idx = Math.max(0, idx - cols);
      break;
    case 'ArrowDown':
      // Move ONE ROW down (= +4 items). Clamp to last item.
      idx = Math.min(items.length - 1, idx + cols);
      break;
    case 'Enter':
      setLocation(`/genre-list/${slug(items[idx].name)}`);
      break;
  }
});
```

**Critical native rule:** UP/DOWN must move **exactly one row** (4 items), not 1 item. LEFT/RIGHT must move **exactly one item**, not switch rows. Do not use a generic 2D spatial navigator that "snaps to nearest neighbour".

### 11.4 All Genres scroll

Auto-scroll the page content area when the focused card moves below the viewport. The scroll target is `cardTop - 100 px` so there's always 100 px of breathing room above the focused item.

---

## 12. GenreList Page (single genre's stations)

**Route:** `/genre-list/:genre?`  •  **Screenshots:** `09-genre-list-pop.jpg`, `10-genre-list-rock.jpg`  •  **Source:** `source-extracts/pages/GenreList.tsx`

### 12.1 Layout

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Genres" |
| Page title (genre name) | left: 156, top: 56 | auto × 36 | Ubuntu Bold 36 px white. Capitalized. e.g. "Pop", "Rock" |
| Subtitle "<n> stations" | left: 156, top: 104 | auto × 24 | Ubuntu Light 18 px `rgba(255,255,255,0.55)` |
| Station grid | left: 156, top: 156 | 1716 × auto | **7-col grid**, infinite rows |
| Station card (in grid) | — | **228 × 240** | 200×200 art, 4 px gap, 36 px metadata strip; gap 12 px between cards |

### 12.2 Pagination

* **Batch size:** **28 stations** = 4 rows × 7 columns
* **Trigger:** load next batch when scroll position is within **600 px** of bottom
* **Cache:** each (offset) page is its own TanStack Query cache key so revisits are instant

### 12.3 Spatial navigation (custom 7-col arithmetic, with **incomplete-row clamp**)

```ts
usePageKeyHandler('/genre-list', (e) => {
  const cols = 7;
  const total = stations.length;
  const lastRowStart = Math.floor((total - 1) / cols) * cols;
  const lastRowSize  = total - lastRowStart;     // 1..7

  switch (e.key) {
    case 'ArrowLeft':
      if (idx % cols > 0) idx--; else focusSidebar();
      break;
    case 'ArrowRight':
      if (idx % cols < cols - 1 && idx + 1 < total) idx++;
      break;
    case 'ArrowUp':
      if (idx >= cols) idx -= cols;
      break;
    case 'ArrowDown': {
      const targetIdx = idx + cols;
      if (targetIdx < total) {
        idx = targetIdx;
      } else {
        // Last row may have fewer than 7 items; clamp to last available item in that column,
        // OR jump to last item if current column is past last row's filled cells.
        const targetCol = idx % cols;
        const candidate = lastRowStart + targetCol;
        idx = candidate < total ? candidate : total - 1;
      }
      break;
    }
    case 'Enter':
      navigationContext.saveSnapshot('/genre-list', { idx });
      globalPlayer.play(stations[idx]);
      setLocation('/radio-playing');
      break;
  }
});
```

> **The clamp rule** prevents the user from getting "stuck" or having focus disappear when DOWN is pressed on a row whose target column is missing in the next row.

### 12.4 Empty state

* **Trigger:** API returns 0 stations for the genre.
* **Layout:** centered text "No stations available" Ubuntu Medium 24 px `rgba(255,255,255,0.55)` at center of content area.

---

## 13. Search Page

**Route:** `/search`  •  **Screenshot:** `screenshots/v2/11-search-empty.jpg`  •  **Source:** `source-extracts/pages/Search.tsx`

### 13.1 Layout (1920 × 1080)

| Element | Position | Size | Notes |
|---|---|---|---|
| Sidebar | 0,0 | 108 × 1080 | active = "Search" |
| Title "Search" | left: 156, top: 56 | auto × 48 | Ubuntu Bold 36 px white |
| **Search input** | left: 156, top: 116 | **800 × 88** | `id="search-value"`, see §13.2 |
| Search results grid | left: 156, top: 240 | 800 × auto | 1-col list of station-list rows (700 × 96 each), gap 12 px |
| **Recent searches** (when query empty) | left: 156, top: 240 | 800 × auto | List of last 10 queries |
| **Virtual keyboard** | right: 60, top: 116 | 1000 × 480 | see §14 |
| Language dropdown | right: 60, top: 620 | 1000 × 80 | see §13.3 |
| Footer hint bar | bottom: 24 | full width | RED back / GREEN OK / BLUE clear hints |

### 13.2 Search input

* **Size:** 800 × 88 (height includes 24 px vertical padding)
* **Background:** `rgba(255,255,255,0.05)`
* **Border:** `2px solid rgba(255,255,255,0.10)` default, `2px solid #01d7fb` when focused
* **Border radius:** `rounded-[16px]`
* **Padding:** `padding: 0 28px`
* **Font:** Ubuntu Regular 32 px white; placeholder `rgba(255,255,255,0.40)`
* **Focused glow:** `box-shadow: 0 6px 25px rgba(1,215,251,0.30)` + gradient bg overlay (see §3.6)
* **Caret:** hidden (`caret-color: transparent`); a custom blinking pink underscore character is appended to the visible text instead
* **Behaviour:** purely controlled — keyboard taps append/remove characters; the user never types directly into the input

### 13.3 Language dropdown

* **Size:** 1000 × 80
* **Default appearance:** transparent bg, `2px solid rgba(255,255,255,0.10)`, `rounded-[14px]`
* **Focused appearance:** `bg-[rgba(255,65,153,0.10)]`, `border-[#ff4199]`, `box-shadow: 0 0 20px rgba(255,65,153,0.5)`
* **Content:** flag emoji (left) + language name (Ubuntu Medium 22 px) + Lucide `ChevronDown` icon (right)
* **Open state:** drops down a 1000 × 480 list of 13 languages (en, tr, ar, ru, de, fr, es, ja, zh, ko, el, hi, th); each row 60 px tall
* **Selected language** has pink left bar `4 × 60 #ff4199` and pink text

### 13.4 Spatial navigation (focus zones)

```
zones = ['list', 'keyboard', 'langDropdown']
```

* **`list`:** the search results / recent searches column (left).
* **`keyboard`:** the on-screen keyboard cells.
* **`langDropdown`:** the language switcher.

Movement rules:
* From `list`, RIGHT → `keyboard` (focus first key, top-left).
* From `keyboard` left-edge column, LEFT → `list` (focus first result row).
* From `keyboard` bottom row, DOWN → `langDropdown`.
* From `langDropdown`, UP → `keyboard` bottom row.
* From `list` left-edge, LEFT → sidebar.

### 13.5 Search submission

* On every keystroke, debounce 300 ms then call `megaRadioApi.searchStations({ q, limit: 30 })`.
* Cache key: `['/api/search', q]`, stale-time **24 h** (see §22 Caching).
* Empty `q` shows "Recent searches" list from `localStorage['recentSearches']` (max 10 items, FIFO).

### 13.6 Recent searches list row

* **Size:** 800 × 64
* **Bg:** transparent → `rgba(255,255,255,0.04)` on focus → pink ring on focus
* **Content:** Lucide `Clock` 20 px `rgba(255,255,255,0.40)` + query text Ubuntu Medium 22 px white
* **OK** → loads search query
* **Long-press OK** (or YELLOW) → removes from recent searches

---

## 14. Virtual Keyboard

**Used in:** Search page, CountrySelect page  •  **Languages:** 13

### 14.1 Layout (within parent page)

* **Container size:** 1000 × 480
* **Cell size:** **88 × 88**
* **Grid:** depending on language, 10 or 11 columns × 4-5 rows, gap **12 px**
* **Cell radius:** `rounded-[12px]`
* **Cell default bg:** `rgba(255,255,255,0.05)`
* **Cell default border:** `1px solid rgba(255,255,255,0.10)`
* **Cell focused:** `bg-[rgba(255,65,153,0.20)]`, `border-2 border-[#ff4199]`, scale 1.08, glow `0 0 20px rgba(255,65,153,0.6)`
* **Cell text:** Ubuntu Medium **32 px** white, centered
* **Special cells (Backspace, Space, Shift, Enter, Clear, ABC/123 toggle):** wider than 88 px (Space = 88 × 4 + 12 × 3 = 388 px; Backspace = 184 px = 2 cells; Shift = 184 px; Enter = 184 px), labeled with Lucide icons (Delete, ArrowUp, CornerDownLeft) or text "Space" / "Clear"

### 14.2 Layouts (verbatim character map per language)

> Source: `tv-app/src/components/VirtualKeyboard.tsx` (or its inline equivalent in pages). Each layout is an array of rows; each row is an array of cell labels. A label of `null` is a gap.

```ts
const LAYOUTS = {
  en: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  tr: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','ı','o','p','ğ','ü'],
    ['a','s','d','f','g','h','j','k','l','ş','i'],
    ['z','x','c','v','b','n','m','ö','ç','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ar: [
    ['١','٢','٣','٤','٥','٦','٧','٨','٩','٠'],
    ['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج'],
    ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
    ['ئ','ء','ؤ','ر','ﻻ','ى','ة','و','ز','ظ'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ru: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
    ['ф','ы','в','а','п','р','о','л','д','ж','э'],
    ['я','ч','с','м','и','т','ь','б','ю','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  de: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','z','u','i','o','p','ü'],
    ['a','s','d','f','g','h','j','k','l','ö','ä'],
    ['y','x','c','v','b','n','m','ß','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  fr: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['a','z','e','r','t','y','u','i','o','p'],
    ['q','s','d','f','g','h','j','k','l','m'],
    ['w','x','c','v','b','n','é','è','ç','à'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  es: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l','ñ'],
    ['z','x','c','v','b','n','m','¿','¡','.'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  ja: [
    ['あ','い','う','え','お','か','き','く','け','こ'],
    ['さ','し','す','せ','そ','た','ち','つ','て','と'],
    ['な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'],
    ['ま','み','む','め','も','や','ゆ','よ','わ','ん'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  zh: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],  // Pinyin input — IME composition handled by typing buffer
  ko: [
    ['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],
    ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ',';'],
    ['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  el: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['ς','ε','ρ','τ','υ','θ','ι','ο','π','{'],
    ['α','σ','δ','φ','γ','η','ξ','κ','λ','¨'],
    ['ζ','χ','ψ','ω','β','ν','μ',',','.','?'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  hi: [
    ['१','२','३','४','५','६','७','८','९','०'],
    ['क','ख','ग','घ','च','छ','ज','झ','ट','ठ'],
    ['ड','ढ','त','थ','द','ध','न','प','फ','ब'],
    ['भ','म','य','र','ल','व','श','स','ह','ं'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
  th: [
    ['๑','๒','๓','๔','๕','๖','๗','๘','๙','๐'],
    ['ๅ','/','-','ภ','ถ','ุ','ึ','ค','ต','จ','ข','ช'],
    ['ๆ','ไ','ำ','พ','ะ','ั','ี','ร','น','ย','บ','ล'],
    ['ฟ','ห','ก','ด','เ','้','่','า','ส','ว','ง'],
    ['SHIFT','ABC','SPACE','BACKSPACE','ENTER'],
  ],
};
```

> **Implementation note:** when SHIFT is engaged, English layout swaps numbers row to symbols (`!@#$%^&*()`) and letters become uppercase. Other layouts: SHIFT toggles to a punctuation set; ABC toggles to a symbols layer.

### 14.3 Cell key codes (focus-arithmetic only)

Cell index = `row * cols + col`. Movement:
* LEFT: `col--` (clamp 0)
* RIGHT: `col++` (clamp `cols-1`)
* UP: `row--` (clamp 0)
* DOWN: `row++` (clamp `rows-1`)
* Special cells span multiple columns — treat as a single focusable item; LEFT from a wide cell jumps to the previous narrow cell.

### 14.4 OK on a special cell

* **SHIFT:** toggles `isShifted` state, re-renders cell labels.
* **ABC / 123:** toggles `layerIndex` between letter-layer and symbol-layer.
* **SPACE:** appends ` ` to query.
* **BACKSPACE:** removes last character.
* **ENTER:** triggers `onSubmit(query)` (kept for future, currently no-op since search runs on every keystroke).

### 14.5 Verbatim TSX (key cell render — abbreviated)

```tsx
function KeyCell({ label, focused, onPress, wideUnits = 1 }: KeyCellProps) {
  const w = 88 * wideUnits + 12 * (wideUnits - 1);
  return (
    <button
      tabIndex={0}
      onClick={onPress}
      style={{ width: w, height: 88 }}
      className={`
        rounded-[12px] flex items-center justify-center
        font-['Ubuntu',Helvetica] font-medium text-[32px] text-white
        transition-all duration-150 outline-none
        ${focused
          ? 'bg-[rgba(255,65,153,0.20)] border-2 border-[#ff4199] scale-[1.08] z-10 shadow-[0_0_20px_rgba(255,65,153,0.6)]'
          : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)]'}
      `}
    >
      {label}
    </button>
  );
}
```
