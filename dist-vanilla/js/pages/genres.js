/**
 * Mega Radio - Genres Page
 * Shows all genres in a grid with sidebar
 */

var genres_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        genres: []
    },
    
    init: function() {
        console.log('[Genres] Initializing...');
        this.render();
        this.bindEvents();
        this.loadData();
    },
    
    render: function() {
        var currentCountry = State.get('currentCountry') || AppConfig.DEFAULT_COUNTRY;
        
        var html = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;" data-testid="page-genres">
                <!-- Sidebar -->
                <div id="genres-sidebar"></div>
                
                <!-- Main Content -->
                <div style="position: absolute; left: 190px; right: 64px; top: 64px; bottom: 64px; overflow-y: auto;" id="genres-content">
                    <!-- Header -->
                    <div style="margin-bottom: 40px;">
                        <h1 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 48px; color: #ffffff; margin-bottom: 16px;" data-i18n="genres">
                            Genres
                        </h1>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 20px; color: #9b9b9b;">
                            <span data-i18n="browse_by_genre">Browse by genre from</span> ${currentCountry}
                        </p>
                    </div>
                    
                    <!-- Genres Grid -->
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px;" id="genres-grid-container">
                        <!-- Genres will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;
        
        $('#page-genres').html(html);
        this.updateSidebar();
        console.log('[Genres] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('genres', 0, this.keys.focused_index);
        $('#genres-sidebar').html(sidebarHtml);
    },
    
    bindEvents: function() {
        // Genre card click
        $(document).on('click', '.genre-card', function() {
            var genreSlug = $(this).data('genre-slug');
            var genreName = $(this).data('genre-name');
            console.log('[Genres] Genre clicked:', genreName, genreSlug);
            AppRouter.navigate('genre-detail?genre=' + genreSlug);
        });
    },
    
    loadData: function() {
        var self = this;
        var countryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        
        Utils.showLoading();
        
        // Get working stations to extract genres
        MegaRadioAPI.getWorkingStations(countryCode, 50)
            .then(function(stations) {
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
                
                self.renderGenres();
                Utils.hideLoading();
            })
            .catch(function(error) {
                console.error('[Genres] Error loading data:', error);
                Utils.hideLoading();
            });
    },
    
    renderGenres: function() {
        var html = '';
        var colors = [
            'linear-gradient(to right, #ec4899, #9333ea)',
            'linear-gradient(to right, #3b82f6, #06b6d4)',
            'linear-gradient(to right, #10b981, #14b8a6)',
            'linear-gradient(to right, #f97316, #ef4444)',
            'linear-gradient(to right, #a855f7, #ec4899)',
            'linear-gradient(to right, #06b6d4, #3b82f6)'
        ];
        
        this.data.genres.forEach(function(genre, index) {
            var focusIndex = 5 + index; // After sidebar (0-4)
            var colorStyle = colors[index % colors.length];
            
            html += `
                <div class="genre-card focusable" 
                     style="cursor: pointer; transition: all 0.2s;"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug}"
                     data-genre-name="${genre.name}">
                    <div class="d-flex flex-column align-items-center justify-content-center" 
                         style="background: ${colorStyle}; border-radius: 10px; height: 150px; padding: 20px;">
                        <p style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 24px; color: #ffffff; text-align: center; margin-bottom: 8px;">
                            ${genre.name}
                        </p>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 16px; color: #ffffff; opacity: 0.8;">
                            ${genre.stationCount} <span data-i18n="stations">stations</span>
                        </p>
                    </div>
                </div>
            `;
        });
        
        $('#genres-grid-container').html(html);
    },
    
    cleanup: function() {
        console.log('[Genres] Cleaning up...');
        $(document).off('click', '.genre-card');
    }
};
