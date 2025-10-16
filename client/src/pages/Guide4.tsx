import { Link } from "wouter";

export const Guide4 = (): JSX.Element => {
  return (
    <Link href="/discover">
      <div className="relative w-[1920px] h-[1080px] bg-white overflow-hidden cursor-pointer" data-testid="page-guide-4">
      {/* Background Discover Page with Overlay */}
      <div className="absolute inset-0">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Discover Background"
          src="/figmaAssets/discover-nouser-bg.png"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Arrow pointing to Favorites button */}
      <div className="absolute left-[188px] top-[596px] w-[131px] h-[32px] rotate-[1.292deg]">
        <img
          className="w-full h-full"
          alt="Arrow"
          src="/figmaAssets/vector-arrow.svg"
        />
      </div>

      {/* Tooltip Box */}
      <div className="absolute left-[340px] top-[555px] w-[597px] h-[115px] bg-black rounded-[10px] overflow-clip">
        <div className="absolute left-[67px] top-[29px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
          <p className="mb-0">Your favorite radios will be here.</p>
          <p>Press yellow on the remote.</p>
        </div>
        <div className="absolute left-[24px] top-[48px] w-[18.667px] h-[18.667px] bg-[#f4ec2d] rounded-[40px]" />
      </div>

      {/* Highlighted Favorites Button */}
      <div className="absolute left-[62px] top-[565px] w-[98px] h-[98px] bg-[rgba(255,255,255,0.2)] rounded-[10px] overflow-clip" data-testid="button-favorites">
        <div className="absolute left-[11px] top-[19px] w-[77px] h-[61px]">
          <p className="absolute left-1/2 -translate-x-1/2 top-[40px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal">
            Favorites
          </p>
          <img
            className="absolute left-[23px] top-0 w-[32px] h-[32px]"
            alt="Favorites"
            src="/figmaAssets/vuesax-bold-heart.svg"
          />
        </div>
      </div>
      </div>
    </Link>
  );
};
