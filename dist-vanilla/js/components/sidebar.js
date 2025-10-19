/**
 * Mega Radio - Sidebar Component
 * Navigation sidebar with 5 items
 */

var Sidebar = {
    /**
     * Render sidebar HTML
     * @param {string} activePage - Currently active page ('discover', 'genres', 'search', 'favorites', 'settings')
     * @param {number} focusStartIndex - Starting index for focus (sidebar items start from index 0-4)
     * @param {number} currentFocusIndex - Current focus index
     * @returns {string} HTML string
     */
    render: function(activePage, focusStartIndex, currentFocusIndex) {
        focusStartIndex = focusStartIndex || 0;
        currentFocusIndex = currentFocusIndex !== undefined ? currentFocusIndex : -1;
        
        var items = [
            { 
                id: 'discover', 
                label: 'Discover', 
                icon: 'radio-icon.svg', 
                route: 'discover',
                index: focusStartIndex 
            },
            { 
                id: 'genres', 
                label: 'Genres', 
                icon: 'music-icon.svg', 
                route: 'genres',
                index: focusStartIndex + 1 
            },
            { 
                id: 'search', 
                label: 'Search', 
                icon: 'search-icon.svg', 
                route: 'search',
                index: focusStartIndex + 2 
            },
            { 
                id: 'favorites', 
                label: 'Favorites', 
                icon: 'heart-icon.svg', 
                route: 'favorites',
                index: focusStartIndex + 3 
            },
            { 
                id: 'settings', 
                label: 'Settings', 
                icon: 'settings-icon.svg', 
                route: 'settings',
                index: focusStartIndex + 4 
            }
        ];
        
        var itemsHtml = items.map(function(item, i) {
            var isActive = activePage === item.id;
            var isFocused = currentFocusIndex === item.index;
            var topPosition = i * 108; // 108px spacing between items
            
            var focusClass = isFocused ? 'ring-4 ring-white ring-opacity-50 scale-105' : '';
            var activeStyle = isActive ? 'background: rgba(255,255,255,0.2);' : '';
            
            return `
                <div class="focusable ${focusClass}" 
                     style="position: absolute; left: 0; overflow: hidden; border-radius: 10px; width: 98px; height: 98px; top: ${topPosition}px; ${activeStyle} cursor: pointer; transition: all 0.2s;" 
                     data-focus-index="${item.index}"
                     data-route="${item.route}"
                     data-testid="button-${item.id}">
                    <div style="position: absolute; height: 61px; left: ${item.id === 'discover' || item.id === 'favorites' ? '13' : '19'}px; top: 19px; width: 72px;">
                        <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 36px; font-style: normal; font-size: 18px; text-align: center; color: #ffffff; top: 40px; transform: translateX(-50%);">
                            ${item.label}
                        </p>
                        <div style="position: absolute; left: 20px; width: 32px; height: 32px; top: 0;">
                            <img alt="${item.label}" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/' + item.icon)}">
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div style="position: fixed; height: 638px; left: 64px; top: 242px; width: 98px; z-index: 50; pointer-events: auto;" id="sidebar-container">
                ${itemsHtml}
            </div>
        `;
    },
    
    /**
     * Bind click events for sidebar navigation
     */
    bindEvents: function() {
        $(document).on('click', '#sidebar-container .focusable', function() {
            var route = $(this).data('route');
            console.log('[Sidebar] Navigating to:', route);
            AppRouter.navigate(route);
        });
    }
};

// Initialize sidebar event bindings once
$(document).ready(function() {
    Sidebar.bindEvents();
});
