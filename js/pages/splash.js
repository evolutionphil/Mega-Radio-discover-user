/**
 * Mega Radio - Splash Page
 * Auto-navigate to guide-1 after 3 seconds
 * Design from Figma: https://www.figma.com/design/SdteT1OO7A2xSkvmIQABCF/Mega-Radio?node-id=1691-6344
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
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0e0e0e;" data-testid="page-splash">
                <!-- Waves Background (centered) -->
                <div style="position: absolute; top: 34.91%; right: 41.51%; bottom: 34.91%; left: 41.51%;">
                    <img alt="" 
                         style="display: block; max-width: none; width: 100%; height: 100%;" 
                         src="${Utils.assetPath('images/waves-figma.png')}">
                </div>
                
                <!-- Megaradio Logo -->
                <div style="position: absolute; height: 111.999px; left: 798px; top: 484px; width: 323.069px;">
                    <p style="position: absolute; bottom: 0; font-family: 'Ubuntu', Helvetica; font-weight: 400; line-height: normal; left: 18.67%; font-style: normal; right: 0; font-size: 53.108px; color: #ffffff; top: 46.16%; white-space: pre-wrap;">
                        <span style="font-family: 'Ubuntu', Helvetica; font-weight: 700;">mega</span>radio
                    </p>
                    <div style="position: absolute; bottom: 2.84%; left: 0; right: 65.2%; top: 0;">
                        <img alt="" 
                             style="display: block; max-width: none; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/path-8-figma.svg')}">
                    </div>
                </div>
                
                <!-- Pink Glow Circle (left side) -->
                <div style="position: absolute; left: -377px; width: 781.011px; height: 781.011px; top: 510.99px;">
                    <div style="position: absolute; top: -82.95%; right: -82.95%; bottom: -82.95%; left: -82.95%;">
                        <img alt="" 
                             style="display: block; max-width: none; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/ellipse2-figma.png')}">
                    </div>
                </div>
                
                <!-- "Listen freely" text -->
                <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 901px; font-style: normal; color: #9b9b9b; font-size: 20px; top: 624px;">
                    Listen freely
                </p>
                
                <!-- "megaradio.live" text (bottom center) -->
                <p style="position: absolute; font-family: 'Ubuntu', Helvetica; font-weight: 500; line-height: normal; left: 960px; font-style: normal; font-size: 22px; text-align: center; color: #ffffff; top: 984px; transform: translateX(-50%);">
                    megaradio.live
                </p>
                
                <!-- Device Icons (TV, tablet, phone) -->
                <div style="position: absolute; height: 45.683px; left: 916px; top: 911px; width: 88px;">
                    <!-- TV Icon -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 29.66%; top: 0;">
                        <img alt="TV" 
                             style="display: block; max-width: none; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/group-figma.png')}">
                    </div>
                    <!-- Tablet Icon -->
                    <div style="position: absolute; top: 24.7%; right: 9.75%; bottom: 0.21%; left: 61.02%;">
                        <div style="position: absolute; top: -8.7%; right: -11.59%; bottom: -8.7%; left: -11.59%;">
                            <img alt="Tablet" 
                                 style="display: block; max-width: none; width: 100%; height: 100%;" 
                                 src="${Utils.assetPath('images/group1-figma.png')}">
                        </div>
                    </div>
                    <!-- Phone Icon -->
                    <div style="position: absolute; bottom: 0.21%; left: 83.76%; right: 0; top: 49.73%;">
                        <img alt="Phone" 
                             style="display: block; max-width: none; width: 100%; height: 100%;" 
                             src="${Utils.assetPath('images/group2-figma.png')}">
                    </div>
                </div>
                
                <!-- Left Gradient/Frame Image -->
                <div style="position: absolute; height: 614px; left: -16px; top: 466px; width: 667px;">
                    <img alt="" 
                         style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; max-width: none; object-fit: cover; object-position: 50% 50%; pointer-events: none; width: 100%; height: 100%;" 
                         src="${Utils.assetPath('images/frame445-figma.png')}">
                </div>
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
