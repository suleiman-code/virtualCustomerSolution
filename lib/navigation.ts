'use client';

import { useCallback, useMemo } from 'react';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import { usePathname, useRouter } from 'next/navigation';

/** Force document to scroll top (avoids smooth-only scroll failing on same-route). */
export function scrollDocumentToTop() {
  if (typeof window === 'undefined') return;
  const root = document.scrollingElement ?? document.documentElement;
  root.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}

function pathOnly(url: string) {
  const s = url.split('#')[0]?.split('?')[0];
  return s && s.length > 0 ? s : '/';
}

export type PageRoute =
  | 'home'
  | 'services'
  | 'about'
  | 'blog'
  | 'contact'
  | 'free-audit'
  | 'performance-marketing'
  | 'virtual-workforce'
  | 'systems-reporting'
  | 'results'
  | 'free-growth-audit';

export const pathToPage: Record<string, PageRoute> = {
  '/': 'home',
  '/services': 'services',
  '/about': 'about',
  '/blog': 'blog',
  '/contact': 'contact',
  '/performance-marketing': 'performance-marketing',
  '/virtual-workforce': 'virtual-workforce',
  '/systems-reporting': 'systems-reporting',
  '/results': 'results',
  '/free-growth-audit': 'free-growth-audit',
};

export const pageToPath: Record<PageRoute, string> = {
  home: '/',
  services: '/services#offerings',
  about: '/about',
  blog: '/blog',
  contact: '/contact',
  'free-audit': FREE_AUDIT_CONTACT_HREF,
  'performance-marketing': '/performance-marketing',
  'virtual-workforce': '/virtual-workforce',
  'systems-reporting': '/systems-reporting',
  results: '/results',
  'free-growth-audit': FREE_AUDIT_CONTACT_HREF,
};

export const pageNames: Record<PageRoute, string> = {
  home: 'Home',
  services: 'Services',
  about: 'About',
  blog: 'Blog',
  contact: 'Contact',
  'free-audit': 'Free Consultation',
  'performance-marketing': 'Performance Marketing',
  'virtual-workforce': 'Virtual Workforce',
  'systems-reporting': 'Systems & Reporting',
  results: 'Results',
  'free-growth-audit': 'Free Growth Audit',
};

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = useMemo<PageRoute>(() => {
    if (!pathname || pathname === '/') return 'home';
    const path = pathOnly(pathname);
    if (path === '/') return 'home';
    if (path.startsWith('/blog') || path.startsWith('/insight')) return 'blog';
    if (path.startsWith('/services') || path.startsWith('/offering')) return 'services';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    return pathToPage[path] ?? 'home';
  }, [pathname]);

  const navigateTo = useCallback(
    (page: PageRoute) => {
      if (page === 'home') {
        if (typeof window === 'undefined') return;

        const onHomePath = pathname === '/' || pathname === '';

        scrollDocumentToTop();
        if (onHomePath) {
          window.history.replaceState(null, '', '/');
          requestAnimationFrame(() => scrollDocumentToTop());
        } else {
          router.push('/');
          requestAnimationFrame(() => {
            scrollDocumentToTop();
            requestAnimationFrame(scrollDocumentToTop);
          });
        }
        return;
      }

      if (page === 'services') {
        if (typeof window !== 'undefined' && pathOnly(pathname || '/') === '/services') {
          window.history.replaceState(null, '', '/services#offerings');
          const go = () =>
            document.getElementById('offerings')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          go();
          requestAnimationFrame(go);
          return;
        }
        router.push('/services#offerings');
        return;
      }

      router.push(pageToPath[page]);
      scrollDocumentToTop();
      requestAnimationFrame(scrollDocumentToTop);
    },
    [router, pathname],
  );

  return { currentPage, navigateTo, pathname };
}
