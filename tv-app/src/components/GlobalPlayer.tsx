import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Station } from "@/services/megaRadioApi";
import { useLocation } from "wouter";
import { assetPath } from "@/lib/assetPath";


export const GlobalPlayer = (): JSX.Element | null => {
  const { currentStation, isPlaying, togglePlayPause, nowPlayingMetadata } = useGlobalPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLocalization();
  const [location] = useLocation();

  // Don't render if no station is playing
  if (!currentStation) {
    return null;
  }

  // Hide global player on RadioPlaying page (has its own player)
  const isRadioPlayingPage = location === '/radio-playing' || 
                             location.startsWith('/radio-playing') || 
                             location.includes('radio-playing');
  
  if (isRadioPlayingPage) {
    return null;
  }

  // Fallback image - music note on pink gradient background
  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  const getStationImage = (station: Station) => {
    // Check for null, undefined, empty string, or the string "null"
    if (station.favicon && station.favicon !== 'null' && station.favicon.trim() !== '') {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  return (
    <>
      {/* Backdrop Blur Background - Exact from Figma */}
      <div 
        className="absolute backdrop-blur-[13px] bg-[rgba(0,0,0,0.61)] h-[155px] left-0 opacity-[0.82] top-[925px] w-[1920px] z-50"
        style={{ backdropFilter: 'blur(13px)' }}
      />

      {/* Station Logo */}
      <div className="absolute bg-white left-[235px] overflow-clip rounded-[4.45px] size-[89px] top-[958px] z-50">
        <img 
          src={getStationImage(currentStation)}
          alt={currentStation.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Station Name */}
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[357px] not-italic text-[24px] text-white top-[976px] z-50">
        {currentStation.name}
      </p>

      {/* Bottom Row: Country name - Metadata - separated */}
      <div className="absolute left-[357px] top-[1007.2px] z-50 flex items-center gap-[12px] max-w-[800px]">
        {/* Country Name */}
        <p className="font-['Ubuntu',Helvetica] font-light leading-normal not-italic text-[20px] text-white">
          {currentStation.country || t('radio') || 'Radio'}
        </p>
        
        {/* Separator dot if metadata exists */}
        {nowPlayingMetadata && (
          <span className="text-white/50 text-[20px]">•</span>
        )}
        
        {/* Now Playing Metadata */}
        {nowPlayingMetadata && (
          <p className="font-['Ubuntu',Helvetica] font-light leading-normal not-italic text-[20px] text-[#ff4199] truncate flex-1">
            {nowPlayingMetadata}
          </p>
        )}
      </div>

      {/* Previous Button */}
      <div 
        className="absolute bg-black border-[#ff4199] border-[5px] border-solid left-[1210px] overflow-clip rounded-[45.096px] size-[90.192px] top-[958px] z-50 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
        data-tv-focusable="true"
        data-testid="button-global-previous"
      >
        <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.375 16.9792L23.6042 27.75L34.375 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.1458 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Play/Pause Button */}
      <div 
        className="absolute bg-black left-[1336.27px] overflow-clip rounded-[45.096px] size-[90.192px] top-[958px] z-50 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
        onClick={togglePlayPause}
        data-tv-focusable="true"
        data-testid="button-global-play-pause"
      >
        {isPlaying ? (
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="14" width="6" height="27" rx="2" fill="white"/>
            <rect x="31" y="14" width="6" height="27" rx="2" fill="white"/>
          </svg>
        ) : (
          <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 14L38 27.5L20 41V14Z" fill="white"/>
          </svg>
        )}
      </div>

      {/* Next Button */}
      <div 
        className="absolute bg-black left-[1462.54px] overflow-clip rounded-[45.096px] size-[90.192px] top-[958px] z-50 cursor-pointer hover:bg-gray-900 transition-colors flex items-center justify-center"
        data-tv-focusable="true"
        data-testid="button-global-next"
      >
        <svg className="size-[54.115px]" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.625 16.9792L31.3958 27.75L20.625 38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M38.8542 16.9792V38.5208" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Favorite Button */}
      <div 
        className={`absolute border-[3.608px] border-solid left-[1588.81px] rounded-[72.655px] size-[90.192px] top-[958px] z-50 cursor-pointer transition-colors flex items-center justify-center ${
          isFavorite(currentStation._id) 
            ? 'bg-[#ff4199] border-[#ff4199] hover:bg-[#e0368a]' 
            : 'border-black hover:bg-[rgba(255,255,255,0.1)]'
        }`}
        onClick={() => toggleFavorite(currentStation)}
        data-tv-focusable="true"
        data-testid="button-global-favorite"
      >
        <svg className="size-[50.508px]" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25.5 44.625C24.7396 44.625 23.9792 44.3958 23.3604 43.9375C18.9375 40.6042 14.9479 37.6771 11.9792 34.7917C7.44792 30.3479 4.25 26.2646 4.25 20.625C4.25 12.6667 10.5 6.375 18.0625 6.375C21.6042 6.375 24.9167 8.14583 27.125 11.1354C29.3333 8.14583 32.6458 6.375 36.1875 6.375C43.75 6.375 50 12.6667 50 20.625C50 26.2646 46.8021 30.3479 42.2708 34.8125C39.3021 37.6979 35.3125 40.625 30.8896 43.9583C30.2708 44.3958 29.5104 44.625 28.75 44.625H25.5Z" fill="white"/>
        </svg>
      </div>

      {/* Equalizer Button (Now Playing visualization) */}
      <div 
        className={`absolute border-[3.608px] border-solid left-[1715px] rounded-[72.655px] size-[90.192px] top-[958px] z-50 cursor-pointer transition-colors flex items-center justify-center ${isPlaying ? 'bg-[#ff4199] border-[#ff4199]' : 'border-black hover:bg-[rgba(255,255,255,0.1)]'}`}
        data-tv-focusable="true"
        data-testid="button-global-equalizer"
      >
        <div className="relative h-[35.526px] w-[33.75px]">
          <div className={`bg-white left-0 rounded-[10px] absolute top-0 w-[8.882px] ${isPlaying ? 'animate-equalizer-global-1' : 'h-[35.526px]'}`} style={{ height: isPlaying ? undefined : '35.526px' }} />
          <div className={`bg-white left-[12.43px] rounded-[10px] absolute w-[8.882px] ${isPlaying ? 'animate-equalizer-global-2' : 'h-[24.868px] top-[10.66px]'}`} style={{ height: isPlaying ? undefined : '24.868px', top: isPlaying ? undefined : '10.66px' }} />
          <div className={`bg-white left-[24.87px] rounded-[10px] absolute w-[8.882px] ${isPlaying ? 'animate-equalizer-global-3' : 'h-[30.197px] top-[5.33px]'}`} style={{ height: isPlaying ? undefined : '30.197px', top: isPlaying ? undefined : '5.33px' }} />
        </div>
      </div>
    </>
  );
};
