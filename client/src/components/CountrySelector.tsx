import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { megaRadioApi } from '@/services/megaRadioApi';
import { useLocalization } from '@/contexts/LocalizationContext';
import { assetPath } from '@/lib/assetPath';

interface Country {
  name: string;
  code: string;
  flag: string;
  stationcount?: number;
}

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: string;
  onSelectCountry: (country: Country) => void;
}

export const CountrySelector = ({ isOpen, onClose, selectedCountry, onSelectCountry }: CountrySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  // Fetch countries from API
  const { data: countriesData } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      console.log('[CountrySelector] Fetching countries...');
      const result = await megaRadioApi.getAllCountries();
      console.log('[CountrySelector] Countries received:', result.countries?.length || 0);
      return result;
    },
    enabled: isOpen,
  });

  // Map API countries to component format with flag URLs
  const countries: Country[] = useMemo(() => {
    return (countriesData?.countries || [])
      .filter(country => country.name && country.iso_3166_1)
      .map(country => {
        const flagUrl = country.iso_3166_1 === 'XX' || country.iso_3166_1.length !== 2
          ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23979797"/%3E%3C/svg%3E'
          : `https://flagcdn.com/w40/${country.iso_3166_1.toLowerCase()}.png`;
        
        return {
          name: country.name,
          code: country.iso_3166_1,
          flag: flagUrl,
          stationcount: country.stationcount,
        };
      })
      .sort((a, b) => (b.stationcount || 0) - (a.stationcount || 0));
  }, [countriesData]);

  const filteredCountries = useMemo(() => {
    return countries
      .filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (!searchQuery) {
          return (b.stationcount || 0) - (a.stationcount || 0);
        }
        
        const queryLower = searchQuery.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        
        const aExact = aNameLower === queryLower;
        const bExact = bNameLower === queryLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStarts = aNameLower.startsWith(queryLower);
        const bStarts = bNameLower.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return a.name.localeCompare(b.name);
      });
  }, [countries, searchQuery]);

  // Reset focus when filtered countries change
  useEffect(() => {
    if (filteredCountries.length > 0 && focusIndex >= filteredCountries.length) {
      setFocusIndex(0);
    }
  }, [filteredCountries.length, focusIndex]);

  // Scroll focused item into view
  useEffect(() => {
    if (scrollContainerRef.current && filteredCountries.length > 0) {
      const focusedElement = scrollContainerRef.current.children[focusIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusIndex, filteredCountries.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (window as any).tvKey;
      
      switch(e.keyCode) {
        case key?.UP || 38:
          e.preventDefault();
          setFocusIndex(prev => Math.max(0, prev - 1));
          break;
          
        case key?.DOWN || 40:
          e.preventDefault();
          setFocusIndex(prev => Math.min(filteredCountries.length - 1, prev + 1));
          break;
          
        case key?.ENTER || 13:
          e.preventDefault();
          if (filteredCountries[focusIndex]) {
            console.log('[CountrySelector] Selecting country:', filteredCountries[focusIndex].name);
            onSelectCountry(filteredCountries[focusIndex]);
            onClose();
          }
          break;
          
        case key?.RETURN || 461:
        case 10009:
          e.preventDefault();
          console.log('[CountrySelector] RETURN key - closing modal');
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCountries, focusIndex, onSelectCountry, onClose]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFocusIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-[1920px] h-[1080px] z-50">
      {/* Backdrop */}
      <div 
        className="absolute top-0 left-0 w-[1920px] h-[1080px] backdrop-blur-[7px] backdrop-filter"
        onClick={onClose}
        data-testid="country-selector-backdrop"
      />

      {/* Modal Container */}
      <div 
        className="absolute bg-[#1a1a1a] rounded-[20px] border-2 border-[rgba(255,255,255,0.1)]" 
        style={{ left: '457px', top: '251px', width: '1006px', height: '534px' }}
      >
        {/* Header */}
        <div className="absolute top-[30px] left-[40px] right-[40px]">
          <h2 className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white">
            {t('select_country') || 'Select Country'}
          </h2>
        </div>

        {/* Search Input */}
        <div className="absolute top-[90px] left-[40px] right-[40px]">
          <input
            type="text"
            placeholder={t('search_countries') || 'Search countries...'}
            value={searchQuery}
            onChange={(e) => {
              console.log('[CountrySelector] Search input changed:', e.target.value);
              setSearchQuery(e.target.value);
              setFocusIndex(0);
            }}
            className="w-full px-6 py-4 rounded-[15px] bg-[rgba(255,255,255,0.1)] border-2 border-[rgba(255,255,255,0.2)] text-white text-[20px] font-['Ubuntu',Helvetica] placeholder-white/50 focus:border-[#ff4199] focus:outline-none"
            data-testid="input-country-search"
          />
        </div>

        {/* Country List */}
        <div
          ref={scrollContainerRef}
          className="absolute top-[160px] left-[40px] right-[40px] bottom-[30px] overflow-y-auto pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#ff4199 rgba(255,255,255,0.1)'
          }}
        >
          {filteredCountries.length === 0 ? (
            <div className="text-center text-white/50 font-['Ubuntu',Helvetica] text-[20px] mt-10">
              {t('no_countries_found') || 'No countries found'}
            </div>
          ) : (
            filteredCountries.map((country, index) => (
              <div
                key={country.code}
                className={`flex items-center gap-4 px-6 py-4 rounded-[10px] cursor-pointer transition-all mb-2 ${
                  focusIndex === index
                    ? 'bg-[#ff4199] border-2 border-[#ff4199]'
                    : 'bg-[rgba(255,255,255,0.05)] border-2 border-transparent hover:bg-[rgba(255,255,255,0.1)]'
                }`}
                onClick={() => {
                  onSelectCountry(country);
                  onClose();
                }}
                data-testid={`country-option-${country.code}`}
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-[40px] h-[30px] object-cover rounded-[4px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="30"%3E%3Crect width="40" height="30" fill="%23979797"/%3E%3C/svg%3E';
                  }}
                />
                <div className="flex-1">
                  <p className="font-['Ubuntu',Helvetica] font-medium text-[20px] text-white">
                    {country.name}
                  </p>
                </div>
                {country.stationcount && country.stationcount > 0 && (
                  <div className="text-white/70 font-['Ubuntu',Helvetica] text-[16px]">
                    {country.stationcount} {t('stations') || 'stations'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Close button hint */}
        <div className="absolute bottom-[10px] right-[40px] text-white/50 font-['Ubuntu',Helvetica] text-[14px]">
          {t('press_back_to_close') || 'Press BACK to close'}
        </div>
      </div>
    </div>
  );
};
