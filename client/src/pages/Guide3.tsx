import { Link } from "wouter";
import { Search } from "lucide-react";

export const Guide3 = (): JSX.Element => {
  return (
    <Link href="/guide-4">
      <div className="relative w-[1920px] h-[1080px] bg-white overflow-hidden cursor-pointer" data-testid="page-guide-3">
        {/* Background Image with Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <div className="absolute inset-0 pointer-events-none">
            <img
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              alt="Background"
              src="/figmaAssets/guide1-background.jpg"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
          </div>
        </div>

        {/* Highlighted Search Button */}
        <div className="absolute left-[63px] top-[457px] w-[98px] h-[98px] bg-[rgba(255,255,255,0.2)] rounded-[10px] overflow-clip z-10" data-testid="button-search">
          <div className="absolute left-[21px] top-[19px] w-[56px] h-[61px]">
            <p className="absolute left-[28px] top-[40px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
              Search
            </p>
            <div className="absolute left-[12px] top-0 w-[32px] h-[32px]">
              <Search className="w-full h-full text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Arrow pointing to Search button */}
        <div className="absolute left-[188px] top-[490px] flex items-center justify-center z-10">
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
        <div className="absolute left-[340px] top-[449px] w-[597px] h-[115px] bg-black rounded-[10px] overflow-clip z-10">
          <div className="absolute left-[67px] top-[29px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal whitespace-nowrap">
            <p className="mb-0">You can find any radio station you want here.</p>
            <p>Press the blue on the remote!</p>
          </div>
          <div className="absolute left-[24px] top-[48px] w-[18.667px] h-[18.667px] bg-[#2d41f4] rounded-[40px]" />
        </div>
      </div>
    </Link>
  );
};
