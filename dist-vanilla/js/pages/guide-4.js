/**
 * Mega Radio - Guide 4 Page
 * Introduces favorites functionality
 */

var guide_4_page = {
    keys: {
        focused_index: 0
    },
    
    init: function() {
        console.log('[Guide4] Initializing...');
        this.render();
        this.bindEvents();
    },
    
    render: function() {
        var html = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #000000; cursor: pointer;" 
                 data-testid="page-guide-4">
                <!-- Background Image with Dark Overlay -->
                <div style="position: absolute; height: 1897px; left: 0; top: 0; width: 1920px;">
                    <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none;">
                        <img alt="" 
                             style="position: absolute; max-width: none; object-fit: cover; object-position: 50% 50%; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/discover-background.png')}">
                        <div style="position: absolute; background: rgba(0,0,0,0.7); top: 0; right: 0; bottom: 0; left: 0;"></div>
                    </div>
                </div>

                <!-- Arrow pointing to Favorites button -->
                <div class="d-flex align-items-center justify-content-center" 
                     style="position: absolute; left: 188px; top: 596px; z-index: 20;">
                    <div style="transform: rotate(1.292deg);">
                        <div style="height: 31.65px; position: relative; width: 130.979px;">
                            <img alt="" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/arrow.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div style="position: absolute; background: #000000; height: 115px; left: 340px; overflow: hidden; border-radius: 10px; top: 555px; width: 597px; z-index: 20;">
                    <div style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 67px; font-style: normal; font-size: 24px; color: #ffffff; top: 29px; white-space: nowrap;">
                        <p style="margin-bottom: 0;" data-i18n="guide_favorites_description">Your favorite radios will be here.</p>
                        <p data-i18n="guide_favorites_yellow_button">Press yellow on the remote.</p>
                    </div>
                    <div style="position: absolute; background: #f4ec2d; left: 24px; border-radius: 40px; width: 18.667px; height: 18.667px; top: 48px;"></div>
                </div>

                <!-- Highlighted Favorites Button -->
                <div style="position: absolute; background: rgba(255,255,255,0.2); left: 62px; overflow: hidden; border-radius: 10px; width: 98px; height: 98px; top: 565px; z-index: 20;">
                    <div style="position: absolute; height: 61px; left: 11px; top: 19px; width: 77px;">
                        <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 38.5px; font-style: normal; font-size: 18px; text-align: center; color: #ffffff; top: 40px; transform: translateX(-50%);" data-i18n="nav_your_favorites">
                            Favorites
                        </p>
                        <div style="position: absolute; left: 23px; width: 32px; height: 32px; top: 0;">
                            <img alt="" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/heart-icon.svg')}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-guide-4').html(html);
        console.log('[Guide4] Rendered');
    },
    
    bindEvents: function() {
        // Click to advance to discover page
        $('#page-guide-4').on('click', function() {
            console.log('[Guide4] Clicked - navigating to Discover');
            AppRouter.navigate('discover');
        });
        
        // TV remote Enter/OK key
        $(document).on('keydown.guide4', function(e) {
            if (e.keyCode === 13) { // Enter key
                console.log('[Guide4] Enter pressed - navigating to Discover');
                e.preventDefault();
                AppRouter.navigate('discover');
            }
        });
    },
    
    cleanup: function() {
        console.log('[Guide4] Cleaning up...');
        $('#page-guide-4').off('click');
        $(document).off('keydown.guide4');
    }
};
