#!/bin/bash
set -e

echo "Building Mega Radio LG webOS App..."

OUT_DIR="../dist-webos"

echo "Cleaning old webOS build and Vite caches..."
rm -rf "$OUT_DIR" .vite/ node_modules/.vite/

echo "Cleaning previous Vite dist..."
rm -rf dist/

echo "Building React bundle with Vite..."
export VITE_GA_MEASUREMENT_ID="${VITE_GA_MEASUREMENT_ID:-G-DF0C084RHN}"
echo "Google Analytics ID: $VITE_GA_MEASUREMENT_ID"
vite build --config vite.config.tv.ts | tee /tmp/vite-build-webos.log

VITE_JS_FILE=$(grep -oP 'dist/public/assets/index-[^.]+\.js' /tmp/vite-build-webos.log | head -1 | xargs basename)
echo "Vite bundle: assets/${VITE_JS_FILE}"

TIMESTAMP=$(date +%s%3N)
NEW_JS_FILE="index-${TIMESTAMP}.js"
echo "Renaming bundle to: assets/${NEW_JS_FILE}"

mkdir -p "$OUT_DIR/assets" "$OUT_DIR/css" "$OUT_DIR/js" "$OUT_DIR/images" "$OUT_DIR/webOSTVjs-1.2.0"

echo "Copying JS bundle..."
cp "dist/public/assets/${VITE_JS_FILE}" "$OUT_DIR/assets/${NEW_JS_FILE}"

echo "Copying CSS..."
cp dist/public/assets/*.css "$OUT_DIR/assets/" 2>/dev/null || true
cp css/tv-styles.css "$OUT_DIR/css/" 2>/dev/null || true

echo "Copying TV scripts..."
cp js/platform-detect.js "$OUT_DIR/js/" 2>/dev/null || true
cp js/tv-spatial-navigation.js "$OUT_DIR/js/" 2>/dev/null || true
cp js/tv-remote-keys.js "$OUT_DIR/js/" 2>/dev/null || true
cp js/tv-audio-player.js "$OUT_DIR/js/" 2>/dev/null || true
cp js/polyfills.js "$OUT_DIR/js/" 2>/dev/null || true

echo "Copying webOS SDK..."
cp webOSTVjs-1.2.0/webOSTV.js "$OUT_DIR/webOSTVjs-1.2.0/" 2>/dev/null || true
cp webOSTVjs-1.2.0/webOSTV-dev.js "$OUT_DIR/webOSTVjs-1.2.0/" 2>/dev/null || true
cp webOSTVjs-1.2.0/LICENSE-2.0.txt "$OUT_DIR/webOSTVjs-1.2.0/" 2>/dev/null || true

echo "Copying images..."
cp -r images/* "$OUT_DIR/images/" 2>/dev/null || true

echo "Fixing misnamed SVG files..."
for f in "$OUT_DIR/images/"*.png; do
  [ -e "$f" ] || continue
  if file "$f" 2>/dev/null | grep -q "SVG"; then
    mv "$f" "${f%.png}.svg"
  fi
done

echo "Copying webOS metadata (appinfo.json + icon)..."
cp appinfo.json "$OUT_DIR/"
cp icon.png "$OUT_DIR/" 2>/dev/null || true

echo "Generating index.html for webOS..."
cp index.template.html "$OUT_DIR/index.html"
sed -i "s|/src/main.tsx|assets/${NEW_JS_FILE}|g" "$OUT_DIR/index.html"
sed -i 's|<script type="module" |<script |g' "$OUT_DIR/index.html"
sed -i "s|src=\"\\./js/platform-detect.js\"|src=\"./js/platform-detect.js?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|src=\"\\./js/tv-spatial-navigation.js\"|src=\"./js/tv-spatial-navigation.js?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|src=\"\\./js/tv-remote-keys.js\"|src=\"./js/tv-remote-keys.js?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|src=\"\\./js/tv-audio-player.js\"|src=\"./js/tv-audio-player.js?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|src=\"\\./js/polyfills.js\"|src=\"./js/polyfills.js?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|href=\"\\./assets/style.css\"|href=\"./assets/style.css?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"
sed -i "s|href=\"\\./css/tv-styles.css\"|href=\"./css/tv-styles.css?v=${TIMESTAMP}\"|g" "$OUT_DIR/index.html"

echo ""
echo "LG webOS build complete!"
echo "Output: $(cd "$OUT_DIR" && pwd)"
echo "Bundle: assets/${NEW_JS_FILE}"
echo "Version: ${TIMESTAMP}"
echo ""
echo "Package with: ares-package $(cd "$OUT_DIR" && pwd)"
