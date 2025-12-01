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
  const screenLockActiveRef = useRef(false);
  const lgVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Error recovery state
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStationRef = useRef<Station | null>(null);

  // Initialize TV audio player once
  useEffect(() => {
    if (typeof (window as any).TVAudioPlayer !== 'undefined' && !audioPlayerRef.current) {
      audioPlayerRef.current = new (window as any).TVAudioPlayer('global-audio-container');
      
      audioPlayerRef.current.onPlay = () => {
        console.log('[GlobalPlayer] Audio playing');
        setIsPlaying(true);
        setIsBuffering(false);
        // Reset retry count on successful play
        retryCountRef.current = 0;
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
        console.log('[GlobalPlayer] ⚠️ Audio error:', error);
        setIsBuffering(false);
        trackError(`Audio playback error: ${error?.message || 'Unknown error'}`, 'GlobalPlayer');
        
        // Clear any pending retries
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        // Retry logic with exponential backoff
        const currentStationToRetry = currentStationRef.current;
        if (currentStationToRetry && retryCountRef.current < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000); // Max 10s
          console.log(`[GlobalPlayer] 🔄 Will retry in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
          
          retryTimeoutRef.current = setTimeout(() => {
            console.log('[GlobalPlayer] 🔄 Retrying playback...');
            retryCountRef.current++;
            
            // Retry by calling play again
            if (audioPlayerRef.current && currentStationToRetry) {
              const playUrl = currentStationToRetry.url_resolved || currentStationToRetry.url;
              console.log('[GlobalPlayer] 🔄 Retry URL:', playUrl);
              audioPlayerRef.current.play(playUrl);
            }
          }, delay);
        } else if (retryCountRef.current >= maxRetries) {
          console.error('[GlobalPlayer] ❌ Max retries reached, stopping playback');
          setIsPlaying(false);
          retryCountRef.current = 0;
        }
      };

      audioPlayerRef.current.onMetadata = (metadata: string) => {
        console.log('[GlobalPlayer] Metadata received:', metadata);
        setNowPlayingMetadata(metadata);
      };
    }

    return () => {
      // Clear retry timeout on unmount
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
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

  // Screensaver prevention - Samsung TV & LG webOS certification requirement
  useEffect(() => {
    const hasTizen = typeof (window as any).tizen !== 'undefined';
    const hasWebOS = typeof (window as any).webOS !== 'undefined';
    
    // LG webOS implementation - use hidden video loop trick
    // Wake Lock API is NOT supported on LG webOS, so we play a 1x1 video
    if (hasWebOS || (!hasTizen && !('wakeLock' in navigator))) {
      console.log('[Screensaver] LG webOS detected - using hidden video trick');
      
      if (isPlaying) {
        // Create hidden video element if not exists
        if (!lgVideoRef.current) {
          const video = document.createElement('video');
          video.id = 'lg-screensaver-prevent';
          video.src = './assets/screensaver-prevent.mp4';
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-9999;';
          document.body.appendChild(video);
          lgVideoRef.current = video;
          console.log('[Screensaver] ✅ LG hidden video element created');
        }
        
        // Play the hidden video
        lgVideoRef.current.play().then(() => {
          console.log('[Screensaver] ✅ LG hidden video playing - screensaver prevented');
        }).catch((err) => {
          console.warn('[Screensaver] LG hidden video play failed:', err);
        });
      } else {
        // Pause the hidden video when audio stops
        if (lgVideoRef.current) {
          lgVideoRef.current.pause();
          console.log('[Screensaver] ✅ LG hidden video paused');
        }
      }
      
      return () => {
        if (lgVideoRef.current) {
          lgVideoRef.current.pause();
          lgVideoRef.current.remove();
          lgVideoRef.current = null;
          console.log('[Screensaver] ✅ LG hidden video removed (cleanup)');
        }
      };
    }
    
    // Non-TV browsers - use Wake Lock API if available
    if (!hasTizen && 'wakeLock' in navigator && isPlaying) {
      let wakeLock: any = null;
      
      const requestWakeLock = async () => {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('[Screensaver] Wake Lock acquired (Web API)');
          
          wakeLock.addEventListener('release', () => {
            console.log('[Screensaver] Wake Lock released (Web API)');
          });
        } catch (err) {
          console.log('[Screensaver] Wake Lock request failed:', err);
        }
      };
      
      requestWakeLock();
      
      return () => {
        if (wakeLock) {
          wakeLock.release();
        }
      };
    }
    
    // Samsung Tizen implementation
    if (hasTizen) {
      if (isPlaying && !screenLockActiveRef.current) {
        try {
          (window as any).tizen.power.request('SCREEN', 'SCREEN_NORMAL');
          screenLockActiveRef.current = true;
          console.log('[Screensaver] ✅ Screen lock requested (Samsung)');
        } catch (err) {
          console.warn('[Screensaver] Failed to request screen lock:', err);
          trackError('Failed to request screen lock', 'screensaverPrevention');
        }
      } else if (!isPlaying && screenLockActiveRef.current) {
        try {
          (window as any).tizen.power.release('SCREEN');
          screenLockActiveRef.current = false;
          console.log('[Screensaver] ✅ Screen lock released (Samsung)');
        } catch (err) {
          console.warn('[Screensaver] Failed to release screen lock:', err);
        }
      }
      
      // Cleanup on unmount
      return () => {
        if (screenLockActiveRef.current) {
          try {
            (window as any).tizen.power.release('SCREEN');
            screenLockActiveRef.current = false;
            console.log('[Screensaver] ✅ Screen lock released (cleanup)');
          } catch (err) {
            console.warn('[Screensaver] Cleanup failed:', err);
          }
        }
      };
    }
  }, [isPlaying]);

  const playStation = (station: Station) => {
    if (!audioPlayerRef.current) {
      console.warn('[GlobalPlayer] Audio player not initialized');
      trackError('Audio player not initialized', 'playStation');
      return;
    }

    const playUrl = station.url_resolved || station.url;
    console.log('[GlobalPlayer] Playing station:', station.name, 'URL:', playUrl);
    
    // Update both state and ref for retry logic
    setCurrentStation(station);
    currentStationRef.current = station;
    
    // Clear any pending retries when starting a new station
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;
    
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
      console.log('[GlobalPlayer] Resuming:', currentStation.name);
      // Use resume() function instead of play() to continue from pause
      if (typeof audioPlayerRef.current.resume === 'function') {
        audioPlayerRef.current.resume();
      } else {
        // Fallback for older implementations
        const playUrl = currentStation.url_resolved || currentStation.url;
        audioPlayerRef.current.play(playUrl);
      }
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
