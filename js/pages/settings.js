/**
 * Mega Radio - Settings Page
 * Figma-exact implementation with sidebar, settings panel, and profile card
 */

var settings_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        currentLanguage: 'en',
        currentCountry: 'United States',
        currentCountryCode: 'US',
        playAtStart: 'last-played',
        userName: 'Talha Çay',
        userEmail: 'talha@megaradio.com'
    },
    
    init: function() {
        console.log('[Settings] Initializing...');
        this.loadSettings();
        this.render();
        this.bindEvents();
    },
    
    loadSettings: function() {
        this.data.currentLanguage = State.get('currentLanguage') || AppConfig.DEFAULT_LANGUAGE;
        this.data.currentCountry = State.get('currentCountry') || AppConfig.DEFAULT_COUNTRY;
        this.data.currentCountryCode = State.get('currentCountryCode') || AppConfig.DEFAULT_COUNTRY_CODE;
        this.data.playAtStart = localStorage.getItem('megaradio_play_at_start') || 'last-played';
        
        console.log('[Settings] Current settings:', this.data);
    },
    
    render: function() {
        var html = `
            <div style="${StyleHelpers.fullScreen()} ${StyleHelpers.background(TVColors.background)}" data-testid="page-settings">
                <!-- Background Image -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;">
                    <img src="${Utils.assetPath('images/hand-crowd-disco-1.png')}" 
                         alt="Background" 
                         style="${StyleHelpers.image('100%', '100%', 'cover')} pointer-events: none;">
                </div>
                
                <!-- Gradient Overlay -->
                <div style="${StyleHelpers.overlay(TVGradients.concertGradient)} z-index: 1;"></div>
                
                <!-- Sidebar -->
                <div id="settings-sidebar" style="position: relative; z-index: 50;"></div>
                
                <!-- Page Title -->
                <div style="${StyleHelpers.position(236, 242)} z-index: 10;">
                    <h1 style="${StyleHelpers.text(48, TVTypography.weightBold, TVColors.white)}" data-testid="text-page-title">
                        Settings
                    </h1>
                </div>
                
                <!-- Main Settings Panel -->
                <div style="${StyleHelpers.position(236, 311, 886, 678)} ${StyleHelpers.background('#1f1f1f')} ${StyleHelpers.borderRadius(20)} padding: 40px; z-index: 10;" data-testid="panel-settings">
                    
                    <!-- Play at Login Section -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin-bottom: 24px;" data-testid="text-play-at-login-title">
                            Play at Login
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            ${this.renderRadioButton('last-played', 'Last Played', 5)}
                            ${this.renderRadioButton('random', 'Random', 6)}
                            ${this.renderRadioButton('favorite', 'Favorite', 7)}
                            ${this.renderRadioButton('none', 'None', 8)}
                        </div>
                    </div>
                    
                    <!-- Country Dropdown -->
                    <div style="margin-bottom: 48px;">
                        <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin-bottom: 16px;" data-testid="text-country-title">
                            Country
                        </h2>
                        <div class="focusable" 
                             id="country-selector-btn"
                             data-focus-index="9"
                             style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(10)} padding: 16px 24px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'space-between', 'center')}"
                             data-testid="button-country-selector">
                            <div style="${StyleHelpers.flex('row', 'flex-start', 'center', 12)}">
                                <span style="font-size: 28px;">${this.getCountryFlag(this.data.currentCountryCode)}</span>
                                <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">${this.data.currentCountry}</span>
                            </div>
                            <span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.white)}">▼</span>
                        </div>
                    </div>
                    
                    <!-- Language Dropdown -->
                    <div>
                        <h2 style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)} margin-bottom: 16px;" data-testid="text-language-title">
                            Language
                        </h2>
                        <div class="focusable" 
                             id="language-selector-btn"
                             data-focus-index="10"
                             style="${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(10)} padding: 16px 24px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'space-between', 'center')}"
                             data-testid="button-language-selector">
                            <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">${this.getLanguageName(this.data.currentLanguage)}</span>
                            <span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.white)}">▼</span>
                        </div>
                    </div>
                </div>
                
                <!-- Profile Card -->
                <div style="${StyleHelpers.position(1142, 311, 703, 177)} ${StyleHelpers.background('#1f1f1f')} ${StyleHelpers.borderRadius(20)} padding: 30px; z-index: 10; ${StyleHelpers.flex('row', 'space-between', 'center')}" data-testid="card-profile">
                    <!-- Profile Info -->
                    <div style="${StyleHelpers.flex('row', 'flex-start', 'center', 20)}">
                        <!-- Profile Photo -->
                        <div style="width: 97px; height: 97px; ${StyleHelpers.borderRadius(49)} ${StyleHelpers.background(TVColors.whiteOverlay20)} overflow: hidden; ${StyleHelpers.flex('row', 'center', 'center')}" data-testid="img-profile-photo">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="8" r="4" fill="${TVColors.white}"/>
                                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="${TVColors.white}"/>
                            </svg>
                        </div>
                        
                        <!-- Name and Email -->
                        <div style="${StyleHelpers.flex('column', 'center', 'flex-start', 8)}">
                            <p style="${StyleHelpers.text(24, TVTypography.weightBold, TVColors.white)}" data-testid="text-user-name">
                                ${this.data.userName}
                            </p>
                            <p style="${StyleHelpers.text(16, TVTypography.weightRegular, TVColors.textMuted)}" data-testid="text-user-email">
                                ${this.data.userEmail}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Logout Button -->
                    <div class="focusable" 
                         id="logout-btn"
                         data-focus-index="11"
                         style="${StyleHelpers.background(TVGradients.pinkPurpleRight)} ${StyleHelpers.borderRadius(10)} padding: 14px 32px; cursor: pointer; transition: all 0.2s; ${StyleHelpers.flex('row', 'center', 'center', 10)}"
                         data-testid="button-logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 17L21 12L16 7" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12H9" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span style="${StyleHelpers.text(18, TVTypography.weightSemiBold, TVColors.white)}">Logout</span>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-settings').html(html);
        this.updateSidebar();
        console.log('[Settings] Rendered');
    },
    
    updateSidebar: function() {
        var sidebarHtml = Sidebar.render('settings', 0, this.keys.focused_index);
        $('#settings-sidebar').html(sidebarHtml);
    },
    
    renderRadioButton: function(value, label, focusIndex) {
        var isSelected = this.data.playAtStart === value;
        
        return `
            <div class="focusable play-at-option" 
                 data-focus-index="${focusIndex}"
                 data-value="${value}"
                 style="cursor: pointer; transition: all 0.2s; ${StyleHelpers.background(TVColors.whiteOverlay10)} ${StyleHelpers.borderRadius(10)} padding: 16px 20px; ${StyleHelpers.flex('row', 'flex-start', 'center', 16)}"
                 data-testid="button-play-at-${value}">
                <!-- Radio Button -->
                <div style="width: 32px; height: 32px; ${StyleHelpers.borderRadius(16)} border: 2px solid ${TVColors.pink}; ${StyleHelpers.flex('row', 'center', 'center')} flex-shrink: 0;">
                    ${isSelected ? `<div style="width: 16px; height: 16px; ${StyleHelpers.borderRadius(8)} ${StyleHelpers.background(TVColors.pink)}"></div>` : ''}
                </div>
                <!-- Label -->
                <span style="${StyleHelpers.text(18, TVTypography.weightMedium, TVColors.white)}">
                    ${label}
                </span>
            </div>
        `;
    },
    
    bindEvents: function() {
        var self = this;
        
        // Play at login option click
        $(document).on('click', '.play-at-option', function() {
            var value = $(this).data('value');
            console.log('[Settings] Play at login changed:', value);
            self.changePlayAtStart(value);
        });
        
        // Country selector click
        $(document).on('click', '#country-selector-btn', function() {
            console.log('[Settings] Country selector clicked');
            CountryModal.show();
        });
        
        // Language selector click
        $(document).on('click', '#language-selector-btn', function() {
            console.log('[Settings] Language selector clicked');
        });
        
        // Logout button click
        $(document).on('click', '#logout-btn', function() {
            console.log('[Settings] Logout clicked');
            self.handleLogout();
        });
    },
    
    changePlayAtStart: function(value) {
        this.data.playAtStart = value;
        localStorage.setItem('megaradio_play_at_start', value);
        
        this.render();
        
        console.log('[Settings] Play at start changed to:', value);
    },
    
    handleLogout: function() {
        console.log('[Settings] Logging out...');
        this.data.userName = 'Guest';
        this.data.userEmail = 'guest@megaradio.com';
        
        this.render();
    },
    
    getCountryFlag: function(countryCode) {
        var flags = {
            'US': '🇺🇸',
            'GB': '🇬🇧',
            'TR': '🇹🇷',
            'DE': '🇩🇪',
            'FR': '🇫🇷',
            'IT': '🇮🇹',
            'ES': '🇪🇸',
            'CA': '🇨🇦',
            'AU': '🇦🇺',
            'BR': '🇧🇷',
            'MX': '🇲🇽',
            'JP': '🇯🇵',
            'IN': '🇮🇳',
            'CN': '🇨🇳'
        };
        return flags[countryCode] || '🌍';
    },
    
    getLanguageName: function(langCode) {
        var languages = {
            'en': 'English',
            'tr': 'Türkçe',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'it': 'Italiano',
            'pt': 'Português',
            'ja': '日本語',
            'zh': '中文'
        };
        return languages[langCode] || 'English';
    },
    
    cleanup: function() {
        console.log('[Settings] Cleaning up...');
        $(document).off('click', '.play-at-option');
        $(document).off('click', '#country-selector-btn');
        $(document).off('click', '#language-selector-btn');
        $(document).off('click', '#logout-btn');
    }
};
