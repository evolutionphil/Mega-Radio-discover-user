import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Genre } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useCountry } from "@/contexts/CountryContext";

export const Genres = (): JSX.Element => {
  useTVNavigation();
  const { selectedCountryCode } = useCountry();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleGenresCount, setVisibleGenresCount] = useState(8); // Start with 8 genres (2 rows)

  // Fetch all genres filtered by selected country
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres', selectedCountryCode],
    queryFn: () => megaRadioApi.getAllGenres(selectedCountryCode),
  });

  // Fetch discoverable/popular genres
  const { data: discoverableGenresData } = useQuery({
    queryKey: ['/api/genres/discoverable'],
    queryFn: () => megaRadioApi.getDiscoverableGenres(),
  });

  const allGenres = genresData?.genres || [];
  const popularGenres = discoverableGenresData?.genres?.slice(0, 8) || [];
  const visibleGenres = allGenres.slice(0, visibleGenresCount);

  // Infinite scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when scrolled 70% down
      if (scrollPercentage > 0.7 && visibleGenresCount < allGenres.length) {
        console.log('[Genres] Loading more genres...', visibleGenresCount, '/', allGenres.length);
        setVisibleGenresCount(prev => Math.min(prev + 4, allGenres.length)); // Load 4 more (1 row)
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleGenresCount, allGenres.length]);

  // Card positions
  const row1Positions = [
    { left: 237, width: 386 },
    { left: 644, width: 387 },
    { left: 1052, width: 386 },
    { left: 1459, width: 382 },
  ];

  return (
    <AppLayout currentPage="genres">
      <div ref={scrollContainerRef} className="relative w-[1920px] min-h-[1080px] overflow-y-auto" data-testid="page-genres">
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
