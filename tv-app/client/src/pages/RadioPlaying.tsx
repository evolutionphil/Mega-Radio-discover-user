import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useCountry } from "@/contexts/CountryContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { CountrySelector } from "@/components/CountrySelector";

// Asset path helper
function getAssetPath(path: string) {
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

export const RadioPlaying = (): JSX.Element => {
  useTVNavigation();
  const [location] = useLocation();
  const { t } = useLocalization();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag, setCountry } = useCountry();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playStation, togglePlayPause, isPlaying, isBuffering } = useGlobalPlayer();
  
  // Station history for Previous button (stores station IDs)
  const stationHistoryRef = useRef<string[]>([]);
  const isNavigatingBackRef = useRef(false);
  
  // Force update trigger for station changes
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Country selector state
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  
  // Similar stations scroll ref
  const similarScrollRef = useRef<HTMLDivElement>(null);
  
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

  // Fetch similar stations
  const { data: similarData } = useQuery({
    queryKey: ['similar-stations', stationId, station?.countrycode || station?.country],
    queryFn: async () => {
      if (!station) return { stations: [] };
      const countryCode = station.countrycode || station.country;
      if (countryCode) {
        return megaRadioApi.getWorkingStations({ 
          limit: 50, 
          country: countryCode 
        });
      }
      return megaRadioApi.getSimilarStations(stationId!, 50);
    },
    enabled: !!stationId && !!station,
  });

  const similarStations = similarData?.stations || [];

  // Auto-play when station loads using global player
  useEffect(() => {
    if (station) {
      console.log('[RadioPlaying] Auto-playing station via global player:', station.name);
      playStation(station);
    }
  }, [station]);

  // Auto-focus play/pause button when station loads
  useEffect(() => {
    if (station && window.tvSpatialNav) {
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

  if (!station) {
    return (
      <div className="fixed inset-0 w-[1920px] h-[1080px] bg-black flex items-center justify-center">
        <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-white">Loading...</p>
      </div>
    );
  }

  const stationTags = getStationTags(station);
  const codec = station.codec || 'MP3';
  const bitrate = station.bitrate ? `${station.bitrate}kb` : '128kb';
  const countryCode = station.countrycode || station.countryCode || 'XX';

  return (
    <div className="fixed inset-0 w-[1920px] h-[1080px] bg-black overflow-y-auto scrollbar-hide">

      {/* Logo */}
      <div className="absolute h-[57px] left-[31px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] font-normal leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <svg viewBox="0 0 57 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M22.6604 0L0 27.5L22.6604 55L45.3208 27.5L22.6604 0Z" fill="#FF4199"/>
            <path d="M34.0189 0L11.3585 27.5L34.0189 55L56.6792 27.5L34.0189 0Z" fill="#01D7FB"/>
          </svg>
        </div>
      </div>

      {/* User Profile (Top Right) */}
      <div className="absolute h-[66px] left-[1648px] top-[59px] w-[193px]">
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[54.5px] not-italic text-[24px] text-center text-white top-[19px] translate-x-[-50%]">
          {t('user_name') || 'Guest'}
        </p>
        <div className="absolute left-[127px] rounded-[73.333px] size-[66px] top-0 bg-gradient-to-br from-[#ff4199] to-[#01d7fb]" />
      </div>

      {/* Country Selector */}
      <div 
        className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1351px] overflow-clip rounded-[30px] top-[67px] w-[223px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors"
        onClick={() => setIsCountrySelectorOpen(true)}
        data-testid="button-country-selector"
        data-tv-focusable="true"
      >
        <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
            {selectedCountry}
          </p>
          <div className="absolute left-0 size-[28.421px] top-0 rounded-full overflow-hidden">
            <img 
              src={`https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png`}
              alt={selectedCountry}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equalizer Icon (Top Right) */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1281px] overflow-clip rounded-[30px] size-[51px] top-[67px]">
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
          <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
          <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
        </div>
      </div>

      {/* Left Menu / Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px]">
        {/* Discover - Active */}
        <Link href="/discover-no-user">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
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
        <div className="absolute bg-[#ff4199] h-[35px] left-0 rounded-[10px] top-0 w-[8.75px]" />
        <div className="absolute bg-[#ff4199] h-[24.5px] left-[12.25px] rounded-[10px] top-[10.5px] w-[8.75px]" />
        <div className="absolute bg-[#ff4199] h-[29.75px] left-[24.5px] rounded-[10px] top-[5.25px] w-[8.75px]" />
      </div>

      {/* Station Name */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[48px] text-white top-[293px]">
        {station.name}
      </p>

      {/* Now Playing */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[32px] text-white top-[356.71px]">
        {metadata?.title || 'Now Playing'}
      </p>

      {/* Station Info Label */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[596px] not-italic text-[24px] text-white top-[425px]">
        Station Info
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
          className="absolute bg-black left-0 overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
          onClick={handlePrevious}
          data-tv-focusable="true"
          data-testid="button-previous"
        >
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.375 16.9792L23.6042 27.75L34.375 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.1458 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Play/Pause Button */}
        <div 
          className="absolute bg-black left-[126.27px] overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
          onClick={handlePlayPause}
          data-tv-focusable="true"
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
          className="absolute bg-black left-[252.54px] overflow-clip rounded-[45.096px] size-[90.192px] top-0 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
          onClick={handleNext}
          data-tv-focusable="true"
          data-testid="button-next"
        >
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.625 16.9792L31.3958 27.75L20.625 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38.8542 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Favorite Button */}
        <div 
          className={`absolute border-[3.608px] border-solid left-[378.81px] rounded-[72.655px] size-[90.192px] top-0 cursor-pointer transition-colors flex items-center justify-center ${
            isFavorite(station._id) 
              ? 'bg-[#ff4199] border-[#ff4199] hover:bg-[#e0368a]' 
              : 'border-black hover:bg-[rgba(255,255,255,0.1)]'
          }`}
          onClick={() => toggleFavorite(station)}
          data-tv-focusable="true"
          data-testid="button-favorite"
        >
          <svg className="size-[50.508px]" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 44.625C24.7396 44.625 23.9792 44.3958 23.3604 43.9375C18.9375 40.6042 14.9479 37.6771 11.9792 34.7917C7.44792 30.3479 4.25 26.2646 4.25 20.625C4.25 12.6667 10.5 6.375 18.0625 6.375C21.6042 6.375 24.9167 8.14583 27.125 11.1354C29.3333 8.14583 32.6458 6.375 36.1875 6.375C43.75 6.375 50 12.6667 50 20.625C50 26.2646 46.8021 30.3479 42.2708 34.8125C39.3021 37.6979 35.3125 40.625 30.8896 43.9583C30.2708 44.3958 29.5104 44.625 28.75 44.625H25.5Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Similar Radios Section */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[659px]">
        Similar Radios
      </p>

      <p 
        className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[665px] translate-x-[-50%] cursor-pointer hover:text-gray-300"
        data-tv-focusable="true"
      >
        See More
      </p>

      {/* Similar Radios Horizontal Scroll */}
      <div 
        ref={similarScrollRef}
        className="absolute left-[236px] top-[733px] flex gap-[19px] overflow-x-auto scrollbar-hide w-[1610px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {similarStations.slice(0, 8).map((similarStation, index) => (
          <div
            key={similarStation._id || index}
            className="flex-shrink-0 bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            data-testid={`card-similar-${similarStation._id}`}
            data-tv-focusable="true"
            onClick={() => navigateToStation(similarStation)}
          >
            <div className="bg-white left-[34px] ml-[34px] mt-[34px] overflow-clip rounded-[6.6px] size-[132px]">
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
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
          </div>
        ))}
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
