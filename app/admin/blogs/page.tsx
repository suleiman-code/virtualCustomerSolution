import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { MongoBlogsAdminPanel } from '@/components/admin/MongoBlogsAdminPanel';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: { absolute: 'Blog posts · VCS Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login?next=/admin/blogs');

  const posts = getAllPosts();

  return (
    <AdminShell adminUser={admin.user}>
      <div className="mx-auto max-w-5xl px-4 py-8 pb-10 sm:px-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                Insights &amp; blog
              </h1>
              <p className="mt-2 text-sm text-white/50">
                Manage homepage insights (MongoDB). Legacy markdown articles live in{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#4ADE80]">
                  content/blog
                </code>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/#blogs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[#F5F5F5] transition hover:bg-white/[0.08]"
              >
                Homepage section
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-2 text-sm font-semibold text-[#F5F5F5] transition hover:bg-[#22C55E]/20"
              >
                File-based blog
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <section aria-label="MongoDB insights">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Homepage insights (MongoDB)
            </h2>
            <MongoBlogsAdminPanel />
          </section>

          <details className="group rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5">
            <summary className="cursor-pointer list-none font-medium text-white/80 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                Legacy file articles
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/45">
                  {posts.length}
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-white/45">
              These use <code className="text-[#4ADE80]">/blog/[slug]</code>, not the homepage Mongo
              cards.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-semibold uppercase tracking-wider text-white/45">
                    <th className="px-4 py-3 sm:px-5">Title</th>
                    <th className="hidden px-4 py-3 sm:table-cell sm:px-5">Category</th>
                    <th className="hidden px-4 py-3 md:table-cell md:px-5">Date</th>
                    <th className="px-4 py-3 text-right sm:px-5">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.slug}
                      className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 align-top sm:px-5">
                        <div className="font-medium text-white">{post.title}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-white/35">{post.slug}</div>
                        <div className="mt-1 text-xs text-white/45 sm:hidden">{post.category}</div>
                      </td>
                      <td className="hidden px-4 py-3 align-top text-white/60 sm:table-cell sm:px-5">
                        {post.category}
                      </td>
                      <td className="hidden px-4 py-3 align-top text-white/50 md:table-cell md:px-5">
                        {post.date}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#22C55E] hover:underline"
                        >
                          Open
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </AdminShell>
  );
}
