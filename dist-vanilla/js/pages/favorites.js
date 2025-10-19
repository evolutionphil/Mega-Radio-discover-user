/**
 * Mega Radio - Favorites Page
 * Shows user's favorite stations with sidebar
 */

var favorites_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        favoriteStations: []
    },
    
    init: function() {
        console.log('[Favorites] Initializing...');
        this.loadFavorites();
        this.render();
        this.bindEvents();
    },
    
    loadFavorites: function() {
        // Load favorites from state
        this.data.favoriteStations = State.get('favoriteStations') || [];
        console.log('[Favorites] Loaded', this.data.favoriteStations.length, 'favorites');
    },
    
    render: function() {
        var html = `
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-favorites">
                <!-- Sidebar -->
                <div id="favorites-sidebar"></div>
                
                <!-- Main Content -->
                <div class="absolute left-[190px] right-[64px] top-[64px] bottom-[64px] overflow-y-auto" id="favorites-content">
                    <!-- Header -->
                    <div class="mb-[40px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-[16px]" data-i18n="nav_your_favorites">
                            Your Favorites
                        </h1>
                        <p class="font-['Ubuntu',Helvetica] text-[20px] text-[#9b9b9b]">
                            ${this.data.favoriteStations.length} <span data-i18n="favorite_stations">favorite stations</span>
                        </p>
                    </div>
                    
                    <!-- Favorites Grid or Empty State -->
                    <div id="favorites-container">
                        <!-- Favorites will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-favorites').html(html);
        this.updateSidebar();
        this.renderFavorites();
        console.log('[Favorites] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('favorites', 0, this.keys.focused_index);
        $('#favorites-sidebar').html(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Station card click
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Favorites] Station clicked:', stationId);
            
            var station = self.findStation(stationId);
            if (station) {
                GlobalPlayer.play(station);
                AppRouter.navigate('radio-playing');
            }
        });
        
        // Discover button click (empty state)
        $(document).on('click', '#go-to-discover-btn', function() {
            console.log('[Favorites] Go to Discover clicked');
            AppRouter.navigate('discover');
        });
    },
    
    renderFavorites: function() {
        var html = '';
        
        if (this.data.favoriteStations.length === 0) {
            // Empty state
            html = `
                <div class="flex flex-col items-center justify-center py-[100px]">
                    <div class="mb-[32px]">
                        <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                             alt="No favorites" 
                             class="w-[120px] h-[120px] opacity-30">
                    </div>
                    <h2 class="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-[16px]" data-i18n="no_favorites">
                        No favorites yet
                    </h2>
                    <p class="font-['Ubuntu',Helvetica] text-[20px] text-[#9b9b9b] mb-[32px]" data-i18n="no_favorites_description">
                        Start adding stations to your favorites
                    </p>
                    <button id="go-to-discover-btn" 
                            class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-['Ubuntu',Helvetica] font-bold text-[20px] px-[32px] py-[16px] rounded-[10px] focusable cursor-pointer transition-all duration-200"
                            data-focus-index="5">
                        <span data-i18n="discover_stations">Discover Stations</span>
                    </button>
                </div>
            `;
        } else {
            // Grid of favorite stations
            html = '<div class="grid grid-cols-7 gap-[24px]">';
            
            var self = this;
            this.data.favoriteStations.forEach(function(station, index) {
                var focusIndex = 5 + index; // After sidebar (0-4)
                var stationImage = self.getStationImage(station);
                
                html += `
                    <div class="station-card focusable cursor-pointer transition-all duration-200"
                         data-focus-index="${focusIndex}"
                         data-station-id="${station.stationuuid || station._id}">
                        <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] overflow-hidden relative">
                            <div class="absolute top-[8px] right-[8px] z-10">
                                <div class="bg-pink-500 rounded-full p-[8px]">
                                    <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                                         alt="Favorite" 
                                         class="w-[16px] h-[16px]">
                                </div>
                            </div>
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
        }
        
        $('#favorites-container').html(html);
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
        return this.data.favoriteStations.find(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
    },
    
    cleanup: function() {
        console.log('[Favorites] Cleaning up...');
        $(document).off('click', '.station-card');
        $(document).off('click', '#go-to-discover-btn');
    }
};
