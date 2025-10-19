import { Link } from "wouter";
import { useState, useEffect, useRef, RefObject } from "react";
import { CountrySelector } from "@/components/CountrySelector";
import { useCountry } from "@/contexts/CountryContext";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";

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
    <div className="fixed inset-0 w-[1920px] h-[1080px] bg-black overflow-hidden">
      {/* Logo - Top Left - EXACT MATCH TO DISCOVERNO USER */}
      <div className="fixed h-[57px] left-[30px] top-[64px] w-[164.421px] z-50 pointer-events-auto">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src="/images/path-8.svg"
          />
        </div>
      </div>

      {/* Header Controls - Hidden for Search page, Auto-hides on scroll */}
      {!hideHeaderControls && (
        <div 
          className="fixed top-0 left-0 w-[1920px] h-[242px] z-50 pointer-events-none transition-transform duration-300 ease-in-out"
          style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          {/* Equalizer Icon - EXACT POSITION FROM DISCOVERNO USER */}
          <div className={`absolute left-[1383px] overflow-clip rounded-[30px] size-[51px] top-[67px] pointer-events-auto transition-colors ${isPlaying ? 'bg-[#ff4199]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
            <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
              <div className={`absolute bg-white left-0 rounded-[10px] top-0 w-[6.25px] ${isPlaying ? 'animate-equalizer-1' : 'h-[25px]'}`} style={{ height: isPlaying ? undefined : '25px' }} />
              <div className={`absolute bg-white left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px] ${isPlaying ? 'animate-equalizer-2' : 'h-[17.5px]'}`} style={{ height: isPlaying ? undefined : '17.5px' }} />
              <div className={`absolute bg-white left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px] ${isPlaying ? 'animate-equalizer-3' : 'h-[21.25px]'}`} style={{ height: isPlaying ? undefined : '21.25px' }} />
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
                  src={selectedCountryFlag || '/images/austria-1.png'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/austria-1.png';
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
                      src="/images/arrow.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Left Sidebar */}
      <div className="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto">
        {/* Discover */}
        <Link href="/discover-no-user">
          <div 
            className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0 ${currentPage === 'discover' ? 'bg-[rgba(255,255,255,0.2)]' : ''}`} 
            data-testid="button-discover" 
            data-tv-focusable="true"
          >
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Discover
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="images/radio-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres */}
        <Link href="/genres">
          <div 
            className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px] ${currentPage === 'genres' ? 'bg-[rgba(255,255,255,0.2)]' : ''}`} 
            data-testid="button-genres" 
            data-tv-focusable="true"
          >
            <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Genres
              </p>
              <div className="absolute left-[13px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="images/music-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <Link href="/search">
          <div 
            className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px] ${currentPage === 'search' ? 'bg-[rgba(255,255,255,0.2)]' : ''}`} 
            data-testid="button-search" 
            data-tv-focusable="true"
          >
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Search
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="images/search-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link href="/favorites">
          <div 
            className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px] ${currentPage === 'favorites' ? 'bg-[rgba(255,255,255,0.2)]' : ''}`} 
            data-testid="button-favorites" 
            data-tv-focusable="true"
          >
            <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Favorites
              </p>
              <div className="absolute left-[22px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="images/heart-icon.svg" />
              </div>
            </div>
          </div>
        </Link>

        {/* Settings */}
        <Link href="/settings">
          <div 
            className={`absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px] ${currentPage === 'settings' ? 'bg-[rgba(255,255,255,0.2)]' : ''}`} 
            data-testid="button-settings" 
            data-tv-focusable="true"
          >
            <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Settings
              </p>
              <div className="absolute left-[18px] size-[32px] top-0">
                <img alt="" className="block max-w-none size-full" src="images/settings-icon.svg" />
              </div>
            </div>
          </div>
        </Link>
      </div>

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
