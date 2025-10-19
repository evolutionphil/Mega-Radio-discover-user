/**
 * Mega Radio - Guide 2 Page
 * Introduces browsing by genres
 * Design from Figma: https://www.figma.com/design/SdteT1OO7A2xSkvmIQABCF/Mega-Radio?node-id=1783-6171
 */

var guide_2_page = {
    keys: {
        focused_index: 0
    },
    
    init: function() {
        console.log('[Guide2] Initializing...');
        this.render();
        this.bindEvents();
    },
    
    render: function() {
        var html = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #ffffff; cursor: pointer;" 
                 data-testid="page-guide-2">
                
                <!-- Background Image with Dark Overlay -->
                <div style="position: absolute; height: 1897px; left: 0; top: 0; width: 1920px;">
                    <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none;">
                        <img alt="" 
                             style="position: absolute; max-width: none; object-fit: cover; object-position: 50% 50%; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/discover-nouser-2.png')}">
                        <div style="position: absolute; background: rgba(0,0,0,0.7); top: 0; right: 0; bottom: 0; left: 0;"></div>
                    </div>
                </div>

                <!-- Highlighted Genres Button -->
                <div style="position: absolute; background: rgba(255,255,255,0.2); left: 63px; overflow: hidden; border-radius: 10px; width: 98px; height: 98px; top: 346px;">
                    <div style="position: absolute; height: 61px; left: 20px; top: 19px; width: 59px;">
                        <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 29.5px; font-style: normal; font-size: 18px; text-align: center; color: #ffffff; top: 40px; transform: translateX(-50%);" data-i18n="nav_genres">
                            Genres
                        </p>
                        <div style="position: absolute; left: 13px; width: 32px; height: 32px; top: 0;">
                            <div style="position: absolute; left: 0; width: 32px; height: 32px; top: 0;">
                                <img alt="" 
                                     style="display: block; max-width: none; width: 100%; height: 100%;" 
                                     src="${Utils.assetPath('images/music-icon-guide.png')}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Arrow pointing to Genres button -->
                <div style="position: absolute; display: flex; align-items: center; justify-content: center; left: 188px; top: 381px;">
                    <div style="transform: rotate(1.292deg);">
                        <div style="height: 31.65px; position: relative; width: 130.979px;">
                            <img alt="" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/arrow-guide2.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div style="position: absolute; background: #000000; height: 115px; left: 340px; overflow: hidden; border-radius: 10px; top: 338px; width: 509px;">
                    <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 67px; font-style: normal; font-size: 24px; color: #ffffff; top: 43px;" data-i18n="guide_genres_description">
                        You can press green to access genres.
                    </p>
                    <div style="position: absolute; background: #55e952; left: 24px; border-radius: 40px; width: 18.667px; height: 18.667px; top: 48px;"></div>
                </div>
            </div>
        `;
        
        $('#page-guide-2').html(html);
        console.log('[Guide2] Rendered');
    },
    
    bindEvents: function() {
        // Click to advance to next guide
        $('#page-guide-2').on('click', function() {
            console.log('[Guide2] Clicked - navigating to Guide 3');
            AppRouter.navigate('guide-3');
        });
        
        // TV remote Enter/OK key
        $(document).on('keydown.guide2', function(e) {
            if (e.keyCode === 13) { // Enter key
                console.log('[Guide2] Enter pressed - navigating to Guide 3');
                e.preventDefault();
                AppRouter.navigate('guide-3');
            }
        });
    },
    
    cleanup: function() {
        console.log('[Guide2] Cleaning up...');
        $('#page-guide-2').off('click');
        $(document).off('keydown.guide2');
    }
};
