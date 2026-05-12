'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, CheckCircle, Clock, User, Shield, 
  Mail, Linkedin, Send, Loader2 
} from 'lucide-react';
import { 
  Section, Container, FadeUp, GlassCard, SignalPoint 
} from '@/components/ui-dp/AnimatedElements';
import { trackFormStart, trackFormSubmit, trackFormSuccess, trackFormError } from '@/lib/analytics';

const businessTypes = [
  'B2B Service Business',
  'B2C Service Business',
  'E-commerce',
  'SaaS',
  'Agency',
  'Multi-location Business',
  'Other',
];

const bottlenecks = [
  'Inconsistent lead flow',
  'Poor attribution/reporting',
  'Underperforming ads',
  'Hiring bottlenecks',
  'Founder-dependent execution',
  'Fragmented vendors/tools',
  'Virtual team management',
  'Not sure yet',
];

const services = [
  { id: 'performance', label: 'Performance Marketing' },
  { id: 'systems', label: 'Systems & Reporting' },
  { id: 'workforce', label: 'Virtual Workforce' },
  { id: 'unsure', label: 'Not sure yet' },
];

const adSpendRanges = [
  'Under $5k/month',
  '$5k - $15k/month',
  '$15k - $50k/month',
  '$50k - $100k/month',
  '$100k+/month',
];

const teamSizes = [
  '1-5',
  '6-15',
  '16-50',
  '51-200',
  '200+',
];

interface FormData {
  name: string;
  email: string;
  company: string;
  website: string;
  businessType: string;
  adSpend: string;
  teamSize: string;
  bottleneck: string;
  services: string[];
  notes: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function AuditPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    website: '',
    businessType: '',
    adSpend: '',
    teamSize: '',
    bottleneck: '',
    services: [],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formStarted, setFormStarted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track form start
  useEffect(() => {
    if (!formStarted) {
      const hasData = formData.name || formData.email || formData.notes;
      if (hasData) {
        setFormStarted(true);
        trackFormStart('growth_audit');
      }
    }
  }, [formData, formStarted]);

  // Get UTM params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    }));
  }, []);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.bottleneck) newErrors.bottleneck = 'Please select your primary bottleneck';
    if (!formData.notes.trim() || formData.notes.length < 20) {
      newErrors.notes = 'Please tell us more (at least 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      trackFormError('growth_audit', 'validation');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    trackFormSubmit('growth_audit');
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        trackFormSuccess('growth_audit');
        setIsSubmitted(true);
      } else {
        trackFormError('growth_audit', 'server');
        setSubmitError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      trackFormError('growth_audit', 'network');
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  if (isSubmitted) {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <Container className="relative z-10 py-32">
          <FadeUp>
            <GlassCard className="max-w-2xl mx-auto p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-chart-4/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-chart-4" />
              </div>
              
              <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4">
                Audit Request Received
              </h2>
              
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Thank you for your interest. A founder will review your submission and reach out within 24-48 hours with initial thoughts.
              </p>

              <div className="bg-[var(--surface-glass-strong)] rounded-xl p-6 mb-8">
                <h3 className="font-medium text-[var(--text-primary)] mb-4">What happens next:</h3>
                <div className="space-y-3 text-left">
                  {[
                    'Founder reviews your submission',
                    'Initial assessment prepared',
                    'Email with preliminary thoughts',
                    'Scheduled call if there\'s a fit',
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] text-sm">
                        {i + 1}
                      </div>
                      <span className="text-[var(--text-secondary)] text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[var(--text-muted)] text-sm">
                Questions? Reach out directly at{' '}
                <a href="mailto:contact@virtualcustomersolution.com" className="text-[#22C55E] hover:text-[#059669] transition-colors">
                  contact@virtualcustomersolution.com
                </a>
              </p>
            </GlassCard>
          </FadeUp>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <Container className="relative z-10 pt-32 pb-12">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-glass)] border border-[var(--border-glass)] text-[var(--text-secondary)] text-sm mb-6">
              <SignalPoint size="sm" />
              Free Growth Audit
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight max-w-3xl">
              Request a{' '}
              <span className="text-gradient-lime">founder-led growth audit</span>.
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-[var(--text-secondary)] text-lg mt-6 max-w-2xl leading-relaxed">
              No pressure. No generic recommendations. Just clarity on where you are and what it would take to move forward.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Form Section */}
      <Section className="pt-0">
        <Container>
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <FadeUp className="lg:col-span-3">
              <GlassCard className="p-8">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">Tell Us About Your Business</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-[var(--text-primary)] mb-2 block">
                        Name <span className="text-signal">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)] focus:border-[#22C55E]"
                      />
                      {errors.name && (
                        <p className="text-signal text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[var(--text-primary)] mb-2 block">
                        Work Email <span className="text-signal">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)] focus:border-[#22C55E]"
                      />
                      {errors.email && (
                        <p className="text-signal text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Company & Website */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-[var(--text-primary)] mb-2 block">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                        className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)] focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-[var(--text-primary)] mb-2 block">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://"
                        className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)] focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">Business Type</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    >
                      <SelectTrigger className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)]">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ad Spend & Team Size */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[var(--text-primary)] mb-2 block">Monthly Ad Spend</Label>
                      <Select
                        value={formData.adSpend}
                        onValueChange={(value) => setFormData({ ...formData, adSpend: value })}
                      >
                        <SelectTrigger className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)]">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {adSpendRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[var(--text-primary)] mb-2 block">Team Size</Label>
                      <Select
                        value={formData.teamSize}
                        onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                      >
                        <SelectTrigger className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)]">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Primary Bottleneck */}
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">
                      Primary Bottleneck <span className="text-signal">*</span>
                    </Label>
                    <Select
                      value={formData.bottleneck}
                      onValueChange={(value) => setFormData({ ...formData, bottleneck: value })}
                    >
                      <SelectTrigger className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)]">
                        <SelectValue placeholder="What's your biggest challenge?" />
                      </SelectTrigger>
                      <SelectContent>
                        {bottlenecks.map((bottleneck) => (
                          <SelectItem key={bottleneck} value={bottleneck}>
                            {bottleneck}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bottleneck && (
                      <p className="text-signal text-xs mt-1">{errors.bottleneck}</p>
                    )}
                  </div>

                  {/* Service Focus */}
                  <div>
                    <Label className="text-[var(--text-primary)] mb-3 block">Service Focus</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.services.includes(service.id)
                              ? 'border-[#22C55E] bg-[#22C55E]/5'
                              : 'border-[var(--border-glass)] bg-[var(--surface-glass-strong)] hover:border-border-active'
                          }`}
                        >
                          <Checkbox
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <span className="text-[var(--text-secondary)] text-sm">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-[var(--text-primary)] mb-2 block">
                      Tell us more <span className="text-signal">*</span>
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Describe your current situation, what you've tried, and what you're hoping to achieve..."
                      rows={4}
                      className="bg-[var(--surface-glass-strong)] border-[var(--border-glass)] focus:border-[#22C55E] resize-none"
                    />
                    {errors.notes && (
                      <p className="text-signal text-xs mt-1">{errors.notes}</p>
                    )}
                    <p className="text-[var(--text-muted)] text-xs mt-1">
                      Minimum 20 characters
                    </p>
                  </div>

                  {/* Submit */}
                  {submitError && (
                    <div className="rounded-xl border border-signal/30 bg-signal/10 p-4 text-sm text-red-200">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#22C55E] hover:bg-[#059669] text-white font-semibold py-6 text-lg group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Audit
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </GlassCard>
            </FadeUp>

            {/* Sidebar Info */}
            <FadeUp delay={0.2} className="lg:col-span-2 space-y-6">
              {/* What's Included */}
              <GlassCard className="p-6">
                <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    'Current acquisition audit',
                    'Reporting gap analysis',
                    'Execution bottleneck review',
                    'Clear next steps document',
                    'No-pressure conversation',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
                      <CheckCircle className="w-4 h-4 text-chart-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Timeline */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[#22C55E]" />
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">
                    Response Time
                  </h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">
                  Founder-led review. Expect initial thoughts within 24-48 hours.
                </p>
              </GlassCard>

              {/* Founder-led */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-[#22C55E]" />
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">
                    Founder-Led Review
                  </h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">
                  Every audit is reviewed by a founder — not handed off to a sales team.
                </p>
              </GlassCard>

              {/* Contact */}
              <GlassCard className="p-6">
                <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">
                  Prefer to Reach Out Directly?
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@virtualcustomersolution.com"
                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#22C55E]" />
                    contact@virtualcustomersolution.com
                  </a>
                  <a
                    href="https://linkedin.com/company/virtualcustomersolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#22C55E]" />
                    LinkedIn
                  </a>
                </div>
              </GlassCard>
            </FadeUp>
          </div>
        </Container>
      </Section>
    </>
  );
}
