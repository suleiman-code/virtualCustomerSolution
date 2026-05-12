import { SiteShell } from '@/components/layout/SiteShell';
import { OurServices } from '@/components/sections/OurServices';
import { ServicesPageView } from '@/components/services/ServicesPageView';
import { SERVICES_PAGE_CATEGORIES } from '@/lib/services-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Marketing & Virtual Workforce Services',
  description:
    'Full-stack digital marketing, virtual workforce & web development. Custom plans from $399/mo. Free consultation available.',
  alternates: {
    canonical: 'https://virtualcustomersolution.com/services',
  },
  openGraph: {
    title: 'Digital Marketing & Virtual Workforce Services | Virtual Customer Solution',
    description:
      'Full-stack digital marketing, virtual workforce & web development. Save 50-75% vs hiring in-house. Plans from $399/mo.',
    url: 'https://virtualcustomersolution.com/services',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Virtual Customer Solution Services — Digital Marketing & Virtual Teams',
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <ServicesPageView
        categories={SERVICES_PAGE_CATEGORIES}
        belowHero={<OurServices sectionId="offerings" />}
      />
    </SiteShell>
  );
}
