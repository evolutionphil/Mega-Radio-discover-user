#!/bin/bash
set -e

echo "🔨 Building Mega Radio Samsung TV App (Country-Filtered Genres v3.0)..."

# Step 0: Restore clean index.html from template
echo "🧹 Restoring clean index.html from template..."
cp index.template.html index.html

# Step 1: Clean old builds and caches
echo "🧹 Cleaning old bundles and caches..."
rm -rf dist/ .vite/ node_modules/.vite/
rm -f assets/index-*.js

# Step 2: Build React app with Vite (TV-specific IIFE format)
echo "📦 Building React bundle with latest code..."
vite build --config vite.config.tv.ts | tee /tmp/vite-build.log

# Step 3: Extract the hashed bundle filename from Vite output
VITE_JS_FILE=$(grep -oP 'dist/public/assets/index-[^.]+\.js' /tmp/vite-build.log | head -1 | xargs basename)
echo "✓ Vite bundle: assets/${VITE_JS_FILE}"

# Step 4: Create timestamp for cache busting
TIMESTAMP=$(date +%s%3N)
NEW_JS_FILE="index-${TIMESTAMP}.js"
echo "🔄 Renaming to: assets/${NEW_JS_FILE} (cache busting)"

# Step 5: Copy bundle to assets/ folder with new name
echo "📂 Copying bundle to assets..."
mkdir -p assets/
cp "dist/public/assets/${VITE_JS_FILE}" "assets/${NEW_JS_FILE}"

# Step 6: Copy CSS
cp dist/public/assets/*.css assets/ 2>/dev/null || true

# Step 7: Copy images
echo "📂 Copying images..."
mkdir -p images/
cp -r dist/public/images/* images/ 2>/dev/null || cp -r ../figmaAssets/* images/ 2>/dev/null || true

# Step 8: Fix misnamed SVG files
echo "🔧 Fixing misnamed SVG files..."
for f in images/*.png; do
  if file "$f" 2>/dev/null | grep -q "SVG"; then
    mv "$f" "${f%.png}.svg"
  fi
done

# Step 9: Copy TV scripts
echo "📂 Copying TV scripts..."
mkdir -p js/
cp -r public/js/* js/ 2>/dev/null || true

# Step 10: DON'T copy dist/public/index.html - it has wrong script order!
# Instead, update our template with the new bundle filename

# Step 11: Update template with cache-busted bundle filename
echo "🔧 Updating index.html with bundle: assets/${NEW_JS_FILE}"
cp index.template.html index.html
sed -i "s|/src/main.tsx|assets/${NEW_JS_FILE}|g" index.html

# Step 12: Remove type="module" from React script tag (Samsung TV doesn't support ES modules)
echo "🔧 Removing type=\"module\" from script tag..."
sed -i 's|<script type="module" |<script |g' index.html

# Step 13: Add cache-busting query params to all script/link tags
echo "🔧 Adding cache-busting to all resources..."
sed -i "s|src=\"\\./js/platform-detect.js\"|src=\"./js/platform-detect.js?v=${TIMESTAMP}\"|g" index.html
sed -i "s|src=\"\\./js/tv-spatial-navigation.js\"|src=\"./js/tv-spatial-navigation.js?v=${TIMESTAMP}\"|g" index.html
sed -i "s|src=\"\\./js/tv-remote-keys.js\"|src=\"./js/tv-remote-keys.js?v=${TIMESTAMP}\"|g" index.html
sed -i "s|src=\"\\./js/tv-audio-player.js\"|src=\"./js/tv-audio-player.js?v=${TIMESTAMP}\"|g" index.html
sed -i "s|href=\"\\./assets/style.css\"|href=\"./assets/style.css?v=${TIMESTAMP}\"|g" index.html
sed -i "s|href=\"\\./css/tv-styles.css\"|href=\"./css/tv-styles.css?v=${TIMESTAMP}\"|g" index.html

echo "✅ Build complete!"
echo ""
echo "🔥 VERSION 3.0 - Country-Filtered Genres Enabled"
echo "📱 Samsung TV App ready in: tv-app/"
echo "   ONE index.html: tv-app/index.html"
echo "   Bundle: assets/${NEW_JS_FILE} (🆕 NEW FILENAME - cache busted!)"
echo "   Version: ${TIMESTAMP}"
echo ""
echo "🚀 Deploy the entire tv-app/ folder to Samsung TV"
echo "   The app will now show country-filtered genres!"
