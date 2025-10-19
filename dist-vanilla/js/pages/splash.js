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
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;">
                <!-- Animated Waves - Center Background -->
                <div style="position: absolute; top: 34.91%; right: 41.51%; bottom: 34.91%; left: 41.51%; animation: pulse 3s ease-in-out infinite;">
                    <img alt="" 
                         style="display: block; max-width: none; width: 100%; height: 100%; opacity: 0.4;" 
                         src="${Utils.assetPath('images/waves.png')}">
                </div>

                <!-- Logo -->
                <div style="position: absolute; height: 111.999px; left: 798px; top: 484px; width: 323.069px;">
                    <p style="position: absolute; bottom: 0; font-family: 'Ubuntu', Helvetica; font-weight: 400; line-height: normal; left: 18.67%; font-style: normal; right: 0; font-size: 53.108px; color: #ffffff; top: 46.16%; white-space: pre-wrap;">
                        <span style="font-family: 'Ubuntu', Helvetica; font-weight: 700;">mega</span>radio
                    </p>
                    <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                        <img alt="" 
                             style="display: block; max-width: none; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/path-8.svg')}">
                    </div>
                </div>

                <!-- Pink Glow Circle - Left Side -->
                <div style="position: absolute; left: -377px; width: 781.011px; height: 781.011px; top: 510.99px; animation: pulse 4s ease-in-out infinite;">
                    <div style="position: absolute; top: -82.95%; right: -82.95%; bottom: -82.95%; left: -82.95%;">
                        <img alt="" 
                             style="display: block; max-width: none; width: 100%; height: 100%; opacity: 0.3;" 
                             src="${Utils.assetPath('images/ellipse2.png')}">
                    </div>
                </div>

                <!-- "Listen freely" text -->
                <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 901px; font-style: normal; color: #9b9b9b; font-size: 20px; top: 624px;">
                    Listen freely
                </p>

                <!-- megaradio.live text -->
                <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 400; line-height: normal; left: 872px; font-style: normal; color: #9b9b9b; font-size: 16px; top: 673px;">
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
