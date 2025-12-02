import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station, type Genre } from "@/services/megaRadioApi";
import { CountrySelector } from "@/components/CountrySelector";
import { CountryTrigger } from "@/components/CountryTrigger";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useCountry } from "@/contexts/CountryContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { autoPlayService } from "@/services/autoPlayService";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const DiscoverNoUser = (): JSX.Element => {
  const { t } = useLocalization();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag, setCountry } = useCountry();
  const { playStation, isPlaying } = useGlobalPlayer();
  const [location, setLocation] = useLocation();
  const { setNavigationState, popNavigationState } = useNavigation();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitModalFocusIndex, setExitModalFocusIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const genreScrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  
  // Infinite scroll state for country stations - TRUE INFINITE SCROLL with API
  // LG TV Performance: Use smaller batches (60) for better rendering performance
  const COUNTRY_BATCH_SIZE = 60; // Optimized for TV performance
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreCountryStations, setHasMoreCountryStations] = useState(true);

  // Fetch ALL genres from API filtered by country (or global if GLOBAL selected)
  // CACHE: 7 days
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres/all', selectedCountryCode],
    queryFn: () => {
      if (selectedCountryCode === 'GLOBAL') {
        console.log('[DiscoverNoUser] Fetching GLOBAL genres (no country filter)');
        return megaRadioApi.getAllGenres();
      }
      console.log('[DiscoverNoUser] Fetching genres for country code:', selectedCountryCode);
      return megaRadioApi.getAllGenres(selectedCountryCode);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Fetch popular stations filtered by selected country (or global if GLOBAL selected)
  // CACHE: 24 hours
  const { data: popularStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 24, country: selectedCountryCode }],
    queryFn: () => {
      if (selectedCountryCode === 'GLOBAL') {
        console.log('[DiscoverNoUser] Fetching GLOBAL popular stations (no country filter)');
        return megaRadioApi.getPopularStations({ limit: 24 });
      }
      console.log('[DiscoverNoUser] Fetching popular stations for country:', selectedCountryCode);
      return megaRadioApi.getPopularStations({ limit: 24, country: selectedCountryCode });
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Fetch initial 60 stations with offset=0 for TRUE infinite scroll (or global if GLOBAL selected)
  // LG TV Performance: Use 60 stations per batch for smoother rendering
  // CACHE: 7 days
  const { data: initialStationsData, isLoading: isInitialLoading } = useQuery({
    queryKey: ['/api/stations/country/initial', selectedCountryCode, COUNTRY_BATCH_SIZE],
    queryFn: () => {
      if (selectedCountryCode === 'GLOBAL') {
        return megaRadioApi.getWorkingStations({ limit: COUNTRY_BATCH_SIZE, offset: 0 });
      }
      return megaRadioApi.getWorkingStations({ limit: COUNTRY_BATCH_SIZE, country: selectedCountryCode, offset: 0 });
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const genres = genresData?.genres || []; // Show ALL genres, not just 8
  const popularStations = popularStationsData?.stations?.slice(0, 14) || [];

  // Calculate dynamic section boundaries (5 sidebar + 1 country selector = 6)
  const popularStationsStart = 6;
  const popularStationsEnd = popularStationsStart + popularStations.length - 1;
  const genresStart = popularStationsEnd + 1;
  const genresEnd = genresStart + genres.length - 1;
  const countryStationsStart = genresEnd + 1;

  // Calculate dynamic totalItems using actual array lengths (5 sidebar + 1 country selector + content)
  const totalItems = 5 + 1 + popularStations.length + genres.length + displayedStations.length;

  // Define sidebar routes (NO PROFILE - 5 items: Discover, Genres, Search, Favorites, Settings)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  // Scroll genre container to show focused genre - SMOOTH SCROLL like similar stations
  const scrollGenreIntoView = (genreIndex: number) => {
    if (!genreScrollRef.current) return;
    
    // Calculate scroll position based on genre width + gap + padding
    // Each genre pill has variable width, but we can estimate spacing
    const genreWidth = 200; // approximate width
    const gap = 20; // gap between genres
    const scrollPosition = genreIndex * (genreWidth + gap);
    
    genreScrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Custom navigation logic for complex multi-section layout
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    // Sidebar section (0-4) - 5 items
    if (current >= 0 && current <= 4) {
      if (direction === 'DOWN') {
        newIndex = current < 4 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        if (current === 0 || current === 1) {
          // From Discover or Genres, jump to first Popular Genre
          newIndex = genresStart;
          scrollGenreIntoView(0);
        } else {
          // From Search, Favorites, or Settings, jump to first Popular Station
          newIndex = popularStationsStart;
        }
      }
    }
    // Country selector (5)
    else if (current === 5) {
      if (direction === 'DOWN') {
        newIndex = genresStart; // Jump to first genre
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to first sidebar item
      }
    }
    // Popular stations section - dynamic boundaries
    else if (current >= popularStationsStart && current <= popularStationsEnd) {
      const relIndex = current - popularStationsStart;
      const row = Math.floor(relIndex / 7);
      const col = relIndex % 7;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 2; // Jump to Search sidebar item
        }
      } else if (direction === 'RIGHT') {
        if (col < 6 && current < popularStationsEnd) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 7;
        } else {
          // Jump to genres above
          newIndex = genresStart + Math.min(col, genres.length - 1);
        }
      } else if (direction === 'DOWN') {
        const nextRow = current + 7;
        if (nextRow <= popularStationsEnd) {
          newIndex = nextRow;
        } else {
          // Jump to country stations - FIX: Check if stations are loaded
          if (displayedStations.length > 0) {
            // Calculate target column, clamped to available stations
            const targetCol = Math.min(col, displayedStations.length - 1);
            newIndex = countryStationsStart + targetCol;
          } else {
            // Stations not loaded yet - stay at first country station position
            newIndex = countryStationsStart;
          }
        }
      }
    }
    // Genres section - dynamic boundaries (horizontal scrolling)
    else if (current >= genresStart && current <= genresEnd) {
      const col = current - genresStart;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
          scrollGenreIntoView(col - 1);
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < genres.length - 1) {
          newIndex = current + 1;
          scrollGenreIntoView(col + 1);
        }
      } else if (direction === 'UP') {
        newIndex = 5; // Jump to country selector
      } else if (direction === 'DOWN') {
        // Jump to popular stations below
        newIndex = popularStationsStart + Math.min(col, Math.min(6, popularStations.length - 1));
      }
    }
    // Country stations section - SEGMENT-AWARE navigation (3 rows per segment)
    // When crossing segment boundary, focus jumps to first row of new segment
    else if (current >= countryStationsStart) {
      const relIndex = current - countryStationsStart;
      const row = Math.floor(relIndex / 7);
      const col = relIndex % 7;
      
      // Segment constants (must match SCROLL_CONFIG)
      const ROWS_PER_SEGMENT = 3;
      const COLUMNS = 7;
      
      // Current segment info
      const currentSegment = Math.floor(row / ROWS_PER_SEGMENT);
      const rowInSegment = row % ROWS_PER_SEGMENT; // 0, 1, or 2

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < 6 && current < totalItems - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (rowInSegment > 0) {
          // Within segment - normal navigation
          newIndex = current - COLUMNS;
        } else if (currentSegment > 0) {
          // At first row of segment - jump to first row of PREVIOUS segment (keep column)
          const prevSegmentFirstRow = (currentSegment - 1) * ROWS_PER_SEGMENT;
          const targetIndex = countryStationsStart + (prevSegmentFirstRow * COLUMNS) + col;
          // Clamp to valid range
          newIndex = Math.min(targetIndex, totalItems - 1);
        } else {
          // At first row of first segment - jump to popular stations above
          const targetCol = Math.min(col, 6);
          const lastRowStart = popularStationsEnd - (popularStations.length % 7 === 0 ? 6 : (popularStations.length % 7) - 1);
          newIndex = lastRowStart + targetCol;
          if (newIndex > popularStationsEnd) {
            newIndex = popularStationsEnd;
          }
        }
      } else if (direction === 'DOWN') {
        if (rowInSegment < ROWS_PER_SEGMENT - 1) {
          // Within segment - normal navigation (move down 1 row)
          const nextIndex = current + COLUMNS;
          if (nextIndex < totalItems) {
            newIndex = nextIndex;
          }
        } else {
          // At last row of segment (rowInSegment == 2) - jump to first row of NEXT segment
          const nextSegmentFirstRow = (currentSegment + 1) * ROWS_PER_SEGMENT;
          const targetIndex = countryStationsStart + (nextSegmentFirstRow * COLUMNS) + col;
          // Check if target exists
          if (targetIndex < totalItems) {
            // Clamp column if row is not full
            const stationsInNextSegment = displayedStations.length - (nextSegmentFirstRow * COLUMNS);
            if (stationsInNextSegment > 0) {
              const maxColInRow = Math.min(col, Math.min(COLUMNS - 1, stationsInNextSegment - 1));
              newIndex = countryStationsStart + (nextSegmentFirstRow * COLUMNS) + maxColInRow;
            }
          }
        }
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 0,
    onSelect: (index) => {
      // Sidebar navigation (0-4) - 5 items
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        setLocation(route);
      }
      // Country selector (5)
      else if (index === 5) {
        setIsCountrySelectorOpen(true);
      }
      // Popular stations - dynamic boundaries
      else if (index >= popularStationsStart && index <= popularStationsEnd) {
        const stationIndex = index - popularStationsStart;
        const station = popularStations[stationIndex];
        if (station) {
          // Save navigation state before navigating
          console.log('[DiscoverNoUser] Saving navigation state (Popular):', { currentPage: location, focusIndex: index });
          setNavigationState(location, index);
          playStation(station);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
      // Genres - dynamic boundaries
      else if (index >= genresStart && index <= genresEnd) {
        const genreIndex = index - genresStart;
        const genre = genres[genreIndex];
        if (genre) {
          setLocation(`/genre-list/${genre.slug}`);
        }
      }
      // Country stations - dynamic boundary
      else if (index >= countryStationsStart) {
        const stationIndex = index - countryStationsStart;
        const station = displayedStations[stationIndex];
        if (station) {
          // Save navigation state before navigating
          console.log('[DiscoverNoUser] Saving navigation state (Country):', { currentPage: location, focusIndex: index });
          setNavigationState(location, index);
          playStation(station);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => {
      // Show exit confirmation modal
      setIsExitModalOpen(true);
      setExitModalFocusIndex(0); // Focus on "Cancel" button
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/discover-no-user', (e) => {
    // Exit modal key handler (highest priority)
    if (isExitModalOpen) {
      const key = (window as any).tvKey;
      
      switch(e.keyCode) {
        case key?.LEFT:
        case 37:
          e.preventDefault();
          setExitModalFocusIndex(0); // Cancel button
          break;
        case key?.RIGHT:
        case 39:
          e.preventDefault();
          setExitModalFocusIndex(1); // Exit button
          break;
        case key?.ENTER:
        case 13:
          e.preventDefault();
          if (exitModalFocusIndex === 0) {
            // Cancel - close modal
            setIsExitModalOpen(false);
          } else {
            // Exit - actually close the app
            console.log('[DiscoverNoUser] Exit app via keyboard - calling tizen.application.getCurrentApplication().exit()');
            if (typeof window !== 'undefined' && (window as any).tizen) {
              try {
                (window as any).tizen.application.getCurrentApplication().exit();
              } catch (err) {
                console.error('[DiscoverNoUser] Failed to exit via Tizen API:', err);
                window.close();
              }
            } else {
              window.close();
            }
          }
          break;
        case key?.RETURN:
        case 461:
        case 10009:
          e.preventDefault();
          // Back button also cancels the exit modal
          setIsExitModalOpen(false);
          break;
      }
      return; // Consume event
    }

    // Ignore all key events when country selector modal is open
    if (isCountrySelectorOpen) {
      console.log('[DiscoverNoUser] Key event ignored - country selector modal is open');
      return;
    }

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
        console.log('[DiscoverNoUser] ENTER key pressed - calling handleSelect()');
        handleSelect();
        break;
      case key?.PAGE_DOWN:
      case 34:
      case key?.PAGE_UP:
      case 33:
      case 427: // CH_UP - Samsung TV remote
      case 428: // CH_DOWN - Samsung TV remote
        // Jump to global player controls if visible
        e.preventDefault();
        {
          const globalPlayerButton = document.querySelector('[data-testid="button-global-play-pause"]') as HTMLElement;
          if (globalPlayerButton) {
            globalPlayerButton.focus();
            console.log('[DiscoverNoUser] PAGE_UP/PAGE_DOWN/CH_UP/CH_DOWN - jumped to global player');
          } else {
            console.log('[DiscoverNoUser] PAGE_UP/PAGE_DOWN/CH_UP/CH_DOWN - global player not visible');
          }
        }
        break;
      case key?.RETURN:
      case 461:
      case 10009:
        console.log('[DiscoverNoUser] 🔙 BACK/RETURN key pressed - should show exit modal');
        console.log('[DiscoverNoUser] Current modal state - isExitModalOpen:', isExitModalOpen);
        e.preventDefault();
        handleBack();
        console.log('[DiscoverNoUser] ✅ handleBack() called to trigger exit modal');
        break;
    }
  });

  // Initialize country stations when initial data is loaded or country changes
  useEffect(() => {
    if (initialStationsData?.stations) {
      const stations = initialStationsData.stations;
      console.log(`[DiscoverNoUser] Country changed: ${selectedCountry}, initial fetch: ${stations.length} stations`);
      setDisplayedStations(stations);
      setCurrentOffset(100); // Next fetch will use offset=100
      
      // If we got less than 100 stations, there's no more to load
      const hasMore = stations.length >= 100;
      setHasMoreCountryStations(hasMore);
      console.log(`[DiscoverNoUser] Initial load: ${stations.length} stations, hasMore=${hasMore}, nextOffset=100`);
    }
  }, [initialStationsData, selectedCountryCode]);

  // Restore focus when returning from RadioPlaying
  useEffect(() => {
    const navState = popNavigationState(); // Pop and clear in one atomic operation
    if (navState && navState.returnFocusIndex !== null) {
      // Restore focus when returning from RadioPlaying
      console.log('[DiscoverNoUser] 🎯 Restoring focus to index:', navState.returnFocusIndex);
      setFocusIndex(navState.returnFocusIndex);
    }
  }, []); // Only run once on mount

  // Auto-play on app startup based on settings
  useEffect(() => {
    const handleAutoPlay = async () => {
      if (!autoPlayService.shouldAutoPlay()) {
        console.log('[AutoPlay] Skipping auto-play (already played this session)');
        return;
      }

      const playMode = autoPlayService.getPlayAtStartMode();
      console.log(`[AutoPlay] Play at start mode: ${playMode}`);

      if (playMode === "none") {
        console.log('[AutoPlay] Play at start is disabled');
        return;
      }

      const stationToPlay = await autoPlayService.getStationToPlay(playMode, selectedCountryCode);
      
      if (stationToPlay) {
        console.log('[AutoPlay] Auto-playing station:', stationToPlay.name);
        playStation(stationToPlay);
        setLocation(`/radio-playing?station=${stationToPlay._id}`);
      } else {
        console.log('[AutoPlay] No station found to auto-play');
      }
    };

    const timer = setTimeout(() => {
      handleAutoPlay();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // TRUE INFINITE SCROLL - Fetch next batch from API using offset
  // LG TV Performance: Use COUNTRY_BATCH_SIZE (60) for smoother loading
  const loadMoreCountryStations = async () => {
    if (isLoadingMore || !hasMoreCountryStations) {
      return;
    }

    setIsLoadingMore(true);
    
    try {
      const result = selectedCountryCode === 'GLOBAL'
        ? await megaRadioApi.getWorkingStations({ 
            limit: COUNTRY_BATCH_SIZE, 
            offset: currentOffset 
          })
        : await megaRadioApi.getWorkingStations({ 
            limit: COUNTRY_BATCH_SIZE, 
            country: selectedCountryCode, 
            offset: currentOffset 
          });
      
      const newStations = result.stations || [];
      
      if (newStations.length > 0) {
        setDisplayedStations(prev => [...prev, ...newStations]);
        setCurrentOffset(prev => prev + COUNTRY_BATCH_SIZE);
        
        // If we got less than batch size, we've reached the end
        const hasMore = newStations.length >= COUNTRY_BATCH_SIZE;
        setHasMoreCountryStations(hasMore);
      } else {
        setHasMoreCountryStations(false);
      }
    } catch (error) {
      console.error('[DiscoverNoUser] Failed to fetch more stations:', error);
      setHasMoreCountryStations(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Auto-hide header on scroll down + TRUE INFINITE SCROLL trigger (scroll-based)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } 
      else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      
      lastScrollY.current = currentScrollY;

      const scrollHeight = scrollContainer.scrollHeight;
      const scrollTop = scrollContainer.scrollTop;
      const clientHeight = scrollContainer.clientHeight;
      
      // Trigger load when within 1000px of bottom
      if (scrollHeight - scrollTop - clientHeight < 1000 && hasMoreCountryStations && !isLoadingMore) {
        loadMoreCountryStations();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMoreCountryStations, currentOffset]);

  // TRUE INFINITE SCROLL trigger - Focus-based (when within last 14 items / 2 rows)
  useEffect(() => {
    // Only trigger for country stations section
    if (focusIndex >= countryStationsStart) {
      const stationIndex = focusIndex - countryStationsStart;
      const distanceFromEnd = displayedStations.length - stationIndex;
      
      // If user is within last 14 items (2 rows × 7 columns), load more
      if (distanceFromEnd <= 14 && hasMoreCountryStations && !isLoadingMore) {
        loadMoreCountryStations();
      }
    }
  }, [focusIndex, countryStationsStart, displayedStations.length, hasMoreCountryStations, isLoadingMore]);

  // ============================================================================
  // OPTIMIZED TV SCROLL CONTROLLER
  // - Uses 3-row segments for chunk scrolling
  // - requestAnimationFrame for jank-free updates
  // - Pre-computed offsets (no DOM queries per keypress)
  // - Section-aware transitions
  // ============================================================================
  
  // Fixed layout constants (pre-computed, no DOM queries needed)
  // CRITICAL: These values MUST align perfectly to show exactly 3 rows with NO partial rows
  // Measured from actual rendered DOM: card=240px + padding/margin=40px + gap=16px = 296px per row
  const SCROLL_CONFIG = useMemo(() => ({
    ROW_HEIGHT: 296,           // Actual card footprint: 240px card + 40px padding + 16px gap
    HEADER_HEIGHT: 242,        // Top section: logo + genres + "Popular" header  
    POPULAR_HEIGHT: 592,       // Popular stations: 2 rows × 296 = 592
    COUNTRY_HEADER: 80,        // "More From X" header height
    ROWS_PER_SEGMENT: 3,       // Scroll 3 rows at a time
    COLUMNS: 7,                // Items per row
    VISIBLE_AREA: 920,         // 3 rows (888px) + 32px buffer for card shadow/border
  }), []);
  
  // Track current scroll segment to avoid unnecessary updates
  const scrollStateRef = useRef({
    currentSegment: 0,
    lastSection: 'genres' as 'genres' | 'popular' | 'country',
    pendingFrame: null as number | null,
  });
  
  // Memoized scroll position calculator
  // Key insight: Each segment shows EXACTLY 3 rows, aligned to ROW_HEIGHT boundaries
  // CRITICAL RULE: Headers must NEVER be clipped/cut off from top of screen
  const getScrollTarget = useCallback((section: string, rowInSection: number) => {
    const { ROW_HEIGHT, HEADER_HEIGHT, POPULAR_HEIGHT, ROWS_PER_SEGMENT } = SCROLL_CONFIG;
    
    if (section === 'genres') {
      return 0;
    }
    
    if (section === 'popular') {
      // Popular section: first segment (rows 0-2) is already visible in viewport
      // ALWAYS return 0 for popular - it's visible on initial load
      return 0;
    }
    
    if (section === 'country') {
      // Segment-based offset: each segment = 3 rows
      const segment = Math.floor(rowInSection / ROWS_PER_SEGMENT);
      const segmentOffset = segment * ROWS_PER_SEGMENT * ROW_HEIGHT;
      
      // Country section base: scroll WITHIN the scroll container (not including external header)
      // Genres section: ~130px, Popular header: ~50px, Popular Stations (2 rows): 592px
      // CRITICAL RULE: Popular Stations must be COMPLETELY hidden, first country row FULLY visible
      // No buffer - scroll just enough to hide popular cards completely
      // Total: ~130 (genres) + 50 (popular header) + 592 (popular cards) = ~772px
      const countryBase = 772;
      return countryBase + segmentOffset;
    }
    
    return 0;
  }, [SCROLL_CONFIG]);
  
  // SEGMENT-BASED SCROLL - Only scrolls when segment boundary is crossed
  // Within a segment (3 rows), navigation moves focus but does NOT scroll
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const { COLUMNS, ROWS_PER_SEGMENT } = SCROLL_CONFIG;
    const scrollContainer = scrollContainerRef.current;
    const state = scrollStateRef.current;
    
    // Determine current section and row
    let section: 'genres' | 'popular' | 'country';
    let rowInSection: number;
    
    if (focusIndex >= genresStart && focusIndex <= genresEnd) {
      section = 'genres';
      rowInSection = 0;
    } else if (focusIndex >= popularStationsStart && focusIndex <= popularStationsEnd) {
      section = 'popular';
      rowInSection = Math.floor((focusIndex - popularStationsStart) / COLUMNS);
    } else if (focusIndex >= countryStationsStart) {
      section = 'country';
      rowInSection = Math.floor((focusIndex - countryStationsStart) / COLUMNS);
    } else {
      return; // Unknown section
    }
    
    // LOCK: Popular section ALWAYS stays at scroll 0 (no scrolling)
    if (section === 'popular' || section === 'genres') {
      state.lastSection = section;
      state.currentSegment = 0;
      // Cancel any pending scroll RAF
      if (state.pendingFrame) {
        cancelAnimationFrame(state.pendingFrame);
        state.pendingFrame = null;
      }
      // Force scroll to 0 - simple synchronous lock
      scrollContainer.scrollTop = 0;
      return;
    }
    
    // Calculate current segment (0, 1, 2, ... where each segment = 3 rows)
    const currentSegment = Math.floor(rowInSection / ROWS_PER_SEGMENT);
    
    // Calculate target scroll position FIRST to check if it would cause unwanted scroll
    const targetScroll = getScrollTarget(section, rowInSection);
    
    // Check if we need to scroll (section changed or segment changed)
    const sectionChanged = section !== state.lastSection;
    const segmentChanged = currentSegment !== state.currentSegment;
    
    if (!sectionChanged && !segmentChanged) {
      // No scroll needed - focus is within visible 3-row segment
      return;
    }
    
    // Update state
    state.lastSection = section;
    state.currentSegment = currentSegment;
    
    // Cancel any pending animation frame
    if (state.pendingFrame) {
      cancelAnimationFrame(state.pendingFrame);
    }
    
    // Use requestAnimationFrame for smooth, jank-free scroll update
    state.pendingFrame = requestAnimationFrame(() => {
      scrollContainer.scrollTop = targetScroll;
      state.pendingFrame = null;
    });
    
    // Cleanup
    return () => {
      if (state.pendingFrame) {
        cancelAnimationFrame(state.pendingFrame);
        state.pendingFrame = null;
      }
    };
  }, [focusIndex, genresStart, genresEnd, popularStationsStart, popularStationsEnd, countryStationsStart, SCROLL_CONFIG, getScrollTarget]);

  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  const getStationImage = (station: Station) => {
    // Check for null, undefined, empty string, or the string "null"
    if (station.favicon && station.favicon !== 'null' && station.favicon.trim() !== '') {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  const getStationTags = (station: Station): string[] => {
    if (!station.tags) return [];
    if (Array.isArray(station.tags)) return station.tags;
    return station.tags.split(',').map(tag => tag.trim());
  };

  const getStationCategory = (station: Station): string => {
    const tags = getStationTags(station);
    if (tags.length > 0) return tags[0];
    return station.country || 'Radio';
  };

  const stationRow1Positions = [236, 466, 696, 926, 1156, 1386, 1616];
  const stationRow2Positions = [236, 466, 696, 926, 1156, 1386, 1616];

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-discover-no-user">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px] z-0">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[0.88%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[48.611%] top-0 w-[1920px] z-0" />

      {/* Logo - ALWAYS VISIBLE, NEVER HIDES */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50 pointer-events-auto">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>

      {/* Header Controls Section - Auto-hides on scroll down (Equalizer, Country, Login) */}
      <div 
        className="absolute top-0 left-0 w-[1920px] h-[242px] z-50 pointer-events-none transition-transform duration-300 ease-in-out"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        {/* Equalizer - Matching Global Player Animation */}
        <div className={`absolute left-[1765px] overflow-clip rounded-[30px] size-[51px] top-[67px] pointer-events-auto transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
          <div className="absolute h-[35.526px] left-[8.625px] overflow-clip top-[7.737px] w-[33.75px]">
            <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[8.882px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[35.526px]'}`} style={{ height: isPlaying ? undefined : '35.526px' }} />
            <div className={`absolute bg-white left-[12.43px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[24.868px] top-[10.66px]'}`} style={{ height: isPlaying ? undefined : '24.868px', top: isPlaying ? undefined : '10.66px' }} />
            <div className={`absolute bg-white left-[24.87px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[30.197px] top-[5.33px]'}`} style={{ height: isPlaying ? undefined : '30.197px', top: isPlaying ? undefined : '5.33px' }} />
          </div>
        </div>

        {/* Country Selector */}
        <CountryTrigger
          selectedCountry={selectedCountry}
          selectedCountryCode={selectedCountryCode}
          onClick={() => setIsCountrySelectorOpen(true)}
          focusClasses={getFocusClasses(isFocused(5))}
          className="absolute left-[1593px] top-[67px] pointer-events-auto"
        />
      </div>

      {/* Fixed Left Sidebar */}
      <Sidebar activePage="discover" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Scrollable Content Area - Moves to top when header hides */}
      {/* STRUCTURE: Outer wrapper (overflow-hidden) clips view, inner div scrolls via JS */}
      <div 
        ref={scrollContainerRef}
        className="absolute left-[162px] w-[1758px] overflow-y-scroll overflow-x-hidden z-1 scrollbar-hide"
        style={{
          top: showHeader ? '242px' : '64px',
          height: showHeader ? '920px' : '1048px', // 3 rows (888px) + 32px buffer for card shadow/border
          willChange: 'scroll-position',
          contain: 'layout style',
          scrollBehavior: 'auto', // Instant scroll, no smooth
        }}
      >
        <div 
          className="relative pb-[100px]"
          style={{
            minHeight: `${1013 + (Math.ceil(displayedStations.length / 7) * 294) + 364}px`
          }}
        >
        {/* Popular Genres Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[74px] not-italic text-[32px] text-white top-0">
          {selectedCountryCode === 'GLOBAL' 
            ? `${t('popular_genres')} (Global)` 
            : t('popular_genres')}
        </p>

        {/* Genre Pills - Horizontal Scrollable */}
        <div 
          ref={genreScrollRef}
          className="absolute left-[74px] top-[59px] w-[1580px] overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth"
          data-genre-container
        >
          <div className="flex py-[15px] px-[10px]" style={{ gap: '20px' }}>
            {genres.map((genre, index) => {
              const focusIdx = genresStart + index;
              return (
                <Link 
                  key={`${genre.slug}-${index}`} 
                  href={`/genre-list/${genre.slug}`}
                  style={{ marginRight: '20px', display: 'inline-block', flexShrink: 0 }}
                >
                  <div 
                    className={`relative bg-[rgba(255,255,255,0.14)] flex gap-[10px] items-center px-[72px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                    data-testid={genre.slug}
                    data-genre-pill
                    style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
                  >
                    <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-center text-white whitespace-nowrap">
                      {genre.name}
                    </p>
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[20px]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Radios Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[74px] not-italic text-[32px] text-white top-[223px]">
          {selectedCountryCode === 'GLOBAL' 
            ? `${t('homepage_popular_stations')} (Global)` 
            : t('homepage_popular_stations')}
        </p>

        {/* Popular Radio Station Cards - Row 1 */}
        {popularStations.slice(0, 7).map((station, index) => {
          const focusIdx = popularStationsStart + index;
          return (
            <Link 
              key={station._id || index} 
              href={`/radio-playing?station=${station._id}`}
              onClick={() => {
                console.log('[DiscoverNoUser] Link clicked (Popular Row 1):', { currentPage: location, focusIndex: focusIdx });
                setNavigationState(location, focusIdx);
                playStation(station);
              }}
            >
              <div 
                className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[297px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                style={{ left: `${stationRow1Positions[index] - 162}px` }}
                data-testid={`card-station-${station._id}`}
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

        {/* Popular Radio Station Cards - Row 2 */}
        {popularStations.slice(7, 14).map((station, index) => {
          const focusIdx = popularStationsStart + 7 + index;
          return (
            <Link 
              key={station._id || index} 
              href={`/radio-playing?station=${station._id}`}
              onClick={() => {
                console.log('[DiscoverNoUser] Link clicked (Popular Row 2):', { currentPage: location, focusIndex: focusIdx });
                setNavigationState(location, focusIdx);
                playStation(station);
              }}
            >
              <div 
                className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[591px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                style={{ left: `${stationRow2Positions[index] - 162}px` }}
                data-testid={`card-station-${station._id}`}
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

        {/* More From [Country] Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[74px] not-italic text-[32px] text-white top-[939px]">
          {t('more_from')} {selectedCountry}
        </p>

        {/* Country Stations - Dynamic Rows with Infinite Scroll */}
        {displayedStations.map((station, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const positions = [236, 466, 696, 926, 1156, 1386, 1616];
          const topPosition = 1013 + (row * 294);
          const focusIdx = countryStationsStart + index;
          
          return (
            <Link 
              key={station._id || index} 
              href={`/radio-playing?station=${station._id}`}
              onClick={() => {
                console.log('[DiscoverNoUser] Link clicked (Country Station):', { currentPage: location, focusIndex: focusIdx });
                setNavigationState(location, focusIdx);
                playStation(station);
              }}
            >
              <div 
                className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                style={{ 
                  left: `${positions[col] - 162}px`,
                  top: `${topPosition}px`
                }}
                data-testid={`card-station-${station._id}`}
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
            className="absolute left-[860px] text-white font-['Ubuntu',Helvetica] text-[20px]"
            style={{ top: `${1013 + (Math.ceil(displayedStations.length / 7) * 294) + 20}px` }}
          >
            {t('loading_more_stations') || 'Loading more stations...'}
          </div>
        )}

        {/* No More Stations Message */}
        {!hasMoreCountryStations && displayedStations.length > 0 && (
          <div 
            className="absolute left-[780px] text-white/50 font-['Ubuntu',Helvetica] text-[18px]"
            style={{ top: `${1013 + (Math.ceil(displayedStations.length / 7) * 294) + 20}px` }}
          >
            ✓ All {displayedStations.length} stations from {selectedCountry} loaded
          </div>
        )}
        </div>
      </div>

      {/* Country Selector Modal */}
      <CountrySelector
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          console.log('[DiscoverNoUser] Country selected:', country.name, 'Code:', country.code);
          setCountry(country.name, country.code, country.flag);
        }}
      />

      {/* Exit Confirmation Modal - Centered like Country Selector */}
      {isExitModalOpen && (
        <div className="absolute top-0 left-0 w-[1920px] h-[1080px] z-[100]">
          {/* Backdrop */}
          <div className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-black/80 backdrop-blur-[7px]" />
          
          {/* Modal Container - Centered */}
          <div 
            className="absolute bg-[#1a1a1a] rounded-[20px] border-2 border-[rgba(255,255,255,0.1)]"
            style={{ left: '660px', top: '340px', width: '600px', height: '400px' }}
            data-testid="modal-exit-confirmation"
          >
            {/* Title */}
            <div className="absolute top-[50px] left-[50px] right-[50px]">
              <h2 className="font-['Ubuntu',Helvetica] font-bold text-[36px] text-white text-center">
                {t('exit_app') || 'Exit App?'}
              </h2>
            </div>
            
            {/* Message */}
            <div className="absolute top-[130px] left-[50px] right-[50px]">
              <p className="font-['Ubuntu',Helvetica] font-normal text-[24px] text-white/70 text-center">
                {t('are_you_sure_exit') || 'Are you sure you want to exit MegaRadio?'}
              </p>
            </div>
            
            {/* Buttons */}
            <div className="absolute bottom-[50px] left-[50px] right-[50px] flex gap-6 justify-center">
              {/* Cancel Button */}
              <button
                className={`px-12 py-4 rounded-[30px] font-['Ubuntu',Helvetica] font-bold text-[24px] transition-all ${
                  exitModalFocusIndex === 0
                    ? 'bg-white text-black border-4 border-[#ff4199]'
                    : 'bg-[rgba(255,255,255,0.1)] text-white border-2 border-[rgba(255,255,255,0.2)]'
                }`}
                onClick={() => setIsExitModalOpen(false)}
                data-testid="button-exit-cancel"
              >
                {t('cancel') || 'Cancel'}
              </button>
              
              {/* Exit Button */}
              <button
                className={`px-12 py-4 rounded-[30px] font-['Ubuntu',Helvetica] font-bold text-[24px] transition-all ${
                  exitModalFocusIndex === 1
                    ? 'bg-[#ff4199] text-white border-4 border-[#ff4199]'
                    : 'bg-[rgba(255,65,153,0.3)] text-white border-2 border-[rgba(255,65,153,0.5)]'
                }`}
                onClick={() => {
                  console.log('[DiscoverNoUser] Exit app - calling tizen.application.getCurrentApplication().exit()');
                  if (typeof window !== 'undefined' && (window as any).tizen) {
                    try {
                      (window as any).tizen.application.getCurrentApplication().exit();
                    } catch (e) {
                      console.error('[DiscoverNoUser] Failed to exit via Tizen API:', e);
                      window.close();
                    }
                  } else {
                    window.close();
                  }
                }}
                data-testid="button-exit-confirm"
              >
                {t('exit') || 'Exit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
