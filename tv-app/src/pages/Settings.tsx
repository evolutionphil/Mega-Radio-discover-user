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
  country: string;
}

interface LanguageOption {
  code: string;
  label: string;
  country: string;
}

const KEYBOARD_OPTIONS: KeyboardOption[] = [
  { id: 'en', label: 'English', country: 'GB' },
  { id: 'tr', label: 'Türkçe', country: 'TR' },
  { id: 'ar', label: 'العربية', country: 'SA' },
  { id: 'ru', label: 'Русский', country: 'RU' },
  { id: 'de', label: 'Deutsch', country: 'DE' },
  { id: 'fr', label: 'Français', country: 'FR' },
  { id: 'es', label: 'Español', country: 'ES' },
  { id: 'ja', label: '日本語', country: 'JP' },
  { id: 'zh', label: '中文', country: 'CN' },
  { id: 'ko', label: '한국어', country: 'KR' },
  { id: 'el', label: 'Ελληνικά', country: 'GR' },
  { id: 'hi', label: 'हिन्दी', country: 'IN' },
  { id: 'th', label: 'ไทย', country: 'TH' },
];

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', country: 'US' },
  { code: 'de', label: 'Deutsch', country: 'DE' },
  { code: 'fr', label: 'Français', country: 'FR' },
  { code: 'es', label: 'Español', country: 'ES' },
  { code: 'it', label: 'Italiano', country: 'IT' },
  { code: 'pt', label: 'Português', country: 'PT' },
  { code: 'ru', label: 'Русский', country: 'RU' },
  { code: 'ja', label: '日本語', country: 'JP' },
  { code: 'zh', label: '中文', country: 'CN' },
  { code: 'ar', label: 'العربية', country: 'SA' },
  { code: 'tr', label: 'Türkçe', country: 'TR' },
  { code: 'pl', label: 'Polski', country: 'PL' },
  { code: 'nl', label: 'Nederlands', country: 'NL' },
  { code: 'sv', label: 'Svenska', country: 'SE' },
  { code: 'no', label: 'Norsk', country: 'NO' },
  { code: 'da', label: 'Dansk', country: 'DK' },
  { code: 'fi', label: 'Suomi', country: 'FI' },
  { code: 'cs', label: 'Čeština', country: 'CZ' },
  { code: 'hu', label: 'Magyar', country: 'HU' },
  { code: 'ro', label: 'Română', country: 'RO' },
  { code: 'el', label: 'Ελληνικά', country: 'GR' },
  { code: 'th', label: 'ไทย', country: 'TH' },
  { code: 'ko', label: '한국어', country: 'KR' },
  { code: 'vi', label: 'Tiếng Việt', country: 'VN' },
  { code: 'id', label: 'Bahasa Indonesia', country: 'ID' },
  { code: 'ms', label: 'Bahasa Melayu', country: 'MY' },
  { code: 'hi', label: 'हिन्दी', country: 'IN' },
  { code: 'bn', label: 'বাংলা', country: 'BD' },
  { code: 'ta', label: 'தமிழ்', country: 'IN' },
  { code: 'te', label: 'తెలుగు', country: 'IN' },
  { code: 'ur', label: 'اردو', country: 'PK' },
  { code: 'fa', label: 'فارسی', country: 'IR' },
  { code: 'he', label: 'עברית', country: 'IL' },
  { code: 'uk', label: 'Українська', country: 'UA' },
  { code: 'bg', label: 'Български', country: 'BG' },
  { code: 'sr', label: 'Српски', country: 'RS' },
  { code: 'hr', label: 'Hrvatski', country: 'HR' },
  { code: 'sk', label: 'Slovenčina', country: 'SK' },
  { code: 'sl', label: 'Slovenščina', country: 'SI' },
  { code: 'et', label: 'Eesti', country: 'EE' },
  { code: 'lv', label: 'Latviešu', country: 'LV' },
  { code: 'lt', label: 'Lietuvių', country: 'LT' },
  { code: 'is', label: 'Íslenska', country: 'IS' },
  { code: 'ga', label: 'Gaeilge', country: 'IE' },
  { code: 'sq', label: 'Shqip', country: 'AL' },
  { code: 'mk', label: 'Македонски', country: 'MK' },
  { code: 'am', label: 'አማርኛ', country: 'ET' },
  { code: 'sw', label: 'Kiswahili', country: 'KE' },
];

const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

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
                  <img src={getFlagUrl(kb.country)} alt={kb.label} className="w-[36px] h-[26px] rounded-[3px] object-cover mb-[2px]" />
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
                  <img src={getFlagUrl(lang.country)} alt={lang.label} className="w-[36px] h-[26px] rounded-[3px] object-cover flex-shrink-0" />
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
