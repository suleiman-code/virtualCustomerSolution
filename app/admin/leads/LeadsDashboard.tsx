'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  Crown,
  Download,
  Filter,
  Mail,
  Phone,
  Search,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LEAD_STATUSES,
  SERVICE_OPTIONS,
  type LeadStatus,
} from '@/lib/validations/lead'

interface SerializedLead {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  service: string
  teamSize: string
  budget: string
  description: string | null
  source: string | null
  status: string
  createdAt: string
}

const PAGE_SIZE = 20

const HIGH_BUDGETS = new Set(['$15K+/mo'])

const STATUS_STYLES: Record<string, string> = {
  New: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  Contacted: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Converted: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]',
  'Not Interested': 'border-white/10 bg-white/5 text-white/40',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function toCsv(leads: SerializedLead[]): string {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Country',
    'Service',
    'Team Size',
    'Budget',
    'Source',
    'Status',
    'Description',
    'Created At',
  ]
  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.email,
    l.phone || '',
    l.country || '',
    l.service,
    l.teamSize,
    l.budget,
    l.source || '',
    l.status,
    (l.description || '').replace(/\n/g, ' '),
    l.createdAt,
  ])
  return [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? '')
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`
          }
          return s
        })
        .join(',')
    )
    .join('\n')
}

export default function LeadsDashboard({
  initialLeads,
  adminUser,
}: {
  initialLeads: SerializedLead[]
  adminUser: string
}) {
  const [leads, setLeads] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Filter + search ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (serviceFilter !== 'all' && l.service !== serviceFilter) return false
      if (!q) return true
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.phone?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [leads, search, statusFilter, serviceFilter])

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const counts = { New: 0, Contacted: 0, Converted: 0, 'Not Interested': 0 }
    leads.forEach((l) => {
      if (l.status in counts) counts[l.status as keyof typeof counts]++
    })
    return counts
  }, [leads])

  // ── Actions ───────────────────────────────────────────────────────────────
  const setLeadBusy = (id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const updateStatus = async (id: string, status: LeadStatus) => {
    setLeadBusy(id, true)
    const prev = leads
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Update failed')
    } catch {
      setLeads(prev)
      alert('Failed to update status. Please try again.')
    } finally {
      setLeadBusy(id, false)
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Permanently delete this lead?')) return
    setLeadBusy(id, true)
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setLeads((ls) => ls.filter((l) => l.id !== id))
    } catch {
      alert('Failed to delete lead.')
    } finally {
      setLeadBusy(id, false)
    }
  }

  const exportCsv = () => {
    const csv = toCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vcs-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#050505] text-white">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-xl font-bold md:text-2xl">Leads dashboard</h1>
          <p className="mt-1 text-xs text-white/45 md:hidden">
            Signed in as <span className="text-white/70">{adminUser}</span>
          </p>
        </div>
        {/* ── Stats ────────────────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard
            label="Total Leads"
            value={leads.length}
            icon={<Users className="h-4 w-4" />}
            tone="default"
          />
          <StatCard
            label="New"
            value={stats.New}
            tone="blue"
          />
          <StatCard
            label="Contacted"
            value={stats.Contacted}
            tone="amber"
          />
          <StatCard
            label="Converted"
            value={stats.Converted}
            tone="green"
          />
        </section>

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/30" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                >
                  <option value="all" className="bg-[#0C0C0C]">
                    All statuses
                  </option>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0C0C0C]">
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value)
                    setPage(1)
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                >
                  <option value="all" className="bg-[#0C0C0C]">
                    All services
                  </option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#0C0C0C]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={exportCsv}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2.5 text-sm font-semibold text-[#22C55E] transition-colors hover:bg-[#22C55E]/15"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </section>

        {/* ── Results count ────────────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between text-xs text-white/40">
          <span>
            Showing{' '}
            <span className="font-semibold text-white/80">
              {paged.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-white/80">
              {filtered.length}
            </span>{' '}
            leads
          </span>
          {totalPages > 1 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Budget</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paged.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-16 text-center text-sm text-white/40"
                    >
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  paged.map((lead) => {
                    const isHigh = HIGH_BUDGETS.has(lead.budget)
                    const isExpanded = expandedId === lead.id
                    const busy = busyIds.has(lead.id)
                    return (
                      <Fragment key={lead.id}>
                        <tr
                          className={cn(
                            'group transition-colors hover:bg-white/[0.02]',
                            isHigh &&
                              'bg-gradient-to-r from-amber-500/[0.04] to-transparent'
                          )}
                        >
                          <td className="px-4 py-4">
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : lead.id)
                              }
                              className="flex items-center gap-2 text-left"
                            >
                              {isHigh && (
                                <Crown className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                              )}
                              <span className="font-semibold text-white">
                                {lead.name}
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-0.5">
                              <a
                                href={`mailto:${lead.email}`}
                                className="inline-flex items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-[#22C55E]"
                              >
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-[#22C55E]"
                                >
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs text-white/70">
                              {lead.service}
                            </span>
                            <div className="text-[10px] uppercase tracking-wider text-white/30">
                              {lead.teamSize}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                                isHigh
                                  ? 'border border-amber-400/40 bg-amber-400/10 text-amber-300'
                                  : 'text-white/70'
                              )}
                            >
                              {lead.budget}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-white/50">
                            {lead.country || '—'}
                          </td>
                          <td className="px-4 py-4 text-xs text-white/50">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={lead.status}
                              disabled={busy}
                              onChange={(e) =>
                                updateStatus(
                                  lead.id,
                                  e.target.value as LeadStatus
                                )
                              }
                              className={cn(
                                'rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 disabled:opacity-50',
                                STATUS_STYLES[lead.status] ||
                                  'border-white/10 bg-white/5 text-white/60'
                              )}
                            >
                              {LEAD_STATUSES.map((s) => (
                                <option
                                  key={s}
                                  value={s}
                                  className="bg-[#0C0C0C]"
                                >
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              disabled={busy}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-white/40 opacity-0 transition-all group-hover:opacity-100 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                              title="Delete lead"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-white/[0.02]">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="grid gap-4 text-xs sm:grid-cols-2">
                                <div>
                                  <div className="mb-1 font-semibold uppercase tracking-wider text-white/40">
                                    Source
                                  </div>
                                  <div className="text-white/70">
                                    {lead.source || '—'}
                                  </div>
                                </div>
                                <div>
                                  <div className="mb-1 font-semibold uppercase tracking-wider text-white/40">
                                    Lead ID
                                  </div>
                                  <div className="font-mono text-white/50">
                                    {lead.id}
                                  </div>
                                </div>
                                <div className="sm:col-span-2">
                                  <div className="mb-1 font-semibold uppercase tracking-wider text-white/40">
                                    Project description
                                  </div>
                                  <div className="whitespace-pre-wrap text-white/70">
                                    {lead.description || (
                                      <span className="text-white/30">
                                        No description provided
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-semibold">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Stat card ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string
  value: number
  icon?: React.ReactNode
  tone?: 'default' | 'blue' | 'amber' | 'green'
}) {
  const accent =
    tone === 'blue'
      ? 'text-blue-400'
      : tone === 'amber'
        ? 'text-amber-400'
        : tone === 'green'
          ? 'text-[#22C55E]'
          : 'text-white'

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
          {label}
        </span>
        {icon && <span className="text-white/30">{icon}</span>}
      </div>
      <div className={cn('mt-2 font-display text-3xl font-bold', accent)}>
        {value}
      </div>
    </div>
  )
}
