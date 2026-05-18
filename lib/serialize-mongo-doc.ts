import { normalizePublicImageUrl } from '@/lib/public-image-url';

function extractId(doc: Record<string, unknown>): string {
  const raw = doc._id;
  if (raw != null && typeof raw === 'object' && 'toString' in raw) {
    return String((raw as { toString: () => string }).toString());
  }
  if (typeof doc.id === 'string' && doc.id.trim()) return doc.id.trim();
  return '';
}

function serializeDates(out: Record<string, unknown>) {
  if (out.date instanceof Date) out.date = out.date.toISOString();
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString();
  if (out.updatedAt instanceof Date) out.updatedAt = out.updatedAt.toISOString();
}

export function serializeServiceDoc(
  doc: Record<string, unknown>
): Record<string, unknown> | null {
  try {
    const id = extractId(doc);
    if (!id) return null;
    const out: Record<string, unknown> = { ...doc, id };
    delete out._id;
    serializeDates(out);
    if (typeof out.image === 'string') out.image = normalizePublicImageUrl(out.image);
    return out;
  } catch (err) {
    console.error('[serializeServiceDoc]', err);
    return null;
  }
}

export function serializeBlogDoc(doc: Record<string, unknown>): Record<string, unknown> | null {
  try {
    const id = extractId(doc);
    if (!id) return null;
    const out: Record<string, unknown> = { ...doc, id };
    delete out._id;
    serializeDates(out);
    if (typeof out.image === 'string') out.image = normalizePublicImageUrl(out.image);
    return out;
  } catch (err) {
    console.error('[serializeBlogDoc]', err);
    return null;
  }
}

export function serializeMany<T>(
  docs: Record<string, unknown>[],
  fn: (doc: Record<string, unknown>) => T | null
): T[] {
  return docs.map((d) => fn(d)).filter((x): x is T => x != null);
}
