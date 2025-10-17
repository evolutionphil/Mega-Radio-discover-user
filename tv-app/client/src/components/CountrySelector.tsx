import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { megaRadioApi } from '@/services/megaRadioApi';

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

  // Fetch countries from API
  const { data: countriesData, isLoading, error } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      console.log('[CountrySelector] Fetching countries...');
      const result = await megaRadioApi.getAllCountries();
      console.log('[CountrySelector] Raw API result:', result);
      console.log('[CountrySelector] Countries array:', result.countries);
      if (result.countries && result.countries.length > 0) {
        console.log('[CountrySelector] First country:', result.countries[0]);
      }
      console.log('[CountrySelector] Countries received:', result.countries?.length || 0);
      return result;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      console.log('[CountrySelector] Modal opened, query should trigger');
      console.log('[CountrySelector] isLoading:', isLoading, 'error:', error);
    }
  }, [isOpen, isLoading, error]);

  // Initialize TV navigation when modal opens
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        if ((window as any).tvSpatialNav) {
          console.log('[CountrySelector] Initializing TV navigation');
          (window as any).tvSpatialNav.init();
          
          // Focus the search input first
          const searchInput = document.querySelector('[data-testid="input-country-search"]') as HTMLElement;
          if (searchInput) {
            (window as any).tvSpatialNav.focus(searchInput);
          }
        }
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Map API countries to component format with flag URLs
  const countries: Country[] = (countriesData?.countries || [])
    .filter(country => country.name && country.iso_3166_1) // Filter out invalid countries
    .map(country => ({
      name: country.name,
      code: country.iso_3166_1,
      flag: `https://flagcdn.com/w40/${country.iso_3166_1.toLowerCase()}.png`,
      stationcount: country.stationcount,
    }))
    .sort((a, b) => (b.stationcount || 0) - (a.stationcount || 0)); // Sort by station count

  const filteredCountries = countries.filter(country =>
    country.name && country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('[CountrySelector] Total countries after filter:', countries.length);
  console.log('[CountrySelector] Filtered countries for search "' + searchQuery + '":', filteredCountries.length);
  if (filteredCountries.length > 0) {
    console.log('[CountrySelector] First 5 countries:', filteredCountries.slice(0, 5).map(c => c.name));
  }

  const handleCountryClick = (country: Country) => {
    onSelectCountry(country);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur (transparent) */}
      <div 
        className="absolute inset-0 backdrop-blur-[7px] backdrop-filter"
        onClick={onClose}
        data-testid="country-selector-backdrop"
      />

      {/* Modal Container */}
      <div className="relative">
        {/* Back Button */}
        <div 
          className="absolute left-0 top-[-43px] h-[24px] w-[71px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClose}
          data-testid="button-back-country-selector"
          data-tv-focusable="true"
        >
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
            Back
          </p>
          <div className="absolute left-0 size-[24px] top-0">
            <img
              alt="back"
              className="block max-w-none size-full"
              src="/images/vuesax-outline-arrow-left.svg"
            />
          </div>
        </div>

        {/* Modal */}
        <div className="relative bg-black h-[534px] w-[1006px] overflow-clip rounded-[14px]">
          {/* Search Bar */}
          <div className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[75px] left-[19px] rounded-[12px] top-[21px] w-[968px]">
            <div className="h-[75px] overflow-clip relative rounded-[inherit] w-[968px]">
              <div className="absolute h-[31.134px] left-[45px] top-1/2 -translate-y-1/2 flex items-center gap-[15px]">
                <div className="size-[31.134px]">
                  <img
                    alt="search"
                    className="block max-w-none size-full"
                    src="/images/vuesax-bold-search-normal.svg"
                  />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Country"
                  className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[25.945px] text-white bg-transparent border-none outline-none placeholder:text-white/60 w-[800px]"
                  data-testid="input-country-search"
                  data-tv-focusable="true"
                />
              </div>
            </div>
          </div>

          {/* Countries List - Scrollable */}
          <div className="absolute left-[20px] top-[119px] w-[967px] h-[395px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Ubuntu',Helvetica] font-medium text-white text-[20px]">Loading countries...</p>
              </div>
            ) : filteredCountries.map((country, index) => {
              const isSelected = country.name === selectedCountry;
              return (
                <div
                  key={country.code}
                  className={`bg-[#2b2b2b] ${isSelected ? 'border-[#d2d2d2] border-[5px]' : ''} border-solid h-[70px] rounded-[10px] w-[967px] cursor-pointer hover:bg-[#3b3b3b] transition-colors`}
                  style={{ marginTop: index === 0 ? 0 : '15px' }}
                  onClick={() => handleCountryClick(country)}
                  data-testid={`country-option-${country.code}`}
                  data-tv-focusable="true"
                >
                  <div className="h-[70px] overflow-clip relative rounded-[inherit] w-[967px]">
                    <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[70px] not-italic text-[15px] text-white top-[26px]">
                      {country.name}
                    </p>
                    <div className="absolute bg-[#979797] left-[15px] overflow-clip rounded-[20px] size-[40px] top-[15px]">
                      <img
                        alt={country.name}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={country.flag}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
