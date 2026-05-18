import { NextRequest, NextResponse } from 'next/server';
import { getDb, getLastMongoError, mongoUnavailablePayload } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';
import { normalizePublicImageUrl } from '@/lib/public-image-url';
import { serializeMany, serializeServiceDoc } from '@/lib/serialize-mongo-doc';

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

function dbUnavailableResponse(extra: Record<string, unknown>) {
  return NextResponse.json(mongoUnavailablePayload(extra), { status: 503 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPinnedOnly = searchParams.get('pinned') === 'true';

  try {
    const adminList = searchParams.get('admin') === '1';

    if (adminList) {
      const auth = await requireAdminApi();
      if (!auth.ok) return auth.response;
      const db = await getDb();
      if (!db) {
        return dbUnavailableResponse({ services: [] });
      }
      const rows = await db.collection('services').find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({
        services: serializeMany(rows as Record<string, unknown>[], serializeServiceDoc),
      });
    }

    const db = await getDb();
    if (!db) {
      if (isPinnedOnly) {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json(
        { services: [], hasMore: false, ...mongoUnavailablePayload({}) },
        { status: 503 }
      );
    }

    const { skip, limit } = parsePagination(searchParams);

    if (isPinnedOnly) {
      const pinnedServices = await db
        .collection('services')
        .find({ isPinned: true })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json(
        serializeMany(pinnedServices as Record<string, unknown>[], serializeServiceDoc)
      );
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
      services: serializeMany(services as Record<string, unknown>[], serializeServiceDoc),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('[api/services GET]', error);
    const detail =
      error instanceof Error ? error.message : getLastMongoError()?.message ?? 'Unknown error';
    if (isPinnedOnly) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(
      {
        services: [],
        hasMore: false,
        error: 'Failed to load services',
        ...(process.env.NODE_ENV === 'development' ? { detail } : {}),
      },
      { status: 500 }
    );
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
    const serialized = serializeServiceDoc({
      ...newService,
      _id: result.insertedId,
    } as Record<string, unknown>);
    if (!serialized) {
      return NextResponse.json({ error: 'Failed to serialize created service' }, { status: 500 });
    }
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[api/services POST]', error);
    return NextResponse.json(
      {
        error: 'Failed to create service',
        ...(process.env.NODE_ENV === 'development' && error instanceof Error
          ? { detail: error.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
