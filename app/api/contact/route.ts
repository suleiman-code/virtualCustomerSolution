import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { sendContactConfirmation, sendAdminNotification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { forwardToCRM } from '@/lib/crm-webhook'
import { mirrorSubmissionToLeads } from '@/lib/lead-sync'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.email('Invalid email address'),
  phone: z.string().max(50).optional(),
  service: z.string().max(100).optional(),
  companyWebsite: z.string().max(300).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success, remaining } = await rateLimit(ip, 'contact', 5)

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      )
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors },
        { status: 400 }
      )
    }

    const data = parsed.data

    const submission = await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
      },
    })

    void mirrorSubmissionToLeads({
      kind: 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      country: null,
      service: data.service?.trim() || 'General inquiry',
      companyWebsite: data.companyWebsite?.trim(),
      description: [data.subject?.trim(), data.message.trim()].filter(Boolean).join('\n\n'),
      source: 'Contact form',
    })

    Promise.allSettled([
      sendContactConfirmation({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
      sendAdminNotification('contact', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
      forwardToCRM({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        companyWebsite: data.companyWebsite,
        message: data.subject ? `${data.subject}\n\n${data.message}` : data.message,
        formType: 'contact',
      }),
    ]).catch((err) => {
      console.error('Email/CRM sending failed:', err)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Message received successfully. We will get back to you soon.',
        id: submission.id,
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
