import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NetworkStatusContextType {
  isConnected: boolean;
  isNetworkModalOpen: boolean;
  closeNetworkModal: () => void;
}

const NetworkStatusContext = createContext<NetworkStatusContextType | undefined>(undefined);

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  useEffect(() => {
    let networkListenerId: number | null = null;
    
    // Check if Samsung TV webapis is available
    if (typeof window !== 'undefined' && (window as any).webapis?.network) {
      console.log('[NetworkStatus] Samsung TV webapis.network detected - setting up listener');
      
      // Add network state change listener
      try {
        const networkCallback = (value: number) => {
          console.log('[NetworkStatus] Network state changed:', value);
          
          const NetworkState = (window as any).webapis.network.NetworkState;
          
          if (value === NetworkState.GATEWAY_DISCONNECTED) {
            console.log('[NetworkStatus] 🔴 Network DISCONNECTED');
            setIsConnected(false);
            setIsNetworkModalOpen(true);
            
            // Pause audio playback (Samsung requirement)
            if ((window as any).globalPlayer?.pause) {
              console.log('[NetworkStatus] Pausing audio due to network disconnection');
              (window as any).globalPlayer.pause();
            }
          } else if (value === NetworkState.GATEWAY_CONNECTED) {
            console.log('[NetworkStatus] 🟢 Network RECONNECTED');
            setIsConnected(true);
            setIsNetworkModalOpen(false);
          }
        };
        
        networkListenerId = (window as any).webapis.network.addNetworkStateChangeListener(networkCallback);
        
        console.log('[NetworkStatus] ✅ Network listener added successfully, ID:', networkListenerId);
        
        // Check initial network status
        const isCurrentlyConnected = (window as any).webapis.network.isConnectedToGateway();
        console.log('[NetworkStatus] Initial network status:', isCurrentlyConnected ? 'Connected' : 'Disconnected');
        
        if (!isCurrentlyConnected) {
          setIsConnected(false);
          setIsNetworkModalOpen(true);
        }
      } catch (error) {
        console.error('[NetworkStatus] Failed to setup network listener:', error);
      }
      
      // Cleanup for Samsung TV
      return () => {
        if (networkListenerId !== null && (window as any).webapis?.network?.removeNetworkStateChangeListener) {
          try {
            (window as any).webapis.network.removeNetworkStateChangeListener(networkListenerId);
            console.log('[NetworkStatus] ✅ Network listener removed successfully');
          } catch (error) {
            console.error('[NetworkStatus] Failed to remove network listener:', error);
          }
        }
      };
    } else {
      console.log('[NetworkStatus] Not on Samsung TV - using browser online/offline events');
      
      // Fallback for non-Samsung platforms (web, LG webOS)
      const handleOnline = () => {
        console.log('[NetworkStatus] Browser online event');
        setIsConnected(true);
        setIsNetworkModalOpen(false);
      };
      
      const handleOffline = () => {
        console.log('[NetworkStatus] Browser offline event');
        setIsConnected(false);
        setIsNetworkModalOpen(true);
        
        // Pause audio playback (Samsung requirement)
        if ((window as any).globalPlayer?.pause) {
          console.log('[NetworkStatus] Pausing audio due to network disconnection');
          (window as any).globalPlayer.pause();
        }
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Check initial status
      if (!navigator.onLine) {
        setIsConnected(false);
        setIsNetworkModalOpen(true);
      }
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const closeNetworkModal = () => {
    setIsNetworkModalOpen(false);
  };

  return (
    <NetworkStatusContext.Provider value={{ isConnected, isNetworkModalOpen, closeNetworkModal }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
}
