import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalization } from './LocalizationContext';
import { assetPath } from '@/lib/assetPath';
import { trackCountryChange } from '@/lib/analytics';

interface CountryContextType {
  selectedCountry: string;
  selectedCountryCode: string;
  selectedCountryFlag: string;
  setCountry: (country: string, code: string, flag: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const { detectedCountry, detectedCountryCode } = useLocalization();
  
  const globeSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Cdefs%3E%3ClinearGradient id="globeGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300bfff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230080ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="18" fill="url(%23globeGrad)" stroke="%23ffffff" stroke-width="2"/%3E%3Cellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cellipse cx="20" cy="20" rx="18" ry="8" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cpath d="M 20 2 Q 28 10 28 20 Q 28 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3Cpath d="M 20 2 Q 12 10 12 20 Q 12 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3C/svg%3E';
  
  // Initialize from localStorage, then detected country, then default to "Global"
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      return saved;
    }
    // Use detected country if available
    if (detectedCountry && detectedCountry !== 'Unknown') {
      console.log('[CountryContext] No saved country - using detected country:', detectedCountry);
      return detectedCountry;
    }
    // Only use Global if no country detected
    console.log('[CountryContext] No saved country and no detection - defaulting to Global');
    return 'Global';
  });
  
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryCode');
    if (saved) {
      return saved;
    }
    // Use detected country code if available
    if (detectedCountryCode && detectedCountryCode !== 'XX') {
      console.log('[CountryContext] No saved country code - using detected code:', detectedCountryCode);
      return detectedCountryCode;
    }
    // Only use GLOBAL if no country code detected
    console.log('[CountryContext] No saved country code and no detection - defaulting to GLOBAL');
    return 'GLOBAL';
  });
  
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryFlag');
    // Fix: Clear old absolute paths that cause ERR_ACCESS_DENIED on Samsung TV
    if (saved && saved.startsWith('/images/')) {
      console.log('[CountryContext] Clearing old absolute path from localStorage:', saved);
      localStorage.removeItem('selectedCountryFlag');
      return globeSvg;
    }
    if (saved) {
      return saved;
    }
    // Use detected country flag if available
    if (detectedCountryCode && detectedCountryCode !== 'XX' && detectedCountryCode.length === 2) {
      console.log('[CountryContext] No saved flag - using detected country flag:', detectedCountryCode);
      return `https://flagcdn.com/w40/${detectedCountryCode.toLowerCase()}.png`;
    }
    // Only use globe SVG if no country detected
    return globeSvg;
  });

  // Auto-detect country from localization on first visit
  // Global is only the fallback when no country/language is detected

  const setCountry = (country: string, code: string, flag: string) => {
    console.log('[CountryContext] Country changed globally:', country, code);
    setSelectedCountry(country);
    setSelectedCountryCode(code);
    setSelectedCountryFlag(flag);
    
    // Track country change in Google Analytics
    trackCountryChange(country);
    
    // Persist to localStorage
    localStorage.setItem('selectedCountry', country);
    localStorage.setItem('selectedCountryCode', code);
    localStorage.setItem('selectedCountryFlag', flag);
  };

  return (
    <CountryContext.Provider value={{ 
      selectedCountry, 
      selectedCountryCode, 
      selectedCountryFlag, 
      setCountry 
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
