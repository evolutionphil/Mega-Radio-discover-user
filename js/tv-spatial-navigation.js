/**
 * TV Spatial Navigation - 2D GRID NAVIGATION
 * Smart grid-based navigation with UP/DOWN/LEFT/RIGHT
 */

(function() {
    'use strict';
    
    console.log('[TV Spatial Nav] Script loaded - 2D GRID v9.0');
    
    window.tvSpatialNav = {
        enabled: false,
        currentIndex: 0,
        focusableElements: [],
        grid: [],
        
        init: function() {
            console.log('[TV Spatial Nav] 🚀 Initializing 2D GRID navigation...');
            this.enabled = true;
            this.updateFocusableElements();
            
            if (this.focusableElements.length > 0) {
                console.log('[TV Nav] ✅ Found', this.focusableElements.length, 'focusable elements');
                
                // Build grid structure
                this.buildGrid();
                
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
            // Include .focusable class (LGTV-master pattern)
            const selector = '.focusable, button:not([disabled]), a[href], [data-tv-focusable="true"], [tabindex]:not([tabindex="-1"])';
            
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
                
                // If both in sidebar, sort by top position
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
        },
        
        buildGrid: function() {
            // Build a 2D grid structure based on element positions
            this.grid = [];
            var rows = [];
            var currentRow = [];
            var lastTop = -1;
            
            for (var i = 0; i < this.focusableElements.length; i++) {
                var el = this.focusableElements[i];
                var rect = el.getBoundingClientRect();
                
                // Check if this is a sidebar element (special handling)
                var isSidebar = rect.left < 200;
                
                if (isSidebar) {
                    // Each sidebar item gets its own row
                    if (currentRow.length > 0) {
                        rows.push(currentRow);
                        currentRow = [];
                    }
                    rows.push([i]);
                    lastTop = rect.top;
                } else {
                    // Main content: group by vertical position (same row = within 50px)
                    if (lastTop === -1 || Math.abs(rect.top - lastTop) < 50) {
                        currentRow.push(i);
                        lastTop = rect.top;
                    } else {
                        if (currentRow.length > 0) {
                            rows.push(currentRow);
                        }
                        currentRow = [i];
                        lastTop = rect.top;
                    }
                }
            }
            
            // Push last row
            if (currentRow.length > 0) {
                rows.push(currentRow);
            }
            
            this.grid = rows;
            
            console.log('[TV Nav] 📐 Grid built:', this.grid.length, 'rows');
            for (var r = 0; r < Math.min(5, this.grid.length); r++) {
                console.log('[TV Nav]   Row', r + ':', this.grid[r].length, 'items');
            }
        },
        
        getCurrentPosition: function() {
            // Find current element's row and column in grid
            for (var r = 0; r < this.grid.length; r++) {
                for (var c = 0; c < this.grid[r].length; c++) {
                    if (this.grid[r][c] === this.currentIndex) {
                        return { row: r, col: c };
                    }
                }
            }
            return { row: 0, col: 0 };
        },
        
        navigateLeft: function() {
            this.updateFocusableElements();
            this.buildGrid();
            
            var pos = this.getCurrentPosition();
            console.log('[TV Nav] Current pos: row', pos.row, 'col', pos.col);
            
            // Try to move left in same row
            if (pos.col > 0) {
                var newIndex = this.grid[pos.row][pos.col - 1];
                console.log('[TV Nav] Moving left in row to index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
            } else {
                console.log('[TV Nav] Already at leftmost position');
            }
        },
        
        navigateRight: function() {
            this.updateFocusableElements();
            this.buildGrid();
            
            var pos = this.getCurrentPosition();
            console.log('[TV Nav] Current pos: row', pos.row, 'col', pos.col);
            
            // Try to move right in same row
            if (pos.col < this.grid[pos.row].length - 1) {
                var newIndex = this.grid[pos.row][pos.col + 1];
                console.log('[TV Nav] Moving right in row to index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
            } else {
                console.log('[TV Nav] Already at rightmost position');
            }
        },
        
        navigateUp: function() {
            this.updateFocusableElements();
            this.buildGrid();
            
            var pos = this.getCurrentPosition();
            console.log('[TV Nav] Current pos: row', pos.row, 'col', pos.col);
            
            // Try to move up to previous row
            if (pos.row > 0) {
                var targetRow = pos.row - 1;
                var targetCol = Math.min(pos.col, this.grid[targetRow].length - 1);
                var newIndex = this.grid[targetRow][targetCol];
                console.log('[TV Nav] Moving up to row', targetRow, 'index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
            } else {
                // Wrap to bottom
                var targetRow = this.grid.length - 1;
                var targetCol = Math.min(pos.col, this.grid[targetRow].length - 1);
                var newIndex = this.grid[targetRow][targetCol];
                console.log('[TV Nav] Wrapping to bottom row', targetRow, 'index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
            }
        },
        
        navigateDown: function() {
            this.updateFocusableElements();
            this.buildGrid();
            
            var pos = this.getCurrentPosition();
            console.log('[TV Nav] Current pos: row', pos.row, 'col', pos.col);
            
            // Try to move down to next row
            if (pos.row < this.grid.length - 1) {
                var targetRow = pos.row + 1;
                var targetCol = Math.min(pos.col, this.grid[targetRow].length - 1);
                var newIndex = this.grid[targetRow][targetCol];
                console.log('[TV Nav] Moving down to row', targetRow, 'index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
            } else {
                // Wrap to top
                var targetRow = 0;
                var targetCol = Math.min(pos.col, this.grid[targetRow].length - 1);
                var newIndex = this.grid[targetRow][targetCol];
                console.log('[TV Nav] Wrapping to top row', targetRow, 'index', newIndex);
                this.currentIndex = newIndex;
                this.focusElement(this.currentIndex);
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
        // e is the full Event object from tv-remote-keys.js
        console.log('[TV Spatial Nav] 🎯 focusRouterDispatch called, keyCode:', e.keyCode);
        
        if (window.tvSpatialNav && window.tvSpatialNav.handleKey) {
            // Pass the event directly - it already has keyCode, preventDefault, etc.
            return window.tvSpatialNav.handleKey(e);
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
