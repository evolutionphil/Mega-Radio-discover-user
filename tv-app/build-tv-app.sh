#!/bin/bash

# Mega Radio TV App Build Script
# This script builds the React app and copies it to the tv-app deployment folder

echo "🔨 Building Mega Radio TV App..."

# Step 1: Build the React app
echo "📦 Step 1: Building React app with Vite..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

# Step 2: Copy built assets to tv-app folder
echo "📂 Step 2: Copying built assets to tv-app folder..."

# Remove old assets if they exist
rm -rf tv-app/assets

# Copy new assets (Vite builds to dist/public)
cp -r dist/public/assets tv-app/

# Copy any other static files from dist/public if needed
if [ -f "dist/public/vite.svg" ]; then
    cp dist/public/vite.svg tv-app/
fi

# Step 3: Copy Vite's built index.html and convert all paths to relative
echo "🔧 Step 3: Converting Vite output to relative paths for TV platforms..."

# Copy the Vite-built index.html to tv-app
cp dist/public/index.html tv-app/index.html

# Convert ALL absolute local paths to relative paths for TV compatibility
# This catches any path starting with "/" that's NOT an external URL (http:// or https://)
# Examples: /assets/..., /css/..., /js/..., /favicon.ico, etc.
sed -i -E 's/(href|src)="\/([^/])/\1="\2/g' tv-app/index.html

echo "✓ Converted all absolute paths to relative paths for TV compatibility"

echo "✅ Build complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open Tizen Studio"
echo "2. File > Open Projects from File System"
echo "3. Select the 'tv-app' folder"
echo "4. Platform should be detected as 'tv-samsung-6.0'"
echo ""
echo "For LG webOS:"
echo "1. Open webOS TV IDE"
echo "2. Import the 'tv-app' folder"
echo ""
echo "🎉 Your TV app is ready for deployment!"
