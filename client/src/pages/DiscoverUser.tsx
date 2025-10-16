import { Link } from "wouter";
import { Radio, Music, Search, Heart, Settings } from "lucide-react";

export const DiscoverUser = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[2240px] bg-white overflow-y-auto" data-testid="page-discover">
      {/* Background Image */}
      <div className="absolute h-[1292px] left-[-10px] top-[-523px] w-[1939px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src="/figmaAssets/hand-crowd-disco-1.png"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-[0.88%] from-[rgba(14,14,14,0)] h-[1080px] left-0 to-[#0e0e0e] to-[48.611%] top-0 w-[1920px]" />

      {/* Logo */}
      <div className="absolute h-[57px] left-[30px] top-[64px] w-[164.421px]">
        <p className="absolute bottom-0 font-['Ubuntu',Helvetica] leading-normal left-[18.67%] not-italic right-0 text-[27.029px] text-white top-[46.16%] whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Top Right - Equalizer */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] left-[1281px] overflow-clip rounded-[30px] size-[51px] top-[67px]">
        <div className="absolute h-[25px] left-[13.75px] overflow-clip top-[13px] w-[23.75px]">
          <div className="absolute bg-white h-[25px] left-0 rounded-[10px] top-0 w-[6.25px]" />
          <div className="absolute bg-white h-[17.5px] left-[8.75px] rounded-[10px] top-[7.5px] w-[6.25px]" />
          <div className="absolute bg-white h-[21.25px] left-[17.5px] rounded-[10px] top-[3.75px] w-[6.25px]" />
        </div>
      </div>

      {/* Country Selector */}
      <div className="absolute bg-[rgba(255,255,255,0.1)] h-[51px] left-[1351px] overflow-clip rounded-[30px] top-[67px] w-[223px]">
        <div className="absolute h-[29px] left-[15px] top-[11px] w-[193.684px]">
          <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[39.08px] not-italic text-[24px] text-white top-px">
            Austria
          </p>
          <div className="absolute left-0 size-[28.421px] top-0">
            <img
              alt="Austria"
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src="/figmaAssets/austria-1.png"
            />
          </div>
          <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[170px] top-[3.32px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[23.684px]">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src="/figmaAssets/vuesax-outline-arrow-left.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute h-[66px] left-[1648px] top-[59px] w-[193px]">
        <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[54.5px] not-italic text-[24px] text-center text-white top-[19px] translate-x-[-50%]">
          Talha Çay
        </p>
        <div className="absolute left-[127px] rounded-[73.333px] size-[66px] top-0">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[73.333px] size-full"
            src="/figmaAssets/frame-218.png"
          />
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute h-[638px] left-[64px] top-[242px] w-[98px]">
        {/* Discover - Active */}
        <Link href="/discover">
          <div className="absolute bg-[rgba(255,255,255,0.2)] left-0 overflow-clip rounded-[10px] size-[98px] top-0" data-testid="button-discover">
            <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Discover
              </p>
              <div className="absolute left-[20px] size-[32px] top-0">
                <Radio className="size-full text-white" fill="white" />
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
                <Music className="size-full text-white" fill="white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <Link href="/search">
          <div className="absolute left-0 overflow-clip rounded-[10px] size-[98px] top-[216px]" data-testid="button-search">
            <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
              <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
                Search
              </p>
              <div className="absolute left-[12px] size-[32px] top-0">
                <Search className="size-full text-white" strokeWidth={2.5} />
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
                <Heart className="size-full text-white" fill="white" />
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
                <div className="absolute bg-white left-[5.33px] rounded-[10.667px] size-[21.334px] top-[5.33px]" />
                <div className="absolute border-[2.667px] border-solid border-white left-0 rounded-[20.267px] size-[32px] top-0" />
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
                <Settings className="size-full text-white" fill="white" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recently Played Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[242px]">
        Recently Played
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[248px] translate-x-[-50%]">
        See More
      </p>

      {/* Recently Played Cards */}
      {/* Card 1 - BBC Radio */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-0">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/-hdd91mb-400x400-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            BBC Radio
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[99.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            United Kingdom
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 2 - WEEU */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-1">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/830-weeu-1-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            WEEU
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 3 - CNN Featured */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] border-[#d2d2d2] border-[5.75px] border-solid h-[276px] left-[691.46px] rounded-[11.5px] top-[310px] w-[209.091px]" data-testid="card-station-2">
          <div className="h-[276px] overflow-clip relative rounded-[inherit] w-[209.091px]">
            <div className="absolute bg-white left-[35.55px] overflow-clip rounded-[6.9px] size-[138px] top-[35.55px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/cnn-international-logo-1.png" />
            </div>
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[106.73px] not-italic text-[22px] text-center text-white top-[195.5px] translate-x-[-50%]">
              CNN
            </p>
            <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[104.55px] not-italic text-[18.818px] text-center text-white top-[228.12px] translate-x-[-50%]">
              Internatinal
            </p>
          </div>
          <div className="absolute inset-[-5.75px] pointer-events-none shadow-[inset_1.15px_1.15px_12.65px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 4 - NBC News */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-3">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/2616697-nbc-news-logo-stacked--1--1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            NBC News
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 5 - Power Türk */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-4">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/meta-image--1--1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Power Türk
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            Turkey
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 6 - Cheddar */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-5">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/cheddar-news-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            Cheddar
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            USA
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 7 - WNYC */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1616px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-6">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/c175--1--1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">
            WNYC
          </p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">
            <span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York
          </p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Card 8 - Power Türk */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1846px] overflow-clip rounded-[11px] top-[316px] w-[200px]" data-testid="card-station-7">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/0b75jzrr-400x400-1-8.png" />
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

      {/* Popular Genres Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[639px]">
        Popular Genres
      </p>

      {/* Genre Pills */}
      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[236px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-0">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[445px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-1">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Rock</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[664px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-2">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Hip Hop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[916px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-3">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">News</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1142px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-4">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Country</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1394px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-5">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Hip Hop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1646px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-6">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">News</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/genres">
        <div className="absolute bg-[rgba(255,255,255,0.14)] box-border content-stretch flex gap-[10px] items-start left-[1872px] px-[72px] py-[28px] rounded-[20px] top-[713px]" data-testid="button-genre-7">
          <p className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic relative shrink-0 text-[22px] text-center text-white">Country</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Popular Radios Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[863px]">
        Popular Radios
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[869px] translate-x-[-50%]">
        See More
      </p>

      {/* Popular Radios Cards - Row 1 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-0">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/logo-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">VIBRA</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Italy</span>, Rome</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-1">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/c175-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102.5px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">VOA</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-2">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/ebg3ye6-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Radio L</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Turkey</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-3">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/android-default-logo-1-3.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Turkey, Istanbul</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-4">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/meta-image--1--1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18.818px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[936px] w-[200px]" data-testid="card-popular-5">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/washington-d-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Soul Radio</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, Washington D.C</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* Popular Radios Cards - Row 2 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-6">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/germany-bavaria-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">ON 70'S</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[99px] not-italic text-[18px] text-center text-white top-[218px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Germany</span>, Bavaria</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-7">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/830-weeu-1-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">WEEU</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">USA</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-8">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/meta-image--1--1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Metro FM</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">Turkey</span>, Istanbul</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-9">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/alem-fm-1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100.5px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-10">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/apple-icon-120x120-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Zeno</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Italy</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="card-popular-11">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/80s-radio-1.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Radio 80'S</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[100px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]"><span className="font-['Ubuntu',Helvetica] font-medium">USA</span>, New York</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* See More Card */}
      <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1616px] overflow-clip rounded-[11px] top-[1230px] w-[200px]" data-testid="button-see-more">
        <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[100.5px] not-italic text-[22px] text-center text-white top-[120px] translate-x-[-50%]">See More</p>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
      </div>

      {/* More From Austria Title */}
      <p className="absolute font-['Ubuntu',Helvetica] font-bold leading-normal left-[236px] not-italic text-[32px] text-white top-[1578px]">
        More From Austria
      </p>
      <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[1792.5px] not-italic text-[22px] text-center text-white top-[1584px] translate-x-[-50%]">
        See More
      </p>

      {/* More From Austria Cards - Row 1 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/powertu-rk-tv-logosu-1-12.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/0b75jzrr-400x400-1-8.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/alem-fm-1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/android-default-logo-1-3.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/meta-image--1--1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1652px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/alem-fm-1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      {/* More From Austria Cards - Row 2 */}
      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[236px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/powertu-rk-tv-logosu-1-12.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[466px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/0b75jzrr-400x400-1-8.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[696px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/alem-fm-1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[926px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/android-default-logo-1-3.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1156px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/meta-image--1--1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>

      <Link href="/radio-playing">
        <div className="absolute bg-[rgba(255,255,255,0.14)] h-[264px] left-[1386px] overflow-clip rounded-[11px] top-[1946px] w-[200px]">
          <div className="absolute bg-white left-[34px] overflow-clip rounded-[6.6px] size-[132px] top-[34px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/figmaAssets/alem-fm-1-4.png" />
          </div>
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[102px] not-italic text-[22px] text-center text-white top-[187px] translate-x-[-50%]">Power Türk</p>
          <p className="absolute font-['Ubuntu',Helvetica] font-light leading-normal left-[103.1px] not-italic text-[18px] text-center text-white top-[218.2px] translate-x-[-50%]">Türkçe Pop</p>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)]" />
        </div>
      </Link>
    </div>
  );
};
