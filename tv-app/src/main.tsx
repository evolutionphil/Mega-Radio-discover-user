import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";

// Version 3.0 - Testing new build
console.log('🔥🔥🔥 MAIN.TSX LOADED - VERSION 3.0 - BUILD TIMESTAMP:', Date.now(), '🔥🔥🔥');

// Initialize Google Analytics
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  initGA();
  console.log('[Analytics] Google Analytics enabled');
} else {
  console.warn('[Analytics] VITE_GA_MEASUREMENT_ID not found - Analytics disabled');
}

createRoot(document.getElementById("root")!).render(<App />);
// Version bump 1761657337
