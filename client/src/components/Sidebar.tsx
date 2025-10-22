import { Link } from "wouter";
import { assetPath } from "@/lib/assetPath";

interface SidebarProps {
  activePage: 'discover' | 'genres' | 'search' | 'favorites' | 'settings';
  isFocused: (index: number) => boolean;
  getFocusClasses: (focused: boolean) => string;
}

export const Sidebar = ({ activePage, isFocused, getFocusClasses }: SidebarProps): JSX.Element => {
  return (
    <div className="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto">
      {/* Discover */}
      <Link href="/discover-no-user">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-0 ${activePage === 'discover' ? 'bg-[rgba(255,255,255,0.2)]' : ''} ${getFocusClasses(isFocused(0))}`} data-testid="button-discover">
          <div className="absolute h-[61px] left-[13px] top-[19px] w-[72px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[36px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Discover
            </p>
            <div className="absolute left-[20px] size-[32px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/radio-icon.svg")}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Genres */}
      <Link href="/genres">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[108px] ${activePage === 'genres' ? 'bg-[rgba(255,255,255,0.2)]' : ''} ${getFocusClasses(isFocused(1))}`} data-testid="button-genres">
          <div className="absolute h-[61px] left-[19px] top-[19px] w-[59px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[29.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Genres
            </p>
            <div className="absolute left-[13px] size-[32px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/music-icon.svg")}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Search */}
      <Link href="/search">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[216px] ${activePage === 'search' ? 'bg-[rgba(255,255,255,0.2)]' : ''} ${getFocusClasses(isFocused(2))}`} data-testid="button-search">
          <div className="absolute h-[61px] left-[21px] top-[19px] w-[56px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Search
            </p>
            <div className="absolute left-[12px] size-[32px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/search-icon.svg")}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Favorites */}
      <Link href="/favorites">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[324px] ${activePage === 'favorites' ? 'bg-[rgba(255,255,255,0.2)]' : ''} ${getFocusClasses(isFocused(3))}`} data-testid="button-favorites">
          <div className="absolute h-[61px] left-[10px] top-[19px] w-[77px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[38.5px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Favorites
            </p>
            <div className="absolute left-[22px] size-[32px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/heart-icon.svg")}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Settings */}
      <Link href="/settings">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[432px] ${activePage === 'settings' ? 'bg-[rgba(255,255,255,0.2)]' : ''} ${getFocusClasses(isFocused(4))}`} data-testid="button-settings">
          <div className="absolute h-[61px] left-[15px] top-[19px] w-[68px]">
            <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[34px] not-italic text-[18px] text-center text-white top-[40px] translate-x-[-50%]">
              Settings
            </p>
            <div className="absolute left-[18px] size-[32px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/settings-icon.svg")}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
