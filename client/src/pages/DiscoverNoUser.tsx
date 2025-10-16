import React from "react";
import { Button } from "@/components/ui/button";

const genres = [
  { name: "Pop" },
  { name: "Rock" },
  { name: "Hip Hop", selected: true },
  { name: "News" },
  { name: "Country" },
  { name: "Hip Hop" },
  { name: "News" },
  { name: "Country" },
];

const popularRadios = [
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/android-default-logo-1-3.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
];

const moreFromAustria = [
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/meta-image--1--1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/0b75jzrr-400x400-1-8.png" },
  { name: "Power Türk", location: "Türkçe Pop", image: "/figmaAssets/alem-fm-1-4.png" },
];

const sidebarItems = [
  { icon: "/figmaAssets/vuesax-bold-radio.svg", label: "Discover", active: true },
  { icon: "/figmaAssets/vuesax-bold-musicnote.svg", label: "Genres", active: false },
  { icon: "/figmaAssets/vuesax-bold-search-normal.svg", label: "Search", active: false },
  { icon: "/figmaAssets/vuesax-bold-heart.svg", label: "Favorites", active: false },
  { icon: null, label: "Records", active: false, customIcon: true },
  { icon: "/figmaAssets/vuesax-bold-setting-2.svg", label: "Settings", active: false },
];

export const DiscoverNoUser = (): JSX.Element => {
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
      <div className="absolute left-[1383px] top-[67px] w-[51px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[13.75px] top-[13px] w-[23.75px] h-[25px]">
          <div className="absolute left-0 top-0 w-[6.25px] h-[25px] bg-white rounded-[10px]" />
          <div className="absolute left-[8.75px] top-[7.5px] w-[6.25px] h-[17.5px] bg-white rounded-[10px]" />
          <div className="absolute left-[17.5px] top-[3.75px] w-[6.25px] h-[21.25px] bg-white rounded-[10px]" />
        </div>
      </div>

      <div className="absolute left-[1453px] top-[67px] w-[223px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
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

      <div className="absolute left-[1695px] top-[66px] w-[146px] h-[52px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <img
          className="absolute left-[13px] top-[9px] w-[34px] h-[34px]"
          alt="Login"
          src="/figmaAssets/vuesax-bold-setting-2.svg"
        />
        <p className="absolute left-[57.08px] top-[12px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-white leading-normal">
          Login
        </p>
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

      {/* Popular Genres Section */}
      <p className="absolute left-[236px] top-[242px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Popular Genres
      </p>

      <div className="absolute left-[236px] top-[316px] flex gap-[18px]">
        {genres.map((genre, index) => (
          <div
            key={index}
            className={`bg-[rgba(255,255,255,0.14)] rounded-[20px] px-[72px] py-[28px] shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] ${
              genre.selected ? "border-[5.5px] border-solid border-[#b4b4b4]" : ""
            }`}
          >
            <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
              {genre.name}
            </p>
          </div>
        ))}
      </div>

      {/* Popular Radios Section */}
      <p className="absolute left-[236px] top-[465px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Popular Radios
      </p>
      <p className="absolute left-[1792.5px] top-[484px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2">
        See More
      </p>

      <div className="absolute left-[236px] top-[539px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
        {popularRadios.map((station, index) => (
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
        <div className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] flex items-center justify-center">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
            See More
          </p>
        </div>
      </div>

      {/* More From Austria Section */}
      <p className="absolute left-[236px] top-[1181px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        More From Austria
      </p>
      <p className="absolute left-[1792.5px] top-[1186px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2">
        See More
      </p>

      <div className="absolute left-[236px] top-[1255px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
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
