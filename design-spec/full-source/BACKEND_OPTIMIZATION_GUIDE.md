# Backend Optimizasyon Rehberi - themegaradio.com API

## Mevcut Durum ve Sorunlar

TV uygulamasi su anda `themegaradio.com/api/` endpointlerini dogrudan cagiriyor.
Tespit edilen performans sorunlari:

| Sorun | Detay |
|-------|-------|
| Yavas API yaniti | Her istek 5-7 saniye suruyor |
| Buyuk payload | 21 istasyon icin ~576KB veri donuyor |
| Gereksiz alanlar | `descriptions`, `logoAssets`, `createdAt`, `updatedAt` TV'de kullanilmiyor |
| Tekrar eden istekler | Ayni veriler (ulkeler, turler) her sayfa gecisinde tekrar isteniyor |
| Ilk acilis yavas | Uygulama acilisinda 4-5 ayri API istegi yapiliyor |

---

## 1. TV Icin Slim Response Modu (EN ONEMLI)

TV uygulamasi `?tv=1` parametresini zaten gonderiyor. Backend bu parametreyi gordugunde sadece gerekli alanlari dondurmeli.

### TV Uygulamasinin Kullandigi Alanlar (sadece bunlari dondur):

```javascript
// Station objesi icin SADECE bu alanlar gerekli:
const TV_STATION_FIELDS = {
  _id: true,
  name: true,
  slug: true,
  url: true,
  url_resolved: true,   // Cozulmus stream URL'si
  favicon: true,         // Istasyon logosu
  tags: true,
  country: true,
  countrycode: true,
  state: true,
  language: true,
  votes: true,
  clickcount: true,
  codec: true,           // MP3, AAC vb.
  bitrate: true,         // 128, 320 vb.
  hls: true,
};

// GONDERME - TV bunlari kullanmiyor:
const SKIP_FIELDS = [
  'description',
  'descriptions',        // Coklu dil aciklamalari
  'logoAssets',          // Logo varyantlari
  'logoAssetsLarge',
  'createdAt',
  'updatedAt',
  'lastcheckok',
  'lastchecktime',
  'lastcheckoktime',
  'clicktimestamp',
  'clicktrend',
  'geo_lat',
  'geo_long',
  'has_extended_info',
  'ssl_error',
  'languagecodes',
  'changeuuid',
  'stationuuid',
  'homepage',
];
```

### MongoDB Ornegi:

```javascript
// routes/stations.js
router.get('/api/stations', async (req, res) => {
  const isTV = req.query.tv === '1';

  // MongoDB projection - sadece gerekli alanlari getir
  const projection = isTV ? {
    _id: 1, name: 1, slug: 1, url: 1, url_resolved: 1,
    favicon: 1, tags: 1, country: 1, countrycode: 1,
    state: 1, language: 1, votes: 1, clickcount: 1,
    codec: 1, bitrate: 1, hls: 1
  } : {};  // Web icin tum alanlar

  const stations = await Station.find(query, projection)
    .sort(sortCriteria)
    .skip(skip)
    .limit(limit);

  res.json({ stations });
});
```

### Beklenen Etki:
- **Payload boyutu: ~576KB → ~80KB** (her istasyon ~18KB → ~2.5KB)
- **JSON parse suresi: %85 azalma**
- **Ag transfer suresi: %85 azalma**

---

## 2. Redis/In-Memory Cache (COK ONEMLI)

Bazi veriler nadiren degisir. Bunlari cache'leyerek veritabani sorgularini azalt.

### Cache Sureleri:

```javascript
const CACHE_DURATIONS = {
  // Nadiren degisen veriler - uzun cache
  'countries':        24 * 60 * 60,   // 24 saat (ulke listesi hic degismez)
  'genres':           24 * 60 * 60,   // 24 saat (turler nadiren degisir)
  'translations':     7 * 24 * 60 * 60, // 7 gun (ceviriler cok nadir degisir)

  // Orta siklikta degisen veriler
  'popular_stations': 15 * 60,        // 15 dakika
  'genre_stations':   15 * 60,        // 15 dakika
  'country_stations': 15 * 60,        // 15 dakika

  // Sik degisen veriler
  'search_results':   5 * 60,         // 5 dakika
  'station_metadata': 30,             // 30 saniye (Now Playing bilgisi)
};
```

### Redis Ornegi:

```javascript
const redis = require('redis');
const client = redis.createClient();

async function cachedQuery(cacheKey, ttlSeconds, queryFn) {
  // Once cache'e bak
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache yoksa veritabanindan getir
  const result = await queryFn();

  // Cache'e yaz
  await client.setEx(cacheKey, ttlSeconds, JSON.stringify(result));
  return result;
}

// Kullanim ornegi
router.get('/api/countries', async (req, res) => {
  const countries = await cachedQuery(
    'countries:all',
    CACHE_DURATIONS.countries,
    () => Country.find().sort({ name: 1 })
  );
  res.json(countries);
});

router.get('/api/genres', async (req, res) => {
  const country = req.query.country || 'all';
  const genres = await cachedQuery(
    `genres:${country}`,
    CACHE_DURATIONS.genres,
    () => Genre.find(query).sort({ stationCount: -1 })
  );
  res.json({ data: genres });
});

router.get('/api/stations', async (req, res) => {
  const { country, genre, sort, page, limit } = req.query;
  const cacheKey = `stations:${country || 'all'}:${genre || 'all'}:${sort || 'votes'}:${page || 1}:${limit || 21}`;

  const result = await cachedQuery(
    cacheKey,
    CACHE_DURATIONS.popular_stations,
    () => fetchStationsFromDB(req.query)
  );
  res.json(result);
});
```

### Beklenen Etki:
- **Ilk istek:** Ayni (veritabanindan geliyor)
- **Sonraki istekler:** ~5-7 saniye → ~50ms (%99 azalma)
- **Veritabani yuku:** %90 azalma

---

## 3. Toplu Veri Endpoint'i - `/api/tv/init` (ONEMLI)

TV uygulamasi acildiginda 4-5 ayri istek yapiyor. Bunlari tek istekte birlestir.

### Mevcut Durum (TV Acilisinda):

```
Istek 1: GET /api/countries          → 5s
Istek 2: GET /api/genres             → 5s
Istek 3: GET /api/translations/tr    → 3s
Istek 4: GET /api/stations?sort=votes → 6s
Istek 5: GET /api/genres/discoverable → 4s
────────────────────────────────────────
Toplam: ~23 saniye (paralel: ~7s)
```

### Yeni Endpoint:

```javascript
// Tek istekte tum baslangic verilerini dondur
router.get('/api/tv/init', async (req, res) => {
  const lang = req.query.lang || 'en';
  const country = req.query.country || null;

  // Paralel sorgular
  const [countries, genres, translations, popularStations] = await Promise.all([
    cachedQuery('countries:all', 86400, () => Country.find().sort({ name: 1 })),
    cachedQuery(`genres:${country || 'all'}`, 86400, () => fetchGenres(country)),
    cachedQuery(`translations:${lang}`, 604800, () => Translation.findOne({ lang })),
    cachedQuery(`popular:${country || 'all'}`, 900, () => fetchPopularStations(country)),
  ]);

  res.json({
    countries,
    genres,
    translations,
    popularStations,
    cacheAge: Date.now(), // Frontend cache yeniligini kontrol edebilir
  });
});
```

### Frontend Kullanimi (megaRadioApi.ts'e eklenecek):

```typescript
// Tek istekte tum baslangic verilerini al
tvInit: async (lang: string, country?: string): Promise<{
  countries: Country[];
  genres: Genre[];
  translations: any;
  popularStations: Station[];
}> => {
  const params = new URLSearchParams({ lang });
  if (country) params.append('country', country);
  const url = buildApiUrl('/tv/init', params);
  const response = await fetchWithTimeout(url);
  return response.json();
}
```

### Beklenen Etki:
- **Acilis suresi: ~7 saniye → ~2-3 saniye** (tek istek + cache)
- **Ag baglantisi sayisi: 5 → 1**

---

## 4. HTTP Cache Headerlari (KOLAY)

Dogru cache header'lari ekleyerek tarayici/TV cache'ini kullan.

```javascript
// Middleware: cache header'lari ekle
function setCacheHeaders(req, res, next) {
  const path = req.path;

  if (path.startsWith('/api/countries') || path.startsWith('/api/translations')) {
    // Nadiren degisen: 24 saat cache
    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  } else if (path.startsWith('/api/genres')) {
    // Orta: 1 saat cache
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');
  } else if (path.startsWith('/api/stations')) {
    // Dinamik: 5 dakika cache
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  } else if (path.includes('/metadata')) {
    // Canli veri: cache yok
    res.set('Cache-Control', 'no-cache, no-store');
  }

  // CORS header'lari
  res.set('Access-Control-Allow-Origin', '*');
  next();
}

app.use('/api', setCacheHeaders);
```

### Beklenen Etki:
- **Tekrar eden istekler:** Tarayici/TV cache'den alir, sifir ag istegi
- **Samsung TV:** Cache-Control'u destekler, ozellikle ulke ve tur listelerinde etkili

---

## 5. Compression Optimizasyonu (ORTA)

Samsung TV (Chromium 76) gzip decompress'te yavasliyor. TV icin farkli strateji kullan.

```javascript
const compression = require('compression');

// TV disindaki istemciler icin gzip/brotli
app.use('/api', (req, res, next) => {
  if (req.query.tv === '1') {
    // Samsung TV: compression YAPMA
    // Chromium 76 buyuk gzip yanit decompress'te yavasliyor
    next();
  } else {
    // Web/Mobil: compression YAP
    compression({ level: 6 })(req, res, next);
  }
});
```

---

## 6. Veritabani Index'leri (ONEMLI)

Sik kullanilan sorgular icin index ekle:

```javascript
// MongoDB index'leri
db.stations.createIndex({ country: 1, votes: -1 });       // Ulkeye gore populer
db.stations.createIndex({ tags: 1, votes: -1 });           // Ture gore populer
db.stations.createIndex({ name: "text" });                 // Arama
db.stations.createIndex({ votes: -1 });                    // Genel populer
db.stations.createIndex({ clickcount: -1 });               // En cok tiklanan
db.stations.createIndex({ country: 1, tags: 1, votes: -1 }); // Ulke + tur kombinasyonu

db.genres.createIndex({ slug: 1 });                        // Slug ile genre arama
db.genres.createIndex({ stationCount: -1 });               // Populer genre sirasi
```

### Beklenen Etki:
- **Sorgu suresi: ~3-5 saniye → ~100-500ms** (index kullanildiginda)

---

## 7. Pagination Response'a Total Count Ekle

Simdi bazi endpointler toplam sayi donmeden paginated sonuc donuyor. Bu TV'nin "daha fazla var mi?" bilmesini zorlas tiriyor.

```javascript
router.get('/api/genres/:slug/stations', async (req, res) => {
  const { page = 1, limit = 28, country, sort } = req.query;

  const [stations, totalCount] = await Promise.all([
    Station.find(query).sort(sortCriteria).skip(skip).limit(limit),
    Station.countDocuments(query),  // Toplam sayiyi da dondur
  ]);

  res.json({
    stations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    },
    genre: genreData,
  });
});
```

---

## 8. ETag / Conditional Requests

Degismemis verileri tekrar gondermekten kacin:

```javascript
const crypto = require('crypto');

function withETag(req, res, data) {
  const json = JSON.stringify(data);
  const etag = crypto.createHash('md5').update(json).digest('hex');

  res.set('ETag', `"${etag}"`);

  // Istemci ayni veriyi zaten varsa 304 dondur (veri gondermeden)
  if (req.headers['if-none-match'] === `"${etag}"`) {
    res.status(304).end();
    return;
  }

  res.json(data);
}

// Kullanim
router.get('/api/countries', async (req, res) => {
  const countries = await cachedQuery('countries:all', 86400, fetchCountries);
  withETag(req, res, countries);
});
```

---

## Oncelik Sirasi (Nereden Baslamali)

| Oncelik | Optimizasyon | Zorluk | Etki | Tahmini Sure |
|---------|-------------|--------|------|-------------|
| 1 | **Slim Response (`tv=1`)** | Kolay | Cok Yuksek | 2-3 saat |
| 2 | **Redis Cache** | Orta | Cok Yuksek | 4-6 saat |
| 3 | **DB Index'leri** | Kolay | Yuksek | 30 dakika |
| 4 | **HTTP Cache Header'lari** | Kolay | Orta | 1 saat |
| 5 | **`/api/tv/init` Endpoint** | Orta | Yuksek | 3-4 saat |
| 6 | **Pagination Total Count** | Kolay | Orta | 1 saat |
| 7 | **Compression Kontrolu** | Kolay | Dusuk-Orta | 30 dakika |
| 8 | **ETag Support** | Orta | Orta | 2 saat |

---

## Hizli Baslangi c: Minimum Degisiklikler, Maksimum Etki

Sadece ilk 3 maddeyi uygulasan bile buyuk fark gorursun:

### Adim 1: Slim Response (2 saat)
MongoDB projection ile `tv=1` oldugunda sadece 17 alan dondur.
**Sonuc: Payload %85 kuculur.**

### Adim 2: Redis Cache (4 saat)
Countries, genres, translations icin Redis cache ekle.
**Sonuc: Tekrar eden istekler 50ms'de donser.**

### Adim 3: DB Index (30 dakika)
`{ country: 1, votes: -1 }` ve `{ tags: 1, votes: -1 }` index'lerini ekle.
**Sonuc: Ilk sorgular bile 3-5s yerine 100-500ms surer.**

### Toplam Etki:
- **Ilk sayfa yukleme: ~7s → ~1-2s**
- **Sonraki sayfa gecisleri: ~5s → ~100ms**
- **TV uygulama deneyimi: Dramatik iyilesme**

---

## TV Uygulamasinda Yapilan Mevcut Frontend Optimizasyonlari

Referans olarak, TV tarafinda su optimizasyonlar zaten yapildi:

1. **`fetchWithTimeout(12s)`** - API cevap vermezse 12 saniyede iptal eder
2. **`slimStation()`** - Gelen buyuk objelerin gereksiz alanlarini siler (frontend tarafinda)
3. **TanStack Query Cache** - Ulkeler 30 gun, turler 7 gun, istasyonlar 24 saat cache
4. **Genre Prefetch** - Turler sayfasinda ilk 4 turun istasyonlari arkaplanda yuklenir
5. **Skeleton Loader** - Yukleme sirasinda animasyonlu placeholder kartlar gosterilir

Bu frontend optimizasyonlari frontend'deki gereksiz isleri azaltiyor, ama **gercek hiz kazanimi backend'den gelecek** cunku darbogazin kaynagi API yanit suresi ve payload boyutu.

---

## API Endpoint Listesi (TV Uygulamasinin Kullandiklari)

| Endpoint | Aciklama | Oneri |
|----------|----------|-------|
| `GET /api/stations` | Istasyon listesi (filtreleme, siralama, sayfalama) | Slim + Cache + Index |
| `GET /api/station/:id` | Tek istasyon detayi | Slim + Cache (5dk) |
| `GET /api/stations/similar/:id` | Benzer istasyonlar | Slim + Cache (15dk) |
| `GET /api/stations/:id/metadata` | Now Playing bilgisi | Cache YAPMA |
| `GET /api/genres` | Tur listesi (filtreli) | Cache (24s) |
| `GET /api/genres/slug/:slug` | Slug ile tur detayi | Cache (24s) |
| `GET /api/genres/:slug/stations` | Ture gore istasyonlar | Slim + Cache (15dk) |
| `GET /api/genres/discoverable` | Kesfedilebilir turler | Cache (24s) |
| `GET /api/countries` | Ulke listesi | Cache (24s) - Neredeyse hic degismez |
| `GET /api/languages` | Dil listesi | Cache (24s) |
| `GET /api/translations/:lang` | Ceviri dosyasi | Cache (7 gun) |
| `GET /api/radio-browser/top-clicked` | En cok tiklanan | Cache (15dk) |
| `GET /api/radio-browser/top-voted` | En cok oylanan | Cache (15dk) |
| `GET /api/radio-browser/recent` | Son eklenenler | Cache (15dk) |
| `GET /api/stations/nearby` | Yakin istasyonlar | Cache (15dk) |

---

## `?tv=1` Parametresi

TV uygulamasi Samsung TV oldugunu tespit ettiginde tum isteklere `?tv=1` ekliyor.
Backend bu parametreyi kullanarak:

1. **Sadece gerekli alanlari dondur** (projection)
2. **Compression yapma** (Samsung TV'de gzip yavaslik yapar)
3. **Daha agresif cache kullan** (TV kullanicilari daha az dinamik icerik bekler)
