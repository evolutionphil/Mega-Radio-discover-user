import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useTVNavigation } from "@/hooks/useTVNavigation";

export const Search = (): JSX.Element => {
  useTVNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Search for stations based on query
  const { data: searchData } = useQuery({
    queryKey: ['/api/stations/search', searchQuery],
    queryFn: () => megaRadioApi.searchStations({ q: searchQuery, limit: 4 }),
    enabled: searchQuery.length > 0,
  });

  // Fetch recently played (popular) stations
  const { data: recentStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 3 }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 3 }),
  });

  const searchResults = searchData?.results || [];
  const recentStations = recentStationsData?.stations || [];

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
    if (!query) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="text-white">{text.substring(index, index + query.length)}</span>
        <span className="text-[#a5a5a5]">{text.substring(index + query.length)}</span>
      </>
    );
  };

  return (
    <div className="relative w-[1920px] h-[1080px] bg-black overflow-hidden" data-testid="page-search">
      {/* Search Input */}
      <div className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[91px] left-[308px] rounded-[14px] top-[136px] w-[968px]">
        <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[968px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for stations..."
            className="absolute bg-transparent border-0 font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic outline-none text-[25.94px] text-white top-[29.84px] w-[850px] placeholder:text-[rgba(255,255,255,0.5)]"
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

      {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[308px] not-italic text-[32px] text-white top-[58px]">
        Search
      </p>

      {/* Native Keyboard */}
      <div className="absolute bg-[#313131] h-[378px] left-[308px] overflow-clip rounded-[14px] top-[610px] w-[1006px]">
        <p className="absolute font-['Roboto',Helvetica] font-medium leading-normal left-1/2 text-[#656565] text-[25.945px] text-center top-[calc(50%-15px)] translate-x-[-50%]">
          Native keyboard
        </p>
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && searchResults.map((station, index) => {
        const isFirst = index === 0;
        const topPositions = [259, 344, 429, 514];
        
        return (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className={`absolute ${isFirst ? 'bg-[rgba(255,255,255,0.28)] border-[#b4b4b4] border-[5.5px] border-solid' : 'bg-[rgba(255,255,255,0.14)]'} box-border content-stretch flex gap-[10px] items-start left-[308px] px-[50px] py-[20px] rounded-[14px]`}
              style={{ top: `${topPositions[index]}px` }}
              data-testid={`result-${station.slug || station._id}`}
              data-tv-focusable="true"
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center">
                {isFirst ? (
                  <span className="text-white">{station.name}</span>
                ) : (
                  highlightText(station.name, searchQuery)
                )}
              </p>
              <div className={`absolute ${isFirst ? 'inset-[-5.5px]' : 'inset-0'} pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]`} />
            </div>
          </Link>
        );
      })}

      {/* No results message */}
      {searchQuery.length > 0 && searchResults.length === 0 && (
        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[308px] not-italic text-[22px] text-[rgba(255,255,255,0.5)] top-[259px]">
          No stations found for "{searchQuery}"
        </p>
      )}

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[1394px] not-italic text-[32px] text-white top-[58px]">
        Recently Played
      </p>

      {/* Recently Played Stations */}
      {recentStations.map((station, index) => {
        const topPositions = [136, 430, 724];
        
        return (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1394px] overflow-clip rounded-[11px] w-[200px]" 
              style={{ top: `${topPositions[index]}px` }}
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

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px]">
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

      {/* Equalizer */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px]">
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
          <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
          <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
        </div>
      </div>

      {/* Country Selector */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1453px] overflow-clip rounded-[30px] top-[67px] w-[223px]">
        <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
            Austria
          </p>
          <div className="absolute left-0 size-[28.421px] top-0">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src="/figmaAssets/austria-1.png"
            />
          </div>
          <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-outline-arrow-left.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <Link href="/login">
        <div className="absolute bg-[rgba(255,255,255,0.1)] h-[52px] left-[1695px] overflow-clip rounded-[30px] top-[66px] w-[146px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors" data-testid="button-login-header" data-tv-focusable="true">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[57.08px] not-italic text-[24px] text-white top-[12px]">
            Login
          </p>
          <div className="absolute left-[13px] size-[34px] top-[9px]">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/figmaAssets/vuesax-bold-setting-2.svg"
            />
          </div>
        </div>
      </Link>

      {/* Left Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px]">
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
    </div>
  );
};
