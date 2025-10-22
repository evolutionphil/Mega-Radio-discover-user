import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCountry } from "@/contexts/CountryContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { CountrySelector } from "@/components/CountrySelector";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const GenreDetail = (): JSX.Element => {
  const { selectedCountry, selectedCountryCode, selectedCountryFlag } = useCountry();
  const { playStation, isPlaying } = useGlobalPlayer();
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  const stations = [
    { _id: "1", name: "Power Türk", location: "Turkey", image: "/images/powertu-rk-tv-logosu-1-12.png", url: "https://example.com/stream1" },
    { _id: "2", name: "VIBRA", location: "Italy, Rome", image: "/images/logo-1.png", url: "https://example.com/stream2" },
    { _id: "3", name: "Metro FM", location: "Turkey, Istanbul", image: "/images/meta-image--1--1-4.png", url: "https://example.com/stream3" },
    { _id: "4", name: "Soul Radio", location: "USA, Washington D.C", image: "/images/washington-d-1.png", url: "https://example.com/stream4" },
    { _id: "5", name: "Power Türk", location: "Türkçe Pop", image: "/images/0b75jzrr-400x400-1-8.png", url: "https://example.com/stream5" },
    { _id: "6", name: "ON 70'S", location: "Germany, Bavaria", image: "/images/germany-bavaria-1.png", url: "https://example.com/stream6" },
    { _id: "7", name: "Radio L", location: "Turkey", image: "/images/ebg3ye6-1.png", url: "https://example.com/stream7" },
    { _id: "8", name: "WEEU", location: "USA", image: "/images/830-weeu-1-1.png", url: "https://example.com/stream8" },
  ];

  // Calculate totalItems: 5 (sidebar) + 1 (country selector) + 1 (back button) + 8 (stations)
  const totalItems = 5 + 1 + 1 + stations.length;

  // Define sidebar routes (NO PROFILE - 5 items)
  const sidebarRoutes = ['/discover-no-user', '/genres', '/search', '/favorites', '/settings'];

  // Custom navigation logic for multi-section layout
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
        newIndex = 6; // Jump to back button
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to first sidebar item
      }
    }
    // Back button (7)
    else if (current === 7) {
      if (direction === 'UP') {
        newIndex = 6; // Jump to country selector
      } else if (direction === 'DOWN') {
        newIndex = 8; // Jump to first station
      } else if (direction === 'LEFT') {
        newIndex = 0; // Jump to sidebar
      }
    }
    // Stations grid (8-15) - 4 cols × 2 rows
    else if (current >= 8 && current <= 15) {
      const relIndex = current - 8;
      const row = Math.floor(relIndex / 4);
      const col = relIndex % 4;

      if (direction === 'LEFT') {
        if (col > 0) {
          newIndex = current - 1;
        } else {
          newIndex = 0; // Jump to sidebar
        }
      } else if (direction === 'RIGHT') {
        if (col < 3 && current < 15) {
          newIndex = current + 1;
        }
      } else if (direction === 'UP') {
        if (row > 0) {
          newIndex = current - 4;
        } else {
          newIndex = 7; // Jump to back button
        }
      } else if (direction === 'DOWN') {
        if (row < 1 && current + 4 <= 15) {
          newIndex = current + 4;
        }
      }
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    setFocusIndex(newIndex);
  };

  // Focus management with custom navigation
  const { focusIndex, setFocusIndex, handleSelect, isFocused } = useFocusManager({
    totalItems,
    cols: 1,
    initialIndex: 7, // Start on back button
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
      // Back button (7)
      else if (index === 7) {
        setLocation('/genres');
      }
      // Stations (8-15)
      else if (index >= 8 && index <= 15) {
        const stationIndex = index - 8;
        const station = stations[stationIndex];
        if (station) {
          playStation(station as any);
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => {
      setLocation('/genres');
    }
  });

  // Register page-specific key handler with custom navigation
  usePageKeyHandler('/genre/:id', (e) => {
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
    <div className="relative w-[1920px] h-[1080px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]" />

      {/* Logo */}
      <div className="absolute left-[30px] top-[64px] w-[164.421px] h-[57px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src={assetPath("images/path-8.svg")}
        />
      </div>

      {/* Equalizer Icon */}
      <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
          <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
          <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
        </div>
      </div>

      {/* Country Selector */}
      <div 
        className={`absolute left-[1453px] top-[67px] flex w-[223px] h-[51px] rounded-[30px] bg-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors flex-shrink-0 ${getFocusClasses(isFocused(6))}`}
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

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={() => {
          setIsCountrySelectorOpen(false);
        }}
      />

      {/* Global Sidebar */}
      <Sidebar 
        activePage="genres"
        isFocused={isFocused}
        getFocusClasses={getFocusClasses}
      />

      {/* Main Content */}
      <div className="absolute left-[190px] top-[144px] right-[30px] bottom-[30px]">
        {/* Back Button & Page Title */}
        <div className="flex items-center gap-6 mb-12">
          <button 
            className={`w-[48px] h-[48px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors ${getFocusClasses(isFocused(7))}`}
            data-testid="button-back"
            onClick={() => setLocation('/genres')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white" data-testid="title-genre">
            Pop Stations
          </h1>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-4 gap-8">
          {stations.map((station, index) => {
            const focusIdx = 8 + index;
            return (
              <div
                key={index}
                className={`bg-[rgba(255,255,255,0.05)] rounded-[20px] p-6 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer ${getFocusClasses(isFocused(focusIdx))}`}
                data-testid={`card-station-${index}`}
                onClick={() => {
                  playStation(station as any);
                  setLocation(`/radio-playing?station=${station._id}`);
                }}
              >
                <div className="w-full aspect-square bg-white/10 rounded-[16px] mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={station.name}
                    src={station.image}
                  />
                </div>
                <h3 className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white mb-1" data-testid={`text-station-name-${index}`}>
                  {station.name}
                </h3>
                <p className="font-['Ubuntu',Helvetica] font-medium text-[16px] text-[#9b9b9b]" data-testid={`text-station-location-${index}`}>
                  {station.location}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
