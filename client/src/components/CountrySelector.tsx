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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const { t } = useLocalization();

  // Debug: Log when search query changes
  useEffect(() => {
    console.log('[CountrySelector] Search query updated to:', searchQuery);
  }, [searchQuery]);

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

  // Reset scroll position when search query changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      console.log('[CountrySelector] Scroll reset to top for search:', searchQuery);
    }
  }, [searchQuery]);

  // Map API countries to component format with flag URLs
  const countries: Country[] = useMemo(() => {
    return (countriesData?.countries || [])
      .filter(country => country.name && country.iso_3166_1) // Filter out invalid countries
      .map(country => {
        // Use a fallback for countries without proper ISO codes (XX)
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
      .sort((a, b) => (b.stationcount || 0) - (a.stationcount || 0)); // Sort by station count
  }, [countriesData]);

  const filteredCountries = useMemo(() => {
    console.log('[CountrySelector] useMemo: Recalculating filtered countries for query:', searchQuery);
    return countries
      .filter(country => {
        if (!country.name) return false;
        const matches = country.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matches;
      })
      .sort((a, b) => {
        if (!searchQuery) {
          // No search: sort by station count
          return (b.stationcount || 0) - (a.stationcount || 0);
        }
        
        const queryLower = searchQuery.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        
        // Priority 1: Exact match
        const aExact = aNameLower === queryLower;
        const bExact = bNameLower === queryLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Priority 2: Starts with search query
        const aStarts = aNameLower.startsWith(queryLower);
        const bStarts = bNameLower.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Priority 3: Alphabetical order
        return a.name.localeCompare(b.name);
      });
  }, [countries, searchQuery]);

  // Initialize TV navigation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset navigation flag when modal opens
      isNavigatingRef.current = false;
      console.log('[CountrySelector] Modal opened - reset isNavigating flag to FALSE');
      
      // Add RETURN key handler for Samsung TV
      const handleKeyDown = (e: KeyboardEvent) => {
        const key = (window as any).tvKey;
        if (e.keyCode === (key?.RETURN || 461) || e.keyCode === 10009) {
          console.log('[CountrySelector] RETURN key - closing modal');
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      const timeout = setTimeout(() => {
        if ((window as any).tvSpatialNav) {
          console.log('[CountrySelector] Initializing TV navigation');
          (window as any).tvSpatialNav.init();
          
          // Focus the search input wrapper
          const searchWrapper = document.querySelector('[data-testid="search-input-wrapper"]') as HTMLElement;
          if (searchWrapper) {
            console.log('[CountrySelector] Focusing search wrapper');
            (window as any).tvSpatialNav.focus(searchWrapper);
            
            // When wrapper gets focus via TV navigation, trigger input focus for keyboard
            searchWrapper.addEventListener('click', () => {
              const inputElement = document.querySelector('[data-testid="input-country-search"]') as HTMLInputElement;
              if (inputElement && !isNavigatingRef.current) {
                console.log('[CountrySelector] TV navigation activated search - opening keyboard');
                inputElement.focus();
              }
            }, { once: true });
          }
        }
      }, 200);
      
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Update TV navigation when filtered countries change (after search)
  // Use updateFocusableElements() to avoid stealing focus from search input
  useEffect(() => {
    if (isOpen && filteredCountries.length > 0) {
      const timeout = setTimeout(() => {
        if ((window as any).tvSpatialNav) {
          console.log('[CountrySelector] Updating focusable elements for', filteredCountries.length, 'countries');
          // Just update the focusable elements list without stealing focus
          (window as any).tvSpatialNav.updateFocusableElements();
          
          // Log for debugging
          const countryElements = document.querySelectorAll('[data-testid^="country-option-"]');
          console.log('[CountrySelector] Found', countryElements.length, 'country elements in DOM');
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, filteredCountries.length]);

  console.log('[CountrySelector] ===== RENDER INFO =====');
  console.log('[CountrySelector] Total countries loaded:', countries.length);
  console.log('[CountrySelector] Search query:', `"${searchQuery}"`);
  console.log('[CountrySelector] Filtered count:', filteredCountries.length);
  if (filteredCountries.length > 0) {
    console.log('[CountrySelector] First 10 filtered:', filteredCountries.slice(0, 10).map(c => `${c.name} (${c.code})`));
  }
  console.log('[CountrySelector] ========================');

  // Early return AFTER all hooks
  if (!isOpen) {
    console.log('[CountrySelector] Not rendering - isOpen is false');
    return null;
  }

  console.log('[CountrySelector] Rendering modal - should be centered at left: 457px, top: 251px');
  console.log('[CountrySelector] Modal dimensions: width: 1006px, height: 534px');
  console.log('[CountrySelector] Screen dimensions: 1920x1080');

  const handleCountryClick = (country: Country) => {
    console.log('='.repeat(60));
    console.log('[CountrySelector] ⚡ COUNTRY CLICK HANDLER TRIGGERED');
    console.log('[CountrySelector] Country:', country.name, country.code);
    console.log('[CountrySelector] isNavigating flag BEFORE:', isNavigatingRef.current);
    
    // Set navigation flag FIRST to prevent ANY input focus attempts
    isNavigatingRef.current = true;
    console.log('[CountrySelector] ✅ isNavigating flag set to TRUE - input focus is now BLOCKED');
    
    // Blur the search input to prevent Samsung keyboard from appearing
    const searchInput = document.querySelector('[data-testid="input-country-search"]') as HTMLInputElement;
    if (searchInput) {
      console.log('[CountrySelector] Blurring input element...');
      searchInput.blur();
    }
    
    // Also blur any currently focused element
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      console.log('[CountrySelector] Blurring active element:', document.activeElement.tagName, document.activeElement.getAttribute('data-testid'));
      document.activeElement.blur();
    }
    
    console.log('[CountrySelector] ✅ All elements blurred');
    console.log('[CountrySelector] New active element:', document.activeElement?.tagName);
    console.log('[CountrySelector] 🚀 Closing modal and updating country');
    console.log('='.repeat(60));
    
    // Execute immediately - flag will prevent input refocus during operations
    onSelectCountry(country);
    onClose();
  };

  return (
    <div 
      className="fixed top-0 left-0 w-[1920px] h-[1080px] z-50"
      ref={(el) => {
        if (el) {
          console.log('[CountrySelector] Outer container mounted:', {
            offsetWidth: el.offsetWidth,
            offsetHeight: el.offsetHeight,
            offsetLeft: el.offsetLeft,
            offsetTop: el.offsetTop
          });
        }
      }}
    >
      {/* Backdrop with blur (transparent) */}
      <div 
        className="absolute top-0 left-0 w-[1920px] h-[1080px] backdrop-blur-[7px] backdrop-filter"
        onClick={onClose}
        data-testid="country-selector-backdrop"
      />

      {/* Modal Container - Centered with fixed pixel positioning for Samsung TV */}
      <div 
        className="absolute" 
        style={{ left: '457px', top: '251px' }}
        ref={(el) => {
          if (el) {
            console.log('[CountrySelector] Modal container positioned at:', {
              left: '457px',
              top: '251px',
              actualLeft: el.offsetLeft,
              actualTop: el.offsetTop,
              centered: {
                horizontalCenter: (1920 - 1006) / 2,
                verticalCenter: (1080 - 534) / 2
              }
            });
          }
        }}
      >
        {/* Back Button */}
        <div 
          className="absolute left-0 top-[-43px] h-[24px] w-[71px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClose}
          data-testid="button-back-country-selector"
          data-tv-focusable="true"
        >
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
            {t('back') || 'Back'}
          </p>
          <div className="absolute left-0 size-[24px] top-0">
            <img
              alt="back"
              className="block max-w-none size-full"
              src={assetPath("images/arrow.svg")}
            />
          </div>
        </div>

        {/* Modal */}
        <div className="relative bg-black h-[534px] w-[1006px] overflow-clip rounded-[14px]">
          {/* Search Bar */}
          <div 
            className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[75px] left-[19px] rounded-[12px] top-[21px] w-[968px] cursor-pointer"
            data-testid="search-input-wrapper"
            data-tv-focusable="true"
            onClick={() => {
              const inputElement = document.querySelector('[data-testid="input-country-search"]') as HTMLInputElement;
              if (inputElement && !isNavigatingRef.current) {
                console.log('[CountrySelector] Wrapper clicked - focusing input');
                inputElement.focus();
              }
            }}
          >
            <div className="h-[75px] overflow-clip relative rounded-[inherit] w-[968px] pointer-events-none">
              <div className="absolute h-[31.134px] left-[45px] top-1/2 -translate-y-1/2 flex items-center gap-[15px]">
                <div className="size-[31.134px]">
                  <img
                    alt="search"
                    className="block max-w-none size-full"
                    src={assetPath("images/search-icon.svg")}
                  />
                </div>
                <input
                  ref={(el) => {
                    if (el) {
                      // Store reference for wrapper to access
                      (el as any).parentWrapper = el.closest('[data-testid="search-input-wrapper"]');
                    }
                  }}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    console.log('[CountrySelector] Input onChange triggered, newValue:', newValue);
                    setSearchQuery(newValue);
                  }}
                  onFocus={(e) => {
                    console.log('[CountrySelector] 🎹 Input FOCUSED - keyboard should appear');
                    if (isNavigatingRef.current) {
                      console.log('[CountrySelector] ❌ BLOCKING focus - user clicked country');
                      e.target.blur();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle DOWN arrow to exit input and focus first country
                    if (e.key === 'ArrowDown' || e.keyCode === 40) {
                      e.preventDefault();
                      if ((window as any).tvSpatialNav) {
                        console.log('[CountrySelector] DOWN pressed - re-initializing and focusing first country');
                        // Re-initialize TV navigation to ensure all countries are registered
                        (window as any).tvSpatialNav.init();
                        const firstCountry = document.querySelector('[data-testid^="country-option-"]') as HTMLElement;
                        if (firstCountry) {
                          (window as any).tvSpatialNav.focus(firstCountry);
                        }
                      }
                    }
                    // Handle UP arrow
                    if (e.key === 'ArrowUp' || e.keyCode === 38) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t('country') || 'Country'}
                  className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[25.945px] text-white bg-transparent border-none outline-none placeholder:text-white/60 w-[800px] pointer-events-auto"
                  data-testid="input-country-search"
                />
              </div>
            </div>
          </div>

          {/* Countries List - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="absolute left-[20px] top-[119px] w-[967px] h-[395px] overflow-y-auto"
            key={`countries-list-${searchQuery}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Ubuntu',Helvetica] font-medium text-white text-[20px]">{t('regions_loading_countries') || t('loading') || 'Loading countries...'}</p>
              </div>
            ) : (
              <>
                {/* Debug info */}
                {filteredCountries.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-['Ubuntu',Helvetica] font-medium text-white text-[20px]">
                      {t('regions_search_no_results') || t('no_results_title') || 'No countries found for'} "{searchQuery}"
                    </p>
                  </div>
                )}
                {filteredCountries.map((country, index) => {
                  const isSelected = country.name === selectedCountry;
                  console.log(`[CountrySelector] Rendering country ${index}:`, country.name, country.code);
                  return (
                    <div
                      key={country.code}
                      className={`bg-[#2b2b2b] ${isSelected ? 'border-[#d2d2d2] border-[5px]' : ''} border-solid h-[70px] rounded-[10px] w-[967px] cursor-pointer hover:bg-[#3b3b3b] transition-colors`}
                      style={{ marginTop: index === 0 ? 0 : '15px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCountryClick(country);
                      }}
                      onMouseDown={(e) => {
                        // Prevent input from getting focus when clicking country
                        e.preventDefault();
                      }}
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
                            onError={(e) => {
                              // Fallback to gray box if flag fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
