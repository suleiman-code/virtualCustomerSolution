import { NextRequest, NextResponse } from 'next/server';
import { getDb, mongoUnavailablePayload } from '@/lib/db';
import { requireAdminApi } from '@/lib/require-admin-api';
import { coerceBlogCategory } from '@/lib/blog-categories';
import { normalizePublicImageUrl } from '@/lib/public-image-url';

function serializeBlog(b: Record<string, unknown> & { _id: { toString: () => string } }) {
  const { _id, ...rest } = b;
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
        return NextResponse.json(mongoUnavailablePayload({ blogs: [] }), { status: 503 });
      }
      const rows = await db.collection('blogs').find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({ blogs: rows.map(serializeBlog) });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ blogs: [], hasMore: false }, { status: 200 });
    }

    const { skip, limit } = parsePagination(searchParams);
    const isPinnedOnly = searchParams.get('pinned') === 'true';

    if (isPinnedOnly) {
      const pinnedBlogs = await db
        .collection('blogs')
        .find({ isPinned: true })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json(pinnedBlogs.map(serializeBlog));
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
      blogs: blogs.map(serializeBlog),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('Blogs GET error:', error);
    const { searchParams } = new URL(req.url);
    if (searchParams.get('pinned') === 'true') return NextResponse.json([]);
    return NextResponse.json({ blogs: [], hasMore: false });
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
    return NextResponse.json(serializeBlog({ ...newBlog, _id: result.insertedId }));
  } catch (error) {
    console.error('Blogs POST error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
