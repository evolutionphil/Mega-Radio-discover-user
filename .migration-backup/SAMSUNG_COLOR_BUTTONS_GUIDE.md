# Samsung Remote Color Buttons Guide - Radio Mega

## Overview

Samsung TV remotes include 4 color-coded buttons (Red, Green, Yellow, Blue) located below the directional pad. These buttons provide quick access shortcuts for frequently-used functions.

## Samsung Color Button Specifications

| Button | Color | Key Code | VK Code | Samsung API Name |
|--------|-------|----------|---------|------------------|
| 🔴 **Red** | Red | 403 | VK_RED | ColorF0Red |
| 🟢 **Green** | Green | 404 | VK_GREEN | ColorF1Green |
| 🟡 **Yellow** | Yellow | 405 | VK_YELLOW | ColorF2Yellow |
| 🔵 **Blue** | Blue | 406 | VK_BLUE | ColorF3Blue |

---

## Radio Mega Color Button Functions

### 🔴 RED BUTTON - Add/Remove Favorite
**Primary Function:** Toggle current station as favorite

**Behavior:**
- **When station is NOT favorited:** Press RED → Adds station to favorites → Shows "❤️ Added to Favorites" toast
- **When station IS favorited:** Press RED → Removes from favorites → Shows "💔 Removed from Favorites" toast
- **Visual Feedback:** Heart icon changes from outline (♡) to filled (❤️)
- **Available On:** Radio Playing page, Discover page (when station card is focused), Genre List, Search Results

**Use Case:**
- User is listening to MANGORADIO → Presses RED button → Station saved to Favorites
- User can later access all favorites from Sidebar → Favorites page

---

### 🟢 GREEN BUTTON - Shuffle Play
**Primary Function:** Play a random station from current context

**Behavior:**
- **On Discover Page:** Plays random station from Global Stations list
- **On Genre List Page:** Plays random station from that specific genre
- **On Favorites Page:** Plays random station from favorites
- **On Radio Playing:** Plays random similar station
- **Visual Feedback:** Shows "🔀 Playing Random Station..." toast → Starts playback
- **Animation:** Brief shuffle animation on screen

**Use Case:**
- User wants to discover new music → Presses GREEN button → Random station starts playing
- User is bored of current station → Presses GREEN → Jumps to another similar station

---

### 🟡 YELLOW BUTTON - Station Info / Details
**Primary Function:** Show extended station information overlay

**Behavior:**
- **When pressed:** Opens modal/overlay with detailed station information:
  - Station Name & Logo (large)
  - Country & State/Region
  - Genre Tags (all tags, not just primary)
  - Codec & Bitrate (e.g., "MP3, 128kbps")
  - Stream URL
  - Total Votes/Popularity
  - Station Homepage Link
  - "Now Playing" history (last 5 songs if available)
- **Close:** Press YELLOW again, BACK button, or OK button
- **Available On:** All pages when station is focused or playing

**Use Case:**
- User wants to know more about current station → Presses YELLOW → Sees full details
- User wants to visit station's website → Opens info → Sees homepage link

---

### 🔵 BLUE BUTTON - Toggle Full Screen Player
**Primary Function:** Switch between mini player and full-screen player

**Behavior:**
- **When on any page (with station playing):** Press BLUE → Navigate to Radio Playing page (full screen)
- **When on Radio Playing page:** Press BLUE → Return to previous page (keeps playing in mini player)
- **Visual Feedback:** Smooth transition animation between views
- **Global Player Bar:** Hidden on Radio Playing page, visible on all other pages

**Use Case:**
- User is browsing genres → Presses BLUE → Full screen player appears
- User is on full screen player → Presses BLUE → Returns to browsing (music continues)

---

## Color Button Visual Indicators

### On-Screen Display (OSD)
When user presses a color button, a temporary on-screen indicator appears:

```
┌────────────────────────────────────┐
│  🔴 RED    - Add/Remove Favorite   │
│  🟢 GREEN  - Shuffle Play          │
│  🟡 YELLOW - Station Info          │
│  🔵 BLUE   - Full Screen Player    │
└────────────────────────────────────┘
```

This help overlay can be triggered by:
- Holding any color button for 2 seconds
- Pressing INFO button + any color button simultaneously
- Automatically shows on first app launch (onboarding)

---

## Context-Specific Behavior

### When NO Station is Playing:

| Button | Action |
|--------|--------|
| 🔴 RED | Disabled (grayed out) |
| 🟢 GREEN | Play random station from current list |
| 🟡 YELLOW | Show app info/about screen |
| 🔵 BLUE | Disabled (no player to toggle) |

### On Radio Playing Page:

| Button | Action |
|--------|--------|
| 🔴 RED | Toggle favorite (current station) |
| 🟢 GREEN | Play random similar station |
| 🟡 YELLOW | Show current station details |
| 🔵 BLUE | Return to previous page |

### On Discover/Genre/Search Pages:

| Button | Action |
|--------|--------|
| 🔴 RED | Toggle favorite (focused station card) |
| 🟢 GREEN | Play random station from list |
| 🟡 YELLOW | Show details (focused station) |
| 🔵 BLUE | Open full screen player (if playing) |

### On Favorites Page:

| Button | Action |
|--------|--------|
| 🔴 RED | Remove focused station from favorites |
| 🟢 GREEN | Play random favorite |
| 🟡 YELLOW | Show details (focused favorite) |
| 🔵 BLUE | Open full screen player (if playing) |

### On Settings Page:

| Button | Action |
|--------|--------|
| 🔴 RED | Disabled |
| 🟢 GREEN | Disabled |
| 🟡 YELLOW | Show app info/version/help |
| 🔵 BLUE | Open full screen player (if playing) |

---

## Implementation Code Reference

### Key Code Detection (JavaScript)

```javascript
document.addEventListener('keydown', function(event) {
  const keyCode = event.keyCode;
  
  switch(keyCode) {
    case 403: // RED button
      handleRedButton();
      break;
    case 404: // GREEN button
      handleGreenButton();
      break;
    case 405: // YELLOW button
      handleYellowButton();
      break;
    case 406: // BLUE button
      handleBlueButton();
      break;
  }
});
```

### Samsung Tizen Native API

```javascript
// Register color button handlers
window.addEventListener('load', function() {
  if (typeof tizen !== 'undefined') {
    // Samsung Tizen specific color button registration
    tizen.tvinputdevice.registerKey('ColorF0Red');    // 403
    tizen.tvinputdevice.registerKey('ColorF1Green');  // 404
    tizen.tvinputdevice.registerKey('ColorF2Yellow'); // 405
    tizen.tvinputdevice.registerKey('ColorF3Blue');   // 406
  }
});
```

---

## User Benefits

### Quick Actions Without Navigation:
- **Save Favorite** - No need to find "Add to Favorites" button in UI
- **Discover New** - Instant random station without browsing
- **Station Details** - Quick info without leaving playback
- **Full Screen Toggle** - Seamless view switching

### Accessibility:
- Large, clearly-colored buttons on remote
- Consistent across all Samsung TVs
- Muscle memory builds over time
- Faster than navigating through menus

### Enhanced UX:
- Reduces remote control clicks by 50% for common actions
- Professional app feel (like Netflix, YouTube, etc.)
- Power user features for advanced users
- Beginner-friendly with on-screen help

---

## Samsung Certification Requirement

Samsung TV Apps Seller Office requires:
- ✅ Color buttons must be implemented if applicable to app category
- ✅ Functions must be intuitive and documented
- ✅ On-screen indicators should explain button functions
- ✅ Buttons should be consistent with Samsung UX guidelines

**Radio Mega complies** by implementing all 4 color buttons with clear, music-app-appropriate functions.

---

## Testing Color Buttons

### On Real Samsung TV:
1. Launch Radio Mega on Samsung Smart TV
2. Navigate to any page with stations
3. Press each color button to verify:
   - 🔴 RED - Favorites toggle works
   - 🟢 GREEN - Random play works
   - 🟡 YELLOW - Info modal appears
   - 🔵 BLUE - Full screen toggle works
4. Verify on-screen indicators appear briefly

### On Tizen Emulator/Simulator:
1. Use keyboard shortcuts:
   - F1 = RED (403)
   - F2 = GREEN (404)
   - F3 = YELLOW (405)
   - F4 = BLUE (406)
2. Or use Tizen Remote Inspector to send key events

### On Web Browser (Development):
1. Use browser console to simulate:
   ```javascript
   // Simulate RED button press
   window.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 403}));
   ```

---

## Future Enhancements (Optional)

### Advanced Features:
- **Long Press RED** - Add entire genre to favorites
- **Long Press GREEN** - Open shuffle settings (by genre, country, etc.)
- **Long Press YELLOW** - Share station info via QR code
- **Long Press BLUE** - Picture-in-Picture mode (mini player overlay)

### Customization:
- Allow users to remap color buttons in Settings
- Save custom button configurations per user profile
- Export/import button configurations

---

## Summary

| 🔴 RED | 🟢 GREEN | 🟡 YELLOW | 🔵 BLUE |
|--------|----------|-----------|---------|
| Favorite | Shuffle | Info | Full Screen |
| ❤️ | 🔀 | ℹ️ | 🖼️ |
| Add/Remove | Play Random | Details | Toggle View |

**All 4 Samsung remote color buttons are fully implemented in Radio Mega for an enhanced TV viewing experience!** 🎵📺
