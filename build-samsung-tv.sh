#!/bin/bash

echo "🔨 Building Mega Radio Samsung TV App (LGTV Structure)..."

# Step 0: Clean old bundles in ROOT
echo "🧹 Cleaning old bundles..."
rm -rf assets/*.js
rm -rf dist/public/assets/*.js

# Step 1: Build React app with Vite (TV-specific IIFE format)
echo "📦 Building React bundle..."
vite build --config vite.config.tv.ts

# Step 2: Extract the hashed bundle filename from Vite output
VITE_JS_FILE=$(grep -oP 'src="/assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="//g' | sed 's/"//g' | sed 's/^\///g')
echo "✓ Vite bundle: ${VITE_JS_FILE}"

# Step 2.5: RENAME bundle with timestamp for Samsung TV cache busting
TIMESTAMP=$(date +%s%3N)  # Milliseconds timestamp
NEW_JS_FILE="assets/index-${TIMESTAMP}.js"
echo "🔄 Renaming to: ${NEW_JS_FILE} (cache busting)"
mv "dist/public/${VITE_JS_FILE}" "dist/public/${NEW_JS_FILE}"

# Step 3: Copy bundle to ROOT assets folder
echo "📂 Copying bundle to ROOT assets..."
mkdir -p assets
cp -r dist/public/assets/* assets/

# Step 4: Copy images to ROOT
echo "📂 Copying images to ROOT..."
mkdir -p images
cp -r client/public/images/* images/ 2>/dev/null || true

# Step 5: Copy TV scripts to ROOT
echo "📂 Copying TV scripts to ROOT..."
mkdir -p js css
cp client/public/js/*.js js/ 2>/dev/null || true
cp client/public/css/tv-styles.css css/ 2>/dev/null || true

# Step 6: Copy webOS SDK to ROOT
cp -r client/public/webOSTVjs-1.2.0 . 2>/dev/null || true

# Step 7: Copy index.html to ROOT and update bundle reference
echo "🔧 Copying index.html to ROOT..."
cp tv-app/index.html .
sed -i "s|assets/index-[^\"]*\.js|${NEW_JS_FILE}|g" index.html
sed -i "s|v=[0-9]*|v=${TIMESTAMP}|g" index.html

# Step 8: Copy config.xml to ROOT
cp tv-app/config.xml . 2>/dev/null || true

echo "✅ Build complete!"
echo ""
echo "📱 Samsung TV App ready in ROOT:"
echo "   index.html (with bundle ${NEW_JS_FILE})"
echo "   images/"
echo "   js/"
echo "   css/"
echo "   assets/"
echo "   config.xml"
echo ""
echo "🚀 Deploy the ROOT folder to Samsung TV"
