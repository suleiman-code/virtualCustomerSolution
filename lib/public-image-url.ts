/**
 * Admin / dev tools sometimes persist absolute URLs like `http://localhost:3000/api/cms-image/...`.
 * On production (or another host) the browser still requests localhost → broken images.
 * Strip loopback hosts so `<img src>` stays same-origin on the current deployment.
 */
export function normalizePublicImageUrl(raw: string | null | undefined): string {
  if (raw == null) return '';
  const s = String(raw).trim();
  if (!s) return '';

  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
        const path = `${u.pathname}${u.search}${u.hash}`;
        return path.startsWith('/') ? path : `/${path}`;
      }
    } catch {
      return s;
    }
  }

  if (!s.startsWith('/') && !s.startsWith('http') && !s.startsWith('data:')) {
    if (s.startsWith('api/') || s.startsWith('uploads/')) {
      return `/${s}`;
    }
  }

  return s;
}
