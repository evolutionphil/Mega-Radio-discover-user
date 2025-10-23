import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi } from "@/services/megaRadioApi";
import { recentlyPlayedService } from "@/services/recentlyPlayedService";
import { CountrySelector } from "@/components/CountrySelector";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useCountry } from "@/contexts/CountryContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const DiscoverUser = (): JSX.Element => {
  const { t } = useLocalization();
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { isPlaying } = useGlobalPlayer();
  const [, setLocation] = useLocation();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  // Fetch recently played stations
  const recentStations = recentlyPlayedService.getStations().slice(0, 8);
  
  // Fetch genres from API filtered by country
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres/all', selectedCountryCode],
    queryFn: () => megaRadioApi.getAllGenres(selectedCountryCode),
  });

  // Fetch popular stations filtered by selected country
  const { data: popularRadiosData } = useQuery({
    queryKey: ['/api/stations/popular', { limit: 13, country: selectedCountryCode }],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 13, country: selectedCountryCode }),
  });

  // Fetch country stations
  const { data: countryStationsData } = useQuery({
    queryKey: ['/api/stations/country', selectedCountryCode],
    queryFn: () => megaRadioApi.getWorkingStations({ limit: 12, country: selectedCountryCode }),
  });

  // Create arrays from fetched data
  const recentlyPlayedStations = recentStations || [];
  const popularGenres = genresData?.genres?.slice(0, 8) || [];
  const popularRadios = popularRadiosData?.stations || [];
  const popularRadiosRow1 = popularRadios.slice(0, 6);
  const popularRadiosRow2 = popularRadios.slice(6, 12);
  const countryStations = countryStationsData?.stations || [];
  const countryStationsRow1 = countryStations.slice(0, 6);
  const countryStationsRow2 = countryStations.slice(6, 12);

  // Use ACTUAL array lengths instead of hard-coded constants
  const recentlyPlayedCount = recentlyPlayedStations.length;
  const popularGenresCount = popularGenres.length;
  const popularRadiosRow1Count = popularRadiosRow1.length;
  const popularRadiosRow2Count = popularRadiosRow2.length + 1; // +1 for "See More" button
  const countryStationsRow1Count = countryStationsRow1.length;
  const countryStationsRow2Count = countryStationsRow2.length;

  // Calculate section boundaries using ACTUAL counts
  const recentlyPlayedStart = 7;
  const recentlyPlayedEnd = recentlyPlayedStart + recentlyPlayedCount - 1;
  const popularGenresStart = recentlyPlayedEnd + 1;
  const popularGenresEnd = popularGenresStart + popularGenresCount - 1;
  const popularRadiosRow1Start = popularGenresEnd + 1;
  const popularRadiosRow1End = popularRadiosRow1Start + popularRadiosRow1Count - 1;
  const popularRadiosRow2Start = popularRadiosRow1End + 1;
  const popularRadiosRow2End = popularRadiosRow2Start + popularRadiosRow2Count - 1;
  const countryStationsRow1Start = popularRadiosRow2End + 1;
  const countryStationsRow1End = countryStationsRow1Start + countryStationsRow1Count - 1;
  const countryStationsRow2Start = countryStationsRow1End + 1;
  const countryStationsRow2End = countryStationsRow2Start + countryStationsRow2Count - 1;

  // Calculate totalItems using ACTUAL counts: 5 sidebar + 1 country + sections
  const totalItems = 5 + 1 + recentlyPlayedCount + popularGenresCount + 
                     popularRadiosRow1Count + popularRadiosRow2Count + 
                     countryStationsRow1Count + countryStationsRow2Count;

  // Define sidebar routes (NO PROFILE - 5 items)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  // Custom navigation logic for complex multi-section layout
  const customHandleNavigation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = focusIndex;
    let newIndex = current;

    // Sidebar section (0-4) - 5 items
    if (current >= 0 && current <= 4) {
      if (direction === 'DOWN') {
        newIndex = current < 4 ? current + 1 : current;
      } else if (direction === 'UP') {
        newIndex = current > 0 ? current - 1 : current;
      } else if (direction === 'RIGHT') {
        newIndex = 5; // Jump to country selector
      }
    }
    // Country selector (5)
    else if (current === 5) {
      if (direction === 'DOWN') {
        newIndex = popularGenresStart; // Jump to first genre
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to first sidebar item
      }
    }
    // Recently Played section
    else if (current >= recentlyPlayedStart && current <= recentlyPlayedEnd) {
      const col = current - recentlyPlayedStart;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < recentlyPlayedCount - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        newIndex = 6; // Jump to country selector
      } else if (direction === 'DOWN') {
        // Jump to genres below
        newIndex = popularGenresStart + Math.min(col, popularGenresCount - 1);
      }
    }
    // Popular Genres section
    else if (current >= popularGenresStart && current <= popularGenresEnd) {
      const col = current - popularGenresStart;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < popularGenresCount - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Jump to recently played above
        newIndex = recentlyPlayedStart + Math.min(col, recentlyPlayedCount - 1);
      } else if (direction === 'DOWN') {
        // Jump to popular radios row 1 below
        newIndex = popularRadiosRow1Start + Math.min(col, popularRadiosRow1Count - 1);
      }
    }
    // Popular Radios Row 1
    else if (current >= popularRadiosRow1Start && current <= popularRadiosRow1End) {
      const col = current - popularRadiosRow1Start;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < popularRadiosRow1Count - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Jump to genres above
        newIndex = popularGenresStart + Math.min(col, popularGenresCount - 1);
      } else if (direction === 'DOWN') {
        // Jump to popular radios row 2 below
        newIndex = popularRadiosRow2Start + Math.min(col, popularRadiosRow2Count - 1);
      }
    }
    // Popular Radios Row 2 (includes "See More")
    else if (current >= popularRadiosRow2Start && current <= popularRadiosRow2End) {
      const col = current - popularRadiosRow2Start;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < popularRadiosRow2Count - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Jump to popular radios row 1 above
        newIndex = popularRadiosRow1Start + Math.min(col, popularRadiosRow1Count - 1);
      } else if (direction === 'DOWN') {
        // Jump to country stations row 1 below
        newIndex = countryStationsRow1Start + Math.min(col, countryStationsRow1Count - 1);
      }
    }
    // Country Stations Row 1
    else if (current >= countryStationsRow1Start && current <= countryStationsRow1End) {
      const col = current - countryStationsRow1Start;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < countryStationsRow1Count - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Jump to popular radios row 2 above
        newIndex = popularRadiosRow2Start + Math.min(col, popularRadiosRow2Count - 1);
      } else if (direction === 'DOWN') {
        // Jump to country stations row 2 below
        newIndex = countryStationsRow2Start + Math.min(col, countryStationsRow2Count - 1);
      }
    }
    // Country Stations Row 2
    else if (current >= countryStationsRow2Start && current <= countryStationsRow2End) {
      const col = current - countryStationsRow2Start;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < countryStationsRow2Count - 1) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        // Jump to country stations row 1 above
        newIndex = countryStationsRow1Start + Math.min(col, countryStationsRow1Count - 1);
      }
      // DOWN: no action (bottom of page)
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 0,
    onSelect: (index) => {
      // Sidebar navigation (0-5)
      if (index >= 0 && index <= 5) {
        const route = sidebarRoutes[index];
        if (route !== '#') {
          setLocation(route);
        }
      }
      // Country selector (6)
      else if (index === 6) {
        setIsCountrySelectorOpen(true);
      }
      // Recently Played - Navigate to radio playing
      else if (index >= recentlyPlayedStart && index <= recentlyPlayedEnd) {
        setLocation('/radio-playing');
      }
      // Popular Genres - Navigate to genre list
      else if (index >= popularGenresStart && index <= popularGenresEnd) {
        setLocation('/genres');
      }
      // Popular Radios Row 1 - Navigate to radio playing
      else if (index >= popularRadiosRow1Start && index <= popularRadiosRow1End) {
        setLocation('/radio-playing');
      }
      // Popular Radios Row 2 (includes "See More") - Navigate to radio playing
      else if (index >= popularRadiosRow2Start && index <= popularRadiosRow2End) {
        setLocation('/radio-playing');
      }
      // Country Stations - Navigate to radio playing
      else if (index >= countryStationsRow1Start && index <= countryStationsRow2End) {
        setLocation('/radio-playing');
      }
    },
    onBack: () => {
      // No back action on discover page
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/discover', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP:
      case 38:
        customHandleNavigation('UP');
        break;
      case key?.DOWN:
      case 40:
        customHandleNavigation('DOWN');
        break;
      case key?.LEFT:
      case 37:
        customHandleNavigation('LEFT');
        break;
      case key?.RIGHT:
      case 39:
        customHandleNavigation('RIGHT');
        break;
      case key?.ENTER:
      case 13:
        handleSelect();
        break;
    }
  });

  return (
    <div className="relative w-[1920px] h-[2240px] bg-white overflow-y-auto" data-testid="page-discover">
      {/* Country Selector Modal */}
      {isCountrySelectorOpen && (
        <CountrySelector 
          isOpen={isCountrySelectorOpen}
          onClose={() => setIsCountrySelectorOpen(false)}
          selectedCountry={selectedCountry}
          onSelectCountry={(country) => {
            setIsCountrySelectorOpen(false);
          }}
        />
      )}

      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={assetPath("images/hand-crowd-disco-1.png")}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[0.88%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[48.611%] top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src={assetPath("images/path-8.svg")}
        />
      </div>

      {/* Top Right - Equalizer */}
      <div className={`absolute left-[1281px] overflow-clip rounded-[30px] size-[51px] top-[67px] transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
          <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
          <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
        </div>
      </div>

      {/* Country Selector */}
      <div 
        className={`absolute left-[1351px] top-[67px] flex w-[223px] h-[51px] rounded-[30px] bg-[#6b4f8a] flex-shrink-0 cursor-pointer hover:bg-[#7d5fa0] transition-colors ${getFocusClasses(isFocused(6))}`}
        style={{ padding: '11px 14.316px 11px 15px', justifyContent: 'center', alignItems: 'center' }}
        onClick={() => setIsCountrySelectorOpen(true)}
        data-testid="button-country-selector"
      >
        <div className="flex items-center gap-[10.66px]">
          <div className="size-[28.421px] rounded-full overflow-hidden flex-shrink-0">
            <img
              alt={selectedCountry}
              className="w-full h-full object-cover"
              src={selectedCountryFlag}
            />
          </div>
          <p className="font-['Ubuntu',Helvetica] font-bold leading-normal text-[24px] text-white whitespace-nowrap">
            {selectedCountry}
          </p>
          <div className="flex items-center justify-center ml-auto">
            <div className="rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={assetPath("images/arrow.svg")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute h-[66px] left-[1648px] top-[59px] w-[193px]">
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[54.5px] not-italic text-[24px] text-center text-white top-[19px] translate-x-[-50%]">
          Talha Çay
        </p>
        <div className="absolute left-[127px] rounded-[73.333px] size-[66px] top-0">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[73.333px] size-full"
            src={assetPath("images/frame-218.png")}
          />
        </div>
      </div>

      {/* Left Sidebar */}
      <Sidebar activePage="discover" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
        {t('recently_played')}
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[248px] translate-x-[-50%]">
        {t('see_more')}
      </p>

      {/* Recently Played Cards */}
      {/* Card 1 - BBC Radio */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(7))}`} data-testid="card-station-0">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/-hdd91mb-400x400-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            BBC Radio
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[99.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            United Kingdom
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 2 - WEEU */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(8))}`} data-testid="card-station-1">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/830-weeu-1-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            WEEU
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 3 - CNN Featured */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] border-[#d2d2d2] border-[5.75px] border-solid h-[276px] left-[691.46px] rounded-[11.5px] top-[310px] w-[209.091px] ${getFocusClasses(isFocused(9))}`} data-testid="card-station-2">
          <div className="h-[276px] overflow-clip relative rounded-[inherit] w-[209.091px]">
            <div className="absolute bg-white left-[35.55px] overflow-clip rounded-[6.9px] size-[138px] top-[35.55px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/cnn-international-logo-1.png")} />
            </div>
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[106.73px] not-italic text-[22px] text-center text-white top-[195.5px] translate-x-[-50%]">
              CNN
            </p>
            <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[104.55px] not-italic text-[18.818px] text-center text-white top-[228.12px] translate-x-[-50%]">
              Internatinal
            </p>
          </div>
          <div className="absolute inset-[-5.75px] pointer-events-none shadow-[inset_1.15px_1.15px_12.65px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 4 - NBC News */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(10))}`} data-testid="card-station-3">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/2616697-nbc-news-logo-stacked--1--1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            NBC News
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 5 - Power Türk */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(11))}`} data-testid="card-station-4">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/meta-image--1--1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Turkey
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 6 - Cheddar */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(12))}`} data-testid="card-station-5">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/cheddar-news-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Cheddar
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 7 - WNYC */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1616px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(13))}`} data-testid="card-station-6">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/c175--1--1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            WNYC
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            <span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 8 - Power Türk */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1846px] overflow-clip rounded-[11px] top-[316px] w-[200px] ${getFocusClasses(isFocused(14))}`} data-testid="card-station-7">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/0b75jzrr-400x400-1-8.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Popular Genres Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[639px]">
        {t('popular_genres')}
      </p>

      {/* Genre Pills */}
      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[236px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(15))}`} data-testid="button-genre-0">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[445px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(16))}`} data-testid="button-genre-1">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Rock</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[664px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(17))}`} data-testid="button-genre-2">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Hip Hop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[916px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(18))}`} data-testid="button-genre-3">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">News</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1142px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(19))}`} data-testid="button-genre-4">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Country</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1394px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(20))}`} data-testid="button-genre-5">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Hip Hop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1646px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(21))}`} data-testid="button-genre-6">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">News</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1872px] px-[72px] py-[28px] rounded-[20px] top-[713px] ${getFocusClasses(isFocused(22))}`} data-testid="button-genre-7">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Country</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Popular Radios Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[863px]">
        {t('popular_radios')}
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[869px] translate-x-[-50%]">
        {t('see_more')}
      </p>

      {/* Popular Radios Cards - Row 1 */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(23))}`} data-testid="card-popular-0">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/logo-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">VIBRA</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Italy</span>, Rome</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(24))}`} data-testid="card-popular-1">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/c175-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">VOA</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(25))}`} data-testid="card-popular-2">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/ebg3ye6-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Radio L</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Turkey</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(26))}`} data-testid="card-popular-3">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/android-default-logo-1-3.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Turkey, Istanbul</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(27))}`} data-testid="card-popular-4">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/meta-image--1--1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18.818px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[936px] w-[200px] ${getFocusClasses(isFocused(28))}`} data-testid="card-popular-5">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/washington-d-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Soul Radio</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, Washington D.C</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Popular Radios Cards - Row 2 */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(29))}`} data-testid="card-popular-6">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/germany-bavaria-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">ON 70'S</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[99px] not-italic text-[18px] text-center text-white top-[218px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Germany</span>, Bavaria</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(30))}`} data-testid="card-popular-7">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/830-weeu-1-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">WEEU</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">USA</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(31))}`} data-testid="card-popular-8">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/meta-image--1--1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Metro FM</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Turkey</span>, Istanbul</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(32))}`} data-testid="card-popular-9">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/alem-fm-1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(33))}`} data-testid="card-popular-10">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/apple-icon-120x120-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Zeno</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Italy</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1230px] w-[200px] ${getFocusClasses(isFocused(34))}`} data-testid="card-popular-11">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/80s-radio-1.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Radio 80'S</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* See More Card */}
      <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1616px] overflow-clip rounded-[11px] top-[1230px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(35))}`} data-testid="button-see-more">
        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100.5px] not-italic text-[22px] text-center text-white top-[120px] translate-x-[-50%]">{t('see_more')}</p>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
      </div>

      {/* More From Austria Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[1578px]">
        More From {selectedCountry}
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[1584px] translate-x-[-50%]">
        {t('see_more')}
      </p>

      {/* More From Austria Cards - Row 1 */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(36))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/powertu-rk-tv-logosu-1-12.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(37))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/0b75jzrr-400x400-1-8.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(38))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/alem-fm-1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(39))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/android-default-logo-1-3.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(40))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/meta-image--1--1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1652px] w-[200px] ${getFocusClasses(isFocused(41))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/alem-fm-1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* More From Austria Cards - Row 2 */}
      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(42))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/powertu-rk-tv-logosu-1-12.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(43))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/0b75jzrr-400x400-1-8.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(44))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/alem-fm-1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(45))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/android-default-logo-1-3.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(46))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/meta-image--1--1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1946px] w-[200px] ${getFocusClasses(isFocused(47))}`}>
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={assetPath("images/alem-fm-1-4.png")} />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>
    </div>
  );
};
