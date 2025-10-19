/**
 * Mega Radio - Guide 3 Page
 * Introduces search functionality
 */

var guide_3_page = {
    keys: {
        focused_index: 0
    },
    
    init: function() {
        console.log('[Guide3] Initializing...');
        this.render();
        this.bindEvents();
    },
    
    render: function() {
        var html = `
            <div class="bg-black fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
                 data-testid="page-guide-3">
                <!-- Background Image with Dark Overlay -->
                <div class="absolute h-[1897px] left-0 top-0 w-[1920px]">
                    <div class="absolute inset-0 pointer-events-none">
                        <img alt="" 
                             class="absolute max-w-none object-50%-50% object-cover size-full" 
                             src="${Utils.assetPath('images/discover-background.png')}">
                        <div class="absolute bg-[rgba(0,0,0,0.7)] inset-0"></div>
                    </div>
                </div>

                <!-- Arrow pointing to Search button -->
                <div class="absolute flex items-center justify-center left-[188px] top-[490px] z-20">
                    <div class="rotate-[1.292deg]">
                        <div class="h-[31.65px] relative w-[130.979px]">
                            <img alt="" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/arrow.svg')}">
                        </div>
                    </div>
                </div>

                <!-- Tooltip Box -->
                <div class="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[449px] w-[597px] z-20">
                    <div class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
                        <p class="mb-0" data-i18n="guide_search_description">You can find any radio station you want here.</p>
                        <p data-i18n="guide_search_blue_button">Press the blue on the remote!</p>
                    </div>
                    <div class="absolute bg-[#2d41f4] left-[24px] rounded-[40px] size-[18.667px] top-[48px]"></div>
                </div>

                <!-- Highlighted Search Button -->
                <div class="absolute bg-[rgba(255,255,255,0.2)] left-[63px] overflow-clip rounded-[10px] size-[98px] top-[457px] z-20">
                    <div class="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
                        <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]" data-i18n="search">
                            Search
                        </p>
                        <div class="absolute left-[12px] size-[32px] top-0">
                            <img alt="" 
                                 class="block max-w-none size-full" 
                                 src="${Utils.assetPath('images/search-icon.svg')}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#page-guide-3').html(html);
        console.log('[Guide3] Rendered');
    },
    
    bindEvents: function() {
        // Click to advance to next guide
        $('#page-guide-3').on('click', function() {
            console.log('[Guide3] Clicked - navigating to Guide 4');
            AppRouter.navigate('guide-4');
        });
        
        // TV remote Enter/OK key
        $(document).on('keydown.guide3', function(e) {
            if (e.keyCode === 13) { // Enter key
                console.log('[Guide3] Enter pressed - navigating to Guide 4');
                e.preventDefault();
                AppRouter.navigate('guide-4');
            }
        });
    },
    
    cleanup: function() {
        console.log('[Guide3] Cleaning up...');
        $('#page-guide-3').off('click');
        $(document).off('keydown.guide3');
    }
};
