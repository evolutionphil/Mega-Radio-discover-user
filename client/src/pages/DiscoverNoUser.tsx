import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station, type Genre } from "@/services/megaRadioApi";

export const DiscoverNoUser = (): JSX.Element => {
  // Fetch popular genres
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres/discoverable'],
    queryFn: () => megaRadioApi.getDiscoverableGenres(),
  });

  // Fetch popular stations
  const { data: popularStationsData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 24 }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 24 }),
  });

  // Fetch more popular stations for "More From Austria" section
  // Note: API country filter doesn't work reliably, using search instead
  const { data: austriaStationsData } = useQuery({
    queryKey: ['/api/stations/search-austria', { limit: 15 }],
    queryFn: () => megaRadioApi.searchStations({ q: 'austria', limit: 15 }),
  });

  const genres = genresData?.genres?.slice(0, 8) || [];
  const popularStations = popularStationsData?.stations?.slice(0, 14) || [];
  const austriaStations = austriaStationsData?.results?.slice(0, 15) || [];

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    if (station.favicon) {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return '/figmaAssets/powerturk-tv-logosu-1.png';
  };

  // Genre positions
  const genrePositions = [236, 445, 664, 916, 1142, 1394, 1646, 1872];

  // Station card positions
  const stationRow1Positions = [236, 466, 696, 926, 1156, 1386, 1616];
  const stationRow2Positions = [236, 466, 696, 926, 1156, 1386, 1616];

  return (
    <div className="relative w-[1920px] min-h-[1080px] bg-[#0e0e0e] overflow-y-auto" data-testid="page-discover-no-user">
      {/* Background Image - Fixed */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px] z-0">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src="/figmaAssets/hand-crowd-disco-1.png"
        />
      </div>

      {/* Gradient Overlay - Fixed */}
      <div className="absolute bg-gradient-to-b from-[0.88%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[48.611%] top-0 w-[1920px] z-0" />

      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 w-[1920px] h-[242px] z-10 pointer-events-none">
        {/* Logo */}
        <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] pointer-events-auto">
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
        <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] pointer-events-auto">
          <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
            <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
            <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
            <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
          </div>
        </div>

        {/* Country Selector */}
        <div className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1453px] overflow-clip rounded-[30px] top-[67px] w-[223px] pointer-events-auto">
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
          <div className="absolute bg-[rgba(255,255,255,0.1)] h-[52px] left-[1695px] overflow-clip rounded-[30px] top-[66px] w-[146px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors pointer-events-auto" data-testid="button-login-header">
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
        <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px] pointer-events-auto">
          {/* Discover - Active */}
          <Link href="/discover-no-user">
            <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover">
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
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres">
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

          {/* Search */}
          <Link href="/search">
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search">
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
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px]" data-testid="button-favorites">
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
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px]" data-testid="button-records">
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
            <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings">
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

      {/* Scrollable Content */}
      <div className="relative pt-[242px] pb-[30px] z-1">
        {/* Popular Genres Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
          Popular Genres
        </p>

        {/* Genre Pills - Dynamic from API */}
        {genres.map((genre, index) => {
          const isHighlighted = index === 2;
          return (
            <div 
              key={genre.slug || index}
              className={`absolute bg-[rgba(255,255,255,0.14)] ${isHighlighted ? 'border-[#b4b4b4] border-[5.5px] border-solid' : ''} box-border content-stretch flex gap-[10px] items-start px-[72px] py-[28px] rounded-[20px] top-[316px]`}
              style={{ left: `${genrePositions[index]}px` }}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
                {genre.name}
              </p>
              <div className={`absolute ${isHighlighted ? 'inset-[-5.5px]' : 'inset-0'} pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]`} />
            </div>
          );
        })}

        {/* Popular Radios Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[465px]">
          Popular Radios
        </p>

        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[484px] translate-x-[-50%]">
          See More
        </p>

        {/* Popular Radio Station Cards - Row 1 */}
        {popularStations.slice(0, 7).map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[539px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              style={{ left: `${stationRow1Positions[index]}px` }}
              data-testid={`card-station-${station._id}`}
            >
              <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                <img
                  alt={station.name}
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  src={getStationImage(station)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/figmaAssets/powerturk-tv-logosu-1.png';
                  }}
                />
              </div>
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.name}
              </p>
              <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.tags?.[0] || station.country || 'Radio'}
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
          </Link>
        ))}

        {/* Popular Radio Station Cards - Row 2 */}
        {popularStations.slice(7, 14).map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[833px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              style={{ left: `${stationRow2Positions[index]}px` }}
              data-testid={`card-station-${station._id}`}
            >
              <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                <img
                  alt={station.name}
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  src={getStationImage(station)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/figmaAssets/powerturk-tv-logosu-1.png';
                  }}
                />
              </div>
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.name}
              </p>
              <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.tags?.[0] || station.country || 'Radio'}
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
          </Link>
        ))}

        {/* See More Card */}
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1616px] overflow-clip rounded-[11px] top-[833px] w-[200px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100.5px] not-italic text-[22px] text-center text-white top-[120px] translate-x-[-50%]">
            See More
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>

        {/* More From Austria Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[1181px]">
          More From Austria
        </p>

        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[1186px] translate-x-[-50%]">
          See More
        </p>

        {/* Austria Stations - Row 1 */}
        {austriaStations.slice(0, 7).map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div 
              className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[1255px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              style={{ left: `${stationRow1Positions[index]}px` }}
              data-testid={`card-station-${station._id}`}
            >
              <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                <img
                  alt={station.name}
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  src={getStationImage(station)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/figmaAssets/powerturk-tv-logosu-1.png';
                  }}
                />
              </div>
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.name}
              </p>
              <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                {station.tags?.[0] || station.country || 'Radio'}
              </p>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
            </div>
          </Link>
        ))}

        {/* Austria Stations - Row 2 */}
        {austriaStations.slice(7, 15).map((station, index) => {
          const positions = [236, 466, 696, 926, 1156, 1386, 1616, 1846];
          return (
            <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
              <div 
                className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] top-[1549px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                style={{ left: `${positions[index]}px` }}
                data-testid={`card-station-${station._id}`}
              >
                <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                  <img
                    alt={station.name}
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                    src={getStationImage(station)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/figmaAssets/powerturk-tv-logosu-1.png';
                    }}
                  />
                </div>
                <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                  {station.name}
                </p>
                <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                  {station.tags?.[0] || station.country || 'Radio'}
                </p>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
