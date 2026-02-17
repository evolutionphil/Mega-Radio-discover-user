import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalPlayer } from '@/contexts/GlobalPlayerContext';
import { castService } from '@/services/castService';
import { Station } from '@/services/megaRadioApi';

interface CastContextType {
  isPaired: boolean;
  isConnected: boolean;
  sessionId: string | null;
  pairWithCode: (code: string) => void;
  disconnectCast: () => void;
  pairingError: string | null;
  isPairing: boolean;
}

var CastContext = createContext<CastContextType | undefined>(undefined);

export function CastProvider({ children }: { children: ReactNode }) {
  var { isAuthenticated, token } = useAuth();
  var { playStation, pauseStation, resumeStation, stopStation, currentStation, isPlaying, nowPlayingMetadata } = useGlobalPlayer();
  var [, setLocation] = useLocation();

  var [isPaired, setIsPaired] = useState(false);
  var [isConnected, setIsConnected] = useState(false);
  var [sessionId, setSessionId] = useState<string | null>(null);
  var [pairingError, setPairingError] = useState<string | null>(null);
  var [isPairing, setIsPairing] = useState(false);

  var playStationRef = useRef(playStation);
  var pauseStationRef = useRef(pauseStation);
  var resumeStationRef = useRef(resumeStation);
  var stopStationRef = useRef(stopStation);
  var setLocationRef = useRef(setLocation);

  useEffect(function() {
    playStationRef.current = playStation;
  }, [playStation]);

  useEffect(function() {
    pauseStationRef.current = pauseStation;
  }, [pauseStation]);

  useEffect(function() {
    resumeStationRef.current = resumeStation;
  }, [resumeStation]);

  useEffect(function() {
    stopStationRef.current = stopStation;
  }, [stopStation]);

  useEffect(function() {
    setLocationRef.current = setLocation;
  }, [setLocation]);

  function handleMessage(msg: any) {
    var msgType = msg && msg.type ? msg.type : '';
    console.log('[Cast] Message received:', msgType, msg);

    switch (msgType) {
      case 'cast:play':
      case 'cast:change_station':
        if (msg.data && msg.data.station) {
          playStationRef.current(msg.data.station as Station);
          setLocationRef.current('/radio-playing');
        }
        break;

      case 'cast:pause':
        pauseStationRef.current();
        break;

      case 'cast:resume':
        resumeStationRef.current();
        break;

      case 'cast:stop':
        stopStationRef.current();
        break;

      case 'cast:volume_up':
      case 'cast:volume_down':
      case 'cast:set_volume':
        console.log('[Cast] Volume command received (TV volume is system-controlled):', msgType);
        break;

      case 'cast:peer_connected':
        console.log('[Cast] Peer connected:', msg);
        break;

      case 'cast:peer_disconnected':
        console.log('[Cast] Peer disconnected:', msg);
        break;

      case 'cast:session_ended':
        console.log('[Cast] Session ended');
        castService.disconnect();
        setIsPaired(false);
        setIsConnected(false);
        setSessionId(null);
        break;

      case 'cast:connected':
        console.log('[Cast] Connected, initial state:', msg);
        break;

      case 'cast:command_ack':
        console.log('[Cast] Command acknowledged:', msg.command);
        break;

      case 'cast:heartbeat_ack':
        break;

      case 'error':
        console.error('[Cast] Error from server:', msg.message);
        break;

      default:
        console.log('[Cast] Unknown message type:', msgType);
        break;
    }
  }

  function handleStatusChange(status: string) {
    console.log('[Cast] Status changed:', status);
    if (status === 'connected') {
      setIsConnected(true);
    } else if (status === 'disconnected') {
      setIsConnected(false);
    }
  }

  function connectCast(sid: string, authToken: string) {
    castService.connect(sid, authToken, handleMessage, handleStatusChange);
    setIsPaired(true);
    setSessionId(sid);
  }

  useEffect(function() {
    console.log('[Cast] Provider mounted. Auth:', isAuthenticated, 'Token:', token ? 'yes' : 'no');
    if (isAuthenticated && token) {
      var savedSessionId = castService.getSavedSessionId();
      if (savedSessionId) {
        console.log('[Cast] Found saved session, auto-connecting:', savedSessionId);
        connectCast(savedSessionId, token);
      } else {
        console.log('[Cast] Authenticated but no saved session. Go to Settings > Cast to pair.');
      }
    } else {
      console.log('[Cast] Not authenticated. Login required for Cast feature.');
    }

    return function() {
      castService.disconnect();
    };
  }, [isAuthenticated, token]);

  useEffect(function() {
    if (!isAuthenticated) {
      castService.disconnect();
      setIsPaired(false);
      setIsConnected(false);
      setSessionId(null);
    }
  }, [isAuthenticated]);

  function pairWithCode(code: string) {
    console.log('[Cast] Pairing code entered:', code);
    setIsPairing(true);
    setPairingError(null);

    castService.pair(code).then(function(result) {
      console.log('[Cast] Pair result:', JSON.stringify(result));
      if (result.success && result.sessionId) {
        console.log('[Cast] Session paired successfully:', result.sessionId);
        if (token) {
          console.log('[Cast] Starting polling for session:', result.sessionId);
          connectCast(result.sessionId, token);
        } else {
          console.warn('[Cast] Paired but no auth token available');
        }
      } else {
        console.warn('[Cast] Pairing failed:', result.error);
        setPairingError(result.error || 'Pairing failed');
      }
      setIsPairing(false);
    }).catch(function(err) {
      console.error('[Cast] Pair error:', err);
      setPairingError('Network error');
      setIsPairing(false);
    });
  }

  function disconnectCast() {
    castService.disconnect();
    setIsPaired(false);
    setIsConnected(false);
    setSessionId(null);
  }

  useEffect(function() {
    if (isConnected && currentStation) {
      var stationName = currentStation.name || '';
      var metadata = nowPlayingMetadata || '';
      var parts = metadata.split(' - ');
      var title = parts.length > 1 ? parts[1] : metadata;
      var artist = parts.length > 1 ? parts[0] : '';

      castService.sendNowPlaying({
        title: title || undefined,
        artist: artist || undefined,
        stationName: stationName || undefined,
        isPlaying: isPlaying
      });
    }
  }, [currentStation, nowPlayingMetadata, isPlaying, isConnected]);

  return (
    <CastContext.Provider value={{
      isPaired: isPaired,
      isConnected: isConnected,
      sessionId: sessionId,
      pairWithCode: pairWithCode,
      disconnectCast: disconnectCast,
      pairingError: pairingError,
      isPairing: isPairing
    }}>
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
