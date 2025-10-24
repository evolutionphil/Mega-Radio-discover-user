import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { assetPath } from "@/lib/assetPath";

export const Guide2 = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();

  // Component lifecycle logging
  useEffect(() => {
    console.log('[Guide2] 🎬 Component mounted');
    console.log('[Guide2] 📂 Image paths to load:', {
      background: '/images/discover-background.png',
      arrow: '/images/arrow.svg',
      icon: '/images/music-icon.svg'
    });
    return () => {
      console.log('[Guide2] 👋 Component unmounting');
    };
  }, []);

  // Register with FocusRouter (LGTV pattern)
  usePageKeyHandler('/guide-2', (e) => {
    const key = (window as any).tvKey;
    console.log('[Guide2] ⌨️  Key pressed:', e.keyCode);
    
    // OK/Enter key (13) on Samsung TV
    if (e.keyCode === 13 || e.keyCode === key?.ENTER) {
      console.log('[Guide2] ✅ OK/Enter - navigating to Guide 3');
      e.preventDefault();
      setLocation('/guide-3');
    }
  });

  const handleClick = () => {
    console.log('[Guide2] 🖱️  Clicked - navigating to Guide 3');
    setLocation('/guide-3');
  };

  // Image loading handlers
  const handleImageLoad = (imageName: string) => {
    console.log(`[Guide2] ✅ Image loaded successfully: ${imageName}`);
  };

  const handleImageError = (imageName: string, src: string) => {
    console.error(`[Guide2] ❌ Image failed to load: ${imageName}`, {
      src,
      fullPath: window.location.origin + src
    });
  };

  return (
      <div 
        className="bg-black absolute inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
        data-testid="page-guide-2"
        onClick={handleClick}
      >
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute h-[1080px] left-0 top-0 w-[1920px]"
          style={{
            background: `linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), url(${assetPath("images/discover-background.png")}) lightgray center top / cover no-repeat`
          }}
        />

        {/* Arrow pointing to Genres button */}
        <div className="absolute flex items-center justify-center left-[188px] top-[381px] z-20">
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
                src={assetPath("images/music-icon.svg")}
                onLoad={() => handleImageLoad('music-icon.svg')}
                onError={() => handleImageError('music-icon.svg', assetPath('images/music-icon.svg'))}
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
