export function assetPath(path: string): string {
  // Always use relative paths for TV builds (Samsung/LG)
  // base: "./" is set in vite.config.tv.ts for Samsung TV compatibility
  const base = import.meta.env.PROD ? './' : (import.meta.env.BASE_URL || '/');
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return base + path
  return `${base}${cleanPath}`;
}
