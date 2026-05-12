'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useNavigation, type PageRoute, pageToPath, scrollDocumentToTop } from '@/lib/navigation';
import Image from 'next/image';

const navigation: { name: string; href: PageRoute }[] = [
  { name: 'Home', href: 'home' },
  { name: 'Services', href: 'services' },
  { name: 'Blog', href: 'blog' },
  { name: 'About', href: 'about' },
  { name: 'Contact', href: 'contact' },
];

const loginButtonClass =
  'group relative inline-flex items-center justify-center rounded-full border border-white/18 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#C4C4CC] transition-[border-color,background-color,color] duration-300 hover:border-white/28 hover:bg-white/[0.08] hover:text-[#F5F5F5] sm:px-3.5 sm:py-2 sm:text-sm';

const ctaButtonClass =
  'group relative inline-flex items-center justify-center gap-1.5 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-1.5 text-xs font-semibold text-[#F5F5F5] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#22C55E]/70 hover:bg-[#22C55E]/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.28)] neon-box neon-border sm:px-3.5 sm:py-2 sm:text-sm';

function pathOnly(url: string) {
  const s = url.split('#')[0]?.split('?')[0];
  return s && s.length > 0 ? s : '/';
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentPage, navigateTo, pathname } = useNavigation();

  const samePathAsCurrent = (href: string) => {
    return pathOnly(href) === pathOnly(pathname || '/');
  };

  const scrollToOfferingsSection = () => {
    const go = () =>
      document.getElementById('offerings')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    window.history.replaceState(null, '', '/services#offerings');
    go();
    requestAnimationFrame(go);
  };

  const isNavActive = (href: PageRoute) => {
    return currentPage === href;
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const headerSurface = isScrolled
    ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-2xl border-b border-white/[0.06]'
    : 'bg-[rgba(10,10,10,0.8)] backdrop-blur-md';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ${headerSurface}`}
    >
      <div className="container-wide">
        <div className="relative flex min-h-[72px] items-center py-3 sm:min-h-[76px]">
          {/* Left — brand (aligned with footer treatment) */}
          <div className="relative z-10 flex min-w-0 flex-1 justify-start pointer-events-none">
            <Link
              href="/"
              className="group pointer-events-auto flex min-w-0 flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              onClick={(e) => {
                if (samePathAsCurrent('/')) {
                  e.preventDefault();
                  scrollDocumentToTop();
                  window.history.replaceState(null, '', '/');
                  requestAnimationFrame(scrollDocumentToTop);
                }
              }}
            >
            <Image
              src="/Virtual.png"
                alt="Virtual Customer Solution"
                width={360}
                height={77}
                className="h-12 w-auto max-h-12 max-w-[260px] object-contain object-center sm:max-w-[300px] md:h-16 md:max-h-16 md:max-w-[340px]"
              priority
            />
              <span className="mt-1.5 max-w-[16rem] font-display text-[10px] font-semibold leading-snug tracking-wide text-[#A1A1AA] sm:max-w-[18rem] sm:text-xs md:text-[13px] md:tracking-tight">
                Virtual Customer Solution
            </span>
            </Link>
          </div>

          {/* Center — pill nav (desktop): absolutely centered so left/right columns stay balanced */}
          <nav
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
            aria-label="Main"
          >
            <div className="pointer-events-auto flex items-center gap-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-1.5 py-1">
              {navigation.map((item) => {
                const active = isNavActive(item.href);
                const href = pageToPath[item.href];
                return (
                  <Link
                key={item.name}
                    href={href}
                    onClick={(e) => {
                      if (!samePathAsCurrent(href)) return;
                      e.preventDefault();
                      if (item.href === 'services') {
                        scrollToOfferingsSection();
                        return;
                      }
                      scrollDocumentToTop();
                      if (pathOnly(href) === '/') window.history.replaceState(null, '', '/');
                      requestAnimationFrame(scrollDocumentToTop);
                    }}
                    aria-current={active ? 'page' : undefined}
                    className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300"
                  >
                    {active && (
                  <motion.div
                    layoutId="navPill"
                        className="pointer-events-none absolute inset-0 rounded-full bg-[#22C55E] neon-box"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                    <span
                      className={`relative z-10 ${active ? 'font-semibold text-[#09090B]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'}`}
                    >
                  {item.name}
                </span>
                  </Link>
                );
              })}
          </div>
          </nav>

          {/* Right — CTA + mobile toggle */}
          <div className="relative z-10 flex min-w-0 flex-1 items-center justify-end gap-1.5 pointer-events-none sm:gap-2">
            <Link
              href="/admin/login"
              className={`${loginButtonClass} pointer-events-auto hidden lg:inline-flex`}
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => navigateTo('free-audit')}
              className={`${ctaButtonClass} pointer-events-auto hidden lg:inline-flex`}
            >
              <span>Free Consultation</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
            </button>

            <button
              type="button"
              className="pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white lg:hidden"
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/[0.06] bg-[rgba(10,10,10,0.97)] backdrop-blur-2xl lg:hidden"
          >
            <div className="container-wide py-4">
              <div className="flex flex-col gap-1">
                {navigation.map((item, i) => {
                  const active = isNavActive(item.href);
                  return (
                <motion.button
                  key={item.name}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => {
                        navigateTo(item.href);
                        setIsOpen(false);
                        if (item.href === 'home') {
                          requestAnimationFrame(scrollDocumentToTop);
                        }
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors duration-300 ${
                        active
                          ? 'border border-[#22C55E]/20 bg-[#22C55E]/10 font-semibold text-[#F5F5F5]'
                          : 'border border-transparent text-[#A1A1AA] hover:bg-white/[0.03] hover:text-[#F5F5F5]'
                      }`}
                >
                  {item.name}
                </motion.button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className={`${loginButtonClass} w-full justify-center`}
                >
                  Login
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('free-audit');
                    setIsOpen(false);
                  }}
                  className={`${ctaButtonClass} w-full justify-center`}
                >
                  <span>Free Consultation</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
