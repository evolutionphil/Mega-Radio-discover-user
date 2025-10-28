import { createContext, useContext, useEffect, ReactNode, useState, useCallback } from "react";
import { IdleScreensaver } from "@/components/IdleScreensaver";

console.log('[AppLifecycleContext] 🔥 MODULE LOADED WITH IDLE DETECTION');

interface AppLifecycleContextType {
  // Context can be extended later if needed
}

const AppLifecycleContext = createContext<AppLifecycleContextType | undefined>(undefined);

export function AppLifecycleProvider({ children }: { children: ReactNode }) {
  console.log('[AppLifecycleProvider] 🎬 Provider rendering');
  
  // Inline idle detection (10 seconds for testing)
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const idleTime = 10 * 1000; // 10 seconds

  const resetIdleTimer = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    if (isIdle) {
      setIsIdle(false);
      console.log('[AppLifecycle] ⏰ Screensaver deactivated - user active');
    }
  }, [isIdle]);

  // Monitor for idle state
  useEffect(() => {
    console.log('[AppLifecycle] 🔧 Setting up idle detection - timeout:', idleTime / 1000, 'seconds');
    
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'click', 'scroll', 'keypress'];
    
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    const checkInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      if (Math.floor(timeSinceLastActivity / 1000) % 5 === 0) {
        console.log('[AppLifecycle] ⏱️  Idle check - Time:', Math.floor(timeSinceLastActivity / 1000), 's /', idleTime / 1000, 's');
      }
      
      if (timeSinceLastActivity >= idleTime && !isIdle) {
        setIsIdle(true);
        console.log('[AppLifecycle] 🌙 SCREENSAVER ACTIVATED - User idle for', idleTime / 1000, 'seconds');
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearInterval(checkInterval);
    };
  }, [lastActivity, idleTime, isIdle, resetIdleTimer]);
  
  // Handle app visibility changes - Samsung TV certification requirement
  useEffect(() => {
    const hasTizen = typeof (window as any).tizen !== 'undefined';
    
    console.log('[AppLifecycle] Initializing multitasking support');
    console.log('[AppLifecycle] Platform:', hasTizen ? 'Samsung Tizen' : 'Browser');
    
    // Handle visibility change (works on all platforms)
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      
      console.log('[AppLifecycle] Visibility changed:', isHidden ? 'HIDDEN (background)' : 'VISIBLE (foreground)');
      
      if (isHidden) {
        // App went to background - pause audio (Samsung requirement)
        if ((window as any).globalPlayer?.pause) {
          console.log('[AppLifecycle] 🔇 Pausing audio (app in background)');
          (window as any).globalPlayer.pause();
        }
      } else {
        // App came to foreground
        console.log('[AppLifecycle] 🔊 App returned to foreground (user can manually resume playback)');
        // Note: We don't auto-resume to avoid unexpected audio playback
        // User can press play button to resume
      }
    };
    
    // Samsung Tizen app lifecycle events (certification requirement)
    if (hasTizen) {
      const listenerIds: number[] = [];
      
      try {
        // Method 1: webapis.appcommon events (preferred for Samsung TVs)
        if ((window as any).webapis?.appcommon?.addAppEventListener) {
          const handleAppSuspend = () => {
            console.log('[AppLifecycle] 🔴 Samsung APP SUSPEND - pausing audio & releasing screen lock');
            if ((window as any).globalPlayer?.pause) {
              (window as any).globalPlayer.pause();
            }
          };
          
          const handleAppResume = () => {
            console.log('[AppLifecycle] 🟢 Samsung APP RESUME - ready to play');
            // Don't auto-resume - let user manually resume playback
          };
          
          const handleAppHide = () => {
            console.log('[AppLifecycle] 👁️ Samsung APP HIDE - pausing audio & releasing screen lock');
            if ((window as any).globalPlayer?.pause) {
              (window as any).globalPlayer.pause();
            }
          };
          
          const handleAppShow = () => {
            console.log('[AppLifecycle] 👁️ Samsung APP SHOW - visible again');
          };
          
          // Register Samsung lifecycle listeners using correct API (CamelCase event names)
          listenerIds.push((window as any).webapis.appcommon.addAppEventListener('AppSuspend', handleAppSuspend));
          listenerIds.push((window as any).webapis.appcommon.addAppEventListener('AppResume', handleAppResume));
          listenerIds.push((window as any).webapis.appcommon.addAppEventListener('AppHide', handleAppHide));
          listenerIds.push((window as any).webapis.appcommon.addAppEventListener('AppShow', handleAppShow));
          
          console.log('[AppLifecycle] ✅ Samsung webapis.appcommon listeners registered:', listenerIds);
          
          // Store cleanup function
          (window as any).__appLifecycleCleanup = () => {
            listenerIds.forEach(id => {
              try {
                (window as any).webapis.appcommon.removeAppEventListener(id);
              } catch (err) {
                console.warn('[AppLifecycle] Failed to remove listener:', id, err);
              }
            });
          };
        }
        
        // Method 2: Tizen application events (fallback)
        if ((window as any).tizen?.application?.getCurrentApplication) {
          const app = (window as any).tizen.application.getCurrentApplication();
          
          if (app.addEventListener) {
            // Low memory handler
            app.addEventListener('lowmemory', () => {
              console.log('[AppLifecycle] ⚠️ Low memory warning - pausing audio');
              if ((window as any).globalPlayer?.pause) {
                (window as any).globalPlayer.pause();
              }
            });
            
            console.log('[AppLifecycle] ✅ Tizen application listeners registered');
          }
        }
      } catch (err) {
        console.warn('[AppLifecycle] Failed to register Samsung lifecycle events:', err);
      }
    }
    
    // Add visibility change listener (all platforms)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('[AppLifecycle] ✅ Visibility change listener registered');
    
    // Handle page unload
    const handleBeforeUnload = () => {
      console.log('[AppLifecycle] App unloading - cleaning up');
      if ((window as any).globalPlayer?.pause) {
        (window as any).globalPlayer.pause();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Samsung-specific cleanup
      if ((window as any).__appLifecycleCleanup) {
        (window as any).__appLifecycleCleanup();
        delete (window as any).__appLifecycleCleanup;
      }
      
      console.log('[AppLifecycle] 🧹 Cleanup complete');
    };
  }, []);
  
  return (
    <AppLifecycleContext.Provider value={{}}>
      {children}
      {/* Idle Screensaver - Appears after 10 seconds of inactivity */}
      <IdleScreensaver isVisible={isIdle} onInteraction={resetIdleTimer} />
    </AppLifecycleContext.Provider>
  );
}

export function useAppLifecycle() {
  const context = useContext(AppLifecycleContext);
  if (!context) {
    throw new Error("useAppLifecycle must be used within AppLifecycleProvider");
  }
  return context;
}
