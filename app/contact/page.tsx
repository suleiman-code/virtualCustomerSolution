'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Instagram, Twitter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard, FadeUp } from '@/components/ui-dp/AnimatedElements';
import { SiteShell } from '@/components/layout/SiteShell';
import { officeLocations } from '@/lib/content';

const AUDIT_INTENT = 'free-audit';
const AUDIT_MESSAGE_DEFAULT =
  "I'd like to request a free digital audit for my business. Here's a bit about what I'm looking for:\n\n";

const formFieldClass =
  'w-full min-h-[44px] rounded-lg border border-white/12 bg-[#121212] px-3 py-2.5 text-sm text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-0';

const selectFieldClass =
  'w-full min-h-[44px] cursor-pointer rounded-lg border border-white/12 bg-[#121212] px-3 py-2.5 text-sm text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-0 [&>option]:bg-[#1a1a1a] [&>option]:text-[#F5F5F5]';

function ContactPageNav({ auditFlow }: { auditFlow: boolean }) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm" aria-label="Page navigation">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 py-1.5 text-[#A1A1AA] transition-colors hover:bg-white/[0.05] hover:text-[#F5F5F5]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back
      </button>
      <span className="text-[#3f3f46]" aria-hidden>
        |
      </span>
      <Link href="/" className="text-[#22C55E] hover:underline">
        Home
      </Link>
      {auditFlow && (
        <>
          <span className="text-[#3f3f46]" aria-hidden>
            /
          </span>
          <span className="text-[#71717A]">Free audit</span>
        </>
      )}
      <span className="text-[#3f3f46]" aria-hidden>
        /
      </span>
      <span className="text-[#71717A]">Contact</span>
    </nav>
  );
}

const serviceOptions = [
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'remote-workforce', label: 'Virtual Workforce' },
  { value: 'web-solutions', label: 'Web Solutions' },
  { value: 'business-growth', label: 'Business Growth' },
  { value: 'not-sure', label: 'Not Sure / Multiple' },
];

const budgetOptions = [
  { value: 'under-1k', label: 'Under $1,000/mo' },
  { value: '1k-5k', label: '$1,000 - $5,000/mo' },
  { value: '5k-10k', label: '$5,000 - $10,000/mo' },
  { value: '10k+', label: '$10,000+/mo' },
  { value: 'other', label: 'Other' },
];

function ContactPageFallback() {
  return (
    <SiteShell>
      <div className="pt-32 pb-20">
        <div className="container-wide">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="mx-auto mt-16 max-w-4xl space-y-4 text-center">
            <div className="mx-auto h-12 max-w-md animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="mx-auto h-6 max-w-lg animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const auditFlow = searchParams.get('intent') === AUDIT_INTENT;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!auditFlow) return;
    setFormData((prev) => {
      if (prev.message.trim().length > 0) return prev;
      return { ...prev, message: AUDIT_MESSAGE_DEFAULT };
    });
  }, [auditFlow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          service: formData.service || undefined,
          budget: formData.budget || undefined,
          message: auditFlow
            ? `[Free audit request]\n\n${formData.message}`
            : formData.message,
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        if (typeof window !== 'undefined' && (window as unknown as { ACCLead?: (d: Record<string, string>) => void }).ACCLead) {
          (window as unknown as { ACCLead: (d: Record<string, string>) => void }).ACCLead({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            page: window.location.pathname,
            source: auditFlow ? 'free-audit-contact' : 'contact-form',
          });
        }
      } else {
        alert('Something went wrong. Please try again or email us directly at contact@virtualcustomersolution.com');
      }
    } catch {
      alert('Something went wrong. Please try again or email us directly at contact@virtualcustomersolution.com');
    }
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <SiteShell>
        <div className="pt-32 pb-20">
          <div className="container-narrow">
            <ContactPageNav auditFlow={auditFlow} />
            <GlassCard className="p-12 text-center">
              <div className="mb-6 text-6xl">✅</div>
              <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-text-secondary text-lg mb-6">
                Thank you for reaching out. We&apos;ll get back to you within 4 hours during business hours.
              </p>
              <p className="text-text-muted mb-8">
                While you wait, feel free to explore our services.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild variant="outline" className="border-white/15 bg-white/[0.03]">
                  <Link href="/services#offerings">View services</Link>
                </Button>
                <Button asChild className="bg-[#22C55E] text-black hover:bg-[#4ADE80]">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="pt-32 pb-20">
        <div className="container-wide">
          <ContactPageNav auditFlow={auditFlow} />

          <div className="text-center max-w-4xl mx-auto mb-16">
            {auditFlow && (
              <div className="mb-4 inline-block rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                Free digital audit
              </div>
            )}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {auditFlow ? 'Request your free audit' : 'Contact Us'}
            </h1>
            <p className="text-text-secondary text-xl">
              {auditFlow
                ? 'Tell us about your business and we will reply with next steps — same form as our main contact page.'
                : 'Got a question or want to talk about a project? Drop us a message and we will get back to you within a few hours.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <FadeUp>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Get In Touch</h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Email</h3>
                      <a
                        href="mailto:contact@virtualcustomersolution.com"
                        className="text-text-secondary hover:text-[#22C55E]"
                      >
                        contact@virtualcustomersolution.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div className="min-w-0 space-y-4">
                      <h3 className="font-semibold text-text-primary">Phone</h3>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {officeLocations.usa.regionLabel}
                        </p>
                        <a
                          href={`tel:${officeLocations.usa.phoneTel}`}
                          className="mt-1 text-text-secondary hover:text-[#22C55E] block"
                        >
                          {officeLocations.usa.phoneDisplay}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {officeLocations.pakistan.regionLabel}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">{officeLocations.pakistan.officeLabel}</p>
                        <a
                          href={`tel:${officeLocations.pakistan.phoneTel}`}
                          className="mt-1 text-text-secondary hover:text-[#22C55E] block"
                        >
                          {officeLocations.pakistan.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div className="min-w-0 space-y-5">
                      <h3 className="font-semibold text-text-primary">Offices</h3>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {officeLocations.usa.regionLabel}
                        </p>
                        <p className="mt-1 text-text-secondary leading-relaxed">
                          <span className="font-medium text-text-primary">{officeLocations.usa.hqLabel}</span>
                          {' · '}
                          {officeLocations.usa.lines.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {officeLocations.pakistan.regionLabel}
                        </p>
                        <p className="mt-1 text-text-secondary leading-relaxed">
                          <span className="font-medium text-text-primary">{officeLocations.pakistan.officeLabel}</span>
                          {' · '}
                          {officeLocations.pakistan.lines.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Office Hours</h3>
                      <p className="text-text-secondary">Mon-Sat 10AM-7PM PKT</p>
                      <p className="text-text-muted text-sm">We respond within a few hours during business days</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-text-primary mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/virtualcustomersolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-glass flex items-center justify-center text-text-secondary hover:text-[#22C55E] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/virtualcustomersolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-glass flex items-center justify-center text-text-secondary hover:text-[#22C55E] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/company/virtualcustomersolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-glass flex items-center justify-center text-text-secondary hover:text-[#22C55E] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/virtualcustsol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-glass flex items-center justify-center text-text-secondary hover:text-[#22C55E] transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <GlassCard className="p-8">
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
                  {auditFlow ? 'Your audit request' : 'Send Us a Message'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Name *</label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className={formFieldClass}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className={formFieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary text-sm mb-2">Phone</label>
                    <Input
                      type="tel"
                      placeholder="+1 (234) 567-890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={formFieldClass}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Service Interest</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={selectFieldClass}
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Budget Range</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className={selectFieldClass}
                      >
                        <option value="">Select your budget</option>
                        {budgetOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary text-sm mb-2">Message *</label>
                    <Textarea
                      placeholder="Tell us about your project or challenges..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className={`${formFieldClass} min-h-[120px]`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#22C55E] hover:bg-[#4ADE80] text-black font-semibold py-4 text-lg"
                  >
                    {isLoading ? 'Sending...' : auditFlow ? 'Submit audit request' : 'Send Message'}
                    {!isLoading && <Send className="w-5 h-5 ml-2" />}
                  </Button>
                </form>
              </GlassCard>
            </FadeUp>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageFallback />}>
      <ContactPageInner />
    </Suspense>
  );
}
