import { createContext, useContext, useEffect, ReactNode } from "react";

interface AppLifecycleContextType {
  // Context can be extended later if needed
}

const AppLifecycleContext = createContext<AppLifecycleContextType | undefined>(undefined);

export function AppLifecycleProvider({ children }: { children: ReactNode }) {
  
  // Handle app visibility changes - Samsung TV certification requirement
  useEffect(() => {
    const hasTizen = typeof (window as any).tizen !== 'undefined';
    
    console.log('[AppLifecycle] Initializing multitasking support');
    console.log('[AppLifecycle] Platform:', hasTizen ? 'Samsung Tizen' : 'Browser');
    
    let visibilityTimeout: NodeJS.Timeout | null = null;
    
    // Handle visibility change (Samsung TV only - browser has issues with SPA navigation)
    const handleVisibilityChange = () => {
      // IMPORTANT: Only use visibility change on actual Samsung TV
      // In browser/emulator, hash changes cause false visibility changes
      if (!hasTizen) {
        console.log('[AppLifecycle] Ignoring visibility change (not on Samsung TV)');
        return;
      }
      
      const isHidden = document.hidden;
      
      console.log('[AppLifecycle] Visibility changed:', isHidden ? 'HIDDEN (background)' : 'VISIBLE (foreground)');
      
      // Clear any pending timeout
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = null;
      }
      
      if (isHidden) {
        // On real Samsung TV, pause immediately (no delay needed)
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
    
    // Note: We don't use 'beforeunload' event because:
    // 1. In SPAs, it can fire during route changes (causing unwanted pauses)
    // 2. Samsung TV lifecycle events (AppSuspend, AppHide) handle app closing
    // 3. Visibility change events catch background transitions
    
    // Cleanup
    return () => {
      // Clear visibility timeout if pending
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
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
