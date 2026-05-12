'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';

export function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past roughly one viewport height
      setVisible(window.scrollY > window.innerHeight);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
          transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="border-t border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-xl">
            <div className="container-wide flex items-center justify-between gap-4 py-3">
              <p className="hidden text-sm text-white/70 sm:block">
                Not sure where to start?{' '}
                <span className="font-medium text-[#F5F5F5]">
                  We&apos;ll review your setup for free.
                </span>
              </p>
              <p className="text-sm text-white/70 sm:hidden">
                <span className="font-medium text-[#F5F5F5]">Free review</span>
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={FREE_AUDIT_CONTACT_HREF}
                  className="inline-flex items-center justify-center rounded-full bg-[#22C55E] px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-[#22C55E]/20 transition hover:bg-[#4ADE80] hover:shadow-[#22C55E]/30"
                >
                  Get Started
                </Link>

                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss banner"
                  className="rounded-full p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
