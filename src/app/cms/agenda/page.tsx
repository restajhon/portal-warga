'use client'

import { FormEvent, useEffect, useState } from 'react'

type Agenda = { id: string; title: string; description: string; location?: string | null; startsAt: string; status: string }

export default function CmsAgendaPage() {
  const [items, setItems] = useState<Agenda[]>([])
  const [form, setForm] = useState({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT' })
  const [message, setMessage] = useState('')
  async function load() { const response = await fetch('/api/agenda?scope=manage'); if (response.ok) setItems((await response.json()).data) }
  useEffect(() => { void load() }, [])
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage('')
    const response = await fetch('/api/agenda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, startsAt: new Date(form.startsAt).toISOString() }) })
    const result = await response.json(); if (!response.ok) { setMessage(result.error ?? 'Agenda gagal disimpan.'); return }
    setForm({ title: '', description: '', location: '', startsAt: '', status: 'DRAFT' }); setMessage('Agenda berhasil disimpan.'); await load()
  }
  return <main className="min-h-screen bg-[#f7f7fb] px-5 py-10"><section className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">CMS Pengurus</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Agenda & Kegiatan</h1><div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]"><form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Buat agenda</h2><div className="mt-5 space-y-4"><input required placeholder="Judul agenda" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" /><textarea required placeholder="Deskripsi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 p-4 text-sm" /><input placeholder="Lokasi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" /><input required type="datetime-local" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm" /><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"><option value="DRAFT">Simpan draft</option><option value="PUBLISHED">Publikasikan</option></select>{message && <p className="text-sm text-slate-600">{message}</p>}<button className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Simpan agenda</button></div></form><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Daftar agenda</h2><div className="mt-5 space-y-3">{items.length === 0 && <p className="text-sm text-slate-500">Belum ada agenda.</p>}{items.map(item => <article key={item.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex justify-between gap-3"><h3 className="font-bold">{item.title}</h3><span className="text-xs font-semibold">{item.status}</span></div><p className="mt-2 text-sm text-slate-500">{new Date(item.startsAt).toLocaleString('id-ID')} · {item.location || 'Lokasi belum ditentukan'}</p></article>)}</div></section></div></section></main>
}
