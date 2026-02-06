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

function getProxiedUrl(url: string): string {
  if (!url) return url;
  const isHttpStream = url.startsWith('http://');
  const isPageHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isTizen = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('tizen');
  const isWebOS = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('webos');

  if (isHttpStream && isPageHttps && !isTizen && !isWebOS) {
    return `/api/stream-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function GlobalPlayerProvider({ children }: { children: ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [nowPlayingMetadata, setNowPlayingMetadata] = useState<string | null>(null);
  const audioPlayerRef = useRef<any>(null);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const screenLockActiveRef = useRef(false);
  
  // Error recovery state
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStationRef = useRef<Station | null>(null);

  // Initialize TV audio player once
  useEffect(() => {
    let playerInstance: any = null;
    
    if (typeof (window as any).TVAudioPlayer !== 'undefined' && !audioPlayerRef.current) {
      playerInstance = new (window as any).TVAudioPlayer('global-audio-container');
      audioPlayerRef.current = playerInstance;
      
      playerInstance.onPlay = () => {
        setIsPlaying(true);
        setIsBuffering(false);
        retryCountRef.current = 0;
      };
      
      playerInstance.onPause = () => {
        setIsPlaying(false);
      };
      
      playerInstance.onStop = () => {
        setIsPlaying(false);
      };
      
      playerInstance.onBuffering = () => {
        setIsBuffering(true);
      };
      
      playerInstance.onReady = () => {
        setIsBuffering(false);
      };
      
      playerInstance.onError = (error: any) => {
        setIsBuffering(false);
        trackError(`Audio playback error: ${error?.message || 'Unknown error'}`, 'GlobalPlayer');
        
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        const currentStationToRetry = currentStationRef.current;
        if (currentStationToRetry && retryCountRef.current < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
          
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            
            if (audioPlayerRef.current && currentStationToRetry) {
              const rawUrl = currentStationToRetry.url_resolved || currentStationToRetry.url;
              const playUrl = getProxiedUrl(rawUrl);
              audioPlayerRef.current.play(playUrl);
            }
          }, delay);
        } else if (retryCountRef.current >= maxRetries) {
          setIsPlaying(false);
          retryCountRef.current = 0;
        }
      };

      playerInstance.onMetadata = (metadata: string) => {
        setNowPlayingMetadata(metadata);
      };
    }

    return () => {
      // Clear retry timeout on unmount
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      // Clear event handlers to prevent memory leaks
      if (playerInstance) {
        playerInstance.onPlay = null;
        playerInstance.onPause = null;
        playerInstance.onStop = null;
        playerInstance.onBuffering = null;
        playerInstance.onReady = null;
        playerInstance.onError = null;
        playerInstance.onMetadata = null;
        
        if (typeof playerInstance.stop === 'function') {
          try {
            playerInstance.stop();
          } catch (err) {
            // Silently ignore cleanup errors
          }
        }
      }
      
      audioPlayerRef.current = null;
    };
  }, []);

  // Fetch metadata for current station
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!currentStation?._id || !isPlaying) return;

      try {
        const result = await megaRadioApi.getStationMetadata(currentStation._id);
        if (result?.metadata?.title) {
          setNowPlayingMetadata(result.metadata.title);
        }
      } catch (error) {
        // Metadata fetch failed (non-critical)
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

  // Screensaver prevention - Samsung TV certification requirement
  useEffect(() => {
    const hasTizen = typeof (window as any).tizen !== 'undefined';
    let wakeLock: any = null;
    let releaseHandler: (() => void) | null = null;
    
    if (!hasTizen) {
      // Use Web Wake Lock API for non-Samsung platforms (if supported)
      if ('wakeLock' in navigator && isPlaying) {
        const requestWakeLock = async () => {
          try {
            wakeLock = await (navigator as any).wakeLock.request('screen');
            
            releaseHandler = () => {
            };
            wakeLock.addEventListener('release', releaseHandler);
          } catch (err) {
          }
        };
        
        requestWakeLock();
        
        return () => {
          if (wakeLock) {
            if (releaseHandler) {
              wakeLock.removeEventListener('release', releaseHandler);
            }
            wakeLock.release().catch(() => {});
            wakeLock = null;
          }
        };
      }
      return;
    }
    
    // Samsung Tizen implementation
    if (isPlaying && !screenLockActiveRef.current) {
      try {
        (window as any).tizen.power.request('SCREEN', 'SCREEN_NORMAL');
        screenLockActiveRef.current = true;
      } catch (err) {
        trackError('Failed to request screen lock', 'screensaverPrevention');
      }
    } else if (!isPlaying && screenLockActiveRef.current) {
      try {
        (window as any).tizen.power.release('SCREEN');
        screenLockActiveRef.current = false;
      } catch (err) {
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (screenLockActiveRef.current && hasTizen) {
        try {
          (window as any).tizen.power.release('SCREEN');
          screenLockActiveRef.current = false;
        } catch (err) {
        }
      }
    };
  }, [isPlaying]);

  const playStation = (station: Station) => {
    if (!audioPlayerRef.current) {
      trackError('Audio player not initialized', 'playStation');
      return;
    }

    const rawUrl = station.url_resolved || station.url;
    const playUrl = getProxiedUrl(rawUrl);
    
    setCurrentStation(station);
    currentStationRef.current = station;
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;
    
    audioPlayerRef.current.play(playUrl);

    // Track station play event in Google Analytics
    trackStationPlay(station.name, station.country || '', station.tags?.[0] || '');

    // Save last played station to localStorage
    try {
      localStorage.setItem("lastPlayedStation", JSON.stringify(station));
    } catch (err) {
      trackError('Failed to save station to localStorage', 'playStation');
    }

    // Add to recently played list
    recentlyPlayedService.addStation(station);
  };

  const pauseStation = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  const resumeStation = () => {
    if (audioPlayerRef.current && currentStation) {
      // Use resume() function instead of play() to continue from pause
      if (typeof audioPlayerRef.current.resume === 'function') {
        audioPlayerRef.current.resume();
      } else {
        const rawUrl = currentStation.url_resolved || currentStation.url;
        const playUrl = getProxiedUrl(rawUrl);
        audioPlayerRef.current.play(playUrl);
      }
    }
  };

  const stopStation = () => {
    if (audioPlayerRef.current) {
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
    
    // Cleanup: remove globalPlayer from window on unmount
    return () => {
      if ((window as any).globalPlayer) {
        delete (window as any).globalPlayer;
      }
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
