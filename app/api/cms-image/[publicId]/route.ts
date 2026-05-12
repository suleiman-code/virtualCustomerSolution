import { NextResponse } from 'next/server';
import { findCmsImageByPublicId } from '@/lib/cms-images';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await ctx.params;
  if (!publicId || !/^[0-9a-f-]{36}$/i.test(publicId)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const img = await findCmsImageByPublicId(publicId);
    if (!img) return new NextResponse(null, { status: 404 });

    return new NextResponse(new Uint8Array(img.data), {
      headers: {
        'Content-Type': img.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Database') || message.includes('MONGO')) {
      return NextResponse.json(
        {
          error: 'Database unavailable',
          code: 'database_connect',
          hint: 'Check DATABASE_URL and Atlas Network Access.',
        },
        { status: 503 }
      );
    }
    console.error('[cms-image] GET error:', error);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
