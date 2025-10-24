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
      // Default to globe SVG for Global
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="18" fill="%234A90E2" stroke="%23FFFFFF" stroke-width="2"/%3E%3Cpath d="M20 4 Q30 12 30 20 Q30 28 20 36 Q10 28 10 20 Q10 12 20 4 M12 20 H28 M20 8 Q24 14 24 20 Q24 26 20 32 M20 8 Q16 14 16 20 Q16 26 20 32" fill="none" stroke="%23FFFFFF" stroke-width="1.5"/%3E%3C/svg%3E';
    }
    if (saved) {
      return saved;
    }
    // Default to globe SVG for Global
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="18" fill="%234A90E2" stroke="%23FFFFFF" stroke-width="2"/%3E%3Cpath d="M20 4 Q30 12 30 20 Q30 28 20 36 Q10 28 10 20 Q10 12 20 4 M12 20 H28 M20 8 Q24 14 24 20 Q24 26 20 32 M20 8 Q16 14 16 20 Q16 26 20 32" fill="none" stroke="%23FFFFFF" stroke-width="1.5"/%3E%3C/svg%3E';
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
