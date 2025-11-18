import { Link } from "wouter";
import { assetPath } from "@/lib/assetPath";
import { useLocalization } from "@/contexts/LocalizationContext";

interface SidebarProps {
  activePage: 'discover' | 'genres' | 'search' | 'favorites' | 'settings';
  isFocused: (index: number) => boolean;
  getFocusClasses: (focused: boolean) => string;
}

export const Sidebar = ({ activePage, isFocused, getFocusClasses }: SidebarProps): JSX.Element => {
  const { t } = useLocalization();
  return (
    <div className="fixed h-[638px] left-[64px] top-[242px] w-[98px] z-50 pointer-events-auto">
      {/* Discover */}
      <Link href="/discover-no-user">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-0 ${getFocusClasses(isFocused(0))}`} data-testid="button-discover">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[19px] pb-[18px] px-[5px]">
            <div className="size-[32px] mb-[8px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/radio-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal truncate w-full px-1">
              {t('nav_discover') || 'Discover'}
            </p>
          </div>
        </div>
      </Link>

      {/* Genres */}
      <Link href="/genres">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[108px] ${getFocusClasses(isFocused(1))}`} data-testid="button-genres">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[19px] pb-[18px] px-[5px]">
            <div className="size-[32px] mb-[8px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/music-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal truncate w-full px-1">
              {t('nav_genres') || 'Genres'}
            </p>
          </div>
        </div>
      </Link>

      {/* Search */}
      <Link href="/search">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[216px] ${getFocusClasses(isFocused(2))}`} data-testid="button-search">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[19px] pb-[18px] px-[5px]">
            <div className="size-[32px] mb-[8px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/search-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal truncate w-full px-1">
              {t('nav_search') || 'Search'}
            </p>
          </div>
        </div>
      </Link>

      {/* Favorites */}
      <Link href="/favorites">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[324px] ${getFocusClasses(isFocused(3))}`} data-testid="button-favorites">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[19px] pb-[18px] px-[5px]">
            <div className="size-[32px] mb-[8px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/heart-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal truncate w-full px-1">
              {t('nav_favorites') || 'Favorites'}
            </p>
          </div>
        </div>
      </Link>

      {/* Settings */}
      <Link href="/settings">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] size-[98px] top-[432px] ${getFocusClasses(isFocused(4))}`} data-testid="button-settings">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[19px] pb-[18px] px-[5px]">
            <div className="size-[32px] mb-[8px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/settings-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal truncate w-full px-1">
              {t('nav_settings') || 'Settings'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
