'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { PhotoUpload } from '@/components/photo-upload'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Update = { id: string; title: string; body: string; status: string; createdAt: string; imageUrl?: string | null }

export default function CmsProgramUpdatesPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Update[]>([])
  const [form, setForm] = useState({ title: '', body: '', status: 'DRAFT', imageUrl: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)

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
    setForm({ title: '', body: '', status: 'DRAFT', imageUrl: '' })
    setMessage('Update program berhasil disimpan.')
    setBusy(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/program-updates" title="Program & Kegiatan" subtitle="Sampaikan perkembangan program RW untuk warga." actions={<button onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5B4BFF] px-5 text-xs font-bold text-white">＋ Tambah program</button>}>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{[['Total program', items.length], ['Terbit', items.filter(item => item.status === 'PUBLISHED').length], ['Draft', items.filter(item => item.status === 'DRAFT').length]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white p-5"><p className="text-xs text-[#6F7385]">{label}</p><p className="mt-3 text-2xl font-bold text-[#5B4BFF]">{value}</p></div>)}</div>
      {open ? <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Tulis update program</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <textarea required placeholder="Ceritakan perkembangan program..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-32 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <PhotoUpload value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
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
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" /> : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{item.status}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div> : null}
      {!open ? <section className="space-y-3">{items.map(item => <article key={item.id} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFEDFF] text-2xl text-[#5B4BFF]">♧</div>}<div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[1px] text-[#8D91A1]">Perkembangan · Program RW</p><h2 className="mt-1 text-sm font-bold">{item.title}</h2><p className="mt-1 line-clamp-1 text-xs text-[#6F7385]">{item.body}</p></div><span className="rounded-full bg-[#E8F8F0] px-3 py-2 text-[10px] font-bold text-[#16875A]">{item.status === 'PUBLISHED' ? 'Terbit' : 'Draft'}</span><span className="text-xl text-[#8D91A1]">⋮</span></article>)}</section> : null}
    </CmsShell>
  )
}
