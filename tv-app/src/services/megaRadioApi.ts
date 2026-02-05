// Mega Radio API Service - VERSION 3.0 - COUNTRY FILTERED GENRES
const BASE_URL = 'https://themegaradio.com';
const API_PREFIX = '/api';

const isSamsungTV = typeof window !== 'undefined' && (
  navigator.userAgent.toLowerCase().includes('tizen') ||
  navigator.userAgent.toLowerCase().includes('samsung')
);

// Add ?tv=1 query parameter for Samsung TV to signal backend to skip compression
const TV_PARAM = isSamsungTV ? '?tv=1' : '';

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

// Map country names to ISO 3166-1 codes
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'American Samoa': 'AS',
  'Andorra': 'AD', 'Angola': 'AO', 'Argentina': 'AR', 'Armenia': 'AM',
  'Australia': 'AU', 'Austria': 'AT', 'Azerbaijan': 'AZ', 'Bahrain': 'BH',
  'Bangladesh': 'BD', 'Belarus': 'BY', 'Belgium': 'BE', 'Belize': 'BZ',
  'Benin': 'BJ', 'Bermuda': 'BM', 'Bhutan': 'BT', 'Bolivia': 'BO',
  'Bosnia And Herzegovina': 'BA', 'Botswana': 'BW', 'Brazil': 'BR', 'Brunei Darussalam': 'BN',
  'Bulgaria': 'BG', 'Burkina Faso': 'BF', 'Burundi': 'BI', 'Cambodia': 'KH',
  'Cameroon': 'CM', 'Canada': 'CA', 'Chad': 'TD', 'Chile': 'CL',
  'China': 'CN', 'Colombia': 'CO', 'Costa Rica': 'CR', 'Croatia': 'HR',
  'Cuba': 'CU', 'Cyprus': 'CY', 'Czechia': 'CZ', 'Denmark': 'DK',
  'Djibouti': 'DJ', 'Dominica': 'DM', 'Ecuador': 'EC', 'Egypt': 'EG',
  'El Salvador': 'SV', 'Estonia': 'EE', 'Ethiopia': 'ET', 'Fiji': 'FJ',
  'Finland': 'FI', 'France': 'FR', 'Gabon': 'GA', 'Georgia': 'GE',
  'Germany': 'DE', 'Ghana': 'GH', 'Gibraltar': 'GI', 'Greece': 'GR',
  'Greenland': 'GL', 'Grenada': 'GD', 'Guadeloupe': 'GP', 'Guam': 'GU',
  'Guatemala': 'GT', 'Guinea': 'GN', 'Guyana': 'GY', 'Haiti': 'HT',
  'Honduras': 'HN', 'Hong Kong': 'HK', 'Hungary': 'HU', 'Iceland': 'IS',
  'India': 'IN', 'Indonesia': 'ID', 'Iraq': 'IQ', 'Ireland': 'IE',
  'Islamic Republic Of Iran': 'IR', 'Israel': 'IL', 'Italy': 'IT', 'Jamaica': 'JM',
  'Japan': 'JP', 'Jordan': 'JO', 'Kazakhstan': 'KZ', 'Kenya': 'KE',
  'Kosovo': 'XK', 'Kuwait': 'KW', 'Kyrgyzstan': 'KG', 'Latvia': 'LV',
  'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR', 'Libya': 'LY',
  'Liechtenstein': 'LI', 'Lithuania': 'LT', 'Luxembourg': 'LU', 'Macao': 'MO',
  'Madagascar': 'MG', 'Malawi': 'MW', 'Malaysia': 'MY', 'Maldives': 'MV',
  'Mali': 'ML', 'Malta': 'MT', 'Mauritania': 'MR', 'Mauritius': 'MU',
  'Mexico': 'MX', 'Monaco': 'MC', 'Mongolia': 'MN', 'Montenegro': 'ME',
  'Morocco': 'MA', 'Mozambique': 'MZ', 'Myanmar': 'MM', 'Namibia': 'NA',
  'Nepal': 'NP', 'New Zealand': 'NZ', 'Nicaragua': 'NI', 'Nigeria': 'NG',
  'Norway': 'NO', 'Oman': 'OM', 'Pakistan': 'PK', 'Palau': 'PW',
  'Panama': 'PA', 'Papua New Guinea': 'PG', 'Paraguay': 'PY', 'Peru': 'PE',
  'Poland': 'PL', 'Portugal': 'PT', 'Puerto Rico': 'PR', 'Qatar': 'QA',
  'Republic Of North Macedonia': 'MK', 'Reunion': 'RE', 'Romania': 'RO', 'Rwanda': 'RW',
  'San Marino': 'SM', 'Saudi Arabia': 'SA', 'Senegal': 'SN', 'Serbia': 'RS',
  'Seychelles': 'SC', 'Sierra Leone': 'SL', 'Singapore': 'SG', 'Slovakia': 'SK',
  'Slovenia': 'SI', 'Solomon Islands': 'SB', 'Somalia': 'SO', 'South Africa': 'ZA',
  'South Sudan': 'SS', 'Spain': 'ES', 'Sri Lanka': 'LK', 'Suriname': 'SR',
  'Sweden': 'SE', 'Switzerland': 'CH', 'Taiwan, Republic Of China': 'TW', 'Tajikistan': 'TJ',
  'Thailand': 'TH', 'The Bahamas': 'BS', 'The Congo': 'CG', 'The Democratic Republic Of The Congo': 'CD',
  'The Dominican Republic': 'DO', 'The Gambia': 'GM', 'The Netherlands': 'NL', 'The Philippines': 'PH',
  'The Republic Of Korea': 'KR', 'The Republic Of Moldova': 'MD', 'The Russian Federation': 'RU', 'The Sudan': 'SD',
  'The United Arab Emirates': 'AE', 'The United Kingdom Of Great Britain And Northern Ireland': 'GB',
  'The United States Of America': 'US', 'Togo': 'TG', 'Tonga': 'TO',
  'Trinidad And Tobago': 'TT', 'Tunisia': 'TN', 'Türkiye': 'TR', 'Turkmenistan': 'TM',
  'Uganda': 'UG', 'Ukraine': 'UA', 'United Republic Of Tanzania': 'TZ', 'Uruguay': 'UY',
  'Uzbekistan': 'UZ', 'Vanuatu': 'VU', 'Vietnam': 'VN', 'Yemen': 'YE',
  'Zambia': 'ZM', 'Zimbabwe': 'ZW'
};

// Reverse mapping: CODE to NAME (for API calls)
const CODE_TO_COUNTRY_NAME: Record<string, string> = Object.entries(COUNTRY_NAME_TO_CODE).reduce(
  (acc, [name, code]) => ({ ...acc, [code]: name }),
  {} as Record<string, string>
);

const getCountryCode = (countryName: string): string => {
  return COUNTRY_NAME_TO_CODE[countryName] || 'XX';
};

const getCountryNameFromCode = (code: string): string => {
  return CODE_TO_COUNTRY_NAME[code] || code;
};

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
    if (params?.country) {
      // Convert country code to name for API
      const countryName = getCountryNameFromCode(params.country);
      queryParams.append('country', countryName);
    }
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) {
      queryParams.append('genre', params.genre);
    }
    if (params?.sort) queryParams.append('sort', params.sort);

    try {
      const url = buildApiUrl('/stations', queryParams);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      // API returns { stations: [...] } or just [...]
      const stations = data.stations || (Array.isArray(data) ? data : []);
      
      return { stations, pagination: {} };
    } catch (error) {
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
    queryParams.append('search', '');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.country) {
      const countryName = getCountryNameFromCode(params.country);
      queryParams.append('country', countryName);
    }
    if (params?.language) queryParams.append('language', params.language);
    if (params?.genre) queryParams.append('genre', params.genre);
    queryParams.append('sort', 'votes');

    const url = buildApiUrl('/stations', queryParams);
    const response = await fetch(url);
    const data = await response.json();
    const stations = data.stations || (Array.isArray(data) ? data : []);
    return { stations };
  },

  getWorkingStations: async (params?: {
    limit?: number;
    country?: string;
    offset?: number;
  }): Promise<{ stations: Station[] }> => {
    const queryParams = new URLSearchParams();
    queryParams.append('search', '');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.country) {
      const countryName = getCountryNameFromCode(params.country);
      queryParams.append('country', countryName);
    }

    try {
      const url = buildApiUrl('/stations', queryParams);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const stations = data.stations || [];
      return { stations };
    } catch (error) {
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
  getAllGenres: async (country?: string): Promise<{ genres: Genre[] }> => {
    try {
      const params = new URLSearchParams();
      
      // Add filters parameter with country filtering if provided
      if (country) {
        const countryName = getCountryNameFromCode(country);
        const filters = JSON.stringify({
          countrycode: countryName,
          searchQuery: ''
        });
        params.append('filters', filters);
      }
      
      // Add limit to fetch all genres (default API limit is only 9 per page)
      params.append('limit', '500');
      
      const url = buildApiUrl('/genres', params);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      return { genres: result.data || [] };
    } catch (error) {
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
      offset?: number;
    }
  ): Promise<{ stations: Station[]; pagination: any; genre: Genre }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.country && params.country !== 'GLOBAL') {
      // GLOBAL means worldwide - don't filter by country
      // Only add country filter for specific countries
      const countryName = getCountryNameFromCode(params.country);
      queryParams.append('country', countryName);
    }
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = buildApiUrl(`/genres/${slug}/stations`, queryParams);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  getDiscoverableGenres: async (): Promise<{ genres: Genre[] }> => {
    try {
      const url = buildApiUrl('/genres/discoverable');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return { genres: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { genres: [] };
    }
  },

  // Countries
  getAllCountries: async (): Promise<{ countries: Country[] }> => {
    try {
      const url = buildApiUrl('/countries');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      
      // API returns array of strings, convert to Country objects
      const countries: Country[] = Array.isArray(data) ? data.map((name: string) => ({
        name: name,
        iso_3166_1: getCountryCode(name), // Will map country name to ISO code
        stationcount: 0
      })) : [];
      
      return { countries };
    } catch (error) {
      return { countries: [] };
    }
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
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return { results: data.stations || [], total: data.totalCount || 0 };
    } catch (error) {
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
      throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }
    
    return response.json();
  },
};
