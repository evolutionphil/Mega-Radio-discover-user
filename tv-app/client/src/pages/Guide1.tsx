import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";

export const Guide1 = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();

  // Component lifecycle logging
  useEffect(() => {
    console.log('[Guide1] 🎬 Component mounted');
    console.log('[Guide1] 📂 Image paths to load:', {
      background: '/images/discover-background.png',
      arrow: '/images/arrow.svg',
      icon: '/images/radio-icon.svg'
    });
    return () => {
      console.log('[Guide1] 👋 Component unmounting');
    };
  }, []);

  // Handle Samsung TV remote OK/Enter key - global listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[Guide1] ⌨️  Key event:', {
        key: e.key,
        keyCode: e.keyCode,
        code: e.code,
        type: e.type,
        target: e.target,
        bubbles: e.bubbles,
        cancelable: e.cancelable
      });
      // OK/Enter key on Samsung TV (keyCode 13 or "Enter")
      if (e.keyCode === 13 || e.key === 'Enter') {
        console.log('[Guide1] ✅ OK/Enter detected - navigating to Guide 2');
        e.preventDefault();
        e.stopPropagation();
        setLocation('/guide-2');
      } else {
        console.log('[Guide1] ℹ️  Key not handled:', e.key);
      }
    };

    console.log('[Guide1] 🎯 Adding keydown listener (capture phase)');
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('[Guide1] 🗑️  Removing keydown listener');
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [setLocation]);

  const handleClick = () => {
    console.log('[Guide1] 🖱️  Clicked - navigating to Guide 2');
    setLocation('/guide-2');
  };

  // Image loading handlers
  const handleImageLoad = (imageName: string) => {
    console.log(`[Guide1] ✅ Image loaded successfully: ${imageName}`);
  };

  const handleImageError = (imageName: string, src: string) => {
    console.error(`[Guide1] ❌ Image failed to load: ${imageName}`, {
      src,
      fullPath: window.location.origin + src
    });
  };

  return (
      <div 
        className="bg-white fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" 
        data-testid="page-guide-1"
        onClick={handleClick}
      >
        {/* Background Image with Dark Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img 
              alt="" 
              className="absolute max-w-none object-50%-50% object-cover size-full" 
              src="/images/discover-background.png"
              onLoad={() => handleImageLoad('discover-background.png')}
              onError={() => handleImageError('discover-background.png', '/images/discover-background.png')}
            />
            <div className="absolute bg-[rgba(0,0,0,0.7)] inset-0" />
          </div>
        </div>

        {/* Highlighted Discover Button */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-[64px] overflow-clip rounded-[10px] size-[98px] top-[242px] z-20" data-testid="button-discover-highlighted">
          <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              {t('guide_discover_title') || t('nav_discover') || 'Discover'}
            </p>
            <div className="absolute left-[20px] size-[32px] top-0">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/images/radio-icon.svg"
                onLoad={() => handleImageLoad('radio-icon.svg')}
                onError={() => handleImageError('radio-icon.svg', '/images/radio-icon.svg')}
              />
            </div>
          </div>
        </div>

        {/* Arrow pointing to Discover button */}
        <div className="absolute flex items-center justify-center left-[188px] top-[274px] z-20">
          <div className="rotate-[1.292deg]">
            <div className="h-[31.65px] relative w-[130.979px]">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/images/arrow.svg"
                onLoad={() => handleImageLoad('arrow.svg')}
                onError={() => handleImageError('arrow.svg', '/images/arrow.svg')}
              />
            </div>
          </div>
        </div>

        {/* Tooltip Box */}
        <div className="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[233px] w-[720px] z-20">
          <div className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
            <p className="mb-0">{t('guide_discover_description') || 'This is the discovery page. You can always reach here'}</p>
            <p>{t('guide_discover_red_button') || 'by pressing the red button on the remote.'}</p>
          </div>
          <div className="absolute bg-[#e95252] left-[24px] rounded-[40px] size-[18.667px] top-[48px]" />
        </div>
      </div>
  );
};
