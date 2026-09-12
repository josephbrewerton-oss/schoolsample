/**
 * Resolves a public static asset URL relative to Vite's configured BASE_URL.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return base + cleanPath;
}
