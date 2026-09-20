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
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Periksa kembali isian login.'); return }
    setLoading(true)
    const result = await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, portal: 'WARGA', redirect: false })
    if (result?.error) { setError('Email atau password salah, atau akun belum aktif.'); setLoading(false); return }
    window.location.assign('/dashboard')
  }

  return <main className="grid min-h-screen lg:grid-cols-2">
    <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#5B4BFF] via-[#4030D7] to-[#151041] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="absolute -right-32 top-20 h-[540px] w-[540px] rounded-full bg-[#8C7FFF]/20 blur-3xl" />
      <Link href="/" className="relative flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[13px] font-extrabold text-[#5B4BFF]">RW</span><span className="text-lg font-bold">Portal Warga</span></Link>
      <div className="relative max-w-[560px]"><p className="text-[11px] font-bold tracking-[1.8px] text-[#BDB8FF]">RW 08 • BERSAMA LEBIH BAIK</p><h1 className="mt-5 text-4xl font-bold leading-[1.1] xl:text-[50px]">Satu portal untuk lingkungan yang lebih dekat.</h1><p className="mt-6 max-w-[500px] text-base leading-[26px] text-[#DDD9FF]">Akses informasi resmi, transparansi keuangan, dan sampaikan aspirasi Anda dengan mudah.</p></div>
      <div className="relative flex flex-wrap gap-6 text-xs font-semibold text-white"><span>◉&nbsp; Akun terverifikasi</span><span>◉&nbsp; Data terlindungi</span><span>◉&nbsp; Akses 24/7</span></div>
    </section>
    <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-12"><div className="w-full max-w-[430px]">
      <div className="mb-8 lg:hidden"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#5B4BFF] text-xs font-extrabold text-white">RW</span><span className="text-lg font-bold text-[#111322]">Portal Warga</span></Link></div>
      <h2 className="text-3xl font-bold text-[#111322] sm:text-[34px]">Selamat datang kembali</h2><p className="mt-3 text-sm leading-[22px] text-[#6F7385]">Masuk menggunakan akun yang telah diverifikasi oleh pengurus RW.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div><label className="mb-2 block text-xs font-bold text-[#111322]" htmlFor="email">Nomor HP / Username</label><div className="flex h-[54px] items-center gap-3 rounded-xl border border-[#E7E8EF] bg-[#F8F8FB] px-4 focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-[#5B4BFF]/10"><span className="text-[#8D91A1]">♙</span><input id="email" name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#111322] outline-none placeholder:text-[#A0A3B0]" placeholder="Masukkan nomor HP atau username" disabled={loading} /></div></div>
        <div><div className="mb-2 flex items-center justify-between"><label className="block text-xs font-bold text-[#111322]" htmlFor="password">Kata sandi</label></div><div className="flex h-[54px] items-center gap-3 rounded-xl border border-[#E7E8EF] bg-[#F8F8FB] px-4 focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-[#5B4BFF]/10"><span className="text-[#8D91A1]">▣</span><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#111322] outline-none placeholder:text-[#A0A3B0]" placeholder="Masukkan kata sandi" disabled={loading} /><button type="button" className="text-xs font-semibold text-[#5B4BFF]" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></div>
        <div className="flex items-center justify-between text-xs text-[#6F7385]"><label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-[#D0D2DD]" /> Ingat saya</label><span className="font-bold text-[#5B4BFF]">Lupa kata sandi?</span></div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="h-[54px] w-full rounded-full bg-[#5B4BFF] text-sm font-bold text-white transition hover:bg-[#4B3EE8] disabled:opacity-60">{loading ? 'Memproses...' : 'Masuk ke portal'}</button>
      </form>
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F3F2FF] p-4 text-xs leading-5 text-[#555A6D]"><span className="text-base text-[#5B4BFF]">ⓘ</span><p>Belum punya akun? <Link href="/register" className="font-bold text-[#5B4BFF]">Daftar melalui portal warga</Link> atau hubungi Admin RW untuk verifikasi.</p></div>
    </div></section>
  </main>
}
