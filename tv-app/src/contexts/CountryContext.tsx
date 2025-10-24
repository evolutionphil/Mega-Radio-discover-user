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
  
  const globeIcon = assetPath('images/globe-icon.png');
  
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
      return globeIcon;
    }
    if (saved) {
      return saved;
    }
    // Use detected country flag if available
    if (detectedCountryCode && detectedCountryCode !== 'XX' && detectedCountryCode.length === 2) {
      console.log('[CountryContext] No saved flag - using detected country flag:', detectedCountryCode);
      return `https://flagcdn.com/w40/${detectedCountryCode.toLowerCase()}.png`;
    }
    // Only use globe icon if no country detected
    return globeIcon;
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
