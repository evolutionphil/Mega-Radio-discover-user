export function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return base + path
  return `${base}${cleanPath}`;
}
