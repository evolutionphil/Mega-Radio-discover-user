# themegaradio.com Backend - Stream Endpoint'leri

Bu dosya, themegaradio.com backend'ine eklenmesi gereken 3 yeni endpoint'i içerir.
Bu endpoint'ler radyo stream'lerinin güvenilir çalışmasını sağlar.

## Ne İşe Yarar?

| Endpoint | Amaç |
|---|---|
| `/api/stream-proxy` | HTTP stream'leri HTTPS üzerinden proxy'ler (mixed content sorunu) |
| `/api/stream-check` | Bir stream URL'sinin erişilebilir olup olmadığını kontrol eder |
| `/api/stream-resolve` | Playlist dosyalarını (.m3u/.pls) çözümler, yönlendirmeleri takip eder |

## Nasıl Çalışır?

```
Kullanıcı radyo çalar
    ↓
URL .m3u veya .pls mi? → EVET → /api/stream-resolve ile gerçek URL'yi bul
    ↓                                    ↓
    HAYIR                          Çözümlenen URL'yi çal
    ↓
URL HTTP mi? (HTTPS sayfada) → EVET → /api/stream-proxy ile proxy'le
    ↓
    HAYIR → Doğrudan çal
    ↓
Hata olursa → 3 deneme:
  1. url_resolved ile dene
  2. url (orijinal) ile dene
  3. /api/stream-proxy ile zorla proxy'le
```

---

## Node.js/Express Kodu

Aşağıdaki kodu doğrudan Express uygulamanıza ekleyebilirsiniz.

```javascript
const http = require('http');
const https = require('https');

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

/**
 * Playlist dosyasını parse eder ve ilk stream URL'sini döndürür.
 * Desteklenen formatlar: M3U, M3U8, PLS
 */
function parsePlaylist(content, contentType, urlStr) {
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
  const isPLS = lowerUrl.endsWith('.pls') || lowerType.includes('scpls') || lowerType.includes('x-scpls');
  const isM3U = lowerUrl.endsWith('.m3u') || lowerUrl.endsWith('.m3u8') || lowerType.includes('mpegurl') || lowerType.includes('x-mpegurl');

  // PLS formatı: File1=http://stream.example.com/radio.mp3
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

  // M3U formatı: # ile başlayanlar yorum, http ile başlayanlar URL
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

/**
 * URL'nin HLS (.m3u8) olup olmadığını kontrol eder.
 * HLS stream'leri playlist olarak parse edilmemeli, doğrudan oynatılmalı.
 */
function isHLSUrl(urlStr, contentType) {
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
  return lowerUrl.endsWith('.m3u8') || lowerType.includes('x-mpegurl') || lowerType.includes('vnd.apple.mpegurl');
}

/**
 * URL'nin playlist (.m3u/.pls) olup olmadığını kontrol eder.
 * HLS (.m3u8) playlist sayılmaz.
 */
function isPlaylistUrl(urlStr, contentType) {
  if (isHLSUrl(urlStr, contentType)) return false;
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
  return lowerUrl.endsWith('.m3u') || lowerUrl.endsWith('.pls') ||
    lowerType.includes('mpegurl') || lowerType.includes('scpls') || lowerType.includes('x-scpls');
}

/**
 * URL'yi takip eder, redirect'leri izler (max 5).
 * GET isteği yapar.
 * @returns Promise<{ response, finalUrl, redirectCount }>
 */
function followRedirects(urlStr, maxRedirects, timeout) {
  return new Promise((resolve, reject) => {
    let redirectCount = 0;

    function doRequest(currentUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(currentUrl);
      } catch {
        return reject(new Error('Invalid URL: ' + currentUrl));
      }

      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.get(currentUrl, { timeout }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          redirectCount++;
          if (redirectCount > maxRedirects) {
            response.destroy();
            return reject(new Error('Too many redirects (>' + maxRedirects + ')'));
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

/**
 * HEAD isteği yapar, redirect'leri izler.
 * Bazı sunucular HEAD'i desteklemez, bu durumda GET'e düşülür.
 */
function makeHeadRequest(urlStr, maxRedirects, timeout) {
  return new Promise((resolve, reject) => {
    let redirectCount = 0;

    function doRequest(currentUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(currentUrl);
      } catch {
        return reject(new Error('Invalid URL: ' + currentUrl));
      }

      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.request(currentUrl, { method: 'HEAD', timeout }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          redirectCount++;
          if (redirectCount > maxRedirects) {
            response.destroy();
            return reject(new Error('Too many redirects (>' + maxRedirects + ')'));
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


// ============================================================
// ENDPOINT 1: /api/stream-proxy
// ============================================================
// HTTP radyo stream'lerini HTTPS üzerinden proxy'ler.
// Mixed content sorununu çözer.
//
// Kullanım: GET /api/stream-proxy?url=http://stream.example.com/radio.mp3
//
// Özellikler:
// - 5 redirect'e kadar takip eder
// - .m3u/.pls playlist'leri otomatik çözümler
// - HLS (.m3u8) doğrudan geçirir (parse etmez)
// - 15 saniye bağlantı timeout
// - CORS header'ları ekler

app.get('/api/stream-proxy', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    console.log('[STREAM-PROXY] Missing url parameter');
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  console.log('[STREAM-PROXY] Proxying stream: ' + streamUrl);

  try {
    const { response, finalUrl } = await followRedirects(streamUrl, 5, 15000);
    const contentType = response.headers['content-type'] || '';
    console.log('[STREAM-PROXY] Connected to ' + finalUrl + ', content-type: ' + contentType);

    // Playlist ise çözümle ve asıl stream URL'sini proxy'le
    if (isPlaylistUrl(finalUrl, contentType)) {
      console.log('[STREAM-PROXY] Detected playlist, resolving...');
      let playlistData = '';
      response.setEncoding('utf8');
      await new Promise((resolve, reject) => {
        response.on('data', (chunk) => { playlistData += chunk; });
        response.on('end', () => resolve());
        response.on('error', (err) => reject(err));
        setTimeout(() => { response.destroy(); resolve(); }, 5000);
      });

      const resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
      if (resolvedUrl) {
        console.log('[STREAM-PROXY] Playlist resolved to: ' + resolvedUrl);
        try {
          const { response: streamResponse, finalUrl: streamFinalUrl } = await followRedirects(resolvedUrl, 5, 15000);
          const streamContentType = streamResponse.headers['content-type'] || 'audio/mpeg';
          console.log('[STREAM-PROXY] Streaming from resolved URL: ' + streamFinalUrl);

          res.setHeader('Content-Type', streamContentType);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');

          streamResponse.pipe(res);
          req.on('close', () => { streamResponse.destroy(); });
          return;
        } catch (err) {
          console.error('[STREAM-PROXY] Error connecting to resolved URL: ' + err.message);
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

    // Doğrudan stream - proxy'le
    res.setHeader('Content-Type', contentType || 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.pipe(res);
    req.on('close', () => { response.destroy(); });
  } catch (err) {
    console.error('[STREAM-PROXY] Error: ' + err.message);
    if (!res.headersSent) {
      return res.status(502).json({ error: 'Failed to connect to stream: ' + err.message });
    }
  }
});


// ============================================================
// ENDPOINT 2: /api/stream-check
// ============================================================
// Bir stream URL'sinin erişilebilir olup olmadığını kontrol eder.
// Önce HEAD isteği yapar, başarısız olursa GET'e düşer.
//
// Kullanım: GET /api/stream-check?url=http://stream.example.com/radio.mp3
//
// Dönen JSON:
// {
//   "ok": true,              // Erişilebilir mi?
//   "url": "...",            // Orijinal URL
//   "finalUrl": "...",       // Redirect sonrası son URL
//   "contentType": "audio/mpeg",
//   "statusCode": 200,
//   "isPlaylist": false,     // .m3u/.pls mi?
//   "resolvedUrl": null,     // Playlist ise çözümlenen URL
//   "error": null,
//   "responseTime": 450      // ms cinsinden yanıt süresi
// }

app.get('/api/stream-check', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    console.log('[STREAM-CHECK] Missing url parameter');
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  console.log('[STREAM-CHECK] Checking stream: ' + streamUrl);
  const startTime = Date.now();

  try {
    let response;
    let finalUrl;
    let redirectCount = 0;

    // Önce HEAD dene (daha hızlı), başarısız olursa GET
    try {
      const result = await makeHeadRequest(streamUrl, 5, 5000);
      response = result.response;
      finalUrl = result.finalUrl;
      redirectCount = result.redirectCount;
      console.log('[STREAM-CHECK] HEAD request succeeded: ' + response.statusCode);
    } catch {
      console.log('[STREAM-CHECK] HEAD failed, falling back to GET');
      const result = await followRedirects(streamUrl, 5, 5000);
      response = result.response;
      finalUrl = result.finalUrl;
      redirectCount = result.redirectCount;
      response.destroy();
      console.log('[STREAM-CHECK] GET request succeeded: ' + response.statusCode);
    }

    const contentType = response.headers['content-type'] || '';
    const statusCode = response.statusCode || 0;
    const isPlaylist = isPlaylistUrl(finalUrl, contentType);
    let resolvedUrl = null;

    // Playlist ise çözümlemeye çalış
    if (isPlaylist) {
      console.log('[STREAM-CHECK] URL is a playlist, attempting to resolve...');
      try {
        const playlistResult = await followRedirects(finalUrl, 5, 5000);
        let playlistData = '';
        playlistResult.response.setEncoding('utf8');
        await new Promise((resolve) => {
          playlistResult.response.on('data', (chunk) => { playlistData += chunk; });
          playlistResult.response.on('end', () => resolve());
          playlistResult.response.on('error', () => resolve());
          setTimeout(() => { playlistResult.response.destroy(); resolve(); }, 3000);
        });
        resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
        if (resolvedUrl) {
          console.log('[STREAM-CHECK] Playlist resolved to: ' + resolvedUrl);
        }
      } catch (playlistErr) {
        console.log('[STREAM-CHECK] Could not resolve playlist: ' + playlistErr.message);
      }
    }

    const responseTime = Date.now() - startTime;
    console.log('[STREAM-CHECK] Check completed in ' + responseTime + 'ms');

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
  } catch (err) {
    const responseTime = Date.now() - startTime;
    console.error('[STREAM-CHECK] Error: ' + err.message);
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


// ============================================================
// ENDPOINT 3: /api/stream-resolve
// ============================================================
// Bir stream URL'sini son haline çözümler.
// Redirect'leri takip eder ve playlist dosyalarını parse eder.
//
// Kullanım: GET /api/stream-resolve?url=http://example.com/radio.m3u
//
// Dönen JSON:
// {
//   "originalUrl": "...",     // Gelen orijinal URL
//   "resolvedUrl": "...",     // Çözümlenen son URL
//   "contentType": "audio/mpeg",
//   "isPlaylist": true,       // Playlist miydi?
//   "isHLS": false,           // HLS (.m3u8) mi?
//   "redirectCount": 2,       // Kaç redirect izlendi
//   "error": null
// }

app.get('/api/stream-resolve', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    console.log('[STREAM-RESOLVE] Missing url parameter');
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  console.log('[STREAM-RESOLVE] Resolving stream: ' + streamUrl);

  try {
    const { response, finalUrl, redirectCount } = await followRedirects(streamUrl, 5, 10000);
    const contentType = response.headers['content-type'] || '';
    console.log('[STREAM-RESOLVE] Followed ' + redirectCount + ' redirects to: ' + finalUrl + ', content-type: ' + contentType);

    const lowerUrl = finalUrl.toLowerCase();
    const isHLS = lowerUrl.endsWith('.m3u8') || contentType.toLowerCase().includes('x-mpegurl');
    const isPlaylist = isPlaylistUrl(finalUrl, contentType) && !isHLS;

    // HLS: doğrudan döndür, parse etme
    if (isHLS) {
      response.destroy();
      console.log('[STREAM-RESOLVE] HLS stream detected, returning as-is');
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

    // Playlist: parse et ve gerçek stream URL'sini bul
    if (isPlaylist) {
      console.log('[STREAM-RESOLVE] Playlist detected, parsing...');
      let playlistData = '';
      response.setEncoding('utf8');
      await new Promise((resolve) => {
        response.on('data', (chunk) => { playlistData += chunk; });
        response.on('end', () => resolve());
        response.on('error', () => resolve());
        setTimeout(() => { response.destroy(); resolve(); }, 5000);
      });

      const resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
      if (resolvedUrl) {
        console.log('[STREAM-RESOLVE] Playlist resolved to: ' + resolvedUrl);
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
        console.log('[STREAM-RESOLVE] Could not extract URL from playlist');
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

    // Doğrudan stream URL: olduğu gibi döndür
    response.destroy();
    console.log('[STREAM-RESOLVE] Direct stream URL: ' + finalUrl);
    res.json({
      originalUrl: streamUrl,
      resolvedUrl: finalUrl,
      contentType,
      isPlaylist: false,
      isHLS: false,
      redirectCount,
      error: null
    });
  } catch (err) {
    console.error('[STREAM-RESOLVE] Error: ' + err.message);
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
```

---

## Frontend Nasıl Kullanıyor?

Frontend bu endpoint'leri şu sırada kullanır:

### 1. Radyo çalma öncesi (playlist çözümleme)
```javascript
// URL .m3u veya .pls ise önce çözümle
if (url.endsWith('.m3u') || url.endsWith('.pls')) {
  const res = await fetch('/api/stream-resolve?url=' + encodeURIComponent(url));
  const data = await res.json();
  url = data.resolvedUrl || url;
}
```

### 2. HTTP stream proxy (mixed content)
```javascript
// HTTPS sayfada HTTP stream çalınamaz, proxy gerekir
if (url.startsWith('http://') && window.location.protocol === 'https:') {
  url = '/api/stream-proxy?url=' + encodeURIComponent(url);
}
```

### 3. Retry stratejisi (hata durumunda)
```
Deneme 1: url_resolved ile çal
Deneme 2: url (orijinal) ile dene
Deneme 3: /api/stream-proxy ile zorla proxy'le
```

---

## Test Örnekleri

```bash
# Stream proxy test
curl "https://themegaradio.com/api/stream-proxy?url=http://stream.example.com/radio.mp3" --max-time 5

# Stream check test
curl "https://themegaradio.com/api/stream-check?url=http://stream.example.com/radio.mp3"

# Stream resolve test (playlist)
curl "https://themegaradio.com/api/stream-resolve?url=http://example.com/radio.m3u"
```

## CORS Header'ları

Tüm endpoint'ler şu header'ları döndürmelidir:
```
Access-Control-Allow-Origin: *
Cache-Control: no-cache
```

`stream-proxy` ek olarak:
```
Connection: keep-alive
Content-Type: (upstream'den gelen veya audio/mpeg)
```
