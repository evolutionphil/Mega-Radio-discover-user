// Mega Radio API Service
const BASE_URL = 'https://themegaradio.com';
const API_PREFIX = '/api';

const isSamsungTV = typeof window !== 'undefined' && (
  navigator.userAgent.toLowerCase().includes('tizen') ||
  navigator.userAgent.toLowerCase().includes('samsung')
);

// Add ?tv=1 query parameter for Samsung TV to signal backend to skip compression
const TV_PARAM = isSamsungTV ? '?tv=1' : '';

console.log('[MegaRadio API] Platform:', isSamsungTV ? 'Samsung TV (adding ?tv=1)' : 'Web Browser');
console.log('[MegaRadio API] BASE_URL:', BASE_URL);

export interface Station {
  _id: string;
  changeuuid?: string;
  stationuuid?: string;
  name: string;
  slug?: string;
  url: string;
  url_resolved?: string;
  homepage?: string;
  favicon?: string;
  tags?: string | string[];
  country?: string;
  countrycode?: string;
  countryCode?: string;
  state?: string;
  language?: string;
  languagecodes?: string;
  votes?: number;
  clickcount?: number;
  clicktrend?: number;
  codec?: string;
  bitrate?: number;
  hls?: number;
  lastcheckok?: number;
  lastchecktime?: string;
  clicktimestamp?: string;
  geo_lat?: number;
  geo_long?: number;
  has_extended_info?: boolean;
  ssl_error?: number;
}

export interface Genre {
  _id?: string;
  slug: string;
  name: string;
  poster?: string;
  stationCount?: number;
}

export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount?: number;
}

export interface Language {
  name: string;
  iso_639: string;
  stationcount?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Helper to add TV parameter for Samsung TV (signals backend to skip compression)
function buildApiUrl(path: string, existingParams?: URLSearchParams): string {
  const url = `${BASE_URL}${API_PREFIX}${path}`;
  
  if (!isSamsungTV) {
    return existingParams ? `${url}?${existingParams}` : url;
  }
  
  // Samsung TV: add tv=1 to signal backend to skip compression
  const params = existingParams || new URLSearchParams();
  params.append('tv', '1');
  return `${url}?${params}`;
}

export const megaRadioApi = {
  // Stations
  getAllStations: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    language?: string;
    genre?: string;
    sort?: 'votes' | 'recent' | 'random' | 'clickcount';
  }): Promise<{ stations: Station[]; pagination: any }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) queryParams.append('genre', params.genre);
    if (params?.sort) queryParams.append('sort', params.sort);

    try {
      const url = buildApiUrl('/stations', queryParams);
      console.log('[API] getAllStations:', url);
      const response = await fetch(url);
      console.log('[API] getAllStations response:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('[API] getAllStations fetched:', data.stations?.length || 0);
      return { stations: Array.isArray(data) ? data : [], pagination: {} };
    } catch (error) {
      console.error('[API] getAllStations failed:', error);
      return { stations: [], pagination: {} };
    }
  },

  getPopularStations: async (params?: {
    limit?: number;
    country?: string;
    language?: string;
    genre?: string;
  }): Promise<{ stations: Station[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.country) queryParams.append('country', params.country);
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) queryParams.append('genre', params.genre);

    const url = buildApiUrl('/stations/popular', queryParams);
    const response = await fetch(url);
    const data = await response.json();
    return { stations: Array.isArray(data) ? data : [] };
  },

  getWorkingStations: async (params?: {
    limit?: number;
    country?: string;
  }): Promise<{ stations: Station[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.country) queryParams.append('country', params.country);

    try {
      const url = buildApiUrl('/stations/working', queryParams);
      console.log('[API] Fetching working stations:', url);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('[API] Response status:', response.status);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('[API] Working stations fetched:', data.stations?.length || 0);
      return data;
    } catch (error) {
      console.error('[API] Failed to fetch working stations:', error);
      return { stations: [] };
    }
  },

  getNearbyStations: async (params: {
    lat: number;
    lng: number;
    radius?: number;
    limit?: number;
  }): Promise<{ stations: Station[]; totalStations: number }> => {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
    });
    if (params?.radius) queryParams.append('radius', params.radius.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = buildApiUrl('/stations/nearby', queryParams);
    const response = await fetch(url);
    return response.json();
  },

  getStationById: async (identifier: string): Promise<{ station: Station }> => {
    const url = buildApiUrl(`/station/${identifier}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch station: ${response.statusText}`);
    }
    const data = await response.json();
    return { station: data };
  },

  getSimilarStations: async (stationId: string, limit?: number): Promise<{ stations: Station[] }> => {
    const params = limit ? new URLSearchParams({ limit: limit.toString() }) : undefined;
    const url = buildApiUrl(`/stations/similar/${stationId}`, params);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch similar stations: ${response.statusText}`);
    }
    const data = await response.json();
    return { stations: Array.isArray(data) ? data : data.stations || [] };
  },

  getStationMetadata: async (stationId: string): Promise<{ metadata: { title?: string; artist?: string; album?: string } }> => {
    const url = buildApiUrl(`/stations/${stationId}/metadata`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch station metadata: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  },

  // Genres
  getAllGenres: async (): Promise<{ genres: Genre[] }> => {
    try {
      const url = buildApiUrl('/genres');
      console.log('[API] getAllGenres:', url);
      const response = await fetch(url);
      console.log('[API] getAllGenres response:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      console.log('[API] getAllGenres fetched:', result.data?.length || 0);
      return { genres: result.data || [] };
    } catch (error) {
      console.error('[API] getAllGenres failed:', error);
      return { genres: [] };
    }
  },

  getGenreBySlug: async (slug: string): Promise<{ genre: Genre }> => {
    const url = buildApiUrl(`/genres/slug/${slug}`);
    const response = await fetch(url);
    const data = await response.json();
    return { genre: data };
  },

  getStationsByGenre: async (
    slug: string,
    params?: {
      page?: number;
      limit?: number;
      country?: string;
      sort?: 'votes' | 'recent' | 'random' | 'clickcount';
    }
  ): Promise<{ stations: Station[]; pagination: any; genre: Genre }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.country) queryParams.append('country', params.country);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = buildApiUrl(`/genres/${slug}/stations`, queryParams);
    const response = await fetch(url);
    return response.json();
  },

  getDiscoverableGenres: async (): Promise<{ genres: Genre[] }> => {
    try {
      const url = buildApiUrl('/genres/discoverable');
      console.log('[API] getDiscoverableGenres:', url);
      const response = await fetch(url);
      console.log('[API] getDiscoverableGenres response:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('[API] getDiscoverableGenres fetched:', Array.isArray(data) ? data.length : 0);
      return { genres: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('[API] getDiscoverableGenres failed:', error);
      return { genres: [] };
    }
  },

  // Countries
  getAllCountries: async (): Promise<{ countries: Country[] }> => {
    const url = buildApiUrl('/countries');
    const response = await fetch(url);
    return response.json();
  },

  // Languages
  getAllLanguages: async (): Promise<{ languages: Language[] }> => {
    const url = buildApiUrl('/languages');
    const response = await fetch(url);
    return response.json();
  },

  // Search
  searchStations: async (params: {
    q: string;
    country?: string;
    language?: string;
    genre?: string;
    bitrate?: number;
    codec?: string;
    limit?: number;
  }): Promise<{ results: Station[]; total: number }> => {
    const queryParams = new URLSearchParams({ search: params.q });
    if (params?.country) queryParams.append('country', params.country);
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) queryParams.append('genre', params.genre);
    if (params?.bitrate) queryParams.append('bitrate', params.bitrate.toString());
    if (params?.codec) queryParams.append('codec', params.codec);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    try {
      const url = buildApiUrl('/stations', queryParams);
      console.log('[API] searchStations:', url);
      const response = await fetch(url);
      console.log('[API] searchStations response:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('[API] searchStations fetched:', data.stations?.length || 0);
      return { results: data.stations || [], total: data.totalCount || 0 };
    } catch (error) {
      console.error('[API] searchStations failed:', error);
      return { results: [], total: 0 };
    }
  },

  // Discovery
  getTopClicked: async (limit?: number): Promise<{ stations: Station[] }> => {
    const params = limit ? new URLSearchParams({ limit: limit.toString() }) : undefined;
    const url = buildApiUrl('/radio-browser/top-clicked', params);
    const response = await fetch(url);
    return response.json();
  },

  getTopVoted: async (limit?: number): Promise<{ stations: Station[] }> => {
    const params = limit ? new URLSearchParams({ limit: limit.toString() }) : undefined;
    const url = buildApiUrl('/radio-browser/top-voted', params);
    const response = await fetch(url);
    return response.json();
  },

  getRecentStations: async (limit?: number): Promise<{ stations: Station[] }> => {
    const params = limit ? new URLSearchParams({ limit: limit.toString() }) : undefined;
    const url = buildApiUrl('/radio-browser/recent', params);
    const response = await fetch(url);
    return response.json();
  },

  // Translations
  getTranslations: async (lang: string): Promise<any> => {
    const url = buildApiUrl(`/translations/${lang}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('[API] Failed to fetch translations:', response.status, response.statusText);
      throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }
    
    return response.json();
  },
};
