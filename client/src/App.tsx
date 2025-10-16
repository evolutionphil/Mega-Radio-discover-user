import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { DiscoverUser } from "@/pages/DiscoverUser";
import { DiscoverNoUser } from "@/pages/DiscoverNoUser";
import { Search } from "@/pages/Search";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={DiscoverUser} />
      <Route path="/discover-no-user" component={DiscoverNoUser} />
      <Route path="/search" component={Search} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
