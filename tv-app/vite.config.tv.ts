import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import http from "http";
import https from "https";

function streamProxyPlugin() {
  return {
    name: 'stream-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/stream-proxy', (req: any, res: any) => {
        const urlParam = new URL(req.url, 'http://localhost').searchParams.get('url');
        if (!urlParam) {
          res.statusCode = 400;
          res.end('Missing url parameter');
          return;
        }

        let targetUrl: URL;
        try {
          targetUrl = new URL(urlParam);
        } catch {
          res.statusCode = 400;
          res.end('Invalid url');
          return;
        }

        function followAndStream(url: string, redirectsLeft: number) {
          let parsedUrl: URL;
          try {
            parsedUrl = new URL(url);
          } catch {
            if (!res.headersSent) { res.statusCode = 502; res.end('Invalid redirect URL'); }
            return;
          }
          const client = parsedUrl.protocol === 'https:' ? https : http;

          const proxyReq = client.get(parsedUrl.href, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.5) AppleWebKit/537.36 (KHTML, like Gecko) Version/5.5 TV Safari/537.36',
              'Accept': '*/*',
              'Icy-MetaData': '0',
            },
            timeout: 15000,
          }, (proxyRes) => {
            if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
              if (redirectsLeft <= 0) {
                if (!res.headersSent) { res.statusCode = 502; res.end('Too many redirects'); }
                return;
              }
              const redirectUrl = new URL(proxyRes.headers.location, parsedUrl.href).href;
              followAndStream(redirectUrl, redirectsLeft - 1);
              return;
            }

            const headers: Record<string, string> = {
              'Content-Type': proxyRes.headers['content-type'] || 'audio/mpeg',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache, no-store',
              'Connection': 'keep-alive',
            };
            if (proxyRes.headers['icy-metaint']) {
              headers['Icy-MetaInt'] = proxyRes.headers['icy-metaint'] as string;
            }
            res.writeHead(proxyRes.statusCode || 200, headers);
            proxyRes.pipe(res);
          });

          proxyReq.on('error', () => {
            if (!res.headersSent) {
              res.statusCode = 502;
              res.end('Stream proxy error');
            }
          });

          req.on('close', () => {
            proxyReq.destroy();
          });
        }

        followAndStream(targetUrl.href, 5);
      });
    },
  };
}

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
  plugins: [react(), makePathsRelative(), streamProxyPlugin()],
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
  esbuild: {
    // Remove console.log in production builds for performance
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
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
