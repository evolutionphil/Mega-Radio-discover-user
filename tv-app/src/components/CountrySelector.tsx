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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();

  // Fetch countries from API (fetch upfront, cache for instant modal opening)
  // CACHE: 30 days
  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      const result = await megaRadioApi.getAllCountries();
      return result;
    },
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Map API countries to component format with flag URLs
  const countries: Country[] = useMemo(() => {
    const apiCountries = countriesData?.countries || [];
    
    const mapped = apiCountries
      .filter(country => country.name && country.iso_3166_1)
      .map(country => {
        const flagUrl = country.iso_3166_1 === 'XX' || country.iso_3166_1.length !== 2
          ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23979797"/%3E%3C/svg%3E'
          : `https://flagcdn.com/w40/${country.iso_3166_1.toLowerCase()}.png`;
        
        return {
          name: country.name,
          code: country.iso_3166_1,
          flag: flagUrl,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically since no station counts
    
    return mapped;
  }, [countriesData]);

  // Filter and sort countries based on search query
  const filteredCountries = useMemo(() => {
    // Create Global option with globe icon (no station count available from API)
    const globalOption: Country = {
      name: 'Global',
      code: 'GLOBAL',
      flag: assetPath('images/globe-icon.png'),
    };
    
    const filtered = countries
      .filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (!searchQuery) {
          // Alphabetical sort when no search query
          return a.name.localeCompare(b.name);
        }
        
        const queryLower = searchQuery.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        
        // Prioritize exact matches
        const aExact = aNameLower === queryLower;
        const bExact = bNameLower === queryLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then prioritize starts-with matches
        const aStarts = aNameLower.startsWith(queryLower);
        const bStarts = bNameLower.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Finally alphabetical
        return a.name.localeCompare(b.name);
      });
    
    // ALWAYS add Global option at the beginning, regardless of search query
    // This ensures users can always select Global even when filtering for other countries
    filtered.unshift(globalOption);
    
    return filtered;
  }, [countries, searchQuery]);

  // Reset focus when filtered countries change
  useEffect(() => {
    if (filteredCountries.length > 0 && focusIndex >= filteredCountries.length) {
      setFocusIndex(0);
    }
  }, [filteredCountries.length, focusIndex]);

  // Scroll to top when search query changes (user is typing/filtering)
  useEffect(() => {
    if (scrollContainerRef.current && searchQuery) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  // Auto-scroll focused item into view - ONLY if element is truly off-screen
  // Uses scrollTop/offsetTop based math for accurate visibility detection
  useEffect(() => {
    if (!scrollContainerRef.current || filteredCountries.length === 0) return;
    
    const container = scrollContainerRef.current;
    const focusedElement = container.children[focusIndex] as HTMLElement | undefined;
    if (!focusedElement) return;
    
    // Use scrollTop/offsetTop based calculation (NOT scrollIntoView)
    const TOP_PADDING = 20;  // Padding from top edge
    const BOTTOM_PADDING = 60;  // Leave space at bottom
    
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight - BOTTOM_PADDING;
    
    // Get element position relative to scroll container
    let elementTop = 0;
    let el: HTMLElement | null = focusedElement;
    while (el && el !== container) {
      elementTop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }
    const elementBottom = elementTop + focusedElement.offsetHeight;
    
    // Check if element is FULLY visible
    const isAboveView = elementTop < viewTop + TOP_PADDING;
    const isBelowView = elementBottom > viewBottom;
    
    // Only scroll if element is actually outside the visible viewport
    if (isAboveView) {
      container.scrollTo({ top: Math.max(0, elementTop - TOP_PADDING), behavior: 'smooth' });
    } else if (isBelowView) {
      const newScrollTop = elementBottom - container.clientHeight + BOTTOM_PADDING;
      container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    }
    // If element is FULLY visible, do NOTHING - no scroll!
  }, [focusIndex, filteredCountries.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (window as any).tvKey;
      
      // CRITICAL: Stop ALL key events from propagating to parent pages
      e.stopPropagation();
      
      // When search input is focused, only handle navigation keys (let input handle typing)
      if (isSearchFocused) {
        switch(e.keyCode) {
          case key?.DOWN:
          case 40:
            // Move focus from search to country list
            e.preventDefault();
            if (searchInputRef.current) {
              searchInputRef.current.blur(); // Remove focus from input
            }
            setIsSearchFocused(false);
            setFocusIndex(0);
            break;
            
          case key?.RETURN:
          case 461:
          case 10009:
            // TWO-STEP BEHAVIOR: First press closes keyboard, second press closes modal
            e.preventDefault();
            if (searchInputRef.current) {
              searchInputRef.current.blur(); // Close keyboard
            }
            setIsSearchFocused(false); // Move to country list mode
            break;
            
          // Let all other keys (letters, numbers, backspace) be handled by the input element
          default:
            break;
        }
      } else {
        // Country list navigation
        switch(e.keyCode) {
          case key?.UP:
          case 38:
            e.preventDefault();
            if (focusIndex === 0) {
              // Move back to search mode (virtual keyboard focus)
              setIsSearchFocused(true);
            } else {
              setFocusIndex(prev => Math.max(0, prev - 1));
            }
            break;
            
          case key?.DOWN:
          case 40:
            e.preventDefault();
            setFocusIndex(prev => Math.min(filteredCountries.length - 1, prev + 1));
            break;
            
          case key?.ENTER:
          case 13:
            e.preventDefault();
            if (filteredCountries[focusIndex]) {
              onSelectCountry(filteredCountries[focusIndex]);
              onClose();
            }
            break;
            
          case key?.RETURN:
          case 461:
          case 10009:
            e.preventDefault();
            onClose();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCountries, focusIndex, onSelectCountry, onClose, isSearchFocused]);

  // Reset when modal opens and focus on currently selected country
  // Only run when isOpen changes, not when filteredCountries changes (to allow navigation)
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setIsSearchFocused(true); // Auto-focus search input for easier typing
      
      // Find the currently selected country in the FILTERED country list and focus on it
      // (filteredCountries includes the injected Global option at index 0)
      const currentIndex = filteredCountries.findIndex(
        country => country.name === selectedCountry
      );
      const initialIndex = currentIndex >= 0 ? currentIndex : 0;
      setFocusIndex(initialIndex);
    } else {
      setIsSearchFocused(false);
    }
  }, [isOpen, selectedCountry, countries]);

  // Auto-focus search input when search mode is activated
  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!isSearchFocused && searchInputRef.current && document.activeElement === searchInputRef.current) {
      searchInputRef.current.blur();
    }
  }, [isSearchFocused]);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-0 left-0 w-[1920px] h-[1080px] z-50"
      onKeyDown={(e) => {
        // CRITICAL: Block all keyboard events from reaching parent pages
        e.stopPropagation();
      }}
    >
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

        {/* Search Input - Real input for TV keyboard */}
        <div className="absolute top-[90px] left-[40px] right-[40px]">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('search_countries') || 'Search countries...'}
            value={searchQuery}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchQuery(newValue);
              setFocusIndex(0);
              // Force scroll to top immediately
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
              }
            }}
            onKeyDown={(e) => {
              // Handle DOWN key to exit search and go to list
              const key = (window as any).tvKey;
              if (e.keyCode === 40 || e.keyCode === key?.DOWN) {
                e.preventDefault();
                setIsSearchFocused(false);
                setFocusIndex(0);
                if (searchInputRef.current) {
                  searchInputRef.current.blur();
                }
              }
            }}
            onFocus={() => {
              setIsSearchFocused(true);
            }}
            onBlur={() => {
              // Don't set isSearchFocused to false here - let arrow keys control it
            }}
            className={`w-full px-6 py-4 rounded-[15px] bg-[rgba(255,255,255,0.1)] border-2 text-white text-[20px] font-['Ubuntu',Helvetica] placeholder-white/50 focus:outline-none transition-colors ${
              isSearchFocused 
                ? 'border-[#ff4199]' 
                : 'border-[rgba(255,255,255,0.2)]'
            }`}
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
          {countriesLoading ? (
            <div className="text-center text-white font-['Ubuntu',Helvetica] text-[24px] mt-20">
              {t('loading') || 'Loading countries...'}
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center text-white/50 font-['Ubuntu',Helvetica] text-[20px] mt-10">
              {searchQuery ? (t('no_countries_found') || 'No countries found') : (t('loading') || 'Loading...')}
            </div>
          ) : (
            <>
              {filteredCountries.map((country, index) => (
                <div
                  key={`${country.code}-${searchQuery}-${index}`}
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
                </div>
              ))}
            </>
          )}
        </div>

        {/* Navigation hints */}
        <div className="absolute bottom-[10px] left-[40px] right-[40px] flex justify-between text-white/50 font-['Ubuntu',Helvetica] text-[14px]">
          <div>
            {isSearchFocused 
              ? (t('type_to_search') || 'Type to search • Press ↓ for list') 
              : (t('press_up_to_search') || 'Press ↑ to search • Type to filter')}
          </div>
          <div>
            {t('press_back_to_close') || 'Press BACK to close'}
          </div>
        </div>
      </div>
    </div>
  );
};
