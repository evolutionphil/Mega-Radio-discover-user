import { Link } from "wouter";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { AppLayout } from "@/components/AppLayout";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Station } from "@/services/megaRadioApi";
import { useRef } from "react";

export const Favorites = (): JSX.Element => {
  useTVNavigation();
  const { favorites } = useFavorites();
  const { t } = useLocalization();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fallback image
  const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#01d7fb"/><text x="100" y="120" font-size="80" fill="white" text-anchor="middle" font-family="Arial">R</text></svg>')}`;

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
            src="/images/hand-crowd-disco-1.png"
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
          <div className="absolute left-[236px] top-[400px] w-[1580px] h-[400px] flex flex-col items-center justify-center">
            <div className="w-[120px] h-[120px] mb-8 opacity-30">
              <svg viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M25.5 44.625C24.7396 44.625 23.9792 44.3958 23.3604 43.9375C18.9375 40.6042 14.9479 37.6771 11.9792 34.7917C7.44792 30.3479 4.25 26.2646 4.25 20.625C4.25 12.6667 10.5 6.375 18.0625 6.375C21.6042 6.375 24.9167 8.14583 27.125 11.1354C29.3333 8.14583 32.6458 6.375 36.1875 6.375C43.75 6.375 50 12.6667 50 20.625C50 26.2646 46.8021 30.3479 42.2708 34.8125C39.3021 37.6979 35.3125 40.625 30.8896 43.9583C30.2708 44.3958 29.5104 44.625 28.75 44.625H25.5Z" fill="white"/>
              </svg>
            </div>
            <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white mb-4">
              {t('no_favorites_yet') || 'No favorite stations yet'}
            </p>
            <p className="font-['Ubuntu',Helvetica] font-light text-[24px] text-[#c8c8c8]">
              {t('tap_heart_to_add') || 'Press the heart icon on any station to add it to your favorites'}
            </p>
          </div>
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
                    className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] overflow-clip rounded-[11px] w-[200px] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                    style={{ left: `${leftPosition}px`, top: `${topPosition}px` }}
                    data-testid={`station-card-${index}`}
                    data-tv-focusable="true"
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
