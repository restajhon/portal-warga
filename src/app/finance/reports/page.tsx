import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export default async function FinanceReportsPage() {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') redirect('/')
  const reports = await prisma.financeReport.findMany({ where: { status: 'DIPUBLIKASIKAN' }, orderBy: { periodStart: 'desc' } })
  return <main className="min-h-screen bg-[#f7f7fb] px-5 py-10"><section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Keuangan RW</h1><p className="mt-3 text-sm text-slate-500">Laporan yang tampil sudah melalui approval dan publikasi Super Admin.</p><div className="mt-8 space-y-4">{reports.length === 0 && <p className="text-sm text-slate-500">Belum ada laporan yang dipublikasikan.</p>}{reports.map(report => <article key={report.id} className="rounded-2xl border border-slate-100 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-slate-900">{report.title}</h2><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Dipublikasikan</span></div><p className="mt-2 text-sm text-slate-500">Periode {report.periodStart.toLocaleDateString('id-ID')} – {report.periodEnd.toLocaleDateString('id-ID')}</p>{report.summary && <p className="mt-4 text-sm leading-6 text-slate-600">{report.summary}</p>}</article>)}</div></section></main>
}
