'use client';

import { useMemo, useState } from 'react';
import { Check, MessageSquareQuote, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminTestimonial = {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  amount: string | null;
  service: string | null;
  status: 'pending' | 'approved' | 'rejected';
  timeAgo: string;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  approved: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]',
  rejected: 'border-white/10 bg-white/5 text-white/40',
};

export function TestimonialsAdminPanel({
  initial,
}: {
  initial: AdminTestimonial[];
}) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((t) => t.status === filter);
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      pending: items.filter((t) => t.status === 'pending').length,
      approved: items.filter((t) => t.status === 'approved').length,
      rejected: items.filter((t) => t.status === 'rejected').length,
    }),
    [items]
  );

  const setStatus = async (id: string, status: AdminTestimonial['status']) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/backoffice/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not update status');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this feedback permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/backoffice/testimonials/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Delete failed');
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not delete');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 pb-10 sm:px-6 md:py-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Client feedback</h1>
        <p className="mt-1 text-sm text-white/50">
          Approve submissions before they appear on the homepage. Pending: {counts.pending}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition',
              filter === key
                ? 'bg-[#22C55E]/15 text-[#22C55E] ring-1 ring-[#22C55E]/30'
                : 'bg-white/[0.04] text-white/50 hover:text-white'
            )}
          >
            {key}
            {key !== 'all' && ` (${counts[key]})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/50">
          <MessageSquareQuote className="mx-auto mb-3 h-10 w-10 text-white/20" />
          No feedback in this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <article
              key={t.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-sm text-white/55">
                    {t.role}
                    {t.location ? ` · ${t.location}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-white/35">{t.timeAgo}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                    STATUS_STYLE[t.status]
                  )}
                >
                  {t.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/75">&ldquo;{t.quote}&rdquo;</p>

              {(t.amount || t.service) && (
                <p className="mt-2 text-xs text-[#22C55E]/80">
                  {[t.amount, t.service].filter(Boolean).join(' · ')}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {t.status !== 'approved' && (
                  <button
                    type="button"
                    disabled={busyId === t.id}
                    onClick={() => setStatus(t.id, 'approved')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E]/15 px-3 py-2 text-xs font-semibold text-[#22C55E] hover:bg-[#22C55E]/25 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve for homepage
                  </button>
                )}
                {t.status !== 'rejected' && (
                  <button
                    type="button"
                    disabled={busyId === t.id}
                    onClick={() => setStatus(t.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/[0.04] disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === t.id}
                  onClick={() => remove(t.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400/90 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
