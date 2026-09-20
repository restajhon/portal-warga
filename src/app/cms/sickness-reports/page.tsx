'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Response = { id: string; body: string; statusAfter?: string | null; createdAt: string; responder: { name: string } }
type SicknessReport = {
  id: string
  reporterId: string
  patientName: string
  patientAddress: string | null
  patientRt: string | null
  assistanceNeed: string
  severity: 'RINGAN' | 'SEDANG' | 'BERAT'
  status: 'TERKIRIM' | 'DITINJAU' | 'DIBANTU' | 'SELESAI' | 'TIDAK_DAPAT_DIPROSES'
  createdAt: string
  resolvedAt: string | null
}
type ReportDetail = SicknessReport & { responses: Response[]; details: { symptoms: string; medicalNotes: string | null; contactPhone: string | null } | null }

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

const STATUS_OPTIONS = ['DITINJAU', 'DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES']

export default function CmsSicknessReportsPage() {
  const { data: session, status } = useSession()
  const [reports, setReports] = useState<SicknessReport[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ReportDetail | null>(null)
  const [responseBody, setResponseBody] = useState('')
  const [responseStatus, setResponseStatus] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/sickness-reports?scope=manage')
    if (!response.ok) {
      setError('Gagal memuat laporan sakit. Pastikan Anda memiliki akses pengurus berwenang.')
      setLoading(false)
      return
    }
    setReports((await response.json()).data)
    setLoading(false)
  }

  async function loadDetail(id: string) {
    setDetailLoading(true)
    const response = await fetch(`/api/sickness-reports/${id}`)
    if (response.ok) setDetail((await response.json()).data)
    setDetailLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated') void load()
  }, [status])

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId)
  }, [selectedId])

  async function changeStatus(id: string, next: string) {
    setMessage('')
    setError('')
    const response = await fetch(`/api/sickness-reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Status gagal diperbarui.')
      return
    }
    setMessage('Status laporan diperbarui.')
    await load()
    if (selectedId) await loadDetail(selectedId)
  }

  async function respond(event: FormEvent) {
    event.preventDefault()
    if (!selectedId) return
    setBusy(true)
    setMessage('')
    setError('')
    const response = await fetch(`/api/sickness-reports/${selectedId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: responseBody, ...(responseStatus ? { status: responseStatus } : {}) }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Tanggapan gagal dikirim.')
      setBusy(false)
      return
    }
    setResponseBody('')
    setResponseStatus('')
    setMessage('Tanggapan terkirim. Akses ke detail kesehatan tercatat di audit log.')
    setBusy(false)
    await load()
    await loadDetail(selectedId)
  }

  return (
    <CmsShell session={session ?? null} active="/cms/sickness-reports" title="Laporan Sakit" subtitle="Detail kesehatan hanya dapat diakses pengurus berwenang dan setiap akses dicatat di audit log.">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Kotak masuk laporan sakit</h2>
          <p className="mt-1 text-sm text-slate-500">Daftar di bawah tidak menampilkan gejala atau catatan medis.</p>
          {loading ? <div className="mt-6"><Spinner /></div> : null}
          {!loading && reports.length === 0 ? (
            <div className="mt-5"><EmptyState title="Belum ada laporan sakit" description="Warga dapat mengirim laporan sakit dari portal." /></div>
          ) : null}
          <div className="mt-5 space-y-3">
            {reports.map((report) => (
              <article key={report.id} className={`rounded-2xl border p-4 ${report.id === selectedId ? 'border-[#5b4bff]' : 'border-slate-100'}`}>
                <button type="button" onClick={() => { setSelectedId(report.id); setMessage(''); setError('') }} className="w-full text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">Pasien: {report.patientName}</p>
                      <h3 className="mt-1 font-bold">{report.assistanceNeed}</h3>
                      <p className="text-xs text-slate-500">Keparahan: {SEVERITY_LABELS[report.severity]} {report.patientRt ? `· RT ${report.patientRt}` : ''}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{STATUS_LABELS[report.status] ?? report.status}</span>
                  </div>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.filter((s) => s !== report.status).map((s) => (
                    <button key={s} type="button" onClick={() => changeStatus(report.id, s)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#5b4bff] hover:text-[#5b4bff]">
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Detail & tanggapan</h2>
          {!detail ? <p className="mt-4 text-sm text-slate-500">Pilih laporan untuk melihat detail. Membuka detail akan dicatat di audit log.</p> : (
            <div>
              {detailLoading ? <div className="mt-4"><Spinner label="Memuat detail..." /></div> : null}
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#5b4bff]">Pasien {detail.patientName}</p>
              <p className="mt-1 text-sm text-slate-500">{detail.patientAddress || 'Alamat belum diisi'}{detail.patientRt ? ` · RT ${detail.patientRt}` : ''}</p>
              <p className="mt-3 text-sm"><strong>Keparahan:</strong> {SEVERITY_LABELS[detail.severity]}</p>
              <p className="mt-1 text-sm"><strong>Kebutuhan:</strong> {detail.assistanceNeed}</p>
              {detail.details ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Detail kesehatan (sensitif)</p>
                  <p className="mt-2"><strong>Gejala:</strong> {detail.details.symptoms}</p>
                  {detail.details.medicalNotes ? <p className="mt-1"><strong>Catatan medis:</strong> {detail.details.medicalNotes}</p> : null}
                  {detail.details.contactPhone ? <p className="mt-1"><strong>Kontak:</strong> {detail.details.contactPhone}</p> : null}
                </div>
              ) : null}

              <h3 className="mt-6 text-sm font-bold">Tanggapan</h3>
              <div className="mt-3 space-y-3">
                {detail.responses.length === 0 ? <p className="text-sm text-slate-500">Belum ada tanggapan.</p> : null}
                {detail.responses.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-[#f7f7fb] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.responder.name} · {new Date(item.createdAt).toLocaleString('id-ID')}{item.statusAfter ? ` · status: ${STATUS_LABELS[item.statusAfter] ?? item.statusAfter}` : ''}</p>
                  </article>
                ))}
              </div>

              <form onSubmit={respond} className="mt-6 space-y-3">
                <textarea required placeholder="Tulis tanggapan untuk warga" value={responseBody} onChange={(e) => setResponseBody(e.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
                <select value={responseStatus} onChange={(e) => setResponseStatus(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
                  <option value="">Ubah status (opsional)</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                {error ? <ErrorBanner message={error} /> : null}
                {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
                <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Mengirim...' : 'Kirim tanggapan'}</button>
              </form>
            </div>
          )}
        </section>
      </div>
    </CmsShell>
  )
}
