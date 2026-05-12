import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { ArrowLeft } from 'lucide-react';
import { getDb } from '@/lib/db';
import { ArticleBody } from '@/components/public/ArticleBody';
import { plainTextFromAnyContent } from '@/lib/markdown-excerpt';
import { SiteShell } from '@/components/layout/SiteShell';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import { normalizePublicImageUrl } from '@/lib/public-image-url';

type Props = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return { title: 'Service' };
  const db = await getDb();
  if (!db) return { title: 'Service' };
  const doc = await db.collection('services').findOne(
    { _id: new ObjectId(id) },
    { projection: { title: 1 } }
  );
  return { title: doc?.title ? `${doc.title} · VCS` : 'Service' };
}

export default async function OfferingPage({ params }: Props) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const db = await getDb();
  if (!db) {
    return (
      <SiteShell>
        <div className="min-h-[50vh] px-4 py-16 text-center text-white/70">
          <p>Database unavailable.</p>
          <Link href="/" className="mt-4 inline-block text-[#22C55E] hover:underline">
            Back home
          </Link>
        </div>
      </SiteShell>
    );
  }

  const doc = await db.collection('services').findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const title = String(doc.title || '');
  const description = String(doc.description || '');
  const body = String(doc.body || '');
  const image = normalizePublicImageUrl(doc.image ? String(doc.image) : '');

  const lead =
    plainTextFromAnyContent(description, 280) || plainTextFromAnyContent(body, 280);

  return (
    <SiteShell>
      <article className="min-h-screen bg-[#050505] pb-20 pt-8 text-[#F5F5F5] sm:pt-12">
        <div className="container-wide">
          <Link
            href="/#services"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#22C55E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>

          <header className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#22C55E]">Service</p>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {lead ? (
              <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">{lead}</p>
            ) : null}
          </header>

          {image ? (
            <div className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_0_60px_rgba(34,197,94,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="max-h-[min(70vh,520px)] w-full object-cover" />
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl px-0 sm:px-1">
            {body.trim() ? (
              <ArticleBody markdownOrHtml={body} />
            ) : (
              <ArticleBody markdownOrHtml={description} />
            )}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 py-6 text-center sm:px-8 sm:py-8">
            <p className="text-sm text-white/65 sm:text-base">
              Ready to discuss this offering for your business?
            </p>
            <Link
              href={FREE_AUDIT_CONTACT_HREF}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#22C55E]/20 px-6 py-2.5 text-sm font-semibold text-[#86EFAC] transition hover:bg-[#22C55E]/30"
            >
              Free audit
            </Link>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
