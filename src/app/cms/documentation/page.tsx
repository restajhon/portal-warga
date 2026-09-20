'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { PhotoUpload } from '@/components/photo-upload'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Doc = { id: string; title: string; description?: string | null; mediaUrl: string; status: string; createdAt: string }

export default function CmsDocumentationPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Doc[]>([])
  const [form, setForm] = useState({ title: '', description: '', mediaUrl: '', status: 'DRAFT' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/documentation?scope=manage')
    if (!response.ok) {
      setError('Gagal memuat dokumentasi.')
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
    const response = await fetch('/api/documentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, description: form.description || undefined }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Gagal menyimpan dokumentasi.')
      setBusy(false)
      return
    }
    setForm({ title: '', description: '', mediaUrl: '', status: 'DRAFT' })
    setMessage('Dokumentasi berhasil disimpan.')
    setBusy(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/documentation" title="Dokumentasi & galeri" subtitle="Kelola album, foto kegiatan, dan visibilitas dokumentasi." actions={<button onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5B4BFF] px-5 text-xs font-bold text-white">＋ Buat album</button>}>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Total album', items.length], ['Total foto', items.length], ['Draft album', items.filter(item => item.status === 'DRAFT').length], ['Storage', 'Lokal']].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white p-5"><p className="text-xs text-[#6F7385]">{label}</p><p className="mt-3 text-2xl font-bold text-[#5B4BFF]">{value}</p></div>)}</div>
      {open ? <div className="grid gap-6 lg:grid-cols-[380px_1fr]"> 
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Tambah dokumentasi</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <textarea placeholder="Deskripsi (opsional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <PhotoUpload value={form.mediaUrl} onChange={(mediaUrl) => setForm({ ...form, mediaUrl })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="DRAFT">Simpan draft</option>
              <option value="PUBLISHED">Publikasikan</option>
            </select>
            {error ? <ErrorBanner message={error} /> : null}
            {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
            <button disabled={busy} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{busy ? 'Menyimpan...' : 'Simpan dokumentasi'}</button>
          </div>
        </form>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Daftar dokumentasi</h2>
          {loading ? <div className="mt-6"><Spinner /></div> : null}
          {!loading && items.length === 0 ? (
            <div className="mt-5"><EmptyState title="Belum ada dokumentasi" description="Tambah dokumentasi dari formulir di samping." /></div>
          ) : null}
          <div className="mt-5 space-y-3">
            {items.map((doc) => (
              <article key={doc.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{doc.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{doc.status}</span>
                </div>
                <img src={doc.mediaUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" />
                {doc.description ? <p className="mt-2 text-sm text-slate-600">{doc.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </div> : null}
      {!open ? <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(doc => <article key={doc.id} className="overflow-hidden rounded-3xl bg-white p-3 shadow-sm"><img src={doc.mediaUrl} alt="" className="h-36 w-full rounded-2xl object-cover" /><div className="p-3"><h2 className="text-sm font-bold">{doc.title}</h2><p className="mt-2 text-xs text-[#8D91A1]">{doc.status === 'PUBLISHED' ? 'Terbit' : 'Draft'}</p><button onClick={() => setOpen(true)} className="mt-3 w-full rounded-full bg-[#F5F6FA] py-2 text-xs font-semibold text-[#5B4BFF]">Kelola foto</button></div></article>)}</section> : null}
    </CmsShell>
  )
}
