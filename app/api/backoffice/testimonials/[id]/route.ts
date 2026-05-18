import { NextResponse } from 'next/server';

import { requireAdminApi } from '@/lib/require-admin-api';
import {
  deleteTestimonial,
  updateTestimonialStatus,
} from '@/lib/testimonials-store';
import { testimonialStatusSchema } from '@/lib/validations/testimonial';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = testimonialStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid status.' },
        { status: 400 }
      );
    }

    const updated = await updateTestimonialStatus(id, parsed.data.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error('[admin/testimonials PATCH]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const ok = await deleteTestimonial(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/testimonials DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial.' },
      { status: 500 }
    );
  }
}
