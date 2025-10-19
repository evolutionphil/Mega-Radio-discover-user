/**
 * Mega Radio - Radio Playing Page
 * Full-screen view with station info and controls
 */

var radio_playing_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        currentStation: null,
        isFavorite: false
    },
    
    init: function() {
        console.log('[RadioPlaying] Initializing...');
        this.loadCurrentStation();
        this.render();
        this.bindEvents();
    },
    
    loadCurrentStation: function() {
        // Get current station from GlobalPlayer
        this.data.currentStation = GlobalPlayer.getCurrentStation();
        
        if (!this.data.currentStation) {
            console.warn('[RadioPlaying] No station loaded, redirecting to discover');
            AppRouter.navigate('discover');
            return;
        }
        
        // Check if station is favorite
        var favorites = State.get('favoriteStations') || [];
        var stationId = this.data.currentStation.stationuuid || this.data.currentStation._id;
        this.data.isFavorite = favorites.some(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
        
        console.log('[RadioPlaying] Current station:', this.data.currentStation.name);
    },
    
    render: function() {
        if (!this.data.currentStation) return;
        
        var station = this.data.currentStation;
        var stationImage = this.getStationImage(station);
        var isPlaying = GlobalPlayer.isPlaying();
        var playPauseIcon = isPlaying ? 'fa-pause' : 'fa-play';
        
        var html = `
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-radio-playing">
                <!-- Background blur effect -->
                <div class="absolute inset-0 opacity-20">
                    <img src="${stationImage}" 
                         alt="${station.name}" 
                         class="w-full h-full object-cover blur-[100px]">
                </div>
                
                <!-- Main Content -->
                <div class="relative z-10 flex flex-col items-center justify-center h-full">
                    <!-- Station Logo -->
                    <div class="mb-[48px]">
                        <div class="w-[400px] h-[400px] rounded-[20px] overflow-hidden shadow-2xl">
                            <img src="${stationImage}" 
                                 alt="${station.name}" 
                                 class="w-full h-full object-cover"
                                 onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        </div>
                    </div>
                    
                    <!-- Station Info -->
                    <div class="text-center mb-[48px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[56px] text-white mb-[16px]">
                            ${station.name}
                        </h1>
                        <p class="font-['Ubuntu',Helvetica] text-[24px] text-[#9b9b9b] mb-[8px]">
                            ${station.tags || station.country || ''}
                        </p>
                        <p class="font-['Ubuntu',Helvetica] text-[20px] text-[#9b9b9b]">
                            ${station.country || ''}
                        </p>
                    </div>
                    
                    <!-- Playback Controls -->
                    <div class="flex items-center gap-[32px]">
                        <!-- Favorite Button -->
                        <button id="favorite-btn" 
                                class="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full p-[20px] focusable cursor-pointer transition-all duration-200"
                                data-focus-index="0">
                            <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                                 alt="Favorite" 
                                 class="w-[32px] h-[32px] ${this.data.isFavorite ? 'filter-pink' : ''}">
                        </button>
                        
                        <!-- Play/Pause Button -->
                        <button id="play-pause-btn" 
                                class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-[32px] focusable cursor-pointer transition-all duration-200 scale-110"
                                data-focus-index="1">
                            <i class="fas ${playPauseIcon} text-white text-[48px]"></i>
                        </button>
                        
                        <!-- Back Button -->
                        <button id="back-btn" 
                                class="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full p-[20px] focusable cursor-pointer transition-all duration-200"
                                data-focus-index="2">
                            <i class="fas fa-arrow-left text-white text-[32px]"></i>
                        </button>
                    </div>
                    
                    <!-- Now Playing Indicator -->
                    <div class="mt-[48px] flex items-center gap-[12px]">
                        <div class="w-[8px] h-[8px] bg-pink-500 rounded-full animate-pulse"></div>
                        <p class="font-['Ubuntu',Helvetica] text-[18px] text-[#9b9b9b]" data-i18n="now_playing">
                            Now Playing
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-radio-playing').html(html);
        console.log('[RadioPlaying] Rendered');
    },
    
    bindEvents: function() {
        var self = this;
        
        // Play/Pause button
        $(document).on('click', '#play-pause-btn', function() {
            console.log('[RadioPlaying] Play/Pause clicked');
            GlobalPlayer.togglePlayPause();
            self.updatePlayPauseButton();
        });
        
        // Favorite button
        $(document).on('click', '#favorite-btn', function() {
            console.log('[RadioPlaying] Favorite clicked');
            self.toggleFavorite();
        });
        
        // Back button
        $(document).on('click', '#back-btn', function() {
            console.log('[RadioPlaying] Back clicked');
            AppRouter.navigate('discover');
        });
    },
    
    updatePlayPauseButton: function() {
        var isPlaying = GlobalPlayer.isPlaying();
        var icon = isPlaying ? 'fa-pause' : 'fa-play';
        $('#play-pause-btn i').attr('class', 'fas ' + icon + ' text-white text-[48px]');
    },
    
    toggleFavorite: function() {
        var favorites = State.get('favoriteStations') || [];
        var station = this.data.currentStation;
        var stationId = station.stationuuid || station._id;
        
        var existingIndex = favorites.findIndex(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
        
        if (existingIndex >= 0) {
            // Remove from favorites
            favorites.splice(existingIndex, 1);
            this.data.isFavorite = false;
            console.log('[RadioPlaying] Removed from favorites');
        } else {
            // Add to favorites
            favorites.push(station);
            this.data.isFavorite = true;
            console.log('[RadioPlaying] Added to favorites');
        }
        
        State.set('favoriteStations', favorites);
        this.updateFavoriteButton();
    },
    
    updateFavoriteButton: function() {
        var $img = $('#favorite-btn img');
        if (this.data.isFavorite) {
            $img.addClass('filter-pink');
        } else {
            $img.removeClass('filter-pink');
        }
    },
    
    getStationImage: function(station) {
        if (station.favicon) {
            return station.favicon.startsWith('http') 
                ? station.favicon 
                : 'https://themegaradio.com/api/image/' + encodeURIComponent(station.favicon);
        }
        return Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE);
    },
    
    cleanup: function() {
        console.log('[RadioPlaying] Cleaning up...');
        $(document).off('click', '#play-pause-btn');
        $(document).off('click', '#favorite-btn');
        $(document).off('click', '#back-btn');
    }
};
