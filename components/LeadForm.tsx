'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  COUNTRY_OPTIONS,
  SERVICE_OPTIONS,
  SOURCE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  leadSchema,
  type LeadInput,
} from '@/lib/validations/lead'
import { officeLocations } from '@/lib/content'

const STORAGE_KEY = 'vcs.leadForm.draft'

const STEPS = [
  { id: 1, label: 'About You', icon: User },
  { id: 2, label: 'Your Needs', icon: Sparkles },
  { id: 3, label: 'Details', icon: MessageSquare },
] as const

// ─── Confetti (tiny, no dependency) ─────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 42 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 1.5 + Math.random() * 1
        const rotate = Math.random() * 360
        const size = 6 + Math.random() * 8
        const hue = Math.random() > 0.5 ? '#22C55E' : '#4ADE80'
        return (
          <motion.span
            key={i}
            initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
            animate={{
              y: 400,
              x: (Math.random() - 0.5) * 200,
              rotate: rotate,
              opacity: 0,
            }}
            transition={{ duration, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: hue,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, idx) => {
          const isActive = current === step.id
          const isDone = current > step.id
          const Icon = step.icon
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isDone
                      ? '#22C55E'
                      : isActive
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(255, 255, 255, 0.04)',
                    borderColor: isDone || isActive
                      ? '#22C55E'
                      : 'rgba(255, 255, 255, 0.08)',
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                >
                  {isDone ? (
                    <Check className="h-5 w-5 text-black" strokeWidth={3} />
                  ) : (
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isActive ? 'text-[#22C55E]' : 'text-white/40'
                      )}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'hidden text-xs font-medium tracking-wide sm:block',
                    isActive || isDone
                      ? 'text-white'
                      : 'text-white/40'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="mx-2 flex-1 sm:mx-4">
                  <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={false}
                      animate={{ width: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#22C55E] to-[#4ADE80]"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Reusable inputs ────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-white/90">
      {children}
      {required && <span className="ml-1 text-[#22C55E]">*</span>}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-xs font-medium text-red-400">{message}</p>
  )
}

function RadioCards({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const isSelected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'group relative flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3.5 text-left transition-all duration-200 sm:px-4',
              isSelected
                ? 'border-[#22C55E] bg-[#22C55E]/10 shadow-[0_0_20px_rgba(34,197,94,0.25)]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                isSelected
                  ? 'border-[#22C55E] bg-[#22C55E]'
                  : 'border-white/25 group-hover:border-white/40'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-2 w-2 rounded-full bg-black"
                />
              )}
            </div>
            <span
              className={cn(
                'min-w-0 flex-1 text-sm font-medium leading-snug transition-colors',
                isSelected ? 'text-white' : 'text-white/70'
              )}
            >
              {opt}
            </span>
            {/* hidden native input for accessibility */}
            <input
              type="radio"
              name={name}
              value={opt}
              checked={isSelected}
              onChange={() => onChange(opt)}
              className="sr-only"
              tabIndex={-1}
            />
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function LeadForm() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      service: '',
      teamSize: '',
      companyWebsite: '',
      description: '',
      source: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = form

  const watchedValues = watch()

  // ── sessionStorage persistence ────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LeadInput> & { step?: number }
        const { step: savedStep, ...values } = parsed
        Object.entries(values).forEach(([k, v]) => {
          if (typeof v === 'string') {
            setValue(k as keyof LeadInput, v, { shouldValidate: false })
          }
        })
        if (savedStep && savedStep >= 1 && savedStep <= 3) {
          setStep(savedStep)
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isSuccess) return
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...watchedValues, step })
      )
    } catch {
      // ignore
    }
  }, [watchedValues, step, isSuccess])

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = async () => {
    const fieldsByStep: Record<number, (keyof LeadInput)[]> = {
      1: ['name', 'email', 'companyWebsite'],
      2: ['service', 'teamSize'],
      3: [],
    }

    const ok = await trigger(fieldsByStep[step])
    if (!ok) return

    setDirection('forward')
    setStep((s) => Math.min(3, s + 1))
  }

  const goBack = () => {
    setDirection('backward')
    setStep((s) => Math.max(1, s - 1))
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: LeadInput) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Something went wrong')
      }

      setIsSuccess(true)
      reset()
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to submit. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault()
      if (step < 3) {
        goNext()
      } else {
        handleSubmit(onSubmit)()
      }
    }
  }

  // ── SSR placeholder — avoid Framer Motion hydration mismatch ──────────────
  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C0C0C]/90 p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#22C55E]/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#059669]/[0.06] blur-3xl" />
        <div className="relative z-10 min-h-[500px] animate-pulse">
          <div className="mb-10 flex items-center justify-between gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-1 items-center"
              >
                <div className="h-11 w-11 rounded-full border-2 border-white/10 bg-white/[0.04]" />
                {i < 3 && (
                  <div className="mx-4 h-0.5 flex-1 rounded-full bg-white/10" />
                )}
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="h-8 w-56 rounded bg-white/[0.06]" />
            <div className="mt-3 h-4 w-72 rounded bg-white/[0.04]" />
          </div>
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[#22C55E]/30 bg-gradient-to-b from-[#0F1A12] to-[#0A0A0A] p-10 text-center shadow-[0_0_80px_rgba(34,197,94,0.15)] sm:p-14">
        <Confetti />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#22C55E] bg-[#22C55E]/10 shadow-[0_0_40px_rgba(34,197,94,0.5)]"
        >
          <Check className="h-10 w-10 text-[#22C55E]" strokeWidth={3} />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 font-display text-3xl font-bold text-white sm:text-4xl"
        >
          Consultation Booked!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 mx-auto mt-3 max-w-md text-white/70"
        >
          We&apos;ll review your requirements and reach out within{' '}
          <span className="font-semibold text-[#22C55E]">24 hours</span>. Keep
          an eye on your inbox.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={`tel:${officeLocations.usa.phoneTel}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-6 py-3 text-sm font-semibold text-[#22C55E] transition-all hover:bg-[#22C55E]/20"
          >
            <Phone className="h-4 w-4" />
            Call us
          </a>
          <a
            href="/services#offerings"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/[0.06]"
          >
            Explore our services
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C0C0C]/90 p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8 md:p-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#22C55E]/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#059669]/[0.06] blur-3xl" />

      <div className="relative z-10">
        <ProgressBar current={step} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <div key={`step-${step}`} className="animate-step-in">
            {/* ─── STEP 1 ─── */}
            {step === 1 && (
              <div>
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    Tell us about yourself
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    We&apos;ll use this to match you with the right specialist.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder="John Smith"
                        autoComplete="name"
                        {...register('name')}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                      />
                    </div>
                    <FieldError message={errors.name?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        {...register('email')}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                      />
                    </div>
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Phone</FieldLabel>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="tel"
                          placeholder="+1 555 000 0000"
                          autoComplete="tel"
                          {...register('phone')}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                        />
                      </div>
                      <FieldError message={errors.phone?.message} />
                    </div>

                    <div>
                      <FieldLabel>Country</FieldLabel>
                      <select
                        {...register('country')}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                      >
                        <option value="">Select country</option>
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c} value={c} className="bg-[#0C0C0C]">
                            {c}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.country?.message} />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Company website</FieldLabel>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      autoComplete="url"
                      {...register('companyWebsite')}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                    />
                    <FieldError message={errors.companyWebsite?.message} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 2 ─── */}
            {step === 2 && (
              <div>
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    What do you need?
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    Help us understand the shape of your project.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <FieldLabel required>Interested Services</FieldLabel>
                    <RadioCards
                      name="service"
                      options={SERVICE_OPTIONS}
                      value={watchedValues.service || ''}
                      onChange={(v) =>
                        setValue('service', v, { shouldValidate: true })
                      }
                    />
                    <FieldError message={errors.service?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Team Size Needed</FieldLabel>
                    <RadioCards
                      name="teamSize"
                      options={TEAM_SIZE_OPTIONS}
                      value={watchedValues.teamSize || ''}
                      onChange={(v) =>
                        setValue('teamSize', v, { shouldValidate: true })
                      }
                    />
                    <FieldError message={errors.teamSize?.message} />
                  </div>

                </div>
              </div>
            )}

            {/* ─── STEP 3 ─── */}
            {step === 3 && (
              <div>
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    Tell us more
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    The more context you share, the better we can prepare.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <FieldLabel>Project Description</FieldLabel>
                    <textarea
                      rows={5}
                      placeholder="What are you trying to build or improve? Any specific skills, timelines, or goals?"
                      maxLength={1000}
                      {...register('description')}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                    />
                    <div className="mt-1 flex justify-between text-xs text-white/40">
                      <FieldError message={errors.description?.message} />
                      <span>
                        {(watchedValues.description || '').length}/1000
                      </span>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>How did you hear about us?</FieldLabel>
                    <select
                      {...register('source')}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                    >
                      <option value="">Select one</option>
                      {SOURCE_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#0C0C0C]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.source?.message} />
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                      {submitError}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ─── Navigation buttons ─── */}
          <div className="mt-10 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#059669] px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all hover:shadow-[0_0_45px_rgba(34,197,94,0.5)]"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#059669] px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all hover:shadow-[0_0_45px_rgba(34,197,94,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Free Consultation
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
