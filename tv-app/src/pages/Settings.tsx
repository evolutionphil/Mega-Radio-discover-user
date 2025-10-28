import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

type PlayAtStartMode = "last-played" | "random" | "favorite" | "none";

// Supported languages with their display names
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'nl', name: 'Nederlands (Dutch)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'pl', name: 'Polski (Polish)' },
  { code: 'tr', name: 'Türkçe (Turkish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'he', name: 'עברית (Hebrew)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'fa', name: 'فارسی (Persian)' },
  { code: 'sv', name: 'Svenska (Swedish)' },
  { code: 'no', name: 'Norsk (Norwegian)' },
  { code: 'da', name: 'Dansk (Danish)' },
  { code: 'fi', name: 'Suomi (Finnish)' },
  { code: 'el', name: 'Ελληνικά (Greek)' },
  { code: 'cs', name: 'Čeština (Czech)' },
  { code: 'sk', name: 'Slovenčina (Slovak)' },
  { code: 'hu', name: 'Magyar (Hungarian)' },
  { code: 'ro', name: 'Română (Romanian)' },
  { code: 'bg', name: 'Български (Bulgarian)' },
  { code: 'hr', name: 'Hrvatski (Croatian)' },
  { code: 'sr', name: 'Српски (Serbian)' },
  { code: 'uk', name: 'Українська (Ukrainian)' },
  { code: 'sl', name: 'Slovenščina (Slovenian)' },
  { code: 'lt', name: 'Lietuvių (Lithuanian)' },
  { code: 'lv', name: 'Latviešu (Latvian)' },
  { code: 'et', name: 'Eesti (Estonian)' },
  { code: 'is', name: 'Íslenska (Icelandic)' },
  { code: 'ga', name: 'Gaeilge (Irish)' },
  { code: 'sq', name: 'Shqip (Albanian)' },
  { code: 'mk', name: 'Македонски (Macedonian)' },
  { code: 'am', name: 'አማርኛ (Amharic)' },
  { code: 'sw', name: 'Kiswahili (Swahili)' },
];

export const Settings = (): JSX.Element => {
  console.log('[Settings] 🎬 Component rendering');
  
  const { t, language, setLanguage } = useLocalization();
  const [, setLocation] = useLocation();
  const [playAtStart, setPlayAtStart] = useState<PlayAtStartMode>("last-played");
  const [showLanguageList, setShowLanguageList] = useState(false);

  // Define focusable items: 5 sidebar + 4 play settings + 1 language button = 10 total
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];
  const settingsOptions: PlayAtStartMode[] = ["last-played", "random", "favorite", "none"];
  const totalItems = showLanguageList ? 5 + SUPPORTED_LANGUAGES.length : 10;

  // Focus management
  const { focusIndex, handleNavigation, handleSelect, handleBack, isFocused, setFocusIndex } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 5, // Start on first settings option
    onSelect: (index) => {
      if (showLanguageList) {
        // In language list mode
        if (index < 5) {
          // Sidebar navigation
          setShowLanguageList(false);
          const route = sidebarRoutes[index];
          setLocation(route);
        } else {
          // Language selection
          const langIndex = index - 5;
          const selectedLang = SUPPORTED_LANGUAGES[langIndex];
          console.log('[Settings] Language selected:', selectedLang.name, selectedLang.code);
          setLanguage(selectedLang.code);
          setShowLanguageList(false);
          setFocusIndex(9); // Return focus to language button
        }
      } else {
        // Normal settings mode
        if (index < 5) {
          // Sidebar navigation (0-4)
          const route = sidebarRoutes[index];
          setLocation(route);
        } else if (index < 9) {
          // Play at start options (5-8)
          const optionIndex = index - 5;
          handlePlayAtStartChange(settingsOptions[optionIndex]);
        } else if (index === 9) {
          // Language selector button (index 9)
          setShowLanguageList(true);
          setFocusIndex(5); // Focus first language in list
        }
      }
    },
    onBack: () => {
      if (showLanguageList) {
        setShowLanguageList(false);
        setFocusIndex(9); // Return to language button
      } else {
        setLocation('/discover-no-user');
      }
    }
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
    console.log("[Settings] Play at start mode changed to:", mode);
  };

  // Get current language display name
  const currentLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';

  // Debug logging
  useEffect(() => {
    console.log('[Settings] Component mounted, showLanguageList:', showLanguageList);
    console.log('[Settings] Language selector should be visible:', !showLanguageList);
    console.log('[Settings] Current language:', currentLanguageName);
  }, [showLanguageList, currentLanguageName]);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-settings">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
        />
      </div>

      {/* Black Overlay - Semi-transparent to show background gradient */}
      <div className="absolute bg-black/80 h-[1080px] left-0 top-0 w-[1920px] z-0" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[31px] top-[64px] w-[164.421px] z-50">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>

      {/* Left Sidebar Menu */}
      <Sidebar activePage="settings" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Settings Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-[#ff4199] top-[242px] z-50">
        {t('settings') || 'Settings'}
      </p>

      {!showLanguageList ? (
        <>
          {/* Settings Content Card - Play at Start (LEFT SIDE) */}
          <div className="absolute bg-[#1f1f1f] h-[400px] left-[500px] overflow-clip rounded-[20px] top-[320px] w-[620px] z-20">
            {/* Play at Start Section */}
            <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[30px]">
              {t('settings_play_at_start') || 'Play at Start'}
            </p>

            {/* Last Played Option */}
            <div 
              className={`absolute left-[30px] top-[95px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(5))}`}
              onClick={() => handlePlayAtStartChange("last-played")}
              data-testid="option-last-played"
              tabIndex={0}
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
              className={`absolute left-[30px] top-[152px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(6))}`}
              onClick={() => handlePlayAtStartChange("random")}
              data-testid="option-random"
              tabIndex={0}
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
              className={`absolute left-[30px] top-[209px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(7))}`}
              onClick={() => handlePlayAtStartChange("favorite")}
              data-testid="option-favorite"
              tabIndex={0}
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
              className={`absolute left-[30px] top-[266px] flex items-center gap-[20px] cursor-pointer ${getFocusClasses(isFocused(8))}`}
              onClick={() => handlePlayAtStartChange("none")}
              data-testid="option-none"
              tabIndex={0}
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

          {/* Language Settings Card (RIGHT SIDE) */}
          <div className="absolute bg-[#1f1f1f] h-[400px] left-[1140px] overflow-clip rounded-[20px] top-[320px] w-[620px] z-20">
            <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[30px]">
              {t('settings_language') || 'Language'}
            </p>

            {/* Language Selector Button */}
            <div 
              className={`absolute left-[30px] top-[95px] right-[30px] h-[50px] bg-[#2a2a2a] rounded-[12px] flex items-center justify-between px-[20px] cursor-pointer ${getFocusClasses(isFocused(9))}`}
              onClick={() => { setShowLanguageList(true); setFocusIndex(5); }}
              data-testid="button-language-selector"
              tabIndex={0}
            >
              <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-white">
                {currentLanguageName}
              </p>
              <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        /* Language Selection List */
        <div className="absolute bg-[#1f1f1f] left-[50%] translate-x-[-50%] overflow-hidden rounded-[20px] top-[320px] w-[886px] h-[540px] z-20">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[30px] not-italic text-[24px] text-white top-[20px]">
            {t('settings_select_language') || 'Select Language'}
          </p>
          
          <p className="absolute font-['Ubuntu',Helvetica] font-normal leading-normal left-[30px] not-italic text-[16px] text-white/60 top-[55px]">
            {t('settings_language_desc') || 'Choose your preferred language. The interface will update immediately.'}
          </p>

          {/* Scrollable Language List */}
          <div className="absolute left-[30px] right-[30px] top-[100px] bottom-[20px] overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang, index) => {
              const itemIndex = index + 5; // Offset by sidebar items
              const isSelected = language === lang.code;
              
              return (
                <div
                  key={lang.code}
                  className={`h-[50px] flex items-center justify-between px-[20px] rounded-[12px] mb-[8px] cursor-pointer ${
                    isSelected ? 'bg-[#ff4199]' : 'bg-[#2a2a2a]'
                  } ${getFocusClasses(isFocused(itemIndex))}`}
                  onClick={() => { setLanguage(lang.code); setShowLanguageList(false); setFocusIndex(9); }}
                  data-testid={`language-${lang.code}`}
                  tabIndex={0}
                >
                  <p className={`font-['Ubuntu',Helvetica] font-medium text-[20px] ${
                    isSelected ? 'text-white' : 'text-white/80'
                  }`}>
                    {lang.name}
                  </p>
                  {isSelected && (
                    <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
