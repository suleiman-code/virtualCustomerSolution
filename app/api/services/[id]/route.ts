import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';

function serializeService(s: Record<string, unknown> & { _id: { toString: () => string } }) {
  const { _id, ...rest } = s;
  const out = { ...rest, id: _id.toString() } as Record<string, unknown>;
  if (out.date instanceof Date) out.date = out.date.toISOString();
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString();
  if (out.updatedAt instanceof Date) out.updatedAt = out.updatedAt.toISOString();
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

  const doc = await db.collection('services').findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(serializeService(doc as Parameters<typeof serializeService>[0]));
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

  const $set: Record<string, unknown> = {};

  if (data.title !== undefined) {
    const title = String(data.title || '').trim();
    if (!title) return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
    $set.title = title;
  }
  if (data.description !== undefined) {
    const description = String(data.description || '').trim();
    if (!description) return NextResponse.json({ error: 'description cannot be empty' }, { status: 400 });
    $set.description = description;
  }
  if (data.body !== undefined || data.content !== undefined) {
    const body = String(data.body ?? data.content ?? '').trim();
    $set.body = body;
  }
  if (data.image !== undefined) {
    $set.image = String(data.image || '').trim();
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

  if (Object.keys($set).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  $set.updatedAt = new Date();

  const r = await db.collection('services').updateOne({ _id: new ObjectId(id) }, { $set });
  if (r.matchedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = await db.collection('services').findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(serializeService(doc as Parameters<typeof serializeService>[0]));
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

  const r = await db.collection('services').deleteOne({ _id: new ObjectId(id) });
  if (r.deletedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
