// Dual Audio Player for LG webOS and Samsung Tizen TVs
(function() {
    'use strict';
    
    window.TVAudioPlayer = function(containerId) {
        this.containerId = containerId;
        this.platform = window.platform || 'web';
        this.audioElement = null;
        this.isPlaying = false;
        this.currentUrl = '';
        this.volume = 1.0;
        
        // Initialize platform-specific player
        if (this.platform === 'samsung') {
            this.initSamsungPlayer();
        } else if (this.platform === 'lg') {
            this.initLGPlayer();
        } else {
            this.initWebPlayer();
        }
    };
    
    TVAudioPlayer.prototype = {
        // Samsung Tizen AVPlay implementation
        initSamsungPlayer: function() {
            var self = this;
            
            this.play = function(url) {
                self.currentUrl = url;
                
                try {
                    // Always close player before opening new stream to reset state
                    try {
                        var state = webapis.avplay.getState();
                        console.log('[Samsung Player] Current state:', state);
                        
                        // Close player if it's in any state except NONE or IDLE
                        if (state !== 'NONE' && state !== 'IDLE') {
                            console.log('[Samsung Player] Closing player to reset state');
                            webapis.avplay.stop();
                            webapis.avplay.close();
                        }
                    } catch (stateError) {
                        // If we can't get state, try to close anyway
                        console.log('[Samsung Player] State check failed, attempting close:', stateError);
                        try {
                            webapis.avplay.close();
                        } catch (e) {
                            // Ignore close errors
                        }
                    }
                    
                    // Open new stream
                    console.log('[Samsung Player] Opening URL:', url);
                    webapis.avplay.open(url);
                    
                    // Set up event listeners
                    var listener = {
                        onbufferingstart: function() {
                            console.log('Buffering started');
                            self.onBuffering && self.onBuffering();
                        },
                        onbufferingcomplete: function() {
                            console.log('Buffering complete');
                            self.onReady && self.onReady();
                        },
                        onstreamcompleted: function() {
                            console.log('Stream completed');
                            self.onEnded && self.onEnded();
                        },
                        oncurrentplaytime: function(currentTime) {
                            self.onTimeUpdate && self.onTimeUpdate(currentTime / 1000);
                        },
                        onerror: function(eventType) {
                            console.error('AVPlay error:', eventType);
                            self.onError && self.onError(eventType);
                        }
                    };
                    
                    webapis.avplay.setListener(listener);
                    
                    // Prepare and play
                    webapis.avplay.prepareAsync(function() {
                        webapis.avplay.play();
                        self.isPlaying = true;
                        self.onPlay && self.onPlay();
                    }, function(error) {
                        console.error('Prepare failed:', error);
                        self.onError && self.onError(error);
                    });
                    
                } catch (e) {
                    console.error('Samsung player error:', e);
                    self.onError && self.onError(e);
                }
            };
            
            this.pause = function() {
                try {
                    var state = webapis.avplay.getState();
                    console.log('[Samsung Player] Pause requested, current state:', state);
                    
                    // Only pause if currently playing
                    if (state === 'PLAYING') {
                        webapis.avplay.pause();
                        self.isPlaying = false;
                        self.onPause && self.onPause();
                        console.log('[Samsung Player] Paused successfully');
                    } else {
                        console.log('[Samsung Player] Cannot pause - not in PLAYING state, current state:', state);
                        // Still update our internal state
                        self.isPlaying = false;
                        self.onPause && self.onPause();
                    }
                } catch (e) {
                    console.error('Pause error:', e);
                    // Still update internal state even on error
                    self.isPlaying = false;
                    self.onPause && self.onPause();
                }
            };
            
            this.resume = function() {
                try {
                    var state = webapis.avplay.getState();
                    console.log('[Samsung Player] Resume requested, current state:', state);
                    
                    // Only resume if paused
                    if (state === 'PAUSED') {
                        webapis.avplay.play();
                        self.isPlaying = true;
                        self.onPlay && self.onPlay();
                        console.log('[Samsung Player] Resumed successfully');
                    } else if (state === 'PLAYING') {
                        console.log('[Samsung Player] Already playing, no need to resume');
                        self.isPlaying = true;
                    } else {
                        console.log('[Samsung Player] Cannot resume - invalid state:', state);
                    }
                } catch (e) {
                    console.error('Resume error:', e);
                }
            };
            
            this.stop = function() {
                try {
                    webapis.avplay.stop();
                    webapis.avplay.close();
                    self.isPlaying = false;
                    self.onStop && self.onStop();
                } catch (e) {
                    console.error('Stop error:', e);
                }
            };
            
            this.setVolume = function(vol) {
                try {
                    webapis.avplay.setStreamingProperty('SET_MODE_4K', 'false');
                    self.volume = Math.max(0, Math.min(1, vol));
                } catch (e) {
                    console.error('Volume error:', e);
                }
            };
        },
        
        // LG webOS HTML5 Audio implementation
        initLGPlayer: function() {
            var self = this;
            var container = document.getElementById(this.containerId);
            
            // Create audio element
            this.audioElement = document.createElement('audio');
            this.audioElement.setAttribute('preload', 'auto');
            
            if (container) {
                container.appendChild(this.audioElement);
            }
            
            // Event listeners
            this.audioElement.addEventListener('canplay', function() {
                self.onReady && self.onReady();
            });
            
            this.audioElement.addEventListener('play', function() {
                self.isPlaying = true;
                self.onPlay && self.onPlay();
            });
            
            this.audioElement.addEventListener('pause', function() {
                self.isPlaying = false;
                self.onPause && self.onPause();
            });
            
            this.audioElement.addEventListener('ended', function() {
                self.isPlaying = false;
                self.onEnded && self.onEnded();
            });
            
            this.audioElement.addEventListener('error', function(e) {
                console.error('LG audio error:', e);
                self.onError && self.onError(e);
            });
            
            this.audioElement.addEventListener('timeupdate', function() {
                self.onTimeUpdate && self.onTimeUpdate(self.audioElement.currentTime);
            });
            
            this.audioElement.addEventListener('waiting', function() {
                self.onBuffering && self.onBuffering();
            });
            
            this.play = function(url) {
                self.currentUrl = url;
                self.audioElement.src = url;
                self.audioElement.load();
                
                var playPromise = self.audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function(error) {
                        console.error('Play error:', error);
                        self.onError && self.onError(error);
                    });
                }
            };
            
            this.pause = function() {
                self.audioElement.pause();
            };
            
            this.resume = function() {
                var playPromise = self.audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function(error) {
                        console.error('Resume error:', error);
                        self.onError && self.onError(error);
                    });
                }
            };
            
            this.stop = function() {
                self.audioElement.pause();
                self.audioElement.currentTime = 0;
                self.audioElement.src = '';
                self.isPlaying = false;
                self.onStop && self.onStop();
            };
            
            this.setVolume = function(vol) {
                self.volume = Math.max(0, Math.min(1, vol));
                self.audioElement.volume = self.volume;
            };
        },
        
        // Web Browser HTML5 Audio implementation
        initWebPlayer: function() {
            var self = this;
            var container = document.getElementById(this.containerId);
            
            // Create audio element
            this.audioElement = document.createElement('audio');
            this.audioElement.setAttribute('preload', 'auto');
            this.audioElement.setAttribute('controls', 'true');
            
            if (container) {
                container.appendChild(this.audioElement);
            }
            
            // Event listeners
            this.audioElement.addEventListener('canplay', function() {
                self.onReady && self.onReady();
            });
            
            this.audioElement.addEventListener('play', function() {
                self.isPlaying = true;
                self.onPlay && self.onPlay();
            });
            
            this.audioElement.addEventListener('pause', function() {
                self.isPlaying = false;
                self.onPause && self.onPause();
            });
            
            this.audioElement.addEventListener('ended', function() {
                self.isPlaying = false;
                self.onEnded && self.onEnded();
            });
            
            this.audioElement.addEventListener('error', function(e) {
                console.error('Web audio error:', e);
                self.onError && self.onError(e);
            });
            
            this.audioElement.addEventListener('timeupdate', function() {
                self.onTimeUpdate && self.onTimeUpdate(self.audioElement.currentTime);
            });
            
            this.audioElement.addEventListener('waiting', function() {
                self.onBuffering && self.onBuffering();
            });
            
            this.play = function(url) {
                self.currentUrl = url;
                self.audioElement.src = url;
                self.audioElement.load();
                
                var playPromise = self.audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function(error) {
                        console.error('Play error:', error);
                        self.onError && self.onError(error);
                    });
                }
            };
            
            this.pause = function() {
                self.audioElement.pause();
            };
            
            this.resume = function() {
                var playPromise = self.audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function(error) {
                        console.error('Resume error:', error);
                        self.onError && self.onError(error);
                    });
                }
            };
            
            this.stop = function() {
                self.audioElement.pause();
                self.audioElement.currentTime = 0;
                self.audioElement.src = '';
                self.isPlaying = false;
                self.onStop && self.onStop();
            };
            
            this.setVolume = function(vol) {
                self.volume = Math.max(0, Math.min(1, vol));
                self.audioElement.volume = self.volume;
            };
        },
        
        // Common methods
        getState: function() {
            return {
                isPlaying: this.isPlaying,
                url: this.currentUrl,
                volume: this.volume,
                platform: this.platform
            };
        }
    };
})();
