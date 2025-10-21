/**
 * TV Spatial Navigation - Simple Grid-Based Navigation
 * Handles TV remote control navigation with arrow keys
 */

(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded and executing... v3.0 - Simple Grid Navigation');
    
    window.tvSpatialNav = {
        enabled: false,
        focusedElement: null,
        focusableElements: [],
        
        init: function() {
            console.log('[TV Spatial Nav] 🚀 Initializing...');
            this.enabled = true;
            this.updateFocusableElements();
            
            // Focus first element on page load
            if (this.focusableElements.length > 0) {
                console.log('[TV Nav] Initialized with', this.focusableElements.length, 'focusable elements');
                this.logElementPositions();
                
                // Focus first element
                this.focus(this.focusableElements[0]);
            } else {
                console.warn('[TV Nav] ⚠️ No focusable elements found!');
            }
        },
        
        handleKey: function(e) {
            console.log('[TV Nav] 🎮 handleKey called, enabled:', this.enabled, 'keyCode:', e.keyCode);
            
            if (!this.enabled) {
                console.warn('[TV Nav] ⚠️ Navigation disabled!');
                return true;
            }
            
            var key = e.keyCode;
            
            // Handle arrow keys for navigation
            switch(key) {
                case 37: // LEFT
                    console.log('[TV Nav] ⬅️ LEFT key');
                    this.navigate('left');
                    e.preventDefault();
                    return false;
                case 38: // UP
                    console.log('[TV Nav] ⬆️ UP key');
                    this.navigate('up');
                    e.preventDefault();
                    return false;
                case 39: // RIGHT
                    console.log('[TV Nav] ➡️ RIGHT key');
                    this.navigate('right');
                    e.preventDefault();
                    return false;
                case 40: // DOWN
                    console.log('[TV Nav] ⬇️ DOWN key');
                    this.navigate('down');
                    e.preventDefault();
                    return false;
                case 13: // ENTER
                    console.log('[TV Nav] ⏎ ENTER key');
                    if (this.focusedElement) {
                        console.log('[TV Nav] ENTER pressed on:', this.focusedElement);
                        this.focusedElement.click();
                        e.preventDefault();
                        return false;
                    }
                    break;
            }
            
            console.log('[TV Nav] Key not handled:', key);
            return true;
        },
        
        updateFocusableElements: function() {
            // Get all focusable elements
            const selector = 'button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])';
            
            this.focusableElements = Array.from(document.querySelectorAll(selector))
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    const hasParent = el.offsetParent !== null;
                    
                    return isVisible && hasParent;
                });
            
            console.log('[TV Nav] ✅ Found', this.focusableElements.length, 'focusable elements');
        },
        
        logElementPositions: function() {
            console.log('[TV Nav] 📍 Element positions:');
            this.focusableElements.slice(0, 10).forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const id = el.dataset.testid || el.id || el.className.split(' ')[0];
                console.log(`  [${i}] ${id}: x=${Math.round(rect.left)}, y=${Math.round(rect.top)}, w=${Math.round(rect.width)}, h=${Math.round(rect.height)}`);
            });
            if (this.focusableElements.length > 10) {
                console.log(`  ... and ${this.focusableElements.length - 10} more elements`);
            }
        },
        
        focus: function(element) {
            if (!element) {
                console.warn('[TV Nav] ⚠️ Cannot focus null element');
                return;
            }
            
            // Remove focus from previous element
            if (this.focusedElement) {
                this.focusedElement.style.outline = 'none';
                this.focusedElement.style.border = '';
                this.focusedElement.classList.remove('tv-focused');
            }
            
            // Apply focus to new element - PINK BORDER
            this.focusedElement = element;
            element.style.outline = 'none';
            element.style.border = '3px solid #FF1493'; // Deep pink color
            element.style.boxShadow = '0 0 10px rgba(255, 20, 147, 0.5)';
            element.classList.add('tv-focused');
            
            // Scroll into view if needed
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
            
            const id = element.dataset.testid || element.id || 'unknown';
            console.log('[TV Nav] ✅ Focused:', id);
        },
        
        navigate: function(direction) {
            console.log('[TV Nav] 🧭 navigate() called, direction:', direction);
            
            // Refresh focusable elements
            this.updateFocusableElements();
            
            if (this.focusableElements.length === 0) {
                console.warn('[TV Nav] ⚠️ No focusable elements available');
                return;
            }
            
            // If no element is focused, focus the first one
            if (!this.focusedElement) {
                console.log('[TV Nav] No element focused, focusing first element');
                this.focus(this.focusableElements[0]);
                return;
            }
            
            const nextElement = this.findNextElement(direction);
            
            if (nextElement) {
                const nextId = nextElement.dataset.testid || nextElement.id || 'unknown';
                console.log('[TV Nav] ✅ Moving', direction, 'to:', nextId);
                this.focus(nextElement);
            } else {
                console.log('[TV Nav] ❌ No element found in direction:', direction);
            }
        },
        
        findNextElement: function(direction) {
            if (!this.focusedElement) return this.focusableElements[0];
            
            const currentRect = this.focusedElement.getBoundingClientRect();
            const currentCenter = {
                x: currentRect.left + currentRect.width / 2,
                y: currentRect.top + currentRect.height / 2
            };
            
            console.log('[TV Nav] 🔍 Current element position:', {
                x: Math.round(currentCenter.x),
                y: Math.round(currentCenter.y),
                id: this.focusedElement.dataset.testid || 'unknown'
            });
            
            let candidates = [];
            
            // Filter elements based on direction
            this.focusableElements.forEach((el, index) => {
                if (el === this.focusedElement) return;
                
                const rect = el.getBoundingClientRect();
                const center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                
                const dx = center.x - currentCenter.x;
                const dy = center.y - currentCenter.y;
                
                let isInDirection = false;
                let distance = 0;
                let alignment = 0;
                
                switch(direction) {
                    case 'right':
                        // Element must be to the right (positive dx)
                        isInDirection = dx > 10; // At least 10px to the right
                        distance = Math.abs(dx);
                        alignment = Math.abs(dy); // Prefer elements at similar Y
                        break;
                    case 'left':
                        // Element must be to the left (negative dx)
                        isInDirection = dx < -10;
                        distance = Math.abs(dx);
                        alignment = Math.abs(dy);
                        break;
                    case 'down':
                        // Element must be below (positive dy)
                        isInDirection = dy > 10;
                        distance = Math.abs(dy);
                        alignment = Math.abs(dx); // Prefer elements at similar X
                        break;
                    case 'up':
                        // Element must be above (negative dy)
                        isInDirection = dy < -10;
                        distance = Math.abs(dy);
                        alignment = Math.abs(dx);
                        break;
                }
                
                if (isInDirection) {
                    // Calculate score: closer is better, better alignment is better
                    const score = distance + alignment * 2; // Weight alignment heavily
                    
                    candidates.push({
                        element: el,
                        distance: distance,
                        alignment: alignment,
                        score: score,
                        dx: dx,
                        dy: dy,
                        id: el.dataset.testid || el.id || `element-${index}`
                    });
                }
            });
            
            console.log('[TV Nav] 🎯 Found', candidates.length, 'candidates in direction', direction);
            
            if (candidates.length > 0) {
                // Log top 3 candidates
                candidates.sort((a, b) => a.score - b.score);
                console.log('[TV Nav] 📊 Top candidates:');
                candidates.slice(0, 3).forEach((c, i) => {
                    console.log(`  ${i + 1}. ${c.id} - score: ${Math.round(c.score)}, dist: ${Math.round(c.distance)}, align: ${Math.round(c.alignment)}`);
                });
                
                return candidates[0].element;
            }
            
            return null;
        },
        
        select: function() {
            if (this.focusedElement) {
                this.focusedElement.click();
            }
        }
    };
    
    // Register the focus router dispatch function
    console.log('[TV Spatial Nav] 🔧 About to register focusRouterDispatch...');
    window.focusRouterDispatch = function(keyCode) {
        console.log('[TV Spatial Nav] 🎯 focusRouterDispatch called, key:', keyCode);
        
        if (window.tvSpatialNav && window.tvSpatialNav.handleKey) {
            return window.tvSpatialNav.handleKey({ keyCode: keyCode, preventDefault: function() {} });
        } else {
            console.warn('[TV Spatial Nav] ⚠️ tvSpatialNav not ready');
            return true;
        }
    };
    
    console.log('[TV Spatial Nav] ✅ focusRouterDispatch registered:', typeof window.focusRouterDispatch);
    console.log('[TV Spatial Nav] ✅ window.tvSpatialNav:', typeof window.tvSpatialNav);
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('[TV Spatial Nav] DOM ready');
        console.log('[TV Spatial Nav] focusRouterDispatch available:', typeof window.focusRouterDispatch === 'function');
    });
})();
