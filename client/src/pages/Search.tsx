import { Link } from "wouter";

export const Search = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-black overflow-hidden" data-testid="page-search">
      {/* Search Input */}
      <Link href="/radio-playing">
        <button className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid cursor-pointer h-[91px] left-[308px] rounded-[14px] top-[136px] w-[968px]" data-testid="input-search">
          <div className="h-[91px] overflow-clip relative rounded-[inherit] w-[968px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[88.21px] not-italic text-[25.94px] text-white top-[29.84px]">
              Kral Ra
            </p>
            <div className="absolute left-[32.43px] size-[31.134px] top-[29.84px]">
              <img
                alt=""
                className="block max-w-none size-full"
                src="/figmaAssets/vuesax-outline-search-normal.svg"
              />
            </div>
          </div>
        </button>
      </Link>

      {/* Search Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[308px] not-italic text-[32px] text-white top-[58px]">
        Search
      </p>

      {/* Native Keyboard */}
      <div className="absolute bg-[#313131] h-[378px] left-[308px] overflow-clip rounded-[14px] top-[610px] w-[1006px]">
        <p className="absolute font-['Roboto',Helvetica] font-medium leading-normal left-1/2 text-[#656565] text-[25.945px] text-center top-[calc(50%-15px)] translate-x-[-50%]">
          Native keyboard
        </p>
      </div>

      {/* Search Result 1 - Highlighted */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.28)] border-[#b4b4b4] border-[5.5px] border-solid box-border content-stretch flex gap-[10px] items-start left-[308px] px-[50px] py-[20px] rounded-[14px] top-[259px]" data-testid="result-kral-radyo">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">
            Kral Radyo
          </p>
          <div className="absolute inset-[-5.5px] pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Search Result 2 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[308px] px-[50px] py-[20px] rounded-[14px] top-[344px]" data-testid="result-kral-radyo-ankara">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[0px] text-[22px] text-center text-white">
            Kral Rad<span className="text-[#a5a5a5]">yo Ankara</span>
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Search Result 3 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[308px] px-[50px] py-[20px] rounded-[14px] top-[429px]" data-testid="result-kral-radyo-istanbul-1">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[0px] text-[22px] text-center text-white">
            Kral Rad<span className="text-[#a5a5a5]">yo İstanbul</span>
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Search Result 4 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[308px] px-[50px] py-[20px] rounded-[14px] top-[514px]" data-testid="result-kral-radyo-istanbul-2">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[0px] text-[22px] text-center text-white">
            Kral Rad<span className="text-[#a5a5a5]">yo İstanbul</span>
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[1394px] not-italic text-[32px] text-white top-[58px]">
        Recently Played
      </p>

      {/* Recently Played Station 1 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1394px] overflow-clip rounded-[11px] top-[136px] w-[200px]" data-testid="recent-station-0">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Station 2 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1394px] overflow-clip rounded-[11px] top-[430px] w-[200px]" data-testid="recent-station-1">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Station 3 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1394px] overflow-clip rounded-[11px] top-[724px] w-[200px]" data-testid="recent-station-2">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Station 4 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1624px] overflow-clip rounded-[11px] top-[136px] w-[200px]" data-testid="recent-station-3">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
            <div className="absolute left-[-2px] size-[136px] top-[-2px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/0b75jzrr-400x400-1-8.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Station 5 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1624px] overflow-clip rounded-[11px] top-[430px] w-[200px]" data-testid="recent-station-4">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
            <div className="absolute left-[-2px] size-[136px] top-[-2px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/0b75jzrr-400x400-1-8.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Recently Played Station 6 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1624px] overflow-clip rounded-[11px] top-[724px] w-[200px]" data-testid="recent-station-5">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <div className="absolute h-[51.92px] left-[10.38px] top-[38.94px] w-[109.032px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/powertu-rk-tv-logosu-1-12.png"
              />
            </div>
            <div className="absolute left-[-2px] size-[136px] top-[-2px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/figmaAssets/0b75jzrr-400x400-1-8.png"
              />
            </div>
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Türkçe Pop
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <div className="absolute bottom-[2.84%] left-0 right-[65.2%] top-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src="/figmaAssets/path-8.svg"
          />
        </div>
      </div>

      {/* Login Button (top right) */}
      <Link href="/login">
        <div className="absolute bg-[rgba(255,255,255,0.1)] h-[52px] left-[1695px] overflow-clip rounded-[30px] top-[66px] w-[146px] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors" data-testid="button-login-header">
          <img
            className="absolute left-[13px] size-[34px] top-[9px]"
            alt="Login"
            src="/figmaAssets/vuesax-bold-setting-2.svg"
          />
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[57.08px] not-italic text-[24px] text-white top-[12px]">
            Login
          </p>
        </div>
      </Link>

      {/* Left Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px]">
        {/* Discover */}
        <Link href="/discover">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover">
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Discover
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-radio.svg"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Genres */}
        <Link href="/genres">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[108px]" data-testid="button-genres">
            <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Genres
              </p>
              <div className="absolute left-[13px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-musicnote.svg"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Search - Active */}
        <Link href="/search">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search">
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Search
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-search-normal.svg"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link href="/favorites">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[324px]" data-testid="button-favorites">
            <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Favorites
              </p>
              <div className="absolute left-[22px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-heart.svg"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Records */}
        <Link href="/discover">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[432px]" data-testid="button-records">
            <div className="absolute h-[61px] left-[16px] top-[19px] w-[66px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[33px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Records
              </p>
              <div className="absolute left-[17px] size-[32px] top-0">
                <div className="absolute left-0 size-[32px] top-0">
                  <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
                  <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Settings */}
        <Link href="/settings">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[540px]" data-testid="button-settings">
            <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Settings
              </p>
              <div className="absolute left-[18px] size-[32px] top-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-bold-setting-2.svg"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
