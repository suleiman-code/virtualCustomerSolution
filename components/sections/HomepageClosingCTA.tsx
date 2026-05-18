'use client';

import Link from 'next/link';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';

/** Compact final CTA — replaces the removed full-width audit card. */
export function HomepageClosingCTA() {
  return (
    <section
      className="relative border-t border-white/[0.06] bg-[#0A0A0A] py-14 md:py-20"
      aria-labelledby="homepage-closing-heading"
    >
      <div className="container-wide mx-auto max-w-2xl text-center">
        <h2
          id="homepage-closing-heading"
          className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5] md:text-3xl"
        >
          Need support, staff, or marketing without five different vendors?
        </h2>
        <p className="mt-3 text-[#A1A1AA] md:text-lg">
          Tell us what you need — live chat, customer support, virtual staff, or campaigns. We typically reply within a few business hours.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href={FREE_AUDIT_CONTACT_HREF}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#22C55E] px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-[#22C55E]/20 transition hover:bg-[#4ADE80] hover:shadow-[#22C55E]/35"
          >
            Free Consultation
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-8 py-3 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#22C55E]/40 hover:bg-[#22C55E]/10"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
