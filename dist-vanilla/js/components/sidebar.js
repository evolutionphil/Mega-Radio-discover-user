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
            
            return `
                <div class="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[${topPosition}px] 
                            ${isActive ? 'bg-[rgba(255,255,255,0.2)]' : ''} 
                            ${focusClass} 
                            focusable cursor-pointer transition-all duration-200" 
                     data-focus-index="${item.index}"
                     data-route="${item.route}"
                     data-testid="button-${item.id}">
                    <div class="absolute h-[61px] left-[${item.id === 'discover' || item.id === 'favorites' ? '13' : '19'}px] top-[19px] w-[72px]">
                        <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                            ${item.label}
                        </p>
                        <div class="absolute left-[20px] size-[32px] top-0">
                            <img alt="${item.label}" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/' + item.icon)}">
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto" id="sidebar-container">
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
