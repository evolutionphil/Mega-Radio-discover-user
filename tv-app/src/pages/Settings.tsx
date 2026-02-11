import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
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

interface LanguageOption {
  code: string;
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

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'sr', label: 'Српски', flag: '🇷🇸' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', label: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', label: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', label: 'Lietuvių', flag: '🇱🇹' },
  { code: 'is', label: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', label: 'Gaeilge', flag: '🇮🇪' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'mk', label: 'Македонски', flag: '🇲🇰' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
];

export const Settings = (): JSX.Element => {
  const { t, language, setLanguage } = useLocalization();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("none");
  const [selectedKeyboard, setSelectedKeyboard] = useState(0);
  const [focusSection, setFocusSection] = useState<'sidebar' | 'keyboard' | 'language' | 'playAtStart'>('keyboard');
  const [sidebarIndex, setSidebarIndex] = useState(4);
  const [playAtStartIndex, setPlayAtStartIndex] = useState(0);
  const [keyboardIndex, setKeyboardIndex] = useState(0);
  const [languageIndex, setLanguageIndex] = useState(0);
  const langListRef = useRef<HTMLDivElement>(null);

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
    const langIdx = LANGUAGE_OPTIONS.findIndex(l => l.code === language);
    if (langIdx >= 0) {
      setLanguageIndex(langIdx);
    }
  }, []);

  useEffect(() => {
    if (focusSection === 'language' && langListRef.current) {
      const container = langListRef.current;
      const itemHeight = 72;
      const itemTop = languageIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;
      const scrollTop = container.scrollTop;
      const viewHeight = container.clientHeight;

      if (itemTop < scrollTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > scrollTop + viewHeight) {
        container.scrollTop = itemBottom - viewHeight;
      }
    }
  }, [languageIndex, focusSection]);

  const handlePlayAtStartChange = (mode: PlayAtStartMode) => {
    setPlayAtStart(mode);
    localStorage.setItem("playAtStart", mode);
  };

  const handleKeyboardChange = (index: number) => {
    setSelectedKeyboard(index);
    localStorage.setItem("preferredKeyboard", KEYBOARD_OPTIONS[index].id);
  };

  const handleLanguageChange = (index: number) => {
    setLanguage(LANGUAGE_OPTIONS[index].code);
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
        setFocusSection('keyboard');
      } else if (isEnter) {
        e.preventDefault();
        setLocation(sidebarRoutes[sidebarIndex]);
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
          setKeyboardIndex(Math.max(0, keyboardIndex - 4));
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
          setFocusSection('sidebar');
        }
      } else if (isRight) {
        e.preventDefault();
        if (col < 3 && keyboardIndex + 1 <= maxIdx) {
          setKeyboardIndex(keyboardIndex + 1);
        } else {
          setFocusSection('language');
        }
      } else if (isEnter) {
        e.preventDefault();
        handleKeyboardChange(keyboardIndex);
      }
      return;
    }

    if (focusSection === 'language') {
      if (isUp) {
        e.preventDefault();
        if (languageIndex > 0) {
          setLanguageIndex(prev => prev - 1);
        }
      } else if (isDown) {
        e.preventDefault();
        if (languageIndex < LANGUAGE_OPTIONS.length - 1) {
          setLanguageIndex(prev => prev + 1);
        }
      } else if (isLeft) {
        e.preventDefault();
        setFocusSection('keyboard');
      } else if (isRight) {
        e.preventDefault();
        setFocusSection('playAtStart');
      } else if (isEnter) {
        e.preventDefault();
        handleLanguageChange(languageIndex);
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
        }
      } else if (isLeft) {
        e.preventDefault();
        setFocusSection('language');
      } else if (isRight) {
        e.preventDefault();
      } else if (isEnter) {
        e.preventDefault();
        handlePlayAtStartChange(settingsOptions[playAtStartIndex]);
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
        className="absolute left-[236px] top-[140px] w-[1650px] h-[900px] overflow-hidden z-10 flex gap-[40px]"
      >
        {/* Keyboard Selection Section - LEFT */}
        <div className="flex-shrink-0" style={{ width: '580px' }}>
          <p className="font-['Ubuntu',Helvetica] font-bold text-[26px] text-white mb-[16px]">
            {t('select_keyboard') || 'Select Keyboard'}
          </p>
          <div className="flex flex-wrap gap-[10px]" style={{ width: '580px' }}>
            {KEYBOARD_OPTIONS.map((kb, index) => {
              const isItemFocused = focusSection === 'keyboard' && keyboardIndex === index;
              const isSelected = selectedKeyboard === index;
              return (
                <div
                  key={kb.id}
                  className={`flex flex-col items-center justify-center w-[135px] h-[100px] rounded-[12px] transition-all duration-150 cursor-pointer ${
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
                  <span className="text-[26px] mb-[2px]">{kb.flag}</span>
                  <p className={`font-['Ubuntu',Helvetica] font-medium text-center text-white truncate w-full px-[6px] ${isItemFocused ? 'text-[18px]' : 'text-[16px]'}`}>
                    {kb.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Selection Section - CENTER */}
        <div className="flex-shrink-0" style={{ width: '460px' }}>
          <p className="font-['Ubuntu',Helvetica] font-bold text-[26px] text-white mb-[16px]">
            {t('select_language') || 'Select Language'}
          </p>
          <div
            ref={langListRef}
            className="flex flex-col gap-[4px] overflow-y-auto"
            style={{ height: '840px', scrollbarWidth: 'none' }}
          >
            {LANGUAGE_OPTIONS.map((lang, index) => {
              const isItemFocused = focusSection === 'language' && languageIndex === index;
              const isSelected = language === lang.code;
              return (
                <div
                  key={lang.code}
                  className={`flex items-center gap-[16px] px-[20px] rounded-[12px] transition-all duration-150 cursor-pointer h-[68px] flex-shrink-0 ${
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
                  onClick={() => handleLanguageChange(index)}
                  data-testid={`language-${lang.code}`}
                >
                  <span className="text-[24px] flex-shrink-0">{lang.flag}</span>
                  <p className={`font-['Ubuntu',Helvetica] font-medium leading-normal not-italic truncate ${isItemFocused ? 'text-[24px] text-white' : 'text-[22px] text-white'}`}>
                    {lang.label}
                  </p>
                  {isSelected && !isItemFocused && (
                    <span className="ml-auto font-['Ubuntu',Helvetica] text-[18px] text-[#ff4199] flex-shrink-0">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Play at Start Section - RIGHT */}
        <div className="flex-shrink-0" style={{ width: '460px' }}>
          <p className="font-['Ubuntu',Helvetica] font-bold text-[26px] text-white mb-[16px]">
            {t('settings_play_at_start') || 'Play at Start'}
          </p>
          <div className="flex flex-col gap-[8px]">
            {settingsOptions.map((option, index) => {
              const isItemFocused = focusSection === 'playAtStart' && playAtStartIndex === index;
              const isSelected = playAtStart === option;
              return (
                <div
                  key={option}
                  className={`flex items-center gap-[20px] px-[24px] rounded-[12px] transition-all duration-150 cursor-pointer h-[82px] ${
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
                  <div className="border-[#ff4199] border-[3px] border-solid rounded-full w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                    {isSelected && (
                      <div className="bg-[#ff4199] rounded-full w-[18px] h-[18px]" />
                    )}
                  </div>
                  <p className={`font-['Ubuntu',Helvetica] font-medium leading-normal not-italic truncate ${isItemFocused ? 'text-[24px] text-white' : 'text-[22px] text-white'}`}>
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
      </div>
    </div>
  );
};
