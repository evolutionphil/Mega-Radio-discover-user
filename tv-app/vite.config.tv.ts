import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
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

        console.log(`[PROXY] ━━━ Request: ${urlParam.substring(0, 100)}`);

        function followAndStream(url: string, redirectsLeft: number) {
          let parsedUrl: URL;
          try {
            parsedUrl = new URL(url);
          } catch {
            console.error(`[PROXY] ❌ Invalid redirect URL: ${url}`);
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
            console.log(`[PROXY] Response: status=${proxyRes.statusCode} content-type=${proxyRes.headers['content-type'] || 'none'} url=${url.substring(0, 80)}`);
            
            if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
              if (redirectsLeft <= 0) {
                console.error(`[PROXY] ❌ Too many redirects for: ${urlParam.substring(0, 80)}`);
                if (!res.headersSent) { res.statusCode = 502; res.end('Too many redirects'); }
                return;
              }
              const redirectUrl = new URL(proxyRes.headers.location, parsedUrl.href).href;
              console.log(`[PROXY] 🔄 Redirect → ${redirectUrl.substring(0, 80)}`);
              followAndStream(redirectUrl, redirectsLeft - 1);
              return;
            }

            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.error(`[PROXY] ❌ HTTP Error ${proxyRes.statusCode} for: ${url.substring(0, 80)}`);
            } else {
              console.log(`[PROXY] ✅ Streaming: content-type=${proxyRes.headers['content-type']}`);
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

          proxyReq.on('error', (err: any) => {
            console.error(`[PROXY] ❌ Connection error: ${err.message} for: ${url.substring(0, 80)}`);
            if (!res.headersSent) {
              res.statusCode = 502;
              res.end('Stream proxy error');
            }
          });

          proxyReq.on('timeout', () => {
            console.error(`[PROXY] ❌ Timeout (15s) for: ${url.substring(0, 80)}`);
            proxyReq.destroy();
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
          
        }
      }
    },
  };
}

function copyStaticAssets() {
  const root = path.resolve(import.meta.dirname);
  const outDir = path.resolve(root, "dist/public");
  const staticDirs = ['js', 'css', 'images', 'webOSTVjs-1.2.0'];
  const staticFiles = ['config.xml', 'appinfo.json'];

  function copyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  return {
    name: 'copy-static-assets',
    apply: 'build' as const,
    closeBundle() {
      for (const dir of staticDirs) {
        copyDir(path.join(root, dir), path.join(outDir, dir));
      }
      for (const file of staticFiles) {
        const srcFile = path.join(root, file);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, path.join(outDir, file));
        }
      }

      const builtHtml = path.join(outDir, 'index-dev.html');
      if (fs.existsSync(builtHtml)) {
        fs.renameSync(builtHtml, path.join(outDir, 'index.html'));
        fs.copyFileSync(path.join(outDir, 'index.html'), path.join(root, 'index.html'));
      }
      const builtAssetsDir = path.join(outDir, 'assets');
      if (fs.existsSync(builtAssetsDir)) {
        copyDir(builtAssetsDir, path.join(root, 'assets'));
      }
    },
  };
}

function useDevHtml() {
  return {
    name: 'use-dev-html',
    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/index-dev.html';
        }
        next();
      });
    },
    apply: 'serve' as const,
  };
}

function removeModuleType() {
  return {
    name: 'remove-module-type',
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      let result = html.replace(/<script\s+type\s*=\s*["']module["']\s*/gi, '<script ');

      const scriptRegex = /<script\s+crossorigin\s+src=["']\.\/assets\/index-[^"']+\.js["'][^>]*><\/script>/gi;
      const matches = result.match(scriptRegex);
      if (matches && matches.length > 0) {
        const scriptTag = matches[0];
        result = result.replace(scriptTag, '');
        result = result.replace('</body>', `  ${scriptTag}\n  </body>`);
      }

      return result;
    },
    apply: 'build' as const,
  };
}

export default defineConfig({
  plugins: [react(), useDevHtml(), makePathsRelative(), removeModuleType(), copyStaticAssets(), streamProxyPlugin()],
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
      input: path.resolve(import.meta.dirname, 'index-dev.html'),
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
