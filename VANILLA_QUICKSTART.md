# Mega Radio Vanilla JS - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Build the App
```bash
./build-vanilla.sh
```
This creates the `dist-vanilla/` folder with all files ready for deployment.

### 2️⃣ Test in Browser
```bash
cd dist-vanilla
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

### 3️⃣ Deploy to TV
**Samsung Tizen TV:**
```bash
# Package dist-vanilla/ as .wgt
tizen package -t wgt -s <profile> -- dist-vanilla/
tizen install -n MegaRadio.wgt -t <device-id>
```

**LG webOS TV:**
```bash
# Package dist-vanilla/ as .ipk
ares-package dist-vanilla/
ares-install com.megaradio.tv_1.0.0_all.ipk -d <device>
```

---

## 📁 What's Inside

```
dist-vanilla/
├── index.html              ← Entry point (open this in browser)
├── css/                    ← Styles
├── js/
│   ├── app/               ← Core modules (state, router, API, player)
│   ├── pages/             ← Page controllers (splash, guides, discover, etc.)
│   └── components/        ← Sidebar component
├── images/                ← SVG/PNG assets
└── webOSTVjs-1.2.0/       ← LG webOS SDK
```

---

## 🎮 TV Remote Controls

### Samsung Tizen
- **Red Button**: Navigate to Discover
- **Green Button**: Navigate to Genres
- **Blue Button**: Navigate to Search
- **Yellow Button**: Navigate to Favorites
- **Arrow Keys**: Navigate between items
- **Enter/OK**: Select item
- **Back**: Go to previous page

### LG webOS
Same as Samsung Tizen

---

## 🔧 Development

### Edit a Page
All pages are in `js/pages/`. Example:

```javascript
// js/pages/discover.js
var discover_page = {
    init: function() {
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        // Your HTML here
    },
    
    bindEvents: function() {
        // Your event handlers here
    },
    
    loadData: function() {
        // Fetch data from API
    }
};
```

### Add a New Page
1. Create `js/pages/my-page.js`
2. Add page section to `index-vanilla.html`:
   ```html
   <div id="page-my-page" class="page">
       <div class="my-page-container"></div>
   </div>
   ```
3. Add script tag:
   ```html
   <script src="js/pages/my-page.js"></script>
   ```
4. Navigate to page:
   ```javascript
   AppRouter.navigate('my-page');
   ```

### Modify Styles
Edit `css/tv-styles.css` for TV-specific styles or `css/vanilla-app.css` for app-wide styles.

---

## 🎵 API Usage

### Get Stations
```javascript
MegaRadioAPI.getPopularStations('US', 24).then(function(stations) {
    console.log('Stations:', stations);
});
```

### Search
```javascript
MegaRadioAPI.searchStations('rock', 'US').then(function(results) {
    console.log('Search results:', results);
});
```

### Play Station
```javascript
GlobalPlayer.play(station);
```

---

## 📊 State Management

### Get/Set State
```javascript
// Get current country
var country = State.get('currentCountryCode');

// Set country (auto-saves to localStorage)
State.set('currentCountryCode', 'US');
```

### Subscribe to Changes
```javascript
State.subscribe('currentStation', function(station) {
    console.log('Now playing:', station.name);
});
```

### Manage Favorites
```javascript
State.addFavorite(station);
State.removeFavorite(stationId);
var isFavorite = State.isFavorite(stationId);
```

---

## 🐛 Troubleshooting

**Images not loading?**
- Check that `images/` folder exists in `dist-vanilla/`
- Verify `Utils.assetPath()` is used for all image paths

**API calls failing?**
- Check browser console for errors
- Verify internet connection
- API endpoint: https://themegaradio.com

**Navigation not working?**
- Check that page IDs match in HTML and router
- Verify `AppRouter.navigate()` is called correctly

**Player not working on TV?**
- Check that `js/tv-audio-player.js` is loaded
- Verify platform detection in `js/app/config.js`

---

## 📚 Documentation

- **Full Conversion Summary**: `VANILLA_JS_CONVERSION_SUMMARY.md`
- **Project Overview**: `replit.md`

---

## ✅ Ready to Deploy!

The vanilla JS version is fully functional and TV-ready. Deploy to Samsung Tizen or LG webOS and enjoy global radio streaming! 🎵
