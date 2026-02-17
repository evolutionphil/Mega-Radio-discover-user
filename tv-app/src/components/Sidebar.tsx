import { Link } from "wouter";
import { useState } from "react";
import { assetPath } from "@/lib/assetPath";
import { useLocalization } from "@/contexts/LocalizationContext";

interface SidebarProps {
  activePage: 'discover' | 'genres' | 'search' | 'favorites' | 'settings' | 'country';
  isFocused: (index: number) => boolean;
  getFocusClasses: (focused: boolean) => string;
}

interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  index: number;
  page: SidebarProps['activePage'];
  activePage: SidebarProps['activePage'];
  isFocused: boolean;
  testId: string;
}

function SidebarItem({ href, icon, label, isFocused: focused, activePage, page, testId }: SidebarItemProps) {
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

var REMOTE_COLORS = [
  { color: '#e74c3c', label: 'Red', key: 'help_red', fallback: 'Add to Favorites' },
  { color: '#27ae60', label: 'Green', key: 'help_green', fallback: 'Play / Pause' },
  { color: '#f1c40f', label: 'Yellow', key: 'help_yellow', fallback: 'Open Search' },
  { color: '#3498db', label: 'Blue', key: 'help_blue', fallback: 'Change Country' },
];

export const Sidebar = ({ activePage, isFocused, getFocusClasses }: SidebarProps): JSX.Element => {
  const { t } = useLocalization();
  const [showHelp, setShowHelp] = useState(false);

  var items = [
    { href: '/discover-no-user', icon: 'images/radio-icon.svg', label: t('nav_discover') || 'Discover', page: 'discover' as const, testId: 'button-discover' },
    { href: '/genres', icon: 'images/music-icon.svg', label: t('nav_genres') || 'Genres', page: 'genres' as const, testId: 'button-genres' },
    { href: '/search', icon: 'images/search-icon.svg', label: t('nav_search') || 'Search', page: 'search' as const, testId: 'button-search' },
    { href: '/favorites', icon: 'images/heart-icon.svg', label: t('nav_favorites') || 'Favorites', page: 'favorites' as const, testId: 'button-favorites' },
    { href: '/country-select', icon: 'images/globe-icon.svg', label: t('nav_country') || 'Country', page: 'country' as const, testId: 'button-country' },
    { href: '/settings', icon: 'images/settings-icon.svg', label: t('nav_settings') || 'Settings', page: 'settings' as const, testId: 'button-settings' },
  ];

  var helpIndex = items.length;

  return (
    <div style={{ position: 'fixed', left: '48px', top: '242px', width: '120px', height: '750px', zIndex: 50, pointerEvents: 'auto' }}>
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
              testId={item.testId}
            />
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: 0, top: (helpIndex * 108) + 'px' }}>
        <div
          tabIndex={0}
          onClick={function() { setShowHelp(true); }}
          onKeyDown={function(e: any) { if (e.key === 'Enter' || e.keyCode === 13) { setShowHelp(true); } }}
          style={{
            width: '120px',
            height: '100px',
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: isFocused(helpIndex) ? 'rgba(255,65,153,0.25)' : 'transparent',
            boxShadow: isFocused(helpIndex) ? '0 0 16px rgba(255,65,153,0.5)' : 'none',
            opacity: isFocused(helpIndex) ? 1 : 0.85,
            transition: 'background-color 0.2s, box-shadow 0.2s, opacity 0.2s',
            cursor: 'pointer',
          }}
          data-testid="button-help"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '14px 8px' }}>
            <div style={{ width: '28px', height: '28px', marginBottom: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
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
              {t('nav_help') || 'Help'}
            </p>
          </div>
        </div>
      </div>

      {showHelp && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '1920px',
            height: '1080px',
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={function() { setShowHelp(false); }}
          onKeyDown={function(e: any) { if (e.key === 'Escape' || e.keyCode === 27 || e.key === 'Enter' || e.keyCode === 13 || e.key === 'Return' || e.keyCode === 10009) { setShowHelp(false); } }}
          data-testid="modal-help"
        >
          <div
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '20px',
              padding: '48px 56px',
              minWidth: '520px',
              maxWidth: '640px',
              border: '2px solid rgba(255,65,153,0.3)',
              boxShadow: '0 0 40px rgba(255,65,153,0.15)',
            }}
            onClick={function(e: any) { e.stopPropagation(); }}
          >
            <h2 style={{
              fontFamily: "'Ubuntu', Helvetica, sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              {t('help_title') || 'Remote Control Colors'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {REMOTE_COLORS.map(function(item) {
                return (
                  <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      boxShadow: '0 0 12px ' + item.color + '80',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Ubuntu', Helvetica, sans-serif",
                      fontSize: '24px',
                      fontWeight: 500,
                      color: '#e0e0e0',
                    }}>
                      {t(item.key) || item.fallback}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '36px', textAlign: 'center' }}>
              <button
                tabIndex={0}
                autoFocus
                onClick={function() { setShowHelp(false); }}
                onKeyDown={function(e: any) { if (e.key === 'Enter' || e.keyCode === 13) { setShowHelp(false); } }}
                style={{
                  fontFamily: "'Ubuntu', Helvetica, sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: 'rgba(255,65,153,0.3)',
                  border: '2px solid rgba(255,65,153,0.5)',
                  borderRadius: '12px',
                  padding: '12px 48px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                data-testid="button-help-close"
              >
                {t('btn_close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
