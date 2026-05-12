import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProofBar } from '@/components/sections/ProofBar';
import { LatestInsights } from '@/components/sections/LatestInsights';
import { OurServices } from '@/components/sections/OurServices';
import { FreeResources } from '@/components/sections/FreeResources';
import { FAQSection } from '@/components/sections/FAQSection';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { HomepageTestimonials } from '@/components/sections/HomepageTestimonials';
import { HomepageHeroText } from '@/components/sections/HomepageHeroText';
import { HomepageClosingCTA } from '@/components/sections/HomepageClosingCTA';
import { MascotDivider } from '@/components/layout/MascotDivider';
import { TrustBar } from '@/components/sections/TrustBar';

export const metadata: Metadata = {
  title: 'AI Marketing & Virtual Teams | Virtual Customer Solution',
  description:
    'Virtual staff, marketing, web development, and operations support under one roof. 200+ clients in 15+ countries. Request a free consultation.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Virtual Customer Solution | Virtual Teams & Digital Growth',
    description:
      'Build teams that get things done — marketing, virtual workforce, and web development without the overhead.',
  },
};

export default function HomePage() {
  return (
    <SiteShell>
      <ScrollProgress />
      <HeroSection />
      <HomepageHeroText />
      <ProofBar />
      <TrustBar />
      <MascotDivider />
      <OurServices />
      <MascotDivider />
      <HomepageTestimonials />
      <MascotDivider />
      <LatestInsights />
      <FreeResources />
      <FAQSection />
      <HomepageClosingCTA />
    </SiteShell>
  );
}
