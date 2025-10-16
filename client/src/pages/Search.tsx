export const Search = (): JSX.Element => {
  const recentlyPlayed = [
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  ];

  const sidebarItems = [
    { icon: "/figmaAssets/vuesax-bold-radio.svg", label: "Discover", active: false },
    { icon: "/figmaAssets/vuesax-bold-musicnote.svg", label: "Genres", active: false },
    { icon: "/figmaAssets/vuesax-bold-search-normal.svg", label: "Search", active: true },
    { icon: "/figmaAssets/vuesax-bold-heart.svg", label: "Favorites", active: false },
    { icon: null, label: "Records", active: false, customIcon: true },
    { icon: "/figmaAssets/vuesax-bold-setting-2.svg", label: "Settings", active: false },
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] bg-black overflow-hidden">
      {/* Logo */}
      <div className="absolute left-[30px] top-[64px] w-[164.421px] h-[57px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-[64px] top-[242px] w-[98px] h-[638px]">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`absolute left-0 w-[98px] h-[98px] rounded-[10px] overflow-clip ${
              item.active ? "bg-[rgba(255,255,255,0.2)]" : ""
            }`}
            style={{ top: `${index * 108}px` }}
            data-testid={`sidebar-${item.label.toLowerCase()}`}
          >
            <div className="absolute left-1/2 top-[19px] -translate-x-1/2">
              {item.customIcon ? (
                <div className="w-[32px] h-[32px] relative">
                  <div className="absolute left-[5.33px] top-[5.33px] w-[21.334px] h-[21.334px] bg-white rounded-[10.667px]" />
                  <div className="absolute left-0 top-0 w-[32px] h-[32px] rounded-[20.267px] border-[2.667px] border-solid border-white" />
                </div>
              ) : (
                <img className="w-[32px] h-[32px]" alt={item.label} src={item.icon || ""} />
              )}
            </div>
            <p className="absolute left-1/2 top-[59px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal -translate-x-1/2">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search Section */}
      <p className="absolute left-[308px] top-[58px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal" data-testid="title-search">
        Search
      </p>

      {/* Search Input */}
      <div 
        className="absolute left-[308px] top-[136px] w-[968px] h-[91px] bg-[rgba(255,255,255,0.2)] rounded-[14px] border-[2.594px] border-solid border-[#717171]"
        style={{ backdropFilter: 'blur(13.621px)' }}
        data-testid="input-search"
      >
        <img
          className="absolute left-[32.43px] top-[29.84px] w-[31.134px] h-[31.134px]"
          alt="Search"
          src="/figmaAssets/vuesax-outline-search-normal.svg"
        />
        <p className="absolute left-[88.21px] top-[29.84px] font-['Ubuntu',Helvetica] font-medium text-[25.94px] text-white leading-normal">
          Kral Ra
        </p>
      </div>

      {/* Search Results */}
      <div 
        className="absolute left-[308px] top-[259px] px-[50px] py-[20px] bg-[rgba(255,255,255,0.28)] rounded-[14px] border-[5.5px] border-solid border-[#b4b4b4]"
        style={{ boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)' }}
        data-testid="result-kral-radyo"
      >
        <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
          Kral Radyo
        </p>
      </div>

      <div 
        className="absolute left-[308px] top-[344px] px-[50px] py-[20px] bg-[rgba(255,255,255,0.14)] rounded-[14px]"
        style={{ boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)' }}
        data-testid="result-kral-radyo-ankara"
      >
        <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
          Kral Rad<span className="text-[#a5a5a5]">yo Ankara</span>
        </p>
      </div>

      <div 
        className="absolute left-[308px] top-[429px] px-[50px] py-[20px] bg-[rgba(255,255,255,0.14)] rounded-[14px]"
        style={{ boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)' }}
        data-testid="result-kral-radyo-istanbul-1"
      >
        <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
          Kral Rad<span className="text-[#a5a5a5]">yo İstanbul</span>
        </p>
      </div>

      <div 
        className="absolute left-[308px] top-[514px] px-[50px] py-[20px] bg-[rgba(255,255,255,0.14)] rounded-[14px]"
        style={{ boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)' }}
        data-testid="result-kral-radyo-istanbul-2"
      >
        <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
          Kral Rad<span className="text-[#a5a5a5]">yo İstanbul</span>
        </p>
      </div>

      {/* Native Keyboard Placeholder */}
      <div className="absolute left-[308px] top-[610px] w-[1006px] h-[378px] bg-[#313131] rounded-[14px] overflow-clip" data-testid="keyboard-placeholder">
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Roboto',Helvetica] font-medium text-[25.945px] text-center text-[#656565] leading-normal">
          Native keyboard
        </p>
      </div>

      {/* Recently Played Section */}
      <p className="absolute left-[1394px] top-[58px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal" data-testid="title-recently-played">
        Recently Played
      </p>

      {/* Recently Played Grid */}
      <div className="absolute left-[1394px] top-[136px]">
        {recentlyPlayed.map((station, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const left = col * 230;
          const top = row * 294;

          return (
            <div
              key={index}
              className="absolute w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip"
              style={{ 
                left: `${left}px`, 
                top: `${top}px`,
                boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)'
              }}
              data-testid={`recent-station-${index}`}
            >
              <div className="w-[132px] h-[132px] mt-[34px] mx-auto bg-white rounded-[6.6px] overflow-clip">
                <img
                  className="w-full h-full object-cover"
                  alt={station.name}
                  src={station.image}
                />
              </div>
              <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal mt-[21px]">
                {station.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] font-light text-[18px] text-center text-white leading-normal mt-[6.2px]">
                {station.location}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
