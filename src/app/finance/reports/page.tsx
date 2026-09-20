import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export default async function FinanceReportsPage() {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') redirect('/')

  const reports = await prisma.financeReport.findMany({
    where: { status: 'DIPUBLIKASIKAN' },
    orderBy: { periodStart: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Keuangan RW</h1>
            <p className="mt-3 text-sm text-slate-500">Laporan yang tampil sudah melalui approval dan publikasi Super Admin. Bukti transfer internal tidak ditampilkan ke warga.</p>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Dashboard</Link>
        </div>
        <div className="mt-8 space-y-4">
          {reports.length === 0 && <p className="text-sm text-slate-500">Belum ada laporan yang dipublikasikan.</p>}
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-slate-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold text-slate-900">{report.title}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Dipublikasikan</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Periode {report.periodStart.toLocaleDateString('id-ID')} – {report.periodEnd.toLocaleDateString('id-ID')}</p>
              {report.summary ? <p className="mt-4 text-sm leading-6 text-slate-600">{report.summary}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`/api/finance/reports/${report.id}/export?format=pdf`} className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">Unduh PDF</a>
                <a href={`/api/finance/reports/${report.id}/export?format=xlsx`} className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">Unduh XLSX</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
