import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Station, megaRadioApi } from "@/services/megaRadioApi";
import { recentlyPlayedService } from "@/services/recentlyPlayedService";
import { trackStationPlay, trackError } from "@/lib/analytics";

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
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType | undefined>(undefined);

export function GlobalPlayerProvider({ children }: { children: ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [nowPlayingMetadata, setNowPlayingMetadata] = useState<string | null>(null);
  const audioPlayerRef = useRef<any>(null);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch metadata for current station
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!currentStation?._id || !isPlaying) return;

      try {
        const result = await megaRadioApi.getStationMetadata(currentStation._id);
        if (result?.metadata?.title) {
          console.log('[GlobalPlayer] Metadata fetched:', result.metadata.title);
          setNowPlayingMetadata(result.metadata.title);
        }
      } catch (error) {
        console.log('[GlobalPlayer] Metadata fetch failed (non-critical):', error);
      }
    };

    // Clear previous interval
    if (metadataIntervalRef.current) {
      clearInterval(metadataIntervalRef.current);
    }

    // Fetch immediately and then every 30 seconds
    if (currentStation && isPlaying) {
      fetchMetadata();
      metadataIntervalRef.current = setInterval(fetchMetadata, 30000);
    } else {
      setNowPlayingMetadata(null);
    }

    // Cleanup on unmount or station change
    return () => {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
      }
    };
  }, [currentStation, isPlaying]);

  const playStation = (station: Station) => {
    if (!audioPlayerRef.current) {
      console.warn('[GlobalPlayer] Audio player not initialized');
      trackError('Audio player not initialized', 'playStation');
      return;
    }

    const playUrl = station.url_resolved || station.url;
    console.log('[GlobalPlayer] Playing station:', station.name, 'URL:', playUrl);
    
    setCurrentStation(station);
    audioPlayerRef.current.play(playUrl);

    // Track station play event in Google Analytics
    trackStationPlay(station.name, station.country, station.tags?.[0]);

    // Save last played station to localStorage
    try {
      localStorage.setItem("lastPlayedStation", JSON.stringify(station));
      console.log('[GlobalPlayer] Saved last played station to localStorage');
    } catch (err) {
      console.warn('[GlobalPlayer] Failed to save station to localStorage:', err);
      trackError('Failed to save station to localStorage', 'playStation');
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
