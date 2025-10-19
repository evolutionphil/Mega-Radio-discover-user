/**
 * Mega Radio - Discover Page
 * EXACT Figma design implementation (1920x1080)
 * 
 * Layout:
 * - Background image at left: -10px, top: -523px, size: 1939x1292px
 * - Sidebar at left: 64px, top: 242px (98x638px)
 * - Popular Genres section at left: 236px, top: 242px
 * - Popular Radios section at left: 236px, top: 465px (8-column grid)
 * - More From Austria section at left: 236px, top: 1181px (8-column grid)
 */

var discover_page = {
    keys: {
        focused_index: 0,
        total_items: 0
    },
    
    data: {
        genres: [],
        popularStations: [],
        austriaStations: []
    },
    
    init: function() {
        console.log('[Discover] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        // Build complete layout with EXACT Figma positioning - SCROLLABLE VERSION
        var html = `
            <div style="position: relative; top: 0; left: 0; width: 1920px; min-height: 1900px; overflow-y: auto; background: #0e0e0e;">
                <!-- Background Image (exact Figma position: left: -10px, top: -523px) - FIXED for scroll -->
                <div style="position: fixed; left: -10px; top: -523px; width: 1939px; height: 1292px; z-index: 0;">
                    <img src="${Utils.assetPath('images/hand-crowd-disco-1.png')}" 
                         alt="Background" 
                         style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                </div>
                
                <!-- Gradient Overlay (from rgba(14,14,14,0) 0.88% to #0e0e0e 48.611%) - FIXED for scroll -->
                <div style="position: fixed; top: 0; left: 0; width: 1920px; height: 1080px; background: linear-gradient(180deg, rgba(14, 14, 14, 0) 0.88%, #0e0e0e 48.611%); z-index: 1; pointer-events: none;"></div>
                
                <!-- Logo (top-left) -->
                <div style="position: absolute; left: 64px; top: 31px; width: 323px; height: 112px; z-index: 10;">
                    <p style="position: absolute; bottom: 0; left: 18.67%; right: 0; top: 46.16%; font-family: 'Ubuntu', Helvetica; font-size: 53px; font-weight: 400; color: #ffffff; font-style: normal; line-height: normal; white-space: pre-wrap; margin: 0;">
                        <span style="font-weight: 700;">mega</span>radio
                    </p>
                    <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                        <img alt="Logo" 
                             style="width: 100%; height: 100%; object-fit: contain;" 
                             src="${Utils.assetPath('images/path-8-figma.svg')}">
                    </div>
                </div>
                
                <!-- Equalizer Icon -->
                <div class="focusable" 
                     data-focus-index="0"
                     style="position: absolute; left: 1281px; top: 67px; width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 10;"
                     data-testid="button-equalizer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="10" width="2" height="11" fill="#ffffff"/>
                        <rect x="8" y="6" width="2" height="15" fill="#ffffff"/>
                        <rect x="13" y="3" width="2" height="18" fill="#ffffff"/>
                        <rect x="18" y="8" width="2" height="13" fill="#ffffff"/>
                    </svg>
                </div>
                
                <!-- Country Selector - Austria -->
                <div class="focusable" 
                     id="tv-country-selector"
                     data-focus-index="1"
                     style="position: absolute; left: 1351px; top: 67px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 12px 20px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: row; align-items: center; gap: 12px; z-index: 10;"
                     data-testid="button-country-selector">
                    <span style="font-size: 24px;">🇦🇹</span>
                    <span style="font-family: 'Ubuntu', Helvetica; font-size: 20px; font-weight: 500; color: #ffffff; font-style: normal; line-height: normal;">Austria</span>
                    <span style="font-family: 'Ubuntu', Helvetica; font-size: 16px; font-weight: 400; color: #ffffff; font-style: normal; line-height: normal;">▼</span>
                </div>
                
                <!-- User Profile - Talha Çay -->
                <div class="focusable" 
                     id="tv-user-profile"
                     data-focus-index="2"
                     style="position: absolute; left: 1648px; top: 59px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 8px 16px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: row; align-items: center; gap: 12px; z-index: 10;"
                     data-testid="button-user-profile">
                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.2); border-radius: 24px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" fill="#ffffff"/>
                            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="#ffffff"/>
                        </svg>
                    </div>
                    <span style="font-family: 'Ubuntu', Helvetica; font-size: 18px; font-weight: 500; color: #ffffff; font-style: normal; line-height: normal;">Talha Çay</span>
                </div>
                
                <!-- Popular Genres Section -->
                <div style="position: absolute; left: 236px; top: 242px; z-index: 5;">
                    <h2 style="font-family: 'Ubuntu', Helvetica; font-size: 32px; font-weight: 700; color: #ffffff; font-style: normal; line-height: normal; margin: 0 0 32px 0;" 
                        data-testid="text-popular-genres">
                        Popular Genres
                    </h2>
                    <!-- Genre Pills Container (starts at top: 316px from screen top = 74px from section top) -->
                    <div style="display: flex; flex-direction: row; gap: 16px; overflow-x: auto; overflow-y: hidden; padding-bottom: 16px; -webkit-overflow-scrolling: touch; max-width: 1648px;" 
                         id="genres-container"
                         data-testid="container-genres">
                        <!-- Genres will be dynamically inserted here -->
                    </div>
                </div>
                
                <!-- Popular Radios Section -->
                <div style="position: absolute; left: 236px; top: 465px; z-index: 5;">
                    <div style="position: relative; margin-bottom: 55px;">
                        <h2 style="font-family: 'Ubuntu', Helvetica; font-size: 32px; font-weight: 700; color: #ffffff; font-style: normal; line-height: normal; margin: 0;" 
                            data-testid="text-popular-radios">
                            Popular Radios
                        </h2>
                        <!-- "See More" text at left: 1792.5px (relative to screen, so 1556.5px from section) -->
                        <div class="focusable"
                             data-focus-index="see-more-popular"
                             style="position: absolute; left: 1556.5px; top: 19px; transform: translateX(-50%); cursor: pointer; transition: all 0.2s;"
                             data-testid="button-see-more-popular">
                            <span style="font-family: 'Ubuntu', Helvetica; font-size: 18px; font-weight: 400; color: #9b9b9b; font-style: normal; line-height: normal;">See More</span>
                        </div>
                    </div>
                    <!-- Station Grid Container (8 columns, starts at top: 539px from screen = 74px from section) -->
                    <div style="position: relative; width: 1648px; height: 588px;" 
                         id="popular-stations-container"
                         data-testid="container-popular-stations">
                        <!-- Stations will be dynamically positioned here -->
                    </div>
                </div>
                
                <!-- More From Austria Section -->
                <div style="position: absolute; left: 236px; top: 1181px; z-index: 5;">
                    <div style="position: relative; margin-bottom: 55px;">
                        <h2 style="font-family: 'Ubuntu', Helvetica; font-size: 32px; font-weight: 700; color: #ffffff; font-style: normal; line-height: normal; margin: 0;" 
                            data-testid="text-more-from-austria">
                            More From Austria
                        </h2>
                        <!-- "See More" text at left: 1792.5px (relative to screen, so 1556.5px from section) -->
                        <div class="focusable"
                             data-focus-index="see-more-austria"
                             style="position: absolute; left: 1556.5px; top: 5px; transform: translateX(-50%); cursor: pointer; transition: all 0.2s;"
                             data-testid="button-see-more-austria">
                            <span style="font-family: 'Ubuntu', Helvetica; font-size: 18px; font-weight: 400; color: #9b9b9b; font-style: normal; line-height: normal;">See More</span>
                        </div>
                    </div>
                    <!-- Station Grid Container (8 columns, starts at top: 1255px from screen = 74px from section) -->
                    <div style="position: relative; width: 1648px; height: 588px;" 
                         id="austria-stations-container"
                         data-testid="container-austria-stations">
                        <!-- Stations will be dynamically positioned here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-discover').html(html);
        
        // Render sidebar after main content
        this.updateSidebar();
        
        console.log('[Discover] Rendered');
    },
    
    updateSidebar: function() {
        // Sidebar renders at exact position: left: 64px, top: 242px (98x638px)
        var sidebarHtml = Sidebar.render('discover', 0, this.keys.focused_index);
        $('#page-discover').append(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Country selector click
        $(document).on('click', '#tv-country-selector', function() {
            console.log('[Discover] Country selector clicked');
            CountryModal.show();
        });
        
        // User profile click
        $(document).on('click', '#tv-user-profile', function() {
            console.log('[Discover] User profile clicked');
        });
        
        // Equalizer click
        $(document).on('click', '[data-testid="button-equalizer"]', function() {
            console.log('[Discover] Equalizer clicked');
        });
        
        // Genre pill click
        $(document).on('click', '.genre-pill', function() {
            var genreSlug = $(this).data('genre-slug');
            console.log('[Discover] Genre clicked:', genreSlug);
        });
        
        // Station card click
        $(document).on('click', '.station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[Discover] Station clicked:', stationId);
            
            var station = self.findStation(stationId);
            if (station) {
                GlobalPlayer.play(station);
                AppRouter.navigate('radio-playing');
            }
        });
        
        // See More clicks
        $(document).on('click', '[data-testid="button-see-more-popular"]', function() {
            console.log('[Discover] See More Popular clicked');
        });
        
        $(document).on('click', '[data-testid="button-see-more-austria"]', function() {
            console.log('[Discover] See More Austria clicked');
        });
        
        // See More card click
        $(document).on('click', '.see-more-card', function() {
            var section = $(this).data('section');
            console.log('[Discover] See More card clicked:', section);
        });
    },
    
    loadData: function() {
        var self = this;
        var countryCode = 'AT'; // Austria
        
        Promise.all([
            MegaRadioAPI.getAllGenres(countryCode),
            MegaRadioAPI.getPopularStations(countryCode, 50),
            MegaRadioAPI.getPopularStations(countryCode, 50) // For Austria section
        ]).then(function(results) {
            self.data.genres = results[0] || [];
            self.data.popularStations = results[1] || [];
            self.data.austriaStations = results[2] || [];
            
            self.renderGenres();
            self.renderPopularStations();
            self.renderAustriaStations();
        }).catch(function(error) {
            console.error('[Discover] Error loading data:', error);
        });
    },
    
    renderGenres: function() {
        var html = '';
        var topGenres = this.data.genres.slice(0, 10);
        
        topGenres.forEach(function(genre, index) {
            var focusIndex = 100 + index; // Start at 100 for genres
            var isHipHop = genre.name && genre.name.toLowerCase().includes('hip hop');
            
            // Pills: padding: 28px 72px, rounded-[20px], bg: rgba(255,255,255,0.14)
            // Focused pill (Hip Hop): border: 5.5px solid #b4b4b4
            // Inset shadow: inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)
            var pillStyle = 'padding: 28px 72px; border-radius: 20px; background: rgba(255, 255, 255, 0.14); ' +
                           'box-shadow: inset 1.1px 1.1px 12.1px 0px rgba(255, 255, 255, 0.12); ' +
                           'display: flex; align-items: center; justify-content: center; flex-shrink: 0; ' +
                           'cursor: pointer; transition: all 0.2s;';
            
            if (isHipHop) {
                pillStyle += ' border: 5.5px solid #b4b4b4;';
            }
            
            html += `
                <div class="genre-pill focusable" 
                     style="${pillStyle}"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug || genre.name.toLowerCase().replace(/\s+/g, '-')}"
                     data-testid="button-genre-${index}">
                    <span style="font-family: 'Ubuntu', Helvetica; font-size: 20px; font-weight: 700; color: #ffffff; font-style: normal; line-height: normal; white-space: nowrap;">
                        ${genre.name}
                    </span>
                </div>
            `;
        });
        
        $('#genres-container').html(html);
    },
    
    renderPopularStations: function() {
        var html = '';
        var self = this;
        
        // 8-column grid with absolute positioning
        // Columns at: 0, 230, 460, 690, 920, 1150, 1380, 1610 (230px spacing)
        // Rows at: 0, 294 (294px spacing)
        var columns = [0, 230, 460, 690, 920, 1150, 1380, 1610];
        var rows = [0, 294];
        
        // Show up to 15 stations (7 in first row, 7 in second row, + 1 "See More" card)
        var stations = this.data.popularStations.slice(0, 15);
        
        stations.forEach(function(station, index) {
            var col = index % 8;
            var row = Math.floor(index / 8);
            
            if (row >= 2) return; // Only show 2 rows
            
            var left = columns[col];
            var top = rows[row];
            var focusIndex = 200 + index; // Start at 200 for popular stations
            
            html += self.renderStationCard(station, left, top, focusIndex, index, 'popular');
        });
        
        // Add "See More" card at position: left: 1380px (7th column), top: 294px (second row)
        if (stations.length >= 15) {
            html += self.renderSeeMoreCard(1380, 294, 'popular-see-more', 'popular');
        }
        
        $('#popular-stations-container').html(html);
    },
    
    renderAustriaStations: function() {
        var html = '';
        var self = this;
        
        // Same 8-column grid layout
        var columns = [0, 230, 460, 690, 920, 1150, 1380, 1610];
        var rows = [0, 294];
        
        var stations = this.data.austriaStations.slice(0, 15);
        
        stations.forEach(function(station, index) {
            var col = index % 8;
            var row = Math.floor(index / 8);
            
            if (row >= 2) return;
            
            var left = columns[col];
            var top = rows[row];
            var focusIndex = 300 + index; // Start at 300 for austria stations
            
            html += self.renderStationCard(station, left, top, focusIndex, index, 'austria');
        });
        
        // Add "See More" card at position: left: 1380px, top: 294px
        if (stations.length >= 15) {
            html += self.renderSeeMoreCard(1380, 294, 'austria-see-more', 'austria');
        }
        
        $('#austria-stations-container').html(html);
    },
    
    renderStationCard: function(station, left, top, focusIndex, index, section) {
        var stationImage = this.getStationImage(station);
        var stationName = station.name || 'Unknown Station';
        var stationGenre = station.tags || station.country || '';
        
        // Cards: 200x264px, bg: rgba(255,255,255,0.14), rounded-[11px]
        // Logo container: 132x132px white bg, rounded-[6.6px], centered at 34px from edges
        // Station name: 22px Ubuntu Medium, centered, top: 187px
        // Genre: 18px Ubuntu Light, centered, top: 218.2px
        // Inset shadow on card: inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)
        
        return `
            <div class="station-card focusable" 
                 style="position: absolute; left: ${left}px; top: ${top}px; width: 200px; height: 264px; cursor: pointer; transition: all 0.2s;"
                 data-focus-index="${focusIndex}"
                 data-station-id="${station.stationuuid || station._id}"
                 data-testid="card-station-${section}-${index}">
                <div style="width: 200px; height: 264px; background: rgba(255, 255, 255, 0.14); border-radius: 11px; box-shadow: inset 1.1px 1.1px 12.1px 0px rgba(255, 255, 255, 0.12); overflow: hidden; position: relative;">
                    <!-- Logo Container (132x132px, centered at 34px from edges) -->
                    <div style="position: absolute; left: 34px; top: 34px; width: 132px; height: 132px; background: #ffffff; border-radius: 6.6px; overflow: hidden;">
                        <img src="${stationImage}" 
                             alt="${stationName}" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block;"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                    </div>
                    
                    <!-- Station Name (22px Ubuntu Medium, centered, top: 187px) -->
                    <div style="position: absolute; left: 0; right: 0; top: 187px; text-align: center; padding: 0 12px;">
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 22px; font-weight: 500; color: #ffffff; font-style: normal; line-height: normal; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${stationName}
                        </p>
                    </div>
                    
                    <!-- Genre (18px Ubuntu Light, centered, top: 218.2px) -->
                    <div style="position: absolute; left: 0; right: 0; top: 218.2px; text-align: center; padding: 0 12px;">
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 18px; font-weight: 300; color: #9b9b9b; font-style: normal; line-height: normal; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${stationGenre}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSeeMoreCard: function(left, top, focusIndex, section) {
        // "See More" card with same dimensions and styling as station cards
        return `
            <div class="see-more-card focusable" 
                 style="position: absolute; left: ${left}px; top: ${top}px; width: 200px; height: 264px; cursor: pointer; transition: all 0.2s;"
                 data-focus-index="${focusIndex}"
                 data-section="${section}"
                 data-testid="card-see-more-${section}">
                <div style="width: 200px; height: 264px; background: rgba(255, 255, 255, 0.14); border-radius: 11px; box-shadow: inset 1.1px 1.1px 12.1px 0px rgba(255, 255, 255, 0.12); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 12px;">
                            <circle cx="24" cy="24" r="20" stroke="#ffffff" stroke-width="2"/>
                            <path d="M24 16V32M16 24H32" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 20px; font-weight: 500; color: #ffffff; font-style: normal; line-height: normal; margin: 0;">
                            See More
                        </p>
                    </div>
                </div>
            </div>
        `;
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
        
        // Search in popular stations
        this.data.popularStations.forEach(function(station) {
            if ((station.stationuuid || station._id) === stationId) {
                found = station;
            }
        });
        
        // Search in austria stations if not found
        if (!found) {
            this.data.austriaStations.forEach(function(station) {
                if ((station.stationuuid || station._id) === stationId) {
                    found = station;
                }
            });
        }
        
        return found;
    },
    
    cleanup: function() {
        console.log('[Discover] Cleaning up...');
        $(document).off('click', '#tv-country-selector');
        $(document).off('click', '#tv-user-profile');
        $(document).off('click', '[data-testid="button-equalizer"]');
        $(document).off('click', '.genre-pill');
        $(document).off('click', '.station-card');
        $(document).off('click', '[data-testid="button-see-more-popular"]');
        $(document).off('click', '[data-testid="button-see-more-austria"]');
        $(document).off('click', '.see-more-card');
    }
};
