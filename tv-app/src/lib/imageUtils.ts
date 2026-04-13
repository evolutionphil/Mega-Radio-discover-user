const IMAGE_API_BASE = 'https://api.themegaradio.com';

/**
 * Returns the correct image URL for a station favicon.
 *
 * - Development (Vite dev server): routes through local /api/image-proxy
 *   to handle HTTP→HTTPS and CORS issues in browser.
 * - Production (Samsung TV / LG webOS build): uses the URL directly,
 *   because there is no local server running on the TV device.
 *   TV platforms (Tizen, webOS) have elevated network privileges and
 *   do not enforce browser-style CORS/mixed-content restrictions.
 */
export function resolveStationImageUrl(favicon: string | undefined | null): string | null {
  if (!favicon || favicon === 'null' || favicon.trim() === '') return null;

  var imgUrl = favicon.startsWith('http')
    ? favicon
    : IMAGE_API_BASE + '/api/image/' + encodeURIComponent(favicon);

  if (import.meta.env.DEV) {
    return '/api/image-proxy?url=' + encodeURIComponent(imgUrl);
  }

  return imgUrl;
}
