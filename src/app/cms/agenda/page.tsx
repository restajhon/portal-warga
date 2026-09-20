'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Agenda = { id: string; title: string; description: string; location?: string | null; startsAt: string; status: string }

export default function CmsAgendaPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Agenda[]>([])
  const [form, setForm] = useState({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/agenda?scope=manage')
    if (!response.ok) {
      setError('Gagal memuat agenda.')
      setLoading(false)
      return
    }
    setItems((await response.json()).data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated') void load()
  }, [status])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')
    const response = await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '' }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Agenda gagal disimpan.')
      setSubmitting(false)
      return
    }
    setForm({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT' })
    setMessage('Agenda berhasil disimpan.')
    setSubmitting(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/agenda" title="Agenda & Kegiatan" subtitle="Jadwalkan kegiatan RW untuk warga.">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Buat agenda</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul agenda" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <textarea required placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <input placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="DRAFT">Simpan draft</option>
              <option value="PUBLISHED">Publikasikan</option>
            </select>
            {error ? <ErrorBanner message={error} /> : null}
            {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
            <button disabled={submitting} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Menyimpan...' : 'Simpan agenda'}</button>
          </div>
        </form>
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Daftar agenda</h2>
          {loading ? <div className="mt-6"><Spinner /></div> : null}
          {!loading && items.length === 0 ? (
            <div className="mt-5"><EmptyState title="Belum ada agenda" description="Buat agenda dari formulir di samping." /></div>
          ) : null}
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex justify-between gap-3">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="text-xs font-semibold">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{new Date(item.startsAt).toLocaleString('id-ID')} · {item.location || 'Lokasi belum ditentukan'}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CmsShell>
  )
}
