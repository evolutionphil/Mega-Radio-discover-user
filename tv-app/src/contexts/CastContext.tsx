import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalPlayer } from '@/contexts/GlobalPlayerContext';
import { castService } from '@/services/castService';
import { Station } from '@/services/megaRadioApi';

interface CastContextType {
  isListening: boolean;
}

var CastContext = createContext<CastContextType | undefined>(undefined);

export function CastProvider({ children }: { children: ReactNode }) {
  var { isAuthenticated, token } = useAuth();
  var { playStation } = useGlobalPlayer();
  var [, setLocation] = useLocation();
  var playStationRef = useRef(playStation);
  var setLocationRef = useRef(setLocation);

  useEffect(function() {
    playStationRef.current = playStation;
  }, [playStation]);

  useEffect(function() {
    setLocationRef.current = setLocation;
  }, [setLocation]);

  useEffect(function() {
    if (isAuthenticated && token) {
      castService.start(token, function(station: Station) {
        playStationRef.current(station);
        setLocationRef.current('/radio-playing');
      });
    } else {
      castService.stop();
    }

    return function() {
      castService.stop();
    };
  }, [isAuthenticated, token]);

  return (
    <CastContext.Provider value={{ isListening: castService.isListening() }}>
      {children}
    </CastContext.Provider>
  );
}

export function useCast() {
  var context = useContext(CastContext);
  if (!context) {
    throw new Error('useCast must be used within CastProvider');
  }
  return context;
}
