'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type SicknessReport = {
  id: string
  patientName: string
  patientAddress: string | null
  patientRt: string | null
  assistanceNeed: string
  severity: 'RINGAN' | 'SEDANG' | 'BERAT'
  status: 'TERKIRIM' | 'DITINJAU' | 'DIBANTU' | 'SELESAI' | 'TIDAK_DAPAT_DIPROSES'
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  TERKIRIM: 'Terkirim',
  DITINJAU: 'Sedang ditinjau',
  DIBANTU: 'Sedang dibantu',
  SELESAI: 'Selesai',
  TIDAK_DAPAT_DIPROSES: 'Tidak dapat diproses',
}

const SEVERITY_LABELS: Record<string, string> = {
  RINGAN: 'Ringan',
  SEDANG: 'Sedang',
  BERAT: 'Berat',
}

const EDITABLE_STATUSES = ['TERKIRIM', 'DITINJAU', 'DIBANTU']

export default function SicknessReportsPage() {
  const { data: session, status } = useSession()
  const [reports, setReports] = useState<SicknessReport[]>([])
  const [form, setForm] = useState({ patientName: '', patientAddress: '', patientRt: '', assistanceNeed: '', severity: 'RINGAN', symptoms: '', medicalNotes: '', contactPhone: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/sickness-reports')
    if (!response.ok) {
      setError('Gagal memuat laporan sakit.')
      setLoading(false)
      return
    }
    setReports((await response.json()).data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated') void load()
  }, [status])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const editing = reports.find((r) => r.id === editingId)
    const response = await fetch(editing ? `/api/sickness-reports/${editing.id}` : '/api/sickness-reports', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Laporan gagal disimpan.')
      setBusy(false)
      return
    }
    setForm({ patientName: '', patientAddress: '', patientRt: '', assistanceNeed: '', severity: 'RINGAN', symptoms: '', medicalNotes: '', contactPhone: '' })
    setEditingId(null)
    setMessage(editing ? 'Laporan berhasil diperbarui.' : 'Laporan sakit terkirim. Pengurus akan menindaklanjuti.')
    setBusy(false)
    await load()
  }

  function startEdit(report: SicknessReport) {
    setEditingId(report.id)
    // We only carry the public metadata; sensitive fields are loaded from server.
    setForm((prev) => ({ ...prev, patientName: report.patientName, patientAddress: report.patientAddress ?? '', patientRt: report.patientRt ?? '', assistanceNeed: report.assistanceNeed, severity: report.severity }))
    setMessage('')
    setError('')
  }

  if (status === 'loading') {
    return <main className="flex min-h-screen items-center justify-center"><Spinner /></main>
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
        <section className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Silakan login dulu</h1>
          <p className="mt-3 text-sm text-slate-500">Halaman ini hanya untuk warga yang sudah login.</p>
          <Link href="/" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Ke halaman login</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Sakit</h1>
        <p className="mt-2 text-sm text-slate-500">Detail gejala dan catatan medis hanya dapat diakses pengurus berwenang dan setiap aksesnya dicatat di audit log.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">{editingId ? 'Edit laporan sakit' : 'Kirim laporan sakit'}</h2>
            <div className="mt-5 space-y-4">
              <input required placeholder="Nama pasien" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <input placeholder="Alamat (opsional)" value={form.patientAddress} onChange={(e) => setForm({ ...form, patientAddress: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <input placeholder="RT (opsional)" value={form.patientRt} onChange={(e) => setForm({ ...form, patientRt: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <textarea required placeholder="Jelaskan kebutuhan bantuan" value={form.assistanceNeed} onChange={(e) => setForm({ ...form, assistanceNeed: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as 'RINGAN' | 'SEDANG' | 'BERAT' })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
                <option value="RINGAN">Ringan</option>
                <option value="SEDANG">Sedang</option>
                <option value="BERAT">Berat</option>
              </select>
              <textarea required placeholder="Gejala yang dialami" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <textarea placeholder="Catatan medis (opsional)" value={form.medicalNotes} onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })} className="min-h-20 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <input placeholder="Nomor kontak (opsional)" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              {error ? <ErrorBanner message={error} /> : null}
              {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
              <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Menyimpan...' : (editingId ? 'Simpan perubahan' : 'Kirim laporan')}</button>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(null); setForm({ patientName: '', patientAddress: '', patientRt: '', assistanceNeed: '', severity: 'RINGAN', symptoms: '', medicalNotes: '', contactPhone: '' }) }} className="h-12 w-full rounded-xl border border-slate-200 text-sm font-semibold">Batal edit</button>
              ) : null}
            </div>
          </form>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Riwayat laporan sakit</h2>
            {loading ? <div className="mt-6"><Spinner /></div> : null}
            {!loading && reports.length === 0 ? (
              <div className="mt-5"><EmptyState title="Belum ada laporan" description="Kirim laporan sakit pertama Anda dari formulir di samping." /></div>
            ) : null}
            <div className="mt-5 space-y-3">
              {reports.map((report) => (
                <article key={report.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">Pasien: {report.patientName}</p>
                      <h3 className="mt-1 font-bold">{report.assistanceNeed}</h3>
                      <p className="mt-1 text-xs text-slate-500">Keparahan: {SEVERITY_LABELS[report.severity]} {report.patientRt ? `· RT ${report.patientRt}` : ''}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{STATUS_LABELS[report.status] ?? report.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{new Date(report.createdAt).toLocaleString('id-ID')}</p>
                  {EDITABLE_STATUSES.includes(report.status) ? (
                    <button type="button" onClick={() => startEdit(report)} className="mt-3 text-sm font-semibold text-[#5b4bff]">Edit laporan</button>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
