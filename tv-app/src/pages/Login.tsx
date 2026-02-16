import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useFocusManager } from "@/hooks/useFocusManager";
import { usePageKeyHandler } from "@/contexts/FocusRouterContext";
import { assetPath } from "@/lib/assetPath";

export function Login(): JSX.Element {
  var { login, deviceCode, codeExpiresAt, isAuthenticated, isPolling } = useAuth();
  var { t } = useLocalization();
  var [, setLocation] = useLocation();
  var [countdown, setCountdown] = useState('');
  var loginCalledRef = useRef(false);

  var { focusIndex, handleNavigation, handleSelect } = useFocusManager({
    totalItems: 1,
    cols: 1,
    initialIndex: 0,
    onSelect: function() {
      setLocation('/discover-no-user');
    }
  });

  usePageKeyHandler('/login', function(e: KeyboardEvent) {
    var keyCode = e.keyCode || 0;
    switch (keyCode) {
      case 38: // UP
        handleNavigation('UP');
        break;
      case 40: // DOWN
        handleNavigation('DOWN');
        break;
      case 37: // LEFT
        handleNavigation('LEFT');
        break;
      case 39: // RIGHT
        handleNavigation('RIGHT');
        break;
      case 13: // ENTER
        handleSelect();
        break;
      case 10009: // Samsung BACK
      case 461: // LG BACK
      case 8: // Backspace
        setLocation('/');
        break;
    }
  });

  useEffect(function() {
    if (!loginCalledRef.current) {
      loginCalledRef.current = true;
      login();
    }
  }, []);

  useEffect(function() {
    if (isAuthenticated) {
      setLocation('/discover-no-user');
    }
  }, [isAuthenticated]);

  useEffect(function() {
    if (!codeExpiresAt) {
      setCountdown('');
      return;
    }

    function updateCountdown() {
      var now = Date.now();
      var expires = new Date(codeExpiresAt as string).getTime();
      var diff = expires - now;

      if (diff <= 0) {
        setCountdown('00:00');
        return;
      }

      var minutes = Math.floor(diff / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      var mm = minutes < 10 ? '0' + minutes : '' + minutes;
      var ss = seconds < 10 ? '0' + seconds : '' + seconds;
      setCountdown(mm + ':' + ss);
    }

    updateCountdown();
    var intervalId = setInterval(updateCountdown, 1000);
    return function() {
      clearInterval(intervalId);
    };
  }, [codeExpiresAt]);

  var codeChars: string[] = [];
  if (deviceCode) {
    for (var i = 0; i < deviceCode.length; i++) {
      codeChars.push(deviceCode.charAt(i));
    }
  }

  var skipFocused = focusIndex === 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '1920px',
        height: '1080px',
        backgroundColor: '#0e0e0e',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      data-testid="page-login"
    >
      {/* Logo */}
      <div style={{ position: 'relative', width: '195px', height: '68px', marginBottom: '50px' }}>
        <p
          style={{
            position: 'absolute',
            bottom: 0,
            left: '18.67%',
            right: 0,
            top: '46.16%',
            fontFamily: "'Ubuntu', Helvetica",
            fontSize: '32.055px',
            color: '#ffffff',
            lineHeight: 'normal',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}
        >
          <span style={{ fontWeight: 'bold' }}>mega</span>radio
        </p>
        <img
          style={{
            position: 'absolute',
            left: 0,
            bottom: '2.84%',
            width: '34.8%',
            height: '97.16%',
          }}
          alt="Path"
          src={assetPath("images/path-8.svg")}
        />
      </div>

      {/* Instructions */}
      <p
        style={{
          fontFamily: "'Ubuntu', Helvetica",
          fontSize: '28px',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        {t('tv_login_visit') || 'To connect your TV, visit:'}
      </p>

      {/* URL */}
      <p
        style={{
          fontFamily: "'Ubuntu', Helvetica",
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#ff4199',
          textAlign: 'center',
          marginBottom: '12px',
        }}
        data-testid="text-tv-url"
      >
        themegaradio.com/tv
      </p>

      {/* Enter code instruction */}
      <p
        style={{
          fontFamily: "'Ubuntu', Helvetica",
          fontSize: '28px',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        {t('tv_login_enter_code') || 'and enter this code:'}
      </p>

      {/* Code display */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '30px',
        }}
        data-testid="text-device-code"
      >
        {codeChars.length > 0 ? (
          codeChars.map(function(char, idx) {
            return (
              <div
                key={idx}
                style={{
                  width: '100px',
                  height: '120px',
                  borderRadius: '16px',
                  border: '3px solid rgba(255,65,153,0.5)',
                  backgroundColor: 'rgba(255,65,153,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Ubuntu', Helvetica",
                    fontSize: '96px',
                    fontWeight: 'bold',
                    color: '#ff4199',
                    lineHeight: 1,
                  }}
                >
                  {char}
                </span>
              </div>
            );
          })
        ) : (
          <div style={{ display: 'flex', gap: '16px' }}>
            {[0, 1, 2, 3, 4, 5].map(function(idx) {
              return (
                <div
                  key={idx}
                  style={{
                    width: '100px',
                    height: '120px',
                    borderRadius: '16px',
                    border: '3px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Ubuntu', Helvetica",
                      fontSize: '96px',
                      fontWeight: 'bold',
                      color: 'rgba(255,255,255,0.15)',
                      lineHeight: 1,
                    }}
                  >
                    -
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Countdown timer */}
      {countdown && (
        <p
          style={{
            fontFamily: "'Ubuntu', Helvetica",
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
          data-testid="text-countdown"
        >
          {t('tv_login_code_expires') || 'Code expires in:'} {countdown}
        </p>
      )}

      {/* Polling indicator */}
      {isPolling && !countdown && (
        <p
          style={{
            fontFamily: "'Ubuntu', Helvetica",
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          {t('loading') || 'Loading...'}
        </p>
      )}

      {/* Skip button */}
      <button
        onClick={function() { setLocation('/guide-1'); }}
        style={{
          width: '300px',
          height: '64px',
          borderRadius: '32px',
          border: skipFocused ? '3px solid #ff4199' : '3px solid rgba(255,255,255,0.2)',
          backgroundColor: skipFocused ? 'rgba(255,65,153,0.2)' : 'rgba(255,255,255,0.08)',
          color: '#ffffff',
          fontFamily: "'Ubuntu', Helvetica",
          fontSize: '24px',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: skipFocused ? '0 0 20px rgba(255,65,153,0.4)' : 'none',
          transition: 'all 0.2s',
          marginTop: '10px',
        }}
        data-testid="button-skip-login"
      >
        {t('continue_without_login') || 'Skip'}
      </button>
    </div>
  );
}

export { Login as default };
