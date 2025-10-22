import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Generate unique timestamp for cache busting on Samsung TV
const buildTimestamp = Date.now();

// Samsung TV build config - IIFE format with timestamp-based cache busting
export default defineConfig({
  plugins: [react()],
  base: "./",  // Relative paths for Samsung TV compatibility
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'iife',
        // Use timestamp instead of content hash for GUARANTEED unique filenames every build
        entryFileNames: `assets/index-${buildTimestamp}.js`,
        chunkFileNames: `assets/[name]-${buildTimestamp}.js`,
        assetFileNames: `assets/[name]-${buildTimestamp}.[ext]`,
      },
    },
    target: 'es2015',  // Samsung TV (Tizen 2.4+) supports ES2015
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,  // Keep console.log for debugging
      },
    },
  },
});
