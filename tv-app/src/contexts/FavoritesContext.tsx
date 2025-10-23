import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Station } from "@/services/megaRadioApi";

interface FavoritesContextType {
  favorites: Station[];
  addFavorite: (station: Station) => void;
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  toggleFavorite: (station: Station) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "mega_radio_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Station[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
        console.log('[FavoritesContext] Loaded', parsed.length, 'favorites from localStorage');
      }
    } catch (error) {
      console.error('[FavoritesContext] Failed to load favorites:', error);
    }
  }, []);

  const saveFavorites = (newFavorites: Station[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('[FavoritesContext] Saved', newFavorites.length, 'favorites to localStorage');
    } catch (error) {
      console.error('[FavoritesContext] Failed to save favorites:', error);
    }
  };

  const addFavorite = (station: Station) => {
    setFavorites((prev) => {
      const exists = prev.some((s) => s._id === station._id);
      if (exists) {
        console.log('[FavoritesContext] Station already in favorites:', station.name);
        return prev;
      }
      const newFavorites = [...prev, station];
      saveFavorites(newFavorites);
      console.log('[FavoritesContext] Added to favorites:', station.name);
      return newFavorites;
    });
  };

  const removeFavorite = (stationId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((s) => s._id !== stationId);
      saveFavorites(newFavorites);
      console.log('[FavoritesContext] Removed from favorites:', stationId);
      return newFavorites;
    });
  };

  const isFavorite = (stationId: string) => {
    return favorites.some((s) => s._id === stationId);
  };

  const toggleFavorite = (station: Station) => {
    if (isFavorite(station._id)) {
      removeFavorite(station._id);
    } else {
      addFavorite(station);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
