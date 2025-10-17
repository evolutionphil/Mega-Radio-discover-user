import { Link } from "wouter";
import { Radio, Music, Search, Heart, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Genre } from "@/services/megaRadioApi";

export const Genres = (): JSX.Element => {
  // Fetch all genres
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: () => megaRadioApi.getAllGenres(),
  });

  // Fetch discoverable/popular genres
  const { data: discoverableGenresData } = useQuery({
    queryKey: ['/api/genres/discoverable'],
    queryFn: () => megaRadioApi.getDiscoverableGenres(),
  });

  const allGenres = genresData?.genres || [];
  const popularGenres = discoverableGenresData?.genres?.slice(0, 8) || [];

  // Card positions
  const row1Positions = [
    { left: 237, width: 386 },
    { left: 644, width: 387 },
    { left: 1052, width: 386 },
    { left: 1459, width: 382 },
  ];

  return (
    <div className="relative w-[1920px] min-h-[1080px] bg-white overflow-y-auto" data-testid="page-genres">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src="/figmaAssets/hand-crowd-disco-1.png"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[18.704%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[25.787%] top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Equalizer */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1281px] overflow-clip rounded-[30px] size-[51px] top-[67px]">
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
          <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
          <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
        </div>
      </div>

      {/* Country Selector */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1351px] overflow-clip rounded-[30px] top-[67px] w-[223px]">
        <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
            Austria
          </p>
          <div className="absolute left-0 size-[28.421px] top-0">
            <img
              alt="Austria"
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
          <img
            className="absolute left-[13px] size-[34px] top-[9px]"
            alt="Login"
            src="/figmaAssets/vuesax-bold-setting-2.svg"
          />
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[57.08px] not-italic text-[24px] text-white top-[12px]">
            Login
          </p>
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
                <Radio className="size-full text-white" fill="white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres - Active */}
        <Link href="/genres">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Genres
              </p>
              <div className="absolute left-[13px] size-[32px] top-0">
                <Music className="size-full text-white" fill="white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <Link href="/search">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Search
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <Search className="size-full text-white" strokeWidth={2.5} />
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
                <Heart className="size-full text-white" fill="white" />
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
                <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
                <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
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
                <Settings className="size-full text-white" fill="white" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Popular Genres Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[243px] not-italic text-[32px] text-white top-[242px]">
        Popular Genres
      </p>

      {/* Popular Genres - Row 1 */}
      {popularGenres.slice(0, 4).map((genre, index) => (
        <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
          <div 
            className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[309px]" 
            data-testid={`card-genre-${index}`}
            style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
            data-tv-focusable="true"
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white truncate w-full">
              {genre.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
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
            className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[467px]" 
            data-testid={`card-genre-${index + 4}`}
            style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
            data-tv-focusable="true"
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white truncate w-full">
              {genre.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
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

      {/* All Genres - Row 1 */}
      {allGenres.slice(0, 4).map((genre, index) => (
        <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
          <div 
            className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[737px]" 
            data-testid={`card-genre-${index + 8}`}
            style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
            data-tv-focusable="true"
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white truncate w-full">
              {genre.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
              {genre.stationCount || 0} Stations
            </p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
          </div>
        </Link>
      ))}

      {/* All Genres - Row 2 */}
      {allGenres.slice(4, 8).map((genre, index) => (
        <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
          <div 
            className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[895px]" 
            data-testid={`card-genre-${index + 12}`}
            style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
            data-tv-focusable="true"
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white truncate w-full">
              {genre.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
              {genre.stationCount || 0} Stations
            </p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
          </div>
        </Link>
      ))}

      {/* All Genres - Row 3 */}
      {allGenres.slice(8, 12).map((genre, index) => (
        <Link key={genre.slug || index} href={`/genre-list?genre=${genre.slug}`}>
          <div 
            className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex flex-col gap-[10px] h-[139px] items-start justify-center px-[40px] py-[28px] rounded-[20px] top-[1055px]" 
            data-testid={`card-genre-${index + 16}`}
            style={{ left: `${row1Positions[index].left}px`, width: `${row1Positions[index].width}px` }}
            data-tv-focusable="true"
          >
            <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[24px] text-center text-white truncate w-full">
              {genre.name}
            </p>
            <p className="font-['Ubuntu',Helvetica] leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
              {genre.stationCount || 0} Stations
            </p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
          </div>
        </Link>
      ))}
    </div>
  );
};
