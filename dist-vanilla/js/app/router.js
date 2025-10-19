/**
 * Mega Radio - App Router
 * Handles page navigation by showing/hiding sections
 */

var AppRouter = (function() {
    var currentPage = null;
    
    return {
        // Navigate to a page
        navigate: function(pageId) {
            console.log('[Router] Navigating to:', pageId);
            
            // Hide current page
            if (currentPage) {
                $('#page-' + currentPage).removeClass('active');
                
                // Call page cleanup if exists
                var pageController = window[pageId.replace(/-/g, '_') + '_page'];
                if (pageController && typeof pageController.cleanup === 'function') {
                    pageController.cleanup();
                }
            }
            
            // Show new page
            $('#page-' + pageId).addClass('active');
            currentPage = pageId;
            
            // Update state
            State.set('currentPage', pageId);
            
            // Call page init if exists
            var newPageController = window[pageId.replace(/-/g, '_') + '_page'];
            if (newPageController && typeof newPageController.init === 'function') {
                newPageController.init();
            }
            
            // Update URL hash
            window.location.hash = '#/' + pageId;
        },
        
        // Go back to previous page
        back: function() {
            var currentPageId = State.get('currentPage');
            
            // Define back navigation paths
            var backPaths = {
                'guide-1': 'splash',
                'guide-2': 'guide-1',
                'guide-3': 'guide-2',
                'guide-4': 'guide-3',
                'discover': 'guide-4',
                'radio-playing': 'discover'
            };
            
            var previousPage = backPaths[currentPageId];
            if (previousPage) {
                this.navigate(previousPage);
            }
        },
        
        // Initialize router
        init: function() {
            console.log('[Router] Initializing...');
            
            // Handle browser back button
            $(window).on('hashchange', function() {
                var hash = window.location.hash.replace('#/', '');
                if (hash && hash !== currentPage) {
                    AppRouter.navigate(hash);
                }
            });
            
            // Start from splash
            this.navigate(AppConfig.PAGES.SPLASH);
            
            console.log('[Router] Initialized');
        }
    };
})();
