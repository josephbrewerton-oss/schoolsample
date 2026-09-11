export default function useBaseUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanUrl = url.startsWith('/') ? url : '/' + url;
  return base + cleanUrl;
}
