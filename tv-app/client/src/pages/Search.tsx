import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";

export const Search = (): JSX.Element => {
  useTVNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Search for stations based on query
  const { data: searchData } = useQuery({
    queryKey: ['/api/stations/search', searchQuery],
    queryFn: () => megaRadioApi.searchStations({ q: searchQuery, limit: 4 }),
    enabled: searchQuery.length > 0,
  });

  // Fetch recently played (popular) stations
  const { data: recentStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 6 }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 6 }),
  });

  const searchResults = searchData?.results || [];
  const recentStations = recentStationsData?.stations || [];

  // Samsung keyboard integration - focus input and trigger native keyboard
  const handleInputFocus = () => {
    // On Samsung TV, focusing the input will automatically show the native keyboard
    if ((window as any).tizen || (window as any).webapis) {
      console.log('Samsung TV detected - native keyboard will appear');
    }
  };

  // Fallback image as SVG data URI
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

  // Helper to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query) return <span className="text-[#a5a5a5]">{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span className="text-[#a5a5a5]">{text}</span>;
    
    return (
      <>
        <span className="text-[#a5a5a5]">{text.substring(0, index)}</span>
        <span className="text-white">{text.substring(index, index + query.length)}</span>
        <span className="text-[#a5a5a5]">{text.substring(index + query.length)}</span>
      </>
    );
  };

  return (
    <div className="relative w-[1920px] h-[1080px] bg-black overflow-hidden" data-testid="page-search">
      {/* Logo - Top Left */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src="/figmaAssets/path-8.svg"
          />
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px] z-50">
        {/* Discover */}
        <Link href="/discover-no-user">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Discover
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-radio.svg"
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
                  src="/figmaAssets/vuesax-bold-musicnote.svg"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Search - Active */}
        <Link href="/search">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Search
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-search-normal.svg"
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
                  src="/figmaAssets/vuesax-bold-heart.svg"
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
                  src="/figmaAssets/vuesax-bold-setting-2.svg"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[246px] not-italic text-[32px] text-white top-[58px]">
        Search
      </p>

      {/* Search Input */}
      <div className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[91px] left-[246px] rounded-[14px] top-[136px] w-[774px]">
        <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[774px]">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Kral Ra"
            className="absolute bg-transparent border-0 font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic outline-none text-[25.94px] text-white top-[29.84px] w-[650px] placeholder:text-[rgba(255,255,255,0.5)]"
            data-testid="input-search"
            data-tv-focusable="true"
          />
          <div className="absolute left-[32.43px] size-[31.134px] top-[29.84px] pointer-events-none">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/figmaAssets/vuesax-outline-search-normal.svg"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && searchResults.map((station, index) => {
        const isFirst = index === 0;
        const topPositions = [259, 344, 429, 514];
        
        return (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className={`absolute ${isFirst ? 'bg-[rgba(255,255,255,0.28)] border-[#b4b4b4] border-[5.5px] border-solid' : 'bg-[rgba(255,255,255,0.14)]'} box-border flex items-center left-[246px] px-[50px] py-[20px] rounded-[14px] w-[348px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors`}
              style={{ top: `${topPositions[index]}px` }}
              data-testid={`result-${station.slug || station._id}`}
              data-tv-focusable="true"
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px]">
                {isFirst ? (
                  <span className="text-white">{station.name}</span>
                ) : (
                  highlightText(station.name, searchQuery)
                )}
              </p>
              <div className={`absolute ${isFirst ? 'inset-[-5.5px]' : 'inset-0'} pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] rounded-[14px]`} />
            </div>
          </Link>
        );
      })}

      {/* No results message */}
      {searchQuery.length > 0 && searchResults.length === 0 && (
        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[246px] not-italic text-[22px] text-[rgba(255,255,255,0.5)] top-[259px]">
          No stations found for "{searchQuery}"
        </p>
      )}

      {/* Samsung Native Keyboard Placeholder */}
      <div className="absolute bg-[#313131] h-[378px] left-[246px] overflow-clip rounded-[14px] top-[610px] w-[774px]">
        <p className="absolute font-['Roboto',Helvetica] font-medium leading-normal left-1/2 text-[#656565] text-[25.945px] text-center top-[calc(50%-15px)] translate-x-[-50%]">
          {(window as any).tizen || (window as any).webapis ? 'Focus search box to show keyboard' : 'Native keyboard'}
        </p>
      </div>

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[1110px] not-italic text-[32px] text-white top-[58px]">
        Recently Played
      </p>

      {/* Recently Played Stations - 2 columns x 3 rows */}
      {recentStations.map((station, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const leftPositions = [1110, 1340];
        const topPositions = [136, 430, 724];
        
        return (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" 
              style={{ 
                left: `${leftPositions[col]}px`,
                top: `${topPositions[row]}px`
              }}
              data-testid={`recent-station-${index}`}
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
    </div>
  );
};
