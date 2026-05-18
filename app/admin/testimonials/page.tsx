import { redirect } from 'next/navigation';

import { AdminShell } from '@/components/admin/AdminShell';
import {
  TestimonialsAdminPanel,
  type AdminTestimonial,
} from '@/components/admin/TestimonialsAdminPanel';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { formatTimeAgo } from '@/lib/format-time-ago';
import { listAllTestimonials } from '@/lib/testimonials-store';

export const metadata = {
  title: { absolute: 'Feedback · VCS Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login?next=/admin/testimonials');
  }

  const rows = await listAllTestimonials();
  const initial: AdminTestimonial[] = rows.map((t) => ({
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
  }));

  return (
    <AdminShell adminUser={admin.user}>
      <TestimonialsAdminPanel initial={initial} />
    </AdminShell>
  );
}
