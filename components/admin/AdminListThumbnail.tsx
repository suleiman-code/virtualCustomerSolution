'use client';

import { useState, type ReactNode } from 'react';

export function AdminListThumbnail({
  src,
  alt = '',
  className = '',
  fallback,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  if (!src?.trim() || failed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin URLs
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
