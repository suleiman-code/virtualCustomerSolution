import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';
import { coerceBlogCategory } from '@/lib/blog-categories';
import { normalizePublicImageUrl } from '@/lib/public-image-url';

function serializeBlog(b: Record<string, unknown> & { _id: { toString: () => string } }) {
  const { _id, ...rest } = b;
  const out = { ...rest, id: _id.toString() } as Record<string, unknown>;
  if (out.date instanceof Date) out.date = out.date.toISOString();
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString();
  if (typeof out.image === 'string') out.image = normalizePublicImageUrl(out.image);
  return out;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
  }

  const doc = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(serializeBlog(doc as Parameters<typeof serializeBlog>[0]));
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const $set: Record<string, unknown> = { updatedAt: new Date() };

  if (data.title !== undefined) {
    const title = String(data.title || '').trim();
    if (!title) return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
    $set.title = title;
  }
  if (data.content !== undefined) {
    const content = String(data.content || '').trim();
    if (!content) return NextResponse.json({ error: 'content cannot be empty' }, { status: 400 });
    $set.content = content;
  }
  if (data.authorName !== undefined) {
    const authorName = String(data.authorName || '').trim();
    if (!authorName) return NextResponse.json({ error: 'authorName cannot be empty' }, { status: 400 });
    $set.authorName = authorName;
  }
  if (data.category !== undefined) {
    $set.category = coerceBlogCategory(data.category);
  }
  if (data.excerpt !== undefined) {
    $set.excerpt = String(data.excerpt || '').trim();
  }
  if (data.image !== undefined) {
    $set.image = normalizePublicImageUrl(String(data.image || ''));
  }
  if (data.isPinned !== undefined) {
    $set.isPinned = !!data.isPinned;
  }
  if (data.date !== undefined && data.date !== null && data.date !== '') {
    const d = new Date(String(data.date));
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }
    $set.date = d;
  }

  if (Object.keys($set).length <= 1) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const r = await db.collection('blogs').updateOne({ _id: new ObjectId(id) }, { $set });
  if (r.matchedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(serializeBlog(doc as Parameters<typeof serializeBlog>[0]));
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
  }

  const r = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });
  if (r.deletedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
