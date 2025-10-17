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

# Step 3: Create fresh index.html from template with correct hashed filenames
echo "🔧 Step 3: Creating index.html from template with hashed asset filenames..."

# Extract the actual hashed JS filename from Vite's build (strip leading slash for relative path)
VITE_JS_FILE=$(grep -oP 'src="/assets/index-[^"]+\.js"' dist/public/index.html | sed 's/src="//g' | sed 's/"//g' | sed 's/^\///g')

# Extract the actual hashed CSS filename from Vite's build (strip leading slash for relative path)
VITE_CSS_FILE=$(grep -oP 'href="/assets/index-[^"]+\.css"' dist/public/index.html | sed 's/href="//g' | sed 's/"//g' | sed 's/^\///g')

# Copy template to create fresh index.html
cp tv-app/index.template.html tv-app/index.html

# Update index.html with the correct hashed filenames
if [ ! -z "$VITE_JS_FILE" ]; then
    sed -i "s|<!--VITE_JS_PLACEHOLDER-->|<script type=\"module\" src=\"${VITE_JS_FILE}\"></script>|g" tv-app/index.html
    echo "✓ Updated index.html to use JS: ${VITE_JS_FILE}"
else
    echo "⚠️  Warning: Could not find hashed JS file in build output"
fi

if [ ! -z "$VITE_CSS_FILE" ]; then
    sed -i "s|<!--VITE_CSS_PLACEHOLDER-->|<link rel=\"stylesheet\" href=\"${VITE_CSS_FILE}\">|g" tv-app/index.html
    echo "✓ Updated index.html to use CSS: ${VITE_CSS_FILE}"
else
    # If no CSS found, just remove the placeholder
    sed -i "s|<!--VITE_CSS_PLACEHOLDER-->||g" tv-app/index.html
fi

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
