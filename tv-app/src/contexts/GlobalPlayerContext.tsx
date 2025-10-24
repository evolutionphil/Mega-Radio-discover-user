import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Station } from "@/services/megaRadioApi";
import { recentlyPlayedService } from "@/services/recentlyPlayedService";

interface GlobalPlayerContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  isBuffering: boolean;
  nowPlayingMetadata: string | null;
  playStation: (station: Station) => void;
  pauseStation: () => void;
  resumeStation: () => void;
  stopStation: () => void;
  togglePlayPause: () => void;
  globalPlayerFocusIndex: number;
  setGlobalPlayerFocusIndex: (index: number) => void;
  focusGlobalPlayer: () => void;
  isGlobalPlayerFocused: boolean;
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType | undefined>(undefined);

export function GlobalPlayerProvider({ children }: { children: ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [nowPlayingMetadata, setNowPlayingMetadata] = useState<string | null>(null);
  const audioPlayerRef = useRef<any>(null);
  
  // Focus management for GlobalPlayer
  const [globalPlayerFocusIndex, setGlobalPlayerFocusIndex] = useState(-1); // -1 means not focused
  const [isGlobalPlayerFocused, setIsGlobalPlayerFocused] = useState(false);

  // Initialize TV audio player once
  useEffect(() => {
    if (typeof (window as any).TVAudioPlayer !== 'undefined' && !audioPlayerRef.current) {
      audioPlayerRef.current = new (window as any).TVAudioPlayer('global-audio-container');
      
      audioPlayerRef.current.onPlay = () => {
        console.log('[GlobalPlayer] Audio playing');
        setIsPlaying(true);
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onPause = () => {
        console.log('[GlobalPlayer] Audio paused');
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onStop = () => {
        console.log('[GlobalPlayer] Audio stopped');
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onBuffering = () => {
        console.log('[GlobalPlayer] Audio buffering');
        setIsBuffering(true);
      };
      
      audioPlayerRef.current.onReady = () => {
        console.log('[GlobalPlayer] Audio ready');
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onError = (error: any) => {
        console.log('[GlobalPlayer] Audio error (non-critical):', error);
        setIsBuffering(false);
      };

      audioPlayerRef.current.onMetadata = (metadata: string) => {
        console.log('[GlobalPlayer] Metadata received:', metadata);
        setNowPlayingMetadata(metadata);
      };
    }

    return () => {
      if (audioPlayerRef.current && typeof audioPlayerRef.current.stop === 'function') {
        try {
          audioPlayerRef.current.stop();
        } catch (err) {
          // Silently ignore cleanup errors
        }
      }
    };
  }, []);

  const playStation = (station: Station) => {
    if (!audioPlayerRef.current) {
      console.warn('[GlobalPlayer] Audio player not initialized');
      return;
    }

    const playUrl = station.url_resolved || station.url;
    console.log('[GlobalPlayer] Playing station:', station.name, 'URL:', playUrl);
    
    setCurrentStation(station);
    audioPlayerRef.current.play(playUrl);

    // Save last played station to localStorage
    try {
      localStorage.setItem("lastPlayedStation", JSON.stringify(station));
      console.log('[GlobalPlayer] Saved last played station to localStorage');
    } catch (err) {
      console.warn('[GlobalPlayer] Failed to save station to localStorage:', err);
    }

    // Add to recently played list
    recentlyPlayedService.addStation(station);
  };

  const pauseStation = () => {
    if (audioPlayerRef.current) {
      console.log('[GlobalPlayer] Pausing');
      audioPlayerRef.current.pause();
    }
  };

  const resumeStation = () => {
    if (audioPlayerRef.current && currentStation) {
      const playUrl = currentStation.url_resolved || currentStation.url;
      console.log('[GlobalPlayer] Resuming:', currentStation.name);
      audioPlayerRef.current.play(playUrl);
    }
  };

  const stopStation = () => {
    if (audioPlayerRef.current) {
      console.log('[GlobalPlayer] Stopping');
      audioPlayerRef.current.stop();
      setCurrentStation(null);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseStation();
    } else {
      resumeStation();
    }
  };

  // Focus the GlobalPlayer (jump to play/pause button - index 1)
  const focusGlobalPlayer = () => {
    console.log('[GlobalPlayerContext] Focusing GlobalPlayer at play button (index 1)');
    setGlobalPlayerFocusIndex(1); // Index 1 is the play/pause button
    setIsGlobalPlayerFocused(true);
  };

  // Expose player controls to window for TV remote media buttons
  useEffect(() => {
    (window as any).globalPlayer = {
      togglePlayPause,
      pause: pauseStation,
      resume: resumeStation,
      stop: stopStation,
      isPlaying,
      currentStation,
    };
  }, [isPlaying, currentStation]);

  return (
    <GlobalPlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        isBuffering,
        nowPlayingMetadata,
        playStation,
        pauseStation,
        resumeStation,
        stopStation,
        togglePlayPause,
        globalPlayerFocusIndex,
        setGlobalPlayerFocusIndex,
        focusGlobalPlayer,
        isGlobalPlayerFocused,
      }}
    >
      {/* Hidden audio container */}
      <div id="global-audio-container" style={{ display: 'none' }} />
      {children}
    </GlobalPlayerContext.Provider>
  );
}

export function useGlobalPlayer() {
  const context = useContext(GlobalPlayerContext);
  if (!context) {
    throw new Error("useGlobalPlayer must be used within a GlobalPlayerProvider");
  }
  return context;
}
