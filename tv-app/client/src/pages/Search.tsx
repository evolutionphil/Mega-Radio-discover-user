import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { CountrySelector } from "@/components/CountrySelector";
import { useCountry } from "@/contexts/CountryContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { recentlyPlayedService } from "@/services/recentlyPlayedService";
import { useLocalization } from "@/contexts/LocalizationContext";

export const Search = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { playStation, isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentlyPlayedStations, setRecentlyPlayedStations] = useState<Station[]>([]);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

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

  // Calculate totalItems: 6 (sidebar) + 1 (country) + 1 (input) + results + recent
  const totalItems = 6 + 1 + 1 + searchResults.length + recentStations.length;

  // Define sidebar routes
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '#', '/settings'];

  // Custom navigation logic for multi-section layout
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    // Sidebar section (0-5)
    if (current >= 0 && current <= 5) {
      if (direction === 'DOWN') {
        newIndex = current < 5 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = 6; // Jump to country selector
      }
    }
    // Country selector (6)
    else if (current === 6) {
      if (direction === 'DOWN') {
        newIndex = 7; // Jump to search input
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to first sidebar item
      }
    }
    // Search input (7)
    else if (current === 7) {
      if (direction === 'UP') {
        newIndex = 6; // Jump to country selector
      } else if (direction === 'DOWN') {
        // Jump to first search result or first recent station
        if (searchResults.length > 0) {
          newIndex = 8; // First search result
        } else if (recentStations.length > 0) {
          newIndex = 8; // First recent station (no search results)
        }
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Search results section (8 to 8+searchResults.length-1)
    else if (current >= 8 && current < 8 + searchResults.length) {
      const relIndex = current - 8;

      if (direction === 'UP') {
        if (relIndex > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 7; // Jump to search input
        }
      } else if (direction === 'DOWN') {
        if (relIndex < searchResults.length - 1) {
          newIndex = current + 1;
        } else {
          // Jump to recently played if available
          if (recentStations.length > 0) {
            newIndex = 8 + searchResults.length; // First recent station
          }
        }
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Recently played section (2-column grid)
    else if (current >= 8 + searchResults.length) {
      const recentStartIndex = 8 + searchResults.length;
      const relIndex = current - recentStartIndex;
      const row = Math.floor(relIndex / 2);
      const col = relIndex % 2;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < 1 && current < totalItems - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 2;
        } else {
          // Jump to search results or search input
          if (searchResults.length > 0) {
            newIndex = 8 + searchResults.length - 1; // Last search result
          } else {
            newIndex = 7; // Search input
          }
        }
      } else if (direction === 'DOWN') {
        const nextIndex = current + 2;
        if (nextIndex < totalItems) {
          newIndex = nextIndex;
        }
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 7, // Start on search input
    onSelect: (index) => {
      // Sidebar navigation (0-5)
      if (index >= 0 && index <= 5) {
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      }
      // Country selector (6)
      else if (index === 6) {
        setIsCountrySelectorOpen(true);
      }
      // Search input (7) - do nothing, user can type
      else if (index === 7) {
        // Input already focused via useEffect below
        console.log('[Search] Search input selected');
      }
      // Search results (8 to 8+searchResults.length-1)
      else if (index >= 8 && index < 8 + searchResults.length) {
        const resultIndex = index - 8;
        const station = searchResults[resultIndex];
        if (station) {
          playStation(station);
          setLocation(`/radio-playing?stationId=${station._id}`);
        }
      }
      // Recently played (8+searchResults.length onwards)
      else if (index >= 8 + searchResults.length) {
        const recentIndex = index - 8 - searchResults.length;
        const station = recentStations[recentIndex];
        if (station) {
          playStation(station);
          setLocation(`/radio-playing?stationId=${station._id}`);
        }
      }
    },
    onBack: () => {
      setLocation('/discover-no-user');
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/search', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP || 38:
        customHandleNavigation('UP');
        break;
      case key?.DOWN || 40:
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT || 37:
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT || 39:
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER || 13:
        handleSelect();
        break;
    }
  });

  // Special handling: Focus input element when index 7 is focused
  useEffect(() => {
    if (focusIndex === 7 && inputRef.current) {
      console.log('[Search] Focus index 7 (search input) - calling .focus() on input element');
      inputRef.current.focus();
      
      // Show Samsung keyboard if on Samsung TV
      if ((window as any).tizen || (window as any).webapis) {
        console.log('[Search] Samsung TV detected - keyboard should appear');
      }
    }
  }, [focusIndex]);

  // Fallback image
  const FALLBACK_IMAGE = '/images/fallback-station.png';

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

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]" data-testid="page-search">
      {/* Logo */}
      <div className="absolute left-[30px] top-[64px] w-[164.421px] h-[57px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/images/path-8.svg"
        />
      </div>

      {/* Equalizer Icon */}
      <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
          <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
          <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
        </div>
      </div>

      {/* Country Selector */}
      <div 
        className={`absolute left-[1453px] top-[67px] flex w-[223px] h-[51px] rounded-[30px] bg-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors flex-shrink-0 ${getFocusClasses(isFocused(6))}`}
        style={{ padding: '11px 14.316px 11px 15px', justifyContent: 'center', alignItems: 'center' }}
        onClick={() => setIsCountrySelectorOpen(true)}
        data-testid="button-country-selector"
      >
        <div className="flex items-center gap-[10.66px]">
          <div className="size-[28.421px] rounded-full overflow-hidden flex-shrink-0">
            <img
              alt={selectedCountry}
              className="w-full h-full object-cover"
              src={selectedCountryFlag}
            />
          </div>
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal text-[24px] text-white whitespace-nowrap">
            {selectedCountry}
          </p>
          <div className="flex items-center justify-center ml-auto">
            <div className="rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/images/arrow.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={() => {
          setIsCountrySelectorOpen(false);
        }}
      />

      {/* Sidebar */}
      <div className="absolute left-[30px] top-[144px] w-[120px] h-[556px]">
        <div className="flex flex-col gap-[8px]">
          <Link href="/discover-no-user">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-transparent ${getFocusClasses(isFocused(0))}`}
              data-testid="button-discover"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('discover')}
                </p>
                <img
                  className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                  alt="Discover"
                  src="/images/radio-icon.svg"
                />
              </div>
            </div>
          </Link>

          <Link href="/genres">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-transparent ${getFocusClasses(isFocused(1))}`}
              data-testid="button-genres"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('genres')}
                </p>
                <img
                  className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                  alt="Genres"
                  src="/images/music-icon.svg"
                />
              </div>
            </div>
          </Link>

          <Link href="/search">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-[rgba(255,255,255,0.2)] ${getFocusClasses(isFocused(2))}`}
              data-testid="button-search"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('search')}
                </p>
                <img
                  className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                  alt="Search"
                  src="/images/search-icon.svg"
                />
              </div>
            </div>
          </Link>

          <Link href="/favorites">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-transparent ${getFocusClasses(isFocused(3))}`}
              data-testid="button-favorites"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('favorites')}
                </p>
                <img
                  className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                  alt="Favorites"
                  src="/images/heart-icon.svg"
                />
              </div>
            </div>
          </Link>

          <Link href="#">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-transparent ${getFocusClasses(isFocused(4))}`}
              data-testid="button-records"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('profile_nav_records')}
                </p>
                <div className="absolute left-[23px] top-0 w-[32px] h-[32px]">
                  <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
                  <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/settings">
            <div
              className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer transition-colors bg-transparent ${getFocusClasses(isFocused(5))}`}
              data-testid="button-settings"
            >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {t('settings')}
                </p>
                <img
                  className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                  alt="Settings"
                  src="/images/settings-icon.svg"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[246px] not-italic text-[32px] text-white top-[58px]">
        {t('search') || 'Search'}
      </p>

      {/* Search Input */}
      <div 
        className={`absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[91px] left-[246px] rounded-[14px] top-[136px] w-[774px] ${getFocusClasses(isFocused(7))}`}
        data-testid="input-search"
      >
        <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[774px]">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kral Ra"
            className="absolute bg-transparent border-0 font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic outline-none text-[25.94px] text-white top-[29.84px] w-[650px] placeholder:text-[rgba(255,255,255,0.5)]"
          />
          <div className="absolute left-[32.43px] size-[31.134px] top-[29.84px] pointer-events-none">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/images/search-icon.svg"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && searchResults.map((station, index) => {
        const topPositions = [259, 359, 459, 559];
        const focusIdx = 8 + index;
        
        return (
          <div
            key={station._id || index}
            className={`absolute bg-[rgba(255,255,255,0.14)] box-border flex items-center left-[246px] px-[50px] py-[20px] rounded-[14px] w-[348px] h-[65px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
            style={{ top: `${topPositions[index]}px` }}
            data-testid={`search-result-${index}`}
            onClick={() => {
              playStation(station);
              setLocation(`/radio-playing?stationId=${station._id}`);
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
        {t('recently_played') || t('recent') || 'Recently Played'}
      </p>

      {/* Recently Played Stations - 2 columns x 3 rows */}
      {recentStations.map((station, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const leftPositions = [1110, 1340];
        const topPositions = [136, 400, 650];
        const focusIdx = 8 + searchResults.length + index;
        
        return (
          <div 
            key={station._id || index}
            className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
            style={{ 
              left: `${leftPositions[col]}px`,
              top: `${topPositions[row]}px`
            }}
            data-testid={`recent-station-${index}`}
            onClick={() => {
              playStation(station);
              setLocation(`/radio-playing?stationId=${station._id}`);
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
  );
};
