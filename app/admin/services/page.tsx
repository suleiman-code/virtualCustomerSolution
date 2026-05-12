import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { MongoServicesAdminPanel } from '@/components/admin/MongoServicesAdminPanel';

export const metadata = {
  title: { absolute: 'Services · VCS Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login?next=/admin/services');

  return (
    <AdminShell adminUser={admin.user}>
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                Services
              </h1>
              <p className="mt-2 text-sm text-white/50">
                Manage homepage tiles and public offering pages stored in MongoDB.
              </p>
            </div>
            <Link
              href="/services#offerings"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-2 text-sm font-semibold text-[#F5F5F5] transition hover:bg-[#22C55E]/20"
            >
              View live services page
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <section aria-label="MongoDB services">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Homepage tiles &amp; offerings (MongoDB)
            </h2>
            <MongoServicesAdminPanel />
          </section>
        </div>
      </main>
    </AdminShell>
  );
}
