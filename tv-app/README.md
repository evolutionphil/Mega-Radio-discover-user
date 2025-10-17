# Mega Radio TV App - Deployment Package

This folder contains the deployable TV app package for both **LG webOS** and **Samsung Tizen** platforms.

## Folder Structure

```
tv-app/
├── index.html          # Main entry point
├── config.xml          # Samsung Tizen configuration
├── appinfo.json        # LG webOS configuration
├── .project            # Tizen Studio project file
├── .tproject           # Tizen platform configuration
├── images/             # App icons
│   ├── icon.png
│   └── largeIcon.png
├── css/                # Styles
│   └── tv-styles.css
├── js/                 # TV platform scripts
│   ├── platform-detect.js
│   ├── tv-remote-keys.js
│   └── tv-audio-player.js
├── webOSTVjs-1.2.0/    # LG webOS SDK
└── assets/             # Built React app (after build)
```

## Building for TV Deployment

### Step 1 & 2: Automated Build (Recommended)

From the project root directory, run the automated build script:

```bash
./build-tv-app.sh
```

This script will:
1. Build the React app with Vite (`npm run build`)
2. Copy all assets from `dist/public/assets` to `tv-app/assets`
3. **Copy Vite's built index.html and convert ALL absolute paths to relative paths**
   - Converts `/assets/...` → `assets/...`
   - Converts `/css/...` → `css/...`
   - Converts `/js/...` → `js/...`
   - Converts `/webOSTVjs-1.2.0/...` → `webOSTVjs-1.2.0/...`
4. Prepare a complete, ready-to-deploy TV app package

**Why path conversion?** TV platforms (Samsung Tizen and LG webOS) require relative paths to load resources from the packaged app. Absolute paths (starting with `/`) will fail to load and result in a black screen.

### Step 3: Open in Tizen Studio

1. Open **Tizen Studio**
2. Go to **File > Open Projects from File System**
3. Select the `tv-app` folder
4. The platform should now be detected as **tv-samsung-6.0**

### Step 4: Open in webOS TV IDE (for LG)

1. Open **webOS TV IDE**
2. Import the `tv-app` folder as a webOS TV project
3. The `appinfo.json` will be automatically detected

## Platform Detection

The app will automatically detect which platform it's running on:

- **Samsung Tizen**: Uses `webapis.avplay` for audio
- **LG webOS**: Uses HTML5 Video/Audio
- **Web Browser**: Uses standard HTML5 Audio

## Required Files for Each Platform

### Samsung Tizen (Required)
- `config.xml`
- `.project`
- `.tproject`
- `index.html`

### LG webOS (Required)
- `appinfo.json`
- `index.html`

## Troubleshooting

### "No platform detected" in Tizen Studio

1. Make sure `config.xml` exists at the root of `tv-app` folder
2. Check that `.tproject` file specifies the correct platform version
3. Verify the `<tizen:application>` tag in `config.xml` has the correct package ID

### Icons not showing

1. Ensure `images/icon.png` and `images/largeIcon.png` exist
2. Icons should be:
   - `icon.png`: 80x80px minimum
   - `largeIcon.png`: 130x130px minimum

### App doesn't run on TV

1. Run `./build-tv-app.sh` to ensure the latest build is deployed
2. Check that `tv-app/index.html` references hashed assets (e.g., `assets/index-abc123.js`)
3. Verify the hashed asset files exist in `tv-app/assets/`
4. Check TV browser console for errors (use remote debugging)

## Current Configuration

- **App ID**: megaradio.MegaRadio
- **Package**: megaradio
- **Version**: 1.0.0
- **Resolution**: 1920x1080
- **Platform**: tv-samsung-6.0 / webOS

## Next Steps

After building and deploying:

1. Test on Samsung TV Emulator
2. Test on LG TV Emulator
3. Test on actual hardware
4. Generate signed package for app store submission
