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
  
  // Initialize from localStorage or detected country
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountry');
    return saved || detectedCountry;
  });
  
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryCode');
    return saved || detectedCountryCode;
  });
  
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCountryFlag');
    // Fix: Clear old absolute paths that cause ERR_ACCESS_DENIED on Samsung TV
    if (saved && saved.startsWith('/images/')) {
      console.log('[CountryContext] Clearing old absolute path from localStorage:', saved);
      localStorage.removeItem('selectedCountryFlag');
      return assetPath('images/austria-1.png');
    }
    return saved || assetPath('images/austria-1.png');
  });

  // Update from localization when first detected
  useEffect(() => {
    if (detectedCountry && detectedCountryCode && !localStorage.getItem('selectedCountry')) {
      console.log('[CountryContext] Setting country from localization:', detectedCountry, detectedCountryCode);
      setSelectedCountry(detectedCountry);
      setSelectedCountryCode(detectedCountryCode);
    }
  }, [detectedCountry, detectedCountryCode]);

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
