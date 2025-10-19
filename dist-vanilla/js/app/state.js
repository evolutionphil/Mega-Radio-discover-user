/**
 * Mega Radio - Global State Management
 * Singleton pattern for managing app-wide state
 */

var AppState = (function() {
    var instance;
    
    function createInstance() {
        var state = {
            // Session
            currentPage: 'splash',
            currentCountry: AppConfig.DEFAULT_COUNTRY,
            currentCountryCode: AppConfig.DEFAULT_COUNTRY_CODE,
            currentLanguage: AppConfig.DEFAULT_LANGUAGE,
            
            // Playback
            currentStation: null,
            isPlaying: false,
            recentlyPlayed: [],
            
            // Navigation
            focusIndex: 0,
            sidebarIndex: 0,
            
            // Data
            genres: [],
            stations: [],
            favoriteStations: [],
            
            // UI
            isLoading: false,
            
            // Subscribers (pub/sub pattern)
            subscribers: {}
        };
        
        return {
            // Get state value
            get: function(key) {
                return state[key];
            },
            
            // Set state value and notify subscribers
            set: function(key, value) {
                var oldValue = state[key];
                state[key] = value;
                
                // Notify subscribers
                this.notify(key, value, oldValue);
                
                // Persist certain keys to localStorage
                if (key === 'favoriteStations') {
                    this.saveFavorites();
                } else if (key === 'recentlyPlayed') {
                    this.saveRecentlyPlayed();
                } else if (key === 'currentCountryCode') {
                    localStorage.setItem(AppConfig.STORAGE_KEYS.LAST_COUNTRY, value);
                } else if (key === 'currentLanguage') {
                    localStorage.setItem(AppConfig.STORAGE_KEYS.LANGUAGE, value);
                }
            },
            
            // Subscribe to state changes
            subscribe: function(key, callback) {
                if (!state.subscribers[key]) {
                    state.subscribers[key] = [];
                }
                state.subscribers[key].push(callback);
            },
            
            // Notify subscribers of state change
            notify: function(key, newValue, oldValue) {
                if (state.subscribers[key]) {
                    state.subscribers[key].forEach(function(callback) {
                        callback(newValue, oldValue);
                    });
                }
            },
            
            // Favorites management
            addFavorite: function(station) {
                var favorites = this.get('favoriteStations') || [];
                var exists = favorites.find(function(s) { return s.stationuuid === station.stationuuid; });
                if (!exists) {
                    favorites.push(station);
                    this.set('favoriteStations', favorites);
                }
            },
            
            removeFavorite: function(stationId) {
                var favorites = this.get('favoriteStations') || [];
                favorites = favorites.filter(function(s) { return s.stationuuid !== stationId; });
                this.set('favoriteStations', favorites);
            },
            
            isFavorite: function(stationId) {
                var favorites = this.get('favoriteStations') || [];
                return favorites.some(function(s) { return s.stationuuid === stationId; });
            },
            
            saveFavorites: function() {
                var favorites = this.get('favoriteStations') || [];
                localStorage.setItem(AppConfig.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            },
            
            loadFavorites: function() {
                try {
                    var stored = localStorage.getItem(AppConfig.STORAGE_KEYS.FAVORITES);
                    if (stored) {
                        var favorites = JSON.parse(stored);
                        this.set('favoriteStations', favorites);
                        console.log('[State] Loaded', favorites.length, 'favorites');
                    }
                } catch (e) {
                    console.error('[State] Error loading favorites:', e);
                }
            },
            
            // Recently played management
            addRecentlyPlayed: function(station) {
                var recent = this.get('recentlyPlayed') || [];
                // Remove if already exists
                recent = recent.filter(function(s) { return s.stationuuid !== station.stationuuid; });
                // Add to front
                recent.unshift(station);
                // Keep only last 20
                recent = recent.slice(0, 20);
                this.set('recentlyPlayed', recent);
            },
            
            saveRecentlyPlayed: function() {
                var recent = this.get('recentlyPlayed') || [];
                localStorage.setItem(AppConfig.STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recent));
            },
            
            loadRecentlyPlayed: function() {
                try {
                    var stored = localStorage.getItem(AppConfig.STORAGE_KEYS.RECENTLY_PLAYED);
                    if (stored) {
                        var recent = JSON.parse(stored);
                        this.set('recentlyPlayed', recent);
                    }
                } catch (e) {
                    console.error('[State] Error loading recently played:', e);
                }
            },
            
            // Initialize state from localStorage
            init: function() {
                console.log('[State] Initializing...');
                this.loadFavorites();
                this.loadRecentlyPlayed();
                
                var lastCountry = localStorage.getItem(AppConfig.STORAGE_KEYS.LAST_COUNTRY);
                if (lastCountry) {
                    this.set('currentCountryCode', lastCountry);
                }
                
                var language = localStorage.getItem(AppConfig.STORAGE_KEYS.LANGUAGE);
                if (language) {
                    this.set('currentLanguage', language);
                }
                
                console.log('[State] Initialized');
            }
        };
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Global convenience variable
var State = AppState.getInstance();
