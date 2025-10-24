import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { megaRadioApi } from '@/services/megaRadioApi';
import { detectCountryAsync, type GeoLocationResult } from '@/utils/geolocation';

interface LocalizationContextType {
  language: string;
  translations: Record<string, string>;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
  detectedCountry: string;
  detectedCountryCode: string;
  geoLocationResult: GeoLocationResult | null;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Language to country mapping
const LANGUAGE_TO_COUNTRY: Record<string, { name: string; code: string }> = {
  'en': { name: 'United States', code: 'US' },
  'de': { name: 'Germany', code: 'DE' },
  'fr': { name: 'France', code: 'FR' },
  'es': { name: 'Spain', code: 'ES' },
  'it': { name: 'Italy', code: 'IT' },
  'pt': { name: 'Portugal', code: 'PT' },
  'ru': { name: 'Russia', code: 'RU' },
  'ja': { name: 'Japan', code: 'JP' },
  'zh': { name: 'China', code: 'CN' },
  'ar': { name: 'Saudi Arabia', code: 'SA' },
  'tr': { name: 'Turkey', code: 'TR' },
  'pl': { name: 'Poland', code: 'PL' },
  'nl': { name: 'Netherlands', code: 'NL' },
  'sv': { name: 'Sweden', code: 'SE' },
  'no': { name: 'Norway', code: 'NO' },
  'da': { name: 'Denmark', code: 'DK' },
  'fi': { name: 'Finland', code: 'FI' },
  'cs': { name: 'Czech Republic', code: 'CZ' },
  'hu': { name: 'Hungary', code: 'HU' },
  'ro': { name: 'Romania', code: 'RO' },
  'el': { name: 'Greece', code: 'GR' },
  'th': { name: 'Thailand', code: 'TH' },
  'ko': { name: 'South Korea', code: 'KR' },
  'vi': { name: 'Vietnam', code: 'VN' },
  'id': { name: 'Indonesia', code: 'ID' },
  'ms': { name: 'Malaysia', code: 'MY' },
  'hi': { name: 'India', code: 'IN' },
  'bn': { name: 'Bangladesh', code: 'BD' },
  'ta': { name: 'India', code: 'IN' },
  'te': { name: 'India', code: 'IN' },
  'ur': { name: 'Pakistan', code: 'PK' },
  'fa': { name: 'Iran', code: 'IR' },
  'he': { name: 'Israel', code: 'IL' },
  'uk': { name: 'Ukraine', code: 'UA' },
  'bg': { name: 'Bulgaria', code: 'BG' },
  'sr': { name: 'Serbia', code: 'RS' },
  'hr': { name: 'Croatia', code: 'HR' },
  'sk': { name: 'Slovakia', code: 'SK' },
  'sl': { name: 'Slovenia', code: 'SI' },
  'et': { name: 'Estonia', code: 'EE' },
  'lv': { name: 'Latvia', code: 'LV' },
  'lt': { name: 'Lithuania', code: 'LT' },
  'is': { name: 'Iceland', code: 'IS' },
  'ga': { name: 'Ireland', code: 'IE' },
  'sq': { name: 'Albania', code: 'AL' },
  'mk': { name: 'North Macedonia', code: 'MK' },
  'am': { name: 'Ethiopia', code: 'ET' },
  'sw': { name: 'Kenya', code: 'KE' },
};

// Detect device language
function detectDeviceLanguage(): string {
  try {
    // Try Samsung Tizen API first
    if (window.webapis && window.webapis.tv) {
      const tizenLang = window.webapis.tv.info?.getLanguage?.();
      if (tizenLang) {
        console.log('[Localization] Tizen language detected:', tizenLang);
        return tizenLang.toLowerCase().substring(0, 2);
      }
    }

    // Try LG webOS API
    if (window.webOS && window.webOS.systemInfo) {
      const webOSLang = window.webOS.systemInfo.locale || window.webOS.systemInfo.language;
      if (webOSLang) {
        console.log('[Localization] webOS language detected:', webOSLang);
        return webOSLang.toLowerCase().substring(0, 2);
      }
    }

    // Fallback to browser navigator
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    console.log('[Localization] Browser language detected:', browserLang);
    return browserLang.toLowerCase().substring(0, 2);
  } catch (error) {
    console.error('[Localization] Error detecting language:', error);
    return 'en';
  }
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState('United States');
  const [detectedCountryCode, setDetectedCountryCode] = useState('US');
  const [geoLocationResult, setGeoLocationResult] = useState<GeoLocationResult | null>(null);

  // Initialize: Detect language and load translations
  useEffect(() => {
    const initializeLocalization = async () => {
      try {
        // HYBRID GEOLOCATION: Try Tizen SystemInfo LOCALE API first, then Samsung/LG TV APIs, then fallback to language
        console.log('[Localization] 🌍 Starting hybrid geolocation (with Tizen SystemInfo LOCALE API)...');
        const geoResult = await detectCountryAsync();
        setGeoLocationResult(geoResult);
        setDetectedCountry(geoResult.countryName);
        setDetectedCountryCode(geoResult.countryCode);
        console.log('[Localization] Country detected via:', geoResult.detectionMethod);
        console.log('[Localization] Detected country:', geoResult.countryName, geoResult.countryCode);
        
        // Check localStorage for saved language
        const savedLang = localStorage.getItem('app_language');
        let langToUse = savedLang || detectDeviceLanguage();

        // Ensure we support this language
        const supportedLanguages = Object.keys(LANGUAGE_TO_COUNTRY);
        if (!supportedLanguages.includes(langToUse)) {
          console.warn(`[Localization] Unsupported language "${langToUse}", falling back to "en"`);
          langToUse = 'en';
        }

        console.log('[Localization] Using language:', langToUse);
        setLanguageState(langToUse);

        // Fetch translations from API
        console.log('[Localization] Fetching translations for:', langToUse);
        const translationsData = await megaRadioApi.getTranslations(langToUse);
        console.log('[Localization] API response received');
        
        // API returns translations directly OR in a "translations" property
        const translations = translationsData.translations || translationsData;
        
        if (translations && typeof translations === 'object') {
          setTranslations(translations);
          console.log('[Localization] Loaded', Object.keys(translations).length, 'translations');
        } else {
          console.warn('[Localization] No translations in response, using fallback');
          setTranslations({});
        }
      } catch (error) {
        console.error('[Localization] Failed to load translations:', error);
        // Set default English translations as fallback
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocalization();
  }, []);

  // Change language function
  const setLanguage = async (lang: string) => {
    try {
      setIsLoading(true);
      console.log('[Localization] Changing language to:', lang);
      
      // Update country based on new language
      const countryInfo = LANGUAGE_TO_COUNTRY[lang] || LANGUAGE_TO_COUNTRY['en'];
      setDetectedCountry(countryInfo.name);
      setDetectedCountryCode(countryInfo.code);

      // Fetch new translations
      const translationsData = await megaRadioApi.getTranslations(lang);
      
      // API returns translations directly OR in a "translations" property
      const translations = translationsData.translations || translationsData;
      setTranslations(translations);
      setLanguageState(lang);
      
      // Save to localStorage
      localStorage.setItem('app_language', lang);
      
      console.log('[Localization] Language changed successfully');
    } catch (error) {
      console.error('[Localization] Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Translation function with fallback
  const t = (key: string): string => {
    // Return translation if exists
    if (translations[key]) {
      return translations[key];
    }
    
    // Fallback to English-friendly version of the key
    // Convert snake_case or key names to Title Case
    const fallback = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/^Auth\s/, '')
      .replace(/^Homepage\s/, '')
      .replace(/^Profile\sNav\s/, '');
    
    return fallback;
  };

  return (
    <LocalizationContext.Provider 
      value={{ 
        language, 
        translations, 
        setLanguage, 
        t, 
        isLoading,
        detectedCountry,
        detectedCountryCode,
        geoLocationResult
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}

// Type declarations for Samsung/LG APIs
declare global {
  interface Window {
    webapis?: {
      tv?: {
        info?: {
          getLanguage?: () => string;
        };
      };
    };
    webOS?: {
      systemInfo?: {
        locale?: string;
        language?: string;
      };
    };
  }
}
