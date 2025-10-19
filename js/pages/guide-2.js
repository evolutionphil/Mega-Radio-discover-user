/**
 * Mega Radio - Guide 2 Page
 * Introduces genre browsing
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
            <div class="bg-black fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
                 data-testid="page-guide-2">
                <!-- Background Image with Dark Overlay -->
                <div class="absolute h-[1897px] left-0 top-0 w-[1920px]">
                    <div class="absolute inset-0 pointer-events-none">
                        <img alt="" 
                             class="absolute max-w-none object-50%-50% object-cover size-full" 
                             src="${Utils.assetPath('images/discover-background.png')}">
                        <div class="absolute bg-[rgba(0,0,0,0.7)] inset-0"></div>
                    </div>
                </div>

                <!-- Arrow pointing to Genres button -->
                <div class="absolute flex items-center justify-center left-[188px] top-[381px] z-20">
                    <div class="rotate-[1.292deg]">
                        <div class="h-[31.65px] relative w-[130.979px]">
                            <img alt="" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/arrow.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Highlighted Genres Button -->
                <div class="absolute bg-[rgba(255,255,255,0.2)] left-[63px] overflow-clip rounded-[10px] size-[98px] top-[346px] z-20">
                    <div class="absolute h-[61px] left-[20px] top-[19px] w-[59px]">
                        <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]" data-i18n="genres">
                            Genres
                        </p>
                        <div class="absolute left-[13px] size-[32px] top-0">
                            <img alt="" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/music-icon.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div class="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[338px] w-[509px] z-20">
                    <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[43px]" data-i18n="guide_genres_description">
                        You can press green to access genres.
                    </p>
                    <div class="absolute bg-[#55e952] left-[24px] rounded-[40px] size-[18.667px] top-[48px]"></div>
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
