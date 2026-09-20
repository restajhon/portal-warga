'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { PhotoUpload } from '@/components/photo-upload'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Agenda = { id: string; title: string; description: string; location?: string | null; startsAt: string; status: string; imageUrl?: string | null }

export default function CmsAgendaPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Agenda[]>([])
  const [form, setForm] = useState({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT', imageUrl: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

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
    setForm({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT', imageUrl: '' })
    setMessage('Agenda berhasil disimpan.')
    setSubmitting(false)
    await load()
  }

  return (
    <CmsShell session={session ?? null} active="/cms/agenda" title="Kelola agenda kegiatan" subtitle="Buat jadwal, atur pengingat, dan pantau partisipasi warga." actions={<button onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5B4BFF] px-5 text-xs font-bold text-white">＋ Tambah agenda</button>}>
      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_330px]"><section className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h2><span className="text-xs font-semibold text-[#5B4BFF]">Hari ini ↑</span></div><div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] text-[#8D91A1]">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(day => <span key={day}>{day}</span>)}{Array.from({ length: 35 }, (_, index) => { const day = (index % 30) + 1; const marked = items.some(item => new Date(item.startsAt).getDate() === day); return <div key={index} className={`min-h-16 rounded-xl p-2 text-left ${marked ? 'bg-[#EFEDFF] text-[#5B4BFF]' : 'bg-[#FAFAFC]'}`}><span>{day}</span>{marked ? <div className="mt-5 h-1 rounded-full bg-[#5B4BFF]" /> : null}</div> })}</div></section><section className="space-y-3"><h2 className="text-lg font-bold">Agenda mendatang</h2>{items.slice(0, 4).map(item => <article key={item.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"><div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#5B4BFF] text-white"><strong>{new Date(item.startsAt).getDate()}</strong><span className="text-[9px] uppercase">{new Date(item.startsAt).toLocaleDateString('id-ID', { month: 'short' })}</span></div><div className="min-w-0"><h3 className="truncate text-sm font-bold">{item.title}</h3><p className="mt-1 text-[10px] text-[#8D91A1]">{new Date(item.startsAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} · {item.location || 'Balai RW'}</p><p className="mt-1 text-[10px] font-semibold text-[#5B4BFF]">{item.status === 'PUBLISHED' ? 'Terbit' : 'Draft'}</p></div></article>)}</section></div>
      {open ? <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-transparent"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-semibold text-[#5B4BFF]">Agenda / Buat baru</p><h2 className="mt-2 text-3xl font-bold">Buat agenda baru</h2></div><div className="flex gap-2"><button type="button" onClick={() => setOpen(false)} className="h-10 rounded-full border border-[#E7E8EF] bg-white px-4 text-xs font-bold">Simpan draft</button><button className="h-10 rounded-full bg-[#5B4BFF] px-5 text-xs font-bold text-white">Publikasikan</button></div></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Detail agenda</h2>
          <div className="mt-5 space-y-4">
            <input required placeholder="Judul agenda" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <textarea required placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 p-4 text-sm" />
            <input placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
            <PhotoUpload value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm">
              <option value="DRAFT">Simpan draft</option>
              <option value="PUBLISHED">Publikasikan</option>
            </select>
            {error ? <ErrorBanner message={error} /> : null}
            {message ? <p className="text-sm text-emerald-700" role="status">{message}</p> : null}
            <button disabled={submitting} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Menyimpan...' : 'Simpan agenda'}</button>
          </div>
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
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" /> : null}
                <div className="flex justify-between gap-3">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="text-xs font-semibold">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{new Date(item.startsAt).toLocaleString('id-ID')} · {item.location || 'Lokasi belum ditentukan'}</p>
              </article>
            ))}
          </div>
        </section>
      </div> : null}
    </CmsShell>
  )
}
