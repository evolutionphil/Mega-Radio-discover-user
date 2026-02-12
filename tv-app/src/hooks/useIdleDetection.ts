import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIdleDetectionOptions {
  idleTime?: number;
  onIdle?: () => void;
  onActive?: () => void;
}

export function useIdleDetection(options: UseIdleDetectionOptions = {}) {
  const { 
    idleTime = 3 * 60 * 1000,
    onIdle,
    onActive 
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const isIdleRef = useRef(false);
  const onIdleRef = useRef(onIdle);
  const onActiveRef = useRef(onActive);
  const idleTimeRef = useRef(idleTime);

  onIdleRef.current = onIdle;
  onActiveRef.current = onActive;
  idleTimeRef.current = idleTime;

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      onActiveRef.current?.();
    }
  }, []);

  useEffect(() => {
    const events = ['keydown', 'keypress', 'mousedown', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      
      if (elapsed >= idleTimeRef.current && !isIdleRef.current) {
        isIdleRef.current = true;
        setIsIdle(true);
        onIdleRef.current?.();
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearInterval(checkInterval);
    };
  }, [resetIdleTimer]);

  return {
    isIdle,
    lastActivity: lastActivityRef.current,
    resetIdleTimer
  };
}
