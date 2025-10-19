/**
 * Mega Radio - Discover Page
 * Shows popular genres and stations with sidebar navigation
 */

var discover_page = {
    keys: {
        focused_index: 0,
        total_items: 0
    },
    
    data: {
        genres: [],
        popularStations: [],
        countryStations: []
    },
    
    init: function() {
        console.log('[Discover] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        var currentCountry = State.get('currentCountry') || AppConfig.DEFAULT_COUNTRY;
        var currentCountryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        
        var html = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;" data-testid="page-discover">
                <!-- Sidebar -->
                <div id="discover-sidebar"></div>
                
                <!-- Main Content -->
                <div style="position: absolute; left: 190px; right: 64px; top: 64px; bottom: 64px; overflow-y: auto;" id="discover-content">
                    <!-- Header -->
                    <div style="margin-bottom: 40px;">
                        <h1 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 48px; color: #ffffff; margin-bottom: 16px;" data-i18n="nav_discover">
                            Discover
                        </h1>
                        
                        <!-- Country Selector -->
                        <div class="d-inline-flex align-items-center focusable" 
                             style="gap: 12px; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 20px; cursor: pointer;" 
                             data-focus-index="5" 
                             id="country-selector-btn">
                            <span style="font-size: 24px;">${this.getCountryFlag(currentCountryCode)}</span>
                            <span style="font-family: 'Ubuntu', Helvetica; font-size: 20px; color: #ffffff;">${currentCountry}</span>
                            <span style="color: #ffffff; font-size: 16px;">▼</span>
                        </div>
                    </div>
                    
                    <!-- Popular Genres Section -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 32px; color: #ffffff; margin-bottom: 24px;" data-i18n="popular_genres">
                            Popular Genres
                        </h2>
                        <div class="d-flex" style="gap: 16px; overflow-x: auto; padding-bottom: 16px;" id="genres-container">
                            <!-- Genres will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <!-- Popular Stations Section -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 32px; color: #ffffff; margin-bottom: 24px;" data-i18n="popular_stations">
                            Popular Stations
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px;" id="popular-stations-container">
                            <!-- Popular stations will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <!-- Country Stations Section -->
                    <div>
                        <h2 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 32px; color: #ffffff; margin-bottom: 24px;">
                            <span data-i18n="stations_from">Stations from</span> ${currentCountry}
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px;" id="country-stations-container">
                            <!-- Country stations will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-discover').html(html);
        this.updateSidebar();
        console.log('[Discover] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('discover', 0, this.keys.focused_index);
        $('#discover-sidebar').html(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Country selector click
        $(document).on('click', '#country-selector-btn', function() {
            console.log('[Discover] Country selector clicked');
            // TODO: Show country selector modal
        });
        
        // Genre click - navigate to genre detail
        $(document).on('click', '.genre-card', function() {
            var genreSlug = $(this).data('genre-slug');
            console.log('[Discover] Genre clicked:', genreSlug);
            AppRouter.navigate('genre-detail?genre=' + genreSlug);
        });
        
        // Station click - navigate to radio playing
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Discover] Station clicked:', stationId);
            
            // Find station data
            var station = self.findStation(stationId);
            if (station) {
                GlobalPlayer.play(station);
                AppRouter.navigate('radio-playing');
            }
        });
    },
    
    loadData: function() {
        var self = this;
        var countryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        
        Utils.showLoading();
        
        // Load all data in parallel
        Promise.all([
            MegaRadioAPI.getAllGenres(countryCode),
            MegaRadioAPI.getPopularStations(countryCode, 24),
            MegaRadioAPI.getWorkingStations(countryCode, 50)
        ]).then(function(results) {
            self.data.genres = results[0];
            self.data.popularStations = results[1];
            self.data.countryStations = results[2];
            
            self.renderGenres();
            self.renderPopularStations();
            self.renderCountryStations();
            
            Utils.hideLoading();
        }).catch(function(error) {
            console.error('[Discover] Error loading data:', error);
            Utils.hideLoading();
        });
    },
    
    renderGenres: function() {
        var html = '';
        var topGenres = this.data.genres.slice(0, 8);
        
        topGenres.forEach(function(genre, index) {
            var focusIndex = 6 + index; // Start after sidebar (0-4) and country selector (5)
            html += `
                <div class="genre-card d-flex align-items-center justify-content-center focusable" 
                     style="flex-shrink: 0; width: 200px; height: 100px; background: linear-gradient(to right, #ec4899, #9333ea); border-radius: 10px; cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug || genre.name.toLowerCase().replace(/\s+/g, '-')}">
                    <p style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 20px; color: #ffffff; text-align: center;">
                        ${genre.name}
                    </p>
                </div>
            `;
        });
        
        $('#genres-container').html(html);
    },
    
    renderPopularStations: function() {
        var html = '';
        var self = this;
        
        this.data.popularStations.forEach(function(station, index) {
            var focusIndex = 14 + index; // After sidebar, country selector, and genres
            var stationImage = self.getStationImage(station);
            
            html += `
                <div class="station-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}">
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <img src="${stationImage}" 
                             alt="${station.name}" 
                             style="width: 100%; height: 200px; object-fit: cover;"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        <div style="padding: 16px;">
                            <p style="font-family: 'Ubuntu', Helvetica; font-weight: 500; font-size: 18px; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${station.name}
                            </p>
                            <p style="font-family: 'Ubuntu', Helvetica; font-size: 14px; color: #9b9b9b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${station.tags || station.country || ''}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#popular-stations-container').html(html);
    },
    
    renderCountryStations: function() {
        var html = '';
        var self = this;
        
        this.data.countryStations.forEach(function(station, index) {
            var focusIndex = 14 + self.data.popularStations.length + index;
            var stationImage = self.getStationImage(station);
            
            html += `
                <div class="station-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}">
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <img src="${stationImage}" 
                             alt="${station.name}" 
                             style="width: 100%; height: 200px; object-fit: cover;"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        <div style="padding: 16px;">
                            <p style="font-family: 'Ubuntu', Helvetica; font-weight: 500; font-size: 18px; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${station.name}
                            </p>
                            <p style="font-family: 'Ubuntu', Helvetica; font-size: 14px; color: #9b9b9b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${station.tags || station.country || ''}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#country-stations-container').html(html);
    },
    
    getStationImage: function(station) {
        if (station.favicon) {
            return station.favicon.startsWith('http') 
                ? station.favicon 
                : 'https://themegaradio.com/api/image/' + encodeURIComponent(station.favicon);
        }
        return Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE);
    },
    
    getCountryFlag: function(countryCode) {
        var flags = {
            'US': '🇺🇸',
            'GB': '🇬🇧',
            'TR': '🇹🇷',
            'DE': '🇩🇪',
            'FR': '🇫🇷',
            'IT': '🇮🇹',
            'ES': '🇪🇸',
            'CA': '🇨🇦',
            'AU': '🇦🇺',
            'BR': '🇧🇷'
        };
        return flags[countryCode] || '🌍';
    },
    
    findStation: function(stationId) {
        var allStations = this.data.popularStations.concat(this.data.countryStations);
        return allStations.find(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
    },
    
    cleanup: function() {
        console.log('[Discover] Cleaning up...');
        $(document).off('click', '#country-selector-btn');
        $(document).off('click', '.genre-card');
        $(document).off('click', '.station-card');
    }
};
