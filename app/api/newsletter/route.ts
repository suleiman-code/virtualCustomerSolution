import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { forwardToCRM } from '@/lib/crm-webhook'
import { mirrorSubmissionToLeads } from '@/lib/lead-sync'

const newsletterSchema = z.object({
  email: z.email('Please provide a valid email address.'),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success, remaining } = await rateLimit(ip, 'newsletter', 3)

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      )
    }

    const body = await request.json()
    const parsed = newsletterSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    // Check for duplicate
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    const subscriber = await db.newsletterSubscriber.create({
      data: { email },
    })

    void mirrorSubmissionToLeads({
      kind: 'newsletter',
      name: 'Newsletter subscriber',
      email,
      service: 'Newsletter',
      description: 'Signed up via website newsletter form.',
      source: 'Newsletter',
    })

    Promise.allSettled([
      sendWelcomeEmail(email),
      sendAdminNotification('newsletter', { email }),
      forwardToCRM({
        name: 'Newsletter Subscriber',
        email,
        formType: 'newsletter',
      }),
    ]).catch((err) => {
      console.error('Email/CRM sending failed:', err)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to the newsletter.',
        id: subscriber.id,
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    )
  } catch (error) {
    // Handle Prisma unique constraint error as a fallback
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
