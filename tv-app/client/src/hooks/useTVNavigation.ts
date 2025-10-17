import { useEffect } from 'react';

export function useTVNavigation() {
  useEffect(() => {
    // Wait for TV platform scripts to load
    const initNavigation = () => {
      if (window.tvSpatialNav && window.platformInfo?.isTV()) {
        // Update focusable elements
        window.tvSpatialNav.updateFocusableElements();
        
        // Focus first element if nothing is focused
        if (!window.tvSpatialNav.focusedElement && window.tvSpatialNav.focusableElements.length > 0) {
          window.tvSpatialNav.focus(window.tvSpatialNav.focusableElements[0]);
        }
      }
    };

    // Mouse hover handler - update TV focus on hover
    const handleMouseOver = (e: MouseEvent) => {
      if (window.tvSpatialNav && window.platformInfo?.isTV()) {
        window.tvSpatialNav.handleMouseOver(e);
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

    // Add mouse hover listener
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
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
