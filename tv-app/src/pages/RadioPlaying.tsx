import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useCountry } from "@/contexts/CountryContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { CountrySelector } from "@/components/CountrySelector";
import { CountryTrigger } from "@/components/CountryTrigger";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";


export const RadioPlaying = (): JSX.Element => {
  console.log('[RadioPlaying] 🎬 Component mounting/rendering');
  const [location, setLocation] = useLocation();
  const { t } = useLocalization();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag, setCountry } = useCountry();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playStation, togglePlayPause, isPlaying, isBuffering } = useGlobalPlayer();
  console.log('[RadioPlaying] 🎮 Global player state:', { isPlaying, isBuffering });
  
  // Station history for Previous button (stores station IDs)
  const stationHistoryRef = useRef<string[]>([]);
  const isNavigatingBackRef = useRef(false);
  
  // Force update trigger for station changes
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Country selector state
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  
  // Scroll refs for auto-scrolling focused cards
  const containerScrollRef = useRef<HTMLDivElement>(null);
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const popularScrollRef = useRef<HTMLDivElement>(null);
  
  // Parse station ID from URL query params (supports both hash and pre-hash params)
  const stationId = useMemo(() => {
    console.log('[RadioPlaying] 🔍 Parsing station ID from URL');
    console.log('[RadioPlaying] 📍 Wouter location:', location);
    console.log('[RadioPlaying] 📍 window.location.search:', window.location.search);
    console.log('[RadioPlaying] 📍 window.location.hash:', window.location.hash);
    console.log('[RadioPlaying] 📍 window.location.href:', window.location.href);
    console.log('[RadioPlaying] 📍 Full URL breakdown:', {
      protocol: window.location.protocol,
      host: window.location.host,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    });

    // Try to get from wouter location first (hash-based: /#/radio-playing?station=123)
    const queryStart = location.indexOf('?');
    if (queryStart !== -1) {
      const queryString = location.substring(queryStart + 1);
      console.log('[RadioPlaying] 🔎 Found query string in wouter location:', queryString);
      const searchParams = new URLSearchParams(queryString);
      const id = searchParams.get('station') || searchParams.get('stationId');
      if (id) {
        console.log('[RadioPlaying] ✅ Found station ID in hash params:', id);
        return id;
      }
      console.log('[RadioPlaying] ⚠️ Query string found but no station/stationId param');
    }

    // Fallback: Try window.location.search (pre-hash: /?stationId=123#/radio-playing)
    if (window.location.search) {
      console.log('[RadioPlaying] 🔎 Trying window.location.search:', window.location.search);
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('station') || searchParams.get('stationId');
      if (id) {
        console.log('[RadioPlaying] ✅ Found station ID in pre-hash params:', id);
        return id;
      }
      console.log('[RadioPlaying] ⚠️ window.location.search found but no station/stationId param');
    }

    console.log('[RadioPlaying] ❌ No station ID found in URL - returning null');
    return null;
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

  // Fallback image - music note on pink gradient background
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

  // Fetch station details
  const { data: stationData, isLoading: isLoadingStation, error: stationError } = useQuery({
    queryKey: ['station', stationId],
    queryFn: async () => {
      console.log('[RadioPlaying] 📡 Fetching station details for stationId:', stationId);
      const result = await megaRadioApi.getStationById(stationId!);
      console.log('[RadioPlaying] ✅ Station details fetched successfully');
      console.log('[RadioPlaying] 📻 Station name:', result?.station?.name);
      console.log('[RadioPlaying] 📻 Station URL:', result?.station?.url);
      console.log('[RadioPlaying] 📻 Station data:', result?.station);
      return result;
    },
    enabled: !!stationId,
    retry: 2,
    staleTime: 30000,
  });

  const station = stationData?.station;
  
  console.log('[RadioPlaying] 🎯 Query state:', {
    stationId,
    enabled: !!stationId,
    isLoadingStation,
    hasStationData: !!stationData,
    hasStation: !!station,
    stationName: station?.name,
    error: stationError
  });


  // Fetch station metadata
  const { data: metadataData } = useQuery({
    queryKey: ['metadata', stationId],
    queryFn: () => megaRadioApi.getStationMetadata(stationId!),
    enabled: !!stationId,
    refetchInterval: 30000,
  });

  const metadata = metadataData?.metadata;

  // Fetch similar stations - INCREASED TO 100 for more variety
  const { data: similarData } = useQuery({
    queryKey: ['similar-stations', stationId, station?.countrycode || station?.country],
    queryFn: async () => {
      if (!station) return { stations: [] };
      const countryCode = station.countrycode || station.country;
      if (countryCode) {
        const data = await megaRadioApi.getWorkingStations({ 
          limit: 100, 
          country: countryCode 
        });
        // Filter out current station and shuffle for variety
        const filtered = data.stations.filter(s => s._id !== stationId);
        // Shuffle array to get different stations each time
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        return { stations: filtered };
      }
      const data = await megaRadioApi.getSimilarStations(stationId!, 100);
      // Also filter and shuffle similar stations
      const filtered = data.stations.filter(s => s._id !== stationId);
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
      return { stations: filtered };
    },
    enabled: !!stationId && !!station,
    // Don't use cache for similar stations - always fetch fresh
    staleTime: 0,
    gcTime: 0,
  });

  const similarStations = similarData?.stations || [];
  
  // Log when similar stations change
  useEffect(() => {
    if (similarStations.length > 0) {
      console.log('[RadioPlaying] Similar stations updated:', similarStations.length, 'stations');
      console.log('[RadioPlaying] First 3 similar:', similarStations.slice(0, 3).map(s => s.name));
    }
  }, [similarStations]);

  // Fetch popular stations from GLOBAL (random selection)
  const { data: popularData } = useQuery({
    queryKey: ['popular-global-stations', stationId],
    queryFn: async () => {
      const data = await megaRadioApi.getPopularStations({ 
        limit: 100, 
        // No country filter - get global popular stations
      });
      // Filter out current station and shuffle for random variety
      const filtered = data.stations.filter(s => s._id !== stationId);
      // Shuffle array to get different stations each time
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
      return { stations: filtered };
    },
    enabled: !!stationId,
    staleTime: 0, // Always fetch fresh for randomness
    gcTime: 0,
  });

  const popularStations = popularData?.stations || [];

  // Calculate totalItems: 5 (sidebar) + 1 (country) + 4 (playback) + similar stations (20) + popular stations (20)
  const totalItems = 5 + 1 + 4 + Math.min(similarStations.length, 20) + Math.min(popularStations.length, 20);

  // Define sidebar routes (NO PROFILE - 5 items)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  // Custom navigation logic for multi-section layout
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
        newIndex = 5; // Jump to country selector
      }
    }
    // Country selector (5)
    else if (current === 5) {
      if (direction === 'DOWN') {
        newIndex = 6; // Jump to first playback button (previous)
      } else if (direction === 'UP') {
        newIndex = 0; // Jump to sidebar top
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Playback controls (6-9: previous, play/pause, next, favorite)
    else if (current >= 6 && current <= 9) {
      const relIndex = current - 6;

      if (direction === 'LEFT') {
        if (relIndex > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (relIndex < 3) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        newIndex = 5; // Jump to country selector
      } else if (direction === 'DOWN') {
        // Jump to similar stations if available
        if (similarStations.length > 0) {
          newIndex = 10; // First similar station
        }
      }
    }
    // Similar stations (10-29) - horizontal list
    else if (current >= 10 && current <= 29) {
      const relIndex = current - 10;

      if (direction === 'LEFT') {
        if (relIndex > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (relIndex < Math.min(similarStations.length, 20) - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        newIndex = 7; // Jump to play/pause button
      } else if (direction === 'DOWN') {
        // Move to Popular stations if available
        if (popularStations.length > 0) {
          newIndex = 30; // First popular station
        }
      }
    }
    // Popular stations (30-49) - horizontal list
    else if (current >= 30 && current <= 49) {
      const relIndex = current - 30;

      if (direction === 'LEFT') {
        if (relIndex > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (relIndex < Math.min(popularStations.length, 20) - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Move back to Similar stations
        if (similarStations.length > 0) {
          newIndex = 10; // First similar station
        } else {
          newIndex = 7; // Jump to play/pause button
        }
      } else if (direction === 'DOWN') {
        // Stay on popular stations
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Register RETURN key handler at the TOP - works even on loading screen
  usePageKeyHandler('/radio-playing', (e) => {
    // Ignore all key events when country selector modal is open
    if (isCountrySelectorOpen) {
      console.log('[RadioPlaying] Key event ignored - country selector modal is open');
      return;
    }

    const key = (window as any).tvKey;
    
    // RETURN key handler ALWAYS works, even when loading
    if (e.keyCode === key?.RETURN || e.keyCode === 461 || e.keyCode === 10009) {
      console.log('[RadioPlaying] 🔙 RETURN key pressed - navigating to Discover');
      setLocation('/discover-no-user');
      return;
    }
    
    // Other key handlers only work after station loads
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
      case key?.PAGE_DOWN:
      case 34:
        // Jump to similar stations section
        e.preventDefault();
        if (similarStations.length > 0) {
          setFocusIndex(10); // First similar station
          console.log('[RadioPlaying] PageDown - jumped to similar stations');
        }
        break;
      case key?.PAGE_UP:
      case 33:
        // Jump back to playback controls
        e.preventDefault();
        setFocusIndex(7); // Play/pause button
        console.log('[RadioPlaying] PageUp - jumped to playback controls');
        break;
    }
  });

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 8, // Start on play/pause button
    onSelect: (index) => {
      // Sidebar navigation (0-4)
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      }
      // Country selector (5)
      else if (index === 5) {
        setIsCountrySelectorOpen(true);
      }
      // Previous button (6)
      else if (index === 6) {
        handlePrevious();
      }
      // Play/Pause button (7)
      else if (index === 7) {
        handlePlayPause();
      }
      // Next button (8)
      else if (index === 8) {
        handleNext();
      }
      // Favorite button (9)
      else if (index === 9) {
        if (station) {
          toggleFavorite(station);
        }
      }
      // Similar stations (10-29)
      else if (index >= 10 && index <= 29) {
        const stationIndex = index - 10;
        const targetStation = similarStations[stationIndex];
        if (targetStation) {
          navigateToStation(targetStation);
        }
      }
      // Popular stations (30-49)
      else if (index >= 30 && index <= 49) {
        const stationIndex = index - 30;
        const targetStation = popularStations[stationIndex];
        if (targetStation) {
          navigateToStation(targetStation);
        }
      }
    },
    onBack: () => {
      // Always go back to discover for Samsung TV compatibility
      console.log('[RadioPlaying] 🔙 Back button - navigating to Discover');
      setLocation('/discover-no-user');
    }
  });

  // Scroll stations into view when focused
  useEffect(() => {
    const cardWidth = 200 + 24; // card width + gap (marginRight)
    
    // Similar stations (10-29)
    if (focusIndex >= 10 && focusIndex <= 29 && similarScrollRef.current) {
      const stationIndex = focusIndex - 10;
      const scrollPosition = stationIndex * cardWidth;
      
      similarScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    
    // Popular stations (30-49)
    if (focusIndex >= 30 && focusIndex <= 49 && popularScrollRef.current) {
      const stationIndex = focusIndex - 30;
      const scrollPosition = stationIndex * cardWidth;
      
      popularScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [focusIndex]);

  // Auto-play when station loads using global player
  useEffect(() => {
    console.log('[RadioPlaying] 🎵 Auto-play effect triggered');
    console.log('[RadioPlaying] 🎵 Has station:', !!station);
    if (station) {
      console.log('[RadioPlaying] 🎵 Station data available:', {
        name: station.name,
        id: station._id,
        url: station.url,
        codec: station.codec,
        bitrate: station.bitrate
      });
      console.log('[RadioPlaying] ▶️ Starting auto-play via global player');
      playStation(station);
      console.log('[RadioPlaying] ✅ Auto-play initiated');
    } else {
      console.log('[RadioPlaying] ⏳ Waiting for station data to auto-play');
    }
  }, [station]);

  const handlePlayPause = () => {
    togglePlayPause();
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
    playStation(targetStation);
    const newUrl = `${window.location.pathname}?station=${targetStation._id}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setUpdateTrigger(prev => prev + 1);
  };

  // Show error state
  if (stationError) {
    console.error('[RadioPlaying] Error loading station:', stationError);
    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] bg-black flex flex-col items-center justify-center gap-8">
        <p className="font-['Ubuntu',Helvetica] font-bold text-[40px] text-white">{t('failed_to_load_station') || 'Failed to load station'}</p>
        <p className="font-['Ubuntu',Helvetica] font-medium text-[24px] text-gray-400">
          {stationError instanceof Error ? stationError.message : 'Unknown error'}
        </p>
        <Link href="/discover-no-user">
          <button className="bg-[#ff4199] hover:bg-[#ff1a85] px-12 py-4 rounded-[30px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-white transition-colors">
            {t('back_to_discover') || 'Back to Discover'}
          </button>
        </Link>
      </div>
    );
  }

  // Show loading state with better debugging
  if (!stationId) {
    console.error('[RadioPlaying] ❌ No station ID - cannot load station');
    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] bg-black flex flex-col items-center justify-center gap-8">
        <p className="font-['Ubuntu',Helvetica] font-bold text-[40px] text-white">{t('no_station_selected') || 'No Station Selected'}</p>
        <p className="font-['Ubuntu',Helvetica] font-medium text-[24px] text-gray-400">
          {t('please_select_station') || 'Please select a station to play'}
        </p>
        <Link href="/discover-no-user">
          <button className="bg-[#ff4199] hover:bg-[#ff1a85] px-12 py-4 rounded-[30px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-white transition-colors">
            {t('back_to_discover') || 'Back to Discover'}
          </button>
        </Link>
      </div>
    );
  }

  if (isLoadingStation || !station) {
    console.log('[RadioPlaying] 🔄 LOADING STATE - Showing loading screen');
    console.log('[RadioPlaying] 🔄 isLoadingStation:', isLoadingStation);
    console.log('[RadioPlaying] 🔄 hasStation:', !!station);
    console.log('[RadioPlaying] 🔄 stationId:', stationId);
    console.log('[RadioPlaying] 🔄 stationData:', stationData);
    console.log('[RadioPlaying] 🔄 Station is:', station ? 'AVAILABLE' : 'NULL');
    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] bg-black flex flex-col items-center justify-center gap-8">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[#ff4199]"></div>
        <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-white animate-pulse">
          {stationData?.station?.name || t('loading_station') || 'Loading station...'}
        </p>
        <p className="font-['Ubuntu',Helvetica] font-normal text-[20px] text-gray-500">{t('please_wait') || 'Please wait'}</p>
        <p className="font-['Ubuntu',Helvetica] font-normal text-[16px] text-gray-600 mt-4">{t('press_return_to_go_back') || 'Press RETURN to go back'}</p>
      </div>
    );
  }

  const stationTags = getStationTags(station);
  const codec = station.codec || 'MP3';
  const bitrate = station.bitrate ? `${station.bitrate}kb` : '128kb';
  const countryCode = station.countrycode || station.countryCode || 'XX';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px]" style={{ background: 'radial-gradient(181.15% 96.19% at 5.26% 9.31%, #0E0E0E 0%, #3F1660 29.6%, #0E0E0E 100%)' }}>

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50">
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

      {/* Equalizer Icon */}
      <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] z-50 transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
          <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
          <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
        </div>
      </div>

      {/* Country Selector */}
      <CountryTrigger
        selectedCountry={selectedCountry}
        selectedCountryCode={selectedCountryCode}
        onClick={() => setIsCountrySelectorOpen(true)}
        focusClasses={getFocusClasses(isFocused(5))}
        className="absolute left-[1453px] top-[67px] z-50"
      />

      {/* Left Menu / Sidebar */}
      <Sidebar activePage="discover" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Station Logo */}
      <div className="absolute bg-white left-[236px] overflow-clip rounded-[16.692px] size-[296px] top-[242px]">
        <img 
          src={getStationImage(station)}
          alt={station.name}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Equalizer Icon (Pink) */}
      <div className="absolute h-[35px] left-[596px] overflow-clip top-[242px] w-[33.25px]">
        <div className={`absolute bg-[#ff4199] left-0 rounded-[10px] top-0 w-[8.75px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[35px]'}`} style={{ height: isPlaying ? undefined : '35px' }} />
        <div className={`absolute bg-[#ff4199] left-[12.25px] rounded-[10px] w-[8.75px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[24.5px] top-[10.5px]'}`} style={{ height: isPlaying ? undefined : '24.5px', top: isPlaying ? undefined : '10.5px' }} />
        <div className={`absolute bg-[#ff4199] left-[24.5px] rounded-[10px] w-[8.75px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[29.75px] top-[5.25px]'}`} style={{ height: isPlaying ? undefined : '29.75px', top: isPlaying ? undefined : '5.25px' }} />
      </div>

      {/* Station Name */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[48px] text-white top-[293px] max-w-[600px] truncate">
        {station.name}
      </p>

      {/* Now Playing */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[32px] text-white top-[356.71px] max-w-[700px] truncate">
        {metadata?.title || t('now_playing') || 'Now Playing'}
      </p>

      {/* Station Info Label */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[24px] text-white top-[425px]">
        {t('station_info') || 'Station Info'}
      </p>

      {/* Station Info Tags */}
      <div className="absolute left-[596px] top-[476px] flex gap-[11.3px] items-center">
        {/* Country Flag */}
        <div className="size-[34.783px] rounded-full overflow-hidden">
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
        <div className="bg-[#242424] h-[40px] overflow-clip rounded-[5.217px] px-[20px] flex items-center justify-center">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{bitrate}</p>
        </div>

        {/* Codec */}
        <div className="bg-[#242424] h-[40px] overflow-clip rounded-[5.217px] px-[20px] flex items-center justify-center">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{codec}</p>
        </div>

        {/* Country Code */}
        <div className="bg-[#242424] h-[40px] overflow-clip rounded-[5.217px] px-[20px] flex items-center justify-center">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{countryCode}</p>
        </div>

        {/* Genre Tags - show first 2 */}
        {stationTags.slice(0, 2).map((tag, idx) => (
          <div key={idx} className="bg-[#242424] h-[40px] overflow-clip rounded-[5.217px] px-[20px] flex items-center justify-center">
            <p className="font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-white">{tag}</p>
          </div>
        ))}
      </div>

      {/* Player Controls */}
      <div className="absolute h-[90.192px] left-[1372px] top-[356px] w-[469px]">
        {/* Previous Button */}
        <div 
          className={`absolute bg-black left-0 overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-all flex items-center justify-center ${getFocusClasses(isFocused(6))} ${isFocused(6) ? 'animate-pulse-soft' : ''}`}
          onClick={handlePrevious}
          data-testid="button-previous"
        >
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.375 16.9792L23.6042 27.75L34.375 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.1458 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Play/Pause Button */}
        <div 
          className={`absolute bg-black left-[126.27px] overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center ${getFocusClasses(isFocused(7))} ${isPlaying ? 'animate-pulse-soft' : ''}`}
          onClick={handlePlayPause}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="18" y="14" width="6" height="27" rx="2" fill="white"/>
              <rect x="31" y="14" width="6" height="27" rx="2" fill="white"/>
            </svg>
          ) : (
            <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 14L38 27.5L20 41V14Z" fill="white"/>
            </svg>
          )}
        </div>

        {/* Next Button */}
        <div 
          className={`absolute bg-black left-[252.54px] overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-all flex items-center justify-center ${getFocusClasses(isFocused(8))} ${isFocused(8) ? 'animate-pulse-soft' : ''}`}
          onClick={handleNext}
          data-testid="button-next"
        >
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.625 16.9792L31.3958 27.75L20.625 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38.8542 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Favorite Button */}
        <div 
          className={`absolute border-[3.608px] border-solid left-[378.81px] rounded-[72.655px] size-[90.192px] top-0 cursor-pointer transition-all flex items-center justify-center ${
            isFavorite(station._id) 
              ? 'bg-[#ff4199] border-[#ff4199] hover:bg-[#e0368a] animate-pulse-soft' 
              : 'border-black hover:bg-[rgba(255,255,255,0.1)]'
          } ${getFocusClasses(isFocused(9))} ${isFocused(9) ? 'animate-pulse-soft' : ''}`}
          onClick={() => toggleFavorite(station)}
          data-testid="button-favorite"
        >
          <svg className="size-[50.508px]" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 44.625C24.7396 44.625 23.9792 44.3958 23.3604 43.9375C18.9375 40.6042 14.9479 37.6771 11.9792 34.7917C7.44792 30.3479 4.25 26.2646 4.25 20.625C4.25 12.6667 10.5 6.375 18.0625 6.375C21.6042 6.375 24.9167 8.14583 27.125 11.1354C29.3333 8.14583 32.6458 6.375 36.1875 6.375C43.75 6.375 50 12.6667 50 20.625C50 26.2646 46.8021 30.3479 42.2708 34.8125C39.3021 37.6979 35.3125 40.625 30.8896 43.9583C30.2708 44.3958 29.5104 44.625 28.75 44.625H25.5Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Scrollable Content Area for Similar & Popular Radios */}
      <div 
        ref={containerScrollRef}
        className="absolute left-[236px] top-[559px] w-[1610px] h-[521px] overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="relative pb-[40px]">
          {/* Similar Radios Section */}
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal not-italic text-[32px] text-white mb-[16px]">
            {t('similar_radios') || 'Similar Radios'}
          </p>

          {/* Similar Radios Horizontal Scroll */}
          <div ref={similarScrollRef} className="flex overflow-x-auto scrollbar-hide scroll-smooth mb-[60px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {similarStations.slice(0, 20).map((similarStation, index) => {
              const focusIdx = 10 + index;
              return (
              <div
                key={similarStation._id || index}
                className={`flex-shrink-0 bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-all duration-200 relative ${
                  isFocused(focusIdx) 
                    ? 'border-[4px] border-[#ff4199] shadow-[0_0_30px_rgba(255,65,153,0.8)]' 
                    : 'border-[4px] border-transparent'
                }`}
                style={{ 
                  marginRight: '24px',
                  boxShadow: isFocused(focusIdx) ? '0 0 30px rgba(255, 65, 153, 0.8)' : 'inset 1.1px 1.1px 12.1px 0 rgba(255, 255, 255, 0.12)' 
                }}
                data-testid={`card-similar-${similarStation._id}`}
                onClick={() => navigateToStation(similarStation)}
              >
                <div className="bg-white mx-auto mt-[34px] overflow-clip rounded-[6.6px] size-[132px]">
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
              )
            })}
          </div>

          {/* Popular Radios Section */}
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal not-italic text-[32px] text-white mb-[16px]">
            {t('popular_radios') || 'Popular Radios'}
          </p>

          {/* Popular Radios Horizontal Scroll */}
          <div ref={popularScrollRef} className="flex overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {popularStations.slice(0, 20).map((popularStation, index) => {
              const focusIdx = 30 + index; // Start after similar stations (10-29)
              return (
              <div
                key={popularStation._id || index}
                className={`flex-shrink-0 bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-all duration-200 relative ${
                  isFocused(focusIdx) 
                    ? 'border-[4px] border-[#ff4199] shadow-[0_0_30px_rgba(255,65,153,0.8)]' 
                    : 'border-[4px] border-transparent'
                }`}
                style={{ 
                  marginRight: '24px',
                  boxShadow: isFocused(focusIdx) ? '0 0 30px rgba(255, 65, 153, 0.8)' : 'inset 1.1px 1.1px 12.1px 0 rgba(255, 255, 255, 0.12)' 
                }}
                data-testid={`card-popular-${popularStation._id}`}
                onClick={() => navigateToStation(popularStation)}
              >
                <div className="bg-white mx-auto mt-[34px] overflow-clip rounded-[6.6px] size-[132px]">
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
              )
            })}
          </div>
        </div>
      </div>

      {/* Country Selector Modal */}
      {isCountrySelectorOpen && (
        <CountrySelector
          isOpen={isCountrySelectorOpen}
          onClose={() => setIsCountrySelectorOpen(false)}
          selectedCountry={selectedCountry}
          onSelectCountry={(country) => {
            console.log('[RadioPlaying] Country selected:', country);
            setCountry(country.name, country.code, country.flag);
            setIsCountrySelectorOpen(false);
          }}
        />
      )}
    </div>
  );
};
