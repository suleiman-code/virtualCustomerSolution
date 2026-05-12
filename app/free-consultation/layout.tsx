import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Free Virtual Team Consultation | VCS',
  },
  description:
    'Book a free 30-minute strategy call with VCS. Get a custom cost breakdown, team proposal, and matched candidates. Build your virtual team in 2 weeks.',
  alternates: {
    canonical: 'https://virtualcustomersolution.com/free-consultation',
  },
  openGraph: {
    title: 'Free Virtual Team Consultation | VCS',
    description:
      'Book a free 30-minute strategy call. Get a custom cost breakdown, team proposal, and matched candidates.',
    url: 'https://virtualcustomersolution.com/free-consultation',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'VCS Free Virtual Team Consultation',
      },
    ],
  },
}

export default function FreeConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
