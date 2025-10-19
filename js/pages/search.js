/**
 * Mega Radio - Search Page
 * Search for radio stations with sidebar
 */

var search_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        searchResults: [],
        popularStations: []
    },
    
    searchTimeout: null,
    
    init: function() {
        console.log('[Search] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        var html = `
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-search">
                <!-- Sidebar -->
                <div id="search-sidebar"></div>
                
                <!-- Main Content -->
                <div class="absolute left-[190px] right-[64px] top-[64px] bottom-[64px] overflow-y-auto" id="search-content">
                    <!-- Header & Search Input -->
                    <div class="mb-[40px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-[24px]" data-i18n="search">
                            Search
                        </h1>
                        
                        <!-- Search Input -->
                        <div class="relative">
                            <input type="text" 
                                   id="search-input" 
                                   class="w-full bg-[rgba(255,255,255,0.1)] text-white font-['Ubuntu',Helvetica] text-[24px] px-[24px] py-[16px] rounded-[10px] border-2 border-transparent focus:border-white outline-none focusable"
                                   placeholder="Search for stations..."
                                   data-focus-index="5"
                                   data-i18n-placeholder="search_placeholder">
                            <div class="absolute right-[24px] top-[50%] translate-y-[-50%]">
                                <img src="${Utils.assetPath('images/search-icon.svg')}" 
                                     alt="Search" 
                                     class="w-[24px] h-[24px] opacity-50">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Results Section -->
                    <div id="results-section">
                        <!-- Results will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-search').html(html);
        this.updateSidebar();
        console.log('[Search] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('search', 0, this.keys.focused_index);
        $('#search-sidebar').html(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Search input with debounce
        $('#search-input').on('input', function() {
            var query = $(this).val().trim();
            
            if (self.searchTimeout) {
                clearTimeout(self.searchTimeout);
            }
            
            self.searchTimeout = setTimeout(function() {
                console.log('[Search] Searching for:', query);
                self.performSearch(query);
            }, 400); // 400ms debounce
        });
        
        // Station card click
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Search] Station clicked:', stationId);
            
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
        
        // Load popular stations as fallback
        MegaRadioAPI.getPopularStations(countryCode, 24)
            .then(function(stations) {
                self.data.popularStations = stations;
                self.renderPopularStations();
                Utils.hideLoading();
            })
            .catch(function(error) {
                console.error('[Search] Error loading popular stations:', error);
                Utils.hideLoading();
            });
    },
    
    performSearch: function(query) {
        var self = this;
        
        if (!query) {
            this.renderPopularStations();
            return;
        }
        
        Utils.showLoading();
        
        MegaRadioAPI.searchStations(query, State.get('currentCountryCode'), 50)
            .then(function(results) {
                self.data.searchResults = results;
                self.renderSearchResults(query);
                Utils.hideLoading();
            })
            .catch(function(error) {
                console.error('[Search] Error searching:', error);
                Utils.hideLoading();
            });
    },
    
    renderPopularStations: function() {
        var html = '<h2 class="font-[\'Ubuntu\',Helvetica] font-bold text-[32px] text-white mb-[24px]" data-i18n="popular_stations">Popular Stations</h2>';
        html += '<div class="grid grid-cols-6 gap-[24px]">';
        
        var self = this;
        this.data.popularStations.forEach(function(station, index) {
            var focusIndex = 6 + index; // After sidebar and search input
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
        
        html += '</div>';
        $('#results-section').html(html);
    },
    
    renderSearchResults: function(query) {
        var html = '<h2 class="font-[\'Ubuntu\',Helvetica] font-bold text-[32px] text-white mb-[24px]">';
        html += '<span data-i18n="search_results_for">Results for</span> "' + query + '"';
        html += '</h2>';
        
        if (this.data.searchResults.length === 0) {
            html += '<p class="font-[\'Ubuntu\',Helvetica] text-[20px] text-[#9b9b9b]" data-i18n="no_results">No results found</p>';
            $('#results-section').html(html);
            return;
        }
        
        html += '<div class="grid grid-cols-6 gap-[24px]">';
        
        var self = this;
        this.data.searchResults.forEach(function(station, index) {
            var focusIndex = 6 + index;
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
        
        html += '</div>';
        $('#results-section').html(html);
    },
    
    getStationImage: function(station) {
        if (station.favicon) {
            return station.favicon.startsWith('http') 
                ? station.favicon 
                : 'https://themegaradio.com/api/image/' + encodeURIComponent(station.favicon);
        }
        return Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE);
    },
    
    findStation: function(stationId) {
        var allStations = this.data.searchResults.length > 0 
            ? this.data.searchResults 
            : this.data.popularStations;
        
        return allStations.find(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
    },
    
    cleanup: function() {
        console.log('[Search] Cleaning up...');
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        $('#search-input').off('input');
        $(document).off('click', '.station-card');
    }
};
