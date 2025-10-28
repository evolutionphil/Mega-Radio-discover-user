import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { GlobalPlayerProvider } from "@/contexts/GlobalPlayerContext";
import { NetworkStatusProvider, useNetworkStatus } from "@/contexts/NetworkStatusContext";
import { AppLifecycleProvider } from "@/contexts/AppLifecycleContext";
import { FocusRouterProvider } from "@/contexts/FocusRouterContext";
import { GlobalPlayer } from "@/components/GlobalPlayer";
import { IdleScreensaver } from "@/components/IdleScreensaver";
import { useLocalization } from "@/contexts/LocalizationContext";
import NotFound from "@/pages/not-found";
import { useAnalytics } from "@/hooks/use-analytics";
import { useIdleDetection } from "@/hooks/useIdleDetection";

import { Splash } from "@/pages/Splash";
import { Login } from "@/pages/Login";
import { Guide1 } from "@/pages/Guide1";
import { Guide2 } from "@/pages/Guide2";
import { Guide3 } from "@/pages/Guide3";
import { Guide4 } from "@/pages/Guide4";
import { DiscoverNoUser } from "@/pages/DiscoverNoUser";
import { RadioPlaying } from "@/pages/RadioPlaying";
import { Genres } from "@/pages/Genres";
import { GenreList } from "@/pages/GenreList";
import { Search } from "@/pages/Search";
import { Favorites } from "@/pages/Favorites";
import { Settings } from "@/pages/Settings";

function NetworkDisconnectModal() {
  const { isNetworkModalOpen, closeNetworkModal } = useNetworkStatus();
  const { t } = useLocalization();

  if (!isNetworkModalOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-[1920px] h-[1080px] z-[200]">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-black/80 backdrop-blur-[7px]" />
      
      {/* Modal Container - Centered, matching exit modal style */}
      <div 
        className="absolute bg-[#1a1a1a] rounded-[20px] border-2 border-[rgba(255,255,255,0.1)]"
        style={{ left: '660px', top: '340px', width: '600px', height: '400px' }}
        data-testid="modal-network-disconnect"
      >
        {/* Icon */}
        <div className="absolute top-[40px] left-[50px] right-[50px] flex justify-center">
          <div className="w-[80px] h-[80px] rounded-full bg-[rgba(255,65,153,0.2)] flex items-center justify-center">
            <svg className="w-[40px] h-[40px] text-[#ff4199]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <div className="absolute top-[150px] left-[50px] right-[50px]">
          <h2 className="font-['Ubuntu',Helvetica] font-bold text-[36px] text-white text-center">
            {t('network_disconnected') || 'Network Disconnected'}
          </h2>
        </div>
        
        {/* Message */}
        <div className="absolute top-[210px] left-[50px] right-[50px]">
          <p className="font-['Ubuntu',Helvetica] font-normal text-[22px] text-white/70 text-center">
            {t('network_disconnected_message') || 'Please check your internet connection. The app will resume when connection is restored.'}
          </p>
        </div>
        
        {/* OK Button */}
        <div className="absolute bottom-[40px] left-[50px] right-[50px] flex justify-center">
          <button
            className="px-16 py-4 rounded-[30px] bg-[#ff4199] text-white border-4 border-[#ff4199] font-['Ubuntu',Helvetica] font-bold text-[24px] transition-all hover:bg-[#ff5aa8]"
            onClick={closeNetworkModal}
            data-testid="button-network-ok"
          >
            {t('ok') || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  useAnalytics();
  
  // Idle detection - show screensaver after 3 minutes of inactivity
  const { isIdle, resetIdleTimer } = useIdleDetection({
    idleTime: 3 * 60 * 1000, // 3 minutes
    onIdle: () => console.log('[IdleScreensaver] Screensaver activated'),
    onActive: () => console.log('[IdleScreensaver] Screensaver deactivated')
  });
  
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        {/* Splash & Onboarding */}
        <Route path="/" component={Splash} />
        <Route path="/login" component={Login} />
      
      {/* Onboarding Guide Pages */}
      <Route path="/guide-1" component={Guide1} />
      <Route path="/guide-2" component={Guide2} />
      <Route path="/guide-3" component={Guide3} />
      <Route path="/guide-4" component={Guide4} />
      
      {/* Main Application Pages */}
      <Route path="/discover-no-user" component={DiscoverNoUser} />
      <Route path="/radio-playing" component={RadioPlaying} />
      <Route path="/genres" component={Genres} />
      <Route path="/genre-list/:genre?" component={GenreList} />
      <Route path="/search" component={Search} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/settings" component={Settings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
    {/* GlobalPlayer must be INSIDE Router to detect route changes */}
    <GlobalPlayer />
    {/* Network Disconnect Modal - Global, highest z-index */}
    <NetworkDisconnectModal />
    {/* Idle Screensaver - Appears after 3 minutes of inactivity */}
    <IdleScreensaver isVisible={isIdle} onInteraction={resetIdleTimer} />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <NetworkStatusProvider>
          <CountryProvider>
            <FavoritesProvider>
              <GlobalPlayerProvider>
                <AppLifecycleProvider>
                  <FocusRouterProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Router />
                    </TooltipProvider>
                  </FocusRouterProvider>
                </AppLifecycleProvider>
              </GlobalPlayerProvider>
            </FavoritesProvider>
          </CountryProvider>
        </NetworkStatusProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
