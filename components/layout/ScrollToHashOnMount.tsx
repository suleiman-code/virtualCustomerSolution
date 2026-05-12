'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Scroll to `document.getElementById(hash)` after navigation (client routing ignores hash scroll). */
export function ScrollToHashOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const applyHash = () => {
      const raw = window.location.hash;
      if (!raw || raw === '#') return;
      const id = decodeURIComponent(raw.slice(1));
      if (!id) return;

      let attempts = 0;
      const tick = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        attempts += 1;
        if (attempts < 45) window.setTimeout(tick, 60);
      };
      tick();
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => {
      cancelled = true;
      window.removeEventListener('hashchange', applyHash);
    };
  }, [pathname]);

  return null;
}
