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
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;" data-testid="page-radio-playing">
                <!-- Background blur effect -->
                <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.2;">
                    <img src="${stationImage}" 
                         alt="${station.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; filter: blur(100px);">
                </div>
                
                <!-- Main Content -->
                <div class="d-flex flex-column align-items-center justify-content-center" 
                     style="position: relative; z-index: 10; height: 100%;">
                    <!-- Station Logo -->
                    <div style="margin-bottom: 48px;">
                        <div style="width: 400px; height: 400px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                            <img src="${stationImage}" 
                                 alt="${station.name}" 
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                        </div>
                    </div>
                    
                    <!-- Station Info -->
                    <div style="text-align: center; margin-bottom: 48px;">
                        <h1 style="font-family: 'Ubuntu', Helvetica; font-weight: 700; font-size: 56px; color: #ffffff; margin-bottom: 16px;">
                            ${station.name}
                        </h1>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 24px; color: #9b9b9b; margin-bottom: 8px;">
                            ${station.tags || station.country || ''}
                        </p>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 20px; color: #9b9b9b;">
                            ${station.country || ''}
                        </p>
                    </div>
                    
                    <!-- Playback Controls -->
                    <div class="d-flex align-items-center" style="gap: 32px;">
                        <!-- Favorite Button -->
                        <button id="favorite-btn" 
                                class="focusable"
                                style="background: rgba(255,255,255,0.1); border-radius: 50%; padding: 20px; cursor: pointer; transition: all 0.2s; border: none;"
                                data-focus-index="0">
                            <img src="${Utils.assetPath('images/heart-icon.svg')}" 
                                 alt="Favorite" 
                                 style="width: 32px; height: 32px; ${this.data.isFavorite ? 'filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(315deg) brightness(118%) contrast(119%);' : ''}">
                        </button>
                        
                        <!-- Play/Pause Button -->
                        <button id="play-pause-btn" 
                                class="focusable"
                                style="background: linear-gradient(to right, #ec4899, #9333ea); border-radius: 50%; padding: 32px; cursor: pointer; transition: all 0.2s; border: none; transform: scale(1.1);"
                                data-focus-index="1">
                            <i class="fas ${playPauseIcon}" style="color: #ffffff; font-size: 48px;"></i>
                        </button>
                        
                        <!-- Back Button -->
                        <button id="back-btn" 
                                class="focusable"
                                style="background: rgba(255,255,255,0.1); border-radius: 50%; padding: 20px; cursor: pointer; transition: all 0.2s; border: none;"
                                data-focus-index="2">
                            <i class="fas fa-arrow-left" style="color: #ffffff; font-size: 32px;"></i>
                        </button>
                    </div>
                    
                    <!-- Now Playing Indicator -->
                    <div class="d-flex align-items-center" style="margin-top: 48px; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #ec4899; border-radius: 50%; animation: pulse 2s infinite;"></div>
                        <p style="font-family: 'Ubuntu', Helvetica; font-size: 18px; color: #9b9b9b;" data-i18n="now_playing">
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
        $('#play-pause-btn i').attr('class', 'fas ' + icon).attr('style', 'color: #ffffff; font-size: 48px;');
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
            $img.attr('style', 'width: 32px; height: 32px; filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(315deg) brightness(118%) contrast(119%);');
        } else {
            $img.attr('style', 'width: 32px; height: 32px;');
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
