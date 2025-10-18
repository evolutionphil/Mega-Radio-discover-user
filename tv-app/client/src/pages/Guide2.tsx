import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";

export const Guide2 = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[Guide2] Key pressed:', e.keyCode, e.key);
      if (e.keyCode === 13 || e.key === 'Enter') {
        console.log('[Guide2] OK/Enter pressed - navigating to Guide 3');
        e.preventDefault();
        e.stopPropagation();
        setLocation('/guide-3');
      }
    };
    console.log('[Guide2] Adding keydown listener');
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('[Guide2] Removing keydown listener');
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [setLocation]);

  const handleClick = () => {
    console.log('[Guide2] Clicked - navigating to Guide 3');
    setLocation('/guide-3');
  };

  return (
      <div 
        className="bg-white fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
        data-testid="page-guide-2"
        onClick={handleClick}
      >
        {/* Background Image with Dark Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img 
              alt="" 
              className="absolute max-w-none object-50%-50% object-cover size-full" 
              src="/images/discover-background.png"
            />
            <div className="absolute bg-[rgba(0,0,0,0.7)] inset-0" />
          </div>
        </div>

        {/* Arrow pointing to Genres button */}
        <div className="absolute flex items-center justify-center left-[188px] top-[381px] z-20">
          <div className="rotate-[1.292deg]">
            <div className="h-[31.65px] relative w-[130.979px]">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/images/arrow.svg"
              />
            </div>
          </div>
        </div>

        {/* Highlighted Genres Button */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-[63px] overflow-clip rounded-[10px] size-[98px] top-[346px] z-20" data-testid="button-genres-highlighted">
          <div className="absolute h-[61px] left-[20px] top-[19px] w-[59px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('guide_genres_title') || t('genres') || 'Genres'}
            </p>
            <div className="absolute left-[13px] size-[32px] top-0">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/images/music-icon.svg"
              />
            </div>
          </div>
        </div>

        {/* Tooltip Box */}
        <div className="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[338px] w-[509px] z-20">
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[43px]">
            {t('guide_genres_description') || 'You can press green to access genres.'}
          </p>
          <div className="absolute bg-[#55e952] left-[24px] rounded-[40px] size-[18.667px] top-[48px]" />
        </div>
      </div>
  );
};
