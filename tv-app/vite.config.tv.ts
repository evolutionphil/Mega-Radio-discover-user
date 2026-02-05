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
          
          // Fix misnamed PNG files that are actually SVG
          chunk.code = chunk.code.replace(/ellipse2\.png/g, 'ellipse2.svg');
          chunk.code = chunk.code.replace(/waves\.png/g, 'waves.svg');
          chunk.code = chunk.code.replace(/monitor\.png/g, 'monitor.svg');
          chunk.code = chunk.code.replace(/phone\.png/g, 'phone.svg');
          chunk.code = chunk.code.replace(/tablet\.png/g, 'tablet.svg');
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
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname),
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: 'es2015', // Compatible with older TVs
    cssCodeSplit: false, // Generate a single CSS file instead of splitting
    rollupOptions: {
      output: {
        format: 'iife', // IIFE format instead of ES modules for TV compatibility
        inlineDynamicImports: true, // Bundle everything into one file
        assetFileNames: (assetInfo) => {
          // Keep CSS as style.css for easier reference
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/style.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
