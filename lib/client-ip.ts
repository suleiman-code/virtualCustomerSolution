/** Prefer proxy-forwarded client IP; avoid `unknown` (one shared bucket for all clients). */
export function getClientIp(request: Request): string {
  const h = request.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = h.get('x-real-ip')?.trim();
  if (real) return real;
  const cf = h.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  return '127.0.0.1';
}
