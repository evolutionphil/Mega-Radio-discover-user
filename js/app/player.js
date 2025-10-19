/**
 * Mega Radio - Global Audio Player
 * Manages audio playback across all pages
 */

var GlobalPlayer = (function() {
    var audioElement = null;
    var currentStation = null;
    var isPlaying = false;
    
    return {
        init: function() {
            console.log('[GlobalPlayer] Initializing...');
            
            // Use TV audio player if available, otherwise HTML5 Audio
            if (typeof TVAudioPlayer !== 'undefined') {
                audioElement = TVAudioPlayer;
                console.log('[GlobalPlayer] Using TVAudioPlayer');
            } else {
                audioElement = new Audio();
                console.log('[GlobalPlayer] Using HTML5 Audio');
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load last played station
            this.loadLastPlayed();
            
            console.log('[GlobalPlayer] Initialized');
        },
        
        setupEventListeners: function() {
            var self = this;
            
            // Play button
            $('#player-play-btn').on('click', function() {
                self.togglePlayPause();
            });
            
            // Audio events
            if (audioElement instanceof Audio) {
                audioElement.addEventListener('playing', function() {
                    self.onPlaying();
                });
                
                audioElement.addEventListener('pause', function() {
                    self.onPaused();
                });
                
                audioElement.addEventListener('error', function(e) {
                    self.onError(e);
                });
            }
        },
        
        play: function(station) {
            console.log('[GlobalPlayer] Playing:', station.name);
            
            currentStation = station;
            State.set('currentStation', station);
            State.addRecentlyPlayed(station);
            
            // Update UI
            this.updatePlayerUI(station);
            
            // Show player bar
            this.showPlayerBar();
            
            // Stop current playback
            this.stop();
            
            // Play new station
            if (typeof TVAudioPlayer !== 'undefined') {
                TVAudioPlayer.play(station.url);
            } else {
                audioElement.src = station.url;
                audioElement.play().catch(function(error) {
                    console.error('[GlobalPlayer] Play error:', error);
                });
            }
            
            isPlaying = true;
            State.set('isPlaying', true);
            
            // Save last played
            this.saveLastPlayed(station);
        },
        
        stop: function() {
            if (typeof TVAudioPlayer !== 'undefined') {
                TVAudioPlayer.stop();
            } else {
                audioElement.pause();
                audioElement.currentTime = 0;
            }
            
            isPlaying = false;
            State.set('isPlaying', false);
            this.updatePlayButton(false);
        },
        
        togglePlayPause: function() {
            if (!currentStation) {
                console.log('[GlobalPlayer] No station loaded');
                return;
            }
            
            if (isPlaying) {
                this.pause();
            } else {
                this.resume();
            }
        },
        
        pause: function() {
            if (typeof TVAudioPlayer !== 'undefined') {
                TVAudioPlayer.pause();
            } else {
                audioElement.pause();
            }
            
            isPlaying = false;
            State.set('isPlaying', false);
            this.updatePlayButton(false);
        },
        
        resume: function() {
            if (typeof TVAudioPlayer !== 'undefined') {
                TVAudioPlayer.resume();
            } else {
                audioElement.play();
            }
            
            isPlaying = true;
            State.set('isPlaying', true);
            this.updatePlayButton(true);
        },
        
        updatePlayerUI: function(station) {
            var logo = station.favicon || AppConfig.FALLBACK_STATION_IMAGE;
            $('#player-station-logo').attr('src', logo);
            $('#player-station-name').text(station.name);
            $('#player-station-genre').text(station.tags || '');
        },
        
        updatePlayButton: function(playing) {
            var icon = playing ? 'fa-pause' : 'fa-play';
            $('#player-play-btn i').attr('class', 'fas ' + icon);
        },
        
        onPlaying: function() {
            console.log('[GlobalPlayer] Audio playing');
            this.updatePlayButton(true);
        },
        
        onPaused: function() {
            console.log('[GlobalPlayer] Audio paused');
            this.updatePlayButton(false);
        },
        
        onError: function(error) {
            console.error('[GlobalPlayer] Audio error:', error);
            // Try next station or show error
        },
        
        saveLastPlayed: function(station) {
            localStorage.setItem('megaradio_last_played', JSON.stringify(station));
        },
        
        loadLastPlayed: function() {
            try {
                var stored = localStorage.getItem('megaradio_last_played');
                if (stored) {
                    var station = JSON.parse(stored);
                    currentStation = station;
                    this.updatePlayerUI(station);
                    // Don't show player bar on init - only show when actually playing
                    console.log('[GlobalPlayer] Loaded last played:', station.name);
                }
            } catch (e) {
                console.error('[GlobalPlayer] Error loading last played:', e);
            }
        },
        
        showPlayerBar: function() {
            $('#global-player-bar').addClass('visible');
        },
        
        hidePlayerBar: function() {
            $('#global-player-bar').removeClass('visible');
        },
        
        getCurrentStation: function() {
            return currentStation;
        },
        
        isPlaying: function() {
            return isPlaying;
        }
    };
})();
