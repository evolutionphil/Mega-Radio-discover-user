/**
 * Mega Radio - Utility Functions
 */

var Utils = {
    // Show loading overlay
    showLoading: function() {
        $('#loading-overlay').show();
        State.set('isLoading', true);
    },
    
    // Hide loading overlay
    hideLoading: function() {
        $('#loading-overlay').hide();
        State.set('isLoading', false);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    },
    
    // Format number with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Truncate text
    truncate: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },
    
    // Get asset path
    assetPath: function(path) {
        var base = '';
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
        return base + path;
    },
    
    // Generate unique ID
    generateId: function() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
};
