// TV Remote Control Key Handler for LG webOS and Samsung Tizen
(function() {
    'use strict';
    
    var tvKey = null;
    
    // Initialize TV keys based on platform
    function initTVKeys() {
        if (window.platform === 'samsung') {
            // Register Samsung Tizen keys
            try {
                var supportedKeys = tizen.tvinputdevice.getSupportedKeys();
                for (var i = 0; i < supportedKeys.length; i++) {
                    try {
                        tizen.tvinputdevice.registerKey(supportedKeys[i].name);
                    } catch (e) {
                        console.warn('Failed to register key:', supportedKeys[i].name);
                    }
                }
                // Unregister volume keys (handled by TV)
                tizen.tvinputdevice.unregisterKey("VolumeUp");
                tizen.tvinputdevice.unregisterKey("VolumeDown");
                tizen.tvinputdevice.unregisterKey("VolumeMute");
            } catch (e) {
                console.error('Failed to register Samsung TV keys:', e);
            }
            
            // Samsung Tizen key codes
            tvKey = {
                N1: 49, N2: 50, N3: 51, N4: 52, N5: 53, 
                N6: 54, N7: 55, N8: 56, N9: 57, N0: 48,
                ENTER: 13,
                RETURN: 10009,
                EXIT: 10182,
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                RED: 403,
                GREEN: 404,
                YELLOW: 405,
                BLUE: 406,
                PLAY: 415,
                PAUSE: 19,
                STOP: 413,
                PLAYPAUSE: 10252,
                FF: 417,
                RW: 412,
                MENU: 10133,
                SEARCH: 10255,
                INFO: 457,
                TOOLS: 10135,
                CH_UP: 427,
                CH_DOWN: 428,
                VOL_UP: 448,
                VOL_DOWN: 447,
                MUTE: 449
            };
        } else if (window.platform === 'lg') {
            // LG webOS key codes
            tvKey = {
                N1: 49, N2: 50, N3: 51, N4: 52, N5: 53,
                N6: 54, N7: 55, N8: 56, N9: 57, N0: 48,
                ENTER: 13,
                RETURN: 461,  // Different from Samsung
                EXIT: 10182,
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                RED: 403,
                GREEN: 404,
                YELLOW: 405,
                BLUE: 406,
                PLAY: 415,
                PAUSE: 19,
                STOP: 413,
                PLAYPAUSE: 10252,
                FF: 417,
                RW: 412,
                MENU: 10133,
                SEARCH: 10255,
                INFO: 457,
                TOOLS: 10135,
                CH_UP: 33,  // Different from Samsung
                CH_DOWN: 34,  // Different from Samsung
                VOL_UP: 448,
                VOL_DOWN: 447,
                MUTE: 449
            };
        } else {
            // Web browser - standard keys only
            tvKey = {
                ENTER: 13,
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                SPACE: 32,
                ESC: 27
            };
        }
        
        window.tvKey = tvKey;
        return tvKey;
    }
    
    // Navigation state management
    window.tvNavigation = {
        currentFocusedElement: null,
        focusableElements: [],
        
        init: function() {
            this.updateFocusableElements();
        },
        
        updateFocusableElements: function() {
            // Get all focusable elements
            this.focusableElements = Array.from(document.querySelectorAll(
                'button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])'
            )).filter(el => {
                return el.offsetParent !== null; // Element must be visible
            });
        },
        
        focus: function(element) {
            if (this.currentFocusedElement) {
                this.currentFocusedElement.classList.remove('tv-focused');
            }
            
            if (element) {
                element.classList.add('tv-focused');
                this.currentFocusedElement = element;
                
                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        
        navigate: function(direction) {
            if (!this.currentFocusedElement && this.focusableElements.length > 0) {
                this.focus(this.focusableElements[0]);
                return;
            }
            
            // Simple directional navigation (can be enhanced)
            var currentIndex = this.focusableElements.indexOf(this.currentFocusedElement);
            var nextIndex = currentIndex;
            
            switch(direction) {
                case 'UP':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : this.focusableElements.length - 1;
                    break;
                case 'DOWN':
                    nextIndex = currentIndex < this.focusableElements.length - 1 ? currentIndex + 1 : 0;
                    break;
                case 'LEFT':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : this.focusableElements.length - 1;
                    break;
                case 'RIGHT':
                    nextIndex = currentIndex < this.focusableElements.length - 1 ? currentIndex + 1 : 0;
                    break;
            }
            
            if (this.focusableElements[nextIndex]) {
                this.focus(this.focusableElements[nextIndex]);
            }
        },
        
        select: function() {
            if (this.currentFocusedElement) {
                this.currentFocusedElement.click();
            }
        }
    };
    
    // Global key event handler
    window.handleTVKey = function(e) {
        var key = e.keyCode;
        
        // Exit app on EXIT key (Samsung only)
        if (window.platform === 'samsung' && key === tvKey.EXIT) {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch(err) {
                console.error('Exit failed:', err);
            }
            return false;
        }
        
        // Handle navigation keys
        switch(key) {
            case tvKey.UP:
                window.tvNavigation.navigate('UP');
                e.preventDefault();
                return false;
            case tvKey.DOWN:
                window.tvNavigation.navigate('DOWN');
                e.preventDefault();
                return false;
            case tvKey.LEFT:
                window.tvNavigation.navigate('LEFT');
                e.preventDefault();
                return false;
            case tvKey.RIGHT:
                window.tvNavigation.navigate('RIGHT');
                e.preventDefault();
                return false;
            case tvKey.ENTER:
                window.tvNavigation.select();
                e.preventDefault();
                return false;
            case tvKey.RETURN:
                // Go back in history
                if (window.history.length > 1) {
                    window.history.back();
                }
                e.preventDefault();
                return false;
        }
        
        return true;
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTVKeys();
            if (window.platformInfo.isTV()) {
                window.tvNavigation.init();
                document.addEventListener('keydown', window.handleTVKey);
            }
        });
    } else {
        initTVKeys();
        if (window.platformInfo.isTV()) {
            window.tvNavigation.init();
            document.addEventListener('keydown', window.handleTVKey);
        }
    }
})();
