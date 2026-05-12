import nodemailer from 'nodemailer'

const ADMIN_EMAIL = 'contact@virtualcustomersolution.com'
const COMPANY_NAME = 'Virtual Customer Solution'

// ─── Graceful SMTP fallback ─────────────────────────────────────────────────

function isSmtpConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter() {
  if (!isSmtpConfigured()) {
    return null
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn(
      `[email] SMTP not configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS). ` +
      `Skipping email to="${to}" subject="${subject}"`
    )
    return
  }
  const from = `${COMPANY_NAME} <${process.env.SMTP_USER}>`
  await transporter.sendMail({ from, to, subject, html })
}

// ─── Dark-themed branded base template ──────────────────────────────────────

const COLORS = {
  bg: '#0F172A',
  surface: '#1E293B',
  accent: '#22C55E',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#334155',
} as const

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${COLORS.surface};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.border};">
          <!-- Header -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:28px 32px;text-align:center;border-bottom:2px solid ${COLORS.accent};">
              <h1 style="color:${COLORS.accent};margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">VCS</h1>
              <p style="color:${COLORS.muted};margin:6px 0 0;font-size:13px;letter-spacing:0.5px;">${COMPANY_NAME}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:${COLORS.text};margin:0 0 20px;font-size:20px;font-weight:600;">${title}</h2>
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:20px 32px;border-top:1px solid ${COLORS.border};text-align:center;">
              <p style="color:${COLORS.muted};margin:0;font-size:12px;">
                &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
              </p>
              <p style="color:${COLORS.border};margin:8px 0 0;font-size:11px;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Reusable element helpers ───────────────────────────────────────────────

function paragraph(text: string): string {
  return `<p style="color:${COLORS.text};line-height:1.7;margin:0 0 16px;font-size:15px;">${text}</p>`
}

function mutedParagraph(text: string): string {
  return `<p style="color:${COLORS.muted};line-height:1.6;margin:0 0 16px;font-size:14px;">${text}</p>`
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 14px;color:${COLORS.muted};font-size:13px;border-bottom:1px solid ${COLORS.border};white-space:nowrap;vertical-align:top;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
    <td style="padding:10px 14px;color:${COLORS.text};font-size:14px;border-bottom:1px solid ${COLORS.border};">${value}</td>
  </tr>`
}

function detailsTable(rows: Array<[string, string | undefined | null]>): string {
  const filtered = rows.filter(([, v]) => v && v.trim())
  if (filtered.length === 0) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};border-radius:8px;margin:20px 0;border:1px solid ${COLORS.border};">
    ${filtered.map(([label, value]) => detailRow(label, value!)).join('')}
  </table>`
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background-color:${COLORS.accent};border-radius:8px;padding:14px 28px;">
        <a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.3px;">${text}</a>
      </td>
    </tr>
  </table>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${COLORS.border};margin:24px 0;" />`
}

// ─── Template functions ─────────────────────────────────────────────────────

export function getWelcomeEmailHtml(email: string): string {
  const body = [
    paragraph(`Welcome aboard! You've successfully subscribed to the ${COMPANY_NAME} newsletter.`),
    divider(),
    paragraph('Here\'s what you can expect from us:'),
    `<ul style="color:${COLORS.text};line-height:2;margin:0 0 16px;padding-left:20px;font-size:14px;">
      <li>Actionable digital strategy insights and growth tips</li>
      <li>Real-world case studies from businesses scaling smarter</li>
      <li>Industry trends and emerging technology updates</li>
      <li>Exclusive guides and resources delivered to your inbox</li>
    </ul>`,
    mutedParagraph('We typically send 1-2 emails per month — no spam, just value.'),
    divider(),
    mutedParagraph(`Subscribed as: ${email}`),
    mutedParagraph('If you did not subscribe, you can safely ignore this email.'),
  ].join('')

  return baseTemplate('Welcome to the Newsletter', body)
}

export function getAuditConfirmationHtml(data: { name: string; email: string; company?: string | null }): string {
  const body = [
    paragraph(`Hi ${data.name},`),
    paragraph(`Thank you for requesting a free growth audit from ${COMPANY_NAME}. Our team has received your submission and will review it carefully.`),
    detailsTable([
      ['Name', data.name],
      ['Email', data.email],
      ['Company', data.company],
    ]),
    divider(),
    paragraph('<strong style="color:' + COLORS.accent + ';">What happens next:</strong>'),
    `<ol style="color:${COLORS.text};line-height:2;margin:0 0 16px;padding-left:20px;font-size:14px;">
      <li>Our team reviews your submission (within 24 hours)</li>
      <li>A strategist prepares a preliminary analysis</li>
      <li>We reach out to schedule a consultation call</li>
      <li>You receive a custom growth roadmap</li>
    </ol>`,
    mutedParagraph('Expect to hear from us within 1-2 business days. Feel free to reply to this email if you have any questions in the meantime.'),
  ].join('')

  return baseTemplate('We Received Your Audit Request', body)
}

export function getAdminNotificationHtml(type: string, data: Record<string, unknown>): string {
  const titles: Record<string, string> = {
    audit: 'New Audit Request',
    contact: 'New Contact Submission',
    newsletter: 'New Newsletter Subscriber',
  }

  const rows: Array<[string, string | undefined | null]> = Object.entries(data).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
    const val = value == null ? '' : String(value)
    return [label, val]
  })

  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const body = [
    `<div style="background-color:${COLORS.accent};color:#ffffff;display:inline-block;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;">${type}</div>`,
    paragraph(`A new <strong>${type}</strong> submission has been received on the ${COMPANY_NAME} website.`),
    detailsTable(rows),
    divider(),
    mutedParagraph(`Submitted: ${timestamp}`),
  ].join('')

  return baseTemplate(titles[type] || 'New Submission', body)
}

// ─── Outgoing email helpers ─────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string): Promise<void> {
  const html = getWelcomeEmailHtml(email)
  await sendMail(email, `Welcome to the ${COMPANY_NAME} Newsletter`, html)
}

export async function sendAuditConfirmation(data: {
  name: string
  email: string
  company?: string | null
}): Promise<void> {
  const html = getAuditConfirmationHtml(data)
  await sendMail(data.email, `${COMPANY_NAME} - Your Growth Audit Request is Confirmed`, html)
}

export async function sendContactConfirmation(data: {
  name: string
  email: string
  subject?: string | null
  message: string
}): Promise<void> {
  const body = [
    paragraph(`Hi ${data.name},`),
    paragraph(`Thank you for reaching out to ${COMPANY_NAME}. We have received your message and will get back to you as soon as possible, typically within 24 hours.`),
    detailsTable([
      ['Subject', data.subject],
      ['Message', data.message],
    ]),
    divider(),
    mutedParagraph('We appreciate your interest and look forward to connecting with you.'),
  ].join('')

  const html = baseTemplate('We Received Your Message', body)
  await sendMail(data.email, `${COMPANY_NAME} - We Received Your Message`, html)
}

export async function sendAdminNotification(type: 'audit' | 'contact' | 'newsletter', data: Record<string, unknown>): Promise<void> {
  const titles: Record<string, string> = {
    audit: 'New Audit Request',
    contact: 'New Contact Submission',
    newsletter: 'New Newsletter Subscriber',
  }

  const html = getAdminNotificationHtml(type, data)
  await sendMail(ADMIN_EMAIL, `${COMPANY_NAME} Admin - ${titles[type] || 'New Submission'}`, html)
}

// ─── Lead (Consultation) Emails ─────────────────────────────────────────────

interface LeadEmailData {
  name: string
  email: string
  phone?: string | null
  country?: string | null
  service: string
  teamSize: string
  budget: string
  description?: string | null
  source?: string | null
}

export async function sendLeadAdminNotification(data: LeadEmailData): Promise<void> {
  const adminTo = process.env.ADMIN_EMAIL || ADMIN_EMAIL
  const budgetBadge = `<div style="background-color:${COLORS.accent};color:#ffffff;display:inline-block;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.3px;">💰 ${data.budget}</div>`

  const body = [
    `<div style="background-color:${COLORS.accent};color:#ffffff;display:inline-block;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;">New Consultation Lead</div>`,
    paragraph(`<strong style="color:${COLORS.text};font-size:17px;">${data.name}</strong> just requested a free consultation for <strong style="color:${COLORS.accent};">${data.service}</strong>.`),
    `<div style="margin:20px 0;">${budgetBadge}</div>`,
    detailsTable([
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Country', data.country],
      ['Service', data.service],
      ['Team Size', data.teamSize],
      ['Budget', data.budget],
      ['Source', data.source],
      ['Description', data.description],
    ]),
    divider(),
    ctaButton('Open Admin Dashboard', 'https://virtualcustomersolution.com/admin/leads'),
    mutedParagraph(`Submitted: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`),
  ].join('')

  const html = baseTemplate(`New Lead: ${data.name} — ${data.service}`, body)
  await sendMail(adminTo, `${COMPANY_NAME} — New Consultation Lead: ${data.name} (${data.service})`, html)
}

export async function sendLeadAutoReply(data: LeadEmailData): Promise<void> {
  const body = [
    paragraph(`Hi ${data.name},`),
    paragraph(`Thank you for booking a free consultation with ${COMPANY_NAME}. We've received your request and a strategist from our workforce team is already reviewing your requirements.`),
    detailsTable([
      ['Service', data.service],
      ['Team Size', data.teamSize],
      ['Budget Range', data.budget],
    ]),
    divider(),
    paragraph(`<strong style="color:${COLORS.accent};">What happens next:</strong>`),
    `<ol style="color:${COLORS.text};line-height:2;margin:0 0 16px;padding-left:20px;font-size:14px;">
      <li>We review your requirements and match you with specialists (within 24 hours)</li>
      <li>Our team reaches out to schedule a 30-minute strategy call</li>
      <li>You receive a custom cost breakdown and team proposal</li>
      <li>Start building your remote team in as little as 2 weeks</li>
    </ol>`,
    divider(),
    paragraph(`<strong style="color:${COLORS.text};">Need to reach us sooner?</strong>`),
    mutedParagraph(`Call us: <a href="tel:+923151407896" style="color:${COLORS.accent};text-decoration:none;font-weight:600;">+92 315 1407896</a>`),
    mutedParagraph(`Or reply to this email with any questions you have.`),
    divider(),
    mutedParagraph(`${COMPANY_NAME} · 114 McLeod Rd, Lahore, Pakistan`),
    mutedParagraph(`<a href="https://virtualcustomersolution.com" style="color:${COLORS.accent};text-decoration:none;">virtualcustomersolution.com</a>`),
  ].join('')

  const html = baseTemplate(`Thanks ${data.name} — your consultation is booked!`, body)
  await sendMail(data.email, `${COMPANY_NAME} — Your consultation is booked, ${data.name}!`, html)
}
