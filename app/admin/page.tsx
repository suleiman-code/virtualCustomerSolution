import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, FileText, Layers, Users } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { db } from '@/lib/db';
import { SERVICES_PAGE_CATEGORIES } from '@/lib/services-page-data';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: { absolute: 'Admin · VCS' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login?next=/admin');

  const [leadCount, posts] = await Promise.all([
    db.lead.count(),
    Promise.resolve(getAllPosts()),
  ]);

  const serviceCategories = SERVICES_PAGE_CATEGORIES.length;
  const serviceItems = SERVICES_PAGE_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  const cards = [
    {
      href: '/admin/leads',
      title: 'Leads',
      desc: 'Review and update contact form submissions.',
      count: leadCount,
      icon: Users,
      tone: 'from-blue-500/20 to-transparent',
    },
    {
      href: '/admin/services',
      title: 'Services (Mongo)',
      desc: 'Homepage tiles and offering detail pages.',
      count: `${serviceCategories} · ${serviceItems}`,
      icon: Layers,
      tone: 'from-[#22C55E]/20 to-transparent',
    },
    {
      href: '/admin/blogs',
      title: 'Insights & blogs',
      desc: 'Mongo insights for the homepage; file-based articles live in content/blog.',
      count: posts.length,
      icon: FileText,
      tone: 'from-violet-500/15 to-transparent',
    },
  ] as const;

  return (
    <AdminShell adminUser={admin.user}>
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Quick access to leads, Mongo-backed services and insights (edit from{' '}
            <Link href="/admin/services" className="text-[#22C55E] hover:underline">
              Services
            </Link>{' '}
            &amp;{' '}
            <Link href="/admin/blogs" className="text-[#22C55E] hover:underline">
              Blogs
            </Link>
            ), plus legacy copy in{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#4ADE80]">
              content/blog
            </code>{' '}
            and{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#4ADE80]">
              lib/services-page-data.ts
            </code>
            .
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-1 md:grid-cols-3 md:gap-5">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <li key={card.href}>
                  <Link
                    href={card.href}
                    className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br ${card.tone} p-5 transition hover:border-[#22C55E]/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.08)]`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#22C55E]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/80">
                        {card.count}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold text-white">{card.title}</h2>
                    <p className="mt-1 flex-1 text-sm text-white/45">{card.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#22C55E]">
                      Open
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </AdminShell>
  );
}
