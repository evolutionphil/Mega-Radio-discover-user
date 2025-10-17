// TV Spatial Navigation System - Smart directional focus
(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded and executing...');

    window.tvSpatialNav = {
        focusedElement: null,
        focusableElements: [],
        
        init: function() {
            this.updateFocusableElements();
            // Focus first element on page load
            if (this.focusableElements.length > 0) {
                console.log('[TV Nav] Initialized with', this.focusableElements.length, 'focusable elements');
                
                // Try to find and focus the Discover button first (sidebar), otherwise first element
                const discoverBtn = this.focusableElements.find(el => 
                    el.dataset.testid === 'button-discover' || 
                    el.textContent?.includes('Discover')
                );
                
                if (discoverBtn) {
                    console.log('[TV Nav] Initial focus on Discover button');
                    this.focus(discoverBtn);
                } else {
                    console.log('[TV Nav] Initial focus on first element');
                    this.focus(this.focusableElements[0]);
                }
            } else {
                console.warn('[TV Nav] No focusable elements found!');
            }
        },
        
        updateFocusableElements: function() {
            // Get all focusable elements with spatial data
            this.focusableElements = Array.from(document.querySelectorAll(
                'button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])'
            )).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && el.offsetParent !== null;
            });
            
            console.log('[TV Nav] Found', this.focusableElements.length, 'focusable elements');
        },
        
        focus: function(element) {
            if (!element) {
                console.warn('[TV Nav] Attempted to focus null element');
                return;
            }
            
            // Remove focus from previous element
            if (this.focusedElement && this.focusedElement !== element) {
                this.focusedElement.classList.remove('tv-focused');
            }
            
            // Add focus to new element
            element.classList.add('tv-focused');
            this.focusedElement = element;
            
            console.log('[TV Nav] Focused:', element.dataset.testid || element.textContent?.trim().substring(0, 20) || element.tagName);
            
            // Scroll into view
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        },
        
        getElementCenter: function(el) {
            const rect = el.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                rect: rect
            };
        },
        
        findBestMatch: function(direction) {
            if (!this.focusedElement) {
                return this.focusableElements[0] || null;
            }
            
            const current = this.getElementCenter(this.focusedElement);
            let bestElement = null;
            let bestScore = Infinity;
            
            this.focusableElements.forEach(el => {
                if (el === this.focusedElement) return;
                
                const candidate = this.getElementCenter(el);
                let score = Infinity;
                let isValidDirection = false;
                
                switch(direction) {
                    case 'UP':
                        // Element must be above current
                        if (candidate.y < current.y - 10) {
                            isValidDirection = true;
                            const verticalDist = current.y - candidate.y;
                            const horizontalDist = Math.abs(current.x - candidate.x);
                            // Prefer elements directly above
                            score = verticalDist + (horizontalDist * 2);
                        }
                        break;
                        
                    case 'DOWN':
                        // Element must be below current
                        if (candidate.y > current.y + 10) {
                            isValidDirection = true;
                            const verticalDist = candidate.y - current.y;
                            const horizontalDist = Math.abs(current.x - candidate.x);
                            // Prefer elements directly below
                            score = verticalDist + (horizontalDist * 2);
                        }
                        break;
                        
                    case 'LEFT':
                        // Element must be to the left
                        if (candidate.x < current.x - 10) {
                            isValidDirection = true;
                            const horizontalDist = current.x - candidate.x;
                            const verticalDist = Math.abs(current.y - candidate.y);
                            // Prefer elements directly to the left
                            score = horizontalDist + (verticalDist * 2);
                        }
                        break;
                        
                    case 'RIGHT':
                        // Element must be to the right
                        if (candidate.x > current.x + 10) {
                            isValidDirection = true;
                            const horizontalDist = candidate.x - current.x;
                            const verticalDist = Math.abs(current.y - candidate.y);
                            // Prefer elements directly to the right
                            score = horizontalDist + (verticalDist * 2);
                        }
                        break;
                }
                
                if (isValidDirection && score < bestScore) {
                    bestScore = score;
                    bestElement = el;
                }
            });
            
            return bestElement;
        },
        
        navigate: function(direction) {
            const nextElement = this.findBestMatch(direction);
            if (nextElement) {
                console.log('[TV Nav] Moving', direction, 'to:', nextElement.dataset.testid || nextElement.tagName);
                this.focus(nextElement);
            } else {
                console.log('[TV Nav] No element found in direction:', direction, '- keeping current focus');
                // Keep focus on current element when no valid target found
                if (this.focusedElement) {
                    // Re-apply focus styling to ensure it's visible
                    this.focus(this.focusedElement);
                }
            }
        },
        
        select: function() {
            if (this.focusedElement) {
                this.focusedElement.click();
            }
        },
        
        handleMouseOver: function(e) {
            const target = e.target.closest('button, a, [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])');
            if (target && this.focusableElements.includes(target)) {
                this.focus(target);
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[TV Spatial Nav] DOM ready, initializing...');
            // Initialize on all platforms for testing (will be limited by key handler)
            window.tvSpatialNav.init();
        });
    } else {
        console.log('[TV Spatial Nav] DOM already ready, initializing now...');
        // Initialize on all platforms for testing
        window.tvSpatialNav.init();
    }
})();
