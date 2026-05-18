/** Client-side upload to `/api/backoffice/upload` (cookie session). */

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export async function uploadAdminImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 3MB or smaller.');
  }
  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Use JPG, PNG, WebP, GIF, or AVIF images only.');
  }
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/backoffice/upload', {
    method: 'POST',
    body: fd,
    credentials: 'same-origin',
  });
  const text = await res.text();
  let data: { error?: string; url?: string };
  try {
    data = JSON.parse(text) as { error?: string; url?: string };
  } catch {
    throw new Error(
      text.trim().slice(0, 160) || `Upload failed (${res.status}). Expected JSON from server.`
    );
  }
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : `Upload failed (${res.status})`);
  }
  if (!data.url) throw new Error('No image URL returned');
  return String(data.url);
}
