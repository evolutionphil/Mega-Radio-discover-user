import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";

export const Guide4 = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[Guide4] Key pressed:', e.keyCode, e.key);
      if (e.keyCode === 13 || e.key === 'Enter') {
        console.log('[Guide4] OK/Enter pressed - navigating to Discover');
        e.preventDefault();
        e.stopPropagation();
        setLocation('/discover-no-user');
      }
    };
    console.log('[Guide4] Adding keydown listener');
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('[Guide4] Removing keydown listener');
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [setLocation]);

  const handleClick = () => {
    console.log('[Guide4] Clicked - navigating to Discover');
    setLocation('/discover-no-user');
  };

  return (
      <div 
        className="bg-white fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
        data-testid="page-guide-4"
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

        {/* Arrow pointing to Favorites button */}
        <div className="absolute flex items-center justify-center left-[188px] top-[596px] z-20">
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

        {/* Tooltip Box */}
        <div className="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[555px] w-[597px] z-20">
          <div className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
            <p className="mb-0">{t('guide_favorites_description') || 'Your favorite radios will be here.'}</p>
            <p>{t('guide_favorites_yellow_button') || 'Press yellow on the remote.'}</p>
          </div>
          <div className="absolute bg-[#f4ec2d] left-[24px] rounded-[40px] size-[18.667px] top-[48px]" />
        </div>

        {/* Highlighted Favorites Button */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-[62px] overflow-clip rounded-[10px] size-[98px] top-[565px] z-20" data-testid="button-favorites-highlighted">
          <div className="absolute h-[61px] left-[11px] top-[19px] w-[77px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('guide_favorites_title') || t('nav_your_favorites') || 'Favorites'}
            </p>
            <div className="absolute left-[23px] size-[32px] top-0">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/images/heart-icon.svg"
              />
            </div>
          </div>
        </div>
      </div>
  );
};
