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

import { Splash } from "@/pages/Splash";
import { Login } from "@/pages/Login";
import { LoginWithEmail } from "@/pages/LoginWithEmail";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { MailSent } from "@/pages/MailSent";
import { Guide1 } from "@/pages/Guide1";
import { Guide2 } from "@/pages/Guide2";
import { Guide3 } from "@/pages/Guide3";
import { Guide4 } from "@/pages/Guide4";
import { DiscoverUser } from "@/pages/DiscoverUser";
import { DiscoverNoUser } from "@/pages/DiscoverNoUser";
import { RadioPlaying } from "@/pages/RadioPlaying";
import { Genres } from "@/pages/Genres";
import { GenreDetail } from "@/pages/GenreDetail";
import { GenreList } from "@/pages/GenreList";
import { Search } from "@/pages/Search";
import { Favorites } from "@/pages/Favorites";
import { Settings } from "@/pages/Settings";

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        {/* Authentication Flow */}
        <Route path="/" component={Splash} />
        <Route path="/login" component={Login} />
      <Route path="/login-with-email" component={LoginWithEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/mail-sent" component={MailSent} />
      
      {/* Onboarding Guide Pages */}
      <Route path="/guide-1" component={Guide1} />
      <Route path="/guide-2" component={Guide2} />
      <Route path="/guide-3" component={Guide3} />
      <Route path="/guide-4" component={Guide4} />
      
      {/* Main Application Pages */}
      <Route path="/discover" component={DiscoverUser} />
      <Route path="/discover-no-user" component={DiscoverNoUser} />
      <Route path="/radio-playing" component={RadioPlaying} />
      <Route path="/genres" component={Genres} />
      <Route path="/genre/:id" component={GenreDetail} />
      <Route path="/genre-list" component={GenreList} />
      <Route path="/search" component={Search} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/settings" component={Settings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
                  <GlobalPlayer />
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
