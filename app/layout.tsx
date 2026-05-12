import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://virtualcustomersolution.com"),
  title: {
    default: "AI Marketing & Virtual Teams | Virtual Customer Solution",
    template: "%s | Virtual Customer Solution",
  },
  description:
    "Save 50-75% with AI-powered digital marketing, virtual teams & web development. 200+ clients in 15+ countries. Get your free consultation today.",
  keywords: [
    "IT consulting",
    "digital marketing agency",
    "virtual workforce",
    "virtual assistants",
    "custom software development",
    "mobile app development",
    "digital transformation",
    "marketing agency near me",
    "virtual customer service",
    "virtual team management",
    "lead generation",
    "SEO services",
    "PPC management",
  ],
  authors: [{ name: "Virtual Customer Solution" }],
  creator: "Virtual Customer Solution",
  publisher: "Virtual Customer Solution",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Virtual Customer Solution | IT, Marketing & Virtual Workforce Solutions",
    description:
      "Marketing, virtual teams, web development, and operations support for businesses that want to grow without the overhead.",
    url: "https://virtualcustomersolution.com",
    siteName: "Virtual Customer Solution",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Virtual Customer Solution - IT, Marketing & Virtual Workforce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Customer Solution | IT & Digital Services",
    description:
      "Virtual teams, marketing, web dev, and operations support — all under one roof.",
    images: ["/opengraph-image"],
    creator: "@virtualcustomersolution",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://virtualcustomersolution.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ backgroundColor: '#0A0A0A' }}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Links/meta first so extensions are less likely to mutate JSON-LD before hydration */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="msapplication-TileColor" content="#22C55E" />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': ['ProfessionalService', 'Organization'],
                  name: 'Virtual Customer Solution',
                  url: 'https://www.virtualcustomersolution.com',
                  logo: 'https://www.virtualcustomersolution.com/Virtual.png',
                  image: 'https://www.virtualcustomersolution.com/opengraph-image',
                  description:
                    'AI-powered digital marketing, virtual workforce, and web development solutions for businesses in 15+ countries.',
                  email: 'contact@virtualcustomersolution.com',
                  telephone: '+92-315-1407896',
                  priceRange: '$399-$2499/mo',
                  openingHours: 'Mo-Sa 10:00-19:00',
                  currenciesAccepted: 'USD, PKR',
                  paymentAccepted: 'Bank Transfer, PayPal',
                  sameAs: [
                    'https://facebook.com/virtualcustomersolution',
                    'https://linkedin.com/company/virtualcustomersolution',
                    'https://twitter.com/virtualcustsol',
                    'https://instagram.com/virtualcustomersolution',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+92-315-1407896',
                    email: 'contact@virtualcustomersolution.com',
                    contactType: 'customer service',
                    availableLanguage: ['English', 'Urdu'],
                    areaServed: ['US', 'UK', 'AE', 'CA', 'AU', 'PK'],
                  },
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '114 McLeod Rd',
                    addressLocality: 'Lahore',
                    addressCountry: 'PK',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '31.5497',
                    longitude: '74.3436',
                  },
                  founder: {
                    '@type': 'Person',
                    name: 'M Faizan Rafiq',
                    jobTitle: 'Founder & CEO',
                  },
                  foundingDate: '2017',
                  numberOfEmployees: {
                    '@type': 'QuantitativeValue',
                    minValue: 50,
                    maxValue: 100,
                  },
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Services',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Digital Marketing',
                          description: 'SEO, PPC, social media, content marketing',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Virtual Workforce',
                          description: 'Virtual assistants, marketing specialists, support agents',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Web Development',
                          description: 'Websites, e-commerce stores, custom web applications',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Business Growth',
                          description: 'Lead generation, CRO, analytics, strategy',
                        },
                      },
                    ],
                  },
                },
                {
                  '@type': 'ProfessionalService',
                  name: 'Virtual Customer Solution',
                  description:
                    'Digital marketing, virtual workforce, web development, and business growth services.',
                  url: 'https://virtualcustomersolution.com',
                  serviceType: [
                    'Digital Marketing',
                    'Virtual Workforce',
                    'Custom Software Development',
                    'Mobile Application Development',
                    'Web Development',
                  ],
                  areaServed: {
                    '@type': 'Place',
                    name: 'Worldwide',
                  },
                  priceRange: '$$',
                },
                {
                  '@type': 'WebSite',
                  name: 'Virtual Customer Solution',
                  url: 'https://virtualcustomersolution.com',
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://virtualcustomersolution.com',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <Script
          src="https://alpha-command-center.vercel.app/tracker.js"
          data-key="cmmsabwlt0003rgw4qj6w0y0e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
