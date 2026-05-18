import { z } from 'zod/v4'

import { CONTACT_SERVICE_LABELS } from '@/lib/contact-services'

export const SERVICE_OPTIONS = CONTACT_SERVICE_LABELS

export const TEAM_SIZE_OPTIONS = [
  '1-3',
  '4-10',
  '11-25',
  '25+',
  'Not Sure Yet',
] as const

export const SOURCE_OPTIONS = [
  'Google Search',
  'LinkedIn',
  'Referral',
  'Social Media',
  'Blog/Article',
  'Other',
] as const

export const COUNTRY_OPTIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'United Arab Emirates',
  'Saudi Arabia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Pakistan',
  'India',
  'Other',
] as const

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Converted',
  'Not Interested',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.email('Please enter a valid email address'),
  phone: z.string().max(50).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  service: z.string().min(1, 'Please select a service'),
  teamSize: z.string().min(1, 'Please select a team size'),
  companyWebsite: z
    .string()
    .max(300)
    .optional()
    .or(z.literal(''))
    .refine(
      (v) => !v || /^https?:\/\/.+/i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v),
      'Enter a valid website URL'
    ),
  description: z.string().max(1000).optional().or(z.literal('')),
  source: z.string().max(200).optional().or(z.literal('')),
})

export const leadStatusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
})

export type LeadInput = z.infer<typeof leadSchema>
