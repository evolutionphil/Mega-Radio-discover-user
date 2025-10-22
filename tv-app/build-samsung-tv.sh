#!/bin/bash

echo "🔨 Building Mega Radio Samsung TV App (LGTV Simple Pattern)..."

# Step 0: Clean old bundles (CRITICAL for Samsung TV cache busting)
echo "🧹 Cleaning old bundles..."
rm -rf assets/*.js
rm -rf dist/public/assets/*.js

# Step 1: Build React app with Vite (TV-specific IIFE format)
echo "📦 Building React bundle..."
vite build --config vite.config.tv.ts

# Step 2: Extract the hashed bundle filename from Vite output (handle relative paths)
VITE_JS_FILE=$(grep -oP 'src="\./assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="\.\/\|src="\///g' | sed 's/"//g')
echo "✓ Vite bundle: ${VITE_JS_FILE}"

# Step 2.5: RENAME bundle with timestamp for Samsung TV cache busting
TIMESTAMP=$(date +%s%3N)  # Milliseconds timestamp
NEW_JS_FILE="assets/index-${TIMESTAMP}.js"
echo "🔄 Renaming to: ${NEW_JS_FILE} (cache busting)"
mv "dist/public/${VITE_JS_FILE}" "dist/public/${NEW_JS_FILE}"

# Step 3: Copy bundle to assets folder
echo "📂 Copying bundle to assets..."
mkdir -p assets
cp -r dist/public/assets/* assets/

# Step 4: Copy images
echo "📂 Copying images..."
mkdir -p images
cp -r client/public/images/* images/ 2>/dev/null || true

# Step 4.5: Rename misnamed SVG files (they have .png extension but are actually SVG)
echo "🔧 Fixing misnamed SVG files..."
for f in images/ellipse2.png images/waves.png images/monitor.png images/phone.png images/tablet.png; do
  if [ -f "$f" ]; then
    base=$(basename "$f" .png)
    mv "$f" "images/${base}.svg"
  fi
done

# Step 5: Copy TV scripts
echo "📂 Copying TV scripts..."
mkdir -p js css
cp client/public/js/*.js js/ 2>/dev/null || true
cp client/public/css/tv-styles.css css/ 2>/dev/null || true

# Step 6: Copy webOS SDK
cp -r client/public/webOSTVjs-1.2.0 . 2>/dev/null || true

# Step 7: Update index.html with new bundle reference (IN-PLACE)
echo "🔧 Updating index.html with bundle: ${NEW_JS_FILE}"
sed -i "s|assets/index-[^\"]*\.js|${NEW_JS_FILE}|g" index.html
sed -i "s|v=[0-9]*|v=${TIMESTAMP}|g" index.html

# Step 8: Remove type="module" from script tag (IIFE doesn't need it)
echo "🔧 Removing type=\"module\" from script tag..."
sed -i 's|<script type="module" crossorigin|<script|g' index.html

# Step 9: Remove base href (causes path issues on Samsung TV file system)
echo "🔧 Removing base href tag..."
sed -i 's|<base href="/">||g' index.html

# Step 10: Move React bundle script from head to end of body (must load after #root div)
echo "🔧 Moving React script to end of body..."
BUNDLE_SCRIPT=$(grep -o '<script src="\./assets/index-[^"]*\.js"></script>' index.html)
sed -i "s|${BUNDLE_SCRIPT}||g" index.html
# Add polyfills for older Samsung TV browsers
POLYFILLS='<script>if(typeof globalThis==="undefined"){window.globalThis=window;}if(!Object.fromEntries){Object.fromEntries=function(e){var t={};for(var r of e){t[r[0]]=r[1]}return t}}</script>'
sed -i "s|</body>|  ${POLYFILLS}\n  ${BUNDLE_SCRIPT}\n  </body>|g" index.html

echo "✅ Build complete!"
echo ""
echo "📱 Samsung TV App ready in: tv-app/"
echo "   ONE index.html: tv-app/index.html"
echo "   Bundle: ${NEW_JS_FILE} (🆕 NEW FILENAME - cache busted!)"
echo "   Version: ${TIMESTAMP}"
echo ""
echo "🚀 Deploy the entire tv-app/ folder to Samsung TV"
