import { Link } from "wouter";
import { useState, useEffect, useRef, RefObject } from "react";
import { CountrySelector } from "@/components/CountrySelector";
import { useCountry } from "@/contexts/CountryContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { getFocusClasses } from "@/hooks/useFocusManager";
import { assetPath } from "@/lib/assetPath";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  hideHeaderControls?: boolean; // For Search page - hides country selector and login
  scrollContainerRef?: RefObject<HTMLDivElement>; // For auto-hide header feature
}

export const AppLayout = ({ children, currentPage, hideHeaderControls = false, scrollContainerRef }: AppLayoutProps) => {
  const { selectedCountry, selectedCountryFlag, setCountry } = useCountry();
  const { isPlaying } = useGlobalPlayer();
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-hide header on scroll down
  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } 
      else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] bg-black overflow-hidden">
      {/* Logo - Top Left - EXACT MATCH TO DISCOVERNO USER */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px] z-50 pointer-events-auto">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src={assetPath("images/path-8.svg")}
          />
        </div>
      </div>

      {/* Header Controls - Hidden for Search page, Auto-hides on scroll */}
      {!hideHeaderControls && (
        <div 
          className="absolute top-0 left-0 w-[1920px] h-[242px] z-50 pointer-events-none transition-transform duration-300 ease-in-out"
          style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          {/* Equalizer Icon - Matching Global Player Animation */}
          <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] pointer-events-auto transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
            <div className="absolute h-[35.526px] left-[8.625px] overflow-clip top-[7.737px] w-[33.75px]">
              <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[8.882px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[35.526px]'}`} style={{ height: isPlaying ? undefined : '35.526px' }} />
              <div className={`absolute bg-white left-[12.43px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[24.868px] top-[10.66px]'}`} style={{ height: isPlaying ? undefined : '24.868px', top: isPlaying ? undefined : '10.66px' }} />
              <div className={`absolute bg-white left-[24.87px] rounded-[10px] w-[8.882px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[30.197px] top-[5.33px]'}`} style={{ height: isPlaying ? undefined : '30.197px', top: isPlaying ? undefined : '5.33px' }} />
            </div>
          </div>

          {/* Country Selector Button - EXACT FIGMA SPECS */}
          <div 
            className="absolute left-[1453px] top-[67px] flex w-[223px] h-[51px] rounded-[30px] bg-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors pointer-events-auto flex-shrink-0"
            style={{ padding: '11px 14.316px 11px 15px', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => setIsCountrySelectorOpen(true)}
            data-testid="button-country-selector"
            data-tv-focusable="true"
          >
            <div className="flex items-center gap-[10.66px]">
              <div className="size-[28.421px] rounded-full overflow-hidden flex-shrink-0">
                <img
                  alt={selectedCountry}
                  className="w-full h-full object-cover"
                  src={selectedCountryFlag || assetPath('images/austria-1.png')}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = assetPath('images/austria-1.png');
                  }}
                />
              </div>
              <p className="font-['Ubuntu',Helvetica] font-bold leading-normal text-[24px] text-white whitespace-nowrap">
                {selectedCountry || 'Austria'}
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

        </div>
      )}

      {/* Global Sidebar */}
      <Sidebar 
        activePage={(currentPage || 'discover') as 'discover' | 'genres' | 'search' | 'favorites' | 'settings'}
        isFocused={() => false}
        getFocusClasses={getFocusClasses}
      />

      {/* Page Content */}
      {children}

      {/* Country Selector Modal */}
      <CountrySelector
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          console.log('[AppLayout] Country selected globally:', country.name, 'Code:', country.code);
          setCountry(country.name, country.code, country.flag);
        }}
      />
    </div>
  );
};
