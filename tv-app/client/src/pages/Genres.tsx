import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Genre } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";

export const Genres = (): JSX.Element => {
  useTVNavigation();
  const { selectedCountryCode } = useCountry();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleGenresCount, setVisibleGenresCount] = useState(8); // Start with 8 genres (2 rows)

  // Fetch stations from selected country to extract real genres
  const { data: stationsData } = useQuery({
    queryKey: ['/api/stations/country', selectedCountryCode],
    queryFn: () => megaRadioApi.getWorkingStations({ 
      country: selectedCountryCode,
      limit: 500 
    }),
  });

  // Extract unique genres from stations' tags
  const allGenres = useMemo(() => {
    if (!stationsData?.stations) return [];
    
    const genreMap = new Map<string, { name: string; slug: string; stationCount: number }>();
    
    stationsData.stations.forEach(station => {
      if (!station.tags) return;
      
      const tags = Array.isArray(station.tags) 
        ? station.tags 
        : station.tags.split(',').map(t => t.trim());
      
      tags.forEach(tag => {
        if (!tag) return;
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        
        if (genreMap.has(slug)) {
          genreMap.get(slug)!.stationCount++;
        } else {
          genreMap.set(slug, {
            name: tag,
            slug: slug,
            stationCount: 1
          });
        }
      });
    });
    
    // Convert to array and sort by station count (most popular first)
    return Array.from(genreMap.values())
      .filter(g => g.stationCount >= 3) // Only show genres with at least 3 stations
      .sort((a, b) => b.stationCount - a.stationCount);
  }, [stationsData]);

  // Popular Genres: Show first 8 genres from selected country
  const popularGenres = allGenres.slice(0, 8);
  const visibleGenres = allGenres.slice(0, visibleGenresCount);

  // Infinite scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.log('[Genres] No scroll container found');
      return;
    }

    console.log('[Genres] Scroll container attached. Total genres:', allGenres.length, 'Visible:', visibleGenresCount);

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      console.log('[Genres] Scroll event:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollPercentage: (scrollPercentage * 100).toFixed(1) + '%',
        visibleGenresCount,
        allGenresLength: allGenres.length
      });

      // Load more when scrolled 50% down (more aggressive for TV navigation)
      if (scrollPercentage > 0.5 && visibleGenresCount < allGenres.length) {
        console.log('[Genres] Loading more genres...', visibleGenresCount, '/', allGenres.length);
        setVisibleGenresCount(prev => Math.min(prev + 8, allGenres.length)); // Load 8 more (2 rows)
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    // Trigger initial check in case content already needs loading
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleGenresCount, allGenres.length]);

  // Auto-scroll to keep focused element visible when navigating with TV remote
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleFocusChange = () => {
      const focused = document.querySelector('[data-tv-focusable]:focus') as HTMLElement;
      if (!focused) return;

      const containerRect = container.getBoundingClientRect();
      const focusedRect = focused.getBoundingClientRect();

      // Check if element is below the visible area
      if (focusedRect.bottom > containerRect.bottom) {
        const scrollAmount = focusedRect.bottom - containerRect.bottom + 50;
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        console.log('[Genres] Auto-scrolling down to show focused element');
      }
      // Check if element is above the visible area
      else if (focusedRect.top < containerRect.top) {
        const scrollAmount = focusedRect.top - containerRect.top - 50;
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        console.log('[Genres] Auto-scrolling up to show focused element');
      }
    };

    // Listen for focus changes
    document.addEventListener('focusin', handleFocusChange);
    return () => document.removeEventListener('focusin', handleFocusChange);
  }, []);

  // Card positions
  const row1Positions = [
    { left: 237, width: 386 },
    { left: 644, width: 387 },
    { left: 1052, width: 386 },
    { left: 1459, width: 382 },
  ];

  return (
    <AppLayout currentPage="genres" scrollContainerRef={scrollContainerRef}>
      <div ref={scrollContainerRef} className="relative w-[1920px] h-[1080px] overflow-y-auto" data-testid="page-genres">
        {/* Background Image */}
        <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src="/images/hand-crowd-disco-1.png"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bg-gradient-to-b from-[18.704%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[25.787%] top-0 w-[1920px]" />

        {/* Popular Genres Title */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[242px]">
          Popular Genres
        </p>

        {/* Popular Genres - Row 1 */}
        {popularGenres.slice(0, 4).map((genre, index) => (
          <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[309px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              data-testid={`card-genre-${index}`}
              style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
              data-tv-focusable="true"
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-left text-white truncate w-full">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-left text-white">
                {genre.stationCount || 0} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
          </Link>
        ))}

        {/* Popular Genres - Row 2 */}
        {popularGenres.slice(4, 8).map((genre, index) => (
          <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[467px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              data-testid={`card-genre-${index + 4}`}
              style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
              data-tv-focusable="true"
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-left text-white truncate w-full">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-left text-white">
                {genre.stationCount || 0} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
          </Link>
        ))}

        {/* All Section Title */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[670px]">
          All
        </p>

        {/* All Genres - Dynamic Grid (Scrollable with Lazy Loading) */}
        {visibleGenres.map((genre, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const topPosition = 737 + (row * 158); // 737px start, 158px between rows
          
          return (
            <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
              <div 
                className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
                data-testid={`card-genre-all-${index}`}
                style={{ 
                  left: `${row1Positions[col].left}px`, 
                  width: `${row1Positions[col].width}px`,
                  top: `${topPosition}px`
                }}
                data-tv-focusable="true"
              >
                <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-left text-white truncate w-full">
                  {genre.name}
                </p>
                <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-left text-white">
                  {genre.stationCount || 0} Stations
                </p>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
              </div>
            </Link>
          );
        })}

        {/* Loading indicator - shown when there are more genres to load */}
        {visibleGenresCount < allGenres.length && (
          <div 
            className="absolute left-[850px] text-center text-white"
            style={{ top: `${737 + Math.ceil(visibleGenresCount / 4) * 158 + 20}px` }}
          >
            <p className="font-['Ubuntu',Helvetica] font-medium text-[20px] text-[rgba(255,255,255,0.6)]">
              Loading more genres... ({visibleGenresCount} / {allGenres.length})
            </p>
          </div>
        )}

        {/* Spacer to ensure scrolling works */}
        <div style={{ height: `${Math.max(1080, 737 + Math.ceil(allGenres.length / 4) * 158 + 200)}px` }} />
      </div>
    </AppLayout>
  );
};
