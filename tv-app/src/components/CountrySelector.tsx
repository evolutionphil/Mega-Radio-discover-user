import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['SPACE', 'DELETE', 'CLEAR'],
];

export const CountrySelector = ({ isOpen, onClose, selectedCountry, onSelectCountry }: CountrySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusZone, setFocusZone] = useState<'keyboard' | 'list'>('keyboard');
  const [keyboardRow, setKeyboardRow] = useState(1);
  const [keyboardCol, setKeyboardCol] = useState(0);
  const [listFocusIndex, setListFocusIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      const result = await megaRadioApi.getAllCountries();
      return result;
    },
    staleTime: 30 * 24 * 60 * 60 * 1000,
    gcTime: 30 * 24 * 60 * 60 * 1000,
  });

  const countries: Country[] = useMemo(() => {
    const apiCountries = countriesData?.countries || [];
    return apiCountries
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
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countriesData]);

  const filteredCountries = useMemo(() => {
    const globalOption: Country = {
      name: 'Global',
      code: 'GLOBAL',
      flag: assetPath('images/globe-icon.png'),
    };

    const filtered = countries
      .filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (!searchQuery) {
          return a.name.localeCompare(b.name);
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

    filtered.unshift(globalOption);
    return filtered;
  }, [countries, searchQuery]);

  useEffect(() => {
    if (filteredCountries.length > 0 && listFocusIndex >= filteredCountries.length) {
      setListFocusIndex(0);
    }
  }, [filteredCountries.length, listFocusIndex]);

  useEffect(() => {
    if (scrollContainerRef.current && searchQuery) {
      scrollContainerRef.current.scrollTop = 0;
      setListFocusIndex(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (focusZone !== 'list' || !scrollContainerRef.current || filteredCountries.length === 0) return;
    const container = scrollContainerRef.current;
    const focusedElement = container.children[listFocusIndex] as HTMLElement | undefined;
    if (!focusedElement) return;

    const TOP_PADDING = 20;
    const BOTTOM_PADDING = 60;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight - BOTTOM_PADDING;

    let elementTop = 0;
    let el: HTMLElement | null = focusedElement;
    while (el && el !== container) {
      elementTop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }
    const elementBottom = elementTop + focusedElement.offsetHeight;

    if (elementTop < viewTop + TOP_PADDING) {
      container.scrollTo({ top: Math.max(0, elementTop - TOP_PADDING), behavior: 'smooth' });
    } else if (elementBottom > viewBottom) {
      container.scrollTo({ top: elementBottom - container.clientHeight + BOTTOM_PADDING, behavior: 'smooth' });
    }
  }, [listFocusIndex, filteredCountries.length, focusZone]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'SPACE') {
      setSearchQuery(prev => prev + ' ');
    } else if (key === 'DELETE') {
      setSearchQuery(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setSearchQuery('');
    } else {
      setSearchQuery(prev => prev + key.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (window as any).tvKey;
      e.stopPropagation();

      const keyCode = e.keyCode;
      const isUp = keyCode === 38 || keyCode === key?.UP;
      const isDown = keyCode === 40 || keyCode === key?.DOWN;
      const isLeft = keyCode === 37 || keyCode === key?.LEFT;
      const isRight = keyCode === 39 || keyCode === key?.RIGHT;
      const isEnter = keyCode === 13 || keyCode === key?.ENTER;
      const isBack = keyCode === 461 || keyCode === 10009 || keyCode === key?.RETURN;

      if (isBack) {
        e.preventDefault();
        onClose();
        return;
      }

      if (focusZone === 'keyboard') {
        const currentRow = KEYBOARD_ROWS[keyboardRow];

        if (isUp) {
          e.preventDefault();
          if (keyboardRow > 0) {
            const newRow = keyboardRow - 1;
            const newRowLen = KEYBOARD_ROWS[newRow].length;
            setKeyboardRow(newRow);
            setKeyboardCol(prev => Math.min(prev, newRowLen - 1));
          }
        } else if (isDown) {
          e.preventDefault();
          if (keyboardRow < KEYBOARD_ROWS.length - 1) {
            const newRow = keyboardRow + 1;
            const newRowLen = KEYBOARD_ROWS[newRow].length;
            setKeyboardRow(newRow);
            setKeyboardCol(prev => Math.min(prev, newRowLen - 1));
          }
        } else if (isLeft) {
          e.preventDefault();
          if (keyboardCol > 0) {
            setKeyboardCol(prev => prev - 1);
          }
        } else if (isRight) {
          e.preventDefault();
          if (keyboardCol < currentRow.length - 1) {
            setKeyboardCol(prev => prev + 1);
          } else {
            setFocusZone('list');
          }
        } else if (isEnter) {
          e.preventDefault();
          const pressedKey = currentRow[keyboardCol];
          handleKeyPress(pressedKey);
        }
      } else {
        if (isUp) {
          e.preventDefault();
          setListFocusIndex(prev => Math.max(0, prev - 1));
        } else if (isDown) {
          e.preventDefault();
          setListFocusIndex(prev => Math.min(filteredCountries.length - 1, prev + 1));
        } else if (isLeft) {
          e.preventDefault();
          setFocusZone('keyboard');
        } else if (isEnter) {
          e.preventDefault();
          if (filteredCountries[listFocusIndex]) {
            onSelectCountry(filteredCountries[listFocusIndex]);
            onClose();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusZone, keyboardRow, keyboardCol, listFocusIndex, filteredCountries, onSelectCountry, onClose, handleKeyPress]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFocusZone('keyboard');
      setKeyboardRow(1);
      setKeyboardCol(0);
      setListFocusIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getKeyLabel = (key: string) => {
    if (key === 'SPACE') return '␣';
    if (key === 'DELETE') return '⌫';
    if (key === 'CLEAR') return 'CLR';
    return key;
  };

  const getKeyWidth = (key: string) => {
    if (key === 'SPACE') return 'w-[160px]';
    if (key === 'DELETE') return 'w-[100px]';
    if (key === 'CLEAR') return 'w-[100px]';
    return 'w-[52px]';
  };

  return (
    <div
      className="absolute top-0 left-0 w-[1920px] h-[1080px] z-50"
      onKeyDown={(e) => { e.stopPropagation(); }}
      data-testid="country-selector-fullpage"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-[#0e0e0e] bg-opacity-95" />

      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] flex flex-col">
        <div className="flex items-center justify-between px-[60px] pt-[40px] pb-[10px]">
          <h1 className="font-['Ubuntu',Helvetica] font-bold text-[42px] text-white">
            {t('select_country') || 'Select Country'}
          </h1>
          <div className="font-['Ubuntu',Helvetica] text-[18px] text-white/40">
            {t('press_back_to_close') || 'Press BACK to close'}
          </div>
        </div>

        <div className="mx-[60px] mb-[20px] px-[24px] py-[14px] rounded-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center min-h-[56px]">
          <span className="font-['Ubuntu',Helvetica] text-[24px] text-white/60 mr-[12px]">🔍</span>
          <span className="font-['Ubuntu',Helvetica] text-[24px] text-white">
            {searchQuery || ''}
          </span>
          <span className="inline-block w-[2px] h-[28px] bg-[#ff4199] ml-[2px] animate-pulse" />
          {!searchQuery && (
            <span className="font-['Ubuntu',Helvetica] text-[24px] text-white/30 ml-[4px]">
              {t('search_countries') || 'Type to search...'}
            </span>
          )}
        </div>

        <div className="flex flex-1 px-[60px] gap-[40px] overflow-hidden">
          <div className="flex flex-col gap-[8px] pt-[10px] flex-shrink-0" style={{ width: '550px' }}>
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-[6px] justify-start">
                {row.map((keyChar, colIndex) => {
                  const isFocused = focusZone === 'keyboard' && keyboardRow === rowIndex && keyboardCol === colIndex;
                  return (
                    <button
                      key={keyChar}
                      className={`h-[52px] ${getKeyWidth(keyChar)} rounded-[10px] font-['Ubuntu',Helvetica] font-medium text-[20px] text-white flex items-center justify-center transition-all duration-150 select-none ${
                        isFocused
                          ? 'bg-[#ff4199] shadow-[0_0_20px_rgba(255,65,153,0.6)] scale-110'
                          : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]'
                      }`}
                      tabIndex={-1}
                      data-testid={`key-${keyChar}`}
                    >
                      {getKeyLabel(keyChar)}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="mt-[16px] font-['Ubuntu',Helvetica] text-[16px] text-white/30">
              {focusZone === 'keyboard'
                ? '← → ↑ ↓ Navigate • OK to type • → to list'
                : '← Back to keyboard'}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="font-['Ubuntu',Helvetica] text-[18px] text-white/50 mb-[10px]">
              {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
            </div>
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-[8px]"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#ff4199 rgba(255,255,255,0.1)',
              }}
            >
              {countriesLoading ? (
                <div className="text-center text-white font-['Ubuntu',Helvetica] text-[24px] mt-20">
                  {t('loading') || 'Loading countries...'}
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="text-center text-white/50 font-['Ubuntu',Helvetica] text-[20px] mt-10">
                  {t('no_countries_found') || 'No countries found'}
                </div>
              ) : (
                filteredCountries.map((country, index) => {
                  const isFocused = focusZone === 'list' && listFocusIndex === index;
                  return (
                    <div
                      key={`${country.code}-${index}`}
                      className={`flex items-center gap-[16px] px-[20px] py-[12px] rounded-[10px] mb-[4px] transition-all duration-150 ${
                        isFocused
                          ? 'bg-[#ff4199] shadow-[0_0_15px_rgba(255,65,153,0.4)]'
                          : 'bg-[rgba(255,255,255,0.03)]'
                      }`}
                      data-testid={`country-option-${country.code}`}
                    >
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-[40px] h-[30px] object-cover rounded-[4px] flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="30"%3E%3Crect width="40" height="30" fill="%23979797"/%3E%3C/svg%3E';
                        }}
                      />
                      <span className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-white truncate">
                        {country.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
