#!/bin/bash

# Mega Radio - Vanilla JS Build Script
# Prepares vanilla JS app for deployment

set -euo pipefail

echo "🎵 Building Mega Radio Vanilla JS App..."

# Create output directory
OUTPUT_DIR="dist-vanilla"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "📁 Creating directory structure..."
mkdir -p "$OUTPUT_DIR/css"
mkdir -p "$OUTPUT_DIR/js/app"
mkdir -p "$OUTPUT_DIR/js/pages"
mkdir -p "$OUTPUT_DIR/js/components"
mkdir -p "$OUTPUT_DIR/images"
mkdir -p "$OUTPUT_DIR/webOSTVjs-1.2.0"

# Copy HTML
echo "📄 Copying HTML..."
cp index-vanilla.html "$OUTPUT_DIR/index.html"

# Copy CSS
echo "🎨 Copying CSS..."
cp css/tv-styles.css "$OUTPUT_DIR/css/"
cp css/vanilla-app.css "$OUTPUT_DIR/css/"

# Copy JavaScript
echo "📜 Copying JavaScript..."
cp -r js/app/* "$OUTPUT_DIR/js/app/"
cp -r js/pages/* "$OUTPUT_DIR/js/pages/"
cp -r js/components/* "$OUTPUT_DIR/js/components/"

# Copy TV scripts (if they exist)
if [ -f "js/polyfills.js" ]; then
    cp js/polyfills.js "$OUTPUT_DIR/js/"
fi

if [ -f "js/tv-remote-keys.js" ]; then
    cp js/tv-remote-keys.js "$OUTPUT_DIR/js/"
fi

if [ -f "js/tv-spatial-navigation.js" ]; then
    cp js/tv-spatial-navigation.js "$OUTPUT_DIR/js/"
fi

if [ -f "js/tv-audio-player.js" ]; then
    cp js/tv-audio-player.js "$OUTPUT_DIR/js/"
fi

# Copy images
echo "🖼️  Copying images..."
if [ -d "images" ]; then
    cp -r images/* "$OUTPUT_DIR/images/" 2>/dev/null || true
fi

if [ -d "public/images" ]; then
    cp -r public/images/* "$OUTPUT_DIR/images/" 2>/dev/null || true
fi

# Copy webOS SDK
echo "📱 Copying webOS SDK..."
if [ -d "webOSTVjs-1.2.0" ]; then
    cp -r webOSTVjs-1.2.0/* "$OUTPUT_DIR/webOSTVjs-1.2.0/"
fi

# Create Samsung TV config files
echo "⚙️  Creating Samsung TV config..."
cat > "$OUTPUT_DIR/config.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://yourdomain.org/MegaRadio" version="1.0.0" viewmodes="maximized">
    <tizen:application id="MegaRadio.MegaRadio" package="MegaRadio" required_version="6.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
    <icon src="icon.png"/>
    <name>Mega Radio</name>
    <tizen:profile name="tv-samsung"/>
    <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
</widget>
EOF

cat > "$OUTPUT_DIR/appinfo.json" << 'EOF'
{
  "id": "com.megaradio.tv",
  "title": "Mega Radio",
  "main": "index.html",
  "icon": "icon.png",
  "vendor": "Mega Radio",
  "version": "1.0.0",
  "type": "web",
  "appDescription": "Global Radio Streaming for TV"
}
EOF

echo ""
echo "✅ Build complete!"
echo "📦 Output directory: $OUTPUT_DIR/"
echo ""
echo "To test:"
echo "  Open $OUTPUT_DIR/index.html in a browser"
echo ""
echo "To deploy to Samsung TV:"
echo "  1. Package $OUTPUT_DIR/ folder as .wgt file"
echo "  2. Install via Tizen Studio"
