import { randomUUID } from 'crypto';
import { getDb } from './mongodb';

const COL = 'cms_images';

export type CmsImageDoc = {
  publicId: string;
  filename: string;
  contentType: string;
  data: Buffer;
  createdAt: Date;
};

export async function insertCmsImage(params: {
  buffer: Buffer;
  contentType: string;
  filename: string;
}): Promise<{ publicId: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database unavailable');
  const publicId = randomUUID();
  await db.collection(COL).insertOne({
    publicId,
    filename: params.filename,
    contentType: params.contentType,
    data: params.buffer,
    createdAt: new Date(),
  });
  return { publicId };
}

export async function findCmsImageByPublicId(publicId: string): Promise<CmsImageDoc | null> {
  const db = await getDb();
  if (!db) throw new Error('Database unavailable');
  const doc = await db.collection(COL).findOne<{
    publicId: string;
    filename: string;
    contentType: string;
    data: Buffer | { type: string; data: number[] };
    createdAt: Date;
  }>({ publicId }, { projection: { publicId: 1, filename: 1, contentType: 1, data: 1, createdAt: 1 } });

  if (!doc?.data) return null;

  const raw = doc.data;
  const data = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as unknown as Uint8Array);

  return {
    publicId: doc.publicId,
    filename: doc.filename,
    contentType: doc.contentType || 'application/octet-stream',
    data,
    createdAt: doc.createdAt,
  };
}
