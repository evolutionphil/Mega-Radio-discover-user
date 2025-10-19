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
            <div class="bg-black fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
                 data-testid="page-guide-4">
                <!-- Background Image with Dark Overlay -->
                <div class="absolute h-[1897px] left-0 top-0 w-[1920px]">
                    <div class="absolute inset-0 pointer-events-none">
                        <img alt="" 
                             class="absolute max-w-none object-50%-50% object-cover size-full" 
                             src="${Utils.assetPath('images/discover-background.png')}">
                        <div class="absolute bg-[rgba(0,0,0,0.7)] inset-0"></div>
                    </div>
                </div>

                <!-- Arrow pointing to Favorites button -->
                <div class="absolute flex items-center justify-center left-[188px] top-[596px] z-20">
                    <div class="rotate-[1.292deg]">
                        <div class="h-[31.65px] relative w-[130.979px]">
                            <img alt="" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/arrow.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div class="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[555px] w-[597px] z-20">
                    <div class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
                        <p class="mb-0" data-i18n="guide_favorites_description">Your favorite radios will be here.</p>
                        <p data-i18n="guide_favorites_yellow_button">Press yellow on the remote.</p>
                    </div>
                    <div class="absolute bg-[#f4ec2d] left-[24px] rounded-[40px] size-[18.667px] top-[48px]"></div>
                </div>

                <!-- Highlighted Favorites Button -->
                <div class="absolute bg-[rgba(255,255,255,0.2)] left-[62px] overflow-clip rounded-[10px] size-[98px] top-[565px] z-20">
                    <div class="absolute h-[61px] left-[11px] top-[19px] w-[77px]">
                        <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]" data-i18n="nav_your_favorites">
                            Favorites
                        </p>
                        <div class="absolute left-[23px] size-[32px] top-0">
                            <img alt="" 
                                 class="block max-w-none size-full" 
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
