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
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-discover">
                <!-- Sidebar -->
                <div id="discover-sidebar"></div>
                
                <!-- Main Content -->
                <div class="absolute left-[190px] right-[64px] top-[64px] bottom-[64px] overflow-y-auto" id="discover-content">
                    <!-- Header -->
                    <div class="mb-[40px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-[16px]" data-i18n="nav_discover">
                            Discover
                        </h1>
                        
                        <!-- Country Selector -->
                        <div class="inline-flex items-center gap-[12px] bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[20px] py-[12px] focusable cursor-pointer" 
                             data-focus-index="5" 
                             id="country-selector-btn">
                            <span class="text-[24px]">${this.getCountryFlag(currentCountryCode)}</span>
                            <span class="font-['Ubuntu',Helvetica] text-[20px] text-white">${currentCountry}</span>
                            <span class="text-white text-[16px]">▼</span>
                        </div>
                    </div>
                    
                    <!-- Popular Genres Section -->
                    <div class="mb-[48px]">
                        <h2 class="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-[24px]" data-i18n="popular_genres">
                            Popular Genres
                        </h2>
                        <div class="flex gap-[16px] overflow-x-auto pb-[16px]" id="genres-container">
                            <!-- Genres will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <!-- Popular Stations Section -->
                    <div class="mb-[48px]">
                        <h2 class="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-[24px]" data-i18n="popular_stations">
                            Popular Stations
                        </h2>
                        <div class="grid grid-cols-6 gap-[24px]" id="popular-stations-container">
                            <!-- Popular stations will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <!-- Country Stations Section -->
                    <div>
                        <h2 class="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-[24px]">
                            <span data-i18n="stations_from">Stations from</span> ${currentCountry}
                        </h2>
                        <div class="grid grid-cols-6 gap-[24px]" id="country-stations-container">
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
                <div class="genre-card flex-shrink-0 w-[200px] h-[100px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-[10px] flex items-center justify-center cursor-pointer focusable transition-all duration-200"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug || genre.name.toLowerCase().replace(/\s+/g, '-')}">
                    <p class="font-['Ubuntu',Helvetica] font-bold text-[20px] text-white text-center">
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
                <div class="station-card focusable cursor-pointer transition-all duration-200"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}">
                    <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] overflow-hidden">
                        <img src="${stationImage}" 
                             alt="${station.name}" 
                             class="w-full h-[200px] object-cover"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        <div class="p-[16px]">
                            <p class="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white truncate">
                                ${station.name}
                            </p>
                            <p class="font-['Ubuntu',Helvetica] text-[14px] text-[#9b9b9b] truncate">
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
                <div class="station-card focusable cursor-pointer transition-all duration-200"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}">
                    <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] overflow-hidden">
                        <img src="${stationImage}" 
                             alt="${station.name}" 
                             class="w-full h-[200px] object-cover"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        <div class="p-[16px]">
                            <p class="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white truncate">
                                ${station.name}
                            </p>
                            <p class="font-['Ubuntu',Helvetica] text-[14px] text-[#9b9b9b] truncate">
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
