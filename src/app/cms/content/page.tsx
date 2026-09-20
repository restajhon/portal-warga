'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { PhotoUpload } from '@/components/photo-upload'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Content = { id: string; title: string; body: string; type: string; status: string; imageUrl?: string | null }

export default function CmsContentPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Content[]>([])
  const [form, setForm] = useState({ title: '', body: '', type: 'BERITA', status: 'DRAFT', imageUrl: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/content?scope=manage')
    if (!response.ok) {
      setError('Gagal memuat konten.')
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
    const response = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Konten gagal disimpan.')
      setSubmitting(false)
      return
    }
    setForm({ title: '', body: '', type: 'BERITA', status: 'DRAFT', imageUrl: '' })
    setMessage('Konten berhasil disimpan.')
    setSubmitting(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/content" title="Berita & Pengumuman" subtitle="Susun berita dan pengumuman untuk warga.">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Buat konten</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="BERITA">Berita</option>
              <option value="PENGUMUMAN">Pengumuman</option>
            </select>
            <textarea required placeholder="Isi konten" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-40 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <PhotoUpload value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="DRAFT">Simpan draft</option>
              <option value="PUBLISHED">Publikasikan</option>
            </select>
            {error ? <ErrorBanner message={error} /> : null}
            {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
            <button disabled={submitting} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Menyimpan...' : 'Simpan konten'}</button>
          </div>
        </form>
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Daftar konten</h2>
          {loading ? <div className="mt-6"><Spinner /></div> : null}
          {!loading && items.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="Belum ada konten" description="Buat berita atau pengumuman dari formulir di samping." />
            </div>
          ) : null}
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-100 p-4">
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" /> : null}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{item.type}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CmsShell>
  )
}
