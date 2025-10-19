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
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;" data-testid="page-favorites">
                <!-- Sidebar -->
                <div id="favorites-sidebar"></div>
                
                <!-- Main Content -->
                <div style="position: absolute; left: 190px; right: 64px; top: 64px; bottom: 64px; overflow-y: auto;" id="favorites-content">
                    <!-- Header -->
                    <div style="margin-bottom: 40px;">
                        <h1 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 48px; color: #ffffff; margin-bottom: 16px;" data-i18n="nav_your_favorites">
                            Your Favorites
                        </h1>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 20px; color: #9b9b9b;">
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
                <div class="d-flex flex-column align-items-center justify-content-center" style="padding: 100px 0;">
                    <div style="margin-bottom: 32px;">
                        <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                             alt="No favorites" 
                             style="width: 120px; height: 120px; opacity: 0.3;">
                    </div>
                    <h2 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 32px; color: #ffffff; margin-bottom: 16px;" data-i18n="no_favorites">
                        No favorites yet
                    </h2>
                    <p style="font-family: 'Ubuntu', Helvetica; font-size: 20px; color: #9b9b9b; margin-bottom: 32px;" data-i18n="no_favorites_description">
                        Start adding stations to your favorites
                    </p>
                    <button id="go-to-discover-btn" 
                            class="focusable"
                            style="background: linear-gradient(to right, #ec4899, #9333ea); color: #ffffff; font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 20px; padding: 16px 32px; border-radius: 10px; cursor: pointer; transition: all 0.2s; border: none;"
                            data-focus-index="5">
                        <span data-i18n="discover_stations">Discover Stations</span>
                    </button>
                </div>
            `;
        } else {
            // Grid of favorite stations
            html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 24px;">';
            
            var self = this;
            this.data.favoriteStations.forEach(function(station, index) {
                var focusIndex = 5 + index; // After sidebar (0-4)
                var stationImage = self.getStationImage(station);
                
                html += `
                    <div class="station-card focusable" 
                         style="cursor: pointer; transition: all 0.2s;"
                         data-focus-index="${focusIndex}"
                         data-station-id="${station.stationuuid || station._id}">
                        <div style="background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; position: relative;">
                            <div style="position: absolute; top: 8px; right: 8px; z-index: 10;">
                                <div style="background: #ec4899; border-radius: 50%; padding: 8px;">
                                    <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                                         alt="Favorite" 
                                         style="width: 16px; height: 16px;">
                                </div>
                            </div>
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
