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
  const [sidebarIndex, setSidebarIndex] = useState(5);
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

  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/country-select', '/settings'];
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

  var optionRowBase = {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '20px',
    height: '68px',
    paddingLeft: '24px',
    paddingRight: '24px',
    borderRadius: '14px',
    cursor: 'pointer',
    flexShrink: 0,
  };

  var getOptionRowBg = (focused: boolean, selected: boolean) =>
    focused ? '#ff4199' : selected ? 'rgba(255,65,153,0.12)' : 'transparent';

  var getOptionRowShadow = (focused: boolean) =>
    focused ? '0 0 24px rgba(255,65,153,0.3)' : 'none';

  var checkmarkStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#ff4199',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  var optionTextStyle = {
    fontWeight: 500,
    fontSize: '22px',
    color: '#ffffff',
    flex: 1,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
    margin: 0,
  };

  var radioStyle = (selected: boolean) => ({
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '3px solid ' + (selected ? '#ff4199' : 'rgba(255,255,255,0.3)'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  var radioDotStyle = {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#ff4199',
  };

  var flagStyle = {
    width: '40px',
    height: '28px',
    borderRadius: '4px',
    objectFit: 'cover' as const,
    flexShrink: 0,
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
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
              style={{ ...optionRowBase, backgroundColor: getOptionRowBg(isItemFocused, isSelected), boxShadow: getOptionRowShadow(isItemFocused) }}
              onClick={() => { handleLanguageChange(index); }}
              data-testid={`language-${lang.code}`}
            >
              <img src={getFlagUrl(lang.country)} alt={lang.label} style={flagStyle} />
              <p className="font-['Ubuntu',Helvetica]" style={optionTextStyle}>
                {lang.label}
              </p>
              {isSelected && (
                <div style={checkmarkStyle}>
                  <span style={{ color: '#ffffff', fontSize: '16px' }}>✓</span>
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
              style={{ ...optionRowBase, backgroundColor: getOptionRowBg(isItemFocused, isSelected), boxShadow: getOptionRowShadow(isItemFocused) }}
              onClick={() => { handleKeyboardChange(index); }}
              data-testid={`keyboard-${kb.id}`}
            >
              <img src={getFlagUrl(kb.country)} alt={kb.label} style={flagStyle} />
              <p className="font-['Ubuntu',Helvetica]" style={optionTextStyle}>
                {kb.label}
              </p>
              {isSelected && (
                <div style={checkmarkStyle}>
                  <span style={{ color: '#ffffff', fontSize: '16px' }}>✓</span>
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
              style={{ ...optionRowBase, backgroundColor: getOptionRowBg(isItemFocused, isSelected), boxShadow: getOptionRowShadow(isItemFocused) }}
              onClick={() => handlePlayAtStartChange(option)}
              data-testid={`option-${option}`}
            >
              <div style={radioStyle(isSelected)}>
                {isSelected && <div style={radioDotStyle} />}
              </div>
              <p className="font-['Ubuntu',Helvetica]" style={optionTextStyle}>
                {playAtStartLabels[option]}
              </p>
            </div>
          );
        });

      case 'timer':
        return (
          <>
            {isTimerActive && remainingSeconds !== null && (
              <div
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', height: '56px', paddingLeft: '24px', paddingRight: '24px', marginBottom: '8px', borderRadius: '14px', backgroundColor: 'rgba(255,65,153,0.1)', border: '1px solid rgba(255,65,153,0.25)', flexShrink: 0 }}
                data-testid="sleep-timer-remaining"
              >
                <span style={{ fontSize: '20px' }}>💤</span>
                <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 700, fontSize: '20px', color: '#ff4199', margin: 0 }}>
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
                  style={{ ...optionRowBase, backgroundColor: getOptionRowBg(isItemFocused, isSelected), boxShadow: getOptionRowShadow(isItemFocused) }}
                  onClick={() => { option === null ? cancelSleepTimer() : setSleepTimer(option); }}
                  data-testid={`sleep-timer-${optionKey}`}
                >
                  <div style={radioStyle(isSelected)}>
                    {isSelected && <div style={radioDotStyle} />}
                  </div>
                  <p className="font-['Ubuntu',Helvetica]" style={optionTextStyle}>
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
              style={{
                display: 'flex',
                flexDirection: 'row' as const,
                alignItems: 'center',
                gap: '20px',
                height: '88px',
                paddingLeft: '24px',
                paddingRight: '24px',
                borderRadius: '14px',
                cursor: 'pointer',
                flexShrink: 0,
                backgroundColor: isItemFocused ? 'rgba(255,65,153,0.15)' : 'transparent',
                boxShadow: isItemFocused ? '0 0 24px rgba(255,65,153,0.15)' : 'none',
              }}
              onClick={item.toggle}
              data-testid={item.testId}
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 500, fontSize: '22px', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {item.label}
                </p>
                <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 400, fontSize: '16px', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '34px',
                borderRadius: '9999px',
                flexShrink: 0,
                position: 'relative' as const,
                backgroundColor: item.value ? '#ff4199' : 'rgba(255,255,255,0.15)',
                transition: 'background-color 0.2s',
              }}>
                <div style={{
                  position: 'absolute' as const,
                  top: '4px',
                  left: item.value ? '30px' : '4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'left 0.2s',
                }} />
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

      <div style={{ position: 'absolute', left: '236px', top: '140px', width: '1650px', height: '900px', zIndex: 10, display: 'flex', gap: 0 }}>

        <div style={{ flexShrink: 0, width: '420px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '24px' }}>
            {categories.map((cat, index) => {
              const isCatFocused = focusSection === 'categories' && categoryIndex === index;
              const isActive = categoryIndex === index;
              return (
                <div
                  key={cat}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                    height: '80px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '16px',
                    backgroundColor: isCatFocused ? '#ff4199' : isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    boxShadow: isCatFocused ? '0 0 30px rgba(255,65,153,0.25)' : 'none'
                  }}
                  onClick={() => { setCategoryIndex(index); setFocusSection('options'); setOptionIndex(0); }}
                  data-testid={`category-${cat}`}
                >
                  <span style={{ fontSize: '28px', flexShrink: 0, width: '40px', textAlign: 'center' }}>{CATEGORY_ICONS[cat]}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <p
                      className="font-['Ubuntu',Helvetica]"
                      style={{
                        fontWeight: 600,
                        fontSize: '22px',
                        color: isCatFocused || isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: 0
                      }}
                    >
                      {getCategoryLabel(cat)}
                    </p>
                    {!isCatFocused && (
                      <p
                        className="font-['Ubuntu',Helvetica]"
                        style={{
                          fontWeight: 400,
                          fontSize: '16px',
                          color: 'rgba(255,255,255,0.35)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0
                        }}
                      >
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
                    <div style={{ width: '4px', height: '40px', borderRadius: '9999px', backgroundColor: '#ff4199', flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '40px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <img alt="" style={{ width: '36px', height: '36px' }} src={assetPath("images/path-8.svg")} />
              <div>
                <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 700, fontSize: '18px', color: '#ffffff', margin: 0 }}>
                  <span style={{ fontWeight: 700 }}>mega</span><span style={{ fontWeight: 300 }}>radio</span>
                </p>
                <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.3)', margin: 0 }} data-testid="text-app-version">
                  Version 3.0
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0, marginLeft: '8px', marginRight: '8px' }} />

        <div style={{ flex: 1, minWidth: 0, paddingLeft: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', marginBottom: '24px', height: '48px' }}>
            <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 700, fontSize: '28px', color: '#ffffff', margin: 0, whiteSpace: 'nowrap' }}>
              {getCategoryLabel(categories[categoryIndex])}
            </p>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <p className="font-['Ubuntu',Helvetica]" style={{ fontWeight: 400, fontSize: '18px', color: 'rgba(255,255,255,0.35)', flexShrink: 0, margin: 0 }}>
              {renderCategoryDescription()}
            </p>
          </div>

          <div
            ref={optionListRef}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', paddingRight: '16px', height: '800px', scrollbarWidth: 'none' }}
          >
            {renderOptions()}
          </div>
        </div>
      </div>
    </div>
  );
};
