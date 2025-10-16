import { Link } from "wouter";

export const Guide2 = (): JSX.Element => {
  return (
    <Link href="/guide-3">
      <div className="relative w-[1920px] h-[1080px] bg-white overflow-hidden cursor-pointer" data-testid="page-guide-2">
      {/* Background Discover Page with Overlay */}
      <div className="absolute inset-0">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Discover Background"
          src="/figmaAssets/discover-nouser-bg.png"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Arrow pointing to Genres button */}
      <div className="absolute left-[188px] top-[245px] w-[131px] h-[32px] rotate-[1.292deg]">
        <img
          className="w-full h-full"
          alt="Arrow"
          src="/figmaAssets/vector-arrow.svg"
        />
      </div>

      {/* Tooltip Box */}
      <div className="absolute left-[340px] top-[204px] w-[597px] h-[115px] bg-black rounded-[10px] overflow-clip">
        <p className="absolute left-[67px] top-[43px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
          You can press green to access genres.
        </p>
        <div className="absolute left-[24px] top-[48px] w-[18.667px] h-[18.667px] bg-[#55e952] rounded-[40px]" />
      </div>

      {/* Highlighted Genres Button */}
      <div className="absolute left-[62px] top-[214px] w-[98px] h-[98px] bg-[rgba(255,255,255,0.2)] rounded-[10px] overflow-clip" data-testid="button-genres">
        <div className="absolute left-[11px] top-[19px] w-[77px] h-[61px]">
          <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
            Genres
          </p>
          <img
            className="absolute left-[23px] top-0 w-[32px] h-[32px]"
            alt="Genres"
            src="/figmaAssets/vuesax-bold-musicnote.svg"
          />
        </div>
      </div>
      </div>
    </Link>
  );
};
