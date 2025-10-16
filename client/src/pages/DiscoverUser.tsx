import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const recentlyPlayedStations = [
  { name: "BBC Radio", location: "United Kingdom", image: "/figmaAssets/-hdd91mb-400x400-1.png" },
  { name: "WEEU", location: "USA", image: "/figmaAssets/830-weeu-1-1.png" },
  { name: "CNN", location: "Internatinal", image: "/figmaAssets/cnn-international-logo-1.png", featured: true },
  { name: "NBC News", location: "USA", image: "/figmaAssets/2616697-nbc-news-logo-stacked--1--1.png" },
  { name: "Power Türk", location: "Turkey", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Cheddar", location: "USA", image: "/figmaAssets/cheddar-news-1.png" },
  { name: "WNYC", location: "USA, New York", image: "/figmaAssets/c175--1--1.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
];

const genres = [
  { name: "Pop" },
  { name: "Rock" },
  { name: "Hip Hop" },
  { name: "News" },
  { name: "Country" },
  { name: "Hip Hop" },
  { name: "News" },
  { name: "Country" },
];

const popularRadios = [
  { name: "VIBRA", location: "Italy, Rome", image: "/figmaAssets/logo-1.png" },
  { name: "VOA", location: "USA, New York", image: "/figmaAssets/c175-1.png" },
  { name: "Radio L", location: "Turkey", image: "/figmaAssets/ebg3ye6-1.png" },
  { name: "Power Türk", location: "Turkey, Istanbul", image: "/figmaAssets/android-default-logo-1-3.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Soul Radio", location: "USA, Washington D.C", image: "/figmaAssets/washington-d-1.png" },
  { name: "ON 70'S", location: "Germany, Bavaria", image: "/figmaAssets/germany-bavaria-1.png" },
  { name: "WEEU", location: "USA", image: "/figmaAssets/830-weeu-1-1.png" },
  { name: "Metro FM", location: "Turkey, Istanbul", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Zeno", location: "Italy", image: "/figmaAssets/apple-icon-120x120-1.png" },
  { name: "Radio 80'S", location: "USA, New York", image: "/figmaAssets/80s-radio-1.png" },
];

const moreFromAustria = [
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
];

const sidebarItems = [
  { icon: "/figmaAssets/vuesax-bold-radio.svg", label: "Discover", active: true, href: "/discover" },
  { icon: "/figmaAssets/vuesax-bold-musicnote.svg", label: "Genres", active: false, href: "/genres" },
  { icon: "/figmaAssets/vuesax-bold-search-normal.svg", label: "Search", active: false, href: "/search" },
  { icon: "/figmaAssets/vuesax-bold-heart.svg", label: "Favorites", active: false, href: "/favorites" },
  { icon: null, label: "Records", active: false, customIcon: true, href: "/discover" },
  { icon: "/figmaAssets/vuesax-bold-setting-2.svg", label: "Settings", active: false, href: "/settings" },
];

export const DiscoverUser = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden">
      {/* Background Image */}
      <img
        className="absolute left-[-10px] top-[-523px] w-[1939px] h-[1292px] object-cover"
        alt="Hand crowd disco"
        src="/figmaAssets/hand-crowd-disco-1.png"
      />

      {/* Gradient Overlay */}
      <div className="absolute left-0 top-0 w-[1920px] h-[1080px] bg-gradient-to-b from-[rgba(14,14,14,0)] from-[0.88%] to-[#0e0e0e] to-[48.611%]" />

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
      <div className="absolute left-[1281px] top-[67px] w-[51px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[13.75px] top-[13px] w-[23.75px] h-[25px]">
          <div className="absolute left-0 top-0 w-[6.25px] h-[25px] bg-white rounded-[10px]" />
          <div className="absolute left-[8.75px] top-[7.5px] w-[6.25px] h-[17.5px] bg-white rounded-[10px]" />
          <div className="absolute left-[17.5px] top-[3.75px] w-[6.25px] h-[21.25px] bg-white rounded-[10px]" />
        </div>
      </div>

      <div className="absolute left-[1351px] top-[67px] w-[223px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[15px] top-[11px] w-[193.684px] h-[29px]">
          <img
            className="absolute left-0 top-0 w-[28.421px] h-[28.421px]"
            alt="Austria"
            src="/figmaAssets/austria-1.png"
          />
          <p className="absolute left-[39.08px] top-[1px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-white leading-normal">
            Austria
          </p>
          <div className="absolute left-[170px] top-[3.32px] rotate-[270deg]">
            <img
              className="w-[23.684px] h-[23.684px]"
              alt="Arrow"
              src="/figmaAssets/vuesax-outline-arrow-left.svg"
            />
          </div>
        </div>
      </div>

      <div className="absolute left-[1648px] top-[59px] w-[193px] h-[66px]">
        <p className="absolute left-[54.5px] top-[19px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-center text-white leading-normal -translate-x-1/2">
          Talha Çay
        </p>
        <Avatar className="absolute left-[127px] top-0 w-[66px] h-[66px]">
          <AvatarImage src="/figmaAssets/frame-218.png" />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-[64px] top-[242px] w-[98px] h-[638px]">
        {sidebarItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div
              className={`absolute left-0 w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors ${
                item.active ? "bg-[rgba(255,255,255,0.2)]" : ""
              }`}
              style={{ top: `${index * 108}px` }}
              data-testid={`button-${item.label.toLowerCase()}`}
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
          </Link>
        ))}
      </div>

      {/* Recently Played Section */}
      <p className="absolute left-[236px] top-[242px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Recently Played
      </p>
      <p className="absolute left-[1792.5px] top-[248px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2">
        See More
      </p>

      <div className="absolute left-[236px] top-[316px] flex gap-[19px]">
        {recentlyPlayedStations.map((station, index) => (
          <Link key={index} href="/radio-playing">
            <div
              className={`bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${
                station.featured
                  ? "w-[209.091px] h-[276px] border-[5.75px] border-solid border-[#d2d2d2]"
                  : "w-[200px] h-[264px]"
              }`}
              data-testid={`card-station-${index}`}
            >
            <div className={`bg-white ${station.featured ? "w-[138px] h-[138px] mt-[35.55px] ml-[35.55px]" : "w-[132px] h-[132px] mt-[34px] ml-[34px]"} rounded-[6.6px] overflow-clip`}>
              <img
                className="w-full h-full object-cover"
                alt={station.name}
                src={station.image}
              />
            </div>
            <p className={`font-['Ubuntu',Helvetica] font-medium ${station.featured ? "text-[22px] mt-[22px]" : "text-[22px] mt-[21px]"} text-center text-white leading-normal`}>
              {station.name}
            </p>
            <p className={`font-['Ubuntu',Helvetica] font-light ${station.featured ? "text-[18.818px] mt-[7.6px]" : "text-[18px] mt-[6.2px]"} text-center text-white leading-normal`}>
              {station.location}
            </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Genres Section */}
      <p className="absolute left-[236px] top-[639px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Popular Genres
      </p>

      <div className="absolute left-[236px] top-[713px] flex gap-[18px]">
        {genres.map((genre, index) => (
          <Link key={index} href="/genres">
            <div
              className="bg-[rgba(255,255,255,0.14)] rounded-[20px] px-[72px] py-[28px] shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              data-testid={`button-genre-${index}`}
            >
            <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
              {genre.name}
            </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Radios Section */}
      <p className="absolute left-[236px] top-[863px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Popular Radios
      </p>
      <p className="absolute left-[1792.5px] top-[869px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2">
        See More
      </p>

      <div className="absolute left-[236px] top-[936px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
        {popularRadios.map((station, index) => (
          <Link key={index} href="/radio-playing">
            <div
              className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              data-testid={`card-popular-${index}`}
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
          </Link>
        ))}
        <div className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] flex items-center justify-center" data-testid="button-see-more">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
            See More
          </p>
        </div>
      </div>

      {/* More From Austria Section */}
      <p className="absolute left-[236px] top-[1578px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        More From Austria
      </p>
      <p className="absolute left-[1792.5px] top-[1584px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2">
        See More
      </p>

      <div className="absolute left-[236px] top-[1652px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
        {moreFromAustria.map((station, index) => (
          <div
            key={index}
            className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]"
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
        ))}
      </div>
    </div>
  );
};
