#!/bin/bash

echo "🔨 Building Mega Radio Samsung TV App..."

# Step 1: Build React app with Vite (TV-specific config)
echo "📦 Step 1: Building React app for Samsung TV (IIFE format)..."
vite build --config vite.config.tv.ts

# Step 2: Copy built assets to assets folder
echo "📂 Step 2: Copying built assets to assets folder..."
mkdir -p assets
cp -r dist/public/assets/* assets/

# Copy figmaAssets to images folder (Samsung TV standard location)
echo "📂 Step 2a: Copying assets to images folder (TV standard location)..."
mkdir -p images
cp -r client/public/figmaAssets/* images/ 2>/dev/null || echo "Warning: figmaAssets not found"

# Copy TV styles CSS
cp client/public/css/tv-styles.css css/tv-styles.css 2>/dev/null || echo "Warning: tv-styles.css not found"

# Copy TV JavaScript files to dist for dev server
echo "📂 Step 2b: Copying TV JavaScript files to dist/public/js..."
mkdir -p dist/public/js
cp js/fetch-polyfill-samsung.js dist/public/js/ 2>/dev/null || echo "Warning: fetch-polyfill not found"
cp js/platform-detect.js dist/public/js/ 2>/dev/null || echo "Warning: platform-detect not found"
cp js/polyfills.js dist/public/js/ 2>/dev/null || echo "Warning: polyfills not found"
cp js/tv-spatial-navigation.js dist/public/js/ 2>/dev/null || echo "Warning: tv-spatial-navigation not found"
cp js/tv-remote-keys.js dist/public/js/ 2>/dev/null || echo "Warning: tv-remote-keys not found"
cp js/tv-audio-player.js dist/public/js/ 2>/dev/null || echo "Warning: tv-audio-player not found"

# Copy any other static assets if they exist
if [ -f "dist/public/vite.svg" ]; then
    cp dist/public/vite.svg ./
fi

# Step 3: Create index.html with all necessary scripts and React app
echo "🔧 Step 3: Creating index.html with React app integration..."

# Extract the actual hashed JS and CSS filenames from Vite's build
VITE_JS_FILE=$(grep -oP 'src="/assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="//g' | sed 's/"//g' | sed 's/^\///g')
VITE_CSS_FILE=$(grep -oP 'href="/assets/index-[^"]+\.css"' dist/public/index.html | sed 's/href="//g' | sed 's/"//g' | sed 's/^\///g')

# Create the index.html for Samsung TV
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <title>Mega Radio</title>
    
    <!-- Ubuntu Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- TV Styles -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/tv-styles.css">
    
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1920px;
            height: 1080px;
            overflow: hidden;
            background-color: #0e0e0e;
            font-family: 'Ubuntu', sans-serif;
        }
        #root {
            width: 100%;
            height: 100%;
        }
    </style>
    <!--VITE_CSS_PLACEHOLDER-->
</head>
<body>
    <div id="root"></div>
    
    <!-- Samsung Tizen TV API (automatically available) -->
    
    <!-- LG webOS SDK (loaded only on LG TVs) -->
    <script type="text/javascript" src="webOSTVjs-1.2.0/webOSTV.js"></script>
    
    <!-- Fetch polyfill for Samsung TV CORS (must load FIRST) -->
    <script type="text/javascript" src="js/fetch-polyfill-samsung.js"></script>
    
    <!-- Polyfills for Samsung Tizen -->
    <script type="text/javascript" src="js/polyfills.js"></script>
    
    <!-- TV Platform Detection -->
    <script type="text/javascript" src="js/platform-detect.js"></script>
    
    <!-- TV Spatial Navigation (must load before remote keys) -->
    <script type="text/javascript" src="js/tv-spatial-navigation.js?v=TIMESTAMP_PLACEHOLDER"></script>
    
    <!-- TV Remote Control Keys -->
    <script type="text/javascript" src="js/tv-remote-keys.js?v=TIMESTAMP_PLACEHOLDER"></script>
    
    <!-- TV Audio Player -->
    <script type="text/javascript" src="js/tv-audio-player.js?v=TIMESTAMP_PLACEHOLDER"></script>
    
    <!--VITE_JS_PLACEHOLDER-->
</body>
</html>
EOF

# Generate timestamp for cache busting
TIMESTAMP=$(date +%s)

# Replace placeholders with actual hashed filenames
# NOTE: Removed type="module" for Samsung Tizen TV compatibility
if [ ! -z "$VITE_JS_FILE" ]; then
    sed -i "s|<!--VITE_JS_PLACEHOLDER-->|<script crossorigin src=\"${VITE_JS_FILE}\"></script>|g" index.html
    echo "✓ Added React JS: ${VITE_JS_FILE} (non-module for TV compatibility)"
fi

if [ ! -z "$VITE_CSS_FILE" ]; then
    sed -i "s|<!--VITE_CSS_PLACEHOLDER-->|<link rel=\"stylesheet\" crossorigin href=\"${VITE_CSS_FILE}\">|g" index.html
    echo "✓ Added React CSS: ${VITE_CSS_FILE}"
fi

# Replace timestamp placeholders for cache busting
sed -i "s|TIMESTAMP_PLACEHOLDER|${TIMESTAMP}|g" index.html
echo "✓ Added cache-busting timestamp: ${TIMESTAMP}"

echo "✅ Build complete!"
echo ""
echo "📱 Samsung Tizen TV App ready in current directory (tv-app/)"
echo ""
echo "To deploy:"
echo "1. Open Tizen Studio"
echo "2. File > Open Projects from File System"
echo "3. Select the 'tv-app' folder"
echo "4. Right-click project > Run As > Tizen Web Application"
echo ""
echo "🎉 Your Samsung TV app is ready!"
