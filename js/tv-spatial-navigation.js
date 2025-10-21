/**
 * TV Spatial Navigation - INDEX-BASED (LGTV-Master Pattern)
 * Simple index-based navigation like LGTV-master reference
 */

(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded - INDEX-BASED v7.0');
    
    window.tvSpatialNav = {
        enabled: false,
        currentIndex: 0,
        focusableElements: [],
        
        init: function() {
            console.log('[TV Spatial Nav] 🚀 Initializing INDEX-BASED navigation...');
            this.enabled = true;
            this.updateFocusableElements();
            
            if (this.focusableElements.length > 0) {
                console.log('[TV Nav] ✅ Found', this.focusableElements.length, 'focusable elements');
                
                // ALWAYS start on Discover sidebar button (index 0)
                this.currentIndex = 0;
                
                // Log what we found at index 0
                var firstEl = this.focusableElements[0];
                var testid = firstEl.dataset.testid || firstEl.id || 'unknown';
                console.log('[TV Nav] 🎯 Starting at index 0:', testid);
                
                this.focusElement(this.currentIndex);
            } else {
                console.warn('[TV Nav] ⚠️ No focusable elements found!');
            }
        },
        
        handleKey: function(e) {
            if (!this.enabled) {
                console.warn('[TV Nav] ⚠️ Navigation disabled!');
                return true;
            }
            
            var key = e.keyCode;
            console.log('[TV Nav] 🎮 Key:', key);
            
            switch(key) {
                case 37: // LEFT
                    console.log('[TV Nav] ⬅️ LEFT');
                    this.navigate(-1);
                    e.preventDefault();
                    return false;
                case 38: // UP
                    console.log('[TV Nav] ⬆️ UP');
                    this.navigate(-1);
                    e.preventDefault();
                    return false;
                case 39: // RIGHT
                    console.log('[TV Nav] ➡️ RIGHT');
                    this.navigate(1);
                    e.preventDefault();
                    return false;
                case 40: // DOWN
                    console.log('[TV Nav] ⬇️ DOWN');
                    this.navigate(1);
                    e.preventDefault();
                    return false;
                case 13: // ENTER
                    console.log('[TV Nav] ⏎ ENTER');
                    this.selectCurrent();
                    e.preventDefault();
                    return false;
            }
            
            return true;
        },
        
        updateFocusableElements: function() {
            // Include .focusable class (LGTV-master pattern)
            const selector = '.focusable, button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])';
            
            // Get all elements and sort by position (top-to-bottom, left-to-right)
            var allElements = Array.from(document.querySelectorAll(selector));
            
            // Filter visible elements
            this.focusableElements = allElements.filter(function(el) {
                var rect = el.getBoundingClientRect();
                var isVisible = rect.width > 0 && rect.height > 0;
                var hasParent = el.offsetParent !== null;
                return isVisible && hasParent;
            });
            
            // Sort by position: sidebar first (left), then by top position, then by left position
            this.focusableElements.sort(function(a, b) {
                var rectA = a.getBoundingClientRect();
                var rectB = b.getBoundingClientRect();
                
                // Sidebar is at left: 64px - these go first
                var isAInSidebar = rectA.left < 200;
                var isBInSidebar = rectB.left < 200;
                
                if (isAInSidebar && !isBInSidebar) return -1;
                if (!isAInSidebar && isBInSidebar) return 1;
                
                // If both in sidebar, sort by top position (Discover, Genres, Search, Favorites, Settings)
                if (isAInSidebar && isBInSidebar) {
                    return rectA.top - rectB.top;
                }
                
                // For main content, sort by top then left
                if (Math.abs(rectA.top - rectB.top) > 10) {
                    return rectA.top - rectB.top;
                }
                return rectA.left - rectB.left;
            });
            
            console.log('[TV Nav] 📋 Updated:', this.focusableElements.length, 'elements');
            
            // Debug: log first 10 elements
            for (var i = 0; i < Math.min(10, this.focusableElements.length); i++) {
                var el = this.focusableElements[i];
                var testid = el.dataset.testid || el.id || 'element-' + i;
                console.log('[TV Nav] 📍 [' + i + ']:', testid);
            }
        },
        
        navigate: function(direction) {
            this.updateFocusableElements();
            
            if (this.focusableElements.length === 0) {
                console.warn('[TV Nav] ⚠️ No focusable elements');
                return;
            }
            
            // Simple index increment/decrement (LGTV-master pattern)
            var newIndex = this.currentIndex + direction;
            
            // Wrap around
            if (newIndex < 0) {
                newIndex = this.focusableElements.length - 1;
            } else if (newIndex >= this.focusableElements.length) {
                newIndex = 0;
            }
            
            console.log('[TV Nav] 🔢 Index:', this.currentIndex, '→', newIndex);
            
            this.currentIndex = newIndex;
            this.focusElement(this.currentIndex);
        },
        
        focusElement: function(index) {
            if (index < 0 || index >= this.focusableElements.length) {
                console.warn('[TV Nav] ⚠️ Invalid index:', index);
                return;
            }
            
            // Remove 'active' class and styles from all elements (LGTV-master pattern)
            for (var i = 0; i < this.focusableElements.length; i++) {
                var el = this.focusableElements[i];
                el.classList.remove('active');
                el.style.border = '';
                el.style.outline = '';
                el.style.boxShadow = '';
            }
            
            // Add 'active' class and PINK BORDER to focused element
            var focusedEl = this.focusableElements[index];
            focusedEl.classList.add('active');
            
            // PINK BORDER (user requirement)
            focusedEl.style.border = '3px solid #FF1493';
            focusedEl.style.outline = 'none';
            focusedEl.style.boxShadow = '0 0 15px rgba(255, 20, 147, 0.6)';
            
            // Scroll into view
            focusedEl.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
            
            var id = focusedEl.dataset.testid || focusedEl.id || 'element-' + index;
            console.log('[TV Nav] ✅ Focused [' + index + ']:', id);
        },
        
        selectCurrent: function() {
            if (this.currentIndex >= 0 && this.currentIndex < this.focusableElements.length) {
                var el = this.focusableElements[this.currentIndex];
                console.log('[TV Nav] 🎯 Clicking:', el.dataset.testid || el.tagName);
                el.click();
            }
        }
    };
    
    // Register the focus router dispatch function
    console.log('[TV Spatial Nav] 🔧 Registering focusRouterDispatch...');
    window.focusRouterDispatch = function(keyCode) {
        console.log('[TV Spatial Nav] 🎯 focusRouterDispatch called, key:', keyCode);
        
        if (window.tvSpatialNav && window.tvSpatialNav.handleKey) {
            return window.tvSpatialNav.handleKey({ 
                keyCode: keyCode, 
                preventDefault: function() {} 
            });
        } else {
            console.warn('[TV Spatial Nav] ⚠️ tvSpatialNav not ready');
            return true;
        }
    };
    
    console.log('[TV Spatial Nav] ✅ Ready');
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('[TV Spatial Nav] DOM ready');
    });
})();
