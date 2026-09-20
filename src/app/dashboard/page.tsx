import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/')
  if (session.user.status !== 'AKTIF') return <PendingVerification />
  if (session.user.accountType === 'PENGURUS') redirect('/cms/content')

  const [contents, agendas, financeReports, citizenReports, sicknessReports] = await Promise.all([
    prisma.content.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.agenda.findMany({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' }, take: 3 }),
    prisma.financeReport.findMany({ where: { status: 'DIPUBLIKASIKAN' }, orderBy: { periodStart: 'desc' }, take: 3 }),
    prisma.citizenReport.count({ where: { reporterId: session.user.id } }),
    prisma.sicknessReport.count({ where: { reporterId: session.user.id } }),
  ])
  const userName = session.user.name?.split(' ')[0] || 'Warga'
  const nextAgenda = agendas[0]

  return <main className="min-h-screen bg-[#F5F6FA] text-[#111322]">
    <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-[#E7E8EF] bg-white px-5 sm:px-10 lg:px-14">
      <Link href="/dashboard" className="flex items-center gap-3"><span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#5B4BFF] text-xs font-extrabold text-white">RW</span><span className="text-[17px] font-bold">Portal Warga</span></Link>
      <nav className="order-3 flex w-full items-center gap-5 overflow-x-auto whitespace-nowrap text-[12px] font-medium text-[#6F7385] lg:order-none lg:w-auto lg:gap-7 lg:text-[13px]"><Link className="font-bold text-[#5B4BFF]" href="/dashboard">Beranda</Link><Link href="/informasi">Informasi</Link><Link href="/finance/reports">Keuangan</Link><Link href="/reports">Laporan Saya</Link><Link href="/reports/sick">Laporan Sakit</Link></nav>
      <div className="flex items-center gap-3"><span className="hidden text-right sm:block"><strong className="block text-[13px]">{session.user.name ?? 'Warga'}</strong><small className="text-[11px] text-[#6F7385]">Warga RW 08</small></span><span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D9D5FF] text-sm font-bold text-[#3728D6]">{userName[0]}</span></div>
    </header>
    <div className="mx-auto flex max-w-[1328px] flex-col gap-6 px-5 py-7 sm:px-10 lg:px-14">
      <section className="flex min-h-[218px] items-center justify-between overflow-hidden rounded-[22px] bg-gradient-to-r from-[#3225C9] to-[#5B4BFF] px-7 py-8 text-white sm:px-10">
        <div><p className="text-[11px] font-bold tracking-[1.6px] text-[#D8D4FF]">SELAMAT DATANG KEMBALI</p><h1 className="mt-3 text-3xl font-bold sm:text-[34px]">Halo, {userName}! Apa kabar hari ini?</h1><p className="mt-3 max-w-[610px] text-sm leading-6 text-[#E5E2FF]">Ikuti kabar terbaru lingkungan, pantau laporan, dan terhubung lebih dekat dengan pengurus RW 08.</p><Link href="/reports" className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-[18px] text-[13px] font-bold text-[#3728D6]">＋&nbsp; Buat laporan</Link></div><div className="hidden text-[100px] opacity-20 lg:block">⌂</div>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Metric label="Laporan saya" value={citizenReports} color="text-[#5B4BFF]" /><Metric label="Laporan sakit" value={sicknessReports} color="text-[#E25555]" /><Metric label="Agenda mendatang" value={agendas.length} color="text-[#F4A340]" /><Metric label="Laporan keuangan" value={financeReports.length} color="text-[#16A36A]" /></section>
      <section id="informasi" className="grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="rounded-[18px] bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Informasi terbaru</h2><Link href="/informasi" className="text-xs font-bold text-[#5B4BFF]">Lihat semua →</Link></div><div className="mt-3 divide-y divide-[#E7E8EF]">{contents.length === 0 && <p className="py-8 text-sm text-[#6F7385]">Belum ada informasi yang dipublikasikan.</p>}{contents.map(content => <article key={content.id} className="flex gap-4 py-4"><div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl bg-[#EFEDFF] text-2xl">▤</div><div><p className="text-[10px] font-bold tracking-[1px] text-[#5B4BFF]">{content.type}</p><h3 className="mt-1 text-sm font-bold text-[#111322]">{content.title}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#6F7385]">{content.body}</p></div></article>)}</div></div>
        <div className="space-y-[18px]">{nextAgenda ? <div className="rounded-[18px] bg-[#0B102F] p-[22px] text-white"><p className="text-[10px] font-bold tracking-[1.3px] text-[#AAA5FF]">AGENDA BERIKUTNYA</p><p className="mt-2 text-4xl font-bold">{new Date(nextAgenda.startsAt).getDate()}</p><p className="text-xs text-[#C7C9D6]">{new Date(nextAgenda.startsAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} · {new Date(nextAgenda.startsAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p><h3 className="mt-5 text-base font-bold">{nextAgenda.title}</h3></div> : <div className="rounded-[18px] bg-[#0B102F] p-[22px] text-white"><p className="text-[10px] font-bold tracking-[1.3px] text-[#AAA5FF]">AGENDA BERIKUTNYA</p><p className="mt-4 text-sm text-[#C7C9D6]">Belum ada agenda mendatang.</p></div>}<div className="rounded-[18px] bg-white p-[22px]"><h2 className="text-base font-bold">Akses cepat</h2><div className="mt-3 space-y-1"><Quick href="/finance/reports" icon="▣" label="Lihat laporan keuangan" /><Quick href="/reports" icon="▤" label="Pantau laporan saya" /><Quick href="/reports/sick" icon="♡" label="Laporkan warga sakit" /></div></div></div>
      </section>
    </div>
  </main>
}

function PendingVerification() { return <main className="flex min-h-screen items-center justify-center bg-[#F5F6FA] px-5"><section className="w-full max-w-md rounded-[22px] bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFEDFF] text-2xl text-[#5B4BFF]">✓</span><h1 className="mt-5 text-2xl font-bold text-[#111322]">Akun menunggu verifikasi</h1><p className="mt-3 text-sm leading-6 text-[#6F7385]">Akun berhasil dibuat. Pengurus RW perlu memverifikasi akun sebelum dashboard dapat digunakan.</p></section></main> }
function Metric({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-2xl border border-[#E7E8EF] bg-white p-5"><p className="text-xs font-semibold text-[#6F7385]">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p></div> }
function Quick({ href, icon, label }: { href: string; icon: string; label: string }) { return <Link href={href} className="flex items-center gap-3 rounded-xl px-2 py-3 text-xs font-semibold text-[#111322] hover:bg-[#F5F6FA]"><span className="text-lg text-[#5B4BFF]">{icon}</span>{label}</Link> }
