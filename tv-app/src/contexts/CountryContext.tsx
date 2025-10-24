import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalization } from './LocalizationContext';
import { assetPath } from '@/lib/assetPath';

interface CountryContextType {
  selectedCountry: string;
  selectedCountryCode: string;
  selectedCountryFlag: string;
  setCountry: (country: string, code: string, flag: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const { detectedCountry, detectedCountryCode } = useLocalization();
  
  // Initialize from localStorage or default to "Global" (worldwide stations)
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      return saved;
    }
    // Default to Global instead of detected country
    console.log('[CountryContext] No saved country - defaulting to Global');
    return 'Global';
  });
  
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryCode');
    if (saved) {
      return saved;
    }
    // Default to GLOBAL instead of detected country code
    console.log('[CountryContext] No saved country code - defaulting to GLOBAL');
    return 'GLOBAL';
  });
  
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryFlag');
    // Fix: Clear old absolute paths that cause ERR_ACCESS_DENIED on Samsung TV
    if (saved && saved.startsWith('/images/')) {
      console.log('[CountryContext] Clearing old absolute path from localStorage:', saved);
      localStorage.removeItem('selectedCountryFlag');
      // Default to improved globe SVG for Global
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Cdefs%3E%3ClinearGradient id="globeGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300bfff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230080ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="18" fill="url(%23globeGrad)" stroke="%23ffffff" stroke-width="2"/%3E%3Cellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cellipse cx="20" cy="20" rx="18" ry="8" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cpath d="M 20 2 Q 28 10 28 20 Q 28 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3Cpath d="M 20 2 Q 12 10 12 20 Q 12 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3C/svg%3E';
    }
    if (saved) {
      return saved;
    }
    // Default to improved globe SVG for Global
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Cdefs%3E%3ClinearGradient id="globeGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300bfff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230080ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="18" fill="url(%23globeGrad)" stroke="%23ffffff" stroke-width="2"/%3E%3Cellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cellipse cx="20" cy="20" rx="18" ry="8" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cpath d="M 20 2 Q 28 10 28 20 Q 28 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3Cpath d="M 20 2 Q 12 10 12 20 Q 12 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3C/svg%3E';
  });

  // No longer auto-detect country from localization - Global is the default
  // Users can manually select their country from the country selector if desired

  const setCountry = (country: string, code: string, flag: string) => {
    console.log('[CountryContext] Country changed globally:', country, code);
    setSelectedCountry(country);
    setSelectedCountryCode(code);
    setSelectedCountryFlag(flag);
    
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
