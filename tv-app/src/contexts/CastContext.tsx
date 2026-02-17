import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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

  var [isPaired, setIsPaired] = useState(false);
  var [isConnected, setIsConnected] = useState(false);
  var [sessionId, setSessionId] = useState<string | null>(null);
  var [pairingError, setPairingError] = useState<string | null>(null);
  var [isPairing, setIsPairing] = useState(false);

  var playStationRef = useRef(playStation);
  var pauseStationRef = useRef(pauseStation);
  var resumeStationRef = useRef(resumeStation);
  var stopStationRef = useRef(stopStation);

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

  function navigateToRadioPlaying(stationId?: string) {
    try {
      var hash = '#/radio-playing';
      if (stationId) {
        hash = hash + '?station=' + stationId;
      }
      console.log('[Cast] Navigating to:', hash);
      window.location.hash = hash;
    } catch (e) {
      console.error('[Cast] Navigation error:', e);
    }
  }

  function handleMessage(msg: any) {
    var msgType = msg && msg.type ? msg.type : '';
    console.log('[Cast] ====== MESSAGE RECEIVED ======');
    console.log('[Cast] Type:', msgType);
    console.log('[Cast] Data:', JSON.stringify(msg).substring(0, 300));

    switch (msgType) {
      case 'cast:play':
      case 'cast:change_station':
        if (msg.data && msg.data.station) {
          console.log('[Cast] Playing station:', msg.data.station.name || msg.data.station._id);
          playStationRef.current(msg.data.station as Station);
          navigateToRadioPlaying(msg.data.station._id);
        } else {
          console.warn('[Cast] play/change_station but no station data:', JSON.stringify(msg));
        }
        break;

      case 'cast:pause':
        console.log('[Cast] Pausing playback');
        pauseStationRef.current();
        break;

      case 'cast:resume':
        console.log('[Cast] Resuming playback');
        resumeStationRef.current();
        break;

      case 'cast:stop':
        console.log('[Cast] Stopping playback');
        stopStationRef.current();
        break;

      case 'cast:volume_up':
      case 'cast:volume_down':
      case 'cast:set_volume':
        console.log('[Cast] Volume command (TV system-controlled):', msgType);
        break;

      case 'cast:peer_connected':
        console.log('[Cast] Peer connected');
        break;

      case 'cast:peer_disconnected':
        console.log('[Cast] Peer disconnected');
        break;

      case 'cast:session_ended':
        console.log('[Cast] Session ended - clearing');
        castService.fullDisconnect();
        setIsPaired(false);
        setIsConnected(false);
        setSessionId(null);
        break;

      case 'cast:connected':
        console.log('[Cast] Connected initial state');
        break;

      case 'cast:command_ack':
        break;

      case 'cast:heartbeat_ack':
        break;

      case 'error':
        console.error('[Cast] Server error:', msg.message);
        break;

      default:
        console.log('[Cast] Unknown message type:', msgType, '- checking if it has station data');
        if (msg.station && typeof msg.station === 'object' && msg.station._id) {
          console.log('[Cast] Found station in unknown message, playing:', msg.station.name);
          playStationRef.current(msg.station as Station);
          navigateToRadioPlaying(msg.station._id);
        }
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
    console.log('[Cast] connectCast() session=' + sid);
    castService.connect(sid, authToken, handleMessage, handleStatusChange);
    setIsPaired(true);
    setSessionId(sid);
  }

  useEffect(function() {
    console.log('[Cast] ===== Provider mounted =====');
    console.log('[Cast] Auth:', isAuthenticated, 'Token:', token ? 'yes(' + token.substring(0, 8) + '...)' : 'no');

    if (isAuthenticated && token) {
      var savedSessionId = castService.getSavedSessionId();
      console.log('[Cast] Saved session:', savedSessionId || 'NONE');
      if (savedSessionId) {
        console.log('[Cast] Auto-connecting with saved session:', savedSessionId);
        connectCast(savedSessionId, token);
      } else {
        console.log('[Cast] No saved session. Pair via Settings > Cast.');
      }
    } else {
      console.log('[Cast] Not authenticated - cast disabled');
    }

    return function() {
      console.log('[Cast] Effect cleanup - stopPolling (keeping session)');
      castService.stopPolling();
    };
  }, [isAuthenticated, token]);

  useEffect(function() {
    if (!isAuthenticated) {
      console.log('[Cast] Logged out - full disconnect');
      castService.fullDisconnect();
      setIsPaired(false);
      setIsConnected(false);
      setSessionId(null);
    }
  }, [isAuthenticated]);

  function pairWithCode(code: string) {
    console.log('[Cast] Pairing with code:', code);
    setIsPairing(true);
    setPairingError(null);

    castService.pair(code).then(function(result) {
      console.log('[Cast] Pair result:', JSON.stringify(result));
      if (result.success && result.sessionId) {
        console.log('[Cast] Paired! Session:', result.sessionId);
        if (token) {
          connectCast(result.sessionId, token);
        } else {
          console.warn('[Cast] Paired but no auth token');
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
    console.log('[Cast] User disconnecting cast');
    castService.fullDisconnect();
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
