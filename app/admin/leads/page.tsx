import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { AdminShell } from '@/components/admin/AdminShell'
import LeadsDashboard from './LeadsDashboard'

export const metadata = {
  title: { absolute: 'Leads Dashboard · VCS Admin' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login?next=/admin/leads')
  }

  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serialized = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    country: l.country,
    service: l.service,
    teamSize: l.teamSize,
    companyWebsite: l.companyWebsite ?? (l as { budget?: string }).budget ?? null,
    description: l.description,
    source: l.source,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }))

  return (
    <AdminShell adminUser={admin.user}>
      <LeadsDashboard initialLeads={serialized} adminUser={admin.user} />
    </AdminShell>
  )
}
