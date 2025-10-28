import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";

// Version 2.2 - Google Analytics Integration
console.log('🔥 MAIN.TSX LOADED - VERSION 2.2 - GOOGLE ANALYTICS ENABLED');

// Initialize Google Analytics
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  initGA();
  console.log('[Analytics] Google Analytics enabled');
} else {
  console.warn('[Analytics] VITE_GA_MEASUREMENT_ID not found - Analytics disabled');
}

createRoot(document.getElementById("root")!).render(<App />);
