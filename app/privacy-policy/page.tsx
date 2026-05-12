import { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Shield, Mail, MapPin, Calendar, Cookie, Database, UserCheck, Eye, Trash2, Lock } from "lucide-react";
import Link from "next/link";
import { officeLocations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Virtual Customer Solution. Learn how we collect, use, and protect your personal data in compliance with GDPR and applicable privacy regulations.",
  alternates: {
    canonical: "https://virtualcustomersolution.com/privacy-policy",
  },
};

const sections = [
  {
    id: "information-we-collect",
    icon: Database,
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information You Provide Directly",
        items: [
          "Contact information (name, email address, phone number) when you fill out forms, request a consultation, or contact us",
          "Business information (company name, website URL, industry) when you request a growth audit or service inquiry",
          "Communication records when you correspond with us via email, chat, or phone",
          "Payment and billing information when you engage our services (processed securely through third-party payment processors)",
        ],
      },
      {
        subtitle: "Information Collected Automatically",
        items: [
          "Device and browser information (browser type, operating system, screen resolution)",
          "IP address and approximate geographic location",
          "Pages visited, time spent on pages, click patterns, and navigation paths",
          "Referring website or source that directed you to our site",
          "Cookies and similar tracking technologies (see Section 3 below)",
        ],
      },
      {
        subtitle: "Information from Third Parties",
        items: [
          "Analytics data from Google Analytics and similar platforms",
          "Advertising data from platforms such as Google Ads and Meta Ads when you interact with our advertisements",
          "Publicly available business information relevant to our service proposals",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: null,
        items: [
          "To provide, maintain, and improve our services including Growth Systems & Reporting, Performance Marketing, and Virtual Workforce Solutions",
          "To respond to your inquiries, process service requests, and communicate about your account",
          "To send relevant marketing communications (only with your consent, and you may opt out at any time)",
          "To analyze website usage patterns and improve our site experience",
          "To comply with legal obligations and protect against fraudulent or unauthorized activity",
          "To personalize your experience and deliver content relevant to your interests",
          "To generate aggregated, anonymized analytics for internal business reporting",
        ],
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "3. Cookies and Tracking Technologies",
    content: [
      {
        subtitle: "Essential Cookies",
        items: [
          "Required for basic site functionality, security, and session management. These cannot be disabled without impacting site usability.",
        ],
      },
      {
        subtitle: "Analytics Cookies",
        items: [
          "We use Google Analytics to understand how visitors interact with our website. This includes page views, session duration, and traffic sources. Google Analytics uses cookies to collect this data in an anonymized form.",
        ],
      },
      {
        subtitle: "Advertising Cookies",
        items: [
          "If applicable, Google AdSense or other advertising networks may place cookies to serve relevant advertisements based on your browsing activity. These cookies are managed by the respective ad networks and are subject to their own privacy policies.",
        ],
      },
      {
        subtitle: "Managing Cookies",
        items: [
          "You can control and delete cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Note that disabling certain cookies may affect your experience on our site.",
        ],
      },
    ],
  },
  {
    id: "data-sharing",
    icon: UserCheck,
    title: "4. Data Sharing and Disclosure",
    content: [
      {
        subtitle: null,
        items: [
          "Service Providers: We share data with trusted third-party providers who assist in operating our website, conducting our business, or servicing you (e.g., hosting providers, email platforms, CRM tools). These providers are contractually obligated to protect your data.",
          "Legal Requirements: We may disclose your information when required by law, regulation, legal process, or governmental request.",
          "Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.",
          "With Your Consent: We may share information for any other purpose disclosed to you at the time of collection or with your explicit consent.",
          "We do not sell your personal information to third parties.",
        ],
      },
    ],
  },
  {
    id: "data-retention",
    icon: Trash2,
    title: "5. Data Retention",
    content: [
      {
        subtitle: null,
        items: [
          "We retain personal data only as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.",
          "Contact form submissions and inquiry data: retained for up to 3 years after your last interaction with us.",
          "Analytics data: retained in anonymized form for up to 26 months (as configured in Google Analytics).",
          "Client service data: retained for the duration of the service engagement plus 5 years for legal and compliance purposes.",
          "You may request deletion of your data at any time (see Section 7).",
        ],
      },
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    title: "6. Data Security",
    content: [
      {
        subtitle: null,
        items: [
          "We implement industry-standard technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.",
          "Data transmitted through our website is encrypted using SSL/TLS technology.",
          "Access to personal data is restricted to authorized personnel on a need-to-know basis.",
          "We regularly review and update our security practices to align with current standards.",
          "While we strive to protect your data, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    icon: UserCheck,
    title: "7. Your Rights (GDPR and Applicable Law)",
    content: [
      {
        subtitle: "If you are located in the EU/EEA or a jurisdiction with similar protections, you have the right to:",
        items: [
          "Access: Request a copy of the personal data we hold about you.",
          "Rectification: Request correction of inaccurate or incomplete personal data.",
          "Erasure: Request deletion of your personal data (\"right to be forgotten\").",
          "Restriction: Request that we restrict processing of your data under certain circumstances.",
          "Portability: Request your data in a structured, commonly used, machine-readable format.",
          "Objection: Object to processing of your personal data for direct marketing or based on legitimate interests.",
          "Withdraw Consent: Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of processing before withdrawal.",
        ],
      },
      {
        subtitle: "To exercise any of these rights, contact us at:",
        items: [
          "Email: contact@virtualcustomersolution.com",
          "We will respond to your request within 30 days.",
        ],
      },
    ],
  },
  {
    id: "coppa",
    icon: Shield,
    title: "8. Children's Privacy (COPPA Compliance)",
    content: [
      {
        subtitle: null,
        items: [
          "Our services are not directed to individuals under the age of 13 (or the applicable age of consent in your jurisdiction).",
          "We do not knowingly collect personal information from children under 13.",
          "If we become aware that we have collected personal data from a child under 13 without verified parental consent, we will take steps to delete that information promptly.",
          "If you believe we have inadvertently collected information from a child, please contact us immediately at contact@virtualcustomersolution.com.",
        ],
      },
    ],
  },
  {
    id: "international-transfers",
    icon: MapPin,
    title: "9. International Data Transfers",
    content: [
      {
        subtitle: null,
        items: [
          "Virtual Customer Solution is based in Pakistan. Your information may be transferred to and processed in countries other than your own.",
          "When we transfer data internationally, we take appropriate safeguards to ensure your data is protected in accordance with this privacy policy and applicable data protection laws.",
          "By using our services, you consent to the transfer of your information to Pakistan and other countries where we or our service providers operate.",
        ],
      },
    ],
  },
  {
    id: "changes",
    icon: Calendar,
    title: "10. Changes to This Policy",
    content: [
      {
        subtitle: null,
        items: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.",
          "We will post the updated policy on this page and update the \"Last Updated\" date.",
          "We encourage you to review this policy periodically. Continued use of our site after changes constitutes acceptance of the revised policy.",
        ],
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-wide relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="badge mx-auto mb-6 w-fit">
              <Shield className="h-4 w-4" />
              <span>Legal</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              Your privacy matters to us. This policy explains how Virtual Customer Solution
              collects, uses, and protects your personal information.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 font-mono text-sm text-[var(--text-light)]">
              <Calendar className="h-4 w-4" />
              <span>Last Updated: March 25, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="border-y border-[var(--border-subtle)] py-8">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Contents
            </h2>
            <nav className="grid gap-2 sm:grid-cols-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-glass-strong)] hover:text-[var(--text-primary)]"
                >
                  <section.icon className="h-4 w-4 shrink-0 text-[var(--red-primary)]" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl space-y-16">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-glass-strong)]">
                    <section.icon className="h-5 w-5 text-[var(--red-primary)]" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((block, blockIdx) => (
                    <div key={blockIdx}>
                      {block.subtitle && (
                        <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
                          {block.subtitle}
                        </h3>
                      )}
                      <ul className="space-y-3">
                        {block.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex gap-3 text-[var(--text-secondary)] leading-relaxed"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--red-primary)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8">
              <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
              <p className="mb-6 text-[var(--text-secondary)]">
                If you have questions about this Privacy Policy or wish to exercise your data rights,
                please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <Mail className="h-5 w-5 text-[var(--red-primary)]" />
                  <a
                    href="mailto:contact@virtualcustomersolution.com"
                    className="underline decoration-[var(--red-primary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
                  >
                    contact@virtualcustomersolution.com
                  </a>
                </div>
                <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--red-primary)]" />
                  <span className="text-sm leading-relaxed">
                    <strong className="font-semibold text-[var(--text-primary)]">Virtual Customer Solution</strong>
                    <br />
                    {officeLocations.usa.hqLabel} ({officeLocations.usa.regionLabel}):{' '}
                    {officeLocations.usa.lines.join(', ')}
                    <br />
                    {officeLocations.pakistan.officeLabel} ({officeLocations.pakistan.regionLabel}):{' '}
                    {officeLocations.pakistan.lines.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="flex flex-wrap gap-4 border-t border-[var(--border-subtle)] pt-8">
              <Link
                href="/terms-of-service"
                className="btn-outline text-sm"
              >
                Terms of Service
              </Link>
              <Link href="/contact" className="btn-outline text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
