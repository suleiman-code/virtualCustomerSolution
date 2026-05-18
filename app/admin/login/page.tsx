'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'

const inputClass =
  'w-full min-h-[44px] rounded-xl border border-white/12 bg-[#141414] py-3 text-sm text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/40 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/25'

const iconClass =
  'pointer-events-none absolute left-3 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-white/45'

function LoginInner() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get('next') || '/admin'

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/backoffice/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ user, pass }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Login failed')
      }
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white md:left-8 md:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to site
      </Link>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#22C55E]/[0.05] blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <ShieldCheck className="h-7 w-7 text-[#22C55E]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Admin panel
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Sign in to view and manage leads
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0C0C0C]/90 p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Username
              </label>
              <div className="relative">
                <UserIcon className={iconClass} aria-hidden />
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  autoComplete="username"
                  required
                  className={`${inputClass} pl-10 pr-4`}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className={iconClass} aria-hidden />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pl-10 pr-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <EyeOff className="h-[18px] w-[18px]" aria-hidden />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#059669] py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all hover:shadow-[0_0_45px_rgba(34,197,94,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Protected admin area
        </p>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#22C55E]" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  )
}
