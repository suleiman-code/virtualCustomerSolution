import { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { ResultsPage } from '@/components/sections/ResultsPage';

export const metadata: Metadata = {
  title: 'Results — Real Numbers From Real Clients',
  description: 'See real results and case studies from our clients. Measurable growth in revenue, leads, and efficiency through our digital marketing, virtual workforce, and systems reporting services.',
};

export default function ResultsRoute() {
  return (
    <SiteShell>
      <ResultsPage />
    </SiteShell>
  );
}
