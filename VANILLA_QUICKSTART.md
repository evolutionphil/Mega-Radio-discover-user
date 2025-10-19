# Mega Radio Vanilla JS - Quick Start Guide

## 🚀 LGTV-Master Pattern: NO BUILD SCRIPT!

Everything is **flat at the root level** - just like LGTV-master reference. No build process, no dist folder, no compilation needed.

---

## 📁 Folder Structure

```
Root/ (This is your deployment folder)
├── index.html              ← Open this in browser
├── config.xml              ← Samsung TV config
├── appinfo.json            ← LG webOS config
├── icon.png                ← App icon
├── css/                    ← Styles
├── js/                     ← All JavaScript (app/, pages/, components/)
├── images/                 ← SVG/PNG assets
└── webOSTVjs-1.2.0/        ← LG webOS SDK
```

---

## ✅ Test in Browser (3 Steps)

### 1. Open in Browser
```bash
# Option 1: Direct file
open index.html

# Option 2: Local server
python3 -m http.server 8080
# Then open http://localhost:8080
```

### 2. Navigate the App
- Splash screen (auto-advances after 3 seconds)
- Guide screens (click or press Enter to continue)
- Main app (Discover, Genres, Search, Favorites, Settings)

### 3. Test Features
- ✅ Click stations to play
- ✅ Search for stations
- ✅ Add/remove favorites
- ✅ Change country/language in Settings

---

## 📱 Deploy to TV

### Samsung Tizen TV
```bash
# Package entire root folder as .wgt
tizen package -t wgt -s <profile> -- .

# Install to TV
tizen install -n MegaRadio.wgt -t <device-id>
```

### LG webOS TV
```bash
# Package entire root folder as .ipk
ares-package .

# Install to TV
ares-install com.megaradio.tv_1.0.0_all.ipk -d <device>
```

---

## 🎮 TV Remote Controls

### Color Buttons (Guide Pages)
- **Red**: Discover
- **Green**: Genres
- **Blue**: Search
- **Yellow**: Favorites

### Navigation
- **Arrow Keys**: Move between items
- **Enter/OK**: Select
- **Back**: Previous page

---

## 🔧 Development

### Edit a Page
```javascript
// js/pages/discover.js
var discover_page = {
    init: function() {
        this.render();
        this.bindEvents();
        this.loadData();
    },
    // ... rest of page controller
};
```

### Add CSS
Edit `css/tv-styles.css` or `css/vanilla-app.css`

### Add Images
Drop images in `images/` folder and reference with:
```javascript
Utils.assetPath('images/my-image.png')
```

---

## 🎵 API Examples

### Play a Station
```javascript
GlobalPlayer.play(station);
```

### Search Stations
```javascript
MegaRadioAPI.searchStations('rock', 'US').then(function(stations) {
    console.log(stations);
});
```

### Manage Favorites
```javascript
State.addFavorite(station);
State.removeFavorite(stationId);
```

---

## 🐛 Troubleshooting

**Nothing shows up?**
- Check browser console (F12) for errors
- Verify all files loaded correctly (Network tab)

**API not working?**
- Check internet connection
- API: https://themegaradio.com

**Images not loading?**
- Verify images/ folder exists
- Check Utils.assetPath() usage in page controllers

---

## ✨ That's It!

No build step, no compilation, no complex tooling. Just vanilla JavaScript + jQuery + Bootstrap.

**Deploy the entire root folder to TV and you're done!** 🎵
