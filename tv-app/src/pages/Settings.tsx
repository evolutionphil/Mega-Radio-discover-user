import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

type PlayAtStartMode = "last-played" | "random" | "favorite" | "none";

interface KeyboardOption {
  id: string;
  label: string;
  flag: string;
}

const KEYBOARD_OPTIONS: KeyboardOption[] = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'ko', label: '한국어', flag: '🇰🇷' },
  { id: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { id: 'th', label: 'ไทย', flag: '🇹🇭' },
];

export const Settings = (): JSX.Element => {
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("none");
  const [selectedKeyboard, setSelectedKeyboard] = useState(0);
  const [focusSection, setFocusSection] = useState<'sidebar' | 'playAtStart' | 'keyboard'>('playAtStart');
  const [sidebarIndex, setSidebarIndex] = useState(4);
  const [playAtStartIndex, setPlayAtStartIndex] = useState(0);
  const [keyboardIndex, setKeyboardIndex] = useState(0);

  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings', '/country-select'];
  const settingsOptions: PlayAtStartMode[] = ["last-played", "random", "favorite", "none"];

  const isFocused = (idx: number) => focusSection === 'sidebar' && sidebarIndex === idx;
  const getFocusClasses = (focused: boolean) => focused ? 'ring-2 ring-[#ff4199] scale-105' : '';

  useEffect(() => {
    const saved = localStorage.getItem("playAtStart");
    if (saved && settingsOptions.includes(saved as PlayAtStartMode)) {
      setPlayAtStart(saved as PlayAtStartMode);
    }
    const savedKb = localStorage.getItem("preferredKeyboard");
    if (savedKb) {
      const idx = KEYBOARD_OPTIONS.findIndex(k => k.id === savedKb);
      if (idx >= 0) {
        setSelectedKeyboard(idx);
        setKeyboardIndex(idx);
      }
    }
  }, []);

  const handlePlayAtStartChange = (mode: PlayAtStartMode) => {
    setPlayAtStart(mode);
    localStorage.setItem("playAtStart", mode);
  };

  const handleKeyboardChange = (index: number) => {
    setSelectedKeyboard(index);
    localStorage.setItem("preferredKeyboard", KEYBOARD_OPTIONS[index].id);
  };

  usePageKeyHandler('/settings', (e) => {
    const key = (window as any).tvKey;
    const isUp = e.keyCode === key?.UP || e.keyCode === 38;
    const isDown = e.keyCode === key?.DOWN || e.keyCode === 40;
    const isLeft = e.keyCode === key?.LEFT || e.keyCode === 37;
    const isRight = e.keyCode === key?.RIGHT || e.keyCode === 39;
    const isEnter = e.keyCode === key?.ENTER || e.keyCode === 13;
    const isReturn = e.keyCode === key?.RETURN || e.keyCode === 461 || e.keyCode === 10009;

    if (isReturn) {
      e.preventDefault();
      setLocation('/discover-no-user');
      return;
    }

    if (focusSection === 'sidebar') {
      if (isUp) {
        e.preventDefault();
        setSidebarIndex(prev => Math.max(0, prev - 1));
      } else if (isDown) {
        e.preventDefault();
        setSidebarIndex(prev => Math.min(5, prev + 1));
      } else if (isRight) {
        e.preventDefault();
        if (sidebarIndex <= 2) {
          setFocusSection('playAtStart');
        } else {
          setFocusSection('keyboard');
        }
      } else if (isEnter) {
        e.preventDefault();
        setLocation(sidebarRoutes[sidebarIndex]);
      }
      return;
    }

    if (focusSection === 'playAtStart') {
      if (isUp) {
        e.preventDefault();
        if (playAtStartIndex > 0) {
          setPlayAtStartIndex(prev => prev - 1);
        }
      } else if (isDown) {
        e.preventDefault();
        if (playAtStartIndex < settingsOptions.length - 1) {
          setPlayAtStartIndex(prev => prev + 1);
        } else {
          setFocusSection('keyboard');
        }
      } else if (isLeft) {
        e.preventDefault();
        setFocusSection('sidebar');
      } else if (isRight) {
        e.preventDefault();
        setFocusSection('keyboard');
        setKeyboardIndex(Math.min(playAtStartIndex * 4, KEYBOARD_OPTIONS.length - 1));
      } else if (isEnter) {
        e.preventDefault();
        handlePlayAtStartChange(settingsOptions[playAtStartIndex]);
      }
      return;
    }

    if (focusSection === 'keyboard') {
      const row = Math.floor(keyboardIndex / 4);
      const col = keyboardIndex % 4;
      const maxIdx = KEYBOARD_OPTIONS.length - 1;
      if (isUp) {
        e.preventDefault();
        if (row > 0) {
          const newIdx = keyboardIndex - 4;
          setKeyboardIndex(Math.max(0, newIdx));
        } else {
          setFocusSection('playAtStart');
          setPlayAtStartIndex(settingsOptions.length - 1);
        }
      } else if (isDown) {
        e.preventDefault();
        const newIdx = keyboardIndex + 4;
        if (newIdx <= maxIdx) {
          setKeyboardIndex(newIdx);
        }
      } else if (isLeft) {
        e.preventDefault();
        if (col > 0) {
          setKeyboardIndex(keyboardIndex - 1);
        } else {
          setFocusSection('playAtStart');
          setPlayAtStartIndex(Math.min(Math.floor(keyboardIndex / 4), settingsOptions.length - 1));
        }
      } else if (isRight) {
        e.preventDefault();
        if (col < 3 && keyboardIndex + 1 <= maxIdx) {
          setKeyboardIndex(keyboardIndex + 1);
        }
      } else if (isEnter) {
        e.preventDefault();
        handleKeyboardChange(keyboardIndex);
      }
      return;
    }
  });

  const playAtStartLabels: Record<PlayAtStartMode, string> = {
    "last-played": t('settings_last_played') || 'Last Played',
    "random": t('settings_random') || 'Random',
    "favorite": t('settings_favorite') || 'Favorite',
    "none": t('settings_none') || 'None',
  };

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
        />
      </div>

      <div className="absolute bg-[#0e0e0e] h-[1080px] left-0 top-0 w-[1920px]" />

      <div className="absolute h-[57px] left-[31px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img alt="" className="block max-w-none w-full h-full" src={assetPath("images/path-8.svg")} />
        </div>
      </div>

      <Sidebar activePage="settings" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[36px] text-white top-[64px] z-10">
        {t('settings') || 'Settings'}
      </p>

      <div
        className="absolute left-[236px] top-[140px] w-[1600px] h-[900px] overflow-y-auto z-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Play at Start Section */}
        <div className="mb-[40px]">
          <p className="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white mb-[20px]">
            {t('settings_play_at_start') || 'Play at Start'}
          </p>
          <div className="flex flex-col gap-[8px]">
            {settingsOptions.map((option, index) => {
              const isItemFocused = focusSection === 'playAtStart' && playAtStartIndex === index;
              const isSelected = playAtStart === option;
              return (
                <div
                  key={option}
                  className={`flex items-center gap-[20px] px-[28px] rounded-[14px] transition-all duration-150 cursor-pointer h-[90px] w-[700px] ${
                    isItemFocused
                      ? 'bg-[#ff4199]'
                      : isSelected
                        ? 'bg-[rgba(255,65,153,0.15)]'
                        : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)]'
                  }`}
                  style={{
                    boxShadow: isItemFocused
                      ? '0 0 20px rgba(255,65,153,0.35), inset 1px 1px 8px rgba(255,255,255,0.1)'
                      : 'none',
                  }}
                  onClick={() => handlePlayAtStartChange(option)}
                  data-testid={`option-${option}`}
                >
                  <div className="border-[#ff4199] border-[3px] border-solid rounded-full w-[36px] h-[36px] flex items-center justify-center flex-shrink-0">
                    {isSelected && (
                      <div className="bg-[#ff4199] rounded-full w-[20px] h-[20px]" />
                    )}
                  </div>
                  <p className={`font-['Ubuntu',Helvetica] font-medium leading-normal not-italic truncate ${isItemFocused ? 'text-[28px] text-white' : 'text-[26px] text-white'}`}>
                    {playAtStartLabels[option]}
                  </p>
                  {isSelected && !isItemFocused && (
                    <span className="ml-auto font-['Ubuntu',Helvetica] text-[18px] text-[#ff4199] flex-shrink-0">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyboard Selection Section */}
        <div className="mb-[40px]">
          <p className="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white mb-[20px]">
            {t('select_keyboard') || 'Select Keyboard'}
          </p>
          <div className="flex flex-wrap gap-[14px]" style={{ width: '740px' }}>
            {KEYBOARD_OPTIONS.map((kb, index) => {
              const isItemFocused = focusSection === 'keyboard' && keyboardIndex === index;
              const isSelected = selectedKeyboard === index;
              return (
                <div
                  key={kb.id}
                  className={`flex flex-col items-center justify-center w-[170px] h-[100px] rounded-[14px] transition-all duration-150 cursor-pointer ${
                    isItemFocused
                      ? 'bg-[#ff4199] scale-105'
                      : isSelected
                        ? 'bg-[rgba(255,65,153,0.2)] border-[2px] border-[#ff4199]'
                        : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border-[2px] border-transparent'
                  }`}
                  style={{
                    boxShadow: isItemFocused
                      ? '0 0 20px rgba(255,65,153,0.5)'
                      : isSelected
                        ? 'inset 1px 1px 8px rgba(255,65,153,0.15)'
                        : 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)',
                  }}
                  onClick={() => handleKeyboardChange(index)}
                  data-testid={`keyboard-${kb.id}`}
                >
                  <span className="text-[28px] mb-[4px]">{kb.flag}</span>
                  <p className={`font-['Ubuntu',Helvetica] font-medium text-center text-white truncate w-full px-[8px] ${isItemFocused ? 'text-[20px]' : 'text-[18px]'}`}>
                    {kb.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
