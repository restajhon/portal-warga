'use client'

import { FormEvent, useEffect, useState } from 'react'

type Response = { id: string; body: string; statusAfter?: string | null; createdAt: string; responder: { name: string } }
type Report = { id: string; type: string; title: string; body: string; status: string; createdAt: string; reporter: { name: string; address?: string | null } }
type ReportDetail = Report & { responses: Response[] }

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

// Pilihan status untuk pengurus sesuai aturan transisi; status akhir dikelompokkan terakhir.
const STATUS_OPTIONS = ['DITINJAU', 'DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES']

export default function CmsReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ReportDetail | null>(null)
  const [responseBody, setResponseBody] = useState('')
  const [responseStatus, setResponseStatus] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const response = await fetch('/api/citizen-reports?scope=manage')
    if (response.ok) setReports((await response.json()).data)
  }
  async function loadDetail(id: string) {
    const response = await fetch(`/api/citizen-reports/${id}`)
    if (response.ok) setDetail((await response.json()).data)
  }
  useEffect(() => { void load() }, [])
  useEffect(() => { if (selectedId) void loadDetail(selectedId) }, [selectedId])

  async function changeStatus(id: string, status: string) {
    setMessage('')
    const response = await fetch(`/api/citizen-reports/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    const result = await response.json()
    setMessage(response.ok ? 'Status laporan diperbarui.' : result.error ?? 'Status gagal diperbarui.')
    if (response.ok) { await load(); if (selectedId) await loadDetail(selectedId) }
  }

  async function respond(event: FormEvent) {
    event.preventDefault()
    if (!selectedId) return
    setMessage('')
    const response = await fetch(`/api/citizen-reports/${selectedId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: responseBody, ...(responseStatus ? { status: responseStatus } : {}) }),
    })
    const result = await response.json()
    if (!response.ok) { setMessage(result.error ?? 'Tanggapan gagal dikirim.'); return }
    setResponseBody(''); setResponseStatus('')
    setMessage('Tanggapan terkirim.')
    await load(); await loadDetail(selectedId)
  }

  return <main className="min-h-screen bg-[#f7f7fb] px-5 py-10"><section className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">CMS Pengurus</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Laporan Warga</h1><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]"><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Kotak masuk laporan</h2><div className="mt-5 space-y-3">{reports.length === 0 && <p className="text-sm text-slate-500">Belum ada laporan masuk.</p>}{reports.map((report) => <article key={report.id} className={`rounded-2xl border p-4 ${report.id === selectedId ? 'border-[#5b4bff]' : 'border-slate-100'}`}><button type="button" onClick={() => { setSelectedId(report.id); setMessage('') }} className="w-full text-left"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">{TYPE_LABELS[report.type] ?? report.type}</p><h3 className="mt-1 font-bold">{report.title}</h3></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{STATUS_LABELS[report.status] ?? report.status}</span></div><p className="mt-2 text-sm text-slate-500">{report.reporter.name} · {new Date(report.createdAt).toLocaleString('id-ID')}</p></button><div className="mt-3 flex flex-wrap gap-2">{STATUS_OPTIONS.filter((status) => status !== report.status).map((status) => <button key={status} type="button" onClick={() => changeStatus(report.id, status)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">{STATUS_LABELS[status]}</button>)}</div></article>)}</div></section><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Detail & tanggapan</h2>{!detail && <p className="mt-4 text-sm text-slate-500">Pilih laporan dari kotak masuk untuk melihat detail dan menanggapi.</p>}{detail && <div><p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">{TYPE_LABELS[detail.type] ?? detail.type}</p><h3 className="mt-1 font-bold">{detail.title}</h3><p className="mt-2 text-sm text-slate-500">{detail.reporter.name}{detail.reporter.address ? ` · ${detail.reporter.address}` : ''}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{detail.body}</p><h3 className="mt-6 text-sm font-bold">Tanggapan</h3><div className="mt-3 space-y-3">{detail.responses.length === 0 && <p className="text-sm text-slate-500">Belum ada tanggapan.</p>}{detail.responses.map((item) => <article key={item.id} className="rounded-2xl bg-[#f7f7fb] p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.body}</p><p className="mt-2 text-xs text-slate-400">{item.responder.name} · {new Date(item.createdAt).toLocaleString('id-ID')}{item.statusAfter ? ` · status: ${STATUS_LABELS[item.statusAfter] ?? item.statusAfter}` : ''}</p></article>)}</div><form onSubmit={respond} className="mt-6 space-y-3"><textarea required placeholder="Tulis tanggapan untuk warga" value={responseBody} onChange={(e) => setResponseBody(e.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" /><select value={responseStatus} onChange={(e) => setResponseStatus(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"><option value="">Ubah status (opsional)</option>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select>{message && <p className="text-sm text-slate-600">{message}</p>}<button className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Kirim tanggapan</button></form></div>}</section></div></section></main>
}
