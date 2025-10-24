/**
 * Hybrid Geolocation Utility for Samsung Tizen and LG webOS TVs
 * 
 * Detection Priority:
 * 1. Samsung Tizen: webapis.productinfo.getCountryCode()
 * 2. LG webOS: webOS.systemInfo.country / smartServiceCountryCode2
 * 3. Fallback: Browser language-based detection
 * 
 * Note: IP-based detection not available in TV app (static build, no backend)
 */

// ISO country code to country name mapping (most common countries)
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  // North America
  'US': 'United States',
  'CA': 'Canada',
  'MX': 'Mexico',
  
  // Europe
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'ES': 'Spain',
  'IT': 'Italy',
  'PT': 'Portugal',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'GR': 'Greece',
  'IE': 'Ireland',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'HR': 'Croatia',
  'BG': 'Bulgaria',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'RS': 'Serbia',
  'UA': 'Ukraine',
  'IS': 'Iceland',
  'LU': 'Luxembourg',
  
  // Middle East & Africa
  'TR': 'Turkey',
  'IL': 'Israel',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'MA': 'Morocco',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'ET': 'Ethiopia',
  
  // Asia
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'IN': 'India',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'ID': 'Indonesia',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'PH': 'Philippines',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  
  // Oceania
  'AU': 'Australia',
  'NZ': 'New Zealand',
  
  // South America
  'BR': 'Brazil',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'EC': 'Ecuador',
  'UY': 'Uruguay',
};

// Language to country mapping (for fallback)
const LANGUAGE_TO_COUNTRY: Record<string, { name: string; code: string }> = {
  'en': { name: 'United States', code: 'US' },
  'de': { name: 'Germany', code: 'DE' },
  'fr': { name: 'France', code: 'FR' },
  'es': { name: 'Spain', code: 'ES' },
  'it': { name: 'Italy', code: 'IT' },
  'pt': { name: 'Portugal', code: 'PT' },
  'ru': { name: 'Russia', code: 'RU' },
  'ja': { name: 'Japan', code: 'JP' },
  'zh': { name: 'China', code: 'CN' },
  'ar': { name: 'Saudi Arabia', code: 'SA' },
  'tr': { name: 'Turkey', code: 'TR' },
  'pl': { name: 'Poland', code: 'PL' },
  'nl': { name: 'Netherlands', code: 'NL' },
  'sv': { name: 'Sweden', code: 'SE' },
  'no': { name: 'Norway', code: 'NO' },
  'da': { name: 'Denmark', code: 'DK' },
  'fi': { name: 'Finland', code: 'FI' },
  'ko': { name: 'South Korea', code: 'KR' },
};

export interface GeoLocationResult {
  countryName: string;
  countryCode: string;
  detectionMethod: 'samsung-tv' | 'lg-webos' | 'language-fallback' | 'default';
  success: boolean;
}

/**
 * Detect country using Samsung Tizen productinfo API
 */
function detectSamsungTizenCountry(): GeoLocationResult | null {
  try {
    // Check if Samsung webapis is available
    if (typeof window.webapis !== 'undefined' && window.webapis.productinfo) {
      const countryCode = window.webapis.productinfo.getCountryCode();
      
      if (countryCode && countryCode.length === 2) {
        const countryName = COUNTRY_CODE_TO_NAME[countryCode.toUpperCase()];
        
        if (countryName) {
          console.log('[Geolocation] ✅ Samsung Tizen country detected:', countryName, countryCode);
          return {
            countryName,
            countryCode: countryCode.toUpperCase(),
            detectionMethod: 'samsung-tv',
            success: true,
          };
        } else {
          console.warn('[Geolocation] ⚠️ Samsung Tizen returned unknown country code:', countryCode);
        }
      }
    }
  } catch (error) {
    console.error('[Geolocation] ❌ Samsung Tizen detection failed:', error);
  }
  
  return null;
}

/**
 * Detect country using LG webOS systemInfo API
 */
function detectLGWebOSCountry(): GeoLocationResult | null {
  try {
    // Check if LG webOS is available
    if (typeof window.webOS !== 'undefined' && window.webOS.systemInfo) {
      // Try smartServiceCountryCode2 first (2-letter ISO code)
      let countryCode = window.webOS.systemInfo.smartServiceCountryCode2;
      
      // Fallback to country property (might be 3-letter code)
      if (!countryCode && window.webOS.systemInfo.country) {
        const rawCountry = window.webOS.systemInfo.country;
        // Convert 3-letter codes to 2-letter if needed
        if (rawCountry === 'USA') countryCode = 'US';
        else if (rawCountry === 'GBR') countryCode = 'GB';
        else if (rawCountry === 'DEU') countryCode = 'DE';
        else if (rawCountry === 'FRA') countryCode = 'FR';
        else if (rawCountry === 'ESP') countryCode = 'ES';
        else if (rawCountry === 'ITA') countryCode = 'IT';
        else if (rawCountry.length === 2) countryCode = rawCountry;
      }
      
      if (countryCode && countryCode.length === 2) {
        const countryName = COUNTRY_CODE_TO_NAME[countryCode.toUpperCase()];
        
        if (countryName) {
          console.log('[Geolocation] ✅ LG webOS country detected:', countryName, countryCode);
          return {
            countryName,
            countryCode: countryCode.toUpperCase(),
            detectionMethod: 'lg-webos',
            success: true,
          };
        } else {
          console.warn('[Geolocation] ⚠️ LG webOS returned unknown country code:', countryCode);
        }
      }
    }
  } catch (error) {
    console.error('[Geolocation] ❌ LG webOS detection failed:', error);
  }
  
  return null;
}

/**
 * Detect browser language and map to country (fallback)
 */
function detectLanguageBasedCountry(): GeoLocationResult {
  try {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const langCode = browserLang.toLowerCase().substring(0, 2);
    
    const countryInfo = LANGUAGE_TO_COUNTRY[langCode] || LANGUAGE_TO_COUNTRY['en'];
    
    console.log('[Geolocation] 🔄 Language-based fallback:', countryInfo.name, countryInfo.code);
    return {
      countryName: countryInfo.name,
      countryCode: countryInfo.code,
      detectionMethod: 'language-fallback',
      success: true,
    };
  } catch (error) {
    console.error('[Geolocation] ❌ Language detection failed:', error);
    return {
      countryName: 'United States',
      countryCode: 'US',
      detectionMethod: 'default',
      success: false,
    };
  }
}

/**
 * Main hybrid geolocation function
 * Tries multiple detection methods in priority order
 */
export function detectCountry(): GeoLocationResult {
  console.log('[Geolocation] 🌍 Starting hybrid country detection...');
  
  // Priority 1: Samsung Tizen native API (instant, accurate)
  const samsungResult = detectSamsungTizenCountry();
  if (samsungResult) {
    return samsungResult;
  }
  
  // Priority 2: LG webOS native API (instant, accurate)
  const lgResult = detectLGWebOSCountry();
  if (lgResult) {
    return lgResult;
  }
  
  // Priority 3: Language-based fallback (always works)
  return detectLanguageBasedCountry();
}

/**
 * Get country flag URL from country code
 */
export function getCountryFlagUrl(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23979797"/%3E%3C/svg%3E';
  }
  
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

// Type declarations for Samsung/LG APIs
declare global {
  interface Window {
    webapis?: {
      productinfo?: {
        getCountryCode: () => string;
      };
      tv?: {
        info?: {
          getLanguage?: () => string;
        };
      };
    };
    webOS?: {
      systemInfo?: {
        country?: string;
        smartServiceCountryCode2?: string;
        locale?: string;
        language?: string;
      };
    };
  }
}
