'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Report = { id: string; type: string; title: string; body: string; status: string; createdAt: string }

const STATUS_LABELS: Record<string, string> = {
  TERKIRIM: 'Terkirim',
  DITINJAU: 'Sedang ditinjau',
  DIPROSES: 'Sedang diproses',
  SELESAI: 'Selesai',
  TIDAK_DAPAT_DIPROSES: 'Tidak dapat diproses',
}

const TYPE_LABELS: Record<string, string> = {
  LAPORAN: 'Laporan',
  KELUHAN: 'Keluhan',
  ASPIRASI: 'Aspirasi',
  BANTUAN: 'Bantuan',
}

const EDITABLE_STATUSES = ['TERKIRIM', 'DITINJAU', 'DIPROSES']

export default function CitizenReportsPage() {
  const { data: session, status } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [form, setForm] = useState({ type: 'LAPORAN', title: '', body: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/citizen-reports')
    if (!response.ok) {
      setError('Gagal memuat laporan.')
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
    const editing = reports.find((report) => report.id === editingId)
    const response = await fetch(editing ? `/api/citizen-reports/${editing.id}` : '/api/citizen-reports', {
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
    setForm({ type: 'LAPORAN', title: '', body: '' })
    setEditingId(null)
    setMessage(editing ? 'Laporan berhasil diperbarui.' : 'Laporan terkirim. Status dapat dipantau di bawah.')
    setBusy(false)
    await load()
  }

  function startEdit(report: Report) {
    setEditingId(report.id)
    setForm({ type: report.type, title: report.title, body: report.body })
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
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Saya</h1>
        <p className="mt-2 text-sm text-slate-500">Untuk laporan warga sakit dengan privasi data kesehatan, gunakan <Link href="/reports/sick" className="font-semibold text-[#5b4bff] hover:underline">halaman laporan sakit</Link>.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">{editingId ? 'Edit laporan' : 'Kirim laporan'}</h2>
            <div className="mt-5 space-y-4">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
                {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <textarea required placeholder="Jelaskan laporan Anda (min. 10 karakter)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              {error ? <ErrorBanner message={error} /> : null}
              {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
              <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Menyimpan...' : (editingId ? 'Simpan perubahan' : 'Kirim laporan')}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'LAPORAN', title: '', body: '' }) }} className="h-12 w-full rounded-xl border border-slate-200 text-sm font-semibold">Batal edit</button> : null}
            </div>
          </form>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Riwayat laporan</h2>
            <p className="mt-1 text-sm text-slate-500">Laporan hanya dapat diedit sebelum berstatus selesai.</p>
            {loading ? <div className="mt-6"><Spinner /></div> : null}
            {!loading && reports.length === 0 ? (
              <div className="mt-5"><EmptyState title="Belum ada laporan" description="Kirim laporan pertama Anda dari formulir di samping." /></div>
            ) : null}
            <div className="mt-5 space-y-3">
              {reports.map((report) => (
                <article key={report.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">{TYPE_LABELS[report.type] ?? report.type}</p>
                      <h3 className="mt-1 font-bold">{report.title}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{STATUS_LABELS[report.status] ?? report.status}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{report.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(report.createdAt).toLocaleString('id-ID')}</p>
                  {EDITABLE_STATUSES.includes(report.status) ? <button type="button" onClick={() => startEdit(report)} className="mt-3 text-sm font-semibold text-[#5b4bff]">Edit laporan</button> : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
