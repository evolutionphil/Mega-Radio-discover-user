/**
 * TV Spatial Navigation - INDEX-BASED (LGTV-Master Pattern)
 * Simple index-based navigation like LGTV-master reference
 */

(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded - INDEX-BASED v6.0');
    
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
                
                // Find Discover button and focus it (user requirement)
                var discoverIndex = -1;
                for (var i = 0; i < this.focusableElements.length; i++) {
                    var el = this.focusableElements[i];
                    var testid = el.dataset.testid || '';
                    var text = el.textContent || '';
                    
                    if (testid.includes('discover') || testid.includes('sidebar-discover') ||
                        text.trim().toLowerCase() === 'discover') {
                        discoverIndex = i;
                        break;
                    }
                }
                
                if (discoverIndex >= 0) {
                    console.log('[TV Nav] 🎯 Found Discover button at index', discoverIndex);
                    this.currentIndex = discoverIndex;
                } else {
                    console.log('[TV Nav] ⚠️ Discover not found, starting at index 0');
                    this.currentIndex = 0;
                }
                
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
            const selector = 'button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])';
            
            this.focusableElements = Array.from(document.querySelectorAll(selector))
                .filter(function(el) {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    const hasParent = el.offsetParent !== null;
                    return isVisible && hasParent;
                });
            
            console.log('[TV Nav] 📋 Updated:', this.focusableElements.length, 'elements');
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
            
            // Remove 'active' class from all elements (LGTV-master pattern)
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
