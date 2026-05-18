import { NextRequest, NextResponse } from 'next/server';
import { getDb, getLastMongoError, mongoUnavailablePayload } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';
import { coerceBlogCategory } from '@/lib/blog-categories';
import { normalizePublicImageUrl } from '@/lib/public-image-url';
import { serializeBlogDoc, serializeMany } from '@/lib/serialize-mongo-doc';

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
        return dbUnavailableResponse({ blogs: [] });
      }
      const rows = await db.collection('blogs').find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({
        blogs: serializeMany(rows as Record<string, unknown>[], serializeBlogDoc),
      });
    }

    const db = await getDb();
    if (!db) {
      if (isPinnedOnly) {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json(
        { blogs: [], hasMore: false, ...mongoUnavailablePayload({}) },
        { status: 503 }
      );
    }

    const { skip, limit } = parsePagination(searchParams);

    if (isPinnedOnly) {
      const pinnedBlogs = await db
        .collection('blogs')
        .find({ isPinned: true })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json(
        serializeMany(pinnedBlogs as Record<string, unknown>[], serializeBlogDoc)
      );
    }

    const blogs = await db
      .collection('blogs')
      .find({ isPinned: { $ne: true } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('blogs').countDocuments({ isPinned: { $ne: true } });

    return NextResponse.json({
      blogs: serializeMany(blogs as Record<string, unknown>[], serializeBlogDoc),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('[api/blogs GET]', error);
    const detail =
      error instanceof Error ? error.message : getLastMongoError()?.message ?? 'Unknown error';
    if (isPinnedOnly) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(
      {
        blogs: [],
        hasMore: false,
        error: 'Failed to load blogs',
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
    const content = String(data.content || '').trim();
    const authorName = String(data.authorName || '').trim();
    const category = coerceBlogCategory(data.category);

    if (!title || !content || !authorName) {
      return NextResponse.json(
        { error: 'title, content, and authorName are required' },
        { status: 400 }
      );
    }

    const excerpt = data.excerpt != null ? String(data.excerpt).trim() : '';
    const image = data.image != null ? normalizePublicImageUrl(String(data.image)) : '';
    const date = parseOptionalDate(data.date);
    if (!date) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const newBlog = {
      title,
      category,
      content,
      excerpt,
      authorName,
      image,
      isPinned: !!data.isPinned,
      date,
      createdAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(newBlog);
    const serialized = serializeBlogDoc({
      ...newBlog,
      _id: result.insertedId,
    } as Record<string, unknown>);
    if (!serialized) {
      return NextResponse.json({ error: 'Failed to serialize created blog' }, { status: 500 });
    }
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[api/blogs POST]', error);
    return NextResponse.json(
      {
        error: 'Failed to create blog',
        ...(process.env.NODE_ENV === 'development' && error instanceof Error
          ? { detail: error.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
