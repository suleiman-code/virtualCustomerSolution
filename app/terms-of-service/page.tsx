import { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Scale, Mail, MapPin, Calendar, FileText, AlertTriangle, ShieldCheck, Gavel, Ban, Globe, RefreshCw } from "lucide-react";
import Link from "next/link";
import { officeLocations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Virtual Customer Solution. Review our service terms, liability limitations, intellectual property rights, and acceptable use policy.",
  alternates: {
    canonical: "https://virtualcustomersolution.com/terms-of-service",
  },
};

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the website and services of Virtual Customer Solution (\"VCS\", \"we\", \"our\", or \"us\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
      "These terms apply to all visitors, users, clients, and others who access or use our services, including but not limited to Growth Systems & Reporting, Performance Marketing, and Virtual Workforce Solutions.",
      "We reserve the right to update or modify these terms at any time. Changes become effective upon posting to this page. Your continued use of our services following any changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "services",
    icon: Globe,
    title: "2. Description of Services",
    paragraphs: [
      "Virtual Customer Solution provides digital business services including Growth Systems & Reporting, Performance Marketing, and Virtual Workforce Solutions. Specific deliverables, timelines, and scope of work are defined in individual service agreements or proposals agreed upon between VCS and the client.",
      "We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with reasonable notice to active clients. We are not liable for any modification, suspension, or discontinuation of services beyond the scope of active agreements.",
    ],
  },
  {
    id: "client-obligations",
    icon: ShieldCheck,
    title: "3. Client Obligations",
    paragraphs: [
      "As a client of VCS, you agree to:",
    ],
    items: [
      "Provide accurate, complete, and timely information required for service delivery",
      "Maintain the confidentiality of any account credentials or access provided to you",
      "Respond to reasonable requests for feedback, approvals, or information within agreed timelines",
      "Ensure that any materials, content, or data you provide for use in our services do not infringe upon any third-party rights",
      "Pay all fees as outlined in your service agreement in a timely manner",
      "Comply with all applicable laws and regulations in your use of our services",
    ],
  },
  {
    id: "acceptable-use",
    icon: Ban,
    title: "4. Acceptable Use Policy",
    paragraphs: [
      "You agree not to use our website or services to:",
    ],
    items: [
      "Violate any applicable local, national, or international law or regulation",
      "Transmit any material that is defamatory, obscene, threatening, or otherwise objectionable",
      "Attempt to gain unauthorized access to our systems, networks, or data",
      "Interfere with or disrupt the integrity or performance of our website or services",
      "Use our services for any fraudulent, deceptive, or misleading purpose",
      "Send unsolicited communications (spam) through or using our services",
      "Reverse-engineer, decompile, or attempt to extract source code from our proprietary tools or systems",
      "Resell, sublicense, or redistribute our services without explicit written consent",
    ],
    afterItems: [
      "Violation of this acceptable use policy may result in immediate suspension or termination of services without refund.",
    ],
  },
  {
    id: "intellectual-property",
    icon: Scale,
    title: "5. Intellectual Property Rights",
    paragraphs: [
      "All content on the VCS website — including text, graphics, logos, icons, images, and software — is the property of Virtual Customer Solution or its content suppliers and is protected by applicable intellectual property laws.",
    ],
    items: [
      "Client Materials: You retain ownership of all content, data, and materials you provide to us for service delivery.",
      "VCS Deliverables: Unless otherwise specified in a service agreement, deliverables created specifically for a client (such as reports, dashboards, and campaign assets) are owned by the client upon full payment.",
      "VCS Tools and Methodologies: Our proprietary tools, templates, frameworks, processes, and methodologies remain the exclusive property of VCS, even when used in the delivery of client work.",
      "Website Content: You may not reproduce, distribute, or create derivative works from our website content without prior written permission.",
    ],
  },
  {
    id: "payment-terms",
    icon: FileText,
    title: "6. Payment Terms",
    paragraphs: [
      "Payment terms are outlined in individual service agreements. General terms include:",
    ],
    items: [
      "Invoices are due within the timeframe specified in your service agreement (typically 15 or 30 days from invoice date)",
      "Late payments may incur a fee of 1.5% per month on the outstanding balance",
      "VCS reserves the right to suspend services if payment is overdue by more than 30 days",
      "All fees are non-refundable unless otherwise stated in your specific service agreement",
      "Prices are subject to change with 30 days written notice for ongoing engagements",
    ],
  },
  {
    id: "limitation-of-liability",
    icon: AlertTriangle,
    title: "7. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law:",
    ],
    items: [
      "VCS provides services \"as is\" and makes no warranties, express or implied, regarding the results or outcomes of our services.",
      "VCS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of our services.",
      "Our total liability for any claim related to our services shall not exceed the total amount paid by you to VCS in the 6 months preceding the event giving rise to the claim.",
      "VCS is not responsible for third-party platform changes, algorithm updates, or policy modifications that may affect campaign performance or service delivery.",
      "We do not guarantee specific results, rankings, leads, or revenue outcomes. Marketing and business results depend on numerous factors beyond our control.",
    ],
  },
  {
    id: "confidentiality",
    icon: ShieldCheck,
    title: "8. Confidentiality",
    paragraphs: [
      "Both parties agree to maintain the confidentiality of proprietary information shared during the course of the engagement.",
    ],
    items: [
      "Confidential information includes business strategies, financial data, customer lists, proprietary processes, and any information marked as confidential.",
      "Neither party shall disclose confidential information to third parties without prior written consent, except as required by law.",
      "Confidentiality obligations survive the termination of the service agreement for a period of 2 years.",
      "VCS may reference the client relationship and general scope of work in marketing materials (e.g., case studies) with client approval. Specific metrics or confidential details are never shared without explicit written consent.",
    ],
  },
  {
    id: "termination",
    icon: RefreshCw,
    title: "9. Termination",
    paragraphs: [
      "Either party may terminate a service agreement as follows:",
    ],
    items: [
      "With written notice as specified in the individual service agreement (typically 30 days).",
      "Immediately, if the other party materially breaches these terms and fails to cure the breach within 15 days of written notice.",
      "Upon termination, the client is responsible for payment of all services rendered through the termination date.",
      "VCS will provide reasonable transition support and return of client data upon termination.",
    ],
  },
  {
    id: "governing-law",
    icon: Gavel,
    title: "10. Governing Law and Dispute Resolution",
    paragraphs: [
      "These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan, without regard to conflict of law principles.",
    ],
    items: [
      "Any dispute arising from these terms or the use of our services shall first be addressed through good-faith negotiation between the parties.",
      "If negotiation fails, disputes shall be submitted to mediation administered by a mutually agreed-upon mediator.",
      "If mediation is unsuccessful, disputes shall be resolved through binding arbitration conducted in Pakistan, in accordance with applicable arbitration rules.",
      "Each party shall bear its own costs and attorney fees unless the arbitrator determines otherwise.",
      "Nothing in this section prevents either party from seeking injunctive relief in a court of competent jurisdiction to protect intellectual property rights or confidential information.",
    ],
  },
  {
    id: "indemnification",
    icon: ShieldCheck,
    title: "11. Indemnification",
    paragraphs: [
      "You agree to indemnify, defend, and hold harmless Virtual Customer Solution, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable attorney fees) arising from:",
    ],
    items: [
      "Your use of our services in violation of these terms",
      "Your violation of any applicable law or regulation",
      "Any content or materials you provide that infringe upon third-party rights",
      "Any breach of your obligations under these terms or your service agreement",
    ],
  },
  {
    id: "miscellaneous",
    icon: FileText,
    title: "12. Miscellaneous",
    paragraphs: [],
    items: [
      "Severability: If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
      "Entire Agreement: These terms, together with any applicable service agreement, constitute the entire agreement between you and VCS regarding the subject matter herein.",
      "Waiver: Failure to enforce any provision of these terms shall not constitute a waiver of that provision or any other provision.",
      "Assignment: You may not assign your rights or obligations under these terms without our prior written consent. VCS may assign its rights and obligations without restriction.",
      "Force Majeure: VCS shall not be liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, pandemics, government actions, or internet disruptions.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-wide relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="badge mx-auto mb-6 w-fit">
              <Scale className="h-4 w-4" />
              <span>Legal</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              Please read these terms carefully before using our services. They govern your
              relationship with Virtual Customer Solution.
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
                <div className="space-y-4">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-[var(--text-secondary)] leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {"items" in section && section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex gap-3 text-[var(--text-secondary)] leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--red-primary)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {"afterItems" in section && section.afterItems && (
                    <>
                      {section.afterItems.map((p, pIdx) => (
                        <p key={pIdx} className="text-[var(--text-secondary)] leading-relaxed font-medium">
                          {p}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8">
              <h2 className="mb-4 text-2xl font-bold">Questions About These Terms?</h2>
              <p className="mb-6 text-[var(--text-secondary)]">
                If you have questions or concerns about these Terms of Service, please contact us:
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
                href="/privacy-policy"
                className="btn-outline text-sm"
              >
                Privacy Policy
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
