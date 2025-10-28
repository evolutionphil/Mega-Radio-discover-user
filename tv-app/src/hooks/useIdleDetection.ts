import { useState, useEffect, useCallback } from 'react';

console.log('[useIdleDetection] 🔥 MODULE LOADED');

interface UseIdleDetectionOptions {
  idleTime?: number; // milliseconds (default: 3 minutes)
  onIdle?: () => void;
  onActive?: () => void;
}

/**
 * Hook to detect user inactivity
 * Monitors mouse, keyboard, and remote control events
 * Returns true when user has been idle for specified duration
 */
export function useIdleDetection(options: UseIdleDetectionOptions = {}) {
  const { 
    idleTime = 3 * 60 * 1000, // Default: 3 minutes
    onIdle,
    onActive 
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  console.log('[IdleDetection] Hook initialized with idle time:', idleTime / 1000, 'seconds');

  const resetIdleTimer = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
      console.log('[IdleDetection] User became active');
    }
  }, [isIdle, onActive]);

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'click',
      'scroll',
      // TV remote control events
      'keypress'
    ];

    // Add event listeners (no passive option to allow preventDefault)
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Check idle status every second
    const checkInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      // Debug log every 5 seconds
      if (Math.floor(timeSinceLastActivity / 1000) % 5 === 0) {
        console.log('[IdleDetection] Idle check - Time since last activity:', Math.floor(timeSinceLastActivity / 1000), 's / Target:', idleTime / 1000, 's');
      }
      
      if (timeSinceLastActivity >= idleTime && !isIdle) {
        setIsIdle(true);
        onIdle?.();
        console.log('[IdleDetection] 🌙 SCREENSAVER ACTIVATED - User idle for', idleTime / 1000, 'seconds');
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearInterval(checkInterval);
    };
  }, [lastActivity, idleTime, isIdle, resetIdleTimer, onIdle]);

  return {
    isIdle,
    lastActivity,
    resetIdleTimer
  };
}
