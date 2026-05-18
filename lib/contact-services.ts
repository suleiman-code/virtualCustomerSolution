/** Services shown on contact / lead forms (single source of truth). */
export const CONTACT_SERVICE_OPTIONS = [
  { value: 'seo-services', label: 'SEO Services' },
  { value: 'ppc-paid-advertising', label: 'PPC/Paid Advertising' },
  { value: 'social-media-marketing', label: 'Social Media Marketing' },
  { value: 'content-marketing', label: 'Content Marketing' },
  { value: 'web-design-development', label: 'Web Design & Development' },
  { value: 'email-sms-marketing', label: 'Email & SMS Marketing' },
  { value: 'ai-services', label: 'AI Services' },
  { value: 'multiple-not-sure', label: 'Multiple / Not sure yet' },
] as const;

export const CONTACT_SERVICE_LABELS = CONTACT_SERVICE_OPTIONS.map((o) => o.label);

export function contactServiceLabel(value: string): string {
  const match = CONTACT_SERVICE_OPTIONS.find((o) => o.value === value);
  return match?.label ?? value;
}
