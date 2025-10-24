// Platform Detection for LG webOS and Samsung Tizen TVs
(function() {
    'use strict';
    
    // Detect platform based on user agent
    window.platform = 'web'; // default
    
    try {
        const userAgent = window.navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('web0s')) {
            window.platform = 'lg';
            console.log('Platform detected: LG webOS');
        } else if (userAgent.includes('tizen') || typeof tizen !== 'undefined') {
            window.platform = 'samsung';
            console.log('Platform detected: Samsung Tizen');
        } else {
            console.log('Platform detected: Web Browser');
        }
    } catch (e) {
        console.error('Platform detection error:', e);
    }
    
    // Export platform info
    window.platformInfo = {
        isLG: function() { return window.platform === 'lg'; },
        isSamsung: function() { return window.platform === 'samsung'; },
        isTV: function() { return window.platform === 'lg' || window.platform === 'samsung'; },
        isWeb: function() { return window.platform === 'web'; },
        getPlatform: function() { return window.platform; }
    };
    
    // Samsung TV-specific initialization
    if (window.platform === 'samsung') {
        console.log('[Samsung TV] Initializing Samsung-specific features...');
        
        // Disable screensaver (important for radio playback)
        try {
            if (typeof webapis !== 'undefined' && webapis.appcommon && webapis.appcommon.setScreenSaver) {
                webapis.appcommon.setScreenSaver(
                    webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF,
                    function(result) {
                        console.log('[Samsung TV] ✅ Screensaver disabled successfully:', result);
                    },
                    function(error) {
                        console.warn('[Samsung TV] ⚠️ Failed to disable screensaver:', JSON.stringify(error));
                    }
                );
            } else {
                console.warn('[Samsung TV] ⚠️ webapis.appcommon.setScreenSaver not available');
            }
        } catch (e) {
            console.error('[Samsung TV] ❌ Error disabling screensaver:', e);
        }
    }
})();
