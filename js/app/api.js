/**
 * Mega Radio - API Client
 * Handles all API calls to themegaradio.com
 */

var MegaRadioAPI = (function() {
    var BASE_URL = AppConfig.API_BASE_URL;
    var TV_PARAM = AppConfig.API_TV_PARAM;
    
    // Country code to name mapping
    var COUNTRY_CODES = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'TR': 'Türkiye',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'CA': 'Canada',
        'AU': 'Australia',
        'BR': 'Brazil',
        'AT': 'Austria'
    };
    
    return {
        // Convert country code to name
        getCountryName: function(code) {
            return COUNTRY_CODES[code] || code;
        },
        
        // Fetch with retry logic
        fetchWithRetry: function(url, options, retries) {
            retries = retries || 3;
            options = options || {};
            
            return fetch(url, options)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('HTTP ' + response.status);
                    }
                    return response.json();
                })
                .catch(function(error) {
                    if (retries > 0) {
                        console.log('[API] Retrying... (' + retries + ' left)');
                        return MegaRadioAPI.fetchWithRetry(url, options, retries - 1);
                    }
                    throw error;
                });
        },
        
        // Get all genres for a country
        getAllGenres: function(countryCode) {
            var countryName = this.getCountryName(countryCode);
            var url = BASE_URL + '/api/genres?country=' + encodeURIComponent(countryName) + '&tv=1';
            
            console.log('[API] getAllGenres:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    // Handle null or invalid data
                    if (!data || !Array.isArray(data)) {
                        console.log('[API] Genres fetched: 0 (null response)');
                        return [];
                    }
                    console.log('[API] Genres fetched:', data.length);
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error fetching genres:', error);
                    return [];
                });
        },
        
        // Get popular stations
        getPopularStations: function(countryCode, limit) {
            limit = limit || 24;
            var countryName = this.getCountryName(countryCode);
            var url = BASE_URL + '/api/stations?search=&limit=' + limit + 
                     '&country=' + encodeURIComponent(countryName) + '&sort=votes&tv=1';
            
            console.log('[API] getPopularStations:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    // Handle null or invalid data
                    if (!data || !Array.isArray(data)) {
                        console.log('[API] Popular stations fetched: 0 (null response)');
                        return [];
                    }
                    console.log('[API] Popular stations fetched:', data.length);
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error fetching popular stations:', error);
                    return [];
                });
        },
        
        // Get working stations
        getWorkingStations: function(countryCode, limit) {
            limit = limit || 500;
            var countryName = this.getCountryName(countryCode);
            var url = BASE_URL + '/api/stations?search=&limit=' + limit + 
                     '&country=' + encodeURIComponent(countryName) + '&tv=1';
            
            console.log('[API] getWorkingStations:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    // Handle null or invalid data
                    if (!data || !Array.isArray(data)) {
                        console.log('[API] Working stations fetched: 0 (null response)');
                        return [];
                    }
                    console.log('[API] Working stations fetched:', data.length);
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error fetching working stations:', error);
                    return [];
                });
        },
        
        // Search stations
        searchStations: function(query, countryCode, limit) {
            limit = limit || 50;
            var countryName = countryCode ? this.getCountryName(countryCode) : '';
            var url = BASE_URL + '/api/stations?search=' + encodeURIComponent(query) + 
                     '&limit=' + limit + '&tv=1';
            
            if (countryName) {
                url += '&country=' + encodeURIComponent(countryName);
            }
            
            console.log('[API] searchStations:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    // Handle null or invalid data
                    if (!data || !Array.isArray(data)) {
                        console.log('[API] Search results: 0 (null response)');
                        return [];
                    }
                    console.log('[API] Search results:', data.length);
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error searching stations:', error);
                    return [];
                });
        },
        
        // Get stations by genre
        getStationsByGenre: function(genre, countryCode, limit) {
            limit = limit || 50;
            var countryName = countryCode ? this.getCountryName(countryCode) : '';
            var url = BASE_URL + '/api/stations?genre=' + encodeURIComponent(genre) + 
                     '&limit=' + limit + '&tv=1';
            
            if (countryName) {
                url += '&country=' + encodeURIComponent(countryName);
            }
            
            console.log('[API] getStationsByGenre:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    // Handle null or invalid data
                    if (!data || !Array.isArray(data)) {
                        console.log('[API] Stations by genre fetched: 0 (null response)');
                        return [];
                    }
                    console.log('[API] Stations by genre fetched:', data.length);
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error fetching stations by genre:', error);
                    return [];
                });
        },
        
        // Get translations
        getTranslations: function(language) {
            var url = BASE_URL + '/api/translations/' + language + TV_PARAM;
            
            console.log('[API] getTranslations:', url);
            
            return this.fetchWithRetry(url)
                .then(function(data) {
                    console.log('[API] Translations loaded:', Object.keys(data).length, 'keys');
                    return data;
                })
                .catch(function(error) {
                    console.error('[API] Error fetching translations:', error);
                    return {};
                });
        }
    };
})();
