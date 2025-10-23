import type { Express } from "express";
import { createServer, type Server } from "http";

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

  const httpServer = createServer(app);

  return httpServer;
}
