'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  PanelLeftClose,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function isAdminNavActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  adminUser,
  children,
}: {
  adminUser: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/backoffice/logout', { method: 'POST', credentials: 'same-origin' });
    router.push('/admin/login');
    router.refresh();
  };

  const nav = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Leads', href: '/admin/leads', icon: Users },
    { label: 'Feedback', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Services', href: '/admin/services', icon: Layers },
    { label: 'Blog posts', href: '/admin/blogs', icon: FileText },
  ] as const;

  const linkClass = (href: string) =>
    cn(
      'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
      isAdminNavActive(pathname, href)
        ? 'bg-[#22C55E]/15 text-[#F5F5F5] ring-1 ring-[#22C55E]/25'
        : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
    );

  return (
    <div className="flex h-dvh min-h-screen overflow-hidden bg-[#050505] text-white">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-[#080808] md:flex lg:w-60">
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <Link href="/admin" className="font-display text-sm font-bold tracking-tight text-white">
            VCS <span className="text-[#22C55E]">Admin</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate px-1 text-xs text-white/35">Signed in</p>
          <p className="truncate px-1 text-sm font-medium text-white/70">{adminUser}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#050505]/95 px-4 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/[0.06]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-bold">VCS Admin</span>
          <span className="w-9" aria-hidden />
        </header>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(280px,85vw)] flex-col border-r border-white/10 bg-[#080808] shadow-2xl">
              <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <PanelLeftClose className="h-4 w-4 text-[#22C55E]" />
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-white/50 hover:bg-white/[0.06]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3">
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass(item.href)}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto border-t border-white/10 p-3">
                <p className="text-xs text-white/35">{adminUser}</p>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
