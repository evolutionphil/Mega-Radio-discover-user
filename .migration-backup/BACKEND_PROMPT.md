# themegaradio.com Backend'e Eklenecek Stream Endpoint'leri - PROMPT

Aşağıdaki prompt'u diğer Replit hesabındaki backend projesine (themegaradio.com) yapıştır.

---

## PROMPT BAŞLANGIÇ

Mevcut Express.js backend'ime 3 yeni API endpoint'i ve 5 yardımcı fonksiyon eklemen gerekiyor. Bu endpoint'ler TV uygulamasının radyo stream'lerini güvenilir şekilde çalmasını sağlıyor. Hiçbir mevcut kodu silme veya değiştirme, sadece yeni endpoint'leri ekle.

### ADIM 1: Import'ları kontrol et

Dosyanın en üstünde `http` ve `https` modüllerinin import edildiğinden emin ol. Eğer yoksa ekle:

```javascript
const http = require('http');
const https = require('https');
```

Eğer proje ES modules kullanıyorsa:
```javascript
import http from 'http';
import https from 'https';
```

### ADIM 2: Bu 5 yardımcı fonksiyonu ekle

Bu fonksiyonları route tanımlamalarından ÖNCE, uygun bir yere ekle (örneğin bir `helpers/streamUtils.js` dosyasına veya route dosyasının içine):

```javascript
// ─── STREAM YARDIMCI FONKSİYONLARI ───────────────────────────

function parsePlaylist(content, contentType, urlStr) {
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
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

function isHLSUrl(urlStr, contentType) {
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
  return lowerUrl.endsWith('.m3u8') || lowerType.includes('x-mpegurl') || lowerType.includes('vnd.apple.mpegurl');
}

function isPlaylistUrl(urlStr, contentType) {
  if (isHLSUrl(urlStr, contentType)) return false;
  const lowerUrl = urlStr.toLowerCase();
  const lowerType = (contentType || '').toLowerCase();
  return lowerUrl.endsWith('.m3u') || lowerUrl.endsWith('.pls') ||
    lowerType.includes('mpegurl') || lowerType.includes('scpls') || lowerType.includes('x-scpls');
}

function followRedirects(urlStr, maxRedirects, timeout) {
  return new Promise((resolve, reject) => {
    let redirectCount = 0;
    function doRequest(currentUrl) {
      let parsedUrl;
      try { parsedUrl = new URL(currentUrl); } catch { return reject(new Error('Invalid URL: ' + currentUrl)); }
      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.get(currentUrl, { timeout }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          redirectCount++;
          if (redirectCount > maxRedirects) { response.destroy(); return reject(new Error('Too many redirects')); }
          response.destroy();
          const nextUrl = response.headers.location.startsWith('http') ? response.headers.location : new URL(response.headers.location, currentUrl).toString();
          return doRequest(nextUrl);
        }
        resolve({ response, finalUrl: currentUrl, redirectCount });
      });
      req.on('error', (err) => reject(err));
      req.on('timeout', () => { req.destroy(); reject(new Error('Connection timed out')); });
    }
    doRequest(urlStr);
  });
}

function makeHeadRequest(urlStr, maxRedirects, timeout) {
  return new Promise((resolve, reject) => {
    let redirectCount = 0;
    function doRequest(currentUrl) {
      let parsedUrl;
      try { parsedUrl = new URL(currentUrl); } catch { return reject(new Error('Invalid URL: ' + currentUrl)); }
      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.request(currentUrl, { method: 'HEAD', timeout }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          redirectCount++;
          if (redirectCount > maxRedirects) { response.destroy(); return reject(new Error('Too many redirects')); }
          response.destroy();
          const nextUrl = response.headers.location.startsWith('http') ? response.headers.location : new URL(response.headers.location, currentUrl).toString();
          return doRequest(nextUrl);
        }
        resolve({ response, finalUrl: currentUrl, redirectCount });
      });
      req.on('error', (err) => reject(err));
      req.on('timeout', () => { req.destroy(); reject(new Error('Connection timed out')); });
      req.end();
    }
    doRequest(urlStr);
  });
}
```

### ADIM 3: Bu 3 endpoint'i ekle

Mevcut route'ların yanına (örneğin `/api/stations`, `/api/genres` vs. ile aynı dosyaya) bu 3 endpoint'i ekle:

#### ENDPOINT 1: `/api/stream-proxy`

```javascript
app.get('/api/stream-proxy', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  console.log('[STREAM-PROXY] Proxying: ' + streamUrl);

  try {
    const { response, finalUrl } = await followRedirects(streamUrl, 5, 15000);
    const contentType = response.headers['content-type'] || '';

    if (isPlaylistUrl(finalUrl, contentType)) {
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
        try {
          const { response: streamResponse } = await followRedirects(resolvedUrl, 5, 15000);
          const streamContentType = streamResponse.headers['content-type'] || 'audio/mpeg';
          res.setHeader('Content-Type', streamContentType);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          streamResponse.pipe(res);
          req.on('close', () => { streamResponse.destroy(); });
          return;
        } catch (err) {
          if (!res.headersSent) return res.status(502).json({ error: 'Failed to connect to resolved stream' });
          return;
        }
      } else {
        if (!res.headersSent) return res.status(502).json({ error: 'Could not parse playlist' });
        return;
      }
    }

    res.setHeader('Content-Type', contentType || 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    response.pipe(res);
    req.on('close', () => { response.destroy(); });
  } catch (err) {
    console.error('[STREAM-PROXY] Error: ' + err.message);
    if (!res.headersSent) return res.status(502).json({ error: err.message });
  }
});
```

#### ENDPOINT 2: `/api/stream-check`

```javascript
app.get('/api/stream-check', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const startTime = Date.now();

  try {
    let response, finalUrl, redirectCount = 0;

    try {
      const result = await makeHeadRequest(streamUrl, 5, 5000);
      response = result.response;
      finalUrl = result.finalUrl;
      redirectCount = result.redirectCount;
    } catch {
      const result = await followRedirects(streamUrl, 5, 5000);
      response = result.response;
      finalUrl = result.finalUrl;
      redirectCount = result.redirectCount;
      response.destroy();
    }

    const contentType = response.headers['content-type'] || '';
    const statusCode = response.statusCode || 0;
    const isPlaylist = isPlaylistUrl(finalUrl, contentType);
    let resolvedUrl = null;

    if (isPlaylist) {
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
      } catch (e) {}
    }

    res.json({
      ok: statusCode >= 200 && statusCode < 400,
      url: streamUrl,
      finalUrl,
      contentType,
      statusCode,
      isPlaylist,
      resolvedUrl,
      error: null,
      responseTime: Date.now() - startTime
    });
  } catch (err) {
    res.json({
      ok: false,
      url: streamUrl,
      finalUrl: null,
      contentType: null,
      statusCode: null,
      isPlaylist: false,
      resolvedUrl: null,
      error: err.message,
      responseTime: Date.now() - startTime
    });
  }
});
```

#### ENDPOINT 3: `/api/stream-resolve`

```javascript
app.get('/api/stream-resolve', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const { response, finalUrl, redirectCount } = await followRedirects(streamUrl, 5, 10000);
    const contentType = response.headers['content-type'] || '';
    const isHLS = isHLSUrl(finalUrl, contentType);
    const isPlaylist = isPlaylistUrl(finalUrl, contentType) && !isHLS;

    if (isHLS) {
      response.destroy();
      return res.json({ originalUrl: streamUrl, resolvedUrl: finalUrl, contentType, isPlaylist: false, isHLS: true, redirectCount, error: null });
    }

    if (isPlaylist) {
      let playlistData = '';
      response.setEncoding('utf8');
      await new Promise((resolve) => {
        response.on('data', (chunk) => { playlistData += chunk; });
        response.on('end', () => resolve());
        response.on('error', () => resolve());
        setTimeout(() => { response.destroy(); resolve(); }, 5000);
      });

      const resolvedUrl = parsePlaylist(playlistData, contentType, finalUrl);
      return res.json({
        originalUrl: streamUrl,
        resolvedUrl: resolvedUrl || finalUrl,
        contentType: resolvedUrl ? 'audio/mpeg' : contentType,
        isPlaylist: true,
        isHLS: false,
        redirectCount,
        error: resolvedUrl ? null : 'Could not extract stream URL from playlist'
      });
    }

    response.destroy();
    res.json({ originalUrl: streamUrl, resolvedUrl: finalUrl, contentType, isPlaylist: false, isHLS: false, redirectCount, error: null });
  } catch (err) {
    res.json({ originalUrl: streamUrl, resolvedUrl: null, contentType: null, isPlaylist: false, isHLS: false, redirectCount: 0, error: err.message });
  }
});
```

### ADIM 4: Test et

Ekleme tamamlandıktan sonra sunucuyu yeniden başlat ve şu testleri yap:

```bash
# stream-check test
curl "http://localhost:PORT/api/stream-check?url=https://stream.example.com/radio.mp3"

# stream-resolve test  
curl "http://localhost:PORT/api/stream-resolve?url=http://example.com/playlist.m3u"

# stream-proxy test (tarayıcıda aç)
# http://localhost:PORT/api/stream-proxy?url=http://stream.example.com/radio.mp3
```

Her 3 endpoint de çalışıyorsa tamamdır.

### ÖNEMLİ NOTLAR:
- Hiçbir mevcut endpoint'i veya kodu değiştirme
- Bu 3 endpoint'i ve 5 yardımcı fonksiyonu sadece EKle
- Eğer proje TypeScript kullanıyorsa, fonksiyonlara uygun tip tanımlamaları ekle
- Eğer proje bir router dosyası kullanıyorsa (örn: `routes/api.js`), o dosyaya ekle
- Eğer middleware katmanı varsa (auth vs.), bu endpoint'leri auth gerektirmeyen route'lara ekle çünkü TV uygulaması bu endpoint'lere doğrudan erişecek
- CORS header'larının doğru çalıştığından emin ol (`Access-Control-Allow-Origin: *`)

## PROMPT BİTİŞ
