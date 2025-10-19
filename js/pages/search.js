/**
 * Mega Radio - Search Page
 * Search for radio stations with autocomplete and recently played sidebar
 * Implements EXACT Figma design (1920x1080)
 */

var search_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        searchResults: [],
        recentlyPlayed: [],
        suggestions: [
            'Kral Radyo',
            'Kral Radyo Ankara',
            'Kral Pop Radyo',
            'Kral World Radyo'
        ],
        showSuggestions: false
    },
    
    searchTimeout: null,
    
    init: function() {
        console.log('[Search] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        // Build complete layout with exact Figma positioning
        var html = `
            <div style="${StyleHelpers.fullScreen()} ${StyleHelpers.background(TVColors.background)}">
                <!-- Background Image -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;">
                    <img src="${Utils.assetPath('images/hand-crowd-disco-1.png')}" 
                         alt="Background" 
                         style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                </div>
                
                <!-- Gradient Overlay -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${TVGradients.concertGradient}; z-index: 1;"></div>
                
                <!-- Logo (top-left) -->
                <div style="${StyleHelpers.position(31, 64, 323, 112)} z-index: 10;">
                    <p style="position: absolute; bottom: 0; left: 18.67%; right: 0; top: 46.16%; ${StyleHelpers.text(53, TVTypography.weightRegular, TVColors.white)} white-space: pre-wrap;">
                        <span style="font-weight: ${TVTypography.weightBold};">mega</span>radio
                    </p>
                    <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                        <img alt="Logo" 
                             style="width: 100%; height: 100%; object-fit: contain;" 
                             src="${Utils.assetPath('images/path-8-figma.svg')}">
                    </div>
                </div>
                
                <!-- Equalizer Icon -->
                <div class="focusable" 
                     data-focus-index="equalizer"
                     style="${StyleHelpers.position(1281, 67, 48, 48)} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} ${StyleHelpers.flex('row', 'center', 'center')} cursor: pointer; transition: all 0.2s; z-index: 10;"
                     data-testid="button-equalizer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="10" width="2" height="11" fill="${TVColors.white}"/>
                        <rect x="8" y="6" width="2" height="15" fill="${TVColors.white}"/>
                        <rect x="13" y="3" width="2" height="18" fill="${TVColors.white}"/>
                        <rect x="18" y="8" width="2" height="13" fill="${TVColors.white}"/>
                    </svg>
                </div>
                
                <!-- Country Selector -->
                <div class="focusable" 
                     id="tv-country-selector"
                     data-focus-index="country-selector"
                     style="${StyleHelpers.position(1351, 67, 'auto', 'auto')} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} padding: 12px 20px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'flex-start', 'center', 12)} z-index: 10;"
                     data-testid="button-country-selector">
                    <span style="font-size: 24px;">🇺🇸</span>
                    <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">United States</span>
                    <span style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.white)}">▼</span>
                </div>
                
                <!-- User Profile -->
                <div class="focusable" 
                     id="tv-user-profile"
                     data-focus-index="user-profile"
                     style="${StyleHelpers.position(1648, 59, 'auto', 'auto')} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} padding: 8px 16px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'flex-start', 'center', 12)} z-index: 10;"
                     data-testid="button-user-profile">
                    <div style="width: 48px; height: 48px; ${StyleHelpers.background(TVColors.whiteOverlay20)} ${StyleHelpers.borderRadius(24)} ${StyleHelpers.flex('row', 'center', 'center')}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" fill="${TVColors.white}"/>
                            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="${TVColors.white}"/>
                        </svg>
                    </div>
                    <span style="${StyleHelpers.text(18, TVTypography.weightMedium, TVColors.white)}">Guest</span>
                </div>
                
                <!-- Page Title - Search at exact Figma position: left:308px, top:58px -->
                <h1 style="${StyleHelpers.position(308, 58, 'auto', 'auto')} ${StyleHelpers.text(32, TVTypography.weightBold, TVColors.white)} margin: 0; z-index: 5;" 
                    data-i18n="nav_search"
                    data-testid="text-page-title">
                    Search
                </h1>
                
                <!-- Search Input Box at left:308px, top:136px, width:968px, height:91px -->
                <div style="${StyleHelpers.position(308, 136, 968, 91)} z-index: 5;">
                    <div style="position: relative; width: 100%; height: 100%;">
                        <input type="text" 
                               id="search-input" 
                               class="focusable"
                               style="width: 100%; height: 100%; ${StyleHelpers.background(TVColors.whiteOverlay10)} color: ${TVColors.white}; font-family: ${TVTypography.fontFamily}; font-size: 28px; padding: 0 80px 0 32px; ${StyleHelpers.borderRadius(TVSpacing.radius10)} border: 2px solid transparent; outline: none; box-sizing: border-box;"
                               placeholder="Search for stations..."
                               data-focus-index="5"
                               data-i18n-placeholder="search_placeholder"
                               data-testid="input-search">
                        <div style="position: absolute; right: 32px; top: 50%; transform: translateY(-50%); pointer-events: none;">
                            <img src="${Utils.assetPath('images/search-icon.svg')}" 
                                 alt="Search" 
                                 style="width: 32px; height: 32px; opacity: 0.5;">
                        </div>
                    </div>
                </div>
                
                <!-- Autocomplete Dropdown (below search input, shown when typing) -->
                <div id="autocomplete-dropdown" 
                     style="${StyleHelpers.position(308, 237, 968, 'auto')} z-index: 15; display: none;"
                     data-testid="container-autocomplete">
                    <!-- Suggestions will be dynamically inserted here -->
                </div>
                
                <!-- Native Keyboard Placeholder Area at left:308px, top:610px, width:1006px, height:378px, background:#313131 -->
                <div style="${StyleHelpers.position(308, 610, 1006, 378)} background: #313131; ${StyleHelpers.borderRadius(TVSpacing.radius10)} z-index: 5; ${StyleHelpers.flex('row', 'center', 'center')}"
                     data-testid="container-keyboard-placeholder">
                    <p style="${StyleHelpers.text(24, TVTypography.weightMedium, TVColors.textMuted)} margin: 0;">
                        Native TV Keyboard Area
                    </p>
                </div>
                
                <!-- Recently Played Sidebar (right side) at left:1394px, top:136px -->
                <div style="${StyleHelpers.position(1394, 136, 462, 'auto')} z-index: 5;">
                    <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin: 0 0 24px 0;"
                        data-i18n="recently_played"
                        data-testid="text-recently-played">
                        Recently Played
                    </h2>
                    
                    <!-- 3 columns x 3 rows of station cards (200x264px each, 30px gap) -->
                    <div style="${StyleHelpers.grid(3, 30)} width: 100%;" 
                         id="recently-played-container"
                         data-testid="container-recently-played">
                        <!-- Recently played stations will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-search').html(html);
        
        // Render sidebar after main content using Sidebar.render('search', ...)
        this.updateSidebar();
        
        console.log('[Search] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('search', 0, this.keys.focused_index);
        $('#page-search').append(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Search input with debounce
        $('#search-input').on('input', function() {
            var query = $(this).val().trim();
            
            if (self.searchTimeout) {
                clearTimeout(self.searchTimeout);
            }
            
            // Show autocomplete if there's input
            if (query.length > 0) {
                self.showAutocomplete(query);
            } else {
                self.hideAutocomplete();
            }
            
            self.searchTimeout = setTimeout(function() {
                console.log('[Search] Searching for:', query);
                self.performSearch(query);
            }, 400); // 400ms debounce
        });
        
        // Focus/blur events for search input
        $('#search-input').on('focus', function() {
            var query = $(this).val().trim();
            if (query.length > 0) {
                self.showAutocomplete(query);
            }
        });
        
        // Station card click (recently played)
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Search] Station clicked:', stationId);
            
            var station = self.findStation(stationId);
            if (station) {
                GlobalPlayer.play(station);
                AppRouter.navigate('radio-playing');
            }
        });
        
        // Autocomplete suggestion click
        $(document).on('click', '.autocomplete-item', function() {
            var suggestion = $(this).data('suggestion');
            console.log('[Search] Suggestion clicked:', suggestion);
            $('#search-input').val(suggestion);
            self.hideAutocomplete();
            self.performSearch(suggestion);
        });
        
        // Country selector click
        $(document).on('click', '#tv-country-selector', function() {
            console.log('[Search] Country selector clicked');
            CountryModal.show();
        });
        
        // User profile click
        $(document).on('click', '#tv-user-profile', function() {
            console.log('[Search] User profile clicked');
        });
        
        // Equalizer click
        $(document).on('click', '[data-testid="button-equalizer"]', function() {
            console.log('[Search] Equalizer clicked');
        });
    },
    
    loadData: function() {
        var self = this;
        var countryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        
        // Load recently played stations (or fallback to popular stations)
        // 3x3 grid = 9 stations
        MegaRadioAPI.getPopularStations(countryCode, 9)
            .then(function(stations) {
                self.data.recentlyPlayed = stations;
                self.renderRecentlyPlayed();
            })
            .catch(function(error) {
                console.error('[Search] Error loading recently played:', error);
            });
    },
    
    showAutocomplete: function(query) {
        var self = this;
        var filtered = this.data.suggestions.filter(function(suggestion) {
            return suggestion.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        
        if (filtered.length === 0) {
            this.hideAutocomplete();
            return;
        }
        
        var html = '<div style="' + StyleHelpers.background(TVColors.whiteOverlay10) + ' ' + StyleHelpers.borderRadius(TVSpacing.radius10) + ' padding: 16px; backdrop-filter: blur(10px);">';
        
        filtered.forEach(function(suggestion, index) {
            var focusIndex = 6 + index; // After sidebar (0-4) and search input (5)
            html += `
                <div class="autocomplete-item focusable" 
                     style="padding: 16px; ${StyleHelpers.background(TVColors.whiteOverlay05)} ${StyleHelpers.borderRadius(TVSpacing.radius8)} margin-bottom: 12px; cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-suggestion="${suggestion}"
                     data-testid="item-autocomplete-${index}">
                    <p style="${StyleHelpers.text(22, TVTypography.weightMedium, TVColors.white)} margin: 0;">
                        ${suggestion}
                    </p>
                </div>
            `;
        });
        
        html += '</div>';
        
        $('#autocomplete-dropdown').html(html).show();
    },
    
    hideAutocomplete: function() {
        $('#autocomplete-dropdown').hide();
    },
    
    performSearch: function(query) {
        var self = this;
        
        if (!query) {
            return;
        }
        
        // Hide autocomplete when search is performed
        this.hideAutocomplete();
        
        MegaRadioAPI.searchStations(query, State.get('currentCountryCode'), 50)
            .then(function(results) {
                self.data.searchResults = results;
                console.log('[Search] Found', results.length, 'results for:', query);
                // TODO: Display search results (not in Figma spec, so keeping simple)
            })
            .catch(function(error) {
                console.error('[Search] Error searching:', error);
            });
    },
    
    renderRecentlyPlayed: function() {
        var html = '';
        var self = this;
        
        // Station cards: 200x264px (3 columns x 3 rows)
        this.data.recentlyPlayed.forEach(function(station, index) {
            var focusIndex = 10 + index; // After sidebar (0-4), search input (5), autocomplete (6-9)
            var stationImage = self.getStationImage(station);
            var stationName = station.name || 'Unknown Station';
            var stationGenre = station.tags || station.country || '';
            
            html += `
                <div class="station-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}"
                     data-testid="card-recently-played-${index}">
                    <div style="${StyleHelpers.background(TVColors.whiteOverlay05)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} overflow: hidden; width: 200px; height: 264px;">
                        <!-- Station Logo (200x200px) -->
                        <img src="${stationImage}" 
                             alt="${stationName}" 
                             style="width: 200px; height: 200px; object-fit: cover; display: block;"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        <!-- Station Name and Genre (64px height) -->
                        <div style="padding: 12px; height: 64px; box-sizing: border-box;">
                            <p style="${StyleHelpers.text(16, TVTypography.weightMedium, TVColors.white)} overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 0 4px 0;">
                                ${stationName}
                            </p>
                            <p style="${StyleHelpers.text(14, TVTypography.weightRegular, TVColors.textMuted)} overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
                                ${stationGenre}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#recently-played-container').html(html);
    },
    
    getStationImage: function(station) {
        if (station.favicon && station.favicon !== '') {
            return station.favicon.startsWith('http') 
                ? station.favicon 
                : 'https://themegaradio.com/api/image/' + encodeURIComponent(station.favicon);
        }
        if (station.image && station.image !== '') {
            return station.image;
        }
        return Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE);
    },
    
    findStation: function(stationId) {
        var found = null;
        
        this.data.recentlyPlayed.forEach(function(station) {
            if ((station.stationuuid || station._id) === stationId) {
                found = station;
            }
        });
        
        return found;
    },
    
    cleanup: function() {
        console.log('[Search] Cleaning up...');
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        $('#search-input').off('input focus');
        $(document).off('click', '.station-card');
        $(document).off('click', '.autocomplete-item');
        $(document).off('click', '#tv-country-selector');
        $(document).off('click', '#tv-user-profile');
        $(document).off('click', '[data-testid="button-equalizer"]');
        this.hideAutocomplete();
    }
};
