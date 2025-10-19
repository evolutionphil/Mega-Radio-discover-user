/**
 * Mega Radio - Localization System
 * Handles 48-language support
 */

var Localization = (function() {
    var translations = {};
    var currentLanguage = 'en';
    
    return {
        init: function() {
            console.log('[Localization] Initializing...');
            var lang = State.get('currentLanguage') || 'en';
            this.loadLanguage(lang);
        },
        
        loadLanguage: function(langCode) {
            console.log('[Localization] Loading language:', langCode);
            currentLanguage = langCode;
            
            MegaRadioAPI.getTranslations(langCode)
                .then(function(data) {
                    translations = data;
                    Localization.applyTranslations();
                    console.log('[Localization] Language loaded:', langCode);
                })
                .catch(function(error) {
                    console.error('[Localization] Error loading language:', error);
                });
        },
        
        translate: function(key) {
            return translations[key] || key;
        },
        
        applyTranslations: function() {
            $('[data-i18n]').each(function() {
                var key = $(this).data('i18n');
                var translated = Localization.translate(key);
                $(this).text(translated);
            });
        },
        
        changeLanguage: function(langCode) {
            State.set('currentLanguage', langCode);
            this.loadLanguage(langCode);
        }
    };
})();
