---

## 3. Design-System Layer (verbatim CSS)

### 3.1 Tailwind config (`tv-app/tailwind.config.cjs`)

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary:     { DEFAULT: "hsl(var(--primary))",     foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))",     foreground: "hsl(var(--popover-foreground))" },
        card:        { DEFAULT: "hsl(var(--card))",        foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["ui-sans-serif","system-ui","sans-serif",
               "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};
```

> Note for native re-implementations: the Tailwind utilities (`text-[24px]`, `bg-[#ff4199]`, `rounded-[10px]`, etc.) are arbitrary values — there is no design-token table to map. Re-implement each value literally as documented.

### 3.2 CSS root variables (`tv-app/src/index.css`)

The shadcn-style HSL-as-string variables are defined in `:root` and overridden in `.dark` and `.high-contrast`. Only the **values used at runtime** matter; the dark theme is the only theme actually applied to the TV app (`<html class="dark">`).

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --primary: 207 90% 54%;
    --primary-foreground: 211 100% 99%;
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --ring: 20 14.3% 4.1%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --primary: 207 90% 54%;
    --primary-foreground: 211 100% 99%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --ring: 240 4.9% 83.9%;
    --radius: 0.5rem;
  }
}
```

### 3.3 Accessibility CSS (high-contrast + large-text modes)

`AccessibilityContext` toggles two `<html>` classes — `.high-contrast` and `.large-text`. Implementations must mirror these effects.

```css
.high-contrast {
  --hc-text:    rgba(255,255,255,1) !important;
  --hc-subtext: rgba(255,255,255,0.95) !important;
}
/* Implementation note: high-contrast forces white text + 95% opacity for sub-text on
   every surface, removes translucent overlays. */

.large-text { font-size: 115%; }   /* 15% type-scale increase, applied to <html> root. */
```

`AccessibilityContext` exposes:
* `highContrast: boolean`
* `largeText: boolean`
* `toggleHighContrast()`, `toggleLargeText()`

LocalStorage keys: `highContrast`, `largeText`. Both are boolean strings.

### 3.4 All `@keyframes` animations (verbatim, in render order)

> Re-implement each animation with the **exact** duration, easing and infinite-cycle behaviour. On native platforms, animations run in the GPU compositor (CALayer/CoreAnimation, Compose `animateAsState`, or WPF storyboards) — keep them off the main thread.

```css
/* Generic spinner */
@keyframes spin { to { transform: rotate(1turn); } }
.animate-spin { animation: spin 1s linear infinite; }

/* Fade-in (cards, popovers) */
@keyframes fade-in {
  0%   { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 1s ease forwards; animation-delay: var(--animation-delay, 0s); }

/* Fade-up (modal entry, list reveal) */
@keyframes fade-up {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 1s ease forwards; animation-delay: var(--animation-delay, 0s); }

/* Marquee (long station-name horizontal scroll) */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--gap))); }
}
.animate-marquee { animation: marquee var(--duration) linear infinite; }

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--gap))); }
}
.animate-marquee-vertical { animation: marquee-vertical var(--duration) linear infinite; }

/* Shimmer (skeleton loaders) */
@keyframes shimmer {
  0%   { background-position: calc(-1 * var(--shimmer-width)) 0; }
  100% { background-position: calc(100% + var(--shimmer-width)) 0; }
}
.animate-shimmer { animation: shimmer 8s infinite; }

/* In-card 3-bar equalizer (small) — used in station tiles */
@keyframes equalizer-1 {
  0%, 100% { height: 4px; }
  50%      { height: 24px; }
}
.animate-equalizer-1 { animation: equalizer-1 0.8s ease-in-out infinite; }

@keyframes equalizer-2 {
  0%, 100% { height: 8px; }
  50%      { height: 28px; }
}
.animate-equalizer-2 { animation: equalizer-2 0.9s ease-in-out infinite; }

@keyframes equalizer-3 {
  0%, 100% { height: 6px; }
  50%      { height: 20px; }
}
.animate-equalizer-3 { animation: equalizer-3 0.7s ease-in-out infinite; }

/* GlobalPlayer 3-bar equalizer (height + top simultaneously to keep bars bottom-aligned) */
@keyframes equalizer-global-1 {
  0%, 100% { height: 8.882px;  top: 26.644px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-1 { animation: equalizer-global-1 0.8s ease-in-out infinite; }

@keyframes equalizer-global-2 {
  0%, 100% { height: 13.323px; top: 22.203px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-2 { animation: equalizer-global-2 0.9s ease-in-out infinite; }

@keyframes equalizer-global-3 {
  0%, 100% { height: 11.103px; top: 24.423px; }
  50%      { height: 35.526px; top: 0px; }
}
.animate-equalizer-global-3 { animation: equalizer-global-3 0.7s ease-in-out infinite; }

/* Soft pulse for focus glow */
@keyframes pulse-soft {
  0%, 100% { transform: scale(1);    opacity: 0.85; }
  50%      { transform: scale(1.05); opacity: 1; }
}
.animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

/* Screensaver-test page bars */
@keyframes screensaver-equalizer-1 { 0%,100%{height:10px} 50%{height:60px} }
@keyframes screensaver-equalizer-2 { 0%,100%{height:15px} 50%{height:80px} }
@keyframes screensaver-equalizer-3 { 0%,100%{height:8px}  50%{height:50px} }
.animate-screensaver-equalizer-1 { animation: screensaver-equalizer-1 1.5s ease-in-out infinite; }
.animate-screensaver-equalizer-2 { animation: screensaver-equalizer-2 1.8s ease-in-out infinite; }
.animate-screensaver-equalizer-3 { animation: screensaver-equalizer-3 1.6s ease-in-out infinite; }

/* ============================================================
   Ambient Mode (RadioPlaying after 3 minutes idle)
   GPU-only animations: only transform + opacity.
   ============================================================ */

/* Drift orbs */
@keyframes amb-drift-1 {
  0%, 100% { transform: translate(0,0)         scale(1);    opacity: 0.7; }
  50%      { transform: translate(250px,120px) scale(1.15); opacity: 1.0; }
}
@keyframes amb-drift-2 {
  0%, 100% { transform: translate(0,0)           scale(1);    opacity: 0.6; }
  50%      { transform: translate(-200px,180px)  scale(1.10); opacity: 0.9; }
}
@keyframes amb-drift-3 {
  0%, 100% { transform: translate(-50%,-50%)             scale(1);    opacity: 0.65; }
  50%      { transform: translate(calc(-50% + 150px), calc(-50% - 100px)) scale(1.20); opacity: 0.95; }
}
@keyframes amb-drift-4 {
  0%, 100% { transform: translate(0,0)           scale(1);    opacity: 0.55; }
  50%      { transform: translate(-180px,220px)  scale(1.12); opacity: 0.85; }
}
.amb-drift-1 { animation: amb-drift-1 30s ease-in-out infinite; }
.amb-drift-2 { animation: amb-drift-2 38s ease-in-out infinite; }
.amb-drift-3 { animation: amb-drift-3 26s ease-in-out infinite; }
.amb-drift-4 { animation: amb-drift-4 44s ease-in-out infinite; }

/* Central glow breathe */
@keyframes amb-glow-breathe {
  0%, 100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.5; }
  50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.8; }
}
.amb-glow { animation: amb-glow-breathe 6s ease-in-out infinite; }

/* Concentric ring spins (forward and reverse) */
@keyframes amb-ring-spin       { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes amb-ring-spin-rev   { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(-360deg); } }
.amb-ring-1 { animation: amb-ring-spin     90s linear infinite; }
.amb-ring-2 { animation: amb-ring-spin-rev 70s linear infinite; }

/* Now-playing text gentle pulse */
@keyframes amb-text-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
.amb-text-pulse { animation: amb-text-pulse 4s ease-in-out infinite; }

/* Equalizer bars at 66% vertical center (8 bars) */
@keyframes amb-eq-bar { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
/* Each bar uses its own duration: 1.2 + i*0.15 s where i ∈ 0..7. */

/* Ambient overlay fade-in */
@keyframes amb-fadein { 0% { opacity: 0; } 100% { opacity: 1; } }
.amb-fadein { animation: amb-fadein 2s ease-out forwards; }
```

### 3.5 Focus glow (TV-spatial-navigation `.tv-focused`)

This class is the *legacy* TV focus indicator used by the spatial-navigation JS. The newer React focus path uses Tailwind `ring-2 ring-[#ff4199]` (see §5). Both must be supported on native because some elements still rely on `.tv-focused`.

```css
.tv-focused {
  box-shadow:
    inset 0 0 0 4px #ff4199,
    0 0 20px rgba(255, 65, 153, 0.6) !important;
  transition: box-shadow 0.2s ease !important;
  animation: pulse-glow 1.5s ease-in-out infinite !important;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow:
      inset 0 0 0 4px #ff4199,
      0 0 20px rgba(255, 65, 153, 0.6); }
  50%      { box-shadow:
      inset 0 0 0 4px #ff4199,
      0 0 35px rgba(255, 65, 153, 0.9); }
}
```

### 3.6 Search-input focus glow (cyan)

```css
#search-value:focus {
  border-color: #01d7fb;
  box-shadow: 0 6px 25px rgba(1,215,251,0.30);
  background: linear-gradient(180deg, rgba(1,215,251,0.05) 0%, rgba(1,215,251,0.02) 100%);
  outline: none;
}
#search-value { transition: all 0.3s ease; }
```

### 3.7 Scrollbars + cursor

```css
::-webkit-scrollbar       { width: 0; height: 0; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #f4f4f2; }
.has-vertical-scroll::-webkit-scrollbar { width: 10px; overflow-y: scroll; }

.samsung,  .lg            { cursor: none !important; }
.samsung *, .lg *         { cursor: none !important; }
```

Native equivalent: hide all platform cursors; do not render any scrollbar chrome unless explicitly opted-in (favorites grid scroll is invisible).
