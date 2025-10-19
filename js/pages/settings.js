/**
 * Mega Radio - Settings Page
 * Language, country, and auto-play settings with sidebar
 */

var settings_page = {
    keys: {
        focused_index: 0
    },
    
    data: {
        currentLanguage: 'en',
        currentCountry: 'United States',
        currentCountryCode: 'US',
        playAtStart: 'last-played'
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
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
                <!-- Sidebar -->
                <div id="settings-sidebar"></div>
                
                <!-- Main Content -->
                <div class="absolute left-[190px] right-[64px] top-[64px] bottom-[64px] overflow-y-auto" id="settings-content">
                    <!-- Header -->
                    <div class="mb-[40px]">
                        <h1 class="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-[16px]" data-i18n="settings">
                            Settings
                        </h1>
                        <p class="font-['Ubuntu',Helvetica] text-[20px] text-[#9b9b9b]" data-i18n="settings_description">
                            Customize your Mega Radio experience
                        </p>
                    </div>
                    
                    <!-- Settings Groups -->
                    <div class="space-y-[32px]">
                        <!-- Language Setting -->
                        <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] p-[32px]">
                            <h2 class="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white mb-[24px]" data-i18n="language">
                                Language
                            </h2>
                            <div class="grid grid-cols-4 gap-[16px]">
                                ${this.renderLanguageOptions()}
                            </div>
                        </div>
                        
                        <!-- Country Setting -->
                        <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] p-[32px]">
                            <h2 class="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white mb-[24px]" data-i18n="country">
                                Country
                            </h2>
                            <div class="inline-flex items-center gap-[12px] bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[24px] py-[16px] focusable cursor-pointer"
                                 data-focus-index="9"
                                 id="country-selector-btn">
                                <span class="text-[32px]">${this.getCountryFlag(this.data.currentCountryCode)}</span>
                                <span class="font-['Ubuntu',Helvetica] text-[24px] text-white">${this.data.currentCountry}</span>
                                <span class="text-white text-[20px]">▼</span>
                            </div>
                        </div>
                        
                        <!-- Auto-Play Setting -->
                        <div class="bg-[rgba(255,255,255,0.05)] rounded-[10px] p-[32px]">
                            <h2 class="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white mb-[24px]" data-i18n="auto_play_at_start">
                                Auto-play at start
                            </h2>
                            <div class="grid grid-cols-2 gap-[16px]">
                                ${this.renderAutoPlayOptions()}
                            </div>
                        </div>
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
    
    renderLanguageOptions: function() {
        var languages = [
            { code: 'en', name: 'English' },
            { code: 'tr', name: 'Türkçe' },
            { code: 'es', name: 'Español' },
            { code: 'fr', name: 'Français' }
        ];
        
        var html = '';
        var self = this;
        
        languages.forEach(function(lang, index) {
            var isSelected = lang.code === self.data.currentLanguage;
            var focusIndex = 5 + index; // After sidebar (0-4)
            
            html += `
                <div class="language-option focusable cursor-pointer transition-all duration-200 ${isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-[rgba(255,255,255,0.1)]'} rounded-[10px] px-[24px] py-[16px] text-center"
                     data-focus-index="${focusIndex}"
                     data-language-code="${lang.code}">
                    <p class="font-['Ubuntu',Helvetica] font-medium text-[20px] text-white">
                        ${lang.name}
                    </p>
                </div>
            `;
        });
        
        return html;
    },
    
    renderAutoPlayOptions: function() {
        var options = [
            { value: 'last-played', label: 'Last Played', i18n: 'auto_play_last' },
            { value: 'random', label: 'Random', i18n: 'auto_play_random' },
            { value: 'favorite', label: 'Random Favorite', i18n: 'auto_play_favorite' },
            { value: 'none', label: 'None', i18n: 'auto_play_none' }
        ];
        
        var html = '';
        var self = this;
        
        options.forEach(function(option, index) {
            var isSelected = option.value === self.data.playAtStart;
            var focusIndex = 10 + index; // After sidebar, languages, and country selector
            
            html += `
                <div class="auto-play-option focusable cursor-pointer transition-all duration-200 ${isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-[rgba(255,255,255,0.1)]'} rounded-[10px] px-[24px] py-[16px] text-center"
                     data-focus-index="${focusIndex}"
                     data-auto-play-value="${option.value}">
                    <p class="font-['Ubuntu',Helvetica] font-medium text-[20px] text-white" data-i18n="${option.i18n}">
                        ${option.label}
                    </p>
                </div>
            `;
        });
        
        return html;
    },
    
    bindEvents: function() {
        var self = this;
        
        // Language option click
        $(document).on('click', '.language-option', function() {
            var langCode = $(this).data('language-code');
            console.log('[Settings] Language changed:', langCode);
            self.changeLanguage(langCode);
        });
        
        // Country selector click
        $(document).on('click', '#country-selector-btn', function() {
            console.log('[Settings] Country selector clicked');
            // TODO: Show country selector modal
        });
        
        // Auto-play option click
        $(document).on('click', '.auto-play-option', function() {
            var value = $(this).data('auto-play-value');
            console.log('[Settings] Auto-play changed:', value);
            self.changeAutoPlay(value);
        });
    },
    
    changeLanguage: function(langCode) {
        this.data.currentLanguage = langCode;
        State.set('currentLanguage', langCode);
        
        // Re-render to update UI
        this.render();
        
        // TODO: Reload translations
        console.log('[Settings] Language changed to:', langCode);
    },
    
    changeAutoPlay: function(value) {
        this.data.playAtStart = value;
        localStorage.setItem('megaradio_play_at_start', value);
        
        // Re-render to update UI
        this.render();
        
        console.log('[Settings] Auto-play changed to:', value);
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
            'BR': '🇧🇷'
        };
        return flags[countryCode] || '🌍';
    },
    
    cleanup: function() {
        console.log('[Settings] Cleaning up...');
        $(document).off('click', '.language-option');
        $(document).off('click', '#country-selector-btn');
        $(document).off('click', '.auto-play-option');
    }
};
