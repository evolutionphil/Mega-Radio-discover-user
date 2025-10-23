export default {
  plugins: {
    tailwindcss: {},
    '@csstools/postcss-cascade-layers': {}, // Remove @layer for Samsung TV compatibility (Chromium 76)
    autoprefixer: {},
  },
}
