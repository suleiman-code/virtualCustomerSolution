import { NextRequest, NextResponse } from 'next/server';
import { getDb, mongoUnavailablePayload } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';

function serializeService(s: Record<string, unknown> & { _id: { toString: () => string } }) {
  const { _id, ...rest } = s;
  const out = { ...rest, id: _id.toString() } as Record<string, unknown>;
  if (out.date instanceof Date) out.date = out.date.toISOString();
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString();
  if (out.updatedAt instanceof Date) out.updatedAt = out.updatedAt.toISOString();
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminList = searchParams.get('admin') === '1';

    if (adminList) {
      const auth = await requireAdminApi();
      if (!auth.ok) return auth.response;
      const db = await getDb();
      if (!db) {
        return NextResponse.json(mongoUnavailablePayload({ services: [] }), { status: 503 });
      }
      const rows = await db.collection('services').find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({ services: rows.map(serializeService) });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ services: [], hasMore: false }, { status: 200 });
    }

    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '3');
    const isPinnedOnly = searchParams.get('pinned') === 'true';

    if (isPinnedOnly) {
      const pinnedServices = await db
        .collection('services')
        .find({ isPinned: true })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json(pinnedServices.map(serializeService));
    }

    const services = await db
      .collection('services')
      .find({ isPinned: { $ne: true } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('services').countDocuments({ isPinned: { $ne: true } });

    return NextResponse.json({
      services: services.map(serializeService),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('Services GET error:', error);
    const { searchParams } = new URL(req.url);
    if (searchParams.get('pinned') === 'true') return NextResponse.json([]);
    return NextResponse.json({ services: [], hasMore: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.response;

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
    }

    const data = await req.json();
    const title = String(data.title || '').trim();
    const description = String(data.description || '').trim();
    const body = String(data.body || data.content || '').trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      );
    }

    const image = data.image != null ? String(data.image).trim() : '';

    const newService = {
      title,
      description,
      body,
      image,
      isPinned: !!data.isPinned,
      date: data.date ? new Date(data.date) : new Date(),
      createdAt: new Date(),
    };

    const result = await db.collection('services').insertOne(newService);
    return NextResponse.json(serializeService({ ...newService, _id: result.insertedId }));
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
