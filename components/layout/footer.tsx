'use client';

import { Linkedin, Mail, Phone, ArrowUpRight, Instagram, Twitter, Facebook } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useNavigation, scrollDocumentToTop } from '@/lib/navigation';
import { officeLocations } from '@/lib/content';

const footerLinks = {
  quickLinks: [
    { name: 'Home', page: 'home' as const },
    { name: 'Services', page: 'services' as const },
    { name: 'Blog', page: 'blog' as const },
    { name: 'About', page: 'about' as const },
    { name: 'Contact', page: 'contact' as const },
  ],
  services: [
    { name: 'AI-Powered CX', page: 'services' as const },
    { name: 'Digital Engineering', page: 'services' as const },
    { name: 'Virtual Workforce', page: 'services' as const },
    { name: 'Digital Marketing', page: 'services' as const },
  ],
};

export function Footer() {
  const { navigateTo, pathname } = useNavigation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[rgba(34,197,94,0.15)] mt-auto neon-border">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#22C55E]/5 to-transparent pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="mb-6 flex w-full flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:w-auto"
              onClick={(e) => {
                const cur = (pathname || '/').split('?')[0] || '/';
                if (cur === '/') {
                  e.preventDefault();
                  scrollDocumentToTop();
                  window.history.replaceState(null, '', '/');
                  requestAnimationFrame(scrollDocumentToTop);
                }
              }}
            >
              <Image
                src="/Virtual.png"
                alt="Virtual Customer Solution logo"
                width={360}
                height={77}
                className="h-12 w-auto max-w-[260px] object-contain object-center sm:h-14 sm:max-w-[300px] md:h-16 md:max-w-[340px]"
              />
              <span className="mt-1.5 max-w-[16rem] font-display text-[10px] font-semibold leading-snug tracking-wide text-[#A1A1AA] sm:max-w-[18rem] sm:text-xs md:text-[13px] md:tracking-tight">
                Virtual Customer Solution
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#A1A1AA] mb-6">
              Live chat, customer support, virtual staff, marketing, and web — one service provider since 2022.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://facebook.com/virtualcustomersolution" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg glass flex items-center justify-center text-[#A1A1AA] hover:text-[#22C55E] hover:neon-text transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/virtualcustomersolution" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg glass flex items-center justify-center text-[#A1A1AA] hover:text-[#22C55E] hover:neon-text transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/virtualcustomersolution" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg glass flex items-center justify-center text-[#A1A1AA] hover:text-[#22C55E] hover:neon-text transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/virtualcustsol" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg glass flex items-center justify-center text-[#A1A1AA] hover:text-[#22C55E] hover:neon-text transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-[#F5F5F5] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="group inline-flex items-center gap-1 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 translate-y-1 -translate-x-1 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-[#F5F5F5] mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="group inline-flex items-center gap-1 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 translate-y-1 -translate-x-1 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-[#F5F5F5] mb-4">Contact</h4>
            <div className="space-y-6">
              <a
                href="mailto:contact@virtualcustomersolution.com"
                className="group flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#059669] neon-text" />
                contact@virtualcustomersolution.com
              </a>

              <div className="space-y-2 border-l border-white/[0.08] pl-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  {officeLocations.usa.regionLabel}
                </p>
                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                  <span className="font-medium text-[#E4E4E7]">{officeLocations.usa.hqLabel}</span>
                  {' · '}
                  {officeLocations.usa.lines.join(', ')}
                </p>
                <a
                  href={`tel:${officeLocations.usa.phoneTel}`}
                  className="mt-1 inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#059669] neon-text" />
                  {officeLocations.usa.phoneDisplay}
                </a>
              </div>

              <div className="space-y-2 border-l border-white/[0.08] pl-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  {officeLocations.pakistan.regionLabel}
                </p>
                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                  <span className="font-medium text-[#E4E4E7]">{officeLocations.pakistan.officeLabel}</span>
                  {' · '}
                  {officeLocations.pakistan.lines.join(', ')}
                </p>
                <a
                  href={`tel:${officeLocations.pakistan.phoneTel}`}
                  className="mt-1 inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#059669] neon-text" />
                  {officeLocations.pakistan.phoneDisplay}
                </a>
              </div>

              <a
                href="mailto:contact@virtualcustomersolution.com?subject=Support%20request"
                className="group flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#059669] neon-text" />
                Email support
              </a>
              <a
                href="https://linkedin.com/company/virtualcustomersolution"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
              >
                <Linkedin className="h-4 w-4 shrink-0 text-[#059669] neon-text" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(34,197,94,0.15)] py-6 sm:flex-row">
          <p className="text-xs text-[#71717A]">© {currentYear} Virtual Customer Solution. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
