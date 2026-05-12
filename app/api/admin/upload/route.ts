import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin-api';
import { insertCmsImage } from '@/lib/cms-images';
import { mongoUnavailablePayload } from '@/lib/mongodb';

export const runtime = 'nodejs';

/** Max upload size (MongoDB + Vercel-friendly; filesystem is not used on serverless). */
const MAX_BYTES = 3 * 1024 * 1024;

/** MIME types we persist after validation + sniffing. */
const ALLOWED = new Set([
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/apng',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/x-ms-bmp',
  'image/tiff',
  'image/tif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/jxl',
]);

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/pjpeg': 'jpg',
  'image/png': 'png',
  'image/apng': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/x-ms-bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/tif': 'tif',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/svg+xml': 'svg',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/jxl': 'jxl',
};

function mimeFromFilename(name: string): string | null {
  const ext = name.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    jfif: 'image/jpeg',
    pjpeg: 'image/jpeg',
    pjp: 'image/jpeg',
    png: 'image/png',
    apng: 'image/apng',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
    bmp: 'image/bmp',
    dib: 'image/bmp',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    ico: 'image/x-icon',
    cur: 'image/x-icon',
    svg: 'image/svg+xml',
    heic: 'image/heic',
    heif: 'image/heif',
    hif: 'image/heif',
    jxl: 'image/jxl',
  };
  return map[ext] ?? null;
}

function isLikelySvg(buf: Buffer): boolean {
  const head = buf.slice(0, Math.min(buf.length, 2048)).toString('utf8').trimStart();
  return head.startsWith('<svg') || head.startsWith('<?xml');
}

function sniffIsoBmffBrand(buf: Buffer, brands: string[]): boolean {
  if (buf.length < 12) return false;
  if (buf.toString('ascii', 4, 8) !== 'ftyp') return false;
  const brand = buf.toString('ascii', 8, 12);
  return brands.includes(brand);
}

/** Magic-byte sniff when `file.type` is missing (common on Windows / some browsers). */
function sniffImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'image/webp';
  }
  if (buf[0] === 0x42 && buf[1] === 0x4d) return 'image/bmp';
  if (buf[0] === 0xff && buf[1] === 0x0a) return 'image/jxl';
  if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0x00) || (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0x00 && buf[3] === 0x2a)) {
    return 'image/tiff';
  }
  if (buf.length >= 6 && buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
    return 'image/x-icon';
  }
  if (sniffIsoBmffBrand(buf, ['avif', 'avis'])) return 'image/avif';
  if (sniffIsoBmffBrand(buf, ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'])) return 'image/heic';

  if (isLikelySvg(buf)) return 'image/svg+xml';

  return null;
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ error: 'Empty file' }, { status: 400 });
  }
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 3MB)' }, { status: 400 });
  }

  let type = ((file as File).type || '').trim().toLowerCase();
  const fileName = typeof (file as File).name === 'string' ? (file as File).name : '';

  if (!type || type === 'application/octet-stream') {
    type = mimeFromFilename(fileName) || '';
  }

  if (!ALLOWED.has(type)) {
    const sniffed = sniffImageMime(buf);
    if (sniffed && ALLOWED.has(sniffed)) {
      type = sniffed;
    }
  }

  if (type === 'image/svg+xml' || mimeFromFilename(fileName) === 'image/svg+xml') {
    if (!isLikelySvg(buf)) {
      return NextResponse.json({ error: 'Invalid SVG file' }, { status: 400 });
    }
    type = 'image/svg+xml';
  }

  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      {
        error: 'Unsupported image format',
        detail: fileName ? `Got type "${(file as File).type || 'empty'}" for ${fileName}` : undefined,
      },
      { status: 400 }
    );
  }

  const ext = MIME_TO_EXT[type] ?? 'bin';
  const safeBase =
    fileName.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120) || `upload.${ext}`;

  try {
    const { publicId } = await insertCmsImage({
      buffer: buf,
      contentType: type,
      filename: safeBase,
    });
    return NextResponse.json({ url: `/api/cms-image/${publicId}` });
  } catch (err: unknown) {
    console.error('[admin/upload] Mongo save failed:', err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Database') || msg.includes('unavailable')) {
      return NextResponse.json(mongoUnavailablePayload({ code: 'database_connect' }), { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to store image' }, { status: 500 });
  }
}
