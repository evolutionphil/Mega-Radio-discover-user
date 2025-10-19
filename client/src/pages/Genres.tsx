import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi } from "@/services/megaRadioApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { useCountry } from "@/contexts/CountryContext";
import { CountrySelector } from "@/components/CountrySelector";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";

export const Genres = (): JSX.Element => {
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  // Fetch stations from selected country to extract real genres (OPTIMIZED: 50 initial)
  const { data: stationsData } = useQuery({
    queryKey: ['/api/stations/country', selectedCountryCode],
    queryFn: () => megaRadioApi.getWorkingStations({ 
      country: selectedCountryCode,
      limit: 50 
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
      .filter(g => g.stationCount >= 3)
      .sort((a, b) => b.stationCount - a.stationCount);
  }, [stationsData]);

  const popularGenres = allGenres.slice(0, 8);

  // Calculate totalItems: 6 (sidebar) + 1 (country selector) + 8 (popular genres) + allGenres.length
  const totalItems = 6 + 1 + popularGenres.length + allGenres.length;

  // Define sidebar routes
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '#', '/settings'];

  // Custom navigation logic for complex multi-section layout
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    // Sidebar section (0-5)
    if (current >= 0 && current <= 5) {
      if (direction === 'DOWN') {
        newIndex = current < 5 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = 6; // Jump to country selector
      }
    }
    // Country selector (6)
    else if (current === 6) {
      if (direction === 'DOWN') {
        newIndex = 7; // Jump to first popular genre
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to first sidebar item
      }
    }
    // Popular genres section (7-14) - 4 cols × 2 rows
    else if (current >= 7 && current <= 14) {
      const relIndex = current - 7;
      const row = Math.floor(relIndex / 4);
      const col = relIndex % 4;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < 3 && current < 14) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 4;
        } else {
          newIndex = 6; // Jump to country selector
        }
      } else if (direction === 'DOWN') {
        if (row < 1 && current + 4 <= 14) {
          newIndex = current + 4;
        } else {
          // Jump to All genres section below (6-col grid)
          // Map to corresponding column in 6-col grid
          newIndex = 15 + Math.min(col, 5);
        }
      }
    }
    // All genres section (15+) - 6 cols grid
    else if (current >= 15) {
      const relIndex = current - 15;
      const row = Math.floor(relIndex / 6);
      const col = relIndex % 6;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < 5 && current < totalItems - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 6;
        } else {
          // Jump to popular genres above (4-col grid)
          // Map to corresponding column in 4-col grid
          const targetCol = Math.min(col, 3);
          newIndex = 11 + targetCol; // Row 2 of popular genres
        }
      } else if (direction === 'DOWN') {
        const nextIndex = current + 6;
        if (nextIndex < totalItems) {
          newIndex = nextIndex;
        }
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 1, // Start on Genres in sidebar (current page)
    onSelect: (index) => {
      // Sidebar navigation (0-5)
      if (index >= 0 && index <= 5) {
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      }
      // Country selector (6)
      else if (index === 6) {
        setIsCountrySelectorOpen(true);
      }
      // Popular genres (7-14)
      else if (index >= 7 && index <= 14) {
        const genreIndex = index - 7;
        const genre = popularGenres[genreIndex];
        if (genre) {
          setLocation(`/genre-list?genre=${encodeURIComponent(genre.name)}`);
        }
      }
      // All genres (15+)
      else if (index >= 15) {
        const genreIndex = index - 15;
        const genre = allGenres[genreIndex];
        if (genre) {
          setLocation(`/genre-list?genre=${encodeURIComponent(genre.name)}`);
        }
      }
    },
    onBack: () => {
      setLocation('/discover-no-user');
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/genres', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP || 38:
        customHandleNavigation('UP');
        break;
      case key?.DOWN || 40:
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT || 37:
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT || 39:
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER || 13:
        handleSelect();
        break;
    }
  });

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 w-[1920px] h-[1080px] overflow-y-auto overflow-x-hidden" data-testid="page-genres">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
          src="/images/hand-crowd-disco-1.png"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[18.704%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[25.787%] top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src="/images/path-8.svg"
          />
        </div>
      </div>

      {/* Equalizer Icon */}
      <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] z-50 transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
          <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
          <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
        </div>
      </div>

      {/* Country Selector */}
      <div 
        className={`absolute left-[1453px] top-[67px] flex w-[223px] h-[51px] rounded-[30px] bg-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors z-50 flex-shrink-0 ${getFocusClasses(isFocused(6))}`}
        style={{ padding: '11px 14.316px 11px 15px', justifyContent: 'center', alignItems: 'center' }}
        onClick={() => setIsCountrySelectorOpen(true)}
        data-testid="button-country-selector"
      >
        <div className="flex items-center gap-[10.66px]">
          <div className="size-[28.421px] rounded-full overflow-hidden flex-shrink-0">
            <img
              alt={selectedCountry}
              className="w-full h-full object-cover"
              src={selectedCountryFlag}
            />
          </div>
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal text-[24px] text-white whitespace-nowrap">
            {selectedCountry}
          </p>
          <div className="flex items-center justify-center ml-auto">
            <div className="rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/images/arrow.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          // Country selection is handled by CountryContext
          setIsCountrySelectorOpen(false);
        }}
      />

      {/* Left Sidebar Menu */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px] z-50">
        {/* Discover */}
        <Link href="/discover-no-user">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0 ${getFocusClasses(isFocused(0))}`} data-testid="button-discover" onClick={() => setLocation('/discover-no-user')}>
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('nav_discover') || 'Discover'}
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/radio-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres - Active */}
        <div className={`absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[108px] ${getFocusClasses(isFocused(1))}`} data-testid="button-genres">
          <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('genres') || 'Genres'}
            </p>
            <div className="absolute left-[13px] size-[32px] top-0">
              <img alt="" className="block max-w-none size-full" src="/images/music-icon.svg" />
            </div>
          </div>
        </div>

        {/* Search */}
        <Link href="/search">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px] ${getFocusClasses(isFocused(2))}`} data-testid="button-search" onClick={() => setLocation('/search')}>
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('search') || 'Search'}
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/search-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link href="/favorites">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px] ${getFocusClasses(isFocused(3))}`} data-testid="button-favorites" onClick={() => setLocation('/favorites')}>
            <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Favorites
              </p>
              <div className="absolute left-[22px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/heart-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Records */}
        <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px] ${getFocusClasses(isFocused(4))}`} data-testid="button-records">
          <div className="absolute h-[61px] left-[16px] top-[19px] w-[66px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[33px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Records
            </p>
            <div className="absolute left-[17px] size-[32px] top-0">
              <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
              <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px] ${getFocusClasses(isFocused(5))}`} data-testid="button-settings" onClick={() => setLocation('/settings')}>
            <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Settings
              </p>
              <div className="absolute left-[18px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/settings-icon.svg" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Popular Genres Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[242px]">
        {t('popular_genres') || 'Popular Genres'}
      </p>

      {/* Popular Genres - Row 1 (4 cols) */}
      {popularGenres.slice(0, 4).map((genre, index) => {
        const positions = [
          { left: 237, width: 386 },
          { left: 644, width: 387 },
          { left: 1052, width: 386 },
          { left: 1459, width: 382 },
        ];
        const focusIdx = 7 + index;
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[309px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              onClick={() => setLocation(`/genre-list?genre=${encodeURIComponent(genre.name)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
                {genre.stationCount} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[20px]" />
            </div>
          </Link>
        );
      })}

      {/* Popular Genres - Row 2 (4 cols) */}
      {popularGenres.slice(4, 8).map((genre, index) => {
        const positions = [
          { left: 237, width: 386 },
          { left: 644, width: 387 },
          { left: 1052, width: 386 },
          { left: 1459, width: 382 },
        ];
        const focusIdx = 11 + index;
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[467px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              onClick={() => setLocation(`/genre-list?genre=${encodeURIComponent(genre.name)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
                {genre.stationCount} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[20px]" />
            </div>
          </Link>
        );
      })}

      {/* All Section Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[670px]">
        All
      </p>

      {/* All Genres - Dynamic Grid (6 cols) */}
      {allGenres.map((genre, index) => {
        const positions = [
          { left: 237, width: 248 },
          { left: 504, width: 248 },
          { left: 771, width: 248 },
          { left: 1038, width: 248 },
          { left: 1305, width: 248 },
          { left: 1572, width: 248 },
        ];
        const row = Math.floor(index / 6);
        const col = index % 6;
        const topPosition = 737 + (row * 158);
        const focusIdx = 15 + index;
        
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[30px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-all-${genre.slug}`}
              style={{ 
                left: `${positions[col].left}px`, 
                width: `${positions[col].width}px`,
                top: `${topPosition}px`
              }}
              onClick={() => setLocation(`/genre-list?genre=${encodeURIComponent(genre.name)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[20px] text-center text-white">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[18px] text-center text-white">
                {genre.stationCount} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[20px]" />
            </div>
          </Link>
        );
      })}

      {/* Spacer for scrolling */}
      <div style={{ height: `${Math.max(1080, 737 + Math.ceil(allGenres.length / 6) * 158 + 200)}px` }} />
    </div>
  );
};
