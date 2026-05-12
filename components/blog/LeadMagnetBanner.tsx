import Link from 'next/link';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import { ArrowRight, TrendingUp } from 'lucide-react';

export function LeadMagnetBanner() {
  return (
    <section className="mt-16 relative rounded-2xl overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#059669] via-[#22C55E] to-[#059669]" />
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmg0djJoMnY0aC0ydjJoLTR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />

      <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4" />
          Free Growth Audit
        </div>

        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
          Ready to Scale Your Business Without the Overhead?
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-8">
          Get a personalized audit revealing exactly where you are losing money and how our solutions can save you 40-60% on operational costs.
        </p>

        <Link
          href={FREE_AUDIT_CONTACT_HREF}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white text-[#059669] font-semibold hover:bg-white/90 transition-colors text-base"
        >
          Get Your Free Audit
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
