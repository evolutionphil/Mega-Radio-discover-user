import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
