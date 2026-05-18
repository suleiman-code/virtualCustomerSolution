import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendLeadAdminNotification, sendLeadAutoReply } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { leadSchema } from '@/lib/validations/lead'
import { forwardToCRM } from '@/lib/crm-webhook'

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success, remaining } = await rateLimit(ip, 'leads', 5)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: { 'X-RateLimit-Remaining': String(remaining) },
        }
      )
    }

    const body = await request.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Save to database
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        country: data.country || null,
        service: data.service,
        teamSize: data.teamSize,
        companyWebsite: data.companyWebsite?.trim() || null,
        description: data.description || null,
        source: data.source || null,
        status: 'New',
      },
    })

    // Email notifications + CRM forward (non-blocking)
    Promise.allSettled([
      sendLeadAdminNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        service: data.service,
        teamSize: data.teamSize,
        companyWebsite: data.companyWebsite?.trim() || null,
        description: data.description,
        source: data.source,
      }),
      sendLeadAutoReply({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        service: data.service,
        teamSize: data.teamSize,
        companyWebsite: data.companyWebsite?.trim() || null,
        description: data.description,
        source: data.source,
      }),
      forwardToCRM({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        service: data.service,
        companyWebsite: data.companyWebsite?.trim() || undefined,
        message: data.description || '',
        formType: 'consultation',
      }),
    ]).catch((err) => {
      console.error('[leads] Async side-effects failed:', err)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation booked successfully.',
        id: lead.id,
      },
      {
        status: 201,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    )
  } catch (error) {
    console.error('[leads] Form error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your request.',
      },
      { status: 500 }
    )
  }
}
