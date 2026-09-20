'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { loginSchema } from '@/lib/auth/login-schema'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Periksa kembali isian login.')
      return
    }

    setLoading(true)
    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      portal: 'WARGA',
      redirect: false,
    })

    if (result?.error) {
      setError('Email atau password salah, atau akun belum aktif.')
      setLoading(false)
      return
    }

    window.location.assign('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_20px_70px_rgba(34,29,79,0.12)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b4bff] text-xl font-bold text-white">
            RW
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Masuk ke Portal RW</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Informasi dan layanan warga terverifikasi.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-[#5b4bff] focus:ring-4 focus:ring-[#5b4bff]/10"
              placeholder="nama@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
              <button type="button" className="text-xs font-semibold text-[#5b4bff]" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-[#5b4bff] focus:ring-4 focus:ring-[#5b4bff]/10"
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4bff] text-sm font-bold text-white transition hover:bg-[#4b3ee8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-7 space-y-2 text-center text-sm text-slate-500">
          <p>Belum punya akun? <Link className="font-semibold text-[#5b4bff] hover:underline" href="/register">Daftar</Link></p>
          <p>Lupa password? Hubungi pengurus RW.</p>
        </div>
      </section>
    </main>
  )
}
