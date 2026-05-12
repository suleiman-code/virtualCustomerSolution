/** Client-side upload to `/api/admin/upload` (cookie session). */

export async function uploadAdminImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', {
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
