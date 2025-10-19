import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'wouter';

/**
 * FocusRouter Context - Simple LGTV-style key routing
 * 
 * Matches LGTV reference pattern:
 * - ONE global keydown listener
 * - Routes to page-specific HandleKey(e) functions
 * - No complex spatial navigation library
 * - Pages register/unregister their handlers
 */

type KeyHandler = (e: KeyboardEvent) => void;

interface FocusRouterContextValue {
  registerHandler: (route: string, handler: KeyHandler) => void;
  unregisterHandler: (route: string) => void;
  dispatch: (e: KeyboardEvent) => void;
}

const FocusRouterContext = createContext<FocusRouterContextValue | null>(null);

export function FocusRouterProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef<Map<string, KeyHandler>>(new Map());
  const [location] = useLocation();

  // Register a handler for a specific route
  const registerHandler = (route: string, handler: KeyHandler) => {
    console.log('[FocusRouter] Registering handler for route:', route);
    handlersRef.current.set(route, handler);
  };

  // Unregister a handler for a specific route
  const unregisterHandler = (route: string) => {
    console.log('[FocusRouter] Unregistering handler for route:', route);
    handlersRef.current.delete(route);
  };

  // Dispatch key event to the handler for current route
  const dispatch = (e: KeyboardEvent) => {
    let currentRoute = location;
    
    // Samsung TV fix: Handle /index.html route
    if (currentRoute === '/index.html' || currentRoute === '/') {
      currentRoute = '/guide-1'; // Default to guide-1 for root/index
    }
    
    const handler = handlersRef.current.get(currentRoute);
    
    console.log('[FocusRouter] ⌨️  Key event received:', {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      originalLocation: location,
      currentRoute,
      hasHandler: !!handler,
      registeredRoutes: Array.from(handlersRef.current.keys())
    });
    
    if (handler) {
      // Route found, call page-specific handler
      console.log('[FocusRouter] ✅ Dispatching to route handler:', currentRoute);
      handler(e);
    } else {
      // No handler registered - only warn if it's not a common unregistered route
      if (!currentRoute.includes('/index.html') && currentRoute !== '/') {
        console.log('[FocusRouter] No handler for route:', currentRoute, {
          availableRoutes: Array.from(handlersRef.current.keys())
        });
      }
    }
  };

  // Expose dispatch to window for tv-remote-keys.js integration
  useEffect(() => {
    (window as any).focusRouterDispatch = dispatch;
    console.log('[FocusRouter] Dispatch function registered to window');
    return () => {
      (window as any).focusRouterDispatch = null;
    };
  }, [location]);

  return (
    <FocusRouterContext.Provider value={{ registerHandler, unregisterHandler, dispatch }}>
      {children}
    </FocusRouterContext.Provider>
  );
}

// Hook to access FocusRouter
export function useFocusRouter() {
  const context = useContext(FocusRouterContext);
  if (!context) {
    throw new Error('useFocusRouter must be used within FocusRouterProvider');
  }
  return context;
}

/**
 * Hook to register a page-specific key handler (LGTV pattern)
 * 
 * Usage in a page component:
 * ```
 * usePageKeyHandler('/discover', (e) => {
 *   switch(e.keyCode) {
 *     case 13: // ENTER
 *       handleSelect();
 *       break;
 *     case 38: // UP
 *       moveFocusUp();
 *       break;
 *   }
 * });
 * ```
 */
export function usePageKeyHandler(route: string, handler: KeyHandler) {
  const { registerHandler, unregisterHandler } = useFocusRouter();
  const handlerRef = useRef(handler);

  // Keep handler ref up to date
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Register/unregister on mount/unmount
  useEffect(() => {
    const wrappedHandler = (e: KeyboardEvent) => handlerRef.current(e);
    registerHandler(route, wrappedHandler);
    return () => unregisterHandler(route);
  }, [route, registerHandler, unregisterHandler]);
}
