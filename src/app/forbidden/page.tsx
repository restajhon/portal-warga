import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Akses ditolak</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Kamu tidak memiliki permission untuk mengakses halaman ini.</p>
        <Link href="/dashboard" className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4bff] text-sm font-bold text-white">Kembali ke dashboard</Link>
      </section>
    </main>
  )
}
