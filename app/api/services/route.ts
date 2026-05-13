import { NextRequest, NextResponse } from 'next/server';
import { getDb, mongoUnavailablePayload } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';
import { normalizePublicImageUrl } from '@/lib/public-image-url';

function serializeService(s: Record<string, unknown> & { _id: { toString: () => string } }) {
  const { _id, ...rest } = s;
  const out = { ...rest, id: _id.toString() } as Record<string, unknown>;
  if (out.date instanceof Date) out.date = out.date.toISOString();
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString();
  if (out.updatedAt instanceof Date) out.updatedAt = out.updatedAt.toISOString();
  if (typeof out.image === 'string') out.image = normalizePublicImageUrl(out.image);
  return out;
}

function parsePagination(searchParams: URLSearchParams) {
  const rawSkip = Number.parseInt(searchParams.get('skip') || '0', 10);
  const rawLimit = Number.parseInt(searchParams.get('limit') || '3', 10);
  const skip = Number.isFinite(rawSkip) && rawSkip > 0 ? rawSkip : 0;
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 12) : 3;
  return { skip, limit };
}

function parseOptionalDate(value: unknown): Date | null {
  if (value == null || value === '') return new Date();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
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

    const { skip, limit } = parsePagination(searchParams);
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

    const image = data.image != null ? normalizePublicImageUrl(String(data.image)) : '';
    const date = parseOptionalDate(data.date);
    if (!date) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const newService = {
      title,
      description,
      body,
      image,
      isPinned: !!data.isPinned,
      date,
      createdAt: new Date(),
    };

    const result = await db.collection('services').insertOne(newService);
    return NextResponse.json(serializeService({ ...newService, _id: result.insertedId }));
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
