/**
 * Mega Radio - App Configuration
 */

var AppConfig = {
    API_BASE_URL: 'https://themegaradio.com',
    API_TV_PARAM: '?tv=1',
    
    // Default settings
    DEFAULT_COUNTRY: 'United States',
    DEFAULT_COUNTRY_CODE: 'US',
    DEFAULT_LANGUAGE: 'en',
    
    // Platform detection
    PLATFORM: 'web',
    
    // Storage keys
    STORAGE_KEYS: {
        FAVORITES: 'megaradio_favorites',
        RECENTLY_PLAYED: 'megaradio_recently_played',
        LAST_COUNTRY: 'megaradio_last_country',
        LANGUAGE: 'megaradio_language',
        SETTINGS: 'megaradio_settings'
    },
    
    // Navigation
    PAGES: {
        SPLASH: 'splash',
        GUIDE_1: 'guide-1',
        GUIDE_2: 'guide-2',
        GUIDE_3: 'guide-3',
        GUIDE_4: 'guide-4',
        DISCOVER: 'discover',
        GENRES: 'genres',
        SEARCH: 'search',
        FAVORITES: 'favorites',
        SETTINGS: 'settings',
        RADIO_PLAYING: 'radio-playing'
    },
    
    // Images
    FALLBACK_STATION_IMAGE: 'images/fallback-station.png',
    
    // Detect platform
    detectPlatform: function() {
        if (typeof webOS !== 'undefined') {
            this.PLATFORM = 'webos';
        } else if (typeof tizen !== 'undefined') {
            this.PLATFORM = 'tizen';
        } else {
            this.PLATFORM = 'web';
        }
        console.log('[Config] Platform detected:', this.PLATFORM);
        return this.PLATFORM;
    }
};

// Initialize platform detection
AppConfig.detectPlatform();

console.log('[Config.js] ✅ AppConfig loaded successfully:', AppConfig);
