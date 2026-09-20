import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/')
  if (session.user.status !== 'AKTIF') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 py-10">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Akun menunggu verifikasi</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Akun berhasil dibuat. Pengurus RW perlu memverifikasi akun sebelum dashboard dapat digunakan.</p>
        </section>
      </main>
    )
  }

  const isPengurus = session.user.accountType === 'PENGURUS'
  const role = session.user.role

  const [contents, agendas, financeReports, citizenReports, sicknessReports] = await Promise.all([
    prisma.content.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.agenda.findMany({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' }, take: 3 }),
    prisma.financeReport.findMany({ where: { status: 'DIPUBLIKASIKAN' }, orderBy: { periodStart: 'desc' }, take: 3 }),
    prisma.citizenReport.count({ where: isPengurus ? { status: { in: ['TERKIRIM', 'DITINJAU'] } } : { reporterId: session.user.id } }),
    prisma.sicknessReport.count({ where: isPengurus ? { status: { in: ['TERKIRIM', 'DITINJAU'] } } : { reporterId: session.user.id } }),
  ])

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{isPengurus ? 'CMS Pengurus RW' : 'Dashboard Warga'}</h1>
        <p className="mt-3 text-slate-600">Selamat datang, {session.user.name ?? session.user.email}.</p>
        <div className="mt-8 rounded-2xl bg-[#f7f7fb] p-5 text-sm text-slate-600">
          <p>Account type: <strong>{session.user.accountType ?? 'UNKNOWN'}</strong></p>
          {role && <p className="mt-1">Role: <strong>{role}</strong></p>}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {!isPengurus ? (
            <>
              <DashCard label="Laporan warga" value={citizenReports} href="/reports" hint="Kelola laporan Anda." />
              <DashCard label="Laporan sakit" value={sicknessReports} href="/reports/sick" hint="Lapor kondisi sedang sakit." />
              <DashCard label="Laporan keuangan" value={financeReports.length} href="/finance/reports" hint="Laporan publikasi RW." />
              <DashCard label="Akun" value={session.user.status} href="#" hint="Profil akun Anda." />
            </>
          ) : (
            <>
              <DashCard label="Laporan warga" value={citizenReports} href="/cms/reports" hint="Kotak masuk pengurus." />
              <DashCard label="Laporan sakit" value={sicknessReports} href="/cms/sickness-reports" hint="Akses sensitif terbatas." />
              <DashCard label="Konten" value={contents.length} href="/cms/content" hint="Berita dan pengumuman." />
              <DashCard label="Keuangan" value={financeReports.length} href="/cms/finance" hint="Transaksi & laporan." />
            </>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Informasi terbaru</h2>
          <div className="mt-4 space-y-3">
            {contents.length === 0 && <p className="text-sm text-slate-500">Belum ada informasi yang dipublikasikan.</p>}
            {contents.map((content) => (
              <article key={content.id} className="rounded-2xl border border-slate-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">{content.type}</p>
                <h3 className="mt-1 font-bold text-slate-900">{content.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{content.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Agenda mendatang</h2>
          <div className="mt-4 space-y-3">
            {agendas.length === 0 && <p className="text-sm text-slate-500">Belum ada agenda mendatang.</p>}
            {agendas.map((agenda) => (
              <article key={agenda.id} className="rounded-2xl border border-slate-100 p-5">
                <h3 className="font-bold text-slate-900">{agenda.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{new Date(agenda.startsAt).toLocaleString('id-ID')} · {agenda.location || 'Lokasi belum ditentukan'}</p>
                <p className="mt-2 text-sm text-slate-500">{agenda.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function DashCard({ label, value, href, hint }: { label: string; value: number | string; href: string; hint: string }) {
  const inner = (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
  if (href === '#') return inner
  return (
    <Link href={href} className="block transition hover:border-[#5b4bff] hover:shadow">
      {inner}
    </Link>
  )
}
