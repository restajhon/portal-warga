import Link from 'next/link'
import type { ReactNode } from 'react'
import { navEntriesFor } from '@/lib/auth/permissions'
import type { Session } from 'next-auth'

export function CmsShell({
  session,
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  session: Session | null
  active: string
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const entries = navEntriesFor(session)
  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">CMS Pengurus</p>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Dashboard
            </Link>
          </div>
        </div>
        <nav aria-label="CMS" className="mx-auto max-w-6xl overflow-x-auto px-5">
          <ul className="flex min-w-max gap-1 pb-3">
            {entries.map((entry) => {
              const isActive = entry.href === active
              return (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive ? 'bg-[#5b4bff] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {entry.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  )
}
