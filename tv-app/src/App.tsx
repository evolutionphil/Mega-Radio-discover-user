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
import { FocusRouterProvider } from "@/contexts/FocusRouterContext";
import { GlobalPlayer } from "@/components/GlobalPlayer";
import NotFound from "@/pages/not-found";
import { useAnalytics } from "@/hooks/use-analytics";

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

function Router() {
  useAnalytics();
  
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
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <CountryProvider>
          <FavoritesProvider>
            <GlobalPlayerProvider>
              <FocusRouterProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </FocusRouterProvider>
            </GlobalPlayerProvider>
          </FavoritesProvider>
        </CountryProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
