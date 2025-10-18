import { Link } from "wouter";
import { useTVNavigation } from "@/hooks/useTVNavigation";

export const Guide1 = (): JSX.Element => {
  useTVNavigation();

  return (
    <Link href="/guide-2">
      <div className="bg-white fixed inset-0 w-[1920px] h-[1080px] overflow-hidden cursor-pointer" data-testid="page-guide-1">
        {/* Background Image with Dark Overlay */}
        <div className="absolute h-[1897px] left-0 top-0 w-[1920px]">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img 
              alt="" 
              className="absolute max-w-none object-50%-50% object-cover size-full" 
              src="/guide-assets/discover-background.png"
            />
            <div className="absolute bg-[rgba(0,0,0,0.7)] inset-0" />
          </div>
        </div>

        {/* Highlighted Discover Button */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] left-[64px] overflow-clip rounded-[10px] size-[98px] top-[242px] z-20" data-testid="button-discover-highlighted">
          <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Discover
            </p>
            <div className="absolute left-[20px] size-[32px] top-0">
              <img 
                alt="" 
                className="block max-w-none size-full" 
                src="/guide-assets/radio-icon.svg"
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
                src="/guide-assets/arrow.svg"
              />
            </div>
          </div>
        </div>

        {/* Tooltip Box */}
        <div className="absolute bg-black h-[115px] left-[340px] overflow-clip rounded-[10px] top-[233px] w-[720px] z-20">
          <div className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[67px] not-italic text-[24px] text-white top-[29px] whitespace-nowrap">
            <p className="mb-0">This is the discovery page. You can always reach here</p>
            <p>by pressing the red button on the remote.</p>
          </div>
          <div className="absolute bg-[#e95252] left-[24px] rounded-[40px] size-[18.667px] top-[48px]" />
        </div>
      </div>
    </Link>
  );
};
