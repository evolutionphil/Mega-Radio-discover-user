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

    // Mouse hover handler - update TV focus on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the element is focusable
      if (window.tvNavigation && window.platformInfo?.isTV()) {
        const isFocusable = 
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.hasAttribute('data-tv-focusable') ||
          (target.hasAttribute('tabindex') && target.getAttribute('tabindex') !== '-1');
        
        if (isFocusable && window.tvNavigation.focusableElements.includes(target)) {
          window.tvNavigation.focus(target);
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
