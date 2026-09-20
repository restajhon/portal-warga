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
  const contents = await prisma.content.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 10 })
  const agendas = await prisma.agenda.findMany({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' }, take: 5 })
  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{isPengurus ? 'CMS Pengurus RW' : 'Dashboard Warga'}</h1>
        <p className="mt-3 text-slate-600">Selamat datang, {session.user.name ?? session.user.email}.</p>
        <div className="mt-8 rounded-2xl bg-[#f7f7fb] p-5 text-sm text-slate-600">
          <p>Account type: <strong>{session.user.accountType ?? 'UNKNOWN'}</strong></p>
          {session.user.role && <p className="mt-1">Role: <strong>{session.user.role}</strong></p>}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {!isPengurus && <Link href="/reports" className="rounded-xl bg-[#5b4bff] px-5 py-3 text-sm font-bold text-white">Laporan Saya</Link>}
          <Link href="/finance/reports" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">Laporan Keuangan</Link>
          {isPengurus && <Link href="/cms/reports" className="rounded-xl bg-[#5b4bff] px-5 py-3 text-sm font-bold text-white">Kelola Laporan Warga</Link>}
        </div>
        <section className="mt-8">
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
          <div className="mt-4 space-y-3">{agendas.length === 0 && <p className="text-sm text-slate-500">Belum ada agenda mendatang.</p>}{agendas.map((agenda) => <article key={agenda.id} className="rounded-2xl border border-slate-100 p-5"><h3 className="font-bold text-slate-900">{agenda.title}</h3><p className="mt-2 text-sm text-slate-600">{new Date(agenda.startsAt).toLocaleString('id-ID')} · {agenda.location || 'Lokasi belum ditentukan'}</p><p className="mt-2 text-sm text-slate-500">{agenda.description}</p></article>)}</div>
        </section>
      </section>
    </main>
  )
}
