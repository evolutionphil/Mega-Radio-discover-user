import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Sidebar } from "@/components/Sidebar";
import { assetPath } from "@/lib/assetPath";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type FocusZone = 'sidebar' | 'content';

export const Cast = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { t } = useLocalization();
  const [code, setCode] = useState(() => generateCode());
  const [focusZone, setFocusZone] = useState<FocusZone>('content');
  const [sidebarIndex, setSidebarIndex] = useState(0);

  const sidebarRoutes = ['/cast', '/discover-no-user', '/genres', '/search', '/favorites', '/country-select', '/settings'];

  const isFocused = (idx: number) => focusZone === 'sidebar' && sidebarIndex === idx;
  const getFocusClasses = (_focused: boolean) => '';

  const handleNewCode = useCallback(() => {
    setCode(generateCode());
  }, []);

  usePageKeyHandler('/cast', (e) => {
    const key = (window as any).tvKey;
    const keyCode = e.keyCode;
    const isUp = keyCode === 38 || keyCode === key?.UP;
    const isDown = keyCode === 40 || keyCode === key?.DOWN;
    const isLeft = keyCode === 37 || keyCode === key?.LEFT;
    const isRight = keyCode === 39 || keyCode === key?.RIGHT;
    const isEnter = keyCode === 13 || keyCode === key?.ENTER;
    const isBack = keyCode === 461 || keyCode === 10009 || keyCode === key?.RETURN;

    if (isBack) {
      e.preventDefault();
      window.location.hash = '#/discover-no-user';
      return;
    }

    if (focusZone === 'sidebar') {
      if (isUp) {
        e.preventDefault();
        setSidebarIndex(prev => Math.max(0, prev - 1));
      } else if (isDown) {
        e.preventDefault();
        setSidebarIndex(prev => Math.min(6, prev + 1));
      } else if (isRight) {
        e.preventDefault();
        setFocusZone('content');
      } else if (isEnter) {
        e.preventDefault();
        const route = sidebarRoutes[sidebarIndex];
        if (route && route !== '/cast') {
          window.location.hash = '#' + route;
        } else {
          setFocusZone('content');
        }
      }
      return;
    }

    if (focusZone === 'content') {
      if (isLeft) {
        e.preventDefault();
        setFocusZone('sidebar');
      } else if (isEnter) {
        e.preventDefault();
        handleNewCode();
      }
      return;
    }
  });

  const digits = code.split('');
  const isContentFocused = focusZone === 'content';

  return (
    <div style={{ position: 'absolute', inset: 0, width: '1920px', height: '1080px', overflow: 'hidden', backgroundColor: '#0e0e0e' }} data-testid="page-cast">
      <div style={{ position: 'absolute', left: '30px', top: '64px', width: '164.421px', height: '57px' }}>
        <p style={{ position: 'absolute', bottom: 0, left: '18.67%', right: 0, top: '46.16%', fontFamily: "'Ubuntu', Helvetica, sans-serif", fontSize: '27.029px', color: 'white', lineHeight: 'normal', whiteSpace: 'pre-wrap', margin: 0 }}>
          <span style={{ fontWeight: 'bold' }}>mega</span>radio
        </p>
        <img
          alt="Path"
          style={{ position: 'absolute', left: 0, bottom: '2.84%', width: '34.8%', height: '97.16%', display: 'block', maxWidth: 'none' }}
          src={assetPath("images/path-8.svg")}
        />
      </div>

      <Sidebar activePage="cast" isFocused={isFocused} getFocusClasses={getFocusClasses} />

      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-30%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            alt=""
            src={assetPath("images/cast-icon.svg")}
            style={{ width: '56px', height: '56px', display: 'block', maxWidth: 'none', opacity: 0.9 }}
          />
        </div>

        <p style={{
          fontFamily: "'Ubuntu', Helvetica, sans-serif",
          fontSize: '36px',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          margin: 0,
        }}>
          {t('cast_connect_tv') || "TV'yi Bağla"}
        </p>

        <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }} data-testid="text-cast-code">
          {digits.map((digit, i) => (
            <div key={i} style={{
              width: '80px',
              height: '100px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 65, 153, 0.12)',
              border: '2px solid rgba(255, 65, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Ubuntu', Helvetica, sans-serif",
                fontSize: '72px',
                fontWeight: 700,
                color: '#ff4199',
                lineHeight: 1,
              }}>
                {digit}
              </span>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'Ubuntu', Helvetica, sans-serif",
          fontSize: '22px',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          margin: 0,
          marginTop: '8px',
          maxWidth: '500px',
        }}>
          {t('cast_enter_code') || 'Mobil uygulamanızdan bu kodu girin'}
        </p>

        <div
          style={{
            marginTop: '24px',
            padding: '14px 40px',
            borderRadius: '30px',
            backgroundColor: isContentFocused ? '#ff4199' : 'rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            transition: 'background-color 0.2s, box-shadow 0.2s',
            boxShadow: isContentFocused ? '0 0 20px rgba(255, 65, 153, 0.5)' : 'none',
            border: isContentFocused ? '2px solid #ff4199' : '2px solid transparent',
          }}
          onClick={handleNewCode}
          data-testid="button-new-code"
        >
          <p style={{
            fontFamily: "'Ubuntu', Helvetica, sans-serif",
            fontSize: '22px',
            fontWeight: 600,
            color: '#ffffff',
            margin: 0,
            textAlign: 'center',
          }}>
            ⟳ {t('cast_new_code') || 'Yeni Kod Al'}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '16px',
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#8b5cf6',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <p style={{
            fontFamily: "'Ubuntu', Helvetica, sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.4)',
            margin: 0,
          }}>
            {t('cast_waiting') || 'Bekleniyor...'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
