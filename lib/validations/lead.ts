import { z } from 'zod/v4'

export const SERVICE_OPTIONS = [
  'IT Staffing',
  'Digital Marketing Team',
  'Remote Workforce',
  'Custom Solution',
] as const

export const TEAM_SIZE_OPTIONS = [
  '1-3',
  '4-10',
  '11-25',
  '25+',
  'Not Sure Yet',
] as const

export const BUDGET_OPTIONS = [
  'Under $2K/mo',
  '$2K-$5K/mo',
  '$5K-$15K/mo',
  '$15K+/mo',
  "Let's Discuss",
  'Other',
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
  budget: z.string().min(1, 'Please select a budget range'),
  description: z.string().max(1000).optional().or(z.literal('')),
  source: z.string().max(200).optional().or(z.literal('')),
})

export const leadStatusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
})

export type LeadInput = z.infer<typeof leadSchema>
