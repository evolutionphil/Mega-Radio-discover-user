import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station, type Genre } from "@/services/megaRadioApi";
import { CountrySelector } from "@/components/CountrySelector";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useLocalization } from "@/contexts/LocalizationContext";

export const DiscoverNoUser = (): JSX.Element => {
  useTVNavigation();
  const { t, detectedCountry, detectedCountryCode } = useLocalization();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(detectedCountry);
  const [selectedCountryCode, setSelectedCountryCode] = useState(detectedCountryCode);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState('/images/austria-1.png');
  
  // Update country when localization detects it
  useEffect(() => {
    if (detectedCountry && detectedCountryCode) {
      setSelectedCountry(detectedCountry);
      setSelectedCountryCode(detectedCountryCode);
    }
  }, [detectedCountry, detectedCountryCode]);
  const [showHeader, setShowHeader] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  
  // Infinite scroll state for country stations
  const [allCountryStations, setAllCountryStations] = useState<Station[]>([]);
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreCountryStations, setHasMoreCountryStations] = useState(true);
  const STATIONS_PER_LOAD = 56;

  // Fetch ALL genres from API
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres/all'],
    queryFn: () => megaRadioApi.getAllGenres(),
  });

  // Fetch popular stations filtered by selected country
  const { data: popularStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 24, country: selectedCountryCode }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 24, country: selectedCountryCode }),
  });

  // Fetch ALL stations for the country (we'll paginate on frontend)
  const { data: allCountryStationsData } = useQuery({
    queryKey: ['/api/stations/country', selectedCountryCode],
    queryFn: () => megaRadioApi.getWorkingStations({ limit: 500, country: selectedCountryCode }),
  });

  // Initialize country stations when data is loaded or country changes
  useEffect(() => {
    if (allCountryStationsData?.stations) {
      console.log(`Country changed: ${selectedCountry}, total stations: ${allCountryStationsData.stations.length}`);
      setAllCountryStations(allCountryStationsData.stations);
      // Show only first 56 stations initially
      setDisplayedStations(allCountryStationsData.stations.slice(0, STATIONS_PER_LOAD));
      setCurrentOffset(STATIONS_PER_LOAD);
      const hasMore = allCountryStationsData.stations.length > STATIONS_PER_LOAD;
      setHasMoreCountryStations(hasMore);
      console.log(`Initial load: showing 56 stations, hasMore=${hasMore}`);
    }
  }, [allCountryStationsData, selectedCountryCode]);

  const genres = genresData?.genres || [];
  const popularStations = popularStationsData?.stations?.slice(0, 14) || [];

  // Load more country stations from already fetched data
  const loadMoreCountryStations = () => {
    if (isLoadingMore || !hasMoreCountryStations) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextStations = allCountryStations.slice(currentOffset, currentOffset + STATIONS_PER_LOAD);
      
      console.log(`Loading more: offset=${currentOffset}, nextStations=${nextStations.length}, total=${allCountryStations.length}`);
      
      if (nextStations.length > 0) {
        setDisplayedStations(prev => [...prev, ...nextStations]);
        const newOffset = currentOffset + STATIONS_PER_LOAD;
        setCurrentOffset(newOffset);
        const hasMore = newOffset < allCountryStations.length;
        setHasMoreCountryStations(hasMore);
        console.log(`After load: displayed=${displayedStations.length + nextStations.length}, hasMore=${hasMore}`);
      } else {
        setHasMoreCountryStations(false);
        console.log('No more stations to load');
      }
      
      setIsLoadingMore(false);
    }, 300);
  };

  // Auto-hide header on scroll down + infinite scroll for country stations
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

      // Infinite scroll logic - load more when near bottom (500px before end)
      const scrollHeight = scrollContainer.scrollHeight;
      const scrollTop = scrollContainer.scrollTop;
      const clientHeight = scrollContainer.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight < 500 && hasMoreCountryStations && !isLoadingMore) {
        loadMoreCountryStations();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMoreCountryStations, currentOffset, allCountryStations.length]);

  // Fallback image as SVG data URI
  const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#01d7fb"/><text x="100" y="120" font-size="80" fill="white" text-anchor="middle" font-family="Arial">R</text></svg>')}`;

  // Helper function to get correct asset path for both dev and Samsung TV
  const getAssetPath = (path: string) => {
    // For Samsung TV (production build), use relative paths with images/ folder
    // For dev (browser), use absolute paths with figmaAssets/
    if (import.meta.env.PROD) {
      // Production: Use images/ folder (Samsung TV standard location)
      return path.replace('figmaAssets/', 'images/');
    }
    // Development: Use figmaAssets/ folder
    return path.startsWith('/') ? path : '/' + path;
  };

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

  // Genre positions
  const genrePositions = [236, 445, 664, 916, 1142, 1394, 1646, 1872];

  // Station card positions
  const stationRow1Positions = [236, 466, 696, 926, 1156, 1386, 1616];
  const stationRow2Positions = [236, 466, 696, 926, 1156, 1386, 1616];

  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-discover-no-user">
      {/* Background Image - Fixed */}
      <div className="fixed h-[1292px] left-[-10px] top-[-523px] w-[1939px] z-0">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={getAssetPath("figmaAssets/hand-crowd-disco-1.png")}
        />
      </div>

      {/* Gradient Overlay - Fixed */}
      <div className="fixed bg-gradient-to-b from-[0.88%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[48.611%] top-0 w-[1920px] z-0" />

      {/* Logo - ALWAYS VISIBLE, NEVER HIDES */}
      <div className="fixed h-[57px] left-[30px] top-[64px] w-[164.421px] z-50 pointer-events-auto">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src={getAssetPath("figmaAssets/path-8.svg")}
          />
        </div>
      </div>

      {/* Header Controls Section - Auto-hides on scroll down (Equalizer, Country, Login) */}
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
              Login
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

      {/* Fixed Left Sidebar */}
      <div className="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto">
          {/* Discover - Active */}
          <Link href="/discover-no-user">
            <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
              <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                  Discover
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
                  Genres
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
                  Search
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
                  Favorites
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
                  Records
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
                  Settings
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

      {/* Scrollable Content Area - Moves to top when header hides */}
      <div 
        ref={scrollContainerRef}
        className="absolute left-[162px] w-[1758px] overflow-y-auto overflow-x-hidden z-1 scrollbar-hide transition-all duration-300 ease-in-out"
        style={{
          top: showHeader ? '242px' : '64px',
          height: showHeader ? '838px' : '1016px'
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
          {t('popular_genres')}
        </p>

        {/* Genre Pills - Horizontal Scrollable - All genres from API */}
        <div className="absolute left-[64px] top-[59px] w-[1620px] overflow-x-auto overflow-y-visible scrollbar-hide">
          <div className="flex gap-[20px] py-[15px] px-[10px]">
            {genres.map((genre, index) => {
              return (
                <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
                  <div 
                    className="relative bg-[rgba(255,255,255,0.14)] flex gap-[10px] items-center px-[72px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors flex-shrink-0"
                    data-tv-focusable="true"
                    data-testid={genre.slug}
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
          {t('homepage_popular_stations')}
        </p>

        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1630.5px] not-italic text-[22px] text-center text-white top-[242px] translate-x-[-50%]">
          {t('homepage_see_all')}
        </p>

        {/* Popular Radio Station Cards - Row 1 */}
        {popularStations.slice(0, 7).map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[297px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              style={{ left: `${stationRow1Positions[index] - 162}px` }}
              data-testid={`card-station-${station._id}`}
              data-tv-focusable="true"
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
        ))}

        {/* Popular Radio Station Cards - Row 2 */}
        {popularStations.slice(7, 14).map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[591px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              style={{ left: `${stationRow2Positions[index] - 162}px` }}
              data-testid={`card-station-${station._id}`}
              data-tv-focusable="true"
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
        ))}

        {/* See More Card */}
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1454px] overflow-clip rounded-[11px] top-[591px] w-[200px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100.5px] not-italic text-[22px] text-center text-white top-[120px] translate-x-[-50%]">
            See More
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>

        {/* More From [Country] Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[74px] not-italic text-[32px] text-white top-[939px]">
          {t('more_from')} {selectedCountry}
        </p>

        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1630.5px] not-italic text-[22px] text-center text-white top-[944px] translate-x-[-50%]">
          {t('homepage_see_all')}
        </p>

        {/* Country Stations - Dynamic Rows with Infinite Scroll */}
        {displayedStations.map((station, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const positions = [236, 466, 696, 926, 1156, 1386, 1616];
          const topPosition = 1013 + (row * 294); // 294px between rows
          
          return (
            <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
              <div 
                className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                style={{ 
                  left: `${positions[col] - 162}px`,
                  top: `${topPosition}px`
                }}
                data-testid={`card-station-${station._id}`}
                data-tv-focusable="true"
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
            Loading more stations...
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
          setSelectedCountry(country.name);
          setSelectedCountryCode(country.code);
          setSelectedCountryFlag(country.flag);
        }}
      />
    </div>
  );
};
