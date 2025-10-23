import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";
import { useRef, useEffect, useState } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { assetPath } from "@/lib/assetPath";

export const GenreList = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const { selectedCountryCode } = useCountry();
  const { t } = useLocalization();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Extract genre slug from URL path - wouter with hash routing
  // Example: location = "/genre-list/rock" (from #/genre-list/rock)
  const pathParts = location.split('/');
  let genreSlug = pathParts[2] || 'pop'; // /genre-list/SLUG
  
  console.log('[GenreList] Full location:', location);
  console.log('[GenreList] Extracted genre slug:', genreSlug);
  
  // Convert slug back to display name (e.g., "rock" -> "Rock", "hip-hop" -> "Hip Hop")
  const genreName = genreSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  console.log('[GenreList] URL genre slug:', genreSlug, '| Display name:', genreName);

  // Infinite scroll state
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const STATIONS_PER_PAGE = 21; // 7 columns x 3 rows

  // Fetch stations by genre and country using proper genre endpoint
  const { data: stationsData, isLoading, refetch } = useQuery({
    queryKey: ['genre-stations', genreSlug, selectedCountryCode],
    queryFn: async () => {
      console.log('[GenreList] 🎵 Fetching stations for genre:', genreSlug, 'country:', selectedCountryCode);
      
      const result = await megaRadioApi.getStationsByGenre(genreSlug, { 
        country: selectedCountryCode,
        limit: 200,
        sort: 'votes'
      });
      
      console.log('[GenreList] ✅ Fetched', result?.stations?.length || 0, 'stations for genre:', genreSlug);
      return result;
    },
    staleTime: 0, // Always fetch fresh data for genre changes
    gcTime: 60000, // 1 minute (renamed from cacheTime in v5)
  });
  
  // Force refetch when genre changes
  useEffect(() => {
    console.log('[GenreList] Genre changed to:', genreSlug);
    refetch();
  }, [genreSlug, refetch]);

  // Initialize/Update when data loads - show first 21 stations
  // This effect runs whenever stationsData.stations array changes (by reference or content)
  useEffect(() => {
    console.log('[GenreList] Data effect - stationsData:', stationsData?.stations?.length || 0);
    if (stationsData?.stations && stationsData.stations.length > 0) {
      console.log('[GenreList] Setting stations:', stationsData.stations.length);
      setAllStations(stationsData.stations);
      const firstBatch = stationsData.stations.slice(0, STATIONS_PER_PAGE);
      console.log('[GenreList] First batch:', firstBatch.length);
      setDisplayedStations(firstBatch);
      setHasMore(stationsData.stations.length > STATIONS_PER_PAGE);
      setPage(1);
    } else if (stationsData?.stations && stationsData.stations.length === 0) {
      // No stations found for this genre/country combo
      console.log('[GenreList] No stations found');
      setAllStations([]);
      setDisplayedStations([]);
      setHasMore(false);
      setPage(1);
    }
  }, [stationsData?.stations, genreSlug, selectedCountryCode]);

  // Infinite scroll detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 300;
      
      if (scrolledToBottom && hasMore && !isLoadingMore) {
        loadMore();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, allStations.length]);

  // Load more stations - client-side pagination
  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const startIdx = page * STATIONS_PER_PAGE;
      const endIdx = startIdx + STATIONS_PER_PAGE;
      
      const nextBatch = allStations.slice(startIdx, endIdx);
      
      if (nextBatch.length > 0) {
        setDisplayedStations(prev => [...prev, ...nextBatch]);
        setPage(nextPage);
        setHasMore(endIdx < allStations.length);
        console.log(`[GenreList] Loaded page ${nextPage}, showing ${endIdx}/${allStations.length} stations`);
      } else {
        setHasMore(false);
        console.log('[GenreList] No more stations to load');
      }
      
      setIsLoadingMore(false);
    }, 100);
  };

  // Fallback image - music note on pink gradient background
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

  // Focus management with sidebar: 5 sidebar + 1 back button + stations
  // Sidebar: 0-4, Back button: 5, Stations: 6+
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];
  const backButtonIndex = 5;
  const stationsStart = 6;
  const totalItems = 5 + 1 + displayedStations.length;

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
        newIndex = backButtonIndex; // Jump to back button
      }
    }
    // Back button (5)
    else if (current === backButtonIndex) {
      if (direction === 'LEFT') {
        newIndex = 1; // Jump to Genres in sidebar (current page)
      } else if (direction === 'DOWN') {
        newIndex = stationsStart; // Jump to first station
      }
    }
    // Stations grid (6+) - 7 columns
    else if (current >= stationsStart) {
      const relIndex = current - stationsStart;
      const row = Math.floor(relIndex / 7);
      const col = relIndex % 7;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to first sidebar item (Discover)
        }
      } else if (direction === 'RIGHT') {
        if (col < 6 && current < totalItems - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 7;
        } else {
          newIndex = backButtonIndex; // Jump to back button
        }
      } else if (direction === 'DOWN') {
        const nextIndex = current + 7;
        if (nextIndex < totalItems) {
          newIndex = nextIndex;
        }
      }
    }

    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  const { focusIndex, setFocusIndex, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 1, // Start on Genres in sidebar
    onSelect: (index) => {
      // Sidebar (0-4)
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        setLocation(route);
      }
      // Back button (5)
      else if (index === backButtonIndex) {
        setLocation('/genres');
      }
      // Stations (6+)
      else if (index >= stationsStart) {
        const stationIndex = index - stationsStart;
        const station = displayedStations[stationIndex];
        if (station) {
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => setLocation('/genres')
  });

  // Auto-scroll when focus changes to station items
  useEffect(() => {
    if (focusIndex >= stationsStart && scrollContainerRef.current) {
      const stationIndex = focusIndex - stationsStart;
      const container = scrollContainerRef.current;
      
      // Find the focused station element using data attribute
      const focusedElement = container.querySelector(`[data-station-index="${stationIndex}"]`);
      
      if (focusedElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = focusedElement.getBoundingClientRect();
        
        // Calculate relative position within scroll container
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        const relativeBottom = relativeTop + elementRect.height;
        
        const currentScroll = container.scrollTop;
        const containerHeight = container.clientHeight;
        const visibleTop = currentScroll;
        const visibleBottom = currentScroll + containerHeight;
        
        // Add padding to keep element away from edges
        const topPadding = 200;
        const bottomPadding = 100;
        
        // Scroll if item is not fully visible
        if (relativeTop < visibleTop + topPadding) {
          // Scroll up
          container.scrollTo({ top: Math.max(0, relativeTop - topPadding), behavior: 'smooth' });
        } else if (relativeBottom > visibleBottom - bottomPadding) {
          // Scroll down
          container.scrollTo({ top: relativeBottom - containerHeight + bottomPadding, behavior: 'smooth' });
        }
      }
    }
  }, [focusIndex]);

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/genre-list', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP:
      case 38:
        customHandleNavigation('UP');
        break;
      case key?.DOWN:
      case 40:
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT:
      case 37:
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT:
      case 39:
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER:
      case 13:
        handleSelect();
        break;
      case key?.RETURN:
      case 461:
      case 10009:
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
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={assetPath("images/hand-crowd-disco-1.png")}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bg-gradient-to-b from-[18.333%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[15.185%] top-0 w-[1920px]" />

        {/* Back Button */}
        <Link href="/genres">
          <div 
            className={`absolute h-[24px] left-[236px] top-[211px] w-[71px] cursor-pointer hover:opacity-80 transition-opacity ${getFocusClasses(isFocused(backButtonIndex))}`}
            data-testid="button-back"
            onClick={() => setLocation('/genres')}
          >
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
              {t('back') || 'Back'}
            </p>
            <div className="absolute left-0 size-[24px] top-0">
              <img
                alt="back"
                className="block max-w-none size-full"
                src={assetPath("images/arrow.svg")}
              />
            </div>
          </div>
        </Link>

        {/* Genre Title */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
          {genreName} {t('radios') || 'Radios'}
        </p>

        {/* Radio Station Cards - Dynamic Grid */}
        {displayedStations.map((station, index) => {
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
        {!isLoading && displayedStations.length === 0 && (
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
