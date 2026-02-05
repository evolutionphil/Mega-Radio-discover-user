import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

type PlayAtStartMode = "last-played" | "random" | "favorite" | "none";

export const Settings = (): JSX.Element => {
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("last-played");

  // Define focusable items: 5 sidebar + 4 settings = 9 total (NO PROFILE)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];
  const settingsOptions: PlayAtStartMode[] = ["last-played", "random", "favorite", "none"];
  const totalItems = 5 + 4; // 5 sidebar items + 4 settings options

  // Focus management
  const { focusIndex, handleNavigation, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 5, // Start on first settings option
    onSelect: (index) => {
      if (index < 5) {
        // Sidebar navigation (0-4)
        const route = sidebarRoutes[index];
        setLocation(route);
      } else {
        // Settings option
        const optionIndex = index - 5;
        handlePlayAtStartChange(settingsOptions[optionIndex]);
      }
    },
    onBack: () => setLocation('/discover-no-user')
  });

  // Register page-specific key handler
  usePageKeyHandler('/settings', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP:
      case 38:
        handleNavigation('UP');
        break;
      case key?.DOWN:
      case 40:
        handleNavigation('DOWN');
        break;
      case key?.LEFT:
      case 37:
        handleNavigation('LEFT');
        break;
      case key?.RIGHT:
      case 39:
        handleNavigation('RIGHT');
        break;
      case key?.ENTER:
      case 13:
        handleSelect();
        break;
      case key?.RETURN:
      case 461:
      case 10009:
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
  };

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
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
            className="block max-w-none w-full h-full"
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>


      {/* Left Sidebar Menu */}
      <Sidebar activePage="settings" isFocused={isFocused} getFocusClasses={getFocusClasses} />

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
          className={`absolute left-[30px] top-[95px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(5))}`}
          onClick={() => handlePlayAtStartChange("last-played")}
          data-testid="option-last-played"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] w-[32px] h-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip relative rounded-[inherit] w-[32px] h-[32px]">
              {playAtStart === "last-played" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] w-[19.2px] h-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_last_played') || 'Last Played'}
          </p>
        </div>

        {/* Random Option */}
        <div 
          className={`absolute left-[30px] top-[152px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(6))}`}
          onClick={() => handlePlayAtStartChange("random")}
          data-testid="option-random"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] w-[32px] h-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] w-[32px] h-[32px]">
              {playAtStart === "random" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] w-[19.2px] h-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_random') || 'Random'}
          </p>
        </div>

        {/* Favorite Option */}
        <div 
          className={`absolute left-[30px] top-[209px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(7))}`}
          onClick={() => handlePlayAtStartChange("favorite")}
          data-testid="option-favorite"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] w-[32px] h-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] w-[32px] h-[32px]">
              {playAtStart === "favorite" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] w-[19.2px] h-[19.2px] top-[6.4px]" />
              )}
            </div>
          </div>
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[22px] text-white pointer-events-none">
            {t('settings_favorite') || 'Favorite'}
          </p>
        </div>

        {/* None Option */}
        <div 
          className={`absolute left-[30px] top-[266px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(8))}`}
          onClick={() => handlePlayAtStartChange("none")}
          data-testid="option-none"
        >
          <div 
            className="border-[#ff4199] border-[3.84px] border-solid rounded-[20px] w-[32px] h-[32px] relative cursor-pointer"
          >
            <div className="overflow-clip rounded-[inherit] w-[32px] h-[32px]">
              {playAtStart === "none" && (
                <div className="absolute bg-[#ff4199] left-[6.4px] rounded-[28px] w-[19.2px] h-[19.2px] top-[6.4px]" />
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
