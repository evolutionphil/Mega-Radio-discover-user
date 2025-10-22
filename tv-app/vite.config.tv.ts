import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Plugin to replace absolute paths with relative paths for Samsung TV
function makePathsRelative() {
  return {
    name: 'make-paths-relative',
    enforce: 'post' as const,
    generateBundle(_options: any, bundle: any) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Replace all absolute image/asset paths with relative paths
          chunk.code = chunk.code.replace(/\/figmaAssets\//g, './images/');
          chunk.code = chunk.code.replace(/\/images\//g, './images/');
          chunk.code = chunk.code.replace(/\/assets\//g, './assets/');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), makePathsRelative()],
  base: './', // Use relative paths for all assets
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "..", "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "..", "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: 'es2015', // Compatible with older TVs
    rollupOptions: {
      output: {
        format: 'iife', // IIFE format instead of ES modules for TV compatibility
        inlineDynamicImports: true, // Bundle everything into one file
      },
    },
  },
});
