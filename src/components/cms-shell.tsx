import Link from 'next/link'
import type { ReactNode } from 'react'
import { navEntriesFor } from '@/lib/auth/permissions'
import type { Session } from 'next-auth'

const iconFor = (label: string) => {
  if (label.toLowerCase().includes('akun')) return '♙'
  if (label.toLowerCase().includes('konten') || label.toLowerCase().includes('agenda')) return '▤'
  if (label.toLowerCase().includes('keuangan')) return '▣'
  if (label.toLowerCase().includes('sakit')) return '♡'
  if (label.toLowerCase().includes('laporan')) return '▤'
  if (label.toLowerCase().includes('audit')) return '◉'
  return '⌂'
}

export function CmsShell({ session, active, title, subtitle, actions, children }: { session: Session | null; active: string; title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  const entries = navEntriesFor(session)
  const displayName = session?.user?.name || session?.user?.email || 'Pengurus RW'
  const initials = displayName.slice(0, 1).toUpperCase()
  return <div className="flex min-h-screen bg-[#F5F6FA] text-[#111322]">
    <aside className="hidden w-[252px] shrink-0 flex-col gap-7 bg-[#0B102F] px-6 py-[34px] text-white lg:flex">
      <Link href="/cms" className="flex items-center gap-[11px]"><span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#5B4BFF] text-xs font-extrabold">RW</span><span className="text-base font-bold">Portal Warga</span></Link>
      <nav aria-label="CMS" className="flex flex-col gap-2">{entries.map(entry => { const selected = entry.href === active; return <Link key={entry.href} href={entry.href} className={`flex h-[46px] items-center gap-3 rounded-xl px-[14px] text-[13px] transition ${selected ? 'bg-[#5B4BFF] font-bold text-white' : 'text-[#C3C6D4] hover:bg-[#171C43]'}`}><span className={`w-5 text-center text-lg ${selected ? 'text-white' : 'text-[#9196AD]'}`}>{iconFor(entry.label)}</span>{entry.label}</Link> })}</nav>
      <div className="flex-1" />
      <div className="flex items-center gap-[11px] border-t border-[#292E4A] pt-[18px]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6D63FF] text-xs font-bold">{initials}</span><div className="min-w-0"><p className="truncate text-xs font-bold text-white">{displayName}</p><p className="text-[10px] text-[#9196AD]">{session?.user?.role?.replace('_', ' ') || 'Pengurus RW'}</p></div></div>
    </aside>
    <div className="min-w-0 flex-1">
      <div className="border-b border-[#E7E8EF] bg-white px-5 py-4 lg:hidden"><div className="flex items-center justify-between"><Link href="/cms" className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B4BFF] text-xs font-bold text-white">RW</span><span className="font-bold">CMS Pengurus</span></Link><Link href="/dashboard" className="text-xs font-semibold text-[#5B4BFF]">Portal warga</Link></div><nav className="mt-4 flex gap-2 overflow-x-auto pb-1">{entries.map(entry => <Link key={entry.href} href={entry.href} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${entry.href === active ? 'bg-[#5B4BFF] text-white' : 'bg-[#F5F6FA] text-[#6F7385]'}`}>{entry.label}</Link>)}</nav></div>
      <main className="mx-auto max-w-[1240px] px-5 py-7 sm:px-8 lg:px-[42px] lg:py-[34px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-[28px] font-bold leading-tight text-[#111322] sm:text-[30px]">{title}</h1>{subtitle ? <p className="mt-2 text-[13px] text-[#6F7385]">{subtitle}</p> : null}</div><div className="flex flex-wrap items-center gap-2">{actions}<Link href="/dashboard" className="inline-flex h-11 items-center rounded-full border border-[#E7E8EF] bg-white px-4 text-xs font-bold text-[#111322]">Portal warga</Link></div></header>
        {children}
      </main>
    </div>
  </div>
}
