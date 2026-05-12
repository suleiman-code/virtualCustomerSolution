import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Free Consultation',
  description: 'Get in touch with Virtual Customer Solution. Request a free consultation for digital marketing, virtual workforce, or web development. Usually responds within a few hours.',
  alternates: {
    canonical: 'https://virtualcustomersolution.com/contact',
  },
  openGraph: {
    title: 'Contact Virtual Customer Solution — Free Consultation',
    description: 'Request a free consultation for digital marketing, virtual workforce, or web development. Based in Lahore, serving 15+ countries.',
    url: 'https://virtualcustomersolution.com/contact',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Contact Virtual Customer Solution' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
