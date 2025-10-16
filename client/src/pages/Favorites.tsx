import { Link } from "wouter";

export const Favorites = (): JSX.Element => {
  const sidebarItems = [
    { icon: "/figmaAssets/vuesax-bold-radio.svg", label: "Discover", active: false, href: "/discover" },
    { icon: "/figmaAssets/vuesax-bold-musicnote.svg", label: "Genres", active: false, href: "/genres" },
    { icon: "/figmaAssets/vuesax-bold-search-normal.svg", label: "Search", active: false, href: "/search" },
    { icon: "/figmaAssets/vuesax-bold-heart.svg", label: "Favorites", active: true, href: "/favorites" },
    { icon: null, label: "Records", active: false, customIcon: true, href: "/discover" },
    { icon: "/figmaAssets/vuesax-bold-setting-2.svg", label: "Settings", active: false, href: "/settings" },
  ];

  const favoriteStations = [
    { name: "CNN International", location: "International", image: "/figmaAssets/cnn-international-logo-1.png" },
    { name: "BBC Radio", location: "United Kingdom", image: "/figmaAssets/-hdd91mb-400x400-1.png" },
    { name: "Power Türk", location: "Turkey", image: "/figmaAssets/meta-image--1--1-4.png" },
    { name: "VOA", location: "USA, New York", image: "/figmaAssets/c175-1.png" },
    { name: "VIBRA", location: "Italy, Rome", image: "/figmaAssets/logo-1.png" },
    { name: "Metro FM", location: "Turkey, Istanbul", image: "/figmaAssets/meta-image--1--1-4.png" },
  ];

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]" />

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

      {/* Top Right Controls */}
      <div className="absolute left-[1351px] top-[67px] w-[223px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[15px] top-[11px] w-[193.684px] h-[29px]">
          <img
            className="absolute left-0 top-0 w-[28.421px] h-[28.421px]"
            alt="Austria"
            src="/figmaAssets/at-1.png"
          />
          <p className="absolute left-[37.421px] top-[3.5px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-white leading-normal">
            Austria
          </p>
          <img
            className="absolute left-[178.684px] top-[7.5px] w-[15px] h-[14px]"
            alt="Dropdown"
            src="/figmaAssets/vuesax-linear-arrow-down-1.svg"
          />
        </div>
      </div>

      {/* User Avatar */}
      <div className="absolute left-[1614px] top-[67px] w-[51px] h-[51px] bg-[#ff4199] rounded-full overflow-hidden" data-testid="avatar-user">
        <img
          className="w-full h-full object-cover"
          alt="User"
          src="/figmaAssets/memoji-1.png"
        />
      </div>

      {/* Login Button */}
      <div className="absolute left-[1704px] top-[73px] w-[186px] h-[38px] bg-[rgba(255,255,255,0.1)] rounded-[30px]" data-testid="button-login">
        <img
          className="absolute left-[18px] top-[9px] w-[20px] h-[20px]"
          alt="Login"
          src="/figmaAssets/vuesax-bold-login.svg"
        />
        <p className="absolute left-[52px] top-[10px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-white leading-normal">
          Login
        </p>
      </div>

      {/* Sidebar */}
      <div className="absolute left-[30px] top-[144px] w-[120px] h-[556px]">
        <div className="flex flex-col gap-[8px]">
          {sidebarItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div
                className={`w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors ${
                  item.active ? 'bg-[rgba(255,255,255,0.2)]' : 'bg-transparent'
                }`}
                data-testid={`button-${item.label.toLowerCase()}`}
              >
              <div className="absolute w-[77px] h-[61px] left-[11px] top-[19px]">
                <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
                  {item.label}
                </p>
                {item.customIcon ? (
                  <div className="absolute left-[23px] top-0 w-[32px] h-[32px] bg-white rounded-full" />
                ) : item.icon && (
                  <img
                    className="absolute left-[23px] top-0 w-[32px] h-[32px]"
                    alt={item.label}
                    src={item.icon}
                  />
                )}
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute left-[190px] top-[144px] right-[30px] bottom-[30px]">
        {/* Page Title */}
        <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-12" data-testid="title-favorites">
          Your Favorites
        </h1>

        {favoriteStations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <img
              className="w-[120px] h-[120px] mb-8 opacity-30"
              alt="Empty"
              src="/figmaAssets/vuesax-bold-heart.svg"
            />
            <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-[#9b9b9b] text-center">
              No favorite stations yet
            </p>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[20px] text-[#666666] text-center mt-4">
              Press the heart icon on any station to add it to your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {favoriteStations.map((station, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.05)] rounded-[20px] p-6 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer group"
                data-testid={`card-favorite-${index}`}
              >
                <div className="relative w-full aspect-square bg-white/10 rounded-[16px] mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={station.name}
                    src={station.image}
                  />
                  <button className="absolute top-3 right-3 w-[40px] h-[40px] bg-[#ff4199] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-unfavorite-${index}`}>
                    <img
                      className="w-[20px] h-[20px]"
                      alt="Unfavorite"
                      src="/figmaAssets/vuesax-bold-heart.svg"
                    />
                  </button>
                </div>
                <h3 className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white mb-1" data-testid={`text-favorite-name-${index}`}>
                  {station.name}
                </h3>
                <p className="font-['Ubuntu',Helvetica] font-medium text-[16px] text-[#9b9b9b]" data-testid={`text-favorite-location-${index}`}>
                  {station.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
