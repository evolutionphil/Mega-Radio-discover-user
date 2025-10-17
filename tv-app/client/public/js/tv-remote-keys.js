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
    
    // Keep backward compatibility with old API
    window.tvNavigation = {
        get currentFocusedElement() {
            return window.tvSpatialNav ? window.tvSpatialNav.focusedElement : null;
        },
        get focusableElements() {
            return window.tvSpatialNav ? window.tvSpatialNav.focusableElements : [];
        },
        init: function() {
            if (window.tvSpatialNav) window.tvSpatialNav.init();
        },
        updateFocusableElements: function() {
            if (window.tvSpatialNav) window.tvSpatialNav.updateFocusableElements();
        },
        focus: function(element) {
            if (window.tvSpatialNav) window.tvSpatialNav.focus(element);
        },
        navigate: function(direction) {
            if (window.tvSpatialNav) window.tvSpatialNav.navigate(direction);
        },
        select: function() {
            if (window.tvSpatialNav) window.tvSpatialNav.select();
        }
    };
    
    // Global key event handler
    window.handleTVKey = function(e) {
        var key = e.keyCode;
        console.log('[TV Keys] Key pressed:', key, e.key || 'unknown');
        
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
            console.log('[TV Remote Keys] DOM ready, initializing...');
            initTVKeys();
            // Always attach key handler for testing (works in browser and TV)
            window.tvNavigation.init();
            document.addEventListener('keydown', window.handleTVKey);
            console.log('[TV Remote Keys] Key handler attached, keys ready!');
        });
    } else {
        console.log('[TV Remote Keys] DOM already ready, initializing now...');
        initTVKeys();
        // Always attach key handler for testing
        window.tvNavigation.init();
        document.addEventListener('keydown', window.handleTVKey);
        console.log('[TV Remote Keys] Key handler attached, keys ready!');
    }
})();
