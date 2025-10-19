/**
 * Mega Radio - Styles Helper
 * Figma-exact constants and style helpers for 1920x1080 TV layout
 */

var TVColors = {
    // Background colors
    background: '#0e0e0e',
    backgroundOverlay: 'rgba(14, 14, 14, 0)',
    backgroundGradientEnd: '#0e0e0e',
    
    // White variants
    white: '#ffffff',
    whiteOverlay05: 'rgba(255, 255, 255, 0.05)',
    whiteOverlay10: 'rgba(255, 255, 255, 0.1)',
    whiteOverlay20: 'rgba(255, 255, 255, 0.2)',
    whiteOverlay30: 'rgba(255, 255, 255, 0.3)',
    whiteOverlay50: 'rgba(255, 255, 255, 0.5)',
    
    // Accent colors
    pink: '#ff4199',
    pinkPrimary: '#ff006e',
    pinkDark: '#cc0058',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    textMuted: '#9b9b9b',
    textGray: '#999999',
    textDark: '#666666',
    textBlack: '#444444',
    
    // Border colors
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',
    
    // Gradient colors
    gradientPinkStart: '#ec4899',
    gradientPinkEnd: '#9333ea',
    gradientPrimaryStart: '#ff006e',
    gradientPrimaryEnd: '#cc0058'
};

var TVSpacing = {
    // Container dimensions
    screenWidth: 1920,
    screenHeight: 1080,
    
    // Layout spacing
    sidebarWidth: 162,
    contentPaddingLeft: 190,
    contentPaddingRight: 64,
    contentPaddingTop: 64,
    contentPaddingBottom: 64,
    
    // Component spacing
    gap8: 8,
    gap12: 12,
    gap16: 16,
    gap20: 20,
    gap24: 24,
    gap30: 30,
    gap32: 32,
    gap40: 40,
    gap48: 48,
    gap56: 56,
    
    // Border radius
    radius8: 8,
    radius10: 10,
    radius16: 16,
    radius30: 30,
    radius50: 50,
    
    // Sidebar
    sidebarItemHeight: 108,
    sidebarLeft: 64,
    sidebarTop: 242,
    sidebarItemWidth: 98,
    
    // Header positions (from Figma)
    logoLeft: 31,
    logoTop: 64,
    equalizerLeft: 1281,
    equalizerTop: 67,
    countrySelectorLeft: 1351,
    countrySelectorTop: 67,
    userProfileLeft: 1648,
    userProfileTop: 59
};

var TVTypography = {
    // Font family
    fontFamily: "'Ubuntu', Helvetica",
    
    // Font weights
    weightRegular: 400,
    weightMedium: 500,
    weightSemiBold: 600,
    weightBold: 700,
    
    // Font sizes
    size12: 12,
    size14: 14,
    size16: 16,
    size18: 18,
    size20: 20,
    size22: 22,
    size24: 24,
    size28: 28,
    size32: 32,
    size42: 42,
    size48: 48,
    size56: 56,
    
    // Line heights
    lineNormal: 'normal',
    line1_4: 1.4,
    line1_6: 1.6
};

var TVGradients = {
    // Linear gradients
    pinkPurple: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
    pinkDark: 'linear-gradient(135deg, #ff006e 0%, #cc0058 100%)',
    pinkPurpleRight: 'linear-gradient(to right, #ec4899, #9333ea)',
    
    // Overlay gradients
    darkOverlay: 'linear-gradient(180deg, rgba(14, 14, 14, 0) 0%, rgba(14, 14, 14, 0.8) 50%, #0e0e0e 100%)',
    
    // Background gradient for concert crowd (from Figma)
    concertGradient: 'linear-gradient(180deg, rgba(14, 14, 14, 0) 18.333%, #0e0e0e 85.185%)'
};

var StyleHelpers = {
    /**
     * Generate absolute positioning style
     * @param {number} left - Left position in pixels
     * @param {number} top - Top position in pixels
     * @param {number} width - Width in pixels (optional)
     * @param {number} height - Height in pixels (optional)
     * @returns {string} CSS style string
     */
    position: function(left, top, width, height) {
        var style = 'position: absolute; left: ' + left + 'px; top: ' + top + 'px;';
        if (width !== undefined) {
            style += ' width: ' + width + 'px;';
        }
        if (height !== undefined) {
            style += ' height: ' + height + 'px;';
        }
        return style;
    },
    
    /**
     * Generate fixed positioning style
     * @param {number} left - Left position in pixels
     * @param {number} top - Top position in pixels
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     * @returns {string} CSS style string
     */
    fixedPosition: function(left, top, width, height) {
        return 'position: fixed; left: ' + left + 'px; top: ' + top + 'px; width: ' + width + 'px; height: ' + height + 'px;';
    },
    
    /**
     * Generate full screen container style
     * @returns {string} CSS style string
     */
    fullScreen: function() {
        return 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: ' + TVSpacing.screenWidth + 'px; height: ' + TVSpacing.screenHeight + 'px; overflow: hidden;';
    },
    
    /**
     * Generate text style
     * @param {number} size - Font size in pixels
     * @param {number} weight - Font weight (400, 500, 600, 700)
     * @param {string} color - Color value
     * @param {string} align - Text alignment (optional)
     * @returns {string} CSS style string
     */
    text: function(size, weight, color, align) {
        var style = 'font-family: ' + TVTypography.fontFamily + '; font-size: ' + size + 'px; font-weight: ' + weight + '; color: ' + color + '; font-style: normal; line-height: normal;';
        if (align) {
            style += ' text-align: ' + align + ';';
        }
        return style;
    },
    
    /**
     * Generate background image style
     * @param {string} imagePath - Path to image
     * @param {string} size - Background size (default: 'cover')
     * @param {string} position - Background position (default: 'center')
     * @returns {string} CSS style string
     */
    backgroundImage: function(imagePath, size, position) {
        size = size || 'cover';
        position = position || 'center';
        return 'background-image: url(' + imagePath + '); background-size: ' + size + '; background-position: ' + position + '; background-repeat: no-repeat;';
    },
    
    /**
     * Generate background color with overlay
     * @param {string} color - Background color
     * @returns {string} CSS style string
     */
    background: function(color) {
        return 'background: ' + color + ';';
    },
    
    /**
     * Generate border radius style
     * @param {number} radius - Border radius in pixels
     * @returns {string} CSS style string
     */
    borderRadius: function(radius) {
        return 'border-radius: ' + radius + 'px;';
    },
    
    /**
     * Generate flex container style
     * @param {string} direction - Flex direction (row, column)
     * @param {string} justify - Justify content (optional)
     * @param {string} align - Align items (optional)
     * @param {number} gap - Gap in pixels (optional)
     * @returns {string} CSS style string
     */
    flex: function(direction, justify, align, gap) {
        var style = 'display: flex; flex-direction: ' + direction + ';';
        if (justify) {
            style += ' justify-content: ' + justify + ';';
        }
        if (align) {
            style += ' align-items: ' + align + ';';
        }
        if (gap !== undefined) {
            style += ' gap: ' + gap + 'px;';
        }
        return style;
    },
    
    /**
     * Generate grid style
     * @param {number} columns - Number of columns
     * @param {number} gap - Gap in pixels
     * @returns {string} CSS style string
     */
    grid: function(columns, gap) {
        return 'display: grid; grid-template-columns: repeat(' + columns + ', 1fr); gap: ' + gap + 'px;';
    },
    
    /**
     * Generate button style
     * @param {string} background - Background color
     * @param {string} color - Text color
     * @param {number} padding - Padding (optional)
     * @returns {string} CSS style string
     */
    button: function(background, color, padding) {
        var style = 'background: ' + background + '; color: ' + color + '; border: none; cursor: pointer; transition: all 0.3s; font-family: ' + TVTypography.fontFamily + ';';
        if (padding !== undefined) {
            style += ' padding: ' + padding + 'px;';
        }
        return style;
    },
    
    /**
     * Generate card style
     * @param {string} background - Background color
     * @param {number} radius - Border radius
     * @param {string} padding - Padding (optional)
     * @returns {string} CSS style string
     */
    card: function(background, radius, padding) {
        var style = 'background: ' + background + '; border-radius: ' + radius + 'px; overflow: hidden; cursor: pointer; transition: all 0.3s;';
        if (padding) {
            style += ' padding: ' + padding + ';';
        }
        return style;
    },
    
    /**
     * Generate image style
     * @param {number} width - Width in pixels or percentage
     * @param {number} height - Height in pixels or percentage
     * @param {string} objectFit - Object fit (cover, contain, etc.)
     * @returns {string} CSS style string
     */
    image: function(width, height, objectFit) {
        objectFit = objectFit || 'cover';
        var style = 'display: block; max-width: none;';
        if (typeof width === 'string') {
            style += ' width: ' + width + ';';
        } else {
            style += ' width: ' + width + 'px;';
        }
        if (typeof height === 'string') {
            style += ' height: ' + height + ';';
        } else {
            style += ' height: ' + height + 'px;';
        }
        style += ' object-fit: ' + objectFit + ';';
        return style;
    },
    
    /**
     * Generate overlay style
     * @param {string} color - Overlay color (rgba recommended)
     * @returns {string} CSS style string
     */
    overlay: function(color) {
        return 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ' + color + '; pointer-events: none;';
    },
    
    /**
     * Combine multiple style strings
     * @param {...string} styles - Style strings to combine
     * @returns {string} Combined CSS style string
     */
    combine: function() {
        return Array.prototype.slice.call(arguments).join(' ');
    }
};
