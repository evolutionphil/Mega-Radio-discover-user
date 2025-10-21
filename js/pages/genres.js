/**
 * Mega Radio - Genres Page
 * Shows all genres in two sections: Popular Genres and All Genres
 * Implements EXACT Figma design (1920x1080)
 */

var genres_page = {
    keys: {
        focused_index: 0,
        total_items: 0
    },
    
    data: {
        genres: [],
        popularGenres: [],
        allGenres: []
    },
    
    init: function() {
        console.log('[Genres] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        // Build complete layout with exact Figma positioning (same structure as discover page)
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
                    <p style="position: absolute; bottom: 0; left: 18.67%; right: 0; top: 46.16%; ${StyleHelpers.text(53, TVTypography.weightRegular, TVColors.white)} white-space: nowrap;">
                        <span style="font-weight: ${TVTypography.weightBold};">mega</span>radio
                    </p>
                    <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                        <img alt="Logo" 
                             style="width: 100%; height: 100%; object-fit: contain;" 
                             src="${Utils.assetPath('images/path-8-figma.svg')}">
                    </div>
                </div>
                
                <!-- Page Title - Genres at exact Figma position: left:308px, top:58px -->
                <h1 style="${StyleHelpers.position(308, 58, 'auto', 'auto')} ${StyleHelpers.text(32, TVTypography.weightBold, TVColors.white)} margin: 0; z-index: 5;" 
                    data-i18n="nav_genres"
                    data-testid="text-page-title">
                    Genres
                </h1>
                
                <!-- Content Area with Scrolling -->
                <div style="${StyleHelpers.position(308, 136, 1548, 850)} z-index: 5; overflow-y: auto; overflow-x: hidden; padding-right: 20px;" 
                     id="genres-content">
                    
                    <!-- Popular Genres Section -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin: 0 0 24px 0;" 
                            data-i18n="popular_genres"
                            data-testid="text-popular-genres">
                            Popular Genres
                        </h2>
                        <div style="${StyleHelpers.grid(5, 24)}" 
                             id="popular-genres-container"
                             data-testid="container-popular-genres">
                            <!-- Popular genres will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <!-- All Genres Section -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin: 0 0 24px 0;" 
                            data-i18n="all_genres"
                            data-testid="text-all-genres">
                            All Genres
                        </h2>
                        <div style="${StyleHelpers.grid(5, 24)}" 
                             id="all-genres-container"
                             data-testid="container-all-genres">
                            <!-- All genres will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-genres').html(html);
        
        // Render sidebar after main content
        this.updateSidebar();
        
        console.log('[Genres] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('genres', 0, this.keys.focused_index);
        $('#page-genres').append(sidebarHtml);
    },
    
    bindEvents: function() {
        var self = this;
        
        // Genre card click - navigate to genre detail page
        $(document).on('click', '.genre-card', function() {
            var genreSlug = $(this).data('genre-slug');
            var genreName = $(this).data('genre-name');
            console.log('[Genres] Genre clicked:', genreName, genreSlug);
            // TODO: Navigate to genre detail page
            // AppRouter.navigate('genre-detail?genre=' + genreSlug);
        });
    },
    
    loadData: function() {
        var self = this;
        var countryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        
        Utils.showLoading();
        
        // Load all genres from API
        MegaRadioAPI.getAllGenres(countryCode)
            .then(function(genres) {
                console.log('[Genres] Genres loaded:', genres ? genres.length : 0);
                
                // If API returns no genres, fallback to extracting from working stations
                if (!genres || genres.length === 0) {
                    console.log('[Genres] No genres from API, extracting from stations...');
                    return self.extractGenresFromStations(countryCode);
                }
                
                self.data.genres = genres;
                self.splitGenres();
                self.renderGenres();
                Utils.hideLoading();
            })
            .catch(function(error) {
                console.error('[Genres] Error loading genres:', error);
                // Fallback to extracting from stations
                self.extractGenresFromStations(countryCode)
                    .then(function() {
                        Utils.hideLoading();
                    });
            });
    },
    
    extractGenresFromStations: function(countryCode) {
        var self = this;
        
        return MegaRadioAPI.getWorkingStations(countryCode, 200)
            .then(function(stations) {
                console.log('[Genres] Stations loaded for extraction:', stations ? stations.length : 0);
                
                // Extract unique genres from station tags
                var genreMap = {};
                
                stations.forEach(function(station) {
                    if (!station.tags) return;
                    
                    var tags = Array.isArray(station.tags) 
                        ? station.tags 
                        : station.tags.split(',').map(function(t) { return t.trim(); });
                    
                    tags.forEach(function(tag) {
                        if (!tag) return;
                        var slug = tag.toLowerCase().replace(/\s+/g, '-');
                        
                        if (genreMap[slug]) {
                            genreMap[slug].stationCount++;
                        } else {
                            genreMap[slug] = {
                                name: tag,
                                slug: slug,
                                stationCount: 1
                            };
                        }
                    });
                });
                
                // Convert to array and filter genres with at least 3 stations
                self.data.genres = Object.values(genreMap)
                    .filter(function(g) { return g.stationCount >= 3; })
                    .sort(function(a, b) { return b.stationCount - a.stationCount; });
                
                console.log('[Genres] Extracted genres:', self.data.genres.length);
                
                self.splitGenres();
                self.renderGenres();
            });
    },
    
    splitGenres: function() {
        // Split genres into popular (top 10) and all (remaining)
        this.data.popularGenres = this.data.genres.slice(0, 10);
        this.data.allGenres = this.data.genres.slice(10);
        
        console.log('[Genres] Popular:', this.data.popularGenres.length, 'All:', this.data.allGenres.length);
    },
    
    renderGenres: function() {
        this.renderPopularGenres();
        this.renderAllGenres();
    },
    
    renderPopularGenres: function() {
        var html = '';
        var gradients = [
            'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
            'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
        ];
        
        this.data.popularGenres.forEach(function(genre, index) {
            var focusIndex = 5 + index; // After sidebar (0-4)
            var gradient = gradients[index % gradients.length];
            var stationCount = genre.stationCount || 0;
            var genreName = genre.name || 'Unknown';
            var genreSlug = genre.slug || genreName.toLowerCase().replace(/\s+/g, '-');
            
            html += `
                <div class="genre-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genreSlug}"
                     data-genre-name="${genreName}"
                     data-testid="card-genre-${index}">
                    <div style="${StyleHelpers.background(gradient)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} ${StyleHelpers.flex('column', 'center', 'center')} width: 100%; height: 200px; padding: 20px; box-sizing: border-box;">
                        <p style="${StyleHelpers.text(22, TVTypography.weightBold, TVColors.white, 'center')} margin: 0 0 8px 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            ${genreName}
                        </p>
                        <p style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.white, 'center')} margin: 0; opacity: 0.9;">
                            ${stationCount} <span data-i18n="stations">stations</span>
                        </p>
                    </div>
                </div>
            `;
        });
        
        $('#popular-genres-container').html(html);
    },
    
    renderAllGenres: function() {
        var html = '';
        var gradients = [
            'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
            'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
        ];
        
        this.data.allGenres.forEach(function(genre, index) {
            var focusIndex = 15 + index; // After sidebar (0-4) and popular genres (5-14)
            var gradient = gradients[index % gradients.length];
            var stationCount = genre.stationCount || 0;
            var genreName = genre.name || 'Unknown';
            var genreSlug = genre.slug || genreName.toLowerCase().replace(/\s+/g, '-');
            
            html += `
                <div class="genre-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genreSlug}"
                     data-genre-name="${genreName}"
                     data-testid="card-genre-${index + 10}">
                    <div style="${StyleHelpers.background(gradient)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} ${StyleHelpers.flex('column', 'center', 'center')} width: 100%; height: 200px; padding: 20px; box-sizing: border-box;">
                        <p style="${StyleHelpers.text(22, TVTypography.weightBold, TVColors.white, 'center')} margin: 0 0 8px 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            ${genreName}
                        </p>
                        <p style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.white, 'center')} margin: 0; opacity: 0.9;">
                            ${stationCount} <span data-i18n="stations">stations</span>
                        </p>
                    </div>
                </div>
            `;
        });
        
        $('#all-genres-container').html(html);
    },
    
    cleanup: function() {
        console.log('[Genres] Cleaning up...');
        $(document).off('click', '.genre-card');
    }
};
