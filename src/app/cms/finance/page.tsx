'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Transaction = { id: string; type: string; paymentMethod: string; category: string; description: string; amount: string; occurredAt: string }
type Report = { id: string; title: string; summary?: string | null; status: string; periodStart: string; periodEnd: string }

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  MENUNGGU_APPROVAL: 'Menunggu persetujuan',
  DISETUJUI: 'Disetujui',
  DIPUBLIKASIKAN: 'Dipublikasikan',
}

export default function CmsFinancePage() {
  const { data: session, status: sessionStatus } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [txForm, setTxForm] = useState({ type: 'PEMASUKAN', paymentMethod: 'CASH', category: '', description: '', amount: '', occurredAt: '' })
  const [reportForm, setReportForm] = useState({ title: '', summary: '', periodStart: '', periodEnd: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const role = session?.user?.role
  const canApprove = role === 'SUPER_ADMIN'

  async function load() {
    setLoading(true)
    setError('')
    const [t, r] = await Promise.all([fetch('/api/finance/transactions'), fetch('/api/finance/reports?scope=manage')])
    if (!t.ok || !r.ok) {
      setError('Gagal memuat data keuangan.')
      setLoading(false)
      return
    }
    setTransactions((await t.json()).data)
    setReports((await r.json()).data)
    setLoading(false)
  }

  useEffect(() => {
    if (sessionStatus === 'authenticated') void load()
  }, [sessionStatus])

  async function submitTx(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const response = await fetch('/api/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...txForm, amount: Number(txForm.amount), occurredAt: txForm.occurredAt ? new Date(txForm.occurredAt).toISOString() : '' }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Gagal menyimpan transaksi.')
      setBusy(false)
      return
    }
    setTxForm({ type: 'PEMASUKAN', paymentMethod: 'CASH', category: '', description: '', amount: '', occurredAt: '' })
    setMessage('Transaksi tersimpan.')
    setBusy(false)
    await load()
  }

  async function submitReport(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const response = await fetch('/api/finance/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: reportForm.title,
        summary: reportForm.summary || undefined,
        periodStart: reportForm.periodStart ? new Date(reportForm.periodStart).toISOString() : '',
        periodEnd: reportForm.periodEnd ? new Date(reportForm.periodEnd).toISOString() : '',
      }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Gagal membuat laporan.')
      setBusy(false)
      return
    }
    setReportForm({ title: '', summary: '', periodStart: '', periodEnd: '' })
    setMessage('Laporan dikirim untuk menunggu persetujuan.')
    setBusy(false)
    await load()
  }

  async function changeReportStatus(id: string, action: 'approve' | 'publish') {
    setBusy(true)
    setMessage('')
    setError('')
    const response = await fetch(`/api/finance/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Aksi laporan gagal.')
      setBusy(false)
      return
    }
    setMessage(action === 'approve' ? 'Laporan disetujui.' : 'Laporan dipublikasikan.')
    setBusy(false)
    await load()
  }

  function download(report: Report, format: 'pdf' | 'xlsx') {
    window.open(`/api/finance/reports/${report.id}/export?format=${format}`, '_blank')
  }

  return (
    <CmsShell
      session={session ?? null}
      active="/cms/finance"
      title="Keuangan RW"
      subtitle="Catat transaksi dan kelola laporan berkala. Persetujuan & publikasi hanya dapat dilakukan Super Admin."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <form onSubmit={submitTx} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Catat transaksi</h2>
            <div className="mt-5 space-y-4">
              <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
                <option value="PEMASUKAN">Pemasukan</option>
                <option value="PENGELUARAN">Pengeluaran</option>
              </select>
              <select value={txForm.paymentMethod} onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
                <option value="CASH">Cash</option>
                <option value="TRANSFER">Transfer</option>
              </select>
              <input required placeholder="Kategori" value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <input required placeholder="Nominal" type="number" min="1" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <input required type="datetime-local" value={txForm.occurredAt} onChange={(e) => setTxForm({ ...txForm, occurredAt: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <textarea required placeholder="Deskripsi" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Menyimpan...' : 'Simpan transaksi'}</button>
            </div>
          </form>

          <form onSubmit={submitReport} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Buat laporan keuangan</h2>
            <p className="mt-1 text-sm text-slate-500">Laporan akan berstatus menunggu persetujuan dan hanya dapat dipublikasikan oleh Super Admin.</p>
            <div className="mt-5 space-y-4">
              <input required placeholder="Judul laporan" value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <textarea placeholder="Ringkasan (opsional)" value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <input required type="date" value={reportForm.periodStart} onChange={(e) => setReportForm({ ...reportForm, periodStart: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <input required type="date" value={reportForm.periodEnd} onChange={(e) => setReportForm({ ...reportForm, periodEnd: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Mengirim...' : 'Kirim untuk persetujuan'}</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Transaksi terbaru</h2>
            {loading ? <div className="mt-6"><Spinner /></div> : null}
            {!loading && transactions.length === 0 ? (
              <div className="mt-5"><EmptyState title="Belum ada transaksi" description="Catat transaksi pertama dari formulir di samping." /></div>
            ) : null}
            <div className="mt-5 space-y-3">
              {transactions.slice(0, 10).map((t) => (
                <article key={t.id} className="flex justify-between gap-4 rounded-2xl border border-slate-100 p-4">
                  <div>
                    <p className="font-bold">{t.category}</p>
                    <p className="text-sm text-slate-500">{t.description} · {t.paymentMethod}</p>
                  </div>
                  <p className={t.type === 'PEMASUKAN' ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
                    {t.type === 'PEMASUKAN' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Laporan keuangan</h2>
            {loading ? <div className="mt-6"><Spinner /></div> : null}
            {!loading && reports.length === 0 ? (
              <div className="mt-5"><EmptyState title="Belum ada laporan" description="Buat laporan periode tertentu dari formulir di samping." /></div>
            ) : null}
            <div className="mt-5 space-y-3">
              {reports.map((report) => (
                <article key={report.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{report.title}</p>
                      <p className="text-sm text-slate-500">Periode {new Date(report.periodStart).toLocaleDateString('id-ID')} – {new Date(report.periodEnd).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{STATUS_LABELS[report.status] ?? report.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.status === 'MENUNGGU_APPROVAL' && canApprove ? (
                      <button disabled={busy} onClick={() => changeReportStatus(report.id, 'approve')} className="rounded-full bg-[#5b4bff] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Setujui</button>
                    ) : null}
                    {report.status === 'DISETUJUI' && canApprove ? (
                      <button disabled={busy} onClick={() => changeReportStatus(report.id, 'publish')} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Publikasikan</button>
                    ) : null}
                    {report.status === 'MENUNGGU_APPROVAL' && !canApprove ? (
                      <span className="text-xs text-slate-500">Menunggu Super Admin menyetujui.</span>
                    ) : null}
                    <button onClick={() => download(report, 'pdf')} className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">Unduh PDF</button>
                    <button onClick={() => download(report, 'xlsx')} className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">Unduh XLSX</button>
                  </div>
                </article>
              ))}
            </div>
            {error ? <div className="mt-4"><ErrorBanner message={error} /></div> : null}
            {message ? <p className="mt-4 text-sm text-emerald-700" role="status">{message}</p> : null}
          </section>
        </div>
      </div>
    </CmsShell>
  )
}
