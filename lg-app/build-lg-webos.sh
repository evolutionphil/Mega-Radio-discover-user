#!/bin/bash

# Mega Radio - LG webOS TV Build Script
# This script builds the React app and prepares it for LG webOS deployment

set -e

echo "🔨 Building Mega Radio LG webOS App..."

# Clean old bundles
echo "🧹 Cleaning old bundles..."
rm -rf lg-app/dist
rm -f lg-app/assets/*.js
rm -f lg-app/assets/*.css

# Build React bundle with Vite (LGTV compatible settings)
echo "📦 Building React bundle for LG webOS..."
VITE_TV_PLATFORM=lg npm run build -- --outDir=lg-app/dist/public --base=./

# Check if build succeeded
if [ ! -f "lg-app/dist/public/index.html" ]; then
  echo "❌ Build failed - no index.html found"
  exit 1
fi

# Find the bundle filename (Vite generates hash)
BUNDLE_FILE=$(ls lg-app/dist/public/assets/index-*.js | head -1 | xargs basename)
echo "✓ Vite bundle: assets/$BUNDLE_FILE"

# Rename with timestamp for cache busting
TIMESTAMP=$(date +%s%3N)
NEW_BUNDLE="index-${TIMESTAMP}.js"
mv "lg-app/dist/public/assets/$BUNDLE_FILE" "lg-app/dist/public/assets/$NEW_BUNDLE"
echo "🔄 Renaming to: assets/$NEW_BUNDLE (cache busting)"

# Copy bundle to lg-app/assets
echo "📂 Copying bundle to assets..."
cp "lg-app/dist/public/assets/$NEW_BUNDLE" lg-app/assets/

# Copy images
echo "📂 Copying images..."
rm -rf lg-app/images/*
cp -r tv-app/images/* lg-app/images/ 2>/dev/null || true

# Create placeholder icons if they don't exist
if [ ! -f "lg-app/images/icon-80.png" ]; then
  echo "🎨 Creating placeholder icon-80.png..."
  # Create a simple pink square as placeholder
  convert -size 80x80 xc:"#ff4199" lg-app/images/icon-80.png 2>/dev/null || echo "⚠️  ImageMagick not found - please add icon-80.png manually"
fi

if [ ! -f "lg-app/images/icon-130.png" ]; then
  echo "🎨 Creating placeholder icon-130.png..."
  convert -size 130x130 xc:"#ff4199" lg-app/images/icon-130.png 2>/dev/null || echo "⚠️  ImageMagick not found - please add icon-130.png manually"
fi

if [ ! -f "lg-app/images/bg.png" ]; then
  echo "🎨 Creating placeholder bg.png..."
  convert -size 1920x1080 xc:"#0e0e0e" lg-app/images/bg.png 2>/dev/null || echo "⚠️  ImageMagick not found - please add bg.png manually"
fi

# Copy TV scripts
echo "📂 Copying TV scripts..."
cp tv-app/js/tv-keys.js lg-app/js/
cp tv-app/js/tv-audio-player.js lg-app/js/
cp tv-app/js/tv-polyfills.js lg-app/js/

# Create index.html for LG webOS
echo "🔧 Creating index.html for LG webOS..."
cat > lg-app/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920, height=1080, user-scalable=no">
  <title>Mega Radio TV</title>
  <style>
    html, body {
      width: 1920px;
      height: 1080px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #0e0e0e;
      cursor: none;
      -webkit-user-select: none;
      user-select: none;
    }
    * { cursor: none !important; }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- LG webOS SDK -->
  <script src="js/webOSTVjs-1.2.0/webOSTV.js"></script>
  
  <!-- TV Polyfills & Utilities -->
  <script src="js/tv-polyfills.js"></script>
  <script src="js/tv-keys.js"></script>
  <script src="js/tv-audio-player.js"></script>
  
  <!-- React Bundle -->
  <script src="BUNDLE_PLACEHOLDER"></script>
</body>
</html>
HTMLEOF

# Update bundle reference in index.html
echo "🔧 Updating index.html with bundle: assets/$NEW_BUNDLE"
sed -i "s|BUNDLE_PLACEHOLDER|assets/$NEW_BUNDLE|g" lg-app/index.html

echo "✅ Build complete!"
echo ""
echo "📱 LG webOS App ready in: lg-app/"
echo "   appinfo.json: lg-app/appinfo.json"
echo "   index.html: lg-app/index.html"
echo "   Bundle: assets/$NEW_BUNDLE (🆕 NEW FILENAME - cache busted!)"
echo "   Version: $TIMESTAMP"
echo ""
echo "🚀 To package for LG TV:"
echo "   cd lg-app"
echo "   ares-package ."
echo "   ares-install --device <TV_NAME> com.megaradio.tv_1.0.0_all.ipk"
echo ""
