import { Link } from "wouter";
import { assetPath } from "@/lib/assetPath";
import { useLocalization } from "@/contexts/LocalizationContext";

interface SidebarProps {
  activePage: 'discover' | 'genres' | 'search' | 'favorites' | 'settings';
  isFocused: (index: number) => boolean;
  getFocusClasses: (focused: boolean) => string;
}

// Color indicators matching onboarding guide pages
const MENU_COLORS = {
  discover: '#ff4199',   // Vibrant pink/red
  genres: '#10b981',     // Fresh green
  search: '#3b82f6',     // Electric blue
  favorites: '#fbbf24'   // Sunny yellow
};

export const Sidebar = ({ activePage, isFocused, getFocusClasses }: SidebarProps): JSX.Element => {
  const { t } = useLocalization();
  return (
    <div className="fixed h-[640px] left-[64px] top-[242px] w-[120px] z-50 pointer-events-auto">
      {/* Discover */}
      <Link href="/discover-no-user">
        <div className={`absolute left-0 rounded-[10px] w-[120px] h-[110px] top-0 ${getFocusClasses(isFocused(0))}`} data-testid="button-discover">
          {/* Color indicator - Pink */}
          <span 
            className={`absolute top-2 right-2 size-[18px] rounded-full transition-transform ${isFocused(0) ? 'scale-110' : ''}`}
            style={{ 
              backgroundColor: MENU_COLORS.discover,
              boxShadow: '0 0 8px rgba(255,65,153,0.6)'
            }}
            data-testid="indicator-discover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[16px] pb-[14px] px-[4px] overflow-hidden rounded-[10px]">
            <div className="size-[32px] mb-[6px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/radio-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[14px] text-center text-white leading-tight truncate w-full">
              {t('nav_discover') || 'Discover'}
            </p>
          </div>
        </div>
      </Link>

      {/* Genres */}
      <Link href="/genres">
        <div className={`absolute left-0 rounded-[10px] w-[120px] h-[110px] top-[120px] ${getFocusClasses(isFocused(1))}`} data-testid="button-genres">
          {/* Color indicator - Green */}
          <span 
            className={`absolute top-2 right-2 size-[18px] rounded-full transition-transform ${isFocused(1) ? 'scale-110' : ''}`}
            style={{ 
              backgroundColor: MENU_COLORS.genres,
              boxShadow: '0 0 8px rgba(16,185,129,0.6)'
            }}
            data-testid="indicator-genres"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[16px] pb-[14px] px-[4px] overflow-hidden rounded-[10px]">
            <div className="size-[32px] mb-[6px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/music-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[14px] text-center text-white leading-tight truncate w-full">
              {t('nav_genres') || 'Genres'}
            </p>
          </div>
        </div>
      </Link>

      {/* Search */}
      <Link href="/search">
        <div className={`absolute left-0 rounded-[10px] w-[120px] h-[110px] top-[240px] ${getFocusClasses(isFocused(2))}`} data-testid="button-search">
          {/* Color indicator - Blue */}
          <span 
            className={`absolute top-2 right-2 size-[18px] rounded-full transition-transform ${isFocused(2) ? 'scale-110' : ''}`}
            style={{ 
              backgroundColor: MENU_COLORS.search,
              boxShadow: '0 0 8px rgba(59,130,246,0.6)'
            }}
            data-testid="indicator-search"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[16px] pb-[14px] px-[4px] overflow-hidden rounded-[10px]">
            <div className="size-[32px] mb-[6px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/search-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[14px] text-center text-white leading-tight truncate w-full">
              {t('nav_search') || 'Search'}
            </p>
          </div>
        </div>
      </Link>

      {/* Favorites */}
      <Link href="/favorites">
        <div className={`absolute left-0 rounded-[10px] w-[120px] h-[110px] top-[360px] ${getFocusClasses(isFocused(3))}`} data-testid="button-favorites">
          {/* Color indicator - Yellow */}
          <span 
            className={`absolute top-2 right-2 size-[18px] rounded-full transition-transform ${isFocused(3) ? 'scale-110' : ''}`}
            style={{ 
              backgroundColor: MENU_COLORS.favorites,
              boxShadow: '0 0 8px rgba(251,191,36,0.6)'
            }}
            data-testid="indicator-favorites"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[16px] pb-[14px] px-[4px] overflow-hidden rounded-[10px]">
            <div className="size-[32px] mb-[6px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/heart-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[14px] text-center text-white leading-tight truncate w-full">
              {t('nav_favorites') || 'Favorites'}
            </p>
          </div>
        </div>
      </Link>

      {/* Settings */}
      <Link href="/settings">
        <div className={`absolute left-0 overflow-hidden rounded-[10px] w-[120px] h-[110px] top-[480px] ${getFocusClasses(isFocused(4))}`} data-testid="button-settings">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[16px] pb-[14px] px-[4px]">
            <div className="size-[32px] mb-[6px] flex-shrink-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={assetPath("images/settings-icon.svg")}
              />
            </div>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[14px] text-center text-white leading-tight truncate w-full">
              {t('nav_settings') || 'Settings'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
