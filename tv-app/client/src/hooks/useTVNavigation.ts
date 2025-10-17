import { useEffect } from 'react';

export function useTVNavigation() {
  useEffect(() => {
    // Wait for TV platform scripts to load
    const initNavigation = () => {
      if (window.tvNavigation && window.platformInfo?.isTV()) {
        // Update focusable elements
        window.tvNavigation.updateFocusableElements();
        
        // Focus first element if nothing is focused
        if (!window.tvNavigation.currentFocusedElement && window.tvNavigation.focusableElements.length > 0) {
          window.tvNavigation.focus(window.tvNavigation.focusableElements[0]);
        }
      }
    };

    // Run after component mounts and DOM updates
    setTimeout(initNavigation, 100);

    // Update on any changes (route changes, etc.)
    const observer = new MutationObserver(() => {
      setTimeout(initNavigation, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
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
