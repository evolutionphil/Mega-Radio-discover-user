import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";
import { recentlyPlayedService } from "@/services/recentlyPlayedService";

export const Search = (): JSX.Element => {
  useTVNavigation();
  const [, setLocation] = useLocation();
  const { selectedCountryCode } = useCountry();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isNavigatingRef = useRef(false);
  const [recentlyPlayedStations, setRecentlyPlayedStations] = useState<Station[]>([]);

  // Search for stations based on query
  const { data: searchData } = useQuery({
    queryKey: ['/api/stations/search', searchQuery],
    queryFn: () => megaRadioApi.searchStations({ q: searchQuery, limit: 4 }),
    enabled: searchQuery.length > 0,
  });

  // Fetch popular stations as fallback
  const { data: popularStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 6, country: selectedCountryCode }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 6, country: selectedCountryCode }),
  });

  const searchResults = searchData?.results || [];
  
  // Load recently played stations from localStorage
  useEffect(() => {
    const recent = recentlyPlayedService.getStations();
    setRecentlyPlayedStations(recent);
    console.log('[Search] Loaded recently played stations:', recent.length);
  }, []);

  // Use recently played if available, otherwise fall back to popular stations
  const recentStations = recentlyPlayedStations.length > 0 
    ? recentlyPlayedStations 
    : (popularStationsData?.stations || []);

  // Auto-focus search input when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-focus search input in TV navigation system
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((window as any).tvSpatialNav) {
        // Find the search input wrapper by data-testid
        const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLElement;
        if (searchInput) {
          console.log('[Search] Auto-focusing search input in TV navigation');
          (window as any).tvSpatialNav.focus(searchInput);
        }
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  // Re-initialize TV navigation when search results change
  useEffect(() => {
    // Small delay to ensure DOM is updated with search results
    const timeout = setTimeout(() => {
      if ((window as any).tvSpatialNav) {
        console.log('[Search] Updating TV navigation for search results');
        (window as any).tvSpatialNav.updateFocusableElements();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchResults.length]);

  // Samsung keyboard integration - focus input and trigger native keyboard
  const handleInputFocus = () => {
    // On Samsung TV, focusing the input will automatically show the native keyboard
    if ((window as any).tizen || (window as any).webapis) {
      console.log('Samsung TV detected - native keyboard will appear');
    }
  };

  // Fallback image - music note on pink gradient background
  const FALLBACK_IMAGE = '/images/fallback-favicon.svg';

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    if (station.favicon) {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  // Helper function to get station tags as array
  const getStationTags = (station: Station): string[] => {
    if (!station.tags) return [];
    if (Array.isArray(station.tags)) return station.tags;
    return station.tags.split(',').map(tag => tag.trim());
  };

  // Helper function to get first category/tag
  const getStationCategory = (station: Station): string => {
    const tags = getStationTags(station);
    if (tags.length > 0) return tags[0];
    return station.country || 'Radio';
  };

  // Helper to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query) return <span className="text-[#a5a5a5]">{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span className="text-[#a5a5a5]">{text}</span>;
    
    return (
      <>
        <span className="text-[#a5a5a5]">{text.substring(0, index)}</span>
        <span className="text-white">{text.substring(index, index + query.length)}</span>
        <span className="text-[#a5a5a5]">{text.substring(index + query.length)}</span>
      </>
    );
  };

  // Handle station click - blur input to prevent Samsung keyboard
  const handleStationClick = (stationId: string, type: 'search' | 'recent') => {
    console.log('='.repeat(60));
    console.log(`[Search] ⚡ STATION CLICK HANDLER TRIGGERED`);
    console.log(`[Search] Type: ${type}`);
    console.log(`[Search] Station ID:`, stationId);
    console.log(`[Search] Current input focus:`, document.activeElement === inputRef.current ? 'INPUT HAS FOCUS' : 'NO FOCUS');
    console.log(`[Search] isNavigating flag BEFORE:`, isNavigatingRef.current);
    
    // Set navigation flag FIRST to prevent ANY input focus attempts
    isNavigatingRef.current = true;
    console.log(`[Search] ✅ isNavigating flag set to TRUE - input focus is now BLOCKED`);
    
    // Blur BOTH the input and the wrapper to completely prevent keyboard
    if (inputRef.current) {
      console.log('[Search] Blurring input element...');
      inputRef.current.blur();
    }
    
    // Also blur any currently focused element
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      console.log('[Search] Blurring active element:', document.activeElement.tagName, document.activeElement.getAttribute('data-testid'));
      document.activeElement.blur();
    }
    
    console.log('[Search] ✅ All elements blurred');
    console.log('[Search] New active element:', document.activeElement?.tagName);
    
    // Navigate immediately - flag will stay true to prevent input refocus during unmount
    console.log('[Search] 🚀 NAVIGATING to /radio-playing?station=' + stationId);
    console.log('='.repeat(60));
    setLocation(`/radio-playing?station=${stationId}`);
  };

  return (
    <AppLayout currentPage="search" hideHeaderControls={true}>
      <div className="relative w-[1920px] h-[1080px] overflow-hidden" data-testid="page-search">
        {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[246px] not-italic text-[32px] text-white top-[58px]">
        Search
      </p>

      {/* Search Input */}
      <div 
        className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[91px] left-[246px] rounded-[14px] top-[136px] w-[774px]"
        data-testid="input-search"
        data-tv-focusable="true"
        onFocus={(e) => {
          console.log('[Search] 🎯 Input wrapper FOCUSED');
          console.log('[Search] isNavigating flag:', isNavigatingRef.current);
          console.log('[Search] Current active element:', document.activeElement?.tagName);
          console.log('[Search] Input ref exists:', !!inputRef.current);
          
          if (!isNavigatingRef.current && inputRef.current && document.activeElement !== inputRef.current) {
            console.log('[Search] ✅ Focusing actual input element...');
            inputRef.current.focus();
          } else {
            console.log('[Search] ❌ NOT focusing input - reason:', {
              isNavigating: isNavigatingRef.current,
              hasInputRef: !!inputRef.current,
              alreadyFocused: document.activeElement === inputRef.current
            });
          }
        }}
      >
        <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[774px]">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              console.log('[Search] 📝 Actual INPUT element focused');
              handleInputFocus();
            }}
            onBlur={() => {
              console.log('[Search] 📝 Actual INPUT element blurred');
              console.log('[Search] New active element:', document.activeElement?.tagName, document.activeElement?.getAttribute('data-testid'));
            }}
            placeholder="Kral Ra"
            className="absolute bg-transparent border-0 font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic outline-none text-[25.94px] text-white top-[29.84px] w-[650px] placeholder:text-[rgba(255,255,255,0.5)]"
          />
          <div className="absolute left-[32.43px] size-[31.134px] top-[29.84px] pointer-events-none">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/images/vuesax-bold-search-normal.svg"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && searchResults.map((station, index) => {
        const topPositions = [259, 359, 459, 559];
        
        return (
          <div
            key={station._id || index}
            className="absolute bg-[rgba(255,255,255,0.14)] box-border flex items-center left-[246px] px-[50px] py-[20px] rounded-[14px] w-[348px] h-[65px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            style={{ top: `${topPositions[index]}px` }}
            data-testid={`search-result-${index}`}
            data-tv-focusable="true"
            onClick={(e) => {
              console.log(`[Search] 🖱️ Search result ${index} onClick triggered`);
              e.preventDefault();
              e.stopPropagation();
              handleStationClick(station._id, 'search');
            }}
            onMouseDown={(e) => {
              console.log(`[Search] 🖱️ Search result ${index} onMouseDown`);
              // Prevent input from getting focus when clicking search result
              e.preventDefault();
            }}
            onFocus={(e) => {
              console.log(`[Search] 🎯 Search result ${index} focused via TV navigation`);
            }}
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] truncate w-full">
              {highlightText(station.name, searchQuery)}
            </p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[14px]" />
          </div>
        );
      })}

      {/* No results message */}
      {searchQuery.length > 0 && searchResults.length === 0 && (
        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[246px] not-italic text-[22px] text-[rgba(255,255,255,0.5)] top-[259px]">
          No stations found for "{searchQuery}"
        </p>
      )}

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[1110px] not-italic text-[32px] text-white top-[58px]">
        Recently Played
      </p>

      {/* Recently Played Stations - 2 columns x 3 rows */}
      {recentStations.map((station, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const leftPositions = [1110, 1340];
        const topPositions = [136, 430, 724];
        
        return (
          <div 
            key={station._id || index}
            className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
            style={{ 
              left: `${leftPositions[col]}px`,
              top: `${topPositions[row]}px`
            }}
            data-testid={`recent-station-${index}`}
            data-tv-focusable="true"
            onClick={(e) => {
              console.log(`[Search] 🖱️ Recent station ${index} onClick triggered`);
              e.preventDefault();
              e.stopPropagation();
              handleStationClick(station._id, 'recent');
            }}
            onMouseDown={(e) => {
              console.log(`[Search] 🖱️ Recent station ${index} onMouseDown`);
              // Prevent input from getting focus when clicking recent station
              e.preventDefault();
            }}
            onFocus={(e) => {
              console.log(`[Search] 🎯 Recent station ${index} focused via TV navigation`);
            }}
          >
              <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                <img
                  alt={station.name}
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  src={getStationImage(station)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.name}
              </p>
              <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {getStationCategory(station)}
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
        );
      })}
      </div>
    </AppLayout>
  );
};
