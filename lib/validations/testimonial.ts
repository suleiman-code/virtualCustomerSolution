import { z } from 'zod/v4';

export const TESTIMONIAL_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

export const testimonialSubmitSchema = z
  .object({
    name: z.string().optional(),
    author: z.string().optional(),
    role: z.string().min(2, 'Role is required').max(120),
    country: z.string().optional(),
    feedback: z.string().optional(),
    quote: z.string().optional(),
    location: z.string().max(160).optional().or(z.literal('')),
    amount: z.string().max(40).optional().or(z.literal('')),
    service: z.string().max(80).optional().or(z.literal('')),
  })
  .transform((data) => {
    const author = (data.name ?? data.author ?? '').trim();
    const quote = (data.feedback ?? data.quote ?? '').trim();
    return {
      author,
      role: data.role.trim(),
      location: (data.country ?? data.location ?? '').trim(),
      quote,
      amount: data.amount?.trim() || '',
      service: data.service?.trim() || '',
    };
  })
  .pipe(
    z.object({
      author: z.string().min(2, 'Name is required').max(120),
      role: z.string().min(2, 'Role is required').max(120),
      location: z
        .string()
        .min(2, 'Country is required')
        .max(160),
      quote: z.string().min(10, 'Please share a bit more detail').max(1200),
      amount: z.string().max(40),
      service: z.string().max(80),
    })
  );

export const testimonialStatusSchema = z.object({
  status: z.enum(TESTIMONIAL_STATUSES),
});

export type TestimonialSubmitInput = z.infer<typeof testimonialSubmitSchema>;
