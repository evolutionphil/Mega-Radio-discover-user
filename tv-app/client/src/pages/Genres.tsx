import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useEffect, useRef, useMemo, useState } from "react";
import { useCountry } from "@/contexts/CountryContext";
import { CountrySelector } from "@/components/CountrySelector";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useLocalization } from "@/contexts/LocalizationContext";

export const Genres = (): JSX.Element => {
  useTVNavigation();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

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
      .filter(g => g.stationCount >= 3)
      .sort((a, b) => b.stationCount - a.stationCount);
  }, [stationsData]);

  const popularGenres = allGenres.slice(0, 8);

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
        className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1453px] overflow-clip rounded-[30px] top-[67px] w-[223px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors z-50"
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
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={selectedCountryFlag}
            />
          </div>
          <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/images/vuesax-outline-arrow-left.svg"
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
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('nav_discover') || 'Discover'}
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-radio.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres - Active */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres" data-tv-focusable="true">
          <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('genres') || 'Genres'}
            </p>
            <div className="absolute left-[13px] size-[32px] top-0">
              <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-musicnote.svg" />
            </div>
          </div>
        </div>

        {/* Search */}
        <Link href="/search">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('search') || 'Search'}
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-search-normal.svg" />
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
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-heart.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Records */}
        <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px]" data-testid="button-records" data-tv-focusable="true">
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
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Settings
              </p>
              <div className="absolute left-[18px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-setting-2.svg" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Popular Genres Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[242px]">
        {t('popular_genres') || 'Popular Genres'}
      </p>

      {/* Popular Genres - Row 1 */}
      {popularGenres.slice(0, 4).map((genre, index) => {
        const positions = [
          { left: 237, width: 386 },
          { left: 644, width: 387 },
          { left: 1052, width: 386 },
          { left: 1459, width: 382 },
        ];
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[309px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              data-tv-focusable="true"
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

      {/* Popular Genres - Row 2 */}
      {popularGenres.slice(4, 8).map((genre, index) => {
        const positions = [
          { left: 237, width: 386 },
          { left: 644, width: 387 },
          { left: 1052, width: 386 },
          { left: 1459, width: 382 },
        ];
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[467px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              data-testid={`card-genre-${genre.slug}`}
              style={{ left: `${positions[index].left}px`, width: `${positions[index].width}px` }}
              data-tv-focusable="true"
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

      {/* All Genres - Dynamic Grid */}
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
        
        return (
          <Link key={genre.slug || index} href={`/genre-list?genre=${encodeURIComponent(genre.name)}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              data-testid={`card-genre-all-${genre.slug}`}
              style={{ 
                left: `${positions[col].left}px`, 
                width: `${positions[col].width}px`,
                top: `${topPosition}px`
              }}
              data-tv-focusable="true"
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

      {/* Spacer for scrolling */}
      <div style={{ height: `${Math.max(1080, 737 + Math.ceil(allGenres.length / 4) * 158 + 200)}px` }} />
    </div>
  );
};
