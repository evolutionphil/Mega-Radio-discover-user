/**
 * Mega Radio - Main Application Entry Point
 */

$(document).ready(function() {
    console.log('🎵 Mega Radio - Starting application...');
    
    // Initialize app state
    State.init();
    
    // Initialize localization
    Localization.init();
    
    // Initialize global player
    GlobalPlayer.init();
    
    // Initialize router
    AppRouter.init();
    
    console.log('✅ Mega Radio - Application ready');
});
