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
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const Search = (): JSX.Element => {
  console.log('[Search] 🎬 Component mounting/rendering');
  const [, setLocation] = useLocation();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { playStation, isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentlyPlayedStations, setRecentlyPlayedStations] = useState<Station[]>([]);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  // LGTV Reference Pattern: Debounce search with 400ms timeout
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log('[Search] 🔍 keywordChange - debounced query:', searchQuery);
      setDebouncedSearchQuery(searchQuery);
    }, 400); // LGTV uses 400ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Search for stations based on debounced query
  const { data: searchData } = useQuery({
    queryKey: ['/api/stations/search', debouncedSearchQuery],
    queryFn: () => megaRadioApi.searchStations({ q: debouncedSearchQuery, limit: 4 }),
    enabled: debouncedSearchQuery.length > 0,
  });

  // Fetch popular stations as fallback
  const { data: popularStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 6, country: selectedCountryCode }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 6, country: selectedCountryCode }),
  });

  const searchResults = searchData?.results || [];
  
  console.log('🔍 [SEARCH DEBUG] Current state:', {
    searchQuery,
    debouncedSearchQuery,
    searchResultsLength: searchResults.length,
    recentlyPlayedLength: recentlyPlayedStations.length,
    totalItems: 5 + 1 + searchResults.length + (recentlyPlayedStations.length > 0 ? recentlyPlayedStations.length : (popularStationsData?.stations.length || 0))
  });
  
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

  // Calculate totalItems: 5 (sidebar) + 1 (input) + results + recent (NO country selector)
  const totalItems = 5 + 1 + searchResults.length + recentStations.length;

  // Define sidebar routes (removed Records)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  // Custom navigation logic for multi-section layout
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    console.log('[Search] 🎮 Navigation:', direction, 'from focusIndex:', focusIndex);
    const current = focusIndex;
    let newIndex = current;

    // Sidebar section (0-4)
    if (current >= 0 && current <= 4) {
      if (direction === 'DOWN') {
        newIndex = current < 4 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = 5; // Jump to search input
      }
    }
    // Search input (5)
    else if (current === 5) {
      if (direction === 'DOWN') {
        // Jump to first search result or first recent station
        if (searchResults.length > 0) {
          newIndex = 6; // First search result
        } else if (recentStations.length > 0) {
          newIndex = 6; // First recent station (no search results)
        }
      } else if (direction === 'RIGHT') {
        // Jump directly to recently played section
        if (recentStations.length > 0) {
          newIndex = 6 + searchResults.length; // First recent station
          console.log('[Search] RIGHT from search input - jumping to recently played');
        }
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Search results section (6 to 6+searchResults.length-1)
    else if (current >= 6 && current < 6 + searchResults.length) {
      const relIndex = current - 6;

      if (direction === 'UP') {
        if (relIndex > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 5; // Jump to search input
        }
      } else if (direction === 'DOWN') {
        if (relIndex < searchResults.length - 1) {
          newIndex = current + 1;
        } else {
          // Jump to recently played if available
          if (recentStations.length > 0) {
            newIndex = 6 + searchResults.length; // First recent station
          }
        }
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Recently played section (2-column grid)
    else if (current >= 6 + searchResults.length) {
      const recentStartIndex = 6 + searchResults.length;
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
            newIndex = 6 + searchResults.length - 1; // Last search result
          } else {
            newIndex = 5; // Search input
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
    console.log('[Search] 🎯 New focusIndex:', newIndex);
    setFocusIndex(newIndex);
  };

  // LGTV Reference Pattern: Set cursor position to end of input text
  const setInputCursorToEnd = () => {
    setTimeout(() => {
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
        console.log('[Search] 📍 Cursor set to end of input, position:', length);
      }
    }, 200);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 5, // Start on search input
    onSelect: (index) => {
      console.log('[Search] 🎯 onSelect triggered - index:', index);
      
      // Sidebar navigation (0-4)
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        console.log('[Search] 📍 Sidebar item selected:', index, 'route:', route);
        if (route !== '#') {
          console.log('[Search] 🚀 Navigating to sidebar route:', route);
          setLocation(route);
        }
      }
      // Search input (5) - LGTV pattern: focus input and set cursor to end
      else if (index === 5) {
        console.log('[Search] ⌨️  Search input selected');
        console.log('[Search] 📝 Focusing input field and setting cursor to end');
        if (inputRef.current) {
          inputRef.current.focus();
          console.log('[Search] ✅ Input focused');
          setInputCursorToEnd();
        } else {
          console.log('[Search] ❌ Input ref is null');
        }
      }
      // Search results (6 to 6+searchResults.length-1)
      else if (index >= 6 && index < 6 + searchResults.length) {
        const resultIndex = index - 6;
        const station = searchResults[resultIndex];
        console.log('[Search] 🎵 Search result selected:', resultIndex);
        if (station) {
          console.log('[Search] ▶️  Playing search result:', station.name, 'id:', station._id);
          playStation(station);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
      // Recently played (6+searchResults.length onwards)
      else if (index >= 6 + searchResults.length) {
        const recentIndex = index - 6 - searchResults.length;
        const station = recentStations[recentIndex];
        console.log('[Search] 🕒 Recently played selected:', recentIndex);
        if (station) {
          console.log('[Search] ▶️  Playing recently played:', station.name, 'id:', station._id);
          playStation(station);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => {
      console.log('[Search] 🔙 Back button pressed - navigating to Discover');
      setLocation('/discover-no-user');
    }
  });
  
  // Fix: Blur input when focusIndex moves away from search input (index 5)
  useEffect(() => {
    console.log('[Search] 👁️ focusIndex changed to:', focusIndex);
    if (focusIndex !== 5 && inputRef.current) {
      console.log('[Search] 🚫 Focus moved away from search input - blurring to prevent keyboard');
      inputRef.current.blur();
    }
  }, [focusIndex]);

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/search', (e) => {
    // Ignore all key events when country selector modal is open
    if (isCountrySelectorOpen) {
      console.log('[Search] Key event ignored - country selector modal is open');
      return;
    }

    const key = (window as any).tvKey;
    console.log('[Search] ⌨️ Key pressed:', e.keyCode, 'key:', e.key);
    
    switch(e.keyCode) {
      case key?.UP:
      case 38:
        console.log('[Search] ⬆️ UP key');
        customHandleNavigation('UP');
        break;
      case key?.DOWN:
      case 40:
        console.log('[Search] ⬇️ DOWN key');
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT:
      case 37:
        console.log('[Search] ⬅️ LEFT key');
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT:
      case 39:
        console.log('[Search] ➡️ RIGHT key');
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER:
      case 13:
        console.log('[Search] ✅ ENTER key');
        handleSelect();
        break;
    }
  });

  // REMOVED: Auto-focus on navigation was blocking navigation on Samsung TV
  // Input only focuses when user explicitly presses ENTER on it (handled in onSelect)

  // Fallback image
  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    // Check for null, undefined, empty string, or the string "null"
    if (station.favicon && station.favicon !== 'null' && station.favicon.trim() !== '') {
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
          src={assetPath("images/path-8.svg")}
        />
      </div>

      {/* Country Selector Modal - Hidden on Search page */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={() => {
          setIsCountrySelectorOpen(false);
        }}
      />

      {/* Fixed Left Sidebar */}
      <Sidebar activePage="search" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[246px] not-italic text-[32px] text-white top-[58px]">
        {t('search') || 'Search'}
      </p>

      {/* Search Input */}
      <div 
        className={`absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[91px] left-[246px] rounded-[14px] top-[136px] w-[774px] ${getFocusClasses(isFocused(5))}`}
        data-testid="input-search"
      >
        <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[774px]">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              console.log('[Search] 📝 Search query changed to:', e.target.value);
              setSearchQuery(e.target.value);
            }}
            onFocus={() => {
              console.log('[Search] 🎯 Input focused - keyboard should appear');
            }}
            onBlur={() => {
              console.log('[Search] 👋 Input blurred - keyboard should hide');
            }}
            placeholder="Kral Ra"
            className="absolute bg-transparent border-0 font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic outline-none text-[25.94px] text-white top-[29.84px] w-[650px] placeholder:text-[rgba(255,255,255,0.5)]"
          />
          <div className="absolute left-[32.43px] size-[31.134px] top-[29.84px] pointer-events-none">
            <img
              alt=""
              className="block max-w-none size-full"
              src={assetPath("images/search-icon.svg")}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && searchResults.map((station, index) => {
        const topPositions = [259, 359, 459, 559];
        const focusIdx = 6 + index;
        
        return (
          <div
            key={station._id || index}
            className={`absolute bg-[rgba(255,255,255,0.14)] box-border flex items-center left-[246px] px-[50px] py-[20px] rounded-[14px] w-[348px] h-[65px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
            style={{ top: `${topPositions[index]}px` }}
            data-testid={`search-result-${index}`}
            onMouseEnter={() => {
              console.log('[Search] 🖱️ hoverMovie - search result index:', index);
              setFocusIndex(focusIdx);
            }}
            onClick={() => {
              console.log('[Search] 🎯 onClick - handleMenuClick for search result:', station.name);
              handleSelect();
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
        const topPositions = [136, 430, 724]; // Added 30px gap between rows (card height 264px + 30px gap)
        const focusIdx = 6 + searchResults.length + index;
        
        console.log(`🎨 [RECENTLY PLAYED] Rendering station ${index}:`, {
          name: station.name,
          focusIdx,
          searchResultsLength: searchResults.length,
          currentFocusIndex: focusIndex,
          isFocused: isFocused(focusIdx),
          calculation: `6 + ${searchResults.length} + ${index} = ${focusIdx}`
        });
        
        return (
          <div 
            key={station._id || index}
            className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
            style={{ 
              left: `${leftPositions[col]}px`,
              top: `${topPositions[row]}px`
            }}
            data-testid={`recent-station-${index}`}
            onMouseEnter={() => {
              console.log('[Search] 🖱️ hoverMovie - recent station index:', index);
              setFocusIndex(focusIdx);
            }}
            onClick={() => {
              console.log('[Search] 🎯 onClick - handleMenuClick for recent station:', station.name);
              handleSelect();
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
