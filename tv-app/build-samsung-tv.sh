#!/bin/bash

echo "🔨 Building Mega Radio Samsung TV App (LGTV Simple Pattern)..."

# Step 1: Build React app with Vite (TV-specific IIFE format)
echo "📦 Building React bundle..."
vite build --config vite.config.tv.ts

# Step 2: Extract the hashed bundle filename from Vite output
VITE_JS_FILE=$(grep -oP 'src="/assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="//g' | sed 's/"//g' | sed 's/^\///g')
echo "✓ React bundle: ${VITE_JS_FILE}"

# Step 3: Copy bundle to assets folder
echo "📂 Copying bundle to assets..."
mkdir -p assets
cp -r dist/public/assets/* assets/

# Step 4: Copy images
echo "📂 Copying images..."
mkdir -p images
cp -r client/public/images/* images/ 2>/dev/null || true

# Step 5: Copy TV scripts
echo "📂 Copying TV scripts..."
mkdir -p js css
cp client/public/js/*.js js/ 2>/dev/null || true
cp client/public/css/tv-styles.css css/ 2>/dev/null || true

# Step 6: Copy webOS SDK
cp -r client/public/webOSTVjs-1.2.0 . 2>/dev/null || true

# Step 7: Update index.html with new bundle reference (IN-PLACE)
TIMESTAMP=$(date +%s)
echo "🔧 Updating index.html with bundle: ${VITE_JS_FILE}"
sed -i "s|assets/index-[^\"]*\.js|${VITE_JS_FILE}|g" index.html
sed -i "s|v=[0-9]*|v=${TIMESTAMP}|g" index.html

echo "✅ Build complete!"
echo ""
echo "📱 Samsung TV App ready in: tv-app/"
echo "   ONE index.html: tv-app/index.html"
echo "   Bundle: ${VITE_JS_FILE}"
echo "   Version: ${TIMESTAMP}"
echo ""
echo "🚀 Deploy the entire tv-app/ folder to Samsung TV"
