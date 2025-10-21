/**
 * Mega Radio - Global State Management (SIMPLIFIED FOR DEBUGGING)
 */

console.log('[State.js] ========== LOADING STATE.JS ==========');

// Simple State object without dependencies
var State = {
    // Data
    currentPage: 'splash',
    currentCountry: 'United States',
    currentCountryCode: 'US',
    currentLanguage: 'en',
    currentStation: null,
    isPlaying: false,
    recentlyPlayed: [],
    favoriteStations: [],
    genres: [],
    stations: [],
    focusIndex: 0,
    sidebarIndex: 0,
    isLoading: false,
    
    // Methods
    get: function(key) {
        return this[key];
    },
    
    set: function(key, value) {
        this[key] = value;
        console.log('[State] Set', key, '=', value);
    },
    
    init: function() {
        console.log('[State] Initializing...');
        
        // Load from localStorage
        try {
            var favorites = localStorage.getItem('megaradio_favorites');
            if (favorites) {
                this.favoriteStations = JSON.parse(favorites);
            }
            
            var recent = localStorage.getItem('megaradio_recently_played');
            if (recent) {
                this.recentlyPlayed = JSON.parse(recent);
            }
            
            var lastCountry = localStorage.getItem('megaradio_last_country');
            if (lastCountry) {
                this.currentCountryCode = lastCountry;
            }
            
            var language = localStorage.getItem('megaradio_language');
            if (language) {
                this.currentLanguage = language;
            }
        } catch (e) {
            console.error('[State] Error loading from localStorage:', e);
        }
        
        console.log('[State] Initialized successfully');
    },
    
    saveFavorites: function() {
        try {
            localStorage.setItem('megaradio_favorites', JSON.stringify(this.favoriteStations));
        } catch (e) {
            console.error('[State] Error saving favorites:', e);
        }
    },
    
    saveRecentlyPlayed: function() {
        try {
            localStorage.setItem('megaradio_recently_played', JSON.stringify(this.recentlyPlayed));
        } catch (e) {
            console.error('[State] Error saving recently played:', e);
        }
    }
};

console.log('[State.js] ========== STATE.JS LOADED SUCCESSFULLY ==========');
console.log('[State.js] State object:', State);
