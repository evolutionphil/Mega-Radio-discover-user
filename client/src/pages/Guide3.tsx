import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { assetPath } from "@/lib/assetPath";

export const Guide3 = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();

  // Component lifecycle logging
  useEffect(() => {
    console.log('[Guide3] 🎬 Component mounted');
    console.log('[Guide3] 📂 Image paths to load:', {
      background: '/images/discover-background.png',
      arrow: '/images/arrow.svg',
      icon: '/images/search-icon.svg'
    });
    return () => {
      console.log('[Guide3] 👋 Component unmounting');
    };
  }, []);

  // Register with FocusRouter (LGTV pattern)
  usePageKeyHandler('/guide-3', (e) => {
    const key = (window as any).tvKey;
    console.log('[Guide3] ⌨️  Key pressed:', e.keyCode);
    
    // OK/Enter key (13) on Samsung TV
    if (e.keyCode === 13 || e.keyCode === key?.ENTER) {
      console.log('[Guide3] ✅ OK/Enter - navigating to Guide 4');
      e.preventDefault();
      setLocation('/guide-4');
    }
  });

  const handleClick = () => {
    console.log('[Guide3] 🖱️  Clicked - navigating to Guide 4');
    setLocation('/guide-4');
  };

  // Image loading handlers
  const handleImageLoad = (imageName: string) => {
    console.log(`[Guide3] ✅ Image loaded successfully: ${imageName}`);
  };

  const handleImageError = (imageName: string, src: string) => {
    console.error(`[Guide3] ❌ Image failed to load: ${imageName}`, {
      src,
      fullPath: window.location.origin + src
    });
  };

  return (
      <div 
        className="bg-black fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
        data-testid="page-guide-3"
        onClick={handleClick}
      >
        {/* Background Image with Dark Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <img 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover" 
            src={assetPath("images/discover-background.png")}
            onLoad={() => handleImageLoad('discover-background.png')}
            onError={() => handleImageError('discover-background.png', assetPath('images/discover-background.png'))}
          />
          <div className="absolute bg-[rgba(0,0,0,0.7)] inset-0" />
        </div>

        {/* Arrow pointing to Search button */}
        <div className="absolute flex items-center justify-center left-[188px] top-[490px] z-20">
          <div className="rotate-[1.292deg]">
            <div className="h-[31.65px] relative w-[130.979px]">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src={assetPath("images/arrow.svg")}
                onLoad={() => handleImageLoad('arrow.svg')}
                onError={() => handleImageError('arrow.svg', assetPath('images/arrow.svg'))}
              />
            </div>
          </div>
        </div>

        {/* Tooltip Box */}
        <div className="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[449px] w-[597px] z-20">
          <div className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
            <p className="mb-0">{t('guide_search_description') || 'You can find any radio station you want here.'}</p>
            <p>{t('guide_search_blue_button') || 'Press the blue on the remote!'}</p>
          </div>
          <div className="absolute bg-[#2d41f4] left-[24px] rounded-[40px] size-[18.667px] top-[48px]" />
        </div>

        {/* Highlighted Search Button */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-[63px] overflow-clip rounded-[10px] size-[98px] top-[457px] z-20" data-testid="button-search-highlighted">
          <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('guide_search_title') || t('search') || 'Search'}
            </p>
            <div className="absolute left-[12px] size-[32px] top-0">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src={assetPath("images/search-icon.svg")}
                onLoad={() => handleImageLoad('search-icon.svg')}
                onError={() => handleImageError('search-icon.svg', assetPath('images/search-icon.svg'))}
              />
            </div>
          </div>
        </div>
      </div>
  );
};
