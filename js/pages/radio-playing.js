/**
 * Mega Radio - Radio Playing Page
 * Full-screen view with station info and controls (NO sidebar)
 * Implements EXACT Figma design for full-screen player
 */

var radio_playing_page = {
    keys: {
        focused_index: 0,
        total_items: 0
    },
    
    data: {
        currentStation: null,
        isFavorite: false,
        similarStations: [],
        popularStations: [],
        volume: 100
    },
    
    init: function() {
        console.log('[RadioPlaying] Initializing...');
        this.loadCurrentStation();
        this.render();
        this.bindEvents();
        this.loadRecommendations();
    },
    
    loadCurrentStation: function() {
        this.data.currentStation = GlobalPlayer.getCurrentStation();
        
        if (!this.data.currentStation) {
            console.warn('[RadioPlaying] No station loaded, redirecting to discover');
            AppRouter.navigate('discover');
            return;
        }
        
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
        var heartColor = this.data.isFavorite ? TVColors.pink : TVColors.white;
        
        var html = `
            <div style="${StyleHelpers.fullScreen()} ${StyleHelpers.background(TVColors.background)}" data-testid="page-radio-playing">
                <!-- Background Image -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;">
                    <img src="${Utils.assetPath('images/hand-crowd-disco-1.png')}" 
                         alt="Background" 
                         style="${StyleHelpers.image('100%', '100%', 'cover')} pointer-events: none;">
                </div>
                
                <!-- Gradient Overlay -->
                <div style="${StyleHelpers.overlay(TVGradients.concertGradient)} z-index: 1;"></div>
                
                <!-- Back Button (top-left) -->
                <div class="focusable" 
                     id="back-btn"
                     data-focus-index="0"
                     style="${StyleHelpers.position(64, 64, 64, 64)} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(32)} ${StyleHelpers.flex('row', 'center', 'center')} cursor: pointer; transition: all 0.2s; z-index: 10;"
                     data-testid="button-back">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                
                <!-- Main Content Container (centered) -->
                <div style="position: absolute; top: 120px; left: 50%; transform: translateX(-50%); width: 800px; z-index: 5;">
                    <!-- Station Logo (400x400px) -->
                    <div style="width: 400px; height: 400px; margin: 0 auto 48px; ${StyleHelpers.borderRadius(20)} overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                        <img src="${stationImage}" 
                             alt="${station.name}" 
                             style="${StyleHelpers.image('100%', '100%', 'cover')}"
                             onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'"
                             data-testid="img-station-logo">
                    </div>
                    
                    <!-- Station Info -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="${StyleHelpers.text(56, TVTypography.weightBold, TVColors.white, 'center')} margin: 0 0 16px 0;" 
                            data-testid="text-station-name">
                            ${station.name}
                        </h1>
                        <p style="${StyleHelpers.text(24, TVTypography.weightMedium, TVColors.textMuted, 'center')} margin: 0 0 8px 0;" 
                           data-testid="text-station-genre">
                            ${station.tags || station.country || 'Radio Station'}
                        </p>
                        <div style="${StyleHelpers.flex('row', 'center', 'center', 16)} margin-top: 8px;">
                            ${station.bitrate ? `<span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textGray)}" data-testid="text-station-bitrate">${station.bitrate} kbps</span>` : ''}
                            ${station.votes ? `<span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textGray)}" data-testid="text-station-votes">${Utils.formatNumber(station.votes)} listeners</span>` : ''}
                            ${station.country ? `<span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textGray)}" data-testid="text-station-country">${station.country}</span>` : ''}
                        </div>
                    </div>
                    
                    <!-- Playback Controls -->
                    <div style="${StyleHelpers.flex('row', 'center', 'center', 24)} margin-bottom: 24px;">
                        <!-- Favorite Button -->
                        <button id="favorite-btn" 
                                class="focusable"
                                style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(32)} padding: 16px; cursor: pointer; transition: all 0.2s; border: none; width: 64px; height: 64px; ${StyleHelpers.flex('row', 'center', 'center')}"
                                data-focus-index="1"
                                data-testid="button-favorite">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="${this.data.isFavorite ? TVColors.pink : 'none'}" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="${heartColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        
                        <!-- Previous Button -->
                        <button id="prev-btn" 
                                class="focusable"
                                style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(32)} padding: 16px; cursor: pointer; transition: all 0.2s; border: none; width: 64px; height: 64px; ${StyleHelpers.flex('row', 'center', 'center')}"
                                data-focus-index="2"
                                data-testid="button-previous">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 20L9 12L19 4V20Z" fill="${TVColors.white}"/>
                                <path d="M5 19V5" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        
                        <!-- Play/Pause Button (Large) -->
                        <button id="play-pause-btn" 
                                class="focusable"
                                style="background: ${TVGradients.pinkPurpleRight}; ${StyleHelpers.borderRadius(50)} padding: 24px; cursor: pointer; transition: all 0.2s; border: none; width: 96px; height: 96px; transform: scale(1.05); ${StyleHelpers.flex('row', 'center', 'center')}"
                                data-focus-index="3"
                                data-testid="button-play-pause">
                            <i class="fas ${playPauseIcon}" style="color: ${TVColors.white}; font-size: 40px;"></i>
                        </button>
                        
                        <!-- Next Button -->
                        <button id="next-btn" 
                                class="focusable"
                                style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(32)} padding: 16px; cursor: pointer; transition: all 0.2s; border: none; width: 64px; height: 64px; ${StyleHelpers.flex('row', 'center', 'center')}"
                                data-focus-index="4"
                                data-testid="button-next">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4L15 12L5 20V4Z" fill="${TVColors.white}"/>
                                <path d="M19 5V19" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        
                        <!-- Volume Control -->
                        <button id="volume-btn" 
                                class="focusable"
                                style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(32)} padding: 16px; cursor: pointer; transition: all 0.2s; border: none; width: 64px; height: 64px; ${StyleHelpers.flex('row', 'center', 'center')}"
                                data-focus-index="5"
                                data-testid="button-volume">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="${TVColors.white}"/>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Now Playing Indicator -->
                    <div style="${StyleHelpers.flex('row', 'center', 'center', 12)}">
                        <div style="width: 8px; height: 8px; background: ${TVColors.pink}; ${StyleHelpers.borderRadius(4)} animation: pulse 2s infinite;"></div>
                        <p style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textMuted)}" data-i18n="now_playing">
                            Now Playing
                        </p>
                    </div>
                </div>
                
                <!-- Similar Radios Section -->
                <div style="position: absolute; bottom: 300px; left: 64px; right: 64px; z-index: 5;">
                    <h2 style="${StyleHelpers.text(28, TVTypography.weightBold, TVColors.white)} margin: 0 0 24px 0;" data-testid="text-similar-radios-title">
                        Similar Radios
                    </h2>
                    <div style="${StyleHelpers.flex('row', 'flex-start', 'center', 20)} overflow-x: auto; overflow-y: hidden; padding-bottom: 8px;" 
                         id="similar-stations-container"
                         data-testid="container-similar-radios">
                        <!-- Similar stations will be inserted here -->
                    </div>
                </div>
                
                <!-- Popular Radios Section -->
                <div style="position: absolute; bottom: 64px; left: 64px; right: 64px; z-index: 5;">
                    <h2 style="${StyleHelpers.text(28, TVTypography.weightBold, TVColors.white)} margin: 0 0 24px 0;" data-testid="text-popular-radios-title">
                        Popular Radios
                    </h2>
                    <div style="${StyleHelpers.flex('row', 'flex-start', 'center', 20)} overflow-x: auto; overflow-y: hidden; padding-bottom: 8px;" 
                         id="popular-stations-container"
                         data-testid="container-popular-radios">
                        <!-- Popular stations will be inserted here -->
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        `;
        
        $('#page-radio-playing').html(html);
        console.log('[RadioPlaying] Rendered');
    },
    
    bindEvents: function() {
        var self = this;
        
        $(document).on('click', '#play-pause-btn', function() {
            console.log('[RadioPlaying] Play/Pause clicked');
            GlobalPlayer.togglePlayPause();
            self.updatePlayPauseButton();
        });
        
        $(document).on('click', '#favorite-btn', function() {
            console.log('[RadioPlaying] Favorite clicked');
            self.toggleFavorite();
        });
        
        $(document).on('click', '#back-btn', function() {
            console.log('[RadioPlaying] Back clicked');
            AppRouter.navigate('discover');
        });
        
        $(document).on('click', '#prev-btn', function() {
            console.log('[RadioPlaying] Previous clicked');
            self.playPreviousStation();
        });
        
        $(document).on('click', '#next-btn', function() {
            console.log('[RadioPlaying] Next clicked');
            self.playNextStation();
        });
        
        $(document).on('click', '#volume-btn', function() {
            console.log('[RadioPlaying] Volume clicked');
            self.toggleMute();
        });
        
        $(document).on('click', '.similar-station-card, .popular-station-card', function() {
            var stationId = $(this).data('station-id');
            console.log('[RadioPlaying] Station card clicked:', stationId);
            var station = self.findStationById(stationId);
            if (station) {
                GlobalPlayer.play(station);
                self.data.currentStation = station;
                self.loadCurrentStation();
                self.render();
                self.loadRecommendations();
            }
        });
    },
    
    loadRecommendations: function() {
        var self = this;
        var station = this.data.currentStation;
        var countryCode = State.get('selectedCountry') || 'US';
        var genre = station.tags ? station.tags.split(',')[0].trim() : '';
        
        Promise.all([
            genre ? MegaRadioAPI.getStationsByGenre(genre, countryCode, 10) : Promise.resolve([]),
            MegaRadioAPI.getPopularStations(countryCode, 10)
        ]).then(function(results) {
            self.data.similarStations = results[0] || [];
            self.data.popularStations = results[1] || [];
            
            self.data.similarStations = self.data.similarStations.filter(function(s) {
                return (s.stationuuid || s._id) !== (station.stationuuid || station._id);
            });
            
            self.data.popularStations = self.data.popularStations.filter(function(s) {
                return (s.stationuuid || s._id) !== (station.stationuuid || station._id);
            });
            
            self.renderSimilarStations();
            self.renderPopularStations();
        }).catch(function(error) {
            console.error('[RadioPlaying] Error loading recommendations:', error);
        });
    },
    
    renderSimilarStations: function() {
        var html = '';
        var self = this;
        var startIndex = 6;
        
        this.data.similarStations.slice(0, 8).forEach(function(station, index) {
            var focusIndex = startIndex + index;
            var stationImage = self.getStationImage(station);
            html += self.renderStationCard(station, focusIndex, 'similar', index);
        });
        
        $('#similar-stations-container').html(html);
    },
    
    renderPopularStations: function() {
        var html = '';
        var self = this;
        var startIndex = 14;
        
        this.data.popularStations.slice(0, 8).forEach(function(station, index) {
            var focusIndex = startIndex + index;
            html += self.renderStationCard(station, focusIndex, 'popular', index);
        });
        
        $('#popular-stations-container').html(html);
    },
    
    renderStationCard: function(station, focusIndex, type, index) {
        var stationImage = this.getStationImage(station);
        var stationName = station.name || 'Unknown Station';
        var stationGenre = station.tags || station.country || '';
        var stationId = station.stationuuid || station._id;
        
        return `
            <div class="${type}-station-card focusable" 
                 style="flex-shrink: 0; cursor: pointer; transition: all 0.2s;"
                 data-focus-index="${focusIndex}"
                 data-station-id="${stationId}"
                 data-testid="card-${type}-station-${index}">
                <div style="${StyleHelpers.background(TVColors.whiteOverlay05)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} overflow: hidden; width: 160px; height: 212px;">
                    <img src="${stationImage}" 
                         alt="${stationName}" 
                         style="width: 160px; height: 160px; object-fit: cover; display: block;"
                         onerror="this.src='${Utils.assetPath(AppConfig.FALLBACK_STATION_IMAGE)}'">
                    <div style="padding: 8px; height: 52px; box-sizing: border-box;">
                        <p style="${StyleHelpers.text(14, TVTypography.weightMedium, TVColors.white)} overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 0 4px 0;">
                            ${stationName}
                        </p>
                        <p style="${StyleHelpers.text(12, TVTypography.weightRegular, TVColors.textMuted)} overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
                            ${stationGenre}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },
    
    updatePlayPauseButton: function() {
        var isPlaying = GlobalPlayer.isPlaying();
        var icon = isPlaying ? 'fa-pause' : 'fa-play';
        $('#play-pause-btn i').attr('class', 'fas ' + icon).attr('style', 'color: ' + TVColors.white + '; font-size: 40px;');
    },
    
    toggleFavorite: function() {
        var favorites = State.get('favoriteStations') || [];
        var station = this.data.currentStation;
        var stationId = station.stationuuid || station._id;
        
        var existingIndex = favorites.findIndex(function(s) {
            return (s.stationuuid === stationId) || (s._id === stationId);
        });
        
        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            this.data.isFavorite = false;
            console.log('[RadioPlaying] Removed from favorites');
        } else {
            favorites.push(station);
            this.data.isFavorite = true;
            console.log('[RadioPlaying] Added to favorites');
        }
        
        State.set('favoriteStations', favorites);
        this.updateFavoriteButton();
    },
    
    updateFavoriteButton: function() {
        var heartColor = this.data.isFavorite ? TVColors.pink : TVColors.white;
        var fill = this.data.isFavorite ? TVColors.pink : 'none';
        $('#favorite-btn svg path').attr('fill', fill).attr('stroke', heartColor);
    },
    
    playPreviousStation: function() {
        var allStations = this.data.similarStations.concat(this.data.popularStations);
        if (allStations.length === 0) return;
        
        var randomIndex = Math.floor(Math.random() * allStations.length);
        var station = allStations[randomIndex];
        
        GlobalPlayer.play(station);
        this.data.currentStation = station;
        this.loadCurrentStation();
        this.render();
        this.loadRecommendations();
    },
    
    playNextStation: function() {
        var allStations = this.data.similarStations.concat(this.data.popularStations);
        if (allStations.length === 0) return;
        
        var station = allStations[0];
        
        GlobalPlayer.play(station);
        this.data.currentStation = station;
        this.loadCurrentStation();
        this.render();
        this.loadRecommendations();
    },
    
    toggleMute: function() {
        console.log('[RadioPlaying] Toggle mute - Volume controls not implemented in TVAudioPlayer');
    },
    
    findStationById: function(stationId) {
        var allStations = this.data.similarStations.concat(this.data.popularStations);
        return allStations.find(function(s) {
            return (s.stationuuid || s._id) === stationId;
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
    
    cleanup: function() {
        console.log('[RadioPlaying] Cleaning up...');
        $(document).off('click', '#play-pause-btn');
        $(document).off('click', '#favorite-btn');
        $(document).off('click', '#back-btn');
        $(document).off('click', '#prev-btn');
        $(document).off('click', '#next-btn');
        $(document).off('click', '#volume-btn');
        $(document).off('click', '.similar-station-card');
        $(document).off('click', '.popular-station-card');
    }
};
