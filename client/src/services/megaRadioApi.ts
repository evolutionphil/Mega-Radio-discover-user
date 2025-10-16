// Mega Radio API Service
const BASE_URL = 'https://themegaradio.com';

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
  tags?: string[];
  country?: string;
  countrycode?: string;
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

    const response = await fetch(`${BASE_URL}/api/stations?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
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

    const response = await fetch(`${BASE_URL}/api/stations/popular?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getWorkingStations: async (params?: {
    limit?: number;
    country?: string;
  }): Promise<{ stations: Station[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.country) queryParams.append('country', params.country);

    const response = await fetch(`${BASE_URL}/api/stations/working?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
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

    const response = await fetch(`${BASE_URL}/api/stations/nearby?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getStationById: async (identifier: string): Promise<{ station: Station }> => {
    const response = await fetch(`${BASE_URL}/api/station/${identifier}`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Genres
  getAllGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await fetch(`${BASE_URL}/api/genres`, {
      credentials: 'include',
    });
    return response.json();
  },

  getGenreBySlug: async (slug: string): Promise<{ genre: Genre }> => {
    const response = await fetch(`${BASE_URL}/api/genres/slug/${slug}`, {
      credentials: 'include',
    });
    return response.json();
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

    const response = await fetch(`${BASE_URL}/api/genres/${slug}/stations?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getDiscoverableGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await fetch(`${BASE_URL}/api/genres/discoverable`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Countries
  getAllCountries: async (): Promise<{ countries: Country[] }> => {
    const response = await fetch(`${BASE_URL}/api/countries`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Languages
  getAllLanguages: async (): Promise<{ languages: Language[] }> => {
    const response = await fetch(`${BASE_URL}/api/languages`, {
      credentials: 'include',
    });
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
    const queryParams = new URLSearchParams({ q: params.q });
    if (params?.country) queryParams.append('country', params.country);
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) queryParams.append('genre', params.genre);
    if (params?.bitrate) queryParams.append('bitrate', params.bitrate.toString());
    if (params?.codec) queryParams.append('codec', params.codec);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${BASE_URL}/api/discover/search?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Discovery
  getTopClicked: async (limit?: number): Promise<{ stations: Station[] }> => {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${BASE_URL}/api/radio-browser/top-clicked${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getTopVoted: async (limit?: number): Promise<{ stations: Station[] }> => {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${BASE_URL}/api/radio-browser/top-voted${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getRecentStations: async (limit?: number): Promise<{ stations: Station[] }> => {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${BASE_URL}/api/radio-browser/recent${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },
};
