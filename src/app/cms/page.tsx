import Link from 'next/link'
import { auth } from '@/auth'
import { CmsShell } from '@/components/cms-shell'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'

type DashboardItem = { id: string; title: string; type: string; status: string; createdAt: Date }
const icon = (type: string) => ({ BERITA: '▤', PENGUMUMAN: '⚑', AGENDA: '▦', DOKUMENTASI: '▧', PERKEMBANGAN: '♧' }[type] || '▤')
const label = (type: string) => ({ BERITA: 'Berita', PENGUMUMAN: 'Pengumuman', AGENDA: 'Agenda', DOKUMENTASI: 'Dokumentasi', PERKEMBANGAN: 'Perkembangan' }[type] || type)

export default async function CmsDashboardPage() {
  const session = await auth()
  requirePermission(session, 'content:manage')
  const [contents, agendas, documentation, programs] = await Promise.all([
    prisma.content.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    prisma.agenda.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    prisma.documentation.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    prisma.programUpdate.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
  ])
  const items: DashboardItem[] = [
    ...contents.map(item => ({ id: item.id, title: item.title, type: item.type, status: item.status, createdAt: item.createdAt })),
    ...agendas.map(item => ({ id: item.id, title: item.title, type: 'AGENDA', status: item.status, createdAt: item.createdAt })),
    ...documentation.map(item => ({ id: item.id, title: item.title, type: 'DOKUMENTASI', status: item.status, createdAt: item.createdAt })),
    ...programs.map(item => ({ id: item.id, title: item.title, type: 'PERKEMBANGAN', status: item.status, createdAt: item.createdAt })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8)
  const published = items.filter(item => item.status === 'PUBLISHED').length
  const drafts = items.filter(item => item.status === 'DRAFT').length
  const scheduled = items.filter(item => item.status === 'SCHEDULED').length
  return <CmsShell session={session} active="/cms" title="Dashboard" subtitle="Ringkasan aktivitas dan konten Portal Warga." actions={<Link href="/cms/content" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5B4BFF] px-5 text-xs font-bold text-white">＋ Buat konten</Link>}>
    <div className="mb-5 flex flex-wrap gap-2">{['Semua', 'Berita', 'Pengumuman', 'Agenda', 'Dokumentasi', 'Perkembangan'].map((item, index) => <span key={item} className={`rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? 'bg-[#5B4BFF] text-white' : 'bg-white text-[#6F7385]'}`}>{item}</span>)}</div>
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]"><section className="space-y-3">{items.length === 0 ? <div className="rounded-3xl bg-white p-8 text-sm text-[#6F7385]">Belum ada konten yang dibuat.</div> : items.map(item => <article key={`${item.type}-${item.id}`} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EFEDFF] text-2xl text-[#5B4BFF]">{icon(item.type)}</div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[1px] text-[#8D91A1]">{label(item.type)} · {item.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p><h2 className="mt-1 truncate text-sm font-bold">{item.title}</h2><p className="mt-1 text-xs text-[#8D91A1]">Oleh Admin RW</p></div><span className={`rounded-full px-3 py-2 text-[10px] font-bold ${item.status === 'PUBLISHED' ? 'bg-[#E8F8F0] text-[#16875A]' : item.status === 'SCHEDULED' ? 'bg-[#EFEDFF] text-[#5B4BFF]' : 'bg-[#FFF2D9] text-[#B77A00]'}`}>{item.status === 'PUBLISHED' ? 'Terbit' : item.status === 'SCHEDULED' ? 'Terjadwal' : 'Draft'}</span><span className="text-xl text-[#8D91A1]">⋮</span></article>)}</section><aside className="h-fit rounded-3xl bg-[#0B102F] p-6 text-white"><h2 className="font-bold">Ringkasan bulan ini</h2><div className="mt-5 space-y-4 text-xs"><p className="flex justify-between text-[#C3C6D4]">Konten terbit <strong className="text-white">{published}</strong></p><p className="flex justify-between text-[#C3C6D4]">Terjadwal <strong className="text-white">{scheduled}</strong></p><p className="flex justify-between text-[#C3C6D4]">Draft <strong className="text-white">{drafts}</strong></p></div></aside></div>
  </CmsShell>
}
