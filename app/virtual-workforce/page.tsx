import { SiteShell } from '@/components/layout/SiteShell';
import { VirtualWorkforcePage } from '@/components/sections/VirtualWorkforcePage';

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Virtual Workforce Solutions',
  description: 'Skilled virtual teams for customer support, operations, and back-office functions.',
  provider: {
    '@type': 'Organization',
    name: 'Virtual Customer Solution',
    url: 'https://virtualcustomersolution.com',
  },
  areaServed: 'Worldwide',
  url: 'https://virtualcustomersolution.com/virtual-workforce',
};

export default function RemoteWorkforceRoute() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <VirtualWorkforcePage />
    </SiteShell>
  );
}
