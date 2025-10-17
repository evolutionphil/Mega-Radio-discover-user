#!/bin/bash

echo "🔨 Building Mega Radio Samsung TV App..."

# Step 1: Build React app with Vite
echo "📦 Step 1: Building React app with Vite..."
npm run build

# Step 2: Copy built assets to tv-app folder
echo "📂 Step 2: Copying built assets to tv-app folder..."
mkdir -p tv-app/assets
cp -r dist/public/assets/* tv-app/assets/

# Copy any other static assets if they exist
if [ -f "dist/public/vite.svg" ]; then
    cp dist/public/vite.svg tv-app/
fi

# Step 3: Create index.html with all necessary scripts and React app
echo "🔧 Step 3: Creating index.html with React app integration..."

# Extract the actual hashed JS and CSS filenames from Vite's build
VITE_JS_FILE=$(grep -oP 'src="/assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="//g' | sed 's/"//g' | sed 's/^\///g')
VITE_CSS_FILE=$(grep -oP 'href="/assets/index-[^"]+\.css"' dist/public/index.html | sed 's/href="//g' | sed 's/"//g' | sed 's/^\///g')

# Create the index.html for Samsung TV
cat > tv-app/index.html << 'EOF'
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
    
    <!-- TV Platform Detection -->
    <script type="text/javascript" src="js/platform-detect.js"></script>
    
    <!-- TV Remote Control Keys -->
    <script type="text/javascript" src="js/tv-remote-keys.js"></script>
    
    <!-- TV Audio Player -->
    <script type="text/javascript" src="js/tv-audio-player.js"></script>
    
    <!--VITE_JS_PLACEHOLDER-->
</body>
</html>
EOF

# Replace placeholders with actual hashed filenames
if [ ! -z "$VITE_JS_FILE" ]; then
    sed -i "s|<!--VITE_JS_PLACEHOLDER-->|<script type=\"module\" crossorigin src=\"${VITE_JS_FILE}\"></script>|g" tv-app/index.html
    echo "✓ Added React JS: ${VITE_JS_FILE}"
fi

if [ ! -z "$VITE_CSS_FILE" ]; then
    sed -i "s|<!--VITE_CSS_PLACEHOLDER-->|<link rel=\"stylesheet\" crossorigin href=\"${VITE_CSS_FILE}\">|g" tv-app/index.html
    echo "✓ Added React CSS: ${VITE_CSS_FILE}"
fi

echo "✅ Build complete!"
echo ""
echo "📱 Samsung Tizen TV App ready at: tv-app/"
echo ""
echo "To deploy:"
echo "1. Open Tizen Studio"
echo "2. File > Open Projects from File System"
echo "3. Select the 'tv-app' folder"
echo "4. Right-click project > Run As > Tizen Web Application"
echo ""
echo "🎉 Your Samsung TV app is ready!"
