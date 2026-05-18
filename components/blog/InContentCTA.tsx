import Link from 'next/link';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import { Zap } from 'lucide-react';

export function InContentCTA() {
  return (
    <div className="my-10 relative rounded-xl overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#22C55E] via-[#059669] to-[#22C55E] p-[1px]">
        <div className="absolute inset-[1px] rounded-[11px] bg-[#1E293B]" />
      </div>

      <div className="relative p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#059669] flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-semibold text-white mb-1">
            Want to see how this applies to your business?
          </p>
          <p className="text-sm text-white/60">
            Get a free growth audit and discover untapped opportunities for your brand.
          </p>
        </div>

        <Link
          href={FREE_AUDIT_CONTACT_HREF}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#22C55E] hover:bg-[#059669] text-white text-sm font-semibold transition-colors"
        >
          Free Consultation
        </Link>
      </div>
    </div>
  );
}
