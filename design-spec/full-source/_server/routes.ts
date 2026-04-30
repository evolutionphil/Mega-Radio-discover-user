import type { Express } from "express";
import { createServer, type Server } from "http";
import http from "http";
import https from "https";
import { URL } from "url";

const MEGA_RADIO_API = 'https://themegaradio.com';

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoints for Mega Radio API (to avoid CORS issues on Samsung TV)
  
  // Proxy: Get working stations
  app.get('/api/proxy/stations/working', async (req, res) => {
    try {
      const queryParams = new URLSearchParams();
      if (req.query.limit) queryParams.append('limit', req.query.limit as string);
      if (req.query.country) queryParams.append('country', req.query.country as string);
      
      const response = await fetch(`${MEGA_RADIO_API}/api/stations/working?${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (working stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch stations' });
    }
  });

  // Proxy: Search stations
  app.get('/api/proxy/stations', async (req, res) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });
      
      const response = await fetch(`${MEGA_RADIO_API}/api/stations?${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch stations' });
    }
  });

  // Proxy: Get all genres
  app.get('/api/proxy/genres', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/genres`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (genres):', error);
      res.status(500).json({ data: [], error: 'Failed to fetch genres' });
    }
  });

  // Proxy: Get discoverable genres
  app.get('/api/proxy/genres/discoverable', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/genres/discoverable`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (discoverable genres):', error);
      res.status(500).json([]); 
    }
  });

  // Proxy: Get stations by genre
  app.get('/api/proxy/genres/:slug/stations', async (req, res) => {
    try {
      const { slug } = req.params;
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });
      
      const response = await fetch(`${MEGA_RADIO_API}/api/genres/${slug}/stations?${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (genre stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch stations' });
    }
  });

  // Proxy: Get station by ID
  app.get('/api/proxy/station/:id', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/station/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (station by ID):', error);
      res.status(500).json({ error: 'Failed to fetch station' });
    }
  });

  // Proxy: Get similar stations
  app.get('/api/proxy/stations/similar/:id', async (req, res) => {
    try {
      const queryParams = req.query.limit ? `?limit=${req.query.limit}` : '';
      const response = await fetch(`${MEGA_RADIO_API}/api/stations/similar/${req.params.id}${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (similar stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch similar stations' });
    }
  });

  // Proxy: Get popular stations
  app.get('/api/proxy/stations/popular', async (req, res) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });
      
      const response = await fetch(`${MEGA_RADIO_API}/api/stations/popular?${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (popular stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch popular stations' });
    }
  });

  // Proxy: Get nearby stations
  app.get('/api/proxy/stations/nearby', async (req, res) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });
      
      const response = await fetch(`${MEGA_RADIO_API}/api/stations/nearby?${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (nearby stations):', error);
      res.status(500).json({ stations: [], totalStations: 0, error: 'Failed to fetch nearby stations' });
    }
  });

  // Proxy: Get station metadata
  app.get('/api/proxy/stations/:id/metadata', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/stations/${req.params.id}/metadata`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (station metadata):', error);
      res.status(500).json({ metadata: {}, error: 'Failed to fetch station metadata' });
    }
  });

  // Proxy: Get genre by slug
  app.get('/api/proxy/genres/slug/:slug', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/genres/slug/${req.params.slug}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (genre by slug):', error);
      res.status(500).json({ error: 'Failed to fetch genre' });
    }
  });

  // Proxy: Get all countries
  app.get('/api/proxy/countries', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/countries`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (countries):', error);
      res.status(500).json({ countries: [], error: 'Failed to fetch countries' });
    }
  });

  // Proxy: Get all languages
  app.get('/api/proxy/languages', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/languages`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (languages):', error);
      res.status(500).json({ languages: [], error: 'Failed to fetch languages' });
    }
  });

  // Proxy: Get translations
  app.get('/api/proxy/translations/:lang', async (req, res) => {
    try {
      const response = await fetch(`${MEGA_RADIO_API}/api/translations/${req.params.lang}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (translations):', error);
      res.status(500).json({ error: 'Failed to fetch translations' });
    }
  });

  // Proxy: Radio Browser endpoints
  app.get('/api/proxy/radio-browser/top-clicked', async (req, res) => {
    try {
      const queryParams = req.query.limit ? `?limit=${req.query.limit}` : '';
      const response = await fetch(`${MEGA_RADIO_API}/api/radio-browser/top-clicked${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (top clicked):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch top clicked stations' });
    }
  });

  app.get('/api/proxy/radio-browser/top-voted', async (req, res) => {
    try {
      const queryParams = req.query.limit ? `?limit=${req.query.limit}` : '';
      const response = await fetch(`${MEGA_RADIO_API}/api/radio-browser/top-voted${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (top voted):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch top voted stations' });
    }
  });

  app.get('/api/proxy/radio-browser/recent', async (req, res) => {
    try {
      const queryParams = req.query.limit ? `?limit=${req.query.limit}` : '';
      const response = await fetch(`${MEGA_RADIO_API}/api/radio-browser/recent${queryParams}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error (recent stations):', error);
      res.status(500).json({ stations: [], error: 'Failed to fetch recent stations' });
    }
  });

  function parsePlaylist(content: string, contentType: string, urlStr: string): string | null {
    const lowerUrl = urlStr.toLowerCase();
    const lowerType = contentType.toLowerCase();
    const isPLS = lowerUrl.endsWith('.pls') || lowerType.includes('scpls') || lowerType.includes('x-scpls');
    const isM3U = lowerUrl.endsWith('.m3u') || lowerUrl.endsWith('.m3u8') || lowerType.includes('mpegurl') || lowerType.includes('x-mpegurl');

    if (isPLS) {
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^File\d*=/i.test(trimmed)) {
          const url = trimmed.substring(trimmed.indexOf('=') + 1).trim();
          if (url.startsWith('http')) return url;
        }
      }
    }

    if (isM3U) {
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith('http')) {
          return trimmed;
        }
      }
    }

    return null;
  }

  function isHLSUrl(urlStr: string, contentType?: string): boolean {
    const lowerUrl = urlStr.toLowerCase();
    const lowerType = (contentType || '').toLowerCase();
    return lowerUrl.endsWith('.m3u8') || lowerType.includes('x-mpegurl') || lowerType.includes('vnd.apple.mpegurl');
  }

  function isPlaylistUrl(urlStr: string, contentType?: string): boolean {
    if (isHLSUrl(urlStr, contentType)) return false;
    const lowerUrl = urlStr.toLowerCase();
    const lowerType = (contentType || '').toLowerCase();
    return lowerUrl.endsWith('.m3u') || lowerUrl.endsWith('.pls') ||
      lowerType.includes('mpegurl') || lowerType.includes('scpls') || lowerType.includes('x-scpls');
  }

  function followRedirects(urlStr: string, maxRedirects: number, timeout: number): Promise<{ response: http.IncomingMessage; finalUrl: string; redirectCount: number }> {
    return new Promise((resolve, reject) => {
      let redirectCount = 0;

      function doRequest(currentUrl: string) {
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(currentUrl);
        } catch {
          return reject(new Error(`Invalid URL: ${currentUrl}`));
        }

        const client = parsedUrl.protocol === 'https:' ? https : http;
        const req = client.get(currentUrl, { timeout }, (response) => {
          if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            redirectCount++;
            if (redirectCount > maxRedirects) {
              response.destroy();
              return reject(new Error(`Too many redirects (>${maxRedirects})`));
            }
            response.destroy();
            const nextUrl = response.headers.location.startsWith('http')
              ? response.headers.location
              : new URL(response.headers.location, currentUrl).toString();
            return doRequest(nextUrl);
          }
          resolve({ response, finalUrl: currentUrl, redirectCount });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Connection timed out'));
        });
      }

      doRequest(urlStr);
    });
  }

  function makeHeadRequest(urlStr: string, maxRedirects: number, timeout: number): Promise<{ response: http.IncomingMessage; finalUrl: string; redirectCount: number }> {
    return new Promise((resolve, reject) => {
      let redirectCount = 0;

      function doRequest(currentUrl: string) {
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(currentUrl);
        } catch {
          return reject(new Error(`Invalid URL: ${currentUrl}`));
        }

        const client = parsedUrl.protocol === 'https:' ? https : http;
        const options = { method: 'HEAD', timeout };
        const req = client.request(currentUrl, options, (response) => {
          if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            redirectCount++;
            if (redirectCount > maxRedirects) {
              response.destroy();
              return reject(new Error(`Too many redirects (>${maxRedirects})`));
            }
            response.destroy();
            const nextUrl = response.headers.location.startsWith('http')
              ? response.headers.location
              : new URL(response.headers.location, currentUrl).toString();
            return doRequest(nextUrl);
          }
          resolve({ response, finalUrl: currentUrl, redirectCount });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Connection timed out'));
        });
        req.end();
      }

      doRequest(urlStr);
    });
  }

  app.get('/api/stream-proxy', async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      console.log('[STREAM-PROXY] Missing url parameter');
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    console.log(`[STREAM-PROXY] Proxying stream: ${streamUrl}`);

    try {
      const { response, finalUrl } = await followRedirects(streamUrl, 5, 15000);
      const contentType = response.headers['content-type'] || '';
      console.log(`[STREAM-PROXY] Connected to ${finalUrl}, content-type: ${contentType}`);

      if (isPlaylistUrl(finalUrl, contentType)) {
        console.log(`[STREAM-PROXY] Detected playlist, resolving...`);
        let playlistData = '';
        response.setEncoding('utf8');
        await new Promise<void>((resolve, reject) => {
          response.on('data', (chunk: string) => { playlistData += chunk; });
          response.on('end', () => resolve());
          response.on('error', (err: Error) => reject(err));
          setTimeout(() => { response.destroy(); resolve(); }, 5000);
        });

        const resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
        if (resolvedUrl) {
          console.log(`[STREAM-PROXY] Playlist resolved to: ${resolvedUrl}`);
          try {
            const { response: streamResponse, finalUrl: streamFinalUrl } = await followRedirects(resolvedUrl, 5, 15000);
            const streamContentType = streamResponse.headers['content-type'] || 'audio/mpeg';
            console.log(`[STREAM-PROXY] Streaming from resolved URL: ${streamFinalUrl}`);

            res.setHeader('Content-Type', streamContentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            streamResponse.pipe(res);
            req.on('close', () => { streamResponse.destroy(); });
            return;
          } catch (err: any) {
            console.error(`[STREAM-PROXY] Error connecting to resolved URL: ${err.message}`);
            if (!res.headersSent) {
              return res.status(502).json({ error: 'Failed to connect to resolved stream URL' });
            }
            return;
          }
        } else {
          console.error('[STREAM-PROXY] Could not parse playlist');
          if (!res.headersSent) {
            return res.status(502).json({ error: 'Could not parse playlist file' });
          }
          return;
        }
      }

      res.setHeader('Content-Type', contentType || 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.pipe(res);
      req.on('close', () => { response.destroy(); });
    } catch (err: any) {
      console.error(`[STREAM-PROXY] Error: ${err.message}`);
      if (!res.headersSent) {
        return res.status(502).json({ error: `Failed to connect to stream: ${err.message}` });
      }
    }
  });

  app.get('/api/stream-check', async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      console.log('[STREAM-CHECK] Missing url parameter');
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    console.log(`[STREAM-CHECK] Checking stream: ${streamUrl}`);
    const startTime = Date.now();

    try {
      let response: http.IncomingMessage;
      let finalUrl: string;
      let redirectCount: number = 0;

      try {
        const result = await makeHeadRequest(streamUrl, 5, 5000);
        response = result.response;
        finalUrl = result.finalUrl;
        redirectCount = result.redirectCount;
        console.log(`[STREAM-CHECK] HEAD request succeeded: ${response.statusCode}`);
      } catch {
        console.log(`[STREAM-CHECK] HEAD failed, falling back to GET`);
        const result = await followRedirects(streamUrl, 5, 5000);
        response = result.response;
        finalUrl = result.finalUrl;
        redirectCount = result.redirectCount;
        response.destroy();
        console.log(`[STREAM-CHECK] GET request succeeded: ${response.statusCode}`);
      }

      const contentType = response.headers['content-type'] || '';
      const statusCode = response.statusCode || 0;
      const isPlaylist = isPlaylistUrl(finalUrl, contentType);
      let resolvedUrl: string | null = null;

      if (isPlaylist) {
        console.log(`[STREAM-CHECK] URL is a playlist, attempting to resolve...`);
        try {
          const playlistResult = await followRedirects(finalUrl, 5, 5000);
          let playlistData = '';
          playlistResult.response.setEncoding('utf8');
          await new Promise<void>((resolve) => {
            playlistResult.response.on('data', (chunk: string) => { playlistData += chunk; });
            playlistResult.response.on('end', () => resolve());
            playlistResult.response.on('error', () => resolve());
            setTimeout(() => { playlistResult.response.destroy(); resolve(); }, 3000);
          });
          resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
          if (resolvedUrl) {
            console.log(`[STREAM-CHECK] Playlist resolved to: ${resolvedUrl}`);
          }
        } catch (playlistErr: any) {
          console.log(`[STREAM-CHECK] Could not resolve playlist: ${playlistErr.message}`);
        }
      }

      const responseTime = Date.now() - startTime;
      console.log(`[STREAM-CHECK] Check completed in ${responseTime}ms`);

      res.json({
        ok: statusCode >= 200 && statusCode < 400,
        url: streamUrl,
        finalUrl,
        contentType,
        statusCode,
        isPlaylist,
        resolvedUrl,
        error: null,
        responseTime
      });
    } catch (err: any) {
      const responseTime = Date.now() - startTime;
      console.error(`[STREAM-CHECK] Error: ${err.message}`);
      res.json({
        ok: false,
        url: streamUrl,
        finalUrl: null,
        contentType: null,
        statusCode: null,
        isPlaylist: false,
        resolvedUrl: null,
        error: err.message,
        responseTime
      });
    }
  });

  app.get('/api/stream-resolve', async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      console.log('[STREAM-RESOLVE] Missing url parameter');
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    console.log(`[STREAM-RESOLVE] Resolving stream: ${streamUrl}`);

    try {
      const { response, finalUrl, redirectCount } = await followRedirects(streamUrl, 5, 10000);
      const contentType = response.headers['content-type'] || '';
      console.log(`[STREAM-RESOLVE] Followed ${redirectCount} redirects to: ${finalUrl}, content-type: ${contentType}`);

      const lowerUrl = finalUrl.toLowerCase();
      const isHLS = lowerUrl.endsWith('.m3u8') || contentType.toLowerCase().includes('x-mpegurl');
      const isPlaylist = isPlaylistUrl(finalUrl, contentType) && !isHLS;

      if (isHLS) {
        response.destroy();
        console.log(`[STREAM-RESOLVE] HLS stream detected, returning as-is`);
        return res.json({
          originalUrl: streamUrl,
          resolvedUrl: finalUrl,
          contentType,
          isPlaylist: false,
          isHLS: true,
          redirectCount,
          error: null
        });
      }

      if (isPlaylist) {
        console.log(`[STREAM-RESOLVE] Playlist detected, parsing...`);
        let playlistData = '';
        response.setEncoding('utf8');
        await new Promise<void>((resolve) => {
          response.on('data', (chunk: string) => { playlistData += chunk; });
          response.on('end', () => resolve());
          response.on('error', () => resolve());
          setTimeout(() => { response.destroy(); resolve(); }, 5000);
        });

        const resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
        if (resolvedUrl) {
          console.log(`[STREAM-RESOLVE] Playlist resolved to: ${resolvedUrl}`);
          return res.json({
            originalUrl: streamUrl,
            resolvedUrl,
            contentType: 'audio/mpeg',
            isPlaylist: true,
            isHLS: false,
            redirectCount,
            error: null
          });
        } else {
          console.log(`[STREAM-RESOLVE] Could not extract URL from playlist`);
          return res.json({
            originalUrl: streamUrl,
            resolvedUrl: finalUrl,
            contentType,
            isPlaylist: true,
            isHLS: false,
            redirectCount,
            error: 'Could not extract stream URL from playlist'
          });
        }
      }

      response.destroy();
      console.log(`[STREAM-RESOLVE] Direct stream URL: ${finalUrl}`);
      res.json({
        originalUrl: streamUrl,
        resolvedUrl: finalUrl,
        contentType,
        isPlaylist: false,
        isHLS: false,
        redirectCount,
        error: null
      });
    } catch (err: any) {
      console.error(`[STREAM-RESOLVE] Error: ${err.message}`);
      res.json({
        originalUrl: streamUrl,
        resolvedUrl: null,
        contentType: null,
        isPlaylist: false,
        isHLS: false,
        redirectCount: 0,
        error: err.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
