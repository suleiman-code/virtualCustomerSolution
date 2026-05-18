import { NextResponse } from 'next/server';

import { formatTimeAgo } from '@/lib/format-time-ago';
import { rateLimit } from '@/lib/rate-limit';
import {
  createTestimonial,
  listApprovedTestimonials,
  seedApprovedTestimonialsIfEmpty,
} from '@/lib/testimonials-store';
import { insertAdminNotification } from '@/lib/mongo-store';
import { testimonialSubmitSchema } from '@/lib/validations/testimonial';

export async function GET() {
  try {
    await seedApprovedTestimonialsIfEmpty();
    const rows = await listApprovedTestimonials();
    const testimonials = rows.map((t) => ({
      id: t.id,
      author: t.author,
      role: t.role,
      location: t.location,
      quote: t.quote,
      amount: t.amount,
      service: t.service,
      timeAgo: formatTimeAgo(t.approvedAt ?? t.createdAt),
      createdAt: t.createdAt.toISOString(),
    }));
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error('[testimonials GET]', error);
    return NextResponse.json({ success: true, testimonials: [] });
  }
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success, remaining } = await rateLimit(ip, 'testimonials', 3);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      );
    }

    const body = await request.json();
    const parsed = testimonialSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const doc = await createTestimonial({
      author: data.author,
      role: data.role,
      location: data.location,
      quote: data.quote,
      amount: data.amount || null,
      service: data.service || null,
    });

    void insertAdminNotification({
      id: doc.id,
      type: 'testimonial_pending',
      title: 'New client feedback',
      body: `${doc.author} — ${doc.role}, ${doc.location}`,
      href: '/admin/testimonials',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your feedback was submitted successfully.',
        testimonial: {
          id: doc.id,
          author: doc.author,
          role: doc.role,
          location: doc.location || '',
          quote: doc.quote,
          amount: doc.amount,
          service: doc.service,
          timeAgo: 'Just now',
        },
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('[testimonials POST]', error);
    return NextResponse.json(
      { success: false, message: 'Unable to submit feedback right now.' },
      { status: 500 }
    );
  }
}
