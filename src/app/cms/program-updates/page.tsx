'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Update = { id: string; title: string; body: string; status: string; createdAt: string }

export default function CmsProgramUpdatesPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Update[]>([])
  const [form, setForm] = useState({ title: '', body: '', status: 'DRAFT' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/program-updates?scope=manage')
    if (!response.ok) {
      setError('Gagal memuat program.')
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
    setBusy(true)
    setMessage('')
    setError('')
    const response = await fetch('/api/program-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Gagal menyimpan program.')
      setBusy(false)
      return
    }
    setForm({ title: '', body: '', status: 'DRAFT' })
    setMessage('Update program berhasil disimpan.')
    setBusy(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/program-updates" title="Program & Kegiatan" subtitle="Sampaikan perkembangan program RW untuk warga.">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Tulis update program</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <textarea required placeholder="Ceritakan perkembangan program..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-32 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="DRAFT">Simpan draft</option>
              <option value="PUBLISHED">Publikasikan</option>
            </select>
            {error ? <ErrorBanner message={error} /> : null}
            {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
            <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Menyimpan...' : 'Simpan update'}</button>
          </div>
        </form>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Daftar update</h2>
          {loading ? <div className="mt-6"><Spinner /></div> : null}
          {!loading && items.length === 0 ? (
            <div className="mt-5"><EmptyState title="Belum ada update program" description="Tulis update dari formulir di samping." /></div>
          ) : null}
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{item.status}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CmsShell>
  )
}
