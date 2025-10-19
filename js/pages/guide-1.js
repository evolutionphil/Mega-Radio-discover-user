/**
 * Mega Radio - Guide 1 Page
 * Introduces discovering radio stations
 * Design from Figma: https://www.figma.com/design/SdteT1OO7A2xSkvmIQABCF/Mega-Radio?node-id=1711-5214
 */

var guide_1_page = {
    keys: {
        focused_index: 0
    },
    
    init: function() {
        console.log('[Guide1] Initializing...');
        this.render();
        this.bindEvents();
    },
    
    render: function() {
        var html = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #ffffff; cursor: pointer;" 
                 data-testid="page-guide-1">
                
                <!-- Background Image with Dark Overlay -->
                <div style="position: absolute; height: 1897px; left: 0; top: 0; width: 1920px;">
                    <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none;">
                        <img alt="" 
                             style="position: absolute; max-width: none; object-fit: cover; object-position: 50% 50%; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/discover-nouser-1.png')}">
                        <div style="position: absolute; background: rgba(0,0,0,0.7); top: 0; right: 0; bottom: 0; left: 0;"></div>
                    </div>
                </div>

                <!-- Highlighted Discover Button -->
                <div style="position: absolute; background: rgba(255,255,255,0.2); left: 64px; overflow: hidden; border-radius: 10px; width: 98px; height: 98px; top: 242px;">
                    <div style="position: absolute; height: 61px; left: 13px; top: 19px; width: 72px;">
                        <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 36px; font-style: normal; font-size: 18px; text-align: center; color: #ffffff; top: 40px; transform: translateX(-50%);" data-i18n="nav_discover">
                            Discover
                        </p>
                        <div style="position: absolute; left: 20px; width: 32px; height: 32px; top: 0;">
                            <div style="position: absolute; left: 0; width: 32px; height: 32px; top: 0;">
                                <img alt="" 
                                     style="display: block; max-width: none; width: 100%; height: 100%;" 
                                     src="${Utils.assetPath('images/radio-icon-guide.png')}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Arrow pointing to Discover button -->
                <div style="position: absolute; display: flex; align-items: center; justify-content: center; left: 188px; top: 274px;">
                    <div style="transform: rotate(1.292deg);">
                        <div style="height: 31.65px; position: relative; width: 130.979px;">
                            <img alt="" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/arrow-guide.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div style="position: absolute; background: #000000; height: 115px; left: 340px; overflow: hidden; border-radius: 10px; top: 233px; width: 720px;">
                    <div style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 67px; font-style: normal; font-size: 24px; color: #ffffff; top: 29px; white-space: nowrap;">
                        <p style="margin-bottom: 0;" data-i18n="guide_discover_line1">This is the discovery page. You can always reach here</p>
                        <p style="margin-bottom: 0;" data-i18n="guide_discover_line2">by pressing the red button on the remote.</p>
                    </div>
                    <div style="position: absolute; background: #e95252; left: 24px; border-radius: 40px; width: 18.667px; height: 18.667px; top: 48px;"></div>
                </div>
            </div>
        `;
        
        $('#page-guide-1').html(html);
        console.log('[Guide1] Rendered');
    },
    
    bindEvents: function() {
        var self = this;
        
        // Click to advance to next guide
        $('#page-guide-1').on('click', function() {
            console.log('[Guide1] Clicked - navigating to Guide 2');
            AppRouter.navigate('guide-2');
        });
        
        // TV remote Enter/OK key
        $(document).on('keydown.guide1', function(e) {
            if (e.keyCode === 13) { // Enter key
                console.log('[Guide1] Enter pressed - navigating to Guide 2');
                e.preventDefault();
                AppRouter.navigate('guide-2');
            }
        });
    },
    
    cleanup: function() {
        console.log('[Guide1] Cleaning up...');
        $('#page-guide-1').off('click');
        $(document).off('keydown.guide1');
    }
};
