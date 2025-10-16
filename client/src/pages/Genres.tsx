import { Link } from "wouter";

export const Genres = (): JSX.Element => {
  const sidebarItems = [
    { icon: "/figmaAssets/vuesax-bold-radio.svg", label: "Discover", active: false, href: "/discover" },
    { icon: "/figmaAssets/vuesax-bold-musicnote.svg", label: "Genres", active: true, href: "/genres" },
    { icon: "/figmaAssets/vuesax-bold-search-normal.svg", label: "Search", active: false, href: "/search" },
    { icon: "/figmaAssets/vuesax-bold-heart.svg", label: "Favorites", active: false, href: "/favorites" },
    { icon: null, label: "Records", active: false, customIcon: true, href: "/discover" },
    { icon: "/figmaAssets/vuesax-bold-setting-2.svg", label: "Settings", active: false, href: "/settings" },
  ];

  const genres = [
    { name: "Pop", color: "#ff4199" },
    { name: "Rock", color: "#9c27b0" },
    { name: "Hip Hop", color: "#ff6b6b" },
    { name: "News", color: "#4e9cf4" },
    { name: "Country", color: "#f4c430" },
    { name: "Jazz", color: "#7e57c2" },
    { name: "Classical", color: "#26a69a" },
    { name: "Electronic", color: "#ec407a" },
    { name: "R&B", color: "#ab47bc" },
    { name: "Latin", color: "#ff7043" },
    { name: "Metal", color: "#546e7a" },
    { name: "Blues", color: "#5c6bc0" },
    { name: "Reggae", color: "#66bb6a" },
    { name: "Folk", color: "#8d6e63" },
    { name: "Indie", color: "#78909c" },
    { name: "Alternative", color: "#9575cd" },
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
        <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-12" data-testid="title-genres">
          Genres
        </h1>

        {/* Genres Grid */}
        <div className="grid grid-cols-4 gap-6">
          {genres.map((genre, index) => (
            <div
              key={index}
              className="relative h-[200px] rounded-[20px] overflow-hidden cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: genre.color }}
              data-testid={`card-genre-${index}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white" data-testid={`text-genre-${index}`}>
                  {genre.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
