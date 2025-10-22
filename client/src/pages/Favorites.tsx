import { Link, useLocation } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Station } from "@/services/megaRadioApi";
import { useRef } from "react";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

export const Favorites = (): JSX.Element => {
  const { favorites } = useFavorites();
  const { t } = useLocalization();
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Focus management for favorites grid (7 columns)
  const totalItems = favorites.length || 1; // 1 for empty state CTA button
  const { focusIndex, handleNavigation, handleSelect, handleBack, isFocused } = useFocusManager({
    totalItems,
    cols: favorites.length > 0 ? 7 : 1,
    onSelect: (index) => {
      if (favorites.length === 0) {
        // Empty state: go to discover
        setLocation('/discover-no-user');
      } else {
        // Navigate to radio playing page
        const station = favorites[index];
        if (station) {
          setLocation(`/radio-playing?station=${station._id}`);
        }
      }
    },
    onBack: () => setLocation('/discover-no-user')
  });

  // Register page-specific key handler
  usePageKeyHandler('/favorites', (e) => {
    const key = (window as any).tvKey;
    
    switch(e.keyCode) {
      case key?.UP || 38:
        handleNavigation('UP');
        break;
      case key?.DOWN || 40:
        handleNavigation('DOWN');
        break;
      case key?.LEFT || 37:
        handleNavigation('LEFT');
        break;
      case key?.RIGHT || 39:
        handleNavigation('RIGHT');
        break;
      case key?.ENTER || 13:
        handleSelect();
        break;
      case key?.RETURN || 461 || 10009:
        handleBack();
        break;
    }
  });

  // Fallback image - music note on pink gradient background
  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    if (station.favicon) {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  // Helper function to get station tags as array
  const getStationTags = (station: Station): string[] => {
    if (!station.tags) return [];
    if (Array.isArray(station.tags)) return station.tags;
    return station.tags.split(',').map(tag => tag.trim());
  };

  // Helper function to get first category/tag
  const getStationCategory = (station: Station): string => {
    const tags = getStationTags(station);
    if (tags.length > 0) return tags[0];
    return station.country || 'Radio';
  };

  return (
    <AppLayout currentPage="favorites" scrollContainerRef={scrollContainerRef}>
      <div ref={scrollContainerRef} className="relative w-[1920px] h-[1080px] overflow-y-auto" data-testid="page-favorites">
        {/* Background Image */}
        <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={assetPath("images/hand-crowd-disco-1.png")}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bg-gradient-to-b from-[18.333%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[15.185%] top-0 w-[1920px]" />

        {/* Page Title */}
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
          {t('your_favorites') || 'Your Favorites'}
        </p>

        {/* Empty State or Station Grid */}
        {favorites.length === 0 ? (
          <>
            {/* Heart Icon - Centered */}
            <div className="absolute left-[986px] size-[124px] top-[365px]">
              <svg viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="62" cy="62" r="62" fill="rgba(255, 255, 255, 0.1)"/>
                <path d="M62 85.25C61.2396 85.25 60.4792 85.0208 59.8604 84.5625C55.4375 81.2292 51.4479 78.3021 48.4792 75.4167C43.9479 70.9729 40.75 66.8896 40.75 61.25C40.75 53.2917 47 47 54.5625 47C58.1042 47 61.4167 48.7708 63.625 51.7604C65.8333 48.7708 69.1458 47 72.6875 47C80.25 47 86.5 53.2917 86.5 61.25C86.5 66.8896 83.3021 70.9729 78.7708 75.4375C75.8021 78.3229 71.8125 81.25 67.3896 84.5833C66.7708 85.0208 66.0104 85.25 65.25 85.25H62Z" fill="#FF4199"/>
              </svg>
            </div>

            {/* Text Message - Centered */}
            <div className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1047.5px] not-italic text-[32px] text-center text-white top-[504px] translate-x-[-50%]">
              <p className="mb-2">{t('no_favorites_yet') || t('you_dont_have_any_favorites_yet') || "You don't have any"}</p>
              <p>{t('favorites_yet') || 'favorites yet'}</p>
            </div>

            {/* Call to Action */}
            <Link href="/discover-no-user">
              <div className={`absolute left-[calc(50%+87.5px)] top-[calc(50%+98px)] translate-x-[-50%] cursor-pointer hover:opacity-80 transition-opacity ${getFocusClasses(isFocused(0))}`} data-testid="button-discover-cta" onClick={() => setLocation('/discover-no-user')}>
                <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[#ff4199] text-[24px] text-center">
                  {t('discover_stations_near_you') || 'Discover stations near to you!'}
                </p>
                <div className="absolute left-[calc(100%+10px)] top-[50%] translate-y-[-50%] size-[38px]">
                  <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M14.25 28.5L23.75 19L14.25 9.5" stroke="#FF4199" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          </>
        ) : (
          <>
            {/* Radio Station Cards - Dynamic Grid (7 columns like GenreList) */}
            {favorites.map((station, index) => {
              const row = Math.floor(index / 7);
              const col = index % 7;
              const leftPosition = 236 + (col * 230); // 236px start, 230px between columns
              const topPosition = 316 + (row * 294); // 316px start, 294px between rows
              
              return (
                <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
                  <div 
                    className={`absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${getFocusClasses(isFocused(index))}`}
                    style={{ left: `${leftPosition}px`, top: `${topPosition}px` }}
                    data-testid={`station-card-${index}`}
                    onClick={() => setLocation(`/radio-playing?station=${station._id}`)}
                  >
                    <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
                      <img
                        alt={station.name}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={getStationImage(station)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                      {station.name}
                    </p>
                    <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%] truncate px-2 max-w-[180px]">
                      {getStationCategory(station)}
                    </p>
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </AppLayout>
  );
};
