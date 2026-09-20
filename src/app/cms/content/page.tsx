'use client'

import { FormEvent, useEffect, useState } from 'react'

type Content = { id: string; title: string; body: string; type: string; status: string }

export default function CmsContentPage() {
  const [items, setItems] = useState<Content[]>([])
  const [form, setForm] = useState({ title: '', body: '', type: 'BERITA', status: 'DRAFT' })
  const [message, setMessage] = useState('')

  async function load() {
    const response = await fetch('/api/content?scope=manage')
    if (response.ok) setItems((await response.json()).data)
  }
  useEffect(() => { void load() }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setMessage('')
    const response = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const result = await response.json()
    if (!response.ok) { setMessage(result.error ?? 'Konten gagal disimpan.'); return }
    setForm({ title: '', body: '', type: 'BERITA', status: 'DRAFT' })
    setMessage('Konten berhasil disimpan.')
    await load()
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">CMS Pengurus</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Berita & Pengumuman</h1></div>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Buat konten</h2>
            <div className="mt-5 space-y-4">
              <input required placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"><option value="BERITA">Berita</option><option value="PENGUMUMAN">Pengumuman</option></select>
              <textarea required placeholder="Isi konten" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-40 w-full rounded-xl border border-slate-200 p-4 text-sm" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"><option value="DRAFT">Simpan draft</option><option value="PUBLISHED">Publikasikan</option></select>
              {message && <p className="text-sm text-slate-600" role="status">{message}</p>}
              <button className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Simpan konten</button>
            </div>
          </form>
          <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Daftar konten</h2><div className="mt-5 space-y-3">{items.length === 0 && <p className="text-sm text-slate-500">Belum ada konten.</p>}{items.map((item) => <article key={item.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-bold text-slate-900">{item.title}</h3><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{item.status}</span></div><p className="mt-2 text-sm text-slate-500">{item.type}</p></article>)}</div></section>
        </div>
      </section>
    </main>
  )
}
