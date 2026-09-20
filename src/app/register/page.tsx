'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { registerSchema } from '@/lib/auth/register-schema'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Periksa kembali isian registrasi.')
      return
    }

    setLoading(true)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const result = await response.json()
    setLoading(false)
    if (!response.ok) {
      setError(result.error ?? 'Registrasi gagal. Coba lagi nanti.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 py-10">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_20px_70px_rgba(34,29,79,0.12)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
          <h1 className="text-2xl font-bold text-slate-900">Akun berhasil dibuat</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Silakan login menggunakan email dan password yang kamu daftarkan.</p>
          <Link href="/" className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Ke halaman login</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_20px_70px_rgba(34,29,79,0.12)] sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Buat Akun Warga</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Daftarkan email dan password untuk masuk ke portal.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {(['name', 'email', 'password', 'confirmPassword'] as const).map((field) => (
            <div key={field}>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={field}>
                {field === 'name' ? 'Nama lengkap' : field === 'email' ? 'Email' : field === 'password' ? 'Password' : 'Konfirmasi password'}
              </label>
              <input id={field} name={field} type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-[#5b4bff] focus:ring-4 focus:ring-[#5b4bff]/10" disabled={loading} />
            </div>
          ))}
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4bff] text-sm font-bold text-white transition hover:bg-[#4b3ee8] disabled:opacity-60">{loading ? 'Mendaftarkan...' : 'Daftar'}</button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/" className="font-semibold text-[#5b4bff] hover:underline">Masuk</Link></p>
      </section>
    </main>
  )
}
