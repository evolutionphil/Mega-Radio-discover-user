import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useLocalization } from "@/contexts/LocalizationContext";

// Asset path helper
function getAssetPath(path: string) {
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

export const RadioPlaying = (): JSX.Element => {
  useTVNavigation();
  const [location] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  const { t, detectedCountryCode } = useLocalization();
  
  // Station history for Previous button (stores station IDs)
  const stationHistoryRef = useRef<string[]>([]);
  const isNavigatingBackRef = useRef(false);
  
  // Force update trigger for station changes
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Auto-hide header state
  const [showHeader, setShowHeader] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  
  // Country selector state (same as DiscoverNoUser)
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [selectedCountryCode, setSelectedCountryCode] = useState("US");
  const selectedCountryFlag = `https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png`;
  
  // Infinite scroll state for similar stations
  const [allSimilarStations, setAllSimilarStations] = useState<Station[]>([]);
  const [isLoadingMoreSimilar, setIsLoadingMoreSimilar] = useState(false);
  const [hasMoreSimilar, setHasMoreSimilar] = useState(true);
  const [similarStationsPage, setSimilarStationsPage] = useState(1);
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const SIMILAR_STATIONS_PER_LOAD = 40;

  // Infinite scroll state for popular stations
  const [allPopularStations, setAllPopularStations] = useState<Station[]>([]);
  const [displayedPopularStations, setDisplayedPopularStations] = useState<Station[]>([]);
  const [isLoadingMorePopular, setIsLoadingMorePopular] = useState(false);
  const [hasMorePopular, setHasMorePopular] = useState(true);
  const [popularStationsPage, setPopularStationsPage] = useState(1);
  const POPULAR_STATIONS_PER_LOAD = 21; // 3 rows of 7
  
  // Parse station ID from URL query params
  const stationId = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('station');
    console.log('[RadioPlaying] URL changed, parsing station ID:', id);
    return id;
  }, [location, updateTrigger]);
  
  // Track station history when station ID changes
  useEffect(() => {
    if (stationId && !isNavigatingBackRef.current) {
      const lastStation = stationHistoryRef.current[stationHistoryRef.current.length - 1];
      if (lastStation !== stationId) {
        stationHistoryRef.current.push(stationId);
        console.log('[RadioPlaying] Station history updated:', stationHistoryRef.current);
      }
    }
    isNavigatingBackRef.current = false;
  }, [stationId]);

  // Fallback image
  const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#01d7fb"/><text x="100" y="120" font-size="80" fill="white" text-anchor="middle" font-family="Arial">R</text></svg>')}`;

  const getStationImage = (station: Station) => {
    if (station.favicon) {
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

  // Fetch station details
  const { data: stationData, isLoading: isLoadingStation } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => megaRadioApi.getStationById(stationId!),
    enabled: !!stationId,
  });

  const station = stationData?.station;

  // Fetch station metadata
  const { data: metadataData } = useQuery({
    queryKey: ['metadata', stationId],
    queryFn: () => megaRadioApi.getStationMetadata(stationId!),
    enabled: !!stationId,
    refetchInterval: 30000,
  });

  const metadata = metadataData?.metadata;

  // Fetch ALL similar stations from same country (client-side pagination)
  const [allLoadedStations, setAllLoadedStations] = useState<Station[]>([]);
  
  const { data: initialSimilarData } = useQuery({
    queryKey: ['similar-all', stationId, station?.countrycode || station?.country],
    queryFn: async () => {
      if (!station) return { stations: [] };
      const countryCode = station.countrycode || station.country;
      if (countryCode) {
        // Fetch a large batch for client-side pagination (200 stations)
        return megaRadioApi.getWorkingStations({ 
          limit: 200, 
          country: countryCode 
        });
      }
      return megaRadioApi.getSimilarStations(stationId!, 200);
    },
    enabled: !!stationId && !!station,
  });

  // Initialize when data loads - show first 40 stations
  useEffect(() => {
    if (initialSimilarData?.stations) {
      setAllLoadedStations(initialSimilarData.stations);
      // Display first batch (40 stations)
      setAllSimilarStations(initialSimilarData.stations.slice(0, SIMILAR_STATIONS_PER_LOAD));
      setHasMoreSimilar(initialSimilarData.stations.length > SIMILAR_STATIONS_PER_LOAD);
      setSimilarStationsPage(1);
    }
  }, [initialSimilarData]);

  // Reset pagination when station changes
  useEffect(() => {
    setSimilarStationsPage(1);
    setHasMoreSimilar(true);
    setAllSimilarStations([]);
    setAllLoadedStations([]);
  }, [stationId]);

  // Load more popular stations - client-side pagination (useCallback to avoid stale closures)
  const loadMorePopular = useCallback(() => {
    if (isLoadingMorePopular || !hasMorePopular) return;
    
    setIsLoadingMorePopular(true);
    
    // Simulate async for smooth UX
    setTimeout(() => {
      setPopularStationsPage(prevPage => {
        const nextPage = prevPage + 1;
        const startIdx = prevPage * POPULAR_STATIONS_PER_LOAD;
        const endIdx = startIdx + POPULAR_STATIONS_PER_LOAD;
        
        const nextBatch = allPopularStations.slice(startIdx, endIdx);
        
        if (nextBatch.length > 0) {
          setDisplayedPopularStations(prev => [...prev, ...nextBatch]);
          setHasMorePopular(endIdx < allPopularStations.length);
          console.log(`[RadioPlaying] Loaded popular page ${nextPage}, showing ${endIdx}/${allPopularStations.length} stations`);
        } else {
          setHasMorePopular(false);
          console.log('[RadioPlaying] No more popular stations to load');
        }
        
        setIsLoadingMorePopular(false);
        return nextPage;
      });
    }, 100);
  }, [isLoadingMorePopular, hasMorePopular, allPopularStations, POPULAR_STATIONS_PER_LOAD]);

  // Auto-hide header on scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      
      // Auto-hide header logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } 
      else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to top when focus moves to top elements (player controls, sidebar)
  useEffect(() => {
    // Wait for scroll container to be available
    if (!scrollContainerRef.current) {
      console.log('[RadioPlaying] Scroll container not ready, waiting...');
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    console.log('[RadioPlaying] Auto-scroll monitor started');
    let lastFocusedTestId = '';

    const checkAndScrollToTop = () => {
      // Get the currently focused element using tv-focused class
      const focusedElement = document.querySelector('.tv-focused');
      
      if (!focusedElement) return;
      
      const testId = focusedElement.getAttribute('data-testid') || '';
      
      // Only act if focus changed
      if (testId === lastFocusedTestId) return;
      lastFocusedTestId = testId;
      
      console.log('[RadioPlaying] Focus changed to:', testId, 'Scroll position:', scrollContainer.scrollTop);
      
      // List of top elements that should trigger scroll to top
      const topElementTestIds = [
        'button-discover', 'button-genres', 'button-search', 
        'button-favorites', 'button-records', 'button-settings',
        'button-country-selector', 'button-login-header',
        'button-previous', 'button-play-pause', 'button-next', 'button-favorite'
      ];
      
      const isTopElement = topElementTestIds.some(id => testId === id);
      const isSimilarRadioCard = testId.startsWith('card-similar-');
      
      // Scroll to top for player controls, sidebar buttons, AND similar radio cards
      if ((isTopElement || isSimilarRadioCard) && scrollContainer.scrollTop > 50) {
        console.log('[RadioPlaying] Scrolling to top for element:', testId);
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        setShowHeader(true);
      }
      
      // Auto-load more popular stations when focusing on last row
      // Use closest() to check parent elements too
      const lastRowElement = focusedElement.closest('[data-is-last-row="true"]');
      const isLastRowCard = lastRowElement !== null;
      
      if (isLastRowCard && hasMorePopular && !isLoadingMorePopular) {
        console.log('[RadioPlaying] ⚡ TRIGGERING LAZY LOAD - loading more popular stations');
        loadMorePopular();
      }
    };

    // Check on interval (TV navigation doesn't emit standard events)
    const intervalId = setInterval(checkAndScrollToTop, 200);
    
    return () => {
      console.log('[RadioPlaying] Auto-scroll monitor stopped');
      clearInterval(intervalId);
    };
  }, [hasMorePopular, isLoadingMorePopular, loadMorePopular]); // Include dependencies for lazy load

  // Load more similar stations - client-side pagination from pre-loaded data
  const loadMoreSimilar = async () => {
    if (isLoadingMoreSimilar || !hasMoreSimilar) return;
    
    setIsLoadingMoreSimilar(true);
    
    // Simulate async for smooth UX
    setTimeout(() => {
      const nextPage = similarStationsPage + 1;
      // Fix: use current page to calculate start index (page 1 already showed 0-39, so page 2 should start at 40)
      const startIdx = similarStationsPage * SIMILAR_STATIONS_PER_LOAD;
      const endIdx = startIdx + SIMILAR_STATIONS_PER_LOAD;
      
      const nextBatch = allLoadedStations.slice(startIdx, endIdx);
      
      if (nextBatch.length > 0) {
        setAllSimilarStations(prev => [...prev, ...nextBatch]);
        setSimilarStationsPage(nextPage);
        setHasMoreSimilar(endIdx < allLoadedStations.length);
        console.log(`[RadioPlaying] Loaded page ${nextPage}, showing ${allSimilarStations.length + nextBatch.length}/${allLoadedStations.length} stations`);
      } else {
        setHasMoreSimilar(false);
        console.log('[RadioPlaying] No more stations to load');
      }
      
      setIsLoadingMoreSimilar(false);
    }, 100);
  };

  // Scroll detection for infinite scroll
  useEffect(() => {
    const scrollContainer = similarScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const scrolledToEnd = scrollLeft + clientWidth >= scrollWidth - 200;
      
      if (scrolledToEnd && hasMoreSimilar && !isLoadingMoreSimilar) {
        loadMoreSimilar();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMoreSimilar, isLoadingMoreSimilar, station]);

  // Fetch popular stations (large batch for client-side pagination)
  const { data: popularStationsData } = useQuery({
    queryKey: ['popular-stations-all', selectedCountryCode],
    queryFn: () => megaRadioApi.getPopularStations({ 
      limit: 200,
      country: selectedCountryCode 
    }),
  });

  // Initialize popular stations when data loads
  useEffect(() => {
    if (popularStationsData?.stations) {
      setAllPopularStations(popularStationsData.stations);
      // Display first batch (21 stations = 3 rows of 7)
      setDisplayedPopularStations(popularStationsData.stations.slice(0, POPULAR_STATIONS_PER_LOAD));
      setHasMorePopular(popularStationsData.stations.length > POPULAR_STATIONS_PER_LOAD);
      setPopularStationsPage(1);
    }
  }, [popularStationsData]);

  const similarStations = allSimilarStations || [];
  const popularStations = displayedPopularStations || [];

  // Initialize TV audio player
  useEffect(() => {
    if (typeof (window as any).TVAudioPlayer !== 'undefined') {
      audioPlayerRef.current = new (window as any).TVAudioPlayer('tv-audio-container');
      
      audioPlayerRef.current.onPlay = () => {
        setIsPlaying(true);
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onPause = () => {
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onStop = () => {
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onBuffering = () => {
        setIsBuffering(true);
      };
      
      audioPlayerRef.current.onReady = () => {
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onError = (error: any) => {
        console.error('[RadioPlaying] Audio error:', error);
        setIsBuffering(false);
      };
      
      return () => {
        if (audioPlayerRef.current) {
          try {
            audioPlayerRef.current.stop();
          } catch (err) {
            // Ignore cleanup errors
            console.log('[RadioPlaying] Audio cleanup completed');
          }
        }
      };
    }
  }, []);

  // Auto-play when station loads
  useEffect(() => {
    if (station && station.url && audioPlayerRef.current) {
      const playUrl = station.url_resolved || station.url;
      console.log('[RadioPlaying] Auto-playing station:', station.name, 'URL:', playUrl);
      audioPlayerRef.current.play(playUrl);
    }
  }, [station]);

  // Auto-focus play/pause button when station loads
  useEffect(() => {
    if (station && window.tvSpatialNav) {
      // Wait a moment for DOM to render
      setTimeout(() => {
        const playPauseButton = document.querySelector('[data-testid="button-play-pause"]') as HTMLElement;
        if (playPauseButton && window.tvSpatialNav) {
          console.log('[RadioPlaying] Auto-focusing play/pause button');
          window.tvSpatialNav.focus(playPauseButton);
        }
      }, 300);
    }
  }, [station]);

  const handlePlayPause = () => {
    if (!audioPlayerRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      if (station && station.url) {
        const playUrl = station.url_resolved || station.url;
        audioPlayerRef.current.play(playUrl);
      }
    }
  };

  const handlePrevious = () => {
    if (stationHistoryRef.current.length <= 1) {
      console.log('[RadioPlaying] No previous station in history');
      return;
    }
    
    stationHistoryRef.current.pop();
    const previousStationId = stationHistoryRef.current[stationHistoryRef.current.length - 1];
    isNavigatingBackRef.current = true;
    
    console.log('[RadioPlaying] Going to previous station:', previousStationId);
    const newUrl = `${window.location.pathname}?station=${previousStationId}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setUpdateTrigger(prev => prev + 1);
  };

  const handleNext = () => {
    if (similarStations.length === 0) {
      console.log('[RadioPlaying] No similar stations available');
      return;
    }
    
    const nextStation = similarStations[0];
    console.log('[RadioPlaying] Going to next station:', nextStation.name, nextStation._id);
    const newUrl = `${window.location.pathname}?station=${nextStation._id}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setUpdateTrigger(prev => prev + 1);
  };

  const navigateToStation = (targetStation: Station) => {
    console.log('[RadioPlaying] Navigating to station:', targetStation.name, targetStation._id);
    const newUrl = `${window.location.pathname}?station=${targetStation._id}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setUpdateTrigger(prev => prev + 1);
  };

  if (!station) {
    return (
      <div className="fixed inset-0 w-[1920px] h-[1080px] bg-gradient-to-br from-[#1a0e2e] via-[#0e0e1e] to-[#0e0e0e] flex items-center justify-center">
        <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-white">Loading...</p>
      </div>
    );
  }

  const stationTags = getStationTags(station);
  const codec = station.codec || 'MP3';
  const bitrate = station.bitrate ? `${station.bitrate}kb` : '128kb';
  const countryCode = station.countrycode || station.countryCode || 'XX';

  return (
    <div className="fixed inset-0 w-[1920px] h-[1080px] bg-gradient-to-br from-[#1a0e2e] via-[#0e0e1e] to-[#0e0e0e] overflow-hidden">
      {/* Hidden audio container */}
      <div id="tv-audio-container" style={{ display: 'none' }} />

      {/* Fixed Logo */}
      <div className="fixed left-[31px] top-[64px] h-[57px] w-[164.421px] z-50">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] leading-normal text-white whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute left-0 top-0 bottom-[2.84%] right-[65.2%]">
          <svg viewBox="0 0 57 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M22.6604 0L0 27.5L22.6604 55L45.3208 27.5L22.6604 0Z" fill="#FF4199"/>
            <path d="M34.0189 0L11.3585 27.5L34.0189 55L56.6792 27.5L34.0189 0Z" fill="#01D7FB"/>
          </svg>
        </div>
      </div>

      {/* Auto-hiding Header Controls (Equalizer, Country, Login) - Exact from DiscoverNoUser */}
      <div 
        className="fixed top-0 left-0 w-[1920px] h-[242px] z-50 pointer-events-none transition-transform duration-300 ease-in-out"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        {/* Equalizer */}
        <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] pointer-events-auto">
          <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
            <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
            <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
            <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
          </div>
        </div>

        {/* Country Selector */}
        <div 
          className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1453px] overflow-clip rounded-[30px] top-[67px] w-[223px] pointer-events-auto cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          onClick={() => setIsCountrySelectorOpen(true)}
          data-testid="button-country-selector"
          data-tv-focusable="true"
        >
          <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
              {selectedCountry}
            </p>
            <div className="absolute left-0 size-[28.421px] top-0">
              <img
                alt={selectedCountry}
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={selectedCountryFlag}
              />
            </div>
            <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[23.684px]">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-outline-arrow-left.svg")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Link href="/login">
          <div className="absolute bg-[rgba(255,255,255,0.1)] h-[52px] left-[1695px] overflow-clip rounded-[30px] top-[66px] w-[146px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors pointer-events-auto" data-testid="button-login-header" data-tv-focusable="true">
            <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[57.08px] not-italic text-[24px] text-white top-[12px]">
              {t('login')}
            </p>
            <div className="absolute left-[13px] size-[34px] top-[9px]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={getAssetPath("figmaAssets/vuesax-bold-setting-2.svg")}
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Fixed Left Sidebar - Exact from DiscoverNoUser */}
      <div className="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto">
          {/* Discover */}
          <Link href="/discover-no-user">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('discover')}
                </p>
                <div className="absolute left-[20px] size-[32px] top-0">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-bold-radio.svg")}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Genres */}
          <Link href="/genres">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('genres')}
                </p>
                <div className="absolute left-[13px] size-[32px] top-0">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-bold-musicnote.svg")}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Search */}
          <Link href="/search">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('search')}
                </p>
                <div className="absolute left-[12px] size-[32px] top-0">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-bold-search-normal.svg")}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Favorites */}
          <Link href="/favorites">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px]" data-testid="button-favorites" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('favorites')}
                </p>
                <div className="absolute left-[22px] size-[32px] top-0">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-bold-heart.svg")}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Records */}
          <Link href="/discover-no-user">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px]" data-testid="button-records" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[16px] top-[19px] w-[66px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[33px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('profile_nav_records')}
                </p>
                <div className="absolute left-[17px] size-[32px] top-0">
                  <div className="absolute left-0 size-[32px] top-0">
                    <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
                    <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/settings">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  {t('settings')}
                </p>
                <div className="absolute left-[18px] size-[32px] top-0">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={getAssetPath("figmaAssets/vuesax-bold-setting-2.svg")}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>

      {/* Scrollable Content Area */}
      <div 
        ref={scrollContainerRef}
        className="absolute left-[162px] w-[1758px] overflow-y-auto overflow-x-hidden z-1 scrollbar-hide transition-all duration-300 ease-in-out"
        style={{
          top: showHeader ? '242px' : '64px',
          height: showHeader ? '838px' : '1016px'
        }}
      >
        <div className="relative w-full">

      {/* Station Logo */}
      <div className="absolute left-[74px] top-0 w-[296px] h-[296px] bg-white rounded-[16.692px] overflow-hidden">
        <img 
          src={getStationImage(station)}
          alt={station.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Station Info */}
      <div className="absolute left-[434px] top-0">
        {/* Pink Equalizer Icon */}
        <div className="flex gap-[2.5px] h-[35px] w-[33.25px]">
          <div className="w-[8.75px] h-[35px] bg-[#ff4199] rounded-[10px]" />
          <div className="w-[8.75px] h-[24.5px] bg-[#ff4199] rounded-[10px] mt-[10.5px]" />
          <div className="w-[8.75px] h-[29.75px] bg-[#ff4199] rounded-[10px] mt-[5.25px]" />
        </div>

        {/* Station Name */}
        <p className="font-['Ubuntu',Helvetica] font-medium text-[48px] text-white leading-normal mt-[16px]">
          {station.name}
        </p>

        {/* Now Playing */}
        <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-white leading-normal mt-[13.71px]">
          {metadata?.title || 'Now Playing'}
        </p>

        {/* Station Info Label */}
        <p className="font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal mt-[38.29px]">
          Station Info
        </p>

        {/* Tags */}
        <div className="flex gap-[11.3px] mt-[27px] items-center">
          {/* Country Flag */}
          <div className="w-[34.783px] h-[34.783px] rounded-full overflow-hidden">
            <img 
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              alt={station.country}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* Bitrate */}
          <div className="bg-[#242424] rounded-[5.217px] h-[40px] px-[20px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{bitrate}</p>
          </div>

          {/* Codec */}
          <div className="bg-[#242424] rounded-[5.217px] h-[40px] px-[20px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{codec}</p>
          </div>

          {/* Country Code */}
          <div className="bg-[#242424] rounded-[5.217px] h-[40px] px-[20px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{countryCode}</p>
          </div>

          {/* Genre Tags */}
          {stationTags.slice(0, 2).map((tag, idx) => (
            <div key={idx} className="bg-[#242424] rounded-[5.217px] h-[40px] px-[20px] flex items-center justify-center">
              <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{tag}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player Controls */}
      <div className="absolute left-[1210px] top-[114px] flex gap-[36.27px]">
        {/* Previous Button */}
        <div 
          className="bg-black rounded-[45.096px] w-[90.192px] h-[90.192px] flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors"
          onClick={handlePrevious}
          data-tv-focusable="true"
          data-testid="button-previous"
        >
          <svg className="w-[54.115px] h-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.375 16.9792L23.6042 27.75L34.375 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.1458 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Play/Pause Button */}
        <div 
          className="bg-black rounded-[45.096px] w-[90.192px] h-[90.192px] flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors"
          onClick={handlePlayPause}
          data-tv-focusable="true"
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <svg className="w-[54.115px] h-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="18" y="14" width="6" height="27" rx="2" fill="white"/>
              <rect x="31" y="14" width="6" height="27" rx="2" fill="white"/>
            </svg>
          ) : (
            <svg className="w-[54.115px] h-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 14L38 27.5L20 41V14Z" fill="white"/>
            </svg>
          )}
        </div>

        {/* Next Button */}
        <div 
          className="bg-black rounded-[45.096px] w-[90.192px] h-[90.192px] flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors"
          onClick={handleNext}
          data-tv-focusable="true"
          data-testid="button-next"
        >
          <svg className="w-[54.115px] h-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.625 16.9792L31.3958 27.75L20.625 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38.8542 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Favorite Button */}
        <div 
          className="border-[3.608px] border-black border-solid rounded-[72.655px] w-[90.192px] h-[90.192px] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          data-tv-focusable="true"
          data-testid="button-favorite"
        >
          <svg className="w-[50.508px] h-[50.508px]" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 44.625C24.7396 44.625 23.9792 44.3958 23.3604 43.9375C18.9375 40.6042 14.9479 37.6771 11.9792 34.7917C7.44792 30.3479 4.25 26.2646 4.25 20.625C4.25 12.6667 10.5 6.375 18.0625 6.375C21.6042 6.375 24.9167 8.14583 27.125 11.1354C29.3333 8.14583 32.6458 6.375 36.1875 6.375C43.75 6.375 50 12.6667 50 20.625C50 26.2646 46.8021 30.3479 42.2708 34.8125C39.3021 37.6979 35.3125 40.625 30.8896 43.9583C30.2708 44.3958 29.5104 44.625 28.75 44.625H25.5Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Similar Radios Section */}
      <div className="absolute left-[74px] top-[417px]">
        <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">Similar Radios</p>
        <p 
          className="absolute right-[-1520px] top-[6px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal cursor-pointer hover:text-gray-300"
          data-tv-focusable="true"
        >
          See More
        </p>
      </div>

      {/* Similar Radios Horizontal Scroll */}
      <div 
        ref={similarScrollRef}
        className="absolute left-[74px] top-[491px] flex gap-[19px] overflow-x-auto scrollbar-hide w-[1580px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {similarStations.map((similarStation, index) => (
          <div
            key={similarStation._id || index}
            className="flex-shrink-0 w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            data-testid={`card-similar-${similarStation._id}`}
            data-tv-focusable="true"
            onClick={() => navigateToStation(similarStation)}
          >
            <div className="w-[132px] h-[132px] mt-[34px] ml-[34px] bg-white rounded-[6.6px] overflow-clip">
              <img
                className="w-full h-full object-cover"
                alt={similarStation.name}
                src={getStationImage(similarStation)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal mt-[21px] truncate px-2">
              {similarStation.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] font-light text-[18px] text-center text-white leading-normal mt-[6.2px] truncate px-2">
              {getStationTags(similarStation)[0] || similarStation.country || 'Radio'}
            </p>
          </div>
        ))}
        {isLoadingMoreSimilar && (
          <div className="flex-shrink-0 w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Loading...</p>
          </div>
        )}
      </div>

      {/* Popular Radios Section */}
      <div className="absolute left-[74px] top-[853px]">
        <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">Popular Radios</p>
      </div>

      {/* Popular Radios Grid */}
      <div className="absolute left-[74px] top-[927px] grid grid-cols-7 gap-[19px] w-[1580px]">
        {popularStations.map((popularStation, index) => {
          // Detect if this is in the last row and should trigger load more
          const isLastRow = index >= popularStations.length - 7;
          
          return (
            <div
              key={popularStation._id || index}
              className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              data-testid={`card-popular-${popularStation._id}`}
              data-tv-focusable="true"
              onClick={() => navigateToStation(popularStation)}
              data-is-last-row={isLastRow ? "true" : "false"}
            >
              <div className="w-[132px] h-[132px] mt-[34px] ml-[34px] bg-white rounded-[6.6px] overflow-clip">
                <img
                  className="w-full h-full object-cover"
                  alt={popularStation.name}
                  src={getStationImage(popularStation)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal mt-[21px] truncate px-2">
                {popularStation.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] font-light text-[18px] text-center text-white leading-normal mt-[6.2px] truncate px-2">
                {getStationTags(popularStation)[0] || popularStation.country || 'Radio'}
              </p>
            </div>
          );
        })}
        {isLoadingMorePopular && (
          <div className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Loading...</p>
          </div>
        )}
      </div>

        </div>
      </div>
    </div>
  );
};
