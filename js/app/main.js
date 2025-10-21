/**
 * Mega Radio - Main Application Entry Point
 */

console.log('[Main.js] ===== MAIN.JS FILE LOADED (TOP OF FILE) =====');
console.log('[Main.js] Checking if State exists:', typeof State);

$(document).ready(function() {
    console.log('🎵 Mega Radio - Starting application...');
    console.log('[Main.js] State object type:', typeof State);
    console.log('[Main.js] State object:', State);
    
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
