import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hash-based location hook for TV app that properly handles direct navigation
 * to routes like /#/settings by preferring window.location.hash and decoding fallbacks.
 * 
 * Fixes issue where /%23/settings was being treated as "/" by standard useHashLocation.
 */
export const useTVHashLocation = (): [
  string,
  (to: string, options?: { replace?: boolean }) => void
] => {
  // Normalize the hash into a proper path
  const getCurrentPath = useCallback((): string => {
    const hash = window.location.hash;
    
    // Prefer window.location.hash when present
    if (hash) {
      // Remove leading # and ensure it starts with /
      const path = hash.slice(1);
      return path.startsWith('/') ? path : `/${path}`;
    }
    
    // Fallback: check if pathname contains encoded hash (%23)
    const pathname = window.location.pathname;
    if (pathname.includes('%23')) {
      // Decode and extract the path after %23
      const decoded = decodeURIComponent(pathname);
      const hashIndex = decoded.indexOf('#');
      if (hashIndex !== -1) {
        const path = decoded.slice(hashIndex + 1);
        return path.startsWith('/') ? path : `/${path}`;
      }
    }
    
    // Default to root
    return '/';
  }, []);

  const [location, setLocation] = useState(getCurrentPath);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setLocation(getCurrentPath());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getCurrentPath]);

  // Navigation function
  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const newHash = to.startsWith('/') ? `#${to}` : `#/${to}`;
    
    if (options?.replace) {
      window.location.replace(newHash);
    } else {
      window.location.hash = newHash;
    }
  }, []);

  return [location, navigate];
};
