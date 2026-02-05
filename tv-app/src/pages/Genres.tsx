import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi } from "@/services/megaRadioApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { useCountry } from "@/contexts/CountryContext";
import { CountrySelector } from "@/components/CountrySelector";
import { CountryTrigger } from "@/components/CountryTrigger";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const Genres = (): JSX.Element => {
  const { selectedCountry, selectedCountryCode, selectedCountryFlag, setCountry } = useCountry();
  const { isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  // FETCH COUNTRY-FILTERED GENRES using getAllGenres with selected country (or global if GLOBAL selected)
  // CACHE: 7 days
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres', selectedCountryCode],
    queryFn: async () => {
      if (selectedCountryCode === 'GLOBAL') {
        const result = await megaRadioApi.getAllGenres();
        return result;
      }
      const result = await megaRadioApi.getAllGenres(selectedCountryCode);
      return result;
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Extract genres from API response (NEVER hardcoded!)
  const allGenres = useMemo(() => {
    if (!genresData?.genres) {
      return [];
    }
    
    return genresData.genres.map(genre => ({
      name: genre.name,
      slug: genre.name.toLowerCase().replace(/\s+/g, '-'),
      stationCount: genre.stationCount || 0
    }));
  }, [genresData]);

  const popularGenres = allGenres.slice(0, 8);

  // Calculate totalItems: 5 (sidebar) + 1 (equalizer) + 1 (country selector) + 8 (popular genres) + allGenres.length
  const totalItems = 5 + 1 + 1 + popularGenres.length + allGenres.length;

  // Define sidebar routes (NO PROFILE - 5 items)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

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
          // Jump to All genres section below (same 4-col grid)
          // Same column alignment
          newIndex = 15 + col;
        }
      }
    }
    // All genres section (15+) - 4 cols grid (SAME as popular genres)
    else if (current >= 15) {
      const relIndex = current - 15;
      const row = Math.floor(relIndex / 4);
      const col = relIndex % 4;
      const totalAllGenres = allGenres.length;

      if (direction === 'LEFT') {
        // Only move left if not in first column
        if (col > 0) {
          newIndex = current - 1;
        } else {
          // First column - jump to sidebar
          newIndex = 0;
        }
      } else if (direction === 'RIGHT') {
        // Only move right if not in last column AND next genre exists
        if (col < 3 && (relIndex + 1) < totalAllGenres) {
          newIndex = current + 1;
        }
        // Otherwise stay at current position
      } else if (direction === 'UP') {
        // Only move up if not in first row
        if (row > 0) {
          const targetIndex = current - 4;
          // Make sure target genre exists
          if (targetIndex >= 15) {
            newIndex = targetIndex;
          }
        } else {
          // First row - jump to popular genres above (same 4-col grid alignment)
          newIndex = 11 + col; // Row 2 of popular genres, same column
        }
      } else if (direction === 'DOWN') {
        // Calculate the target position in the next row (same column)
        const targetRelIndex = relIndex + 4;
        const targetIndex = 15 + targetRelIndex;
        
        // Only move down if the target genre actually exists
        if (targetRelIndex < totalAllGenres) {
          newIndex = targetIndex;
        }
        // Target doesn't exist - stay at current position
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // When navigating from another page, jump to first genre instead of sidebar
  const [hasNavigatedToGenre, setHasNavigatedToGenre] = useState(false);
  
  useEffect(() => {
    // On first mount, jump to first popular genre
    if (!hasNavigatedToGenre && popularGenres.length > 0) {
      setFocusIndex(7); // First popular genre (index 7)
      setHasNavigatedToGenre(true);
    }
  }, [popularGenres.length, hasNavigatedToGenre]);

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 7, // Start on first popular genre
    onSelect: (index) => {
      // Sidebar navigation (0-4) - 5 items
      if (index >= 0 && index <= 4) {
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
          const newLocation = `/genre-list/${encodeURIComponent(genre.slug)}`;
          setLocation(newLocation);
        }
      }
      // All genres (15+)
      else if (index >= 15) {
        const genreIndex = index - 15;
        const genre = allGenres[genreIndex];
        if (genre) {
          const newLocation = `/genre-list/${encodeURIComponent(genre.slug)}`;
          setLocation(newLocation);
        }
      }
    },
    onBack: () => {
      setLocation('/discover-no-user');
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/genres', (e) => {
    // Ignore all key events when country selector modal is open
    if (isCountrySelectorOpen) {
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
        handleSelect();
        break;
    }
  });

  // Auto-scroll to show focused genre
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const scrollContainer = scrollContainerRef.current;
    let scrollTarget = 0;

    // Determine scroll position based on focused section
    if (focusIndex >= 0 && focusIndex <= 6) {
      // Sidebar or country selector - stay at top
      scrollTarget = 0;
    } else if (focusIndex >= 7 && focusIndex <= 10) {
      // Popular genres row 1 - stay at top to see title
      scrollTarget = 0;
    } else if (focusIndex >= 11 && focusIndex <= 14) {
      // Popular genres row 2 - scroll slightly to show both rows
      scrollTarget = 150;
    } else if (focusIndex >= 15) {
      // All genres section - scroll more to show the grid
      const genreIndex = focusIndex - 15;
      const row = Math.floor(genreIndex / 4);
      // Base offset (400px for popular genres) + row height (170px per row)
      scrollTarget = 400 + (row * 170);
    }

    scrollContainer.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  }, [focusIndex]);

  return (
    <div ref={scrollContainerRef} className="absolute inset-0 w-[1920px] h-[1080px] overflow-y-auto overflow-x-hidden" data-testid="page-genres">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
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
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>

      {/* Equalizer Icon - Matching Global Player Animation */}
      <div className={`absolute left-[1547px] overflow-clip rounded-[30px] size-[51px] top-[67px] z-50 transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
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
        focusClasses={getFocusClasses(isFocused(6))}
        className="absolute left-[1618px] top-[67px] z-50"
      />

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          setCountry(country.name, country.code, country.flag);
          setIsCountrySelectorOpen(false);
        }}
      />

      {/* Left Sidebar Menu */}
      <Sidebar activePage="genres" isFocused={isFocused} getFocusClasses={getFocusClasses} />

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
          <Link key={genre.slug || index} href={`/genre-list/${encodeURIComponent(genre.slug)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center h-[139px] px-[40px] py-[28px] rounded-[20px] top-[309px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              onClick={() => setLocation(`/genre-list/${encodeURIComponent(genre.slug)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[24px] text-left text-white truncate w-full">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic text-[22px] text-left text-white mt-1">
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
          <Link key={genre.slug || index} href={`/genre-list/${encodeURIComponent(genre.slug)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center h-[139px] px-[40px] py-[28px] rounded-[20px] top-[467px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              onClick={() => setLocation(`/genre-list/${encodeURIComponent(genre.slug)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[24px] text-left text-white truncate w-full">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic text-[22px] text-left text-white mt-1">
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

      {/* All Genres - Dynamic Grid (4 cols) */}
      {allGenres.map((genre, index) => {
        const positions = [
          { left: 237, width: 386 },
          { left: 644, width: 387 },
          { left: 1052, width: 386 },
          { left: 1459, width: 382 },
        ];
        const row = Math.floor(index / 4);
        const col = index % 4;
        const topPosition = 737 + (row * 158);
        const focusIdx = 15 + index;
        
        return (
          <Link key={genre.slug || index} href={`/genre-list/${encodeURIComponent(genre.slug)}`}>
            <div 
              className={`absolute bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center h-[139px] px-[30px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
              data-testid={`card-genre-all-${genre.slug}`}
              style={{ 
                left: `${positions[col].left}px`, 
                width: `${positions[col].width}px`,
                top: `${topPosition}px`
              }}
              onClick={() => setLocation(`/genre-list/${encodeURIComponent(genre.slug)}`)}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[24px] text-left text-white truncate w-full">
                {genre.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] leading-normal not-italic text-[22px] text-left text-white mt-1">
                {genre.stationCount} Stations
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[20px]" />
            </div>
          </Link>
        );
      })}

      {/* Spacer for scrolling */}
      <div style={{ height: `${Math.max(1080, 737 + Math.ceil(allGenres.length / 4) * 158 + 200)}px` }} />
    </div>
  );
};
