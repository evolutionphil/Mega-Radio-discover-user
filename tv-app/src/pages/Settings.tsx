import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useSleepTimer } from "@/contexts/SleepTimerContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
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

type SettingsCategory = 'language' | 'keyboard' | 'playback' | 'timer' | 'accessibility';

const CATEGORY_ICONS: Record<SettingsCategory, string> = {
  language: '🌍',
  keyboard: '⌨️',
  playback: '▶️',
  timer: '⏰',
  accessibility: '♿',
};

export const Settings = (): JSX.Element => {
  const { t, language, setLanguage } = useLocalization();
  const { sleepTimerMinutes, remainingSeconds, setSleepTimer, cancelSleepTimer, isTimerActive } = useSleepTimer();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("none");
  const [selectedKeyboard, setSelectedKeyboard] = useState(0);
  const { highContrast, largeText, setHighContrast, setLargeText } = useAccessibility();

  const [focusSection, setFocusSection] = useState<'sidebar' | 'categories' | 'options'>('categories');
  const [sidebarIndex, setSidebarIndex] = useState(4);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [optionIndex, setOptionIndex] = useState(0);

  const optionListRef = useRef<HTMLDivElement>(null);

  const categories: SettingsCategory[] = ['language', 'keyboard', 'playback', 'timer', 'accessibility'];

  const sleepTimerOptions: (number | null)[] = [15, 30, 60, 120, null];
  const sleepTimerLabels: Record<string, string> = {
    '15': t('sleep_timer_15') || '15 min',
    '30': t('sleep_timer_30') || '30 min',
    '60': t('sleep_timer_60') || '1 hour',
    '120': t('sleep_timer_120') || '2 hours',
    'null': t('sleep_timer_off') || 'Off',
  };

  const formatRemainingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings', '/country-select'];
  const settingsOptions: PlayAtStartMode[] = ["last-played", "random", "favorite", "none"];

  const isFocused = (idx: number) => focusSection === 'sidebar' && sidebarIndex === idx;
  const getFocusClasses = (focused: boolean) => focused ? 'ring-2 ring-[#ff4199] scale-105' : '';

  const getCategoryLabel = (cat: SettingsCategory): string => {
    switch (cat) {
      case 'language': return t('select_language') || 'Language';
      case 'keyboard': return t('select_keyboard') || 'Keyboard';
      case 'playback': return t('settings_play_at_start') || 'Playback';
      case 'timer': return t('sleep_timer') || 'Sleep Timer';
      case 'accessibility': return t('accessibility') || 'Accessibility';
    }
  };

  const getOptionCount = (): number => {
    switch (categories[categoryIndex]) {
      case 'language': return LANGUAGE_OPTIONS.length;
      case 'keyboard': return KEYBOARD_OPTIONS.length;
      case 'playback': return settingsOptions.length;
      case 'timer': return sleepTimerOptions.length;
      case 'accessibility': return 2;
      default: return 0;
    }
  };

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
      }
    }
  }, []);

  useEffect(() => {
    setOptionIndex(0);
    if (optionListRef.current) {
      optionListRef.current.scrollTop = 0;
    }
  }, [categoryIndex]);

  useEffect(() => {
    if (focusSection === 'options' && optionListRef.current) {
      const container = optionListRef.current;
      const itemHeight = 72;
      const itemTop = optionIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;
      const scrollTop = container.scrollTop;
      const viewHeight = container.clientHeight;
      if (itemTop < scrollTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > scrollTop + viewHeight) {
        container.scrollTop = itemBottom - viewHeight;
      }
    }
  }, [optionIndex, focusSection]);

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

  const handleOptionSelect = () => {
    const cat = categories[categoryIndex];
    switch (cat) {
      case 'language':
        handleLanguageChange(optionIndex);
        break;
      case 'keyboard':
        handleKeyboardChange(optionIndex);
        break;
      case 'playback':
        handlePlayAtStartChange(settingsOptions[optionIndex]);
        break;
      case 'timer': {
        const opt = sleepTimerOptions[optionIndex];
        if (opt === null) cancelSleepTimer();
        else setSleepTimer(opt);
        break;
      }
      case 'accessibility':
        if (optionIndex === 0) setHighContrast(!highContrast);
        else setLargeText(!largeText);
        break;
    }
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
      if (focusSection === 'options') {
        setFocusSection('categories');
      } else if (focusSection === 'categories') {
        setFocusSection('sidebar');
      } else {
        setLocation('/discover-no-user');
      }
      return;
    }

    if (focusSection === 'sidebar') {
      if (isUp) { e.preventDefault(); setSidebarIndex(prev => Math.max(0, prev - 1)); }
      else if (isDown) { e.preventDefault(); setSidebarIndex(prev => Math.min(5, prev + 1)); }
      else if (isRight) { e.preventDefault(); setFocusSection('categories'); }
      else if (isEnter) { e.preventDefault(); setLocation(sidebarRoutes[sidebarIndex]); }
      return;
    }

    if (focusSection === 'categories') {
      if (isUp) { e.preventDefault(); setCategoryIndex(prev => Math.max(0, prev - 1)); }
      else if (isDown) { e.preventDefault(); setCategoryIndex(prev => Math.min(categories.length - 1, prev + 1)); }
      else if (isLeft) { e.preventDefault(); setFocusSection('sidebar'); }
      else if (isRight || isEnter) { e.preventDefault(); setFocusSection('options'); setOptionIndex(0); }
      return;
    }

    if (focusSection === 'options') {
      const maxIdx = getOptionCount() - 1;
      if (isUp) { e.preventDefault(); if (optionIndex > 0) setOptionIndex(prev => prev - 1); }
      else if (isDown) { e.preventDefault(); if (optionIndex < maxIdx) setOptionIndex(prev => prev + 1); }
      else if (isLeft) { e.preventDefault(); setFocusSection('categories'); }
      else if (isEnter) { e.preventDefault(); handleOptionSelect(); }
      return;
    }
  });

  const playAtStartLabels: Record<PlayAtStartMode, string> = {
    "last-played": t('settings_last_played') || 'Last Played',
    "random": t('settings_random') || 'Random',
    "favorite": t('settings_favorite') || 'Favorite',
    "none": t('settings_none') || 'None',
  };

  const selectedLang = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];
  const selectedKb = KEYBOARD_OPTIONS[selectedKeyboard];

  const renderCategoryDescription = (): string => {
    const cat = categories[categoryIndex];
    switch (cat) {
      case 'language': return selectedLang.label;
      case 'keyboard': return selectedKb.label;
      case 'playback': return playAtStartLabels[playAtStart];
      case 'timer': return isTimerActive && remainingSeconds !== null
        ? `${sleepTimerLabels[String(sleepTimerMinutes)]} (${formatRemainingTime(remainingSeconds)})`
        : sleepTimerMinutes !== null ? sleepTimerLabels[String(sleepTimerMinutes)] : (t('sleep_timer_off') || 'Off');
      case 'accessibility': {
        const active: string[] = [];
        if (highContrast) active.push(t('high_contrast') || 'High Contrast');
        if (largeText) active.push(t('large_text') || 'Large Text');
        return active.length > 0 ? active.join(', ') : (t('settings_none') || 'None');
      }
      default: return '';
    }
  };

  const renderOptions = () => {
    const cat = categories[categoryIndex];
    const isFocusedOnOptions = focusSection === 'options';

    switch (cat) {
      case 'language':
        return LANGUAGE_OPTIONS.map((lang, index) => {
          const isItemFocused = isFocusedOnOptions && optionIndex === index;
          const isSelected = language === lang.code;
          return (
            <div
              key={lang.code}
              className={`flex items-center gap-[20px] h-[68px] px-[24px] rounded-[14px] cursor-pointer transition-all duration-150 flex-shrink-0 ${
                isItemFocused
                  ? 'bg-[#ff4199]'
                  : isSelected
                    ? 'bg-[rgba(255,65,153,0.12)]'
                    : 'bg-transparent'
              }`}
              style={isItemFocused ? { boxShadow: '0 0 24px rgba(255,65,153,0.3)' } : undefined}
              onClick={() => { handleLanguageChange(index); }}
              data-testid={`language-${lang.code}`}
            >
              <img src={getFlagUrl(lang.country)} alt={lang.label} className="w-[40px] h-[28px] rounded-[4px] object-cover flex-shrink-0" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              <p className={`font-['Ubuntu',Helvetica] font-medium text-[22px] text-white flex-1 truncate`}>
                {lang.label}
              </p>
              {isSelected && (
                <div className="w-[28px] h-[28px] rounded-full bg-[#ff4199] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[16px]">✓</span>
                </div>
              )}
            </div>
          );
        });

      case 'keyboard':
        return KEYBOARD_OPTIONS.map((kb, index) => {
          const isItemFocused = isFocusedOnOptions && optionIndex === index;
          const isSelected = selectedKeyboard === index;
          return (
            <div
              key={kb.id}
              className={`flex items-center gap-[20px] h-[68px] px-[24px] rounded-[14px] cursor-pointer transition-all duration-150 flex-shrink-0 ${
                isItemFocused
                  ? 'bg-[#ff4199]'
                  : isSelected
                    ? 'bg-[rgba(255,65,153,0.12)]'
                    : 'bg-transparent'
              }`}
              style={isItemFocused ? { boxShadow: '0 0 24px rgba(255,65,153,0.3)' } : undefined}
              onClick={() => { handleKeyboardChange(index); }}
              data-testid={`keyboard-${kb.id}`}
            >
              <img src={getFlagUrl(kb.country)} alt={kb.label} className="w-[40px] h-[28px] rounded-[4px] object-cover flex-shrink-0" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              <p className={`font-['Ubuntu',Helvetica] font-medium text-[22px] text-white flex-1 truncate`}>
                {kb.label}
              </p>
              {isSelected && (
                <div className="w-[28px] h-[28px] rounded-full bg-[#ff4199] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[16px]">✓</span>
                </div>
              )}
            </div>
          );
        });

      case 'playback':
        return settingsOptions.map((option, index) => {
          const isItemFocused = isFocusedOnOptions && optionIndex === index;
          const isSelected = playAtStart === option;
          return (
            <div
              key={option}
              className={`flex items-center gap-[20px] h-[68px] px-[24px] rounded-[14px] cursor-pointer transition-all duration-150 flex-shrink-0 ${
                isItemFocused
                  ? 'bg-[#ff4199]'
                  : isSelected
                    ? 'bg-[rgba(255,65,153,0.12)]'
                    : 'bg-transparent'
              }`}
              style={isItemFocused ? { boxShadow: '0 0 24px rgba(255,65,153,0.3)' } : undefined}
              onClick={() => handlePlayAtStartChange(option)}
              data-testid={`option-${option}`}
            >
              <div className={`w-[28px] h-[28px] rounded-full border-[3px] flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'border-[#ff4199]' : 'border-[rgba(255,255,255,0.3)]'
              }`}>
                {isSelected && <div className="w-[14px] h-[14px] rounded-full bg-[#ff4199]" />}
              </div>
              <p className={`font-['Ubuntu',Helvetica] font-medium text-[22px] text-white flex-1 truncate`}>
                {playAtStartLabels[option]}
              </p>
            </div>
          );
        });

      case 'timer':
        return (
          <>
            {isTimerActive && remainingSeconds !== null && (
              <div className="flex items-center gap-[12px] h-[56px] px-[24px] mb-[8px] rounded-[14px] bg-[rgba(255,65,153,0.1)] border border-[rgba(255,65,153,0.25)] flex-shrink-0" data-testid="sleep-timer-remaining">
                <span className="text-[20px]">💤</span>
                <p className="font-['Ubuntu',Helvetica] font-bold text-[20px] text-[#ff4199]">
                  {formatRemainingTime(remainingSeconds)}
                </p>
              </div>
            )}
            {sleepTimerOptions.map((option, index) => {
              const isItemFocused = isFocusedOnOptions && optionIndex === index;
              const optionKey = option === null ? 'null' : String(option);
              const isSelected = option === null ? sleepTimerMinutes === null : sleepTimerMinutes === option;
              return (
                <div
                  key={optionKey}
                  className={`flex items-center gap-[20px] h-[68px] px-[24px] rounded-[14px] cursor-pointer transition-all duration-150 flex-shrink-0 ${
                    isItemFocused
                      ? 'bg-[#ff4199]'
                      : isSelected
                        ? 'bg-[rgba(255,65,153,0.12)]'
                        : 'bg-transparent'
                  }`}
                  style={isItemFocused ? { boxShadow: '0 0 24px rgba(255,65,153,0.3)' } : undefined}
                  onClick={() => { option === null ? cancelSleepTimer() : setSleepTimer(option); }}
                  data-testid={`sleep-timer-${optionKey}`}
                >
                  <div className={`w-[28px] h-[28px] rounded-full border-[3px] flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-[#ff4199]' : 'border-[rgba(255,255,255,0.3)]'
                  }`}>
                    {isSelected && <div className="w-[14px] h-[14px] rounded-full bg-[#ff4199]" />}
                  </div>
                  <p className={`font-['Ubuntu',Helvetica] font-medium text-[22px] text-white flex-1 truncate`}>
                    {sleepTimerLabels[optionKey]}
                  </p>
                </div>
              );
            })}
          </>
        );

      case 'accessibility':
        return [
          { label: t('high_contrast') || 'High Contrast', value: highContrast, toggle: () => setHighContrast(!highContrast), testId: 'toggle-high-contrast', desc: t('high_contrast_desc') || 'Increases text and element visibility' },
          { label: t('large_text') || 'Large Text', value: largeText, toggle: () => setLargeText(!largeText), testId: 'toggle-large-text', desc: t('large_text_desc') || 'Makes all text 15% larger' },
        ].map((item, index) => {
          const isItemFocused = isFocusedOnOptions && optionIndex === index;
          return (
            <div
              key={item.testId}
              className={`flex items-center gap-[20px] h-[88px] px-[24px] rounded-[14px] cursor-pointer transition-all duration-150 flex-shrink-0 ${
                isItemFocused ? 'bg-[rgba(255,65,153,0.15)]' : 'bg-transparent'
              }`}
              style={isItemFocused ? { boxShadow: '0 0 24px rgba(255,65,153,0.15)' } : undefined}
              onClick={item.toggle}
              data-testid={item.testId}
            >
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-white truncate">
                  {item.label}
                </p>
                <p className="font-['Ubuntu',Helvetica] font-normal text-[16px] text-[rgba(255,255,255,0.45)] truncate">
                  {item.desc}
                </p>
              </div>
              <div className={`w-[60px] h-[34px] rounded-full transition-colors duration-200 flex-shrink-0 relative ${
                item.value ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.15)]'
              }`}>
                <div className={`absolute top-[4px] w-[26px] h-[26px] rounded-full bg-white transition-all duration-200 ${
                  item.value ? 'left-[30px]' : 'left-[4px]'
                }`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          );
        });

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
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

      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[36px] text-white top-[64px] z-10" data-testid="text-settings-title">
        {t('settings') || 'Settings'}
      </p>

      <div className="absolute left-[236px] top-[140px] w-[1650px] h-[900px] z-10 flex gap-0">

        <div className="flex-shrink-0" style={{ width: '420px' }}>
          <div className="flex flex-col gap-[4px] pr-[24px]">
            {categories.map((cat, index) => {
              const isCatFocused = focusSection === 'categories' && categoryIndex === index;
              const isActive = categoryIndex === index;
              return (
                <div
                  key={cat}
                  className={`flex items-center gap-[20px] h-[80px] px-[24px] rounded-[16px] cursor-pointer transition-all duration-200 ${
                    isCatFocused
                      ? 'bg-[#ff4199]'
                      : isActive
                        ? 'bg-[rgba(255,255,255,0.08)]'
                        : 'bg-transparent'
                  }`}
                  style={isCatFocused ? { boxShadow: '0 0 30px rgba(255,65,153,0.25)' } : undefined}
                  onClick={() => { setCategoryIndex(index); setFocusSection('options'); setOptionIndex(0); }}
                  data-testid={`category-${cat}`}
                >
                  <span className="text-[28px] flex-shrink-0 w-[40px] text-center">{CATEGORY_ICONS[cat]}</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className={`font-['Ubuntu',Helvetica] font-semibold text-[22px] truncate ${
                      isCatFocused ? 'text-white' : isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'
                    }`}>
                      {getCategoryLabel(cat)}
                    </p>
                    {!isCatFocused && (
                      <p className="font-['Ubuntu',Helvetica] font-normal text-[16px] text-[rgba(255,255,255,0.35)] truncate">
                        {cat === 'language' ? selectedLang.label
                          : cat === 'keyboard' ? selectedKb.label
                          : cat === 'playback' ? playAtStartLabels[playAtStart]
                          : cat === 'timer' ? (sleepTimerMinutes !== null ? sleepTimerLabels[String(sleepTimerMinutes)] : (t('sleep_timer_off') || 'Off'))
                          : cat === 'accessibility' ? (highContrast || largeText ? (
                              [highContrast && (t('high_contrast') || 'High Contrast'), largeText && (t('large_text') || 'Large Text')].filter(Boolean).join(', ')
                            ) : (t('settings_none') || 'None'))
                          : ''
                        }
                      </p>
                    )}
                  </div>
                  {isActive && !isCatFocused && (
                    <div className="w-[4px] h-[40px] rounded-full bg-[#ff4199] flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-[40px] px-[24px] pt-[24px] border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-[16px]">
              <img alt="" className="w-[36px] h-[36px]" src={assetPath("images/path-8.svg")} />
              <div>
                <p className="font-['Ubuntu',Helvetica] font-bold text-[18px] text-white">
                  <span className="font-bold">mega</span><span className="font-light">radio</span>
                </p>
                <p className="font-['Ubuntu',Helvetica] font-normal text-[14px] text-[rgba(255,255,255,0.3)]" data-testid="text-app-version">
                  Version 3.0
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1px] bg-[rgba(255,255,255,0.06)] flex-shrink-0 mx-[8px]" />

        <div className="flex-1 min-w-0 pl-[32px]">
          <div className="flex items-center gap-[16px] mb-[24px] h-[48px]">
            <p className="font-['Ubuntu',Helvetica] font-bold text-[28px] text-white">
              {getCategoryLabel(categories[categoryIndex])}
            </p>
            <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.06)]" />
            <p className="font-['Ubuntu',Helvetica] font-normal text-[18px] text-[rgba(255,255,255,0.35)] flex-shrink-0">
              {renderCategoryDescription()}
            </p>
          </div>

          <div
            ref={optionListRef}
            className="flex flex-col gap-[4px] overflow-y-auto pr-[16px]"
            style={{ height: '800px', scrollbarWidth: 'none' }}
          >
            {renderOptions()}
          </div>
        </div>
      </div>
    </div>
  );
};
