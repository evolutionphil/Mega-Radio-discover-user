/**
 * Mega Radio - TV Base Layout Helper
 * Renders the common TV layout structure (1920x1080) with background, header elements, sidebar and content placeholders
 */

var TVLayout = {
    /**
     * Render base TV layout with concert crowd background and header elements
     * @param {Object} options - Layout options
     * @param {boolean} options.showLogo - Show logo in top-left (default: true)
     * @param {boolean} options.showEqualizer - Show equalizer icon (default: false)
     * @param {boolean} options.showCountrySelector - Show country selector (default: false)
     * @param {boolean} options.showUserProfile - Show user profile (default: false)
     * @param {boolean} options.showSidebar - Show sidebar container (default: false)
     * @param {string} options.backgroundImage - Custom background image path (default: concert crowd)
     * @param {string} options.sidebarContent - Custom sidebar HTML content
     * @param {string} options.contentAreaStyle - Custom content area inline styles
     * @returns {string} Complete HTML layout string
     */
    renderBaseLayout: function(options) {
        options = options || {};
        
        var showLogo = options.showLogo !== undefined ? options.showLogo : true;
        var showEqualizer = options.showEqualizer !== undefined ? options.showEqualizer : false;
        var showCountrySelector = options.showCountrySelector !== undefined ? options.showCountrySelector : false;
        var showUserProfile = options.showUserProfile !== undefined ? options.showUserProfile : false;
        var showSidebar = options.showSidebar !== undefined ? options.showSidebar : false;
        var backgroundImage = options.backgroundImage || Utils.assetPath('images/hand-crowd-disco-1.png');
        var sidebarContent = options.sidebarContent || '';
        var contentAreaStyle = options.contentAreaStyle || 'position: absolute; left: 190px; right: 64px; top: 64px; bottom: 64px; overflow-y: auto;';
        
        // Build header elements HTML
        var headerElements = '';
        
        // Logo (top-left)
        if (showLogo) {
            headerElements += this.renderLogo();
        }
        
        // Equalizer icon
        if (showEqualizer) {
            headerElements += this.renderEqualizerIcon();
        }
        
        // Country selector
        if (showCountrySelector) {
            headerElements += this.renderCountrySelector();
        }
        
        // User profile
        if (showUserProfile) {
            headerElements += this.renderUserProfile();
        }
        
        // Sidebar container
        var sidebarHtml = '';
        if (showSidebar) {
            sidebarHtml = '<div id="tv-sidebar-container" style="' + StyleHelpers.position(TVSpacing.sidebarLeft, TVSpacing.sidebarTop, TVSpacing.sidebarItemWidth, 638) + ' z-index: 50;">' + sidebarContent + '</div>';
        }
        
        // Build complete layout
        var html = `
            <div style="${StyleHelpers.fullScreen()} background: ${TVColors.background};">
                <!-- Background Image -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;">
                    <img src="${backgroundImage}" 
                         alt="Background" 
                         style="${StyleHelpers.image('100%', '100%', 'cover')} pointer-events: none;">
                </div>
                
                <!-- Gradient Overlay -->
                <div style="${StyleHelpers.overlay(TVGradients.concertGradient)} z-index: 1;"></div>
                
                <!-- Header Elements -->
                <div style="position: relative; z-index: 10;">
                    ${headerElements}
                </div>
                
                <!-- Sidebar Container -->
                ${sidebarHtml}
                
                <!-- Content Area Placeholder -->
                <div id="tv-content-area" style="${contentAreaStyle} z-index: 5;">
                    <!-- Page-specific content will be inserted here -->
                </div>
            </div>
        `;
        
        return html;
    },
    
    /**
     * Render logo element (top-left corner)
     * @returns {string} HTML string for logo
     */
    renderLogo: function() {
        return `
            <div style="${StyleHelpers.position(TVSpacing.logoLeft, TVSpacing.logoTop, 323, 112)}">
                <p style="${StyleHelpers.text(53, TVTypography.weightRegular, TVColors.white)} position: absolute; bottom: 0; left: 18.67%; right: 0; top: 46.16%; white-space: nowrap;">
                    <span style="font-family: ${TVTypography.fontFamily}; font-weight: ${TVTypography.weightBold};">mega</span>radio
                </p>
                <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                    <img alt="Logo" 
                         style="${StyleHelpers.image('100%', '100%', 'contain')}" 
                         src="${Utils.assetPath('images/path-8-figma.svg')}">
                </div>
            </div>
        `;
    },
    
    /**
     * Render equalizer icon
     * @returns {string} HTML string for equalizer icon
     */
    renderEqualizerIcon: function() {
        return `
            <div class="focusable" 
                 data-focus-index="equalizer-icon"
                 style="${StyleHelpers.position(TVSpacing.equalizerLeft, TVSpacing.equalizerTop, 48, 48)} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} cursor: pointer; transition: all 0.2s;"
                 data-testid="button-equalizer">
                <div style="${StyleHelpers.flex('row', 'center', 'center')} width: 100%; height: 100%;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="10" width="2" height="11" fill="${TVColors.white}"/>
                        <rect x="8" y="6" width="2" height="15" fill="${TVColors.white}"/>
                        <rect x="13" y="3" width="2" height="18" fill="${TVColors.white}"/>
                        <rect x="18" y="8" width="2" height="13" fill="${TVColors.white}"/>
                    </svg>
                </div>
            </div>
        `;
    },
    
    /**
     * Render country selector
     * @param {string} countryFlag - Country flag emoji (default: 🇺🇸)
     * @param {string} countryName - Country name (default: United States)
     * @returns {string} HTML string for country selector
     */
    renderCountrySelector: function(countryFlag, countryName) {
        countryFlag = countryFlag || '🇺🇸';
        countryName = countryName || 'United States';
        
        return `
            <div class="focusable" 
                 id="tv-country-selector"
                 data-focus-index="country-selector"
                 style="${StyleHelpers.position(TVSpacing.countrySelectorLeft, TVSpacing.countrySelectorTop, 'auto', 'auto')} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} padding: 12px 20px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'flex-start', 'center', 12)}"
                 data-testid="button-country-selector">
                <span style="font-size: 24px;">${countryFlag}</span>
                <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">${countryName}</span>
                <span style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.white)}">▼</span>
            </div>
        `;
    },
    
    /**
     * Render user profile
     * @param {string} userName - User name (default: null for guest)
     * @param {string} userAvatar - User avatar URL (default: null)
     * @returns {string} HTML string for user profile
     */
    renderUserProfile: function(userName, userAvatar) {
        var isGuest = !userName;
        var displayName = userName || 'Guest';
        var avatarHtml = '';
        
        if (userAvatar) {
            avatarHtml = '<img src="' + userAvatar + '" alt="' + displayName + '" style="' + StyleHelpers.image(48, 48, 'cover') + ' ' + StyleHelpers.borderRadius(24) + '">';
        } else {
            // Default user icon
            avatarHtml = `
                <div style="${StyleHelpers.image(48, 48)} ${StyleHelpers.background(TVColors.whiteOverlay20)} ${StyleHelpers.borderRadius(24)} ${StyleHelpers.flex('row', 'center', 'center')}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="${TVColors.white}"/>
                        <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="${TVColors.white}"/>
                    </svg>
                </div>
            `;
        }
        
        return `
            <div class="focusable" 
                 id="tv-user-profile"
                 data-focus-index="user-profile"
                 style="${StyleHelpers.position(TVSpacing.userProfileLeft, TVSpacing.userProfileTop, 'auto', 'auto')} ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(TVSpacing.radius10)} padding: 8px 16px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'flex-start', 'center', 12)}"
                 data-testid="button-user-profile">
                ${avatarHtml}
                <span style="${StyleHelpers.text(18, TVTypography.weightMedium, TVColors.white)}">${displayName}</span>
            </div>
        `;
    },
    
    /**
     * Render content area with custom content
     * @param {string} content - HTML content to render
     * @param {string} customStyle - Custom inline styles for content area (optional)
     * @returns {string} HTML string for content area
     */
    renderContentArea: function(content, customStyle) {
        var style = customStyle || 'position: absolute; left: 190px; right: 64px; top: 64px; bottom: 64px; overflow-y: auto;';
        return '<div id="tv-content-area" style="' + style + ' z-index: 5;">' + content + '</div>';
    },
    
    /**
     * Get default content area styles for pages with sidebar
     * @returns {string} CSS style string
     */
    getContentAreaStyles: function() {
        return 'position: absolute; left: ' + TVSpacing.contentPaddingLeft + 'px; right: ' + TVSpacing.contentPaddingRight + 'px; top: ' + TVSpacing.contentPaddingTop + 'px; bottom: ' + TVSpacing.contentPaddingBottom + 'px; overflow-y: auto;';
    },
    
    /**
     * Get full screen content area styles (no sidebar)
     * @returns {string} CSS style string
     */
    getFullScreenContentStyles: function() {
        return 'position: absolute; left: ' + TVSpacing.contentPaddingRight + 'px; right: ' + TVSpacing.contentPaddingRight + 'px; top: ' + TVSpacing.contentPaddingTop + 'px; bottom: ' + TVSpacing.contentPaddingBottom + 'px; overflow-y: auto;';
    }
};
