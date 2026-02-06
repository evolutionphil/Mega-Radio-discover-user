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
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });

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

  const totalItems = 5 + 1 + 1 + popularGenres.length + allGenres.length;

  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    if (current >= 0 && current <= 4) {
      if (direction === 'DOWN') {
        newIndex = current < 4 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = 6;
      }
    }
    else if (current === 6) {
      if (direction === 'DOWN') {
        newIndex = 7;
      } else if (direction === 'LEFT') {
        newIndex = 0;
      }
    }
    else if (current >= 7 && current <= 14) {
      const relIndex = current - 7;
      const row = Math.floor(relIndex / 4);
      const col = relIndex % 4;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0;
        }
      } else if (direction === 'RIGHT') {
        if (col < 3 && current < 14) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 4;
        } else {
          newIndex = 6;
        }
      } else if (direction === 'DOWN') {
        if (row < 1 && current + 4 <= 14) {
          newIndex = current + 4;
        } else {
          newIndex = 15 + col;
        }
      }
    }
    else if (current >= 15) {
      const relIndex = current - 15;
      const row = Math.floor(relIndex / 4);
      const col = relIndex % 4;
      const totalAllGenres = allGenres.length;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0;
        }
      } else if (direction === 'RIGHT') {
        if (col < 3 && (relIndex + 1) < totalAllGenres) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          const targetIndex = current - 4;
          if (targetIndex >= 15) {
            newIndex = targetIndex;
          }
        } else {
          newIndex = 11 + col;
        }
      } else if (direction === 'DOWN') {
        const targetRelIndex = relIndex + 4;
        const targetIndex = 15 + targetRelIndex;
        
        if (targetRelIndex < totalAllGenres) {
          newIndex = targetIndex;
        }
      }
    }

    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  const [hasNavigatedToGenre, setHasNavigatedToGenre] = useState(false);
  
  useEffect(() => {
    if (!hasNavigatedToGenre && popularGenres.length > 0) {
      setFocusIndex(7);
      setHasNavigatedToGenre(true);
    }
  }, [popularGenres.length, hasNavigatedToGenre]);

  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 7,
    onSelect: (index) => {
      if (index >= 0 && index <= 4) {
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      }
      else if (index === 6) {
        setIsCountrySelectorOpen(true);
      }
      else if (index >= 7 && index <= 14) {
        const genreIndex = index - 7;
        const genre = popularGenres[genreIndex];
        if (genre) {
          const newLocation = `/genre-list/${encodeURIComponent(genre.slug)}`;
          setLocation(newLocation);
        }
      }
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

  usePageKeyHandler('/genres', (e) => {
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

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const scrollContainer = scrollContainerRef.current;
    
    if (focusIndex < 7) return;

    const focusedEl = scrollContainer.querySelector(`[data-focus-idx="${focusIndex}"]`) as HTMLElement;
    if (!focusedEl) return;

    const TOP_PADDING = 20;
    const BOTTOM_PADDING = 120;

    const viewTop = scrollContainer.scrollTop;
    const viewBottom = viewTop + scrollContainer.clientHeight - BOTTOM_PADDING;

    let elementTop = 0;
    let el: HTMLElement | null = focusedEl;
    while (el && el !== scrollContainer) {
      elementTop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }
    const elementBottom = elementTop + focusedEl.offsetHeight;

    const isAboveView = elementTop < viewTop + TOP_PADDING;
    const isBelowView = elementBottom > viewBottom;

    if (isAboveView) {
      scrollContainer.scrollTo({
        top: elementTop - TOP_PADDING,
        behavior: 'smooth'
      });
    } else if (isBelowView) {
      const newScrollTop = elementBottom - scrollContainer.clientHeight + BOTTOM_PADDING;
      scrollContainer.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    }
  }, [focusIndex]);

  const CARD_HEIGHT = 139;
  const CARD_GAP = 19;
  const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-genres">
      {/* Background Image - FIXED */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
        />
      </div>

      {/* Gradient Overlay - FIXED */}
      <div className="absolute bg-gradient-to-b from-[18.704%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[25.787%] top-0 w-[1920px]" />

      {/* Logo - FIXED */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>

      {/* Equalizer Icon - FIXED */}
      <div className={`absolute left-[1547px] overflow-clip rounded-[30px] w-[51px] h-[51px] top-[67px] z-50 transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[35.526px] left-[8.625px] overflow-clip top-[7.737px] w-[33.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[8.882px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[35.526px]'}`} style={{ height: isPlaying ? undefined : '35.526px' }} />
          <div className={`absolute bg-white left-[12.43px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[24.868px] top-[10.66px]'}`} style={{ height: isPlaying ? undefined : '24.868px', top: isPlaying ? undefined : '10.66px' }} />
          <div className={`absolute bg-white left-[24.87px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[30.197px] top-[5.33px]'}`} style={{ height: isPlaying ? undefined : '30.197px', top: isPlaying ? undefined : '5.33px' }} />
        </div>
      </div>

      {/* Country Selector Trigger - FIXED */}
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

      {/* Left Sidebar Menu - FIXED */}
      <Sidebar activePage="genres" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Scrollable Content Area - Only this part scrolls */}
      <div
        ref={scrollContainerRef}
        className="absolute left-[162px] w-[1758px] top-[200px] overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ height: '880px' }}
      >
        <div className="relative pb-[100px]" style={{ minHeight: `${100 + (2 * ROW_HEIGHT) + 80 + (Math.ceil(allGenres.length / 4) * ROW_HEIGHT) + 200}px` }}>
          {/* Popular Genres Title */}
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal not-italic text-[32px] text-white mb-[24px] ml-[75px]">
            {t('popular_genres') || 'Popular Genres'}
          </p>

          {/* Popular Genres - Row 1 (4 cols) */}
          <div className="flex gap-[19px] ml-[75px] mr-[75px] mb-[19px]">
            {popularGenres.slice(0, 4).map((genre, index) => {
              const focusIdx = 7 + index;
              return (
                <Link key={`pop1-${genre.slug || index}`} href={`/genre-list/${encodeURIComponent(genre.slug)}`} className="flex-1">
                  <div
                    data-focus-idx={focusIdx}
                    className={`bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center h-[${CARD_HEIGHT}px] px-[40px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                    data-testid={`card-genre-${genre.slug}`}
                    style={{ height: `${CARD_HEIGHT}px` }}
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
          </div>

          {/* Popular Genres - Row 2 (4 cols) */}
          <div className="flex gap-[19px] ml-[75px] mr-[75px] mb-[40px]">
            {popularGenres.slice(4, 8).map((genre, index) => {
              const focusIdx = 11 + index;
              return (
                <Link key={`pop2-${genre.slug || index}`} href={`/genre-list/${encodeURIComponent(genre.slug)}`} className="flex-1">
                  <div
                    data-focus-idx={focusIdx}
                    className={`bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center px-[40px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(focusIdx))}`}
                    data-testid={`card-genre-${genre.slug}`}
                    style={{ height: `${CARD_HEIGHT}px` }}
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
          </div>

          {/* All Section Title */}
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal not-italic text-[32px] text-white mb-[24px] ml-[75px]">
            All
          </p>

          {/* All Genres - Dynamic Grid (4 cols) using flexbox rows */}
          {Array.from({ length: Math.ceil(allGenres.length / 4) }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-[19px] ml-[75px] mr-[75px] mb-[19px]">
              {allGenres.slice(rowIdx * 4, rowIdx * 4 + 4).map((genre, colIdx) => {
                const focusIdx = 15 + (rowIdx * 4) + colIdx;
                return (
                  <Link key={`all-${rowIdx}-${genre.slug || colIdx}`} href={`/genre-list/${encodeURIComponent(genre.slug)}`} className="flex-1">
                    <div
                      data-focus-idx={focusIdx}
                      className={`bg-[rgba(255,255,255,0.14)] box-border flex flex-col items-start justify-center px-[30px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors relative ${getFocusClasses(isFocused(focusIdx))}`}
                      data-testid={`card-genre-all-${genre.slug}`}
                      style={{ height: `${CARD_HEIGHT}px` }}
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
              {/* Fill empty cells in last row to maintain consistent widths */}
              {rowIdx === Math.ceil(allGenres.length / 4) - 1 && allGenres.length % 4 !== 0 &&
                Array.from({ length: 4 - (allGenres.length % 4) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1" />
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
