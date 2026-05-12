import { db } from '@/lib/db'

/** Matches dashboard filters / legacy consultation form defaults when a field doesn’t apply. */
const FALLBACK_TEAM = 'Not Sure Yet'
const FALLBACK_BUDGET = "Let's Discuss"

/**
 * Mirrors inbound form submissions into the `leads` collection so Admin → Leads stays complete.
 * Failures are logged only — the primary route handler already persisted the submission.
 */
export async function mirrorSubmissionToLeads(payload: {
  kind: string
  name: string
  email: string
  phone?: string | null
  country?: string | null
  service: string
  description: string | null
  source: string
  teamSize?: string
  budget?: string
}): Promise<void> {
  try {
    await db.lead.create({
      data: {
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || null,
        country: payload.country?.trim() || null,
        service: payload.service.trim(),
        teamSize: payload.teamSize ?? FALLBACK_TEAM,
        budget: payload.budget ?? FALLBACK_BUDGET,
        description: payload.description?.trim() || null,
        source: payload.source.trim(),
        status: 'New',
      },
    })
  } catch (err) {
    console.error(`[mirrorSubmissionToLeads:${payload.kind}]`, err)
  }
}
