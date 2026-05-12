'use client';

import { useEffect, useState, useRef } from 'react';

const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXX'; // Replace with your AdSense publisher ID

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

function getFormatStyle(format: AdFormat): React.CSSProperties {
  switch (format) {
    case 'rectangle':
      return { display: 'inline-block', width: 336, height: 280 };
    case 'horizontal':
      return { display: 'inline-block', width: 728, height: 90 };
    case 'vertical':
      return { display: 'inline-block', width: 160, height: 600 };
    case 'auto':
    default:
      return { display: 'block' };
  }
}

export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className,
}: AdUnitProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet or ad blocker active
    }
  }, []);

  useEffect(() => {
    if (!adRef.current) return;

    const observer = new MutationObserver(() => {
      if (adRef.current && adRef.current.children.length > 0) {
        setAdLoaded(true);
        observer.disconnect();
      }
    });

    observer.observe(adRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const inlineStyle: React.CSSProperties =
    responsive && format === 'auto'
      ? { display: 'block' }
      : getFormatStyle(format);

  return (
    <div
      className={`ad-unit-wrapper mx-auto my-6 min-h-[90px] overflow-hidden ${className ?? ''}`}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* Placeholder shown until ad content loads */}
      {!adLoaded && (
        <div className="flex min-h-[90px] items-center justify-center rounded-lg border border-white/[0.06] bg-[#1E293B]/40 text-xs text-white/40">
          <span>Advertisement</span>
        </div>
      )}

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          ...inlineStyle,
          ...(adLoaded ? {} : { position: 'absolute', left: -9999 }),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        {...(responsive && format === 'auto'
          ? { 'data-full-width-responsive': 'true' }
          : {})}
        {...(format !== 'auto' ? { 'data-ad-format': format } : {})}
      />
    </div>
  );
}
