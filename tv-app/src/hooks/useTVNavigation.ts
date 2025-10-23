import { useEffect } from 'react';

export function useTVNavigation() {
  useEffect(() => {
    let initialized = false;
    
    // Wait for TV platform scripts to load
    const initNavigation = () => {
      // Check if TV scripts are loaded
      if (!window.tvSpatialNav || !window.platformInfo) {
        console.log('[useTVNavigation] TV scripts not loaded yet, retrying...');
        return false;
      }
      
      // Allow TV navigation on all platforms for testing
      // if (!window.platformInfo.isTV()) {
      //   console.log('[useTVNavigation] Not a TV platform, skipping TV navigation');
      //   return true;
      // }
      
      console.log('[useTVNavigation] Initializing TV navigation...');
      
      // Update focusable elements
      window.tvSpatialNav.updateFocusableElements();
      
      // Check if focused element still exists in DOM
      const focusedStillExists = window.tvSpatialNav.focusedElement && 
                                 document.body.contains(window.tvSpatialNav.focusedElement);
      
      // Focus first element if nothing is focused OR focused element is gone
      if ((!focusedStillExists || !window.tvSpatialNav.focusedElement) && window.tvSpatialNav.focusableElements.length > 0) {
        console.log('[useTVNavigation] Initializing focus (focused element exists in DOM:', focusedStillExists, ')');
        window.tvSpatialNav.init(); // Use init which has smart focus logic
        initialized = true;
      }
      
      return true;
    };

    // Mouse hover handler - update TV focus on hover
    const handleMouseOver = (e: MouseEvent) => {
      if (window.tvSpatialNav) {
        window.tvSpatialNav.handleMouseOver(e);
      }
    };

    // Retry initialization until TV scripts are loaded (max 5 seconds)
    let retryCount = 0;
    const maxRetries = 50;
    const retryInterval = setInterval(() => {
      if (initNavigation() || retryCount >= maxRetries) {
        clearInterval(retryInterval);
        console.log('[useTVNavigation] Initialization complete');
      }
      retryCount++;
    }, 100);

    // Update on any changes (route changes, etc.)
    const observer = new MutationObserver(() => {
      if (window.tvSpatialNav) {
        // Debounce updates to avoid excessive re-scans
        setTimeout(() => {
          const previousCount = window.tvSpatialNav.focusableElements.length;
          window.tvSpatialNav.updateFocusableElements();
          const newCount = window.tvSpatialNav.focusableElements.length;
          
          if (newCount !== previousCount) {
            console.log('[useTVNavigation] Element count changed:', previousCount, '->', newCount);
          }
          
          // Check if focused element still exists in DOM
          const focusedStillExists = window.tvSpatialNav.focusedElement && 
                                     document.body.contains(window.tvSpatialNav.focusedElement);
          
          // Re-focus if focus was lost or focused element is no longer in DOM
          if ((!focusedStillExists || !window.tvSpatialNav.focusedElement) && window.tvSpatialNav.focusableElements.length > 0) {
            console.log('[useTVNavigation] Re-initializing focus (focused element in DOM:', focusedStillExists, ')');
            window.tvSpatialNav.init();
            initialized = true;
          }
        }, 500); // Longer delay for React rendering
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Add mouse hover listener
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      clearInterval(retryInterval);
      observer.disconnect();
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
}

// Global type declarations for TV APIs
declare global {
  interface Window {
    platform: 'samsung' | 'lg' | 'web';
    platformInfo: {
      isLG: () => boolean;
      isSamsung: () => boolean;
      isTV: () => boolean;
      isWeb: () => boolean;
      getPlatform: () => string;
    };
    tvSpatialNav: {
      focusedElement: HTMLElement | null;
      focusableElements: HTMLElement[];
      init: () => void;
      updateFocusableElements: () => void;
      focus: (element: HTMLElement | null) => void;
      navigate: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
      select: () => void;
      handleMouseOver: (e: MouseEvent) => void;
    };
    tvNavigation: {
      currentFocusedElement: HTMLElement | null;
      focusableElements: HTMLElement[];
      init: () => void;
      updateFocusableElements: () => void;
      focus: (element: HTMLElement | null) => void;
      navigate: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
      select: () => void;
    };
    tvKey: Record<string, number>;
    handleTVKey: (e: KeyboardEvent) => boolean;
  }
}
