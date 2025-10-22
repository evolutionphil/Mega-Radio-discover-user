import { Station } from "./megaRadioApi";

const STORAGE_KEY = "recentlyPlayed";
const MAX_RECENT_STATIONS = 6;

export const recentlyPlayedService = {
  /**
   * Add a station to recently played list
   */
  addStation(station: Station): void {
    try {
      const existing = this.getStations();
      
      // Remove if already exists to avoid duplicates
      const filtered = existing.filter(s => s._id !== station._id);
      
      // Add to beginning of array
      const updated = [station, ...filtered].slice(0, MAX_RECENT_STATIONS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log("[RecentlyPlayed] Station added:", station.name);
    } catch (err) {
      console.warn("[RecentlyPlayed] Failed to save station:", err);
    }
  },

  /**
   * Get all recently played stations
   */
  getStations(): Station[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as Station[];
      }
    } catch (err) {
      console.warn("[RecentlyPlayed] Failed to load stations:", err);
    }
    return [];
  },

  /**
   * Clear all recently played stations
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("[RecentlyPlayed] Cleared all stations");
    } catch (err) {
      console.warn("[RecentlyPlayed] Failed to clear stations:", err);
    }
  }
};
