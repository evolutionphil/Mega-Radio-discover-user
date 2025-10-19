/**
 * Mega Radio - Discover Page
 * Shows popular genres and stations with sidebar navigation
 * Implements EXACT Figma design (1920x1080)
 */

var discover_page = {
    keys: {
        focused_index: 0,
        total_items: 0
    },
    
    data: {
        genres: [],
        popularStations: []
    },
    
    init: function() {
        console.log('[Discover] Initializing...');
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
                
                <!-- Country Selector - Austria -->
                <div class="focusable" 
                     id="tv-country-selector"
                     data-focus-index="country-selector"
                     style="${StyleHelpers.position(1351, 67, 'auto', 'auto')} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} padding: 12px 20px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'flex-start', 'center', 12)} z-index: 10;"
                     data-testid="button-country-selector">
                    <span style="font-size: 24px;">🇦🇹</span>
                    <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">Austria</span>
                    <span style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.white)}">▼</span>
                </div>
                
                <!-- User Profile - Talha Çay -->
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
                    <span style="${StyleHelpers.text(18, TVTypography.weightMedium, TVColors.white)}">Talha Çay</span>
                </div>
                
                <!-- Page Title - Discover at exact Figma position: left:308px, top:58px -->
                <h1 style="${StyleHelpers.position(308, 58, 'auto', 'auto')} ${StyleHelpers.text(32, TVTypography.weightBold, TVColors.white)} margin: 0; z-index: 5;" 
                    data-i18n="nav_discover"
                    data-testid="text-page-title">
                    Discover
                </h1>
                
                <!-- Genre Pills Section (starts at top: 136px) with horizontal scroll -->
                <div style="${StyleHelpers.position(308, 136, 1500, 'auto')} z-index: 5;">
                    <div style="${StyleHelpers.flex('row', 'flex-start', 'center', 16)} overflow-x: auto; overflow-y: hidden; padding-bottom: 16px; -webkit-overflow-scrolling: touch;" 
                         id="genres-container"
                         data-testid="container-genres">
                        <!-- Genres will be dynamically inserted here -->
                    </div>
                </div>
                
                <!-- Station Grid Section (4 columns, 30px gap, cards: 200x264px) -->
                <div style="${StyleHelpers.position(308, 280, 1500, 'auto')} z-index: 5; padding-bottom: 64px;">
                    <div style="${StyleHelpers.grid(4, 30)}" 
                         id="stations-container"
                         data-testid="container-stations">
                        <!-- Stations will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-discover').html(html);
        
        // Render sidebar after main content using Sidebar.render('discover', ...)
        this.updateSidebar();
        
        console.log('[Discover] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('discover', 0, this.keys.focused_index);
        $('#page-discover').append(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Country selector click - clickable to open modal
        $(document).on('click', '#tv-country-selector', function() {
            console.log('[Discover] Country selector clicked');
            CountryModal.show();
        });
        
        // User profile click
        $(document).on('click', '#tv-user-profile', function() {
            console.log('[Discover] User profile clicked');
            // TODO: Show user profile menu
        });
        
        // Equalizer click
        $(document).on('click', '[data-testid="button-equalizer"]', function() {
            console.log('[Discover] Equalizer clicked');
            // TODO: Show equalizer controls
        });
        
        // Genre click - navigate to genre detail
        $(document).on('click', '.genre-pill', function() {
            var genreSlug = $(this).data('genre-slug');
            console.log('[Discover] Genre clicked:', genreSlug);
            // TODO: Navigate to genre detail page
        });
        
        // Station click - navigate to radio playing (focusable and clickable)
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
        var countryCode = 'AT'; // Austria
        
        // Keep existing data loading logic with MegaRadioAPI
        Promise.all([
            MegaRadioAPI.getAllGenres(countryCode),
            MegaRadioAPI.getPopularStations(countryCode, 24)
        ]).then(function(results) {
            self.data.genres = results[0] || [];
            self.data.popularStations = results[1] || [];
            
            self.renderGenres();
            self.renderStations();
        }).catch(function(error) {
            console.error('[Discover] Error loading data:', error);
        });
    },
    
    renderGenres: function() {
        var html = '';
        var topGenres = this.data.genres.slice(0, 8);
        
        topGenres.forEach(function(genre, index) {
            var focusIndex = 5 + index; // Start after sidebar (0-4)
            html += `
                <div class="genre-pill focusable" 
                     style="${StyleHelpers.background(TVGradients.pinkPurple)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} ${StyleHelpers.flex('row', 'center', 'center')} flex-shrink: 0; width: 200px; height: 80px; cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug || genre.name.toLowerCase().replace(/\s+/g, '-')}"
                     data-testid="button-genre-${index}">
                    <p style="${StyleHelpers.text(20, TVTypography.weightBold, TVColors.white, 'center')} margin: 0;">
                        ${genre.name}
                    </p>
                </div>
            `;
        });
        
        $('#genres-container').html(html);
    },
    
    renderStations: function() {
        var html = '';
        var self = this;
        
        // Station cards: 200x264px with logo, name, genre (focusable and clickable)
        this.data.popularStations.forEach(function(station, index) {
            var focusIndex = 13 + index; // After sidebar (0-4), equalizer, country, user, and genres (5-12)
            var stationImage = self.getStationImage(station);
            var stationName = station.name || 'Unknown Station';
            var stationGenre = station.tags || station.country || '';
            
            html += `
                <div class="station-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-station-id="${station.stationuuid || station._id}"
                     data-testid="card-station-${index}">
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
        
        $('#stations-container').html(html);
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
        
        this.data.popularStations.forEach(function(station) {
            if ((station.stationuuid || station._id) === stationId) {
                found = station;
            }
        });
        
        return found;
    },
    
    getCountryFlag: function(code) {
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
            'BR': '🇧🇷',
            'AT': '🇦🇹'
        };
        return flags[code] || '🌍';
    },
    
    cleanup: function() {
        console.log('[Discover] Cleaning up...');
        $(document).off('click', '#tv-country-selector');
        $(document).off('click', '#tv-user-profile');
        $(document).off('click', '[data-testid="button-equalizer"]');
        $(document).off('click', '.genre-pill');
        $(document).off('click', '.station-card');
    }
};
