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
  mode?: 'modal' | 'page';
  onNavigateToSidebar?: () => void;
  keyboardDisabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
  ['V', 'W', 'X', 'Y', 'Z', '-', "'"],
  ['SPACE', 'DELETE', 'CLEAR'],
];

export const CountrySelector = ({ isOpen, onClose, selectedCountry, onSelectCountry, mode = 'modal', onNavigateToSidebar, keyboardDisabled = false }: CountrySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusZone, setFocusZone] = useState<'keyboard' | 'list'>('keyboard');
  const [keyboardRow, setKeyboardRow] = useState(0);
  const [keyboardCol, setKeyboardCol] = useState(0);
  const [listFocusIndex, setListFocusIndex] = useState(0);
  const lastKeyboardPos = useRef({ row: 0, col: 0 });
  const lastListPos = useRef(0);
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
        if (!searchQuery) return a.name.localeCompare(b.name);
        const queryLower = searchQuery.toLowerCase();
        const aStarts = a.name.toLowerCase().startsWith(queryLower);
        const bStarts = b.name.toLowerCase().startsWith(queryLower);
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
      if (keyboardDisabled) return;
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
          } else if (mode === 'page' && onNavigateToSidebar) {
            onNavigateToSidebar();
          }
        } else if (isRight) {
          e.preventDefault();
          if (keyboardCol < currentRow.length - 1) {
            setKeyboardCol(prev => prev + 1);
          } else {
            lastKeyboardPos.current = { row: keyboardRow, col: keyboardCol };
            setFocusZone('list');
            setListFocusIndex(lastListPos.current);
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
          lastListPos.current = listFocusIndex;
          setFocusZone('keyboard');
          setKeyboardRow(lastKeyboardPos.current.row);
          setKeyboardCol(lastKeyboardPos.current.col);
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
  }, [isOpen, focusZone, keyboardRow, keyboardCol, listFocusIndex, filteredCountries, onSelectCountry, onClose, handleKeyPress, keyboardDisabled, mode, onNavigateToSidebar]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFocusZone('keyboard');
      setKeyboardRow(0);
      setKeyboardCol(0);
      setListFocusIndex(0);
      lastKeyboardPos.current = { row: 0, col: 0 };
      lastListPos.current = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getKeyLabel = (key: string) => {
    if (key === 'SPACE') return 'SPACE';
    if (key === 'DELETE') return '⌫';
    if (key === 'CLEAR') return 'CLEAR';
    return key;
  };

  const highlightMatch = (name: string) => {
    if (!searchQuery) return <span>{name}</span>;
    const idx = name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return <span>{name}</span>;
    return (
      <>
        <span>{name.substring(0, idx)}</span>
        <span className="text-[#ff4199]">{name.substring(idx, idx + searchQuery.length)}</span>
        <span>{name.substring(idx + searchQuery.length)}</span>
      </>
    );
  };

  return (
    <div
      className={`absolute top-0 left-0 w-[1920px] h-[1080px] ${mode === 'page' ? 'z-30' : 'z-50'}`}
      onKeyDown={(e) => { e.stopPropagation(); }}
      data-testid="country-selector-fullpage"
    >
      {mode === 'modal' && (
        <div className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]" />
      )}

      <div className="absolute top-0 left-0 w-[1920px] h-[1080px]">
        <div className="absolute left-[30px] top-[40px] w-[164.421px] h-[57px] z-10">
          <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
            <span className="font-bold">mega</span>radio
          </p>
          <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
            <img alt="" className="block max-w-none w-full h-full" src={assetPath("images/path-8.svg")} />
          </div>
        </div>

        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[246px] top-[42px] text-[32px] text-white z-10">
          {t('select_country') || 'Select Country'}
        </p>

        <div
          className="absolute left-[246px] top-[110px] w-[660px] h-[76px] rounded-[14px] z-10 flex items-center px-[30px] gap-[14px]"
          style={{
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(13.621px)',
            border: focusZone === 'keyboard' ? '2.594px solid #ff4199' : '2.594px solid #717171',
            boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)',
          }}
        >
          <div className="w-[31px] h-[31px] flex-shrink-0 opacity-60">
            <img alt="" className="block max-w-none w-full h-full" src={assetPath("images/search-icon.svg")} />
          </div>
          <div className="flex items-center flex-1 min-w-0">
            <span className="font-['Ubuntu',Helvetica] font-medium text-[25.94px] text-white truncate">
              {searchQuery}
            </span>
            <span className="inline-block w-[3px] h-[30px] bg-[#ff4199] ml-[2px] animate-pulse flex-shrink-0" />
            {!searchQuery && (
              <span className="font-['Ubuntu',Helvetica] font-medium text-[25.94px] text-[rgba(255,255,255,0.35)] ml-[4px]">
                {t('search_countries') || 'Search countries...'}
              </span>
            )}
          </div>
        </div>

        <div className="absolute left-[246px] top-[220px] z-10" style={{ width: '660px' }}>
          {KEYBOARD_ROWS.map((row, rowIndex) => {
            const isActionRow = rowIndex === KEYBOARD_ROWS.length - 1;
            return (
              <div key={rowIndex} className={`flex ${isActionRow ? 'gap-[10px] mt-[14px]' : 'gap-[6px] mb-[6px]'}`}>
                {row.map((keyChar, colIndex) => {
                  const isKeyFocused = focusZone === 'keyboard' && keyboardRow === rowIndex && keyboardCol === colIndex;
                  const isAction = keyChar === 'SPACE' || keyChar === 'DELETE' || keyChar === 'CLEAR';

                  let widthClass = 'w-[88px]';
                  if (keyChar === 'SPACE') widthClass = 'flex-1';
                  else if (keyChar === 'DELETE' || keyChar === 'CLEAR') widthClass = 'w-[160px]';

                  return (
                    <button
                      key={keyChar}
                      className={`h-[68px] ${widthClass} rounded-[12px] font-['Ubuntu',Helvetica] font-medium text-white flex items-center justify-center transition-all duration-150 select-none ${
                        isKeyFocused
                          ? 'bg-[#ff4199] scale-105 text-[24px]'
                          : isAction
                            ? 'bg-[rgba(255,255,255,0.08)] text-[18px] text-white/70'
                            : 'bg-[rgba(255,255,255,0.14)] text-[22px]'
                      }`}
                      style={{
                        boxShadow: isKeyFocused
                          ? '0 0 25px rgba(255,65,153,0.5), inset 1px 1px 8px rgba(255,255,255,0.15)'
                          : 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)',
                      }}
                      tabIndex={-1}
                      data-testid={`key-${keyChar}`}
                    >
                      {getKeyLabel(keyChar)}
                    </button>
                  );
                })}
              </div>
            );
          })}

          <div className="flex items-center justify-between mt-[20px] px-[4px]">
            <div className="flex items-center gap-[20px]">
              <div className="flex items-center gap-[6px]">
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[rgba(255,255,255,0.14)] flex items-center justify-center" style={{ boxShadow: 'inset 1px 1px 6px rgba(255,255,255,0.12)' }}>
                  <span className="text-white/60 text-[14px]">OK</span>
                </div>
                <span className="font-['Ubuntu',Helvetica] text-[16px] text-white/30">{t('type') || 'Type'}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[rgba(255,255,255,0.14)] flex items-center justify-center" style={{ boxShadow: 'inset 1px 1px 6px rgba(255,255,255,0.12)' }}>
                  <span className="text-white/60 text-[14px]">→</span>
                </div>
                <span className="font-['Ubuntu',Helvetica] text-[16px] text-white/30">{t('results') || 'Results'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-[60px] top-[42px] z-10">
          <span className="font-['Ubuntu',Helvetica] text-[18px] text-white/30">
            {filteredCountries.length - 1} {t('countries') || 'countries'}
          </span>
        </div>

        <div
          className="absolute right-0 top-[110px] z-10 flex flex-col"
          style={{ left: '960px', bottom: '30px' }}
        >
          <div className="absolute top-0 left-0 right-[60px] h-[76px] rounded-[14px] bg-[rgba(255,255,255,0.08)] flex items-center px-[24px]" style={{ boxShadow: 'inset 1.1px 1.1px 12.1px 0px rgba(255,255,255,0.12)' }}>
            <span className="font-['Ubuntu',Helvetica] font-bold text-[22px] text-white/70">
              {searchQuery
                ? `"${searchQuery}" — ${filteredCountries.length} ${t('results') || 'results'}`
                : t('all_countries') || 'All Countries'
              }
            </span>
          </div>

          <div
            ref={scrollContainerRef}
            className="absolute left-0 right-[60px] overflow-y-auto"
            style={{
              top: '96px',
              bottom: '0px',
              scrollbarWidth: 'none',
            }}
          >
            {countriesLoading ? (
              <div className="text-center text-white/50 font-['Ubuntu',Helvetica] text-[22px] mt-[80px]">
                {t('loading') || 'Loading...'}
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="text-center text-white/50 font-['Ubuntu',Helvetica] text-[20px] mt-[40px]">
                {t('no_countries_found') || 'No countries found'}
              </div>
            ) : (
              filteredCountries.map((country, index) => {
                const isItemFocused = focusZone === 'list' && listFocusIndex === index;
                const isSelected = country.name === selectedCountry;
                return (
                  <div
                    key={`${country.code}-${index}`}
                    className={`flex items-center gap-[16px] px-[24px] rounded-[12px] mb-[4px] transition-all duration-150 cursor-pointer ${
                      isItemFocused
                        ? 'bg-[#ff4199] py-[14px]'
                        : isSelected
                          ? 'bg-[rgba(255,65,153,0.15)] py-[12px]'
                          : 'bg-[rgba(255,255,255,0.05)] py-[12px] hover:bg-[rgba(255,255,255,0.08)]'
                    }`}
                    style={{
                      boxShadow: isItemFocused
                        ? '0 0 20px rgba(255,65,153,0.35), inset 1px 1px 8px rgba(255,255,255,0.1)'
                        : isSelected
                          ? 'inset 1px 1px 8px rgba(255,65,153,0.15)'
                          : 'none',
                    }}
                    onClick={() => {
                      onSelectCountry(country);
                      onClose();
                    }}
                    data-testid={`country-option-${country.code}`}
                  >
                    <img
                      src={country.flag}
                      alt={country.name}
                      className={`object-cover rounded-[6px] flex-shrink-0 ${isItemFocused ? 'w-[44px] h-[33px]' : 'w-[38px] h-[28px]'}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="30"%3E%3Crect width="40" height="30" fill="%23979797"/%3E%3C/svg%3E';
                      }}
                    />
                    <span className={`font-['Ubuntu',Helvetica] font-medium text-white truncate ${isItemFocused ? 'text-[24px]' : 'text-[20px]'}`}>
                      {highlightMatch(country.name)}
                    </span>
                    {isSelected && !isItemFocused && (
                      <span className="ml-auto font-['Ubuntu',Helvetica] text-[16px] text-[#ff4199] flex-shrink-0">✓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
