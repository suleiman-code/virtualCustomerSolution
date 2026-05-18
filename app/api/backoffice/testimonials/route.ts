import { NextResponse } from 'next/server';

import { formatTimeAgo } from '@/lib/format-time-ago';
import { requireAdminApi } from '@/lib/require-admin-api';
import { listAllTestimonials } from '@/lib/testimonials-store';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const rows = await listAllTestimonials();
    return NextResponse.json({
      success: true,
      testimonials: rows.map((t) => ({
        id: t.id,
        author: t.author,
        role: t.role,
        location: t.location,
        quote: t.quote,
        amount: t.amount,
        service: t.service,
        status: t.status,
        timeAgo: formatTimeAgo(t.createdAt),
        createdAt: t.createdAt.toISOString(),
        approvedAt: t.approvedAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    console.error('[admin/testimonials GET]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load testimonials.' },
      { status: 500 }
    );
  }
}
