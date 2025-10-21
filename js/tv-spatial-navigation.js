/**
 * TV Spatial Navigation - STRICT REGION-LOCK
 * UP/DOWN absolutely locked within regions
 */

(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded - STRICT LOCK v13.0');
    
    window.tvSpatialNav = {
        enabled: false,
        currentIndex: 0,
        focusableElements: [],
        sidebarElements: [],
        contentElements: [],
        
        init: function() {
            console.log('[TV Spatial Nav] 🚀 Initializing STRICT LOCK navigation...');
            this.enabled = true;
            this.updateFocusableElements();
            
            if (this.focusableElements.length > 0) {
                console.log('[TV Nav] ✅ Found', this.focusableElements.length, 'focusable elements');
                console.log('[TV Nav] 📍 Sidebar:', this.sidebarElements.length, 'items');
                console.log('[TV Nav] 📍 Content:', this.contentElements.length, 'items');
                
                // ALWAYS start on Discover sidebar button (index 0)
                this.currentIndex = 0;
                
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
                    this.navigateLeft();
                    e.preventDefault();
                    return false;
                case 38: // UP
                    console.log('[TV Nav] ⬆️ UP');
                    this.navigateUp();
                    e.preventDefault();
                    return false;
                case 39: // RIGHT
                    console.log('[TV Nav] ➡️ RIGHT');
                    this.navigateRight();
                    e.preventDefault();
                    return false;
                case 40: // DOWN
                    console.log('[TV Nav] ⬇️ DOWN');
                    this.navigateDown();
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
            const selector = '.focusable, button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])';
            
            var allElements = Array.from(document.querySelectorAll(selector));
            
            // Filter visible elements
            var visibleElements = allElements.filter(function(el) {
                var rect = el.getBoundingClientRect();
                var isVisible = rect.width > 0 && rect.height > 0;
                var hasParent = el.offsetParent !== null;
                return isVisible && hasParent;
            });
            
            // Sort by position: sidebar first, then content area
            visibleElements.sort(function(a, b) {
                var rectA = a.getBoundingClientRect();
                var rectB = b.getBoundingClientRect();
                
                var isAInSidebar = rectA.left < 200;
                var isBInSidebar = rectB.left < 200;
                
                if (isAInSidebar && !isBInSidebar) return -1;
                if (!isAInSidebar && isBInSidebar) return 1;
                
                if (Math.abs(rectA.top - rectB.top) > 10) {
                    return rectA.top - rectB.top;
                }
                return rectA.left - rectB.left;
            });
            
            this.focusableElements = visibleElements;
            
            // Separate into sidebar and content arrays
            this.sidebarElements = [];
            this.contentElements = [];
            
            for (var i = 0; i < this.focusableElements.length; i++) {
                var el = this.focusableElements[i];
                var rect = el.getBoundingClientRect();
                
                if (rect.left < 200) {
                    this.sidebarElements.push({ index: i, element: el, rect: rect });
                } else {
                    this.contentElements.push({ index: i, element: el, rect: rect });
                }
            }
            
            console.log('[TV Nav] 📋 Updated:', this.focusableElements.length, 'elements');
        },
        
        isInSidebar: function(index) {
            if (index < 0 || index >= this.focusableElements.length) return false;
            var rect = this.focusableElements[index].getBoundingClientRect();
            return rect.left < 200;
        },
        
        navigateLeft: function() {
            this.updateFocusableElements();
            
            var currentInSidebar = this.isInSidebar(this.currentIndex);
            
            if (currentInSidebar) {
                console.log('[TV Nav] Already in sidebar, no LEFT movement');
                return;
            }
            
            // In content area - try to move left within content first
            var currentEl = this.focusableElements[this.currentIndex];
            var currentRect = currentEl.getBoundingClientRect();
            
            // Find element to the left in similar vertical position (same row)
            var leftIndex = -1;
            var minDistance = Infinity;
            
            for (var i = 0; i < this.contentElements.length; i++) {
                var item = this.contentElements[i];
                if (item.index === this.currentIndex) continue;
                
                // Must be to the left and in similar vertical position (within 100px)
                if (item.rect.left < currentRect.left && 
                    Math.abs(item.rect.top - currentRect.top) < 100) {
                    var distance = currentRect.left - item.rect.left;
                    if (distance < minDistance) {
                        minDistance = distance;
                        leftIndex = item.index;
                    }
                }
            }
            
            if (leftIndex >= 0) {
                // Found an item to the left - move to it
                console.log('[TV Nav] Moving LEFT within content to index', leftIndex);
                this.currentIndex = leftIndex;
                this.focusElement(this.currentIndex);
                return;
            }
            
            // No item to the left - jump to sidebar
            var closestSidebarItem = this.sidebarElements[0];
            var minDist = Math.abs(currentRect.top - closestSidebarItem.rect.top);
            
            for (var i = 1; i < this.sidebarElements.length; i++) {
                var distance = Math.abs(currentRect.top - this.sidebarElements[i].rect.top);
                if (distance < minDist) {
                    minDist = distance;
                    closestSidebarItem = this.sidebarElements[i];
                }
            }
            
            console.log('[TV Nav] Jumping LEFT to sidebar index', closestSidebarItem.index);
            this.currentIndex = closestSidebarItem.index;
            this.focusElement(this.currentIndex);
        },
        
        navigateRight: function() {
            this.updateFocusableElements();
            
            var currentInSidebar = this.isInSidebar(this.currentIndex);
            var currentEl = this.focusableElements[this.currentIndex];
            var currentRect = currentEl.getBoundingClientRect();
            
            // Find next element on the right in similar vertical position
            var rightIndex = -1;
            var minDistance = Infinity;
            
            var searchArray = currentInSidebar ? this.contentElements : this.contentElements;
            
            for (var i = 0; i < searchArray.length; i++) {
                var item = searchArray[i];
                if (item.index === this.currentIndex) continue;
                
                // Must be to the right and in similar vertical position (within 100px)
                if (item.rect.left > currentRect.left && 
                    Math.abs(item.rect.top - currentRect.top) < 100) {
                    var distance = item.rect.left - currentRect.left;
                    if (distance < minDistance) {
                        minDistance = distance;
                        rightIndex = item.index;
                    }
                }
            }
            
            if (rightIndex >= 0) {
                console.log('[TV Nav] Moving RIGHT to index', rightIndex);
                this.currentIndex = rightIndex;
                this.focusElement(this.currentIndex);
            } else {
                console.log('[TV Nav] No item to the right');
            }
        },
        
        navigateUp: function() {
            this.updateFocusableElements();
            
            var currentInSidebar = this.isInSidebar(this.currentIndex);
            var currentEl = this.focusableElements[this.currentIndex];
            var currentRect = currentEl.getBoundingClientRect();
            
            console.log('[TV Nav] 🔍 Current in sidebar:', currentInSidebar);
            
            // UP/DOWN STRICTLY locked within region
            var searchArray = currentInSidebar ? this.sidebarElements : this.contentElements;
            
            console.log('[TV Nav] 🔍 Searching within', searchArray.length, 'items in', currentInSidebar ? 'SIDEBAR' : 'CONTENT');
            
            // Find closest element above current position
            var bestIndex = -1;
            var minDistance = Infinity;
            
            for (var i = 0; i < searchArray.length; i++) {
                var item = searchArray[i];
                if (item.index === this.currentIndex) continue;
                
                // STRICT CHECK: Must be in same region
                var itemInSidebar = this.isInSidebar(item.index);
                if (itemInSidebar !== currentInSidebar) {
                    console.log('[TV Nav] ⚠️ Skipping item', item.index, '- wrong region');
                    continue;
                }
                
                // Must be above (smaller top value)
                if (item.rect.top < currentRect.top - 20) {
                    // Calculate distance (prefer items directly above)
                    var verticalDist = currentRect.top - item.rect.top;
                    var horizontalDist = Math.abs(item.rect.left - currentRect.left);
                    var distance = verticalDist + (horizontalDist * 0.3);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestIndex = item.index;
                    }
                }
            }
            
            if (bestIndex >= 0) {
                // FINAL CHECK: Make sure we're not jumping to wrong region
                var targetInSidebar = this.isInSidebar(bestIndex);
                if (targetInSidebar !== currentInSidebar) {
                    console.log('[TV Nav] ⛔ BLOCKED: Would jump from', currentInSidebar ? 'sidebar' : 'content', 'to', targetInSidebar ? 'sidebar' : 'content');
                    return;
                }
                
                console.log('[TV Nav] Moving UP to index', bestIndex);
                this.currentIndex = bestIndex;
                this.focusElement(this.currentIndex);
            } else {
                // Wrap to bottom within same region only
                if (searchArray.length > 0) {
                    var bottomItem = searchArray[searchArray.length - 1];
                    console.log('[TV Nav] Wrapping to bottom index', bottomItem.index);
                    this.currentIndex = bottomItem.index;
                    this.focusElement(this.currentIndex);
                }
            }
        },
        
        navigateDown: function() {
            this.updateFocusableElements();
            
            var currentInSidebar = this.isInSidebar(this.currentIndex);
            var currentEl = this.focusableElements[this.currentIndex];
            var currentRect = currentEl.getBoundingClientRect();
            
            console.log('[TV Nav] 🔍 Current in sidebar:', currentInSidebar);
            
            // UP/DOWN STRICTLY locked within region
            var searchArray = currentInSidebar ? this.sidebarElements : this.contentElements;
            
            console.log('[TV Nav] 🔍 Searching within', searchArray.length, 'items in', currentInSidebar ? 'SIDEBAR' : 'CONTENT');
            
            // Find closest element below current position
            var bestIndex = -1;
            var minDistance = Infinity;
            
            for (var i = 0; i < searchArray.length; i++) {
                var item = searchArray[i];
                if (item.index === this.currentIndex) continue;
                
                // STRICT CHECK: Must be in same region
                var itemInSidebar = this.isInSidebar(item.index);
                if (itemInSidebar !== currentInSidebar) {
                    console.log('[TV Nav] ⚠️ Skipping item', item.index, '- wrong region');
                    continue;
                }
                
                // Must be below (larger top value)
                if (item.rect.top > currentRect.top + 20) {
                    // Calculate distance (prefer items directly below)
                    var verticalDist = item.rect.top - currentRect.top;
                    var horizontalDist = Math.abs(item.rect.left - currentRect.left);
                    var distance = verticalDist + (horizontalDist * 0.3);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestIndex = item.index;
                    }
                }
            }
            
            if (bestIndex >= 0) {
                // FINAL CHECK: Make sure we're not jumping to wrong region
                var targetInSidebar = this.isInSidebar(bestIndex);
                if (targetInSidebar !== currentInSidebar) {
                    console.log('[TV Nav] ⛔ BLOCKED: Would jump from', currentInSidebar ? 'sidebar' : 'content', 'to', targetInSidebar ? 'sidebar' : 'content');
                    return;
                }
                
                console.log('[TV Nav] Moving DOWN to index', bestIndex);
                this.currentIndex = bestIndex;
                this.focusElement(this.currentIndex);
            } else {
                // Wrap to top within same region only
                if (searchArray.length > 0) {
                    var topItem = searchArray[0];
                    console.log('[TV Nav] Wrapping to top index', topItem.index);
                    this.currentIndex = topItem.index;
                    this.focusElement(this.currentIndex);
                }
            }
        },
        
        focusElement: function(index) {
            if (index < 0 || index >= this.focusableElements.length) {
                console.warn('[TV Nav] ⚠️ Invalid index:', index);
                return;
            }
            
            // Remove 'active' class and styles from all elements
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
    window.focusRouterDispatch = function(e) {
        console.log('[TV Spatial Nav] 🎯 focusRouterDispatch called, keyCode:', e.keyCode);
        
        if (window.tvSpatialNav && window.tvSpatialNav.handleKey) {
            return window.tvSpatialNav.handleKey(e);
        } else {
            console.warn('[TV Spatial Nav] ⚠️ tvSpatialNav not ready');
            return true;
        }
    };
    
    console.log('[TV Spatial Nav] ✅ Ready');
    
    $(document).ready(function() {
        console.log('[TV Spatial Nav] DOM ready');
    });
})();
