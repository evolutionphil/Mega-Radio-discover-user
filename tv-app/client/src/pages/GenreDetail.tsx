import { Link } from "wouter";

export const GenreDetail = (): JSX.Element => {
  const sidebarItems = [
    { icon: "/images/radio-icon.svg", label: "Discover", active: false, href: "/discover" },
    { icon: "/images/music-icon.svg", label: "Genres", active: true, href: "/genres" },
    { icon: "/images/search-icon.svg", label: "Search", active: false, href: "/search" },
    { icon: "/images/heart-icon.svg", label: "Favorites", active: false, href: "/favorites" },
    { icon: null, label: "Records", active: false, customIcon: true, href: "/discover" },
    { icon: "/images/settings-icon.svg", label: "Settings", active: false, href: "/settings" },
  ];

  const stations = [
    { name: "Power Türk", location: "Turkey", image: "/images/powertu-rk-tv-logosu-1-12.png" },
    { name: "VIBRA", location: "Italy, Rome", image: "/images/logo-1.png" },
    { name: "Metro FM", location: "Turkey, Istanbul", image: "/images/meta-image--1--1-4.png" },
    { name: "Soul Radio", location: "USA, Washington D.C", image: "/images/washington-d-1.png" },
    { name: "Power Türk", location: "Türkçe Pop", image: "/images/0b75jzrr-400x400-1-8.png" },
    { name: "ON 70'S", location: "Germany, Bavaria", image: "/images/germany-bavaria-1.png" },
    { name: "Radio L", location: "Turkey", image: "/images/ebg3ye6-1.png" },
    { name: "WEEU", location: "USA", image: "/images/830-weeu-1-1.png" },
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
          src="/images/path-8.svg"
        />
      </div>

      {/* Top Right Controls */}
      <div className="absolute left-[1351px] top-[67px] w-[223px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[15px] top-[11px] w-[193.684px] h-[29px]">
          <img
            className="absolute left-0 top-0 w-[28.421px] h-[28.421px]"
            alt="Austria"
            src="/images/at-1.png"
          />
          <p className="absolute left-[37.421px] top-[3.5px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-white leading-normal">
            Austria
          </p>
          <img
            className="absolute left-[178.684px] top-[7.5px] w-[15px] h-[14px]"
            alt="Dropdown"
            src="/images/vuesax-linear-arrow-down-1.svg"
          />
        </div>
      </div>

      {/* User Avatar */}
      <div className="absolute left-[1614px] top-[67px] w-[51px] h-[51px] bg-[#ff4199] rounded-full overflow-hidden" data-testid="avatar-user">
        <img
          className="w-full h-full object-cover"
          alt="User"
          src="/images/memoji-1.png"
        />
      </div>

      {/* Login Button */}
      <div className="absolute left-[1704px] top-[73px] w-[186px] h-[38px] bg-[rgba(255,255,255,0.1)] rounded-[30px]" data-testid="button-login">
        <img
          className="absolute left-[18px] top-[9px] w-[20px] h-[20px]"
          alt="Login"
          src="/images/vuesax-bold-login.svg"
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
        {/* Back Button & Page Title */}
        <div className="flex items-center gap-6 mb-12">
          <button className="w-[48px] h-[48px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="button-back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white" data-testid="title-genre">
            Pop Stations
          </h1>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-4 gap-8">
          {stations.map((station, index) => (
            <div
              key={index}
              className="bg-[rgba(255,255,255,0.05)] rounded-[20px] p-6 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              data-testid={`card-station-${index}`}
            >
              <div className="w-full aspect-square bg-white/10 rounded-[16px] mb-4 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt={station.name}
                  src={station.image}
                />
              </div>
              <h3 className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white mb-1" data-testid={`text-station-name-${index}`}>
                {station.name}
              </h3>
              <p className="font-['Ubuntu',Helvetica] font-medium text-[16px] text-[#9b9b9b]" data-testid={`text-station-location-${index}`}>
                {station.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
