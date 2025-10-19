#!/bin/bash

echo "🔨 Building Mega Radio TV App (LGTV Flat Structure)..."

# Step 1: Clean output folder
echo "🧹 Cleaning tv-app folder..."
rm -rf tv-app
mkdir -p tv-app

# Step 2: Build React app with Vite
echo "📦 Building React bundle..."
vite build --config vite.config.tv.ts

# Step 3: Move compiled bundle to tv-app/assets/
echo "📂 Moving bundle to tv-app/assets/..."
mkdir -p tv-app/assets
cp -r dist/public/assets/* tv-app/assets/

# Step 4: Copy FLAT structure to tv-app root
echo "📂 Creating LGTV flat structure..."

# Copy css/ folder
cp -r client/public/css tv-app/

# Copy js/ folder  
cp -r client/public/js tv-app/

# Copy images/ folder
cp -r client/public/images tv-app/

# Copy webOS SDK
cp -r client/public/webOSTVjs-1.2.0 tv-app/

# Step 5: Create index.html at root
echo "🔧 Creating root index.html..."
cat > tv-app/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega Radio - TV App</title>
    
    <!-- TV Styles -->
    <link rel="stylesheet" href="css/tv-styles.css">
    
    <!-- webOS SDK -->
    <script src="webOSTVjs-1.2.0/webOSTV.js"></script>
</head>
<body>
    <div id="root"></div>
    
    <!-- TV Scripts (loaded before React) -->
    <script src="js/polyfills.js"></script>
    <script src="js/tv-keys.js"></script>
    <script src="js/tv-spatial-nav.js"></script>
    <script src="js/tv-audio-player.js"></script>
    
    <!-- React App Bundle -->
    <script type="module" src="assets/index.js"></script>
</body>
</html>
EOF

# Step 6: Copy config files
echo "📄 Copying config files..."
cat > tv-app/appinfo.json << 'EOF'
{
  "id": "com.megaradio.tvapp",
  "version": "1.0.0",
  "vendor": "Mega Radio",
  "type": "web",
  "main": "index.html",
  "title": "Mega Radio",
  "icon": "icon.png",
  "largeIcon": "icon.png"
}
EOF

cat > tv-app/config.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://megaradio.live/MegaRadioTV" version="1.0.0" viewmodes="maximized">
    <tizen:application id="vfYLfgsp3x.MegaRadioTV" package="vfYLfgsp3x" required_version="6.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
    <icon src="icon.png"/>
    <name>Mega Radio</name>
    <tizen:profile name="tv-samsung"/>
    <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
</widget>
EOF

# Copy icon
cp client/public/icon.png tv-app/icon.png 2>/dev/null || echo "⚠️  icon.png not found, skipping"

# Step 7: Update bundle reference in index.html
LATEST_BUNDLE=$(ls -t tv-app/assets/index-*.js | head -1 | xargs basename)
echo "🔧 Updating index.html with bundle: ${LATEST_BUNDLE}"
sed -i "s|assets/index.js|assets/${LATEST_BUNDLE}|g" tv-app/index.html

echo ""
echo "✅ Build complete! LGTV Flat Structure:"
echo ""
echo "tv-app/"
echo "├── index.html          ← Single entry point"
echo "├── appinfo.json        ← LG webOS config"
echo "├── config.xml          ← Samsung Tizen config"
echo "├── icon.png"
echo "├── css/                ← TV styles"
echo "├── js/                 ← TV scripts"
echo "├── images/             ← All images"
echo "├── assets/             ← Compiled React bundle"
echo "└── webOSTVjs-1.2.0/    ← LG SDK"
echo ""
echo "🚀 Deploy the entire tv-app/ folder to Samsung/LG TV"
