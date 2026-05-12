import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { rateLimit } from '@/lib/rate-limit'
import { db } from '@/lib/db'
import { sendAdminNotification } from '@/lib/email'
import { forwardTicketToCRM } from '@/lib/crm-webhook'
import { mirrorSubmissionToLeads } from '@/lib/lead-sync'

// Strip HTML tags from a string
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(300),
  message: z.string().min(1, 'Message is required').max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 per hour per IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'anonymous'

    const { success, remaining } = await rateLimit(ip, 'ticket', 5, 60 * 60 * 1000)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many tickets submitted. Please try again later.' },
        {
          status: 429,
          headers: { 'X-RateLimit-Remaining': String(remaining) },
        }
      )
    }

    // Parse and validate body with Zod
    const body = await request.json()
    const result = ticketSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: z.prettifyError(result.error) },
        { status: 400 }
      )
    }

    const data = result.data

    // Sanitize all inputs
    const sanitized = {
      name: sanitize(data.name),
      email: sanitize(data.email),
      subject: sanitize(data.subject),
      message: sanitize(data.message),
      priority: data.priority,
    }

    // Try to save to database (wrapped for serverless compatibility)
    let ticketId: string | null = null
    try {
      const ticket = await db.supportTicket.create({
        data: {
          name: sanitized.name,
          email: sanitized.email,
          subject: sanitized.subject,
          message: sanitized.message,
          priority: sanitized.priority,
          status: 'open',
        },
      })
      ticketId = ticket.id
    } catch (dbError) {
      console.error('[ticket] Database error (non-fatal):', dbError)
      // Continue without DB — generate a fallback ID
      ticketId = `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    }

    void mirrorSubmissionToLeads({
      kind: 'ticket',
      name: sanitized.name,
      email: sanitized.email,
      service: 'Support ticket',
      description: `Subject: ${sanitized.subject}\n\n${sanitized.message}\n\nPriority: ${sanitized.priority}`,
      source: 'Support ticket form',
    })

    // Send admin email notification
    try {
      await sendAdminNotification('contact', {
        type: 'Support Ticket',
        ticketId,
        name: sanitized.name,
        email: sanitized.email,
        subject: sanitized.subject,
        message: sanitized.message,
        priority: sanitized.priority,
      })
    } catch (emailError) {
      console.error('[ticket] Email notification error (non-fatal):', emailError)
    }

    // Forward to Alpha CRM ticket webhook (non-blocking)
    forwardTicketToCRM({
      subject: sanitized.subject,
      description: sanitized.message,
      clientName: sanitized.name,
      clientEmail: sanitized.email,
      priority: sanitized.priority, // low | medium | high | urgent
      channel: 'WEBSITE_FORM',
    })

    return NextResponse.json(
      { success: true, ticketId },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ticket] Error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
