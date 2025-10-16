import { useEffect } from "react";
import { useLocation } from "wouter";

export const Splash = (): JSX.Element => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-splash">
      {/* Waves Background */}
      <div className="absolute inset-[34.91%_41.51%]">
        <img
          className="block max-w-none w-full h-full"
          alt="Waves"
          src="/figmaAssets/waves.svg"
        />
      </div>

      {/* Dot Pattern Left */}
      <div className="absolute left-[-377px] top-[510.99px] w-[781.011px] h-[781.011px]">
        <div className="absolute inset-[-82.95%]">
          <img
            className="block max-w-none w-full h-full"
            alt=""
            src="/figmaAssets/ellipse-2.svg"
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
      <p className="absolute left-[901px] top-[624px] font-['Ubuntu',Helvetica] font-medium text-[20px] text-[#9b9b9b] leading-normal">
        Listen freely
      </p>

      {/* Bottom Logo/Icon */}
      <div className="absolute left-[916px] top-[911px] w-[88px] h-[45.683px]">
        <div className="absolute bottom-0 left-0 right-[29.66%] top-0">
          <img
            className="block max-w-none w-full h-full"
            alt="Group"
            src="/figmaAssets/group.svg"
          />
        </div>
        <div className="absolute inset-[24.7%_9.75%_0.21%_61.02%]">
          <div className="absolute inset-[-8.7%_-11.59%]">
            <img
              className="block max-w-none w-full h-full"
              alt="Group"
              src="/figmaAssets/group-1.svg"
            />
          </div>
        </div>
        <div className="absolute bottom-[0.21%] left-[83.76%] right-0 top-[49.73%]">
          <img
            className="block max-w-none w-full h-full"
            alt="Group"
            src="/figmaAssets/group-2.svg"
          />
        </div>
      </div>

      {/* megaradio.live text */}
      <p className="absolute left-[960px] top-[984px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
        megaradio.live
      </p>

      {/* Left Dot Pattern Frame */}
      <div className="absolute left-[-16px] top-[466px] w-[667px] h-[614px]">
        <img
          className="absolute inset-0 max-w-none w-full h-full object-cover"
          alt=""
          src="/figmaAssets/frame-445.png"
        />
      </div>
    </div>
  );
};
