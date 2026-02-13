import { Link } from "wouter";
import { assetPath } from "@/lib/assetPath";
import { useLocalization } from "@/contexts/LocalizationContext";

interface SidebarProps {
  activePage: 'discover' | 'genres' | 'search' | 'favorites' | 'settings' | 'country';
  isFocused: (index: number) => boolean;
  getFocusClasses: (focused: boolean) => string;
}

const MENU_COLORS = {
  discover: '#ff4199',
  genres: '#10b981',
  search: '#3b82f6',
  favorites: '#fbbf24'
};

interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  index: number;
  page: SidebarProps['activePage'];
  activePage: SidebarProps['activePage'];
  isFocused: boolean;
  color?: string;
  colorShadow?: string;
  testId: string;
}

function SidebarItem({ href, icon, label, isFocused: focused, activePage, page, color, colorShadow, testId }: SidebarItemProps) {
  var isActive = activePage === page;
  return (
    <Link href={href}>
      <div
        style={{
          width: '120px',
          height: '100px',
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: focused ? 'rgba(255,65,153,0.25)' : isActive ? 'rgba(255,65,153,0.2)' : 'transparent',
          boxShadow: focused ? '0 0 16px rgba(255,65,153,0.5)' : 'none',
          opacity: focused ? 1 : 0.85,
          transition: 'background-color 0.2s, box-shadow 0.2s, opacity 0.2s',
        }}
        data-testid={testId}
      >
        {color && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: colorShadow || 'none',
              transition: 'opacity 0.2s',
            }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '14px 8px' }}>
          <div style={{ width: '28px', height: '28px', marginBottom: '6px', flexShrink: 0 }}>
            <img
              alt=""
              style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
              src={assetPath(icon)}
            />
          </div>
          <p
            style={{
              fontFamily: "'Ubuntu', Helvetica, sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '1.2',
              width: '104px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: 0,
              padding: 0
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </Link>
  );
}

export const Sidebar = ({ activePage, isFocused, getFocusClasses }: SidebarProps): JSX.Element => {
  const { t } = useLocalization();

  var items = [
    { href: '/discover-no-user', icon: 'images/radio-icon.svg', label: t('nav_discover') || 'Discover', page: 'discover' as const, color: MENU_COLORS.discover, colorShadow: '0 0 8px rgba(255,65,153,0.6)', testId: 'button-discover' },
    { href: '/genres', icon: 'images/music-icon.svg', label: t('nav_genres') || 'Genres', page: 'genres' as const, color: MENU_COLORS.genres, colorShadow: '0 0 8px rgba(16,185,129,0.6)', testId: 'button-genres' },
    { href: '/search', icon: 'images/search-icon.svg', label: t('nav_search') || 'Search', page: 'search' as const, color: MENU_COLORS.search, colorShadow: '0 0 8px rgba(59,130,246,0.6)', testId: 'button-search' },
    { href: '/favorites', icon: 'images/heart-icon.svg', label: t('nav_favorites') || 'Favorites', page: 'favorites' as const, color: MENU_COLORS.favorites, colorShadow: '0 0 8px rgba(251,191,36,0.6)', testId: 'button-favorites' },
    { href: '/country-select', icon: 'images/globe-icon.svg', label: t('nav_country') || 'Country', page: 'country' as const, testId: 'button-country' },
    { href: '/settings', icon: 'images/settings-icon.svg', label: t('nav_settings') || 'Settings', page: 'settings' as const, testId: 'button-settings' },
  ];

  return (
    <div style={{ position: 'fixed', left: '48px', top: '242px', width: '120px', height: '650px', zIndex: 50, pointerEvents: 'auto' }}>
      {items.map(function(item, index) {
        return (
          <div key={item.page} style={{ position: 'absolute', left: 0, top: (index * 108) + 'px' }}>
            <SidebarItem
              href={item.href}
              icon={item.icon}
              label={item.label}
              index={index}
              page={item.page}
              activePage={activePage}
              isFocused={isFocused(index)}
              color={item.color}
              colorShadow={item.colorShadow}
              testId={item.testId}
            />
          </div>
        );
      })}
    </div>
  );
};
