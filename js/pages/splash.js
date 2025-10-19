/**
 * Mega Radio - Splash Page
 * Auto-navigate to guide-1 after 3 seconds
 */

var splash_page = {
    timer: null,
    
    init: function() {
        console.log('[Splash] Initializing...');
        this.render();
        this.bindEvents();
        this.startTimer();
    },
    
    render: function() {
        var html = `
            <div class="bg-[#0e0e0e] fixed inset-0 w-[1920px] h-[1080px] overflow-hidden">
                <!-- Animated Waves - Center Background -->
                <div class="absolute inset-[34.91%_41.51%] animate-pulse" 
                     style="animation-duration: 3s; animation-timing-function: ease-in-out;">
                    <img alt="" 
                         class="block max-w-none size-full opacity-40" 
                         src="${Utils.assetPath('images/waves.png')}">
                </div>

                <!-- Logo -->
                <div class="absolute h-[111.999px] left-[798px] top-[484px] w-[323.069px]">
                    <p class="absolute bottom-0 font-['Ubuntu',Helvetica] font-normal leading-normal left-[18.67%] not-italic right-0 text-[53.108px] text-white top-[46.16%] whitespace-pre-wrap">
                        <span class="font-['Ubuntu',Helvetica] font-bold">mega</span>radio
                    </p>
                    <div class="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
                        <img alt="" 
                             class="block max-w-none size-full" 
                             src="${Utils.assetPath('images/path-8.svg')}">
                    </div>
                </div>

                <!-- Pink Glow Circle - Left Side -->
                <div class="absolute left-[-377px] size-[781.011px] top-[510.99px] animate-pulse"
                     style="animation-duration: 4s; animation-timing-function: ease-in-out;">
                    <div class="absolute inset-[-82.95%]">
                        <img alt="" 
                             class="block max-w-none size-full opacity-30" 
                             src="${Utils.assetPath('images/ellipse2.png')}">
                    </div>
                </div>

                <!-- "Listen freely" text -->
                <p class="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[901px] not-italic text-[#9b9b9b] text-[20px] top-[624px]">
                    Listen freely
                </p>

                <!-- megaradio.live text -->
                <p class="absolute font-['Ubuntu',Helvetica] font-normal leading-normal left-[872px] not-italic text-[#9b9b9b] text-[16px] top-[673px]">
                    megaradio.live
                </p>
            </div>
        `;
        
        $('#page-splash').html(html);
        console.log('[Splash] Rendered');
    },
    
    bindEvents: function() {
        // No interactive elements on splash page
    },
    
    startTimer: function() {
        var self = this;
        this.timer = setTimeout(function() {
            console.log('[Splash] Timer complete, navigating to guide-1');
            AppRouter.navigate('guide-1');
        }, 3000);
    },
    
    cleanup: function() {
        console.log('[Splash] Cleaning up...');
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
};
