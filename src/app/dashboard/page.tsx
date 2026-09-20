import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  const isPengurus = session.user.accountType === 'PENGURUS'
  return (
    <main className="min-h-screen bg-[#f7f7fb] px-5 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4bff]">Portal Warga</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{isPengurus ? 'CMS Pengurus RW' : 'Dashboard Warga'}</h1>
        <p className="mt-3 text-slate-600">Selamat datang, {session.user.name ?? session.user.email}.</p>
        <div className="mt-8 rounded-2xl bg-[#f7f7fb] p-5 text-sm text-slate-600">
          <p>Account type: <strong>{session.user.accountType ?? 'UNKNOWN'}</strong></p>
          {session.user.role && <p className="mt-1">Role: <strong>{session.user.role}</strong></p>}
        </div>
      </section>
    </main>
  )
}
