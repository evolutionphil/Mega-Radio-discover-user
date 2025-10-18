import { Link } from "wouter";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useState } from "react";
import { CountrySelector } from "@/components/CountrySelector";
import { useCountry } from "@/contexts/CountryContext";

export const Settings = (): JSX.Element => {
  useTVNavigation();
  const { selectedCountry, selectedCountryFlag, setCountry } = useCountry();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [playAtLogin, setPlayAtLogin] = useState("last-played");

  const handleSelectCountry = (country: { name: string; code: string; flag: string }) => {
    setCountry(country.name, country.code, country.flag);
    setIsCountrySelectorOpen(false);
  };

  return (
    <div className="fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
          src="/genres-assets/hand-crowd-disco-1.png"
        />
      </div>

      {/* Black Overlay */}
      <div className="absolute bg-[#0e0e0e] h-[1080px] left-0 top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[31px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src="/images/path-8.svg"
          />
        </div>
      </div>

      {/* Equalizer Icon */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1281px] overflow-clip rounded-[30px] size-[51px] top-[67px] z-50">
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
          <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
          <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
        </div>
      </div>

      {/* Country Selector */}
      <div 
        className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1351px] overflow-clip rounded-[30px] top-[67px] w-[223px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors z-50"
        onClick={() => setIsCountrySelectorOpen(true)}
        data-testid="button-country-selector"
        data-tv-focusable="true"
      >
        <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
            {selectedCountry}
          </p>
          <div className="absolute left-0 size-[28.421px] top-0">
            <img
              alt={selectedCountry}
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={selectedCountryFlag}
            />
          </div>
          <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/images/vuesax-outline-arrow-left.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        onClose={() => setIsCountrySelectorOpen(false)}
      />

      {/* Left Sidebar Menu */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px] z-50">
        {/* Discover */}
        <Link href="/discover-no-user">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover" data-tv-focusable="true">
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Discover
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-radio.svg" />
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
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-musicnote.svg" />
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
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-search-normal.svg" />
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
                <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-heart.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Records */}
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

        {/* Settings - Active */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings" data-tv-focusable="true">
          <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Settings
            </p>
            <div className="absolute left-[18px] size-[32px] top-0">
              <img alt="" className="block max-w-none size-full" src="/images/vuesax-bold-setting-2.svg" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px] z-10">
        Settings
      </p>

      {/* User Profile Card - Right Side */}
      <div className="absolute bg-[#1f1f1f] h-[177px] left-[1142px] overflow-clip rounded-[20px] top-[311px] w-[703px] z-10">
        <div className="absolute h-[97px] left-[48px] top-[40px] w-[305px]">
          <div className="absolute left-0 rounded-[50px] size-[97px] top-0">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[50px] size-full"
              src="/images/frame-218.png"
            />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[132px] not-italic text-[24px] text-white top-[23px]">
            Talha Çay
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[132px] not-italic text-[#818181] text-[18px] top-[64px]">
            talhacay@gmail.com
          </p>
        </div>
        <div className="absolute bottom-[76px] h-[24px] right-[30px] w-[99px] cursor-pointer" data-testid="button-logout" data-tv-focusable="true">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[37px] not-italic text-[18px] text-white top-[2px]">
            Logout
          </p>
          <div className="absolute right-[75px] size-[24px] top-0">
            <img alt="" className="block max-w-none size-full" src="/genres-assets/logout-icon.svg" />
          </div>
        </div>
      </div>

      {/* Settings Content Card - Left Side */}
      <div className="absolute bg-[#1f1f1f] h-[678px] left-[236px] overflow-clip rounded-[20px] top-[311px] w-[886px] z-10">
        {/* Play at login Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[30px]">
          Play at login
        </p>

        {/* Last Played Option */}
        <div 
          className="absolute left-[30px] top-[95px] flex items-center gap-[20px] cursor-pointer"
          onClick={() => setPlayAtLogin("last-played")}
          data-testid="option-last-played"
          data-tv-focusable="true"
        >
          <div className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative">
            <div className="overflow-clip relative rounded-[inherit] size-[32px]">
              {playAtLogin === "last-played" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white">
            Last Played
          </p>
        </div>

        {/* Random Option */}
        <div 
          className="absolute left-[30px] top-[152px] flex items-center gap-[20px] cursor-pointer"
          onClick={() => setPlayAtLogin("random")}
          data-testid="option-random"
          data-tv-focusable="true"
        >
          <div className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative">
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtLogin === "random" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white">
            Random
          </p>
        </div>

        {/* Favorite Option */}
        <div 
          className="absolute left-[30px] top-[209px] flex items-center gap-[20px] cursor-pointer"
          onClick={() => setPlayAtLogin("favorite")}
          data-testid="option-favorite"
          data-tv-focusable="true"
        >
          <div className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative">
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtLogin === "favorite" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white">
            Favorite
          </p>
        </div>

        {/* None Option */}
        <div 
          className="absolute left-[30px] top-[266px] flex items-center gap-[20px] cursor-pointer"
          onClick={() => setPlayAtLogin("none")}
          data-testid="option-none"
          data-tv-focusable="true"
        >
          <div className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative">
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtLogin === "none" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white">
            None
          </p>
        </div>

        {/* Country Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[346px]">
          Country
        </p>

        <div 
          className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[75px] left-[30px] rounded-[12px] top-[390px] w-[815px] cursor-pointer"
          onClick={() => setIsCountrySelectorOpen(true)}
          data-testid="input-country"
          data-tv-focusable="true"
        >
          <div className="h-[75px] overflow-clip relative rounded-[inherit] w-[815px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[20px] not-italic text-[24px] text-white top-[24px]">
              Turkey
            </p>
          </div>
        </div>

        {/* Language Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[495px]">
          Language
        </p>

        <div 
          className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[75px] left-[30px] rounded-[12px] top-[539px] w-[815px] cursor-pointer"
          data-testid="input-language"
          data-tv-focusable="true"
        >
          <div className="h-[75px] overflow-clip relative rounded-[inherit] w-[815px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29px] not-italic text-[24px] text-white top-[24px]">
              English
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
