import { Link } from "wouter";
import { Radio, Music, Search, Heart, Settings, ArrowLeft } from "lucide-react";

export const GenreList = (): JSX.Element => {
  // Radio stations matching Figma design pattern
  const radioStations = [
    // Row 1
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/cnn-international-logo-1.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/meta-image--1--1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/cnn-international-logo-1.png" },
    // Row 2
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/cnn-international-logo-1.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/android-default-logo-1-3.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/meta-image--1--1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
    // Row 3
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/cnn-international-logo-1.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/android-default-logo-1-3.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/meta-image--1--1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/alem-fm-1-4.png" },
    { name: "Power Türk", genre: "Türkçe Pop", logo: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  ];

  const positions = [
    // Row 1
    { left: 236, top: 316 },
    { left: 466, top: 316 },
    { left: 696, top: 316 },
    { left: 926, top: 316 },
    { left: 1156, top: 316 },
    { left: 1386, top: 316 },
    { left: 1616, top: 316 },
    // Row 2
    { left: 236, top: 610 },
    { left: 466, top: 610 },
    { left: 696, top: 610 },
    { left: 926, top: 610 },
    { left: 1156, top: 610 },
    { left: 1386, top: 610 },
    { left: 1616, top: 610 },
    // Row 3
    { left: 236, top: 904 },
    { left: 466, top: 904 },
    { left: 696, top: 904 },
    { left: 926, top: 904 },
    { left: 1156, top: 904 },
    { left: 1386, top: 904 },
    { left: 1616, top: 904 },
  ];

  return (
    <div className="relative w-[1920px] min-h-[1080px] bg-white overflow-y-auto" data-testid="page-genre-list">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src="/figmaAssets/hand-crowd-disco-1.png"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[18.333%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[15.185%] top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[31px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Back Button */}
      <Link href="/genres">
        <div className="absolute h-[24px] left-[236px] top-[211px] w-[71px] cursor-pointer" data-testid="button-back">
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
            Back
          </p>
          <div className="absolute left-0 size-[24px] top-0">
            <ArrowLeft className="size-full text-[#c8c8c8]" strokeWidth={1.5} />
          </div>
        </div>
      </Link>

      {/* Page Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
        Popular Radios
      </p>

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

      {/* User Profile */}
      <div className="absolute h-[66px] left-[1648px] top-[59px] w-[193px]">
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[54.5px] not-italic text-[24px] text-center text-white top-[19px] translate-x-[-50%]">
          Talha Çay
        </p>
        <div className="absolute left-[127px] rounded-[73.333px] size-[66px] top-0">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[73.333px] size-full"
            src="/figmaAssets/frame-218.png"
          />
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px]">
        {/* Discover - Active */}
        <Link href="/discover">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover">
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

        {/* Genres */}
        <Link href="/genres">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres">
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
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search">
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
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px]" data-testid="button-favorites">
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
        <Link href="/discover">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px]" data-testid="button-records">
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
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings">
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

      {/* Radio Station Cards */}
      {radioStations.map((station, index) => (
        <Link key={index} href="/radio-playing">
          <div 
            className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px]" 
            style={{ left: `${positions[index].left}px`, top: `${positions[index].top}px` }}
            data-testid={`card-station-${index}`}
          >
            <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={station.logo}
              />
            </div>
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
              {station.name}
            </p>
            <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
              {station.genre}
            </p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
          </div>
        </Link>
      ))}
    </div>
  );
};
