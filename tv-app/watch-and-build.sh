#!/bin/bash
# Watch for changes in tv-app/src and auto-rebuild

echo "🔄 TV App Auto-Rebuild Watcher Started"
echo "   Monitoring: tv-app/src/"
echo "   Press Ctrl+C to stop"
echo ""

# Initial build
echo "📦 Running initial build..."
cd /home/runner/workspace/tv-app
bash build-samsung-tv.sh

# Use inotifywait if available, otherwise use a polling approach
if command -v inotifywait &> /dev/null; then
  echo "✅ Using inotifywait for file watching"
  while true; do
    inotifywait -r -e modify,create,delete src/ 2>/dev/null
    echo ""
    echo "🔄 Changes detected, rebuilding..."
    bash build-samsung-tv.sh
    echo "✅ Rebuild complete!"
    echo ""
  done
else
  echo "⚠️ inotifywait not available, using polling (every 5 seconds)"
  LAST_HASH=""
  while true; do
    # Calculate hash of all source files
    CURRENT_HASH=$(find src/ -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css" 2>/dev/null | xargs cat 2>/dev/null | md5sum | cut -d' ' -f1)
    
    if [ "$CURRENT_HASH" != "$LAST_HASH" ] && [ -n "$LAST_HASH" ]; then
      echo ""
      echo "🔄 Changes detected, rebuilding..."
      bash build-samsung-tv.sh
      echo "✅ Rebuild complete!"
      echo ""
    fi
    
    LAST_HASH="$CURRENT_HASH"
    sleep 5
  done
fi
