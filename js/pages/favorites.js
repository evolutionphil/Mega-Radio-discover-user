/**
 * Mega Radio - Favorites Page
 * Shows user's favorite stations with EXACT Figma design for empty and filled states
 * Screen: 1920x1080
 */

var favorites_page = {
    keys: {
        focused_index: 0,
        total_items: 0
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
                
                <!-- Page Title - Favorites at exact Figma position: left:308px, top:58px -->
                <h1 style="${StyleHelpers.position(308, 58, 'auto', 'auto')} ${StyleHelpers.text(32, TVTypography.weightBold, TVColors.white)} margin: 0; z-index: 5;" 
                    data-i18n="nav_favorites"
                    data-testid="text-page-title">
                    Favorites
                </h1>
                
                <!-- Content Area -->
                <div id="favorites-content-area" style="${StyleHelpers.position(308, 136, 1500, 'auto')} z-index: 5; padding-bottom: 64px;">
                    <!-- Dynamic content will be inserted here -->
                </div>
            </div>
        `;
        
        $('#page-favorites').html(html);
        
        // Render sidebar after main content
        this.updateSidebar();
        
        // Render favorites or empty state
        this.renderContent();
        
        console.log('[Favorites] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('favorites', 0, this.keys.focused_index);
        $('#page-favorites').append(sidebarHtml);
    },
    
    renderContent: function() {
        if (this.data.favoriteStations.length === 0) {
            this.renderEmptyState();
        } else {
            this.renderStationsGrid();
        }
    },
    
    renderEmptyState: function() {
        // EXACT Figma positioning for empty state
        // Heart icon: 124x124px at left:986px, top:365px (relative to screen)
        // Adjusted for content area offset (308px left, 136px top)
        var heartLeft = 986 - 308; // 678px
        var heartTop = 365 - 136;  // 229px
        
        // Text: left:1047.5px, top:504px, translate-x:-50%
        var textLeft = 1047.5 - 308; // 739.5px
        var textTop = 504 - 136;     // 368px
        
        // Pink link: top:676px
        var linkTop = 676 - 136; // 540px
        
        var html = `
            <div style="position: relative; width: 100%; min-height: 600px;" data-testid="empty-state-favorites">
                <!-- Heart Icon - EXACT Figma: left:986px (relative to content: 678px), top:365px (relative to content: 229px), 124x124px -->
                <div style="position: absolute; left: ${heartLeft}px; top: ${heartTop}px; width: 124px; height: 124px;">
                    <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                         alt="No favorites" 
                         style="width: 124px; height: 124px; opacity: 0.3;"
                         data-testid="icon-empty-heart">
                </div>
                
                <!-- Text - EXACT Figma: left:1047.5px (relative to content: 739.5px), top:504px (relative to content: 368px), translate-x:-50% -->
                <div style="position: absolute; left: ${textLeft}px; top: ${textTop}px; transform: translateX(-50%);">
                    <p style="${StyleHelpers.text(32, TVTypography.weightBold, TVColors.white, 'center')} margin: 0; white-space: nowrap;" 
                       data-i18n="no_favorites"
                       data-testid="text-no-favorites">
                        You don't have any favorites yet
                    </p>
                </div>
                
                <!-- Pink Link - EXACT Figma: top:676px (relative to content: 540px), color:#ff4199 -->
                <div style="position: absolute; left: ${textLeft}px; top: ${linkTop}px; transform: translateX(-50%); ${StyleHelpers.flex('row', 'center', 'center', 8)}">
                    <a href="#" 
                       id="discover-link" 
                       class="focusable"
                       style="${StyleHelpers.text(24, TVTypography.weightMedium, TVColors.pink)} text-decoration: none; cursor: pointer; transition: all 0.2s;"
                       data-focus-index="5"
                       data-testid="link-discover-stations">
                        Discover stations near to you!
                    </a>
                    <img src="${Utils.assetPath('images/arrow.svg')}" 
                         alt="Arrow" 
                         style="width: 24px; height: 24px;"
                         data-testid="icon-arrow">
                </div>
            </div>
        `;
        
        $('#favorites-content-area').html(html);
    },
    
    renderStationsGrid: function() {
        // Station Grid: 4 columns, 30px gap, cards: 200x264px (same as Discover)
        var html = '<div style="' + StyleHelpers.grid(4, 30) + '" id="stations-grid" data-testid="grid-favorite-stations">';
        
        var self = this;
        this.data.favoriteStations.forEach(function(station, index) {
            var focusIndex = 5 + index; // After sidebar (0-4)
            var stationImage = self.getStationImage(station);
            var stationName = station.name || 'Unknown Station';
            var stationGenre = station.tags || station.country || '';
            
            html += `
                <div class="station-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}"
                     data-testid="card-station-${index}">
                    <div style="${StyleHelpers.background(TVColors.whiteOverlay05)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} overflow: hidden; width: 200px; height: 264px; position: relative;">
                        <!-- Favorite Heart Indicator -->
                        <div style="position: absolute; top: 8px; right: 8px; z-index: 10; background: ${TVColors.pink}; ${StyleHelpers.borderRadius(20)} padding: 8px; ${StyleHelpers.flex('row', 'center', 'center')}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${TVColors.white}" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        
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
        
        html += '</div>';
        
        $('#favorites-content-area').html(html);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Country selector click
        $(document).on('click', '#tv-country-selector', function() {
            console.log('[Favorites] Country selector clicked');
            CountryModal.show();
        });
        
        // User profile click
        $(document).on('click', '#tv-user-profile', function() {
            console.log('[Favorites] User profile clicked');
        });
        
        // Equalizer click
        $(document).on('click', '[data-testid="button-equalizer"]', function() {
            console.log('[Favorites] Equalizer clicked');
        });
        
        // Discover link click (empty state) - navigate to discover page
        $(document).on('click', '#discover-link', function(e) {
            e.preventDefault();
            console.log('[Favorites] Discover link clicked - navigating to discover');
            AppRouter.navigate('discover');
        });
        
        // Station card click - play station and navigate to radio-playing
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Favorites] Station clicked:', stationId);
            
            var station = self.findStation(stationId);
            if (station) {
                GlobalPlayer.play(station);
                AppRouter.navigate('radio-playing');
            }
        });
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
        
        this.data.favoriteStations.forEach(function(station) {
            if ((station.stationuuid || station._id) === stationId) {
                found = station;
            }
        });
        
        return found;
    },
    
    cleanup: function() {
        console.log('[Favorites] Cleaning up...');
        $(document).off('click', '#tv-country-selector');
        $(document).off('click', '#tv-user-profile');
        $(document).off('click', '[data-testid="button-equalizer"]');
        $(document).off('click', '#discover-link');
        $(document).off('click', '.station-card');
    }
};
