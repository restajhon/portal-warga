'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { loginSchema } from '@/lib/auth/login-schema'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Periksa isian login.'); return }
    setLoading(true)
    const result = await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, portal: 'ADMIN', redirect: false })
    if (result?.error) { setError('Akun pengurus tidak ditemukan, belum aktif, atau tidak memiliki akses.'); setLoading(false); return }
    window.location.assign('/cms/content')
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Pengurus</p><h1 className="mt-3 text-2xl font-bold text-slate-900">Masuk ke CMS RW</h1><p className="mt-2 text-sm leading-6 text-slate-500">Area ini khusus Super Admin, Admin, dan Operasional.</p><form onSubmit={submit} className="mt-7 space-y-5"><div><label className="mb-2 block text-sm font-semibold" htmlFor="admin-email">Email pengurus</label><input id="admin-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 w-full rounded-xl border px-4 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold" htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 w-full rounded-xl border px-4 text-sm" /></div>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}<button disabled={loading} className="h-12 w-full rounded-xl bg-[#5b4bff] text-sm font-bold text-white disabled:opacity-60">{loading ? 'Memproses...' : 'Masuk ke CMS'}</button></form><p className="mt-6 text-center text-sm text-slate-500">Warga? Gunakan <Link className="font-semibold text-[#5b4bff]" href="/">Portal Warga</Link>.</p></section></main>
}
