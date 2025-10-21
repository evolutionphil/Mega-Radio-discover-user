/**
 * Mega Radio - Country Selection Modal Component
 * Implements EXACT Figma design for country selector modal
 * Modal: 1006x534px positioned at left:457px, top:93px
 */

var CountryModal = {
    isVisible: false,
    selectedCountry: null,
    countries: [
        { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'ES', name: 'Spain', flag: '🇪🇸' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'AT', name: 'Austria', flag: '🇦🇹' },
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
        { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
        { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
        { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
        { code: 'NO', name: 'Norway', flag: '🇳🇴' },
        { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
        { code: 'FI', name: 'Finland', flag: '🇫🇮' },
        { code: 'PL', name: 'Poland', flag: '🇵🇱' },
        { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
        { code: 'GR', name: 'Greece', flag: '🇬🇷' },
        { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
        { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
        { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
        { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
        { code: 'CN', name: 'China', flag: '🇨🇳' },
        { code: 'IN', name: 'India', flag: '🇮🇳' },
        { code: 'RU', name: 'Russia', flag: '🇷🇺' },
        { code: 'ZA', name: 'South Africa', flag: '🇿🇦' }
    ],
    filteredCountries: [],
    searchQuery: '',
    
    /**
     * Initialize modal component
     */
    init: function() {
        console.log('[CountryModal] Initializing...');
        this.filteredCountries = this.countries.slice();
        this.selectedCountry = (typeof State !== 'undefined' && State.get('currentCountryCode')) || 'US';
        this.bindEvents();
        console.log('[CountryModal] Initialized');
    },
    
    /**
     * Show modal
     */
    show: function() {
        if (this.isVisible) return;
        
        console.log('[CountryModal] Showing...');
        this.isVisible = true;
        this.searchQuery = '';
        this.filteredCountries = this.countries.slice();
        this.selectedCountry = (typeof State !== 'undefined' && State.get('currentCountryCode')) || 'US';
        
        this.render();
        
        // Focus search input
        setTimeout(function() {
            $('#country-modal-search').focus();
        }, 100);
    },
    
    /**
     * Hide modal
     */
    hide: function() {
        if (!this.isVisible) return;
        
        console.log('[CountryModal] Hiding...');
        this.isVisible = false;
        $('#country-modal-overlay').remove();
    },
    
    /**
     * Render modal HTML with exact Figma positioning
     */
    render: function() {
        var self = this;
        
        // Remove existing modal if present
        $('#country-modal-overlay').remove();
        
        var html = `
            <div id="country-modal-overlay" 
                 style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: ${TVSpacing.screenWidth}px; height: ${TVSpacing.screenHeight}px; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); z-index: 1000; display: flex; align-items: flex-start; justify-content: center;"
                 data-testid="overlay-country-modal">
                
                <!-- Modal Panel: 1006x534px at left:457px, top:93px -->
                <div id="country-modal-panel" 
                     style="position: absolute; left: 457px; top: 93px; width: 1006px; height: 534px; background: #000000; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;"
                     data-testid="panel-country-modal">
                    
                    <!-- Modal Header with Back Button -->
                    <div style="display: flex; align-items: center; padding: 24px 24px 20px 24px; flex-shrink: 0;">
                        <div class="focusable" 
                             id="country-modal-back"
                             data-focus-index="country-modal-back"
                             style="cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; transition: all 0.2s;"
                             data-testid="button-back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="${TVColors.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span style="${StyleHelpers.text(18, TVTypography.weightMedium, TVColors.white)}">Back</span>
                        </div>
                    </div>
                    
                    <!-- Search Input: 968x75px -->
                    <div style="padding: 0 19px; margin-bottom: 16px; flex-shrink: 0;">
                        <div style="position: relative; width: 968px; height: 75px;">
                            <input type="text" 
                                   id="country-modal-search"
                                   placeholder="Search country..."
                                   style="width: 100%; height: 100%; background: #1a1a1a; border: none; border-radius: 10px; padding: 0 24px 0 60px; ${StyleHelpers.text(20, TVTypography.weightRegular, TVColors.white)} outline: none; transition: all 0.2s;"
                                   data-testid="input-search-country">
                            <!-- Search Icon -->
                            <div style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); pointer-events: none;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="8" stroke="${TVColors.textMuted}" stroke-width="2"/>
                                    <path d="M21 21L16.65 16.65" stroke="${TVColors.textMuted}" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Country List: Scrollable Area -->
                    <div id="country-modal-list" 
                         style="flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0 19px; margin-bottom: 16px;"
                         data-testid="container-country-list">
                        ${this.renderCountryList()}
                    </div>
                    
                    <!-- Native Keyboard Placeholder: 1006x378px, #313131 background -->
                    <div style="width: 100%; height: 156px; background: #313131; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;"
                         data-testid="placeholder-native-keyboard">
                        <span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textMuted)}">Native keyboard</span>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(html);
        
        console.log('[CountryModal] Rendered');
    },
    
    /**
     * Render country list items
     * Each item: 967x70px, #2b2b2b background, 10px border-radius
     */
    renderCountryList: function() {
        var self = this;
        
        if (this.filteredCountries.length === 0) {
            return `
                <div style="display: flex; align-items: center; justify-content: center; height: 200px;">
                    <span style="${StyleHelpers.text(18, TVTypography.weightRegular, TVColors.textMuted)}">No countries found</span>
                </div>
            `;
        }
        
        return this.filteredCountries.map(function(country, index) {
            var isSelected = country.code === self.selectedCountry;
            var borderStyle = isSelected ? 'border: 5px solid #d2d2d2;' : 'border: 5px solid transparent;';
            
            return `
                <div class="focusable country-item" 
                     data-country-code="${country.code}"
                     data-country-name="${country.name}"
                     data-focus-index="country-${country.code}"
                     style="width: 967px; height: 70px; background: #2b2b2b; border-radius: 10px; ${borderStyle} margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; padding: 0 20px; gap: 16px; transition: all 0.2s; box-sizing: border-box;"
                     data-testid="item-country-${country.code}">
                    <!-- Flag Icon: 40x40px rounded -->
                    <div style="width: 40px; height: 40px; border-radius: 20px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 24px;">
                        ${country.flag}
                    </div>
                    <!-- Country Name -->
                    <span style="${StyleHelpers.text(20, TVTypography.weightMedium, TVColors.white)}">
                        ${country.name}
                    </span>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Filter countries based on search query
     */
    filterCountries: function(query) {
        this.searchQuery = query.toLowerCase();
        
        if (this.searchQuery === '') {
            this.filteredCountries = this.countries.slice();
        } else {
            this.filteredCountries = this.countries.filter(function(country) {
                return country.name.toLowerCase().indexOf(this.searchQuery) !== -1 || 
                       country.code.toLowerCase().indexOf(this.searchQuery) !== -1;
            }.bind(this));
        }
        
        // Update country list
        $('#country-modal-list').html(this.renderCountryList());
        
        console.log('[CountryModal] Filtered to', this.filteredCountries.length, 'countries');
    },
    
    /**
     * Select country and update State
     */
    selectCountry: function(countryCode, countryName) {
        console.log('[CountryModal] Country selected:', countryCode, countryName);
        
        this.selectedCountry = countryCode;
        
        // Update global state
        State.set('currentCountryCode', countryCode);
        State.set('currentCountry', countryName);
        
        // Close modal
        this.hide();
        
        // Trigger page refresh if needed (for pages that depend on country)
        var currentPage = State.get('currentPage');
        if (currentPage === 'discover' || currentPage === 'genres' || currentPage === 'search') {
            console.log('[CountryModal] Refreshing page:', currentPage);
            AppRouter.navigate(currentPage);
        }
    },
    
    /**
     * Bind event handlers
     */
    bindEvents: function() {
        var self = this;
        
        // Click outside modal to close
        $(document).on('click', '#country-modal-overlay', function(e) {
            if (e.target.id === 'country-modal-overlay') {
                console.log('[CountryModal] Clicked outside modal');
                self.hide();
            }
        });
        
        // Back button click
        $(document).on('click', '#country-modal-back', function() {
            console.log('[CountryModal] Back button clicked');
            self.hide();
        });
        
        // Search input
        $(document).on('input', '#country-modal-search', function() {
            var query = $(this).val();
            self.filterCountries(query);
        });
        
        // Country item click
        $(document).on('click', '.country-item', function() {
            var countryCode = $(this).data('country-code');
            var countryName = $(this).data('country-name');
            self.selectCountry(countryCode, countryName);
        });
        
        // ESC key to close
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && self.isVisible) {
                console.log('[CountryModal] ESC key pressed');
                self.hide();
            }
        });
        
        // Hover effects for country items
        $(document).on('mouseenter', '.country-item', function() {
            $(this).css('background', '#3a3a3a');
        });
        
        $(document).on('mouseleave', '.country-item', function() {
            $(this).css('background', '#2b2b2b');
        });
        
        // Hover effect for back button
        $(document).on('mouseenter', '#country-modal-back', function() {
            $(this).css('background', 'rgba(255, 255, 255, 0.2)');
        });
        
        $(document).on('mouseleave', '#country-modal-back', function() {
            $(this).css('background', 'rgba(255, 255, 255, 0.1)');
        });
        
        // Focus effect for search input
        $(document).on('focus', '#country-modal-search', function() {
            $(this).css('background', '#252525');
        });
        
        $(document).on('blur', '#country-modal-search', function() {
            $(this).css('background', '#1a1a1a');
        });
    },
    
    /**
     * Cleanup event handlers
     */
    cleanup: function() {
        console.log('[CountryModal] Cleaning up...');
        $(document).off('click', '#country-modal-overlay');
        $(document).off('click', '#country-modal-back');
        $(document).off('input', '#country-modal-search');
        $(document).off('click', '.country-item');
        $(document).off('mouseenter', '.country-item');
        $(document).off('mouseleave', '.country-item');
        $(document).off('mouseenter', '#country-modal-back');
        $(document).off('mouseleave', '#country-modal-back');
        $(document).off('focus', '#country-modal-search');
        $(document).off('blur', '#country-modal-search');
    }
};

// Initialize on document ready
$(document).ready(function() {
    CountryModal.init();
});
