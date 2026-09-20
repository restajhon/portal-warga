'use client'

import { FormEvent, useEffect, useState } from 'react'

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
  const [reports, setReports] = useState<Report[]>([])
  const [form, setForm] = useState({ type: 'LAPORAN', title: '', body: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  async function load() {
    const response = await fetch('/api/citizen-reports')
    if (response.ok) setReports((await response.json()).data)
  }
  useEffect(() => { void load() }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setMessage('')
    const editing = reports.find((report) => report.id === editingId)
    const response = await fetch(editing ? `/api/citizen-reports/${editing.id}` : '/api/citizen-reports', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const result = await response.json()
    if (!response.ok) { setMessage(result.error ?? 'Laporan gagal disimpan.'); return }
    setForm({ type: 'LAPORAN', title: '', body: '' })
    setEditingId(null)
    setMessage(editing ? 'Laporan berhasil diperbarui.' : 'Laporan terkirim. Status dapat dipantau di bawah.')
    await load()
  }

  function startEdit(report: Report) {
    setEditingId(report.id)
    setForm({ type: report.type, title: report.title, body: report.body })
    setMessage('')
  }

  return <main className="min-h-screen bg-[#f7f7fb] px-5 py-10"><section className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Saya</h1><div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]"><form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">{editingId ? 'Edit laporan' : 'Kirim laporan'}</h2><div className="mt-5 space-y-4"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" /><textarea required placeholder="Jelaskan laporan Anda (min. 10 karakter)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 p-4 text-sm" />{message && <p className="text-sm text-slate-600">{message}</p>}<button className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white">{editingId ? 'Simpan perubahan' : 'Kirim laporan'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'LAPORAN', title: '', body: '' }) }} className="h-12 w-full rounded-xl border border-slate-200 text-sm font-semibold">Batal edit</button>}</div></form><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Riwayat laporan</h2><p className="mt-1 text-sm text-slate-500">Laporan hanya dapat diedit sebelum berstatus selesai.</p><div className="mt-5 space-y-3">{reports.length === 0 && <p className="text-sm text-slate-500">Belum ada laporan. Kirim laporan pertama Anda dari formulir di samping.</p>}{reports.map((report) => <article key={report.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">{TYPE_LABELS[report.type] ?? report.type}</p><h3 className="mt-1 font-bold">{report.title}</h3></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{STATUS_LABELS[report.status] ?? report.status}</span></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{report.body}</p><p className="mt-2 text-xs text-slate-400">{new Date(report.createdAt).toLocaleString('id-ID')}</p>{EDITABLE_STATUSES.includes(report.status) && <button type="button" onClick={() => startEdit(report)} className="mt-3 text-sm font-semibold text-[#5b4bff]">Edit laporan</button>}</article>)}</div></section></div></section></main>
}
