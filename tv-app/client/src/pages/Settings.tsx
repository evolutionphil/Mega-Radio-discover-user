import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";

type PlayAtStartMode = "last-played" | "random" | "favorite" | "none";

export const Settings = (): JSX.Element => {
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("last-played");

  // Define focusable items: 7 sidebar + 4 settings = 11 total
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '#', '/settings'];
  const settingsOptions: PlayAtStartMode[] = ["last-played", "random", "favorite", "none"];
  const totalItems = 6 + 4; // 6 sidebar items + 4 settings options

  // Focus management
  const { focusIndex, handleNavigation, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 6, // Start on first settings option
    onSelect: (index) => {
      if (index < 6) {
        // Sidebar navigation
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      } else {
        // Settings option
        const optionIndex = index - 6;
        handlePlayAtStartChange(settingsOptions[optionIndex]);
      }
    },
    onBack: () => setLocation('/discover-no-user')
  });

  // Register page-specific key handler
  usePageKeyHandler('/settings', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP || 38:
        handleNavigation('UP');
        break;
      case key?.DOWN || 40:
        handleNavigation('DOWN');
        break;
      case key?.LEFT || 37:
        handleNavigation('LEFT');
        break;
      case key?.RIGHT || 39:
        handleNavigation('RIGHT');
        break;
      case key?.ENTER || 13:
        handleSelect();
        break;
      case key?.RETURN || 461 || 10009:
        handleBack();
        break;
    }
  });

  // Load play at start preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("playAtStart");
    if (saved && ["last-played", "random", "favorite", "none"].includes(saved)) {
      setPlayAtStart(saved as PlayAtStartMode);
    }
  }, []);

  // Save play at start preference to localStorage
  const handlePlayAtStartChange = (mode: PlayAtStartMode) => {
    setPlayAtStart(mode);
    localStorage.setItem("playAtStart", mode);
    console.log("[Settings] Play at start mode changed to:", mode);
  };

  return (
    <div className="fixed inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
          src="/images/hand-crowd-disco-1.png"
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


      {/* Left Sidebar Menu */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px] z-50">
        {/* Discover */}
        <Link href="/discover-no-user">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0 ${getFocusClasses(isFocused(0))}`} data-testid="button-discover" onClick={() => setLocation('/discover-no-user')}>
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('nav_discover') || 'Discover'}
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/radio-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres */}
        <Link href="/genres">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px] ${getFocusClasses(isFocused(1))}`} data-testid="button-genres" onClick={() => setLocation('/genres')}>
            <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('genres') || 'Genres'}
              </p>
              <div className="absolute left-[13px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/music-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <Link href="/search">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px] ${getFocusClasses(isFocused(2))}`} data-testid="button-search" onClick={() => setLocation('/search')}>
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('search') || 'Search'}
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/search-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link href="/favorites">
          <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px] ${getFocusClasses(isFocused(3))}`} data-testid="button-favorites" onClick={() => setLocation('/favorites')}>
            <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                {t('nav_your_favorites') || 'Favorites'}
              </p>
              <div className="absolute left-[22px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="/images/heart-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Records */}
        <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px] ${getFocusClasses(isFocused(4))}`} data-testid="button-records">
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
        <div className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px] ${getFocusClasses(isFocused(5))} bg-[rgba(255,255,255,0.2)]`} data-testid="button-settings">
          <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('settings') || 'Settings'}
            </p>
            <div className="absolute left-[18px] size-[32px] top-0">
              <img alt="" className="block max-w-none size-full" src="/images/settings-icon.svg" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px] z-10">
        {t('settings') || 'Settings'}
      </p>

      {/* Settings Content Card - Centered */}
      <div className="absolute bg-[#1f1f1f] h-[400px] left-[50%] translate-x-[-50%] overflow-clip rounded-[20px] top-[350px] w-[886px] z-10">
        {/* Play at Start Section */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[30px]">
          {t('settings_play_at_start') || 'Play at Start'}
        </p>

        {/* Last Played Option */}
        <div 
          className={`absolute left-[30px] top-[95px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(6))}`}
          onClick={() => handlePlayAtStartChange("last-played")}
          data-testid="option-last-played"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip relative rounded-[inherit] size-[32px]">
              {playAtStart === "last-played" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_last_played') || 'Last Played'}
          </p>
        </div>

        {/* Random Option */}
        <div 
          className={`absolute left-[30px] top-[152px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(7))}`}
          onClick={() => handlePlayAtStartChange("random")}
          data-testid="option-random"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtStart === "random" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_random') || 'Random'}
          </p>
        </div>

        {/* Favorite Option */}
        <div 
          className={`absolute left-[30px] top-[209px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(8))}`}
          onClick={() => handlePlayAtStartChange("favorite")}
          data-testid="option-favorite"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtStart === "favorite" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_favorite') || 'Favorite'}
          </p>
        </div>

        {/* None Option */}
        <div 
          className={`absolute left-[30px] top-[266px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(9))}`}
          onClick={() => handlePlayAtStartChange("none")}
          data-testid="option-none"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] size-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] size-[32px]">
              {playAtStart === "none" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] size-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_none') || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
};
