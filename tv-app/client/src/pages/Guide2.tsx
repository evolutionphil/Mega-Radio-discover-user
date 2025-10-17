import { Link } from "wouter";
import { Music } from "lucide-react";

export const Guide2 = (): JSX.Element => {
  return (
    <Link href="/guide-3">
      <div className="relative w-[1920px] h-[1080px] bg-white overflow-hidden cursor-pointer" data-testid="page-guide-2">
        {/* Background Image with Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <div className="absolute inset-0 pointer-events-none">
            <img
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              alt="Background"
              src="/images/guide1-background.jpg"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
          </div>
        </div>

        {/* Highlighted Genres Button */}
        <div className="absolute left-[63px] top-[346px] w-[98px] h-[98px] bg-[rgba(255,255,255,0.2)] rounded-[10px] overflow-clip z-10" data-testid="button-genres">
          <div className="absolute left-[20px] top-[19px] w-[59px] h-[61px]">
            <p className="absolute left-[29.5px] top-[40px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
              Genres
            </p>
            <div className="absolute left-[13px] top-0 w-[32px] h-[32px]">
              <Music className="w-full h-full text-white" fill="white" />
            </div>
          </div>
        </div>

        {/* Arrow pointing to Genres button */}
        <div className="absolute left-[188px] top-[381px] flex items-center justify-center z-10">
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
        <div className="absolute left-[340px] top-[338px] w-[509px] h-[115px] bg-black rounded-[10px] overflow-clip z-10">
          <p className="absolute left-[67px] top-[43px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
            You can press green to access genres.
          </p>
          <div className="absolute left-[24px] top-[48px] w-[18.667px] h-[18.667px] bg-[#55e952] rounded-[40px]" />
        </div>
      </div>
    </Link>
  );
};
