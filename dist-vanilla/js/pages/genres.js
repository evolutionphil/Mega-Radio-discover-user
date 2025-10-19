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
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-genres">
                <!-- Sidebar -->
                <div id="genres-sidebar"></div>
                
                <!-- Main Content -->
                <div class="absolute left-[190px] right-[64px] top-[64px] bottom-[64px] overflow-y-auto" id="genres-content">
                    <!-- Header -->
                    <div class="mb-[40px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-[16px]" data-i18n="genres">
                            Genres
                        </h1>
                        <p class="font-['Ubuntu',Helvetica] text-[20px] text-[#9b9b9b]">
                            <span data-i18n="browse_by_genre">Browse by genre from</span> ${currentCountry}
                        </p>
                    </div>
                    
                    <!-- Genres Grid -->
                    <div class="grid grid-cols-6 gap-[24px]" id="genres-grid-container">
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
            'from-pink-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-green-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-purple-500 to-pink-600',
            'from-cyan-500 to-blue-600'
        ];
        
        this.data.genres.forEach(function(genre, index) {
            var focusIndex = 5 + index; // After sidebar (0-4)
            var colorClass = colors[index % colors.length];
            
            html += `
                <div class="genre-card focusable cursor-pointer transition-all duration-200"
                     data-focus-index="${focusIndex}"
                     data-genre-slug="${genre.slug}"
                     data-genre-name="${genre.name}">
                    <div class="bg-gradient-to-r ${colorClass} rounded-[10px] h-[150px] flex flex-col items-center justify-center p-[20px]">
                        <p class="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white text-center mb-[8px]">
                            ${genre.name}
                        </p>
                        <p class="font-['Ubuntu',Helvetica] text-[16px] text-white opacity-80">
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
