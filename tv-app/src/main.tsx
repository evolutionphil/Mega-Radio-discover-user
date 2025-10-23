import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Version 2.1 - Force cache reload - GENRES ALL FIX
console.log('🔥 MAIN.TSX LOADED - VERSION 2.1 - ALL GENRES FIX');

createRoot(document.getElementById("root")!).render(<App />);
