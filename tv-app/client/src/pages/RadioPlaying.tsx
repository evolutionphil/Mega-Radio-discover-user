import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useMemo, useEffect, useRef, useState } from "react";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useLocalization } from "@/contexts/LocalizationContext";

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
  
  // Infinite scroll state for similar stations
  const [allSimilarStations, setAllSimilarStations] = useState<Station[]>([]);
  const [isLoadingMoreSimilar, setIsLoadingMoreSimilar] = useState(false);
  const [hasMoreSimilar, setHasMoreSimilar] = useState(true);
  const [similarStationsPage, setSimilarStationsPage] = useState(1);
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const SIMILAR_STATIONS_PER_LOAD = 40;
  
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

  // Fetch popular stations
  const { data: popularStationsData } = useQuery({
    queryKey: ['popular-stations'],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 14 }),
  });

  const similarStations = allSimilarStations || [];
  const popularStations = popularStationsData?.stations || [];

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
          audioPlayerRef.current.stop();
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

      {/* Logo */}
      <div className="absolute left-[31px] top-[64px] h-[57px] w-[164.421px]">
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

      {/* Top Right Controls */}
      <div className="absolute right-[59px] top-[59px] flex items-center gap-[64px]">
        {/* Equalizer Icon */}
        <div className="bg-[rgba(255,255,255,0.1)] rounded-[30px] w-[51px] h-[51px] flex items-center justify-center">
          <div className="flex gap-[2.5px] h-[25px] w-[23.75px]">
            <div className="w-[6.25px] h-[25px] bg-white rounded-[10px]" />
            <div className="w-[6.25px] h-[17.5px] bg-white rounded-[10px] mt-[7.5px]" />
            <div className="w-[6.25px] h-[21.25px] bg-white rounded-[10px] mt-[3.75px]" />
          </div>
        </div>

        {/* Country Selector */}
        <div className="bg-[rgba(255,255,255,0.1)] rounded-[30px] h-[51px] px-[15px] flex items-center gap-[10px] cursor-pointer" data-tv-focusable="true">
          <div className="w-[28.421px] h-[28.421px] rounded-full overflow-hidden">
            <img 
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              alt={station.country}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
          <p className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white">{station.country || 'Unknown'}</p>
          <div className="w-[23.684px] h-[23.684px] rotate-[-90deg]">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.43 5.93L20.5 12L14.43 18.07" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-[18px]">
          <p className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white">Talha Çay</p>
          <div className="w-[66px] h-[66px] rounded-full overflow-hidden bg-gray-600">
            <img 
              src={FALLBACK_IMAGE}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-[64px] top-[242px] flex flex-col gap-[10px]">
        <div className="bg-[rgba(255,255,255,0.2)] rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px]">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.5467 18.48C27.4 24.7733 21.52 29.3333 16 29.3333C9.01333 29.3333 3.33333 23.6533 3.33333 16.6667C3.33333 10.8267 7.34667 5.94667 12.7867 4.38667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.6667 16.6667C18.6667 18.1333 17.4667 19.3333 16 19.3333C14.5333 19.3333 13.3333 18.1333 13.3333 16.6667C13.3333 15.2 14.5333 14 16 14C17.4667 14 18.6667 15.2 18.6667 16.6667Z" fill="white"/>
              <path d="M29.3333 8V14.6667H22.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M29.3333 8L19.2 18.1333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Discover</p>
        </div>

        <div className="rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px]">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 2.66666L7.92 7.01333C7.44 7.49333 6.66667 7.85333 6.01333 7.85333H2.66667C1.92 7.85333 1.33333 8.44 1.33333 9.18666V14.8133C1.33333 15.56 1.92 16.1467 2.66667 16.1467H6.01333C6.66667 16.1467 7.44 16.5067 7.92 16.9867L12.24 21.3333C13.1733 22.2667 14.6667 21.6267 14.6667 20.28V3.70666C14.6667 2.37333 13.1733 1.73333 12.24 2.66666Z" fill="white"/>
              <path d="M21.3333 9.33333C23.1467 11.8 23.1467 15.2 21.3333 17.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24.4267 6.66666C27.8133 10.8267 27.8133 16.9867 24.4267 21.3333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Genres</p>
        </div>

        <div className="rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px]">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.3333 28.6667C22.6933 28.6667 28.6667 22.6933 28.6667 15.3333C28.6667 7.97333 22.6933 2 15.3333 2C7.97333 2 2 7.97333 2 15.3333C2 22.6933 7.97333 28.6667 15.3333 28.6667Z" fill="white"/>
              <path d="M27.48 27.48L30 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Search</p>
        </div>

        <div className="rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px]">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9733 4.22666C16.4533 3.62666 15.5467 3.62666 15.0267 4.22666L12.56 7.14666C12.2667 7.49333 11.76 7.78666 11.3333 7.84L7.73333 8.33333C6.8 8.46666 6.53333 9.52 7.17333 10.1733L9.93333 12.9733C10.2667 13.3067 10.44 13.9333 10.3467 14.3733L9.69333 17.92C9.46667 18.9467 10.36 19.72 11.2667 19.24L14.6267 17.4133C15.04 17.1867 15.7067 17.1867 16.12 17.4133L19.48 19.24C20.3867 19.7333 21.2667 18.9467 21.0533 17.92L20.4 14.3733C20.3067 13.9333 20.48 13.3067 20.8133 12.9733L23.5733 10.1733C24.2133 9.52 23.9467 8.46666 23.0133 8.33333L19.4133 7.84C18.9733 7.78666 18.4667 7.49333 18.1867 7.14666L16.9733 4.22666Z" fill="white"/>
              <path d="M10.6667 28H21.3333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Favorites</p>
        </div>

        <div className="rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px] flex items-center justify-center">
            <div className="relative w-[32px] h-[32px]">
              <div className="absolute left-[5.33px] top-[5.33px] w-[21.334px] h-[21.334px] bg-white rounded-[10.667px]" />
              <div className="absolute inset-0 border-[2.667px] border-solid border-white rounded-[20.267px]" />
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Records</p>
        </div>

        <div className="rounded-[10px] w-[98px] h-[98px] flex flex-col items-center justify-center cursor-pointer" data-tv-focusable="true">
          <div className="w-[32px] h-[32px] mb-[9px]">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" fill="white"/>
              <path d="M2.66667 17.1067V14.8933C2.66667 13.4133 3.86667 12.2 5.36 12.2C7.62667 12.2 8.53333 10.76 7.4 8.81333C6.74667 7.69333 7.12 6.24 8.25333 5.58667L10.4267 4.29333C11.4133 3.69333 12.6933 4.04 13.2933 5.02667L13.4267 5.25333C14.5467 7.2 16.3733 7.2 17.5067 5.25333L17.64 5.02667C18.24 4.04 19.52 3.69333 20.5067 4.29333L22.68 5.58667C23.8133 6.24 24.1867 7.69333 23.5333 8.81333C22.4 10.76 23.3067 12.2 25.5733 12.2C27.0533 12.2 28.2667 13.4 28.2667 14.8933V17.1067C28.2667 18.5867 27.0667 19.8 25.5733 19.8C23.3067 19.8 22.4 21.24 23.5333 23.1867C24.1867 24.32 23.8133 25.76 22.68 26.4133L20.5067 27.7067C19.52 28.3067 18.24 27.96 17.64 26.9733L17.5067 26.7467C16.3867 24.8 14.56 24.8 13.4267 26.7467L13.2933 26.9733C12.6933 27.96 11.4133 28.3067 10.4267 27.7067L8.25333 26.4133C7.12 25.76 6.74667 24.3067 7.4 23.1867C8.53333 21.24 7.62667 19.8 5.36 19.8C3.86667 19.8 2.66667 18.5867 2.66667 17.1067Z" fill="white"/>
            </svg>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-white">Settings</p>
        </div>
      </div>

      {/* Station Logo */}
      <div className="absolute left-[236px] top-[242px] w-[296px] h-[296px] bg-white rounded-[16.692px] overflow-hidden">
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
      <div className="absolute left-[596px] top-[242px]">
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
      <div className="absolute left-[1372px] top-[356px] flex gap-[36.27px]">
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
              <path d="M19.7083 11.4583C17.7354 11.4583 16.1458 13.0479 16.1458 15.0208V39.9792C16.1458 41.9521 17.7354 43.5417 19.7083 43.5417H24.2708C26.2437 43.5417 27.8333 41.9521 27.8333 39.9792V15.0208C27.8333 13.0479 26.2437 11.4583 24.2708 11.4583H19.7083Z" fill="white"/>
              <path d="M30.7292 11.4583C28.7562 11.4583 27.1667 13.0479 27.1667 15.0208V39.9792C27.1667 41.9521 28.7562 43.5417 30.7292 43.5417H35.2917C37.2646 43.5417 38.8542 41.9521 38.8542 39.9792V15.0208C38.8542 13.0479 37.2646 11.4583 35.2917 11.4583H30.7292Z" fill="white"/>
            </svg>
          ) : (
            <svg className="w-[54.115px] h-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.7083 11.4583C17.7354 11.4583 16.1458 13.0479 16.1458 15.0208V39.9792C16.1458 41.9521 17.7354 43.5417 19.7083 43.5417C19.8021 43.5417 19.8958 43.5375 19.9896 43.5271L36.6271 32.7479C37.9521 31.8396 38.8542 30.3417 38.8542 28.6646V26.3354C38.8542 24.6583 37.9521 23.1604 36.6271 22.2521L19.9896 11.4729C19.8958 11.4625 19.8021 11.4583 19.7083 11.4583Z" fill="white"/>
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
      <div className="absolute left-[236px] top-[659px]">
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
        className="absolute left-[236px] top-[733px] flex gap-[19px] overflow-x-auto scrollbar-hide w-[1580px]"
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
      <div className="absolute left-[236px] top-[1095px]">
        <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">Popular Radios</p>
        <p 
          className="absolute right-[-1520px] top-[6px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal cursor-pointer hover:text-gray-300"
          data-tv-focusable="true"
        >
          See More
        </p>
      </div>

      {/* Popular Radios Grid */}
      <div className="absolute left-[236px] top-[1169px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
        {popularStations.map((popularStation, index) => (
          <div
            key={popularStation._id || index}
            className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            data-testid={`card-popular-${popularStation._id}`}
            data-tv-focusable="true"
            onClick={() => navigateToStation(popularStation)}
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
        ))}
        <div className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" data-testid="button-see-more" data-tv-focusable="true">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
            See More
          </p>
        </div>
      </div>
    </div>
  );
};
