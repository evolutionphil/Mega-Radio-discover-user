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

// ISO country code to country name mapping (comprehensive)
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
  'RU': 'Russia', // CRITICAL: Russia was missing
  'BY': 'Belarus',
  'MD': 'Moldova',
  'AL': 'Albania',
  'MK': 'North Macedonia',
  'ME': 'Montenegro',
  'BA': 'Bosnia and Herzegovina',
  'MT': 'Malta',
  'CY': 'Cyprus',
  
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
  'DZ': 'Algeria',
  'TN': 'Tunisia',
  'LY': 'Libya',
  'GH': 'Ghana',
  'CI': 'Ivory Coast',
  'SN': 'Senegal',
  
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
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'AZ': 'Azerbaijan',
  'GE': 'Georgia',
  'AM': 'Armenia',
  'LK': 'Sri Lanka',
  'MM': 'Myanmar',
  'KH': 'Cambodia',
  'LA': 'Laos',
  'NP': 'Nepal',
  'MN': 'Mongolia',
  
  // Oceania
  'AU': 'Australia',
  'NZ': 'New Zealand',
  'FJ': 'Fiji',
  
  // South America
  'BR': 'Brazil',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'EC': 'Ecuador',
  'UY': 'Uruguay',
  'PY': 'Paraguay',
  'BO': 'Bolivia',
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
  detectionMethod: 'tizen-systeminfo' | 'samsung-tv' | 'lg-webos' | 'language-fallback' | 'default';
  success: boolean;
}

/**
 * Detect country using Tizen SystemInfo LOCALE API (official method - ASYNC)
 * Returns a Promise with the country detection result
 */
function detectTizenSystemInfoCountryAsync(): Promise<GeoLocationResult | null> {
  return new Promise((resolve) => {
    try {
      // Check if Tizen SystemInfo API is available
      if (typeof window.tizen !== 'undefined' && window.tizen.systeminfo) {
        console.log('[Geolocation] ✅ Tizen SystemInfo API detected - getting LOCALE property...');
        
        // Get LOCALE property (official Tizen method)
        window.tizen.systeminfo.getPropertyValue(
          "LOCALE",
          (locale: any) => {
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('[Geolocation] 🔍 TIZEN SYSTEMINFO LOCALE API - DETAILED DEBUG');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('[Geolocation] 📦 Raw Tizen LOCALE object:', locale);
            console.log('[Geolocation] 📦 Locale object type:', typeof locale);
            console.log('[Geolocation] 📦 Locale object keys:', Object.keys(locale));
            console.log('[Geolocation] 📦 Full object JSON:', JSON.stringify(locale, null, 2));
            
            // Log all properties
            console.log('--- ALL LOCALE PROPERTIES ---');
            for (const key in locale) {
              console.log(`[Geolocation]   ${key}:`, locale[key], `(type: ${typeof locale[key]})`);
            }
            console.log('--- END PROPERTIES ---');
            
            // Extract country code from locale
            // Tizen may return "en_US", "de_DE", etc. - extract the part after underscore
            console.log('[Geolocation] 🔎 Extracting country code from locale.country:', locale.country);
            let countryCode = locale.country;
            
            if (countryCode && countryCode.includes('_')) {
              // Extract region code after underscore: "en_US" → "US"
              const parts = countryCode.split('_');
              const originalCode = countryCode;
              countryCode = parts[1];
              console.log('[Geolocation] 🔧 Parsing locale string:', originalCode);
              console.log('[Geolocation] 🔧 Split parts:', parts);
              console.log('[Geolocation] 🔧 Language part (parts[0]):', parts[0]);
              console.log('[Geolocation] 🔧 Country part (parts[1]):', parts[1]);
              console.log('[Geolocation] ✂️ Extracted country code:', originalCode, '→', countryCode);
            } else {
              console.log('[Geolocation] ℹ️ No underscore found in country code, using as-is:', countryCode);
            }
            
            // Check other possible properties that might have country info
            if (locale.language) {
              console.log('[Geolocation] 🌐 locale.language:', locale.language);
            }
            if (locale.region) {
              console.log('[Geolocation] 🌍 locale.region:', locale.region);
            }
            if (locale.timezone) {
              console.log('[Geolocation] 🕐 locale.timezone:', locale.timezone);
            }
            
            if (countryCode && countryCode.length === 2) {
              const upperCode = countryCode.toUpperCase();
              const countryName = COUNTRY_CODE_TO_NAME[upperCode];
              
              if (!countryName) {
                console.warn('[Geolocation] ⚠️ Tizen SystemInfo returned unmapped country code:', upperCode, '(using code as name)');
              }
              
              console.log('[Geolocation] ✅ FINAL RESULT - Country detected:', countryName || upperCode, upperCode);
              console.log('[Geolocation] ✅ Detection method: tizen-systeminfo (official Tizen API)');
              console.log('═══════════════════════════════════════════════════════════════');
              resolve({
                countryName: countryName || upperCode,
                countryCode: upperCode,
                detectionMethod: 'tizen-systeminfo',
                success: true,
              });
            } else {
              console.warn('[Geolocation] ⚠️ INVALID COUNTRY CODE:', locale.country);
              console.warn('[Geolocation] ⚠️ Expected 2-letter code, got:', countryCode, `(length: ${countryCode?.length || 0})`);
              console.log('═══════════════════════════════════════════════════════════════');
              resolve(null);
            }
          },
          (error: Error) => {
            console.error('═══════════════════════════════════════════════════════════════');
            console.error('[Geolocation] ❌ TIZEN SYSTEMINFO LOCALE API ERROR');
            console.error('[Geolocation] ❌ Error:', error);
            console.error('[Geolocation] ❌ Error message:', error.message);
            console.error('[Geolocation] ❌ Error stack:', error.stack);
            console.error('═══════════════════════════════════════════════════════════════');
            resolve(null);
          }
        );
        
        // Set timeout to prevent hanging (2 seconds max)
        setTimeout(() => {
          console.warn('[Geolocation] ⏱️ Tizen SystemInfo LOCALE timeout - falling back');
          resolve(null);
        }, 2000);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error('[Geolocation] ❌ Tizen SystemInfo check failed:', error);
      resolve(null);
    }
  });
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
        const upperCode = countryCode.toUpperCase();
        const countryName = COUNTRY_CODE_TO_NAME[upperCode];
        
        // CRITICAL FIX: Accept ANY valid 2-letter code even if we don't have a friendly name
        if (!countryName) {
          console.warn('[Geolocation] ⚠️ Samsung Tizen returned unmapped country code:', upperCode, '(using code as name)');
        }
        
        console.log('[Geolocation] ✅ Samsung Tizen country detected:', countryName || upperCode, upperCode);
        return {
          countryName: countryName || upperCode, // Use code as fallback name
          countryCode: upperCode,
          detectionMethod: 'samsung-tv',
          success: true,
        };
      }
    }
  } catch (error) {
    console.error('[Geolocation] ❌ Samsung Tizen detection failed:', error);
  }
  
  return null;
}

// Extended 3-letter to 2-letter ISO country code mapping for LG webOS (comprehensive)
const ISO3_TO_ISO2: Record<string, string> = {
  // Americas
  'USA': 'US', 'CAN': 'CA', 'MEX': 'MX', 'BRA': 'BR', 'ARG': 'AR', 'CHL': 'CL',
  'COL': 'CO', 'PER': 'PE', 'VEN': 'VE', 'ECU': 'EC', 'URY': 'UY', 'PRY': 'PY', 'BOL': 'BO',
  // Europe
  'GBR': 'GB', 'DEU': 'DE', 'FRA': 'FR', 'ESP': 'ES', 'ITA': 'IT', 'PRT': 'PT',
  'NLD': 'NL', 'BEL': 'BE', 'AUT': 'AT', 'CHE': 'CH', 'SWE': 'SE', 'NOR': 'NO',
  'DNK': 'DK', 'FIN': 'FI', 'POL': 'PL', 'CZE': 'CZ', 'HUN': 'HU', 'ROU': 'RO',
  'GRC': 'GR', 'IRL': 'IE', 'SVK': 'SK', 'SVN': 'SI', 'HRV': 'HR', 'BGR': 'BG',
  'LTU': 'LT', 'LVA': 'LV', 'EST': 'EE', 'SRB': 'RS', 'UKR': 'UA', 'ISL': 'IS',
  'LUX': 'LU', 'RUS': 'RU', 'BLR': 'BY', 'MDA': 'MD', 'ALB': 'AL', 'MKD': 'MK', // CRITICAL: Russia and others
  'MNE': 'ME', 'BIH': 'BA', 'MLT': 'MT', 'CYP': 'CY',
  // Middle East & Africa
  'TUR': 'TR', 'ISR': 'IL', 'SAU': 'SA', 'ARE': 'AE', 'ZAF': 'ZA', 'EGY': 'EG',
  'MAR': 'MA', 'NGA': 'NG', 'KEN': 'KE', 'ETH': 'ET', 'DZA': 'DZ', 'TUN': 'TN',
  'LBY': 'LY', 'GHA': 'GH', 'CIV': 'CI', 'SEN': 'SN',
  // Asia
  'CHN': 'CN', 'JPN': 'JP', 'KOR': 'KR', 'IND': 'IN', 'THA': 'TH', 'VNM': 'VN',
  'IDN': 'ID', 'MYS': 'MY', 'SGP': 'SG', 'PHL': 'PH', 'PAK': 'PK', 'BGD': 'BD',
  'IRN': 'IR', 'IRQ': 'IQ', 'TWN': 'TW', 'HKG': 'HK', 'KAZ': 'KZ', 'UZB': 'UZ',
  'AZE': 'AZ', 'GEO': 'GE', 'ARM': 'AM', 'LKA': 'LK', 'MMR': 'MM', 'KHM': 'KH',
  'LAO': 'LA', 'NPL': 'NP', 'MNG': 'MN',
  // Oceania
  'AUS': 'AU', 'NZL': 'NZ', 'FJI': 'FJ',
};

/**
 * Detect country using LG webOS systemInfo API
 * Note: webOS.systemInfo provides synchronous access to country codes
 */
function detectLGWebOSCountry(): GeoLocationResult | null {
  try {
    // Check if LG webOS systemInfo is available
    if (typeof window.webOS !== 'undefined' && window.webOS.systemInfo) {
      let countryCode: string | null = null;
      
      // Priority 1: smartServiceCountry (2-letter code, e.g., 'GB', 'US')
      if (window.webOS.systemInfo.smartServiceCountry) {
        countryCode = window.webOS.systemInfo.smartServiceCountry;
        console.log('[Geolocation] LG webOS smartServiceCountry:', countryCode);
      }
      
      // Priority 2: smartServiceCountryCode2 (2-letter code - CRITICAL: was missing)
      if (!countryCode && window.webOS.systemInfo.smartServiceCountryCode2) {
        countryCode = window.webOS.systemInfo.smartServiceCountryCode2;
        console.log('[Geolocation] LG webOS smartServiceCountryCode2:', countryCode);
      }
      
      // Priority 3: country (3-letter code, convert to 2-letter, e.g., 'KOR' -> 'KR')
      if (!countryCode && window.webOS.systemInfo.country) {
        const rawCountry = window.webOS.systemInfo.country;
        console.log('[Geolocation] LG webOS country (3-letter):', rawCountry);
        
        // Try mapping first
        countryCode = ISO3_TO_ISO2[rawCountry];
        
        // If already 2-letter, use as-is
        if (!countryCode && rawCountry.length === 2) {
          countryCode = rawCountry;
          console.log('[Geolocation] LG webOS country already 2-letter:', countryCode);
        }
        
        // CRITICAL FIX: If 3-letter code not in mapping, use first 2 chars as fallback
        // This ensures we NEVER discard a valid native detection
        if (!countryCode && rawCountry.length === 3) {
          countryCode = rawCountry.substring(0, 2);
          console.warn('[Geolocation] ⚠️ LG webOS 3-letter code not in mapping:', rawCountry, '→ using first 2 chars:', countryCode);
        }
      }
      
      // CRITICAL FIX: Accept ANY valid 2-letter code even if we don't have a friendly name
      if (countryCode && countryCode.length === 2) {
        const upperCode = countryCode.toUpperCase();
        const countryName = COUNTRY_CODE_TO_NAME[upperCode];
        
        if (!countryName) {
          console.warn('[Geolocation] ⚠️ LG webOS returned unmapped country code:', upperCode, '(using code as name)');
        }
        
        console.log('[Geolocation] ✅ LG webOS country detected:', countryName || upperCode, upperCode);
        return {
          countryName: countryName || upperCode, // Use code as fallback name
          countryCode: upperCode,
          detectionMethod: 'lg-webos',
          success: true,
        };
      } else {
        console.warn('[Geolocation] ⚠️ LG webOS systemInfo available but no valid country code found');
      }
    }
  } catch (error) {
    console.error('[Geolocation] ❌ LG webOS detection failed:', error);
  }
  
  return null;
}

/**
 * Detect browser language and map to country (fallback)
 * Enhanced to parse region code from locale (e.g., de-AT, de-DE, en-GB)
 */
function detectLanguageBasedCountry(): GeoLocationResult {
  try {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    console.log('[Geolocation] 📍 Browser locale detected:', browserLang);
    
    // Try to extract region code from locale (e.g., "de-AT" -> "AT", "en-GB" -> "GB")
    if (browserLang.includes('-')) {
      const parts = browserLang.split('-');
      const regionCode = parts[1]?.toUpperCase();
      
      // Check if region code is a valid country code
      if (regionCode && regionCode.length === 2 && COUNTRY_CODE_TO_NAME[regionCode]) {
        const countryName = COUNTRY_CODE_TO_NAME[regionCode];
        console.log('[Geolocation] ✅ Region code detected from locale:', countryName, regionCode);
        return {
          countryName,
          countryCode: regionCode,
          detectionMethod: 'language-fallback',
          success: true,
        };
      } else if (regionCode && regionCode.length === 2) {
        // Valid 2-letter code but not in our mapping - use it anyway
        console.warn('[Geolocation] ⚠️ Unmapped region code from locale:', regionCode, '(using as country code)');
        return {
          countryName: regionCode,
          countryCode: regionCode,
          detectionMethod: 'language-fallback',
          success: true,
        };
      }
    }
    
    // Fallback to language-only mapping if no valid region code
    const langCode = browserLang.toLowerCase().substring(0, 2);
    const countryInfo = LANGUAGE_TO_COUNTRY[langCode] || LANGUAGE_TO_COUNTRY['en'];
    
    console.log('[Geolocation] 🔄 Language-only fallback:', countryInfo.name, countryInfo.code);
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
 * Main hybrid geolocation function (synchronous)
 * Tries multiple detection methods in priority order
 * Note: Does NOT include Tizen SystemInfo (async) - use detectCountryAsync() for that
 */
export function detectCountry(): GeoLocationResult {
  console.log('[Geolocation] 🌍 Starting hybrid country detection (synchronous)...');
  
  // Priority 1: Samsung Tizen productinfo API (instant, accurate)
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
 * Async version of hybrid geolocation - tries Tizen SystemInfo LOCALE API first
 * Use this for better Tizen TV detection
 */
export async function detectCountryAsync(): Promise<GeoLocationResult> {
  console.log('[Geolocation] 🌍 Starting hybrid country detection (async with Tizen SystemInfo)...');
  
  // Priority 1: Tizen SystemInfo LOCALE API (official Tizen method - ASYNC)
  const tizenSystemInfoResult = await detectTizenSystemInfoCountryAsync();
  if (tizenSystemInfoResult) {
    return tizenSystemInfoResult;
  }
  
  // Priority 2: Samsung Tizen productinfo API (instant, accurate)
  const samsungResult = detectSamsungTizenCountry();
  if (samsungResult) {
    return samsungResult;
  }
  
  // Priority 3: LG webOS native API (instant, accurate)
  const lgResult = detectLGWebOSCountry();
  if (lgResult) {
    return lgResult;
  }
  
  // Priority 4: Language-based fallback (always works)
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

// Type declarations for Samsung/LG/Tizen APIs
declare global {
  interface Window {
    tizen?: {
      systeminfo?: {
        getPropertyValue: (property: string, successCallback: (value: any) => void, errorCallback?: (error: Error) => void) => void;
        addPropertyValueChangeListener: (property: string, successCallback: (value: any) => void, errorCallback?: (error: Error) => void) => number;
        removePropertyValueChangeListener: (listenerId: number) => void;
      };
    };
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
        country?: string; // 3-letter ISO code (e.g., 'KOR', 'FRA')
        smartServiceCountry?: string; // 2-letter ISO code (e.g., 'GB', 'US')
        smartServiceCountryCode2?: string; // Alternative 2-letter code
        locale?: string;
        language?: string;
      };
    };
  }
}
