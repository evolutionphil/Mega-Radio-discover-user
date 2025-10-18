import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";
import { useRef, useEffect, useState } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";

export const GenreList = (): JSX.Element => {
  useTVNavigation();
  const [location] = useLocation();
  const { selectedCountryCode } = useCountry();
  const { t } = useLocalization();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Extract genre slug from URL query params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const genreSlug = urlParams.get('genre') || 'pop';
  const genreName = genreSlug.charAt(0).toUpperCase() + genreSlug.slice(1).replace(/-/g, ' ');

  // Infinite scroll state
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const STATIONS_PER_PAGE = 21; // 7 columns x 3 rows

  // Fetch stations by genre and country
  const { data: stationsData, isLoading } = useQuery({
    queryKey: ['/api/stations/genre', genreSlug, selectedCountryCode],
    queryFn: async () => {
      // Fetch stations by genre for the selected country
      const result = await megaRadioApi.getAllStations({ 
        country: selectedCountryCode,
        limit: 200,
        genre: genreSlug
      });
      return result;
    },
  });

  // Initialize when data loads - show first 21 stations
  useEffect(() => {
    if (stationsData?.stations) {
      setAllStations(stationsData.stations);
      setDisplayedStations(stationsData.stations.slice(0, STATIONS_PER_PAGE));
      setHasMore(stationsData.stations.length > STATIONS_PER_PAGE);
      setPage(1);
    }
  }, [stationsData]);

  // Reset pagination when genre or country changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setDisplayedStations([]);
    setAllStations([]);
  }, [genreSlug, selectedCountryCode]);

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

  // Fallback image
  const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#01d7fb"/><text x="100" y="120" font-size="80" fill="white" text-anchor="middle" font-family="Arial">R</text></svg>')}`;

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

  return (
    <AppLayout currentPage="genres" scrollContainerRef={scrollContainerRef}>
      <div ref={scrollContainerRef} className="relative w-[1920px] h-[1080px] overflow-y-auto" data-testid="page-genre-list">
        {/* Background Image */}
        <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src="/images/hand-crowd-disco-1.png"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bg-gradient-to-b from-[18.333%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[15.185%] top-0 w-[1920px]" />

        {/* Back Button */}
        <Link href="/genres">
          <div 
            className="absolute h-[24px] left-[236px] top-[211px] w-[71px] cursor-pointer hover:opacity-80 transition-opacity" 
            data-testid="button-back" 
            data-tv-focusable="true"
          >
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
              {t('back') || 'Back'}
            </p>
            <div className="absolute left-0 size-[24px] top-0">
              <img
                alt="back"
                className="block max-w-none size-full"
                src="images/vuesax-outline-arrow-left.svg"
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
                className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                style={{ left: `${leftPosition}px`, top: `${topPosition}px` }}
                data-testid={`station-card-${index}`}
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
