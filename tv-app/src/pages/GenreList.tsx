import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";
import { useRef, useEffect, useState } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { useNavigation } from "@/contexts/NavigationContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { assetPath } from "@/lib/assetPath";

export const GenreList = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const { selectedCountryCode } = useCountry();
  const { t } = useLocalization();
  const { setNavigationState, popNavigationState } = useNavigation();
  const { playStation } = useGlobalPlayer();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const pathParts = location.split('/');
  
  let genreSlug = pathParts[2] || 'pop'; // /genre-list/SLUG
  
  // Convert slug back to display name (e.g., "rock" -> "Rock", "hip-hop" -> "Hip Hop")
  const genreName = genreSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // PAGINATION state - Load stations in smaller batches for better navigation
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const STATIONS_PER_LOAD = 28; // Fetch 28 stations per batch (4 rows × 7 columns)

  // Fetch initial batch (28 stations) with offset=0 for pagination
  // CACHE: 7 days
  const { data: stationsData, isLoading } = useQuery({
    queryKey: ['genre-stations/initial', genreSlug, selectedCountryCode],
    queryFn: async () => {
      const result = await megaRadioApi.getStationsByGenre(genreSlug, { 
        country: selectedCountryCode,
        limit: STATIONS_PER_LOAD,
        offset: 0,
        sort: 'votes'
      });
      
      return result;
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days (renamed from cacheTime in v5)
  });
  
  // Initialize when initial data loads - PAGINATION
  // Note: No need for refetch useEffect - queryKey changes trigger automatic refetch
  useEffect(() => {
    // Guard stationsData?.stations before rendering
    if (stationsData && stationsData.stations && Array.isArray(stationsData.stations)) {
      if (stationsData.stations.length > 0) {
        const stations = stationsData.stations;
        
        setDisplayedStations(stations);
        setCurrentOffset(STATIONS_PER_LOAD); // Next fetch will use offset=28
        
        // If we got less than requested, there's no more to load
        const hasMoreStations = stations.length >= STATIONS_PER_LOAD;
        setHasMore(hasMoreStations);
      } else {
        // No stations found for this genre/country combo
        setDisplayedStations([]);
        setHasMore(false);
        setCurrentOffset(0);
      }
    } else {
      // Null or undefined stations data
      setDisplayedStations([]);
      setHasMore(false);
      setCurrentOffset(0);
    }
  }, [stationsData?.stations, genreSlug, selectedCountryCode]);

  // PAGINATION - Fetch next batch from API using offset
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    
    try {
      const result = await megaRadioApi.getStationsByGenre(genreSlug, { 
        country: selectedCountryCode,
        limit: STATIONS_PER_LOAD,
        offset: currentOffset,
        sort: 'votes'
      });
      
      // Validate result exists and has stations property
      if (!result || !result.stations) {
        setHasMore(false);
        return;
      }

      const newStations = result.stations || [];
      
      if (Array.isArray(newStations) && newStations.length > 0) {
        setDisplayedStations(prev => {
          // Ensure prev is always an array
          if (!Array.isArray(prev)) {
            return newStations;
          }
          return [...prev, ...newStations];
        });
        setCurrentOffset(prev => prev + STATIONS_PER_LOAD); // Increment offset for next fetch
        
        // If we got less than requested, we've reached the end
        const hasMoreStations = newStations.length >= STATIONS_PER_LOAD;
        setHasMore(hasMoreStations);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more stations:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Scroll-based pagination trigger (when within 600px of bottom)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Add null check for scrollContainerRef.current inside scroll handler
      if (!scrollContainerRef.current) return;

      try {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        
        // Validate all properties are valid numbers
        if (typeof scrollTop !== 'number' || typeof scrollHeight !== 'number' || typeof clientHeight !== 'number') {
          return;
        }

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        
        // Trigger load when within 600px of bottom
        if (distanceFromBottom < 600 && hasMore && !isLoadingMore) {
          loadMore();
        }
      } catch (error) {
        console.error('Error in scroll handler:', error);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, currentOffset]);

  // Fallback image - music note on pink gradient background
  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    // Check for null, undefined, empty string, or the string "null"
    if (station.favicon && station.favicon !== 'null' && station.favicon.trim() !== '') {
      return station.favicon.startsWith('http') 
        ? station.favicon.replace(/^http:\/\//, 'https://') 
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

  // Focus management with sidebar: 5 sidebar + stations
  // Sidebar: 0-4, Stations: 5+
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];
  const stationsStart = 5;
  const totalItems = 5 + displayedStations.length;

  // Custom navigation for sidebar + content
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    // Sidebar (0-4)
    if (current >= 0 && current <= 4) {
      if (direction === 'DOWN') {
        newIndex = current < 4 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = stationsStart; // Jump to first station
      }
    }
    // Stations grid (5+) - 7 columns
    else if (current >= stationsStart) {
      const relIndex = current - stationsStart;
      const row = Math.floor(relIndex / 7);
      const col = relIndex % 7;
      const totalStations = displayedStations.length;

      if (direction === 'LEFT') {
        // Only move left if not in first column
        if (col > 0) {
          newIndex = current - 1;
        } else {
          // First column - jump to Genres in sidebar (index 1)
          newIndex = 1;
        }
      } else if (direction === 'RIGHT') {
        // Only move right if not in last column AND next station exists
        if (col < 6 && (relIndex + 1) < totalStations) {
          newIndex = current + 1;
        }
        // Otherwise stay at current position
      } else if (direction === 'UP') {
        // Only move up if not in first row
        if (row > 0) {
          const targetIndex = current - 7;
          // Make sure target station exists
          if (targetIndex >= stationsStart) {
            newIndex = targetIndex;
          }
        } else {
          // First row - jump to Genres in sidebar (index 1)
          newIndex = 1;
        }
      } else if (direction === 'DOWN') {
        // Calculate the target position in the next row (same column)
        const targetRelIndex = relIndex + 7;
        const targetIndex = stationsStart + targetRelIndex;
        
        // Only move down if the target station actually exists
        if (targetRelIndex < totalStations) {
          newIndex = targetIndex;
        }
        // Target doesn't exist - stay at current position
      }
    }

    // Ensure newIndex is within valid bounds
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  const { focusIndex, setFocusIndex, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 0, // Start on sidebar, will jump to first station when loaded
    onSelect: (index) => {
      // Sidebar (0-4)
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        window.location.hash = '#' + route;
      }
      // Stations (5+)
      else if (index >= stationsStart) {
        const stationIndex = index - stationsStart;
        const station = displayedStations[stationIndex];
        if (station) {
          setNavigationState(location, index);
          playStation(station);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => setLocation('/genres')
  });

  // Jump to first station when stations load OR restore focus when returning
  useEffect(() => {
    const navState = popNavigationState(); // Pop and clear in one atomic operation
    if (navState && navState.returnFocusIndex !== null) {
      // Restore focus when returning from RadioPlaying
      setFocusIndex(navState.returnFocusIndex);
    } else if (displayedStations.length > 0 && focusIndex < stationsStart) {
      // Default: Jump to first station when stations load
      setFocusIndex(stationsStart);
    }
  }, [displayedStations.length]);

  // Auto-scroll focused station into view - ONLY if element is truly off-screen
  // Uses scrollTop/offsetTop based math for accurate visibility detection
  useEffect(() => {
    if (focusIndex >= stationsStart && scrollContainerRef.current) {
      try {
        const stationIndex = focusIndex - stationsStart;
        const container = scrollContainerRef.current;
        
        // Validate container exists
        if (!container) {
          return;
        }
        
        // Find the focused station element using data attribute
        const focusedElement = container.querySelector(`[data-station-index="${stationIndex}"]`) as HTMLElement;
        
        // Validate focusedElement exists before computing offsetTop
        if (!focusedElement) {
          return;
        }
        
        // Validate element has required properties
        if (typeof focusedElement.offsetTop !== 'number' || typeof focusedElement.offsetHeight !== 'number') {
          return;
        }
        
        // Use scrollTop/offsetTop based calculation (NOT getBoundingClientRect)
        const TOP_PADDING = 20;  // Padding from top edge
        const BOTTOM_PADDING = 120;  // Leave space for global player bar
        
        const viewTop = container.scrollTop;
        const viewBottom = viewTop + container.clientHeight - BOTTOM_PADDING;
        
        // Validate container properties
        if (typeof viewTop !== 'number' || typeof container.clientHeight !== 'number') {
          return;
        }
        
        // Get element position relative to scroll container
        let elementTop = 0;
        let el: HTMLElement | null = focusedElement;
        
        // Calculate offset with safety checks
        while (el && el !== container) {
          if (typeof el.offsetTop === 'number') {
            elementTop += el.offsetTop;
          }
          el = el.offsetParent as HTMLElement;
          
          // Safety check to prevent infinite loops
          if (!el || (el && el.nodeType !== 1)) {
            break;
          }
        }
        
        const elementBottom = elementTop + focusedElement.offsetHeight;
        
        // Check if element is FULLY visible
        const isAboveView = elementTop < viewTop + TOP_PADDING;
        const isBelowView = elementBottom > viewBottom;
        
        // Only scroll if element is actually outside the visible viewport
        if (isAboveView) {
          container.scrollTo({ top: elementTop - TOP_PADDING, behavior: 'smooth' });
        } else if (isBelowView) {
          const newScrollTop = elementBottom - container.clientHeight + BOTTOM_PADDING;
          container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
        }
        // If element is FULLY visible, do NOTHING - no scroll!
      } catch (error) {
        console.error('Error in auto-scroll calculation:', error);
        // Don't crash - just skip the scroll
      }
    }
  }, [focusIndex, stationsStart]);

  // TRUE INFINITE SCROLL trigger - Focus-based (when within last 28 items / 4 rows)
  // Load MORE stations BEFORE user reaches the end for seamless experience
  useEffect(() => {
    try {
      // Only trigger for station items section
      if (focusIndex >= stationsStart) {
        const stationIndex = focusIndex - stationsStart;
        const distanceFromEnd = displayedStations.length - stationIndex;
        
        // If user is within last 28 items (4 rows × 7 columns), load more
        if (distanceFromEnd <= 28 && hasMore && !isLoadingMore) {
          loadMore();
        }
      }
    } catch (error) {
      console.error('Error in infinite scroll trigger:', error);
    }
  }, [focusIndex, stationsStart, displayedStations.length, hasMore, isLoadingMore]);

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/genre-list', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP:
      case 38:
        e.preventDefault();
        customHandleNavigation('UP');
        break;
      case key?.DOWN:
      case 40:
        e.preventDefault();
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT:
      case 37:
        e.preventDefault();
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT:
      case 39:
        e.preventDefault();
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER:
      case 13:
        e.preventDefault();
        handleSelect();
        break;
      case key?.RETURN:
      case 461:
      case 10009:
        e.preventDefault();
        handleBack();
        break;
    }
  });

  return (
    <AppLayout currentPage="genres" scrollContainerRef={scrollContainerRef}>
      <div ref={scrollContainerRef} className="relative w-[1920px] h-[1080px] overflow-y-auto" data-testid="page-genre-list">
        {/* Background Image */}
        <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full"
            src={assetPath("images/hand-crowd-disco-1.png")}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bg-gradient-to-b from-[18.333%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[15.185%] top-0 w-[1920px]" />

        {/* Genre Title */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
          {genreName} {t('radios') || 'Radios'}
        </p>

        {/* Radio Station Cards - Dynamic Grid */}
        {Array.isArray(displayedStations) && displayedStations.map((station, index) => {
          // Validate station object exists and has required properties
          if (!station || !station._id || !station.name) {
            return null;
          }

          const row = Math.floor(index / 7);
          const col = index % 7;
          const leftPosition = 236 + (col * 230); // 236px start, 230px between columns
          const topPosition = 316 + (row * 294); // 316px start, 294px between rows
          
          return (
            <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
              <div 
                className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(index + stationsStart))}`}
                style={{ left: `${leftPosition}px`, top: `${topPosition}px` }}
                data-testid={`station-card-${index}`}
                data-station-index={index}
                onClick={() => setLocation(`/radio-playing?station=${station._id}`)}
              >
                <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] w-[132px] h-[132px] top-[34px]">
                  <img
                    alt={station.name}
                    className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full"
                    src={getStationImage(station)}
                    loading="lazy"
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
            </Link>
          );
        })}

        {/* Loading Indicator */}
        {isLoadingMore && (
          <div 
            className="absolute left-[236px] w-[1580px] h-[100px] flex items-center justify-center"
            style={{ top: `${316 + (Math.ceil(displayedStations.length / 7) * 294)}px` }}
          >
            <p className="font-['Ubuntu',Helvetica] font-medium text-[24px] text-white">
              {t('loading') || 'Loading...'}
            </p>
          </div>
        )}

        {/* No Stations Found */}
        {!isLoading && (!Array.isArray(displayedStations) || displayedStations.length === 0) && (
          <div className="absolute left-[236px] top-[450px] w-[1580px] h-[200px] flex flex-col items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-4">
              {t('no_stations_found') || 'No Stations Found'}
            </p>
            <p className="font-['Ubuntu',Helvetica] font-light text-[24px] text-[#c8c8c8]">
              {t('try_different_genre') || 'Try a different genre or country'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
