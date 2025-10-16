import { Link } from "wouter";
import { Radio } from "lucide-react";

export const Guide1 = (): JSX.Element => {
  return (
    <Link href="/guide-2">
      <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden cursor-pointer" data-testid="page-guide-1">
        {/* Background - Discover Page Layout */}
        <div className="absolute inset-0">
          {/* Recreate Discover Page as Background */}
          <div className="absolute inset-0 bg-[#0e0e0e]">
            {/* Logo */}
            <div className="absolute left-[30px] top-[64px] w-[164.421px] h-[57px]">
              <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap opacity-50">
                <span className="font-bold">mega</span>radio
              </p>
              <img
                className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%] opacity-50"
                alt="Path"
                src="/figmaAssets/path-8.svg"
              />
            </div>

            {/* Left Sidebar with buttons */}
            <div className="absolute left-[64px] top-[242px] w-[98px] flex flex-col gap-[10px]">
              {/* Other sidebar items dimmed */}
              <div className="w-[98px] h-[98px] rounded-[10px] bg-[rgba(255,255,255,0.05)]" />
              <div className="w-[98px] h-[98px] rounded-[10px] bg-[rgba(255,255,255,0.05)]" />
              <div className="w-[98px] h-[98px] rounded-[10px] bg-[rgba(255,255,255,0.05)]" />
              <div className="w-[98px] h-[98px] rounded-[10px] bg-[rgba(255,255,255,0.05)]" />
              <div className="w-[98px] h-[98px] rounded-[10px] bg-[rgba(255,255,255,0.05)]" />
            </div>

            {/* Main content area - Recently Played */}
            <div className="absolute left-[236px] top-[242px]">
              <p className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white opacity-50 mb-4">
                Recently Played
              </p>
              <div className="flex gap-[19px] mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.1)] rounded-[11px]" />
                ))}
              </div>
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
          </div>
        </div>

        {/* Highlighted Discover Button */}
        <div className="absolute left-[64px] top-[242px] w-[98px] h-[98px] bg-[rgba(255,255,255,0.2)] rounded-[10px] overflow-clip z-10" data-testid="button-discover">
          <div className="absolute left-[13px] top-[19px] w-[72px] h-[61px]">
            <p className="absolute left-[36px] top-[40px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
              Discover
            </p>
            <div className="absolute left-[20px] top-0 w-[32px] h-[32px]">
              <Radio className="w-full h-full text-white" fill="white" />
            </div>
          </div>
        </div>

        {/* Arrow pointing to Discover button */}
        <div className="absolute left-[188px] top-[274px] flex items-center justify-center z-10">
          <div className="rotate-[1.292deg]">
            <div className="relative w-[130.979px] h-[31.65px]">
              <svg className="w-full h-full" viewBox="0 0 131 32" fill="none">
                <path
                  d="M1 15.5C1 15.5 40 1 80 1C120 1 131 15.5 131 15.5C131 15.5 120 30 80 30C40 30 1 15.5 1 15.5Z"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tooltip Box */}
        <div className="absolute left-[340px] top-[233px] w-[720px] h-[115px] bg-black rounded-[10px] overflow-clip z-10">
          <div className="absolute left-[67px] top-[29px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal whitespace-nowrap">
            <p className="mb-0">This is the discovery page. You can always reach here</p>
            <p>by pressing the red button on the remote.</p>
          </div>
          <div className="absolute left-[24px] top-[48px] w-[18.667px] h-[18.667px] bg-[#e95252] rounded-[40px]" />
        </div>
      </div>
    </Link>
  );
};
