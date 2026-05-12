import type { ReactNode } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { ScrollToHashOnMount } from '@/components/layout/ScrollToHashOnMount';
import { Footer } from '@/components/layout/footer';
import { ExitIntentPopup } from '@/components/sections/ExitIntentPopup';
import { StickyCTABar } from '@/components/sections/StickyCTABar';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Global background — static on mobile, animated on desktop */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
        {/* Mobile: simple static gradients (zero GPU cost) */}
        <div className="md:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.04)_0%,transparent_60%)]" />
        <div className="md:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(5,150,105,0.03)_0%,transparent_60%)]" />
        {/* Desktop: animated blur orbs */}
        <div className="hidden md:block absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#22C55E]/[0.04] blur-[150px] animate-[hero-drift_20s_ease-in-out_infinite]" />
        <div className="hidden md:block absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#059669]/[0.03] blur-[130px] animate-[hero-drift_25s_ease-in-out_infinite_reverse]" />
        <div className="hidden md:block absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-[#4ADE80]/[0.02] blur-[100px] animate-[hero-drift_18s_ease-in-out_infinite_2s]" />
        <div className="hidden md:block absolute inset-0 grid-bg opacity-[0.03]" />
      </div>
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1] hidden md:block" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />
        <ScrollToHashOnMount />
        <main className="flex-1 pt-[var(--site-header-height)]">{children}</main>
        <Footer />
        <ExitIntentPopup />
        <StickyCTABar />
      </div>
    </div>
  );
}
