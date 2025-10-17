import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTVNavigation } from "@/hooks/useTVNavigation";

export const Splash = (): JSX.Element => {
  const [, setLocation] = useLocation();
  
  // Initialize TV navigation
  useTVNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-splash">
      {/* Waves Background - CSS waves animation */}
      <div className="absolute inset-[34.91%_41.51%] opacity-30">
        <svg className="w-full h-full" viewBox="0 0 327 324" fill="none">
          <path
            d="M0 162C0 162 81.75 0 163.5 0C245.25 0 327 162 327 162C327 162 245.25 324 163.5 324C81.75 324 0 162 0 162Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <radialGradient id="wave-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4199" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0e0e0e" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Dot Pattern Left - Circular dot grid */}
      <div className="absolute left-[-377px] top-[510.99px] w-[781.011px] h-[781.011px]">
        <div className="absolute inset-[-82.95%]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,65,153,0.15) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute left-[798px] top-[484px] w-[323.069px] h-[111.999px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[53.108px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Listen freely text */}
      <p className="absolute left-[901px] top-[624px] font-['Ubuntu',Helvetica] font-medium text-[20px] text-[#9b9b9b] leading-normal" data-testid="text-tagline">
        Listen freely
      </p>

      {/* Bottom Logo/Icon Groups - CSS recreation */}
      <div className="absolute left-[916px] top-[911px] w-[88px] h-[45.683px]">
        {/* Left circle */}
        <div className="absolute bottom-0 left-0 w-[62px] h-full">
          <div className="w-[45.683px] h-[45.683px] rounded-full border-[3px] border-[#ff4199]" />
        </div>
        {/* Middle dot */}
        <div className="absolute left-[55px] top-[11.3px]">
          <div className="w-[25.7px] h-[25.7px] rounded-full bg-[#ff4199]" />
        </div>
        {/* Right triangle/arrow */}
        <div className="absolute right-0 top-[22.8px]">
          <div 
            className="w-0 h-0 border-l-[14.3px] border-l-transparent border-t-[22.9px] border-t-[#ff4199] border-b-0"
            style={{ transform: 'rotate(90deg)' }}
          />
        </div>
      </div>

      {/* megaradio.live text */}
      <p className="absolute left-[960px] top-[984px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal" data-testid="text-website">
        megaradio.live
      </p>

      {/* Left Decorative Frame - Dot pattern decoration */}
      <div className="absolute left-[-16px] top-[466px] w-[667px] h-[614px]">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,65,153,0.3) 2px, transparent 2px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0',
            maskImage: 'radial-gradient(ellipse at left, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at left, black 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};
