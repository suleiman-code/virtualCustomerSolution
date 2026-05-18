'use client';

import { useCallback, useEffect, useState } from 'react';
import { Quote, Loader2, Send, MessageSquarePlus } from 'lucide-react';
import { RevealOnScroll } from '@/components/animations/ScrollAnimations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

export type PublicTestimonial = {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  amount: string | null;
  service: string | null;
  timeAgo: string;
};

const PAGE_SIZE = 3;

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20';

function TestimonialCard({ t }: { t: PublicTestimonial }) {
  return (
    <article className="card-accent flex h-full flex-col p-6 md:p-8">
      <Quote className="mb-4 h-8 w-8 shrink-0 text-[#22C55E]/60" />
      <p className="flex-1 text-base leading-relaxed text-[var(--text-primary)] md:text-lg">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22C55E] to-[#059669] text-lg font-bold text-white">
          {t.author[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--text-primary)]">{t.author}</p>
          <p className="truncate text-sm text-[var(--text-muted)]">{t.role}</p>
          {(t.location || t.timeAgo) && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]/80">
              {[t.location, t.timeAgo].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function ShareExperienceModal({
  open,
  onOpenChange,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: (item: PublicTestimonial) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setRole('');
    setCountry('');
    setFeedback('');
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, country, feedback }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.errors?.[0] || 'Submission failed');
      }

      if (json.testimonial) {
        onSubmitted(json.testimonial as PublicTestimonial);
      }

      reset();
      onOpenChange(false);
      toast({
        title: 'Feedback submitted',
        description:
          json.message ||
          'Thank you! Your feedback was received and is now visible on this page.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit feedback');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-white/10 bg-[#121212] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[#F5F5F5]">
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-[#A1A1AA]">
            Tell us about working with Virtual Customer Solution.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
              disabled={busy}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Role</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. E-Commerce Founder"
              className={inputClass}
              disabled={busy}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Pakistan, USA, UK"
              className={inputClass}
              disabled={busy}
              autoComplete="country-name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Feedback</label>
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your feedback"
              className={`${inputClass} resize-none`}
              disabled={busy}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#22C55E] px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#4ADE80] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HomepageTestimonials() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/testimonials', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.testimonials)) {
        setTestimonials(json.testimonials);
        setVisibleCount(PAGE_SIZE);
      } else {
        setTestimonials([]);
        setLoadError('Could not load feedback right now.');
      }
    } catch {
      setTestimonials([]);
      setLoadError('Could not load feedback right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  const handleSubmitted = (item: PublicTestimonial) => {
    setTestimonials((prev) => {
      if (prev.some((t) => t.id === item.id)) return prev;
      return [item, ...prev];
    });
    setVisibleCount((c) => Math.max(c, PAGE_SIZE));
  };

  return (
    <section
      id="testimonials"
      className="section-padding relative scroll-mt-[calc(var(--site-header-height)+1rem)] overflow-hidden"
    >
      <div className="absolute inset-0 radial-glow opacity-30" />

      <div className="container-wide relative z-10">
        <RevealOnScroll variant="fade-up" duration={0.8}>
          <div className="mb-10 text-center">
            <span className="badge mb-4 inline-block">What They Say</span>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Hear It From{' '}
              <span className="text-gradient-lime">Our Clients</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-8 py-3 text-sm font-semibold text-[#22C55E] transition hover:border-[#22C55E] hover:bg-[#22C55E]/20"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Share Your Experience
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
          </div>
        ) : loadError && testimonials.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-muted)]">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 text-sm text-[#22C55E] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-muted)]">
            <Quote className="mx-auto mb-4 h-10 w-10 text-[#22C55E]/40" />
            <p>No client feedback yet.</p>
            <p className="mt-2 text-sm">Be the first to share your experience.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {visible.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-10 py-3 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#22C55E]/40 hover:bg-[#22C55E]/10"
                >
                  Next More
                </button>
              </div>
            )}
          </>
        )}

        <ShareExperienceModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmitted={handleSubmitted}
        />
      </div>
    </section>
  );
}
