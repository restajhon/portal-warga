'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type AccountUser = {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | null
  accountType: 'WARGA' | 'PENGURUS'
  status: 'MENUNGGU_VERIFIKASI' | 'AKTIF' | 'NONAKTIF'
  address: string | null
  createdAt: string
  verifiedById: string | null
}

const STATUS_LABELS: Record<string, string> = {
  MENUNGGU_VERIFIKASI: 'Menunggu verifikasi',
  AKTIF: 'Aktif',
  NONAKTIF: 'Nonaktif',
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  OPERASIONAL: 'Operasional',
}

export default function CmsAccountsPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<AccountUser[]>([])
  const [filter, setFilter] = useState<'ALL' | 'MENUNGGU_VERIFIKASI' | 'AKTIF' | 'NONAKTIF'>('ALL')
  const [accountTypeFilter, setAccountTypeFilter] = useState<'ALL' | 'WARGA' | 'PENGURUS'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const role = session?.user?.role
  const canChangeRoles = role === 'SUPER_ADMIN'

  async function load() {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (filter !== 'ALL') params.set('status', filter)
    if (accountTypeFilter !== 'ALL') params.set('accountType', accountTypeFilter)
    const response = await fetch(`/api/admin/accounts?${params.toString()}`)
    if (!response.ok) {
      setError('Gagal memuat daftar akun.')
      setLoading(false)
      return
    }
    setUsers((await response.json()).data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated') void load()
  }, [status, filter, accountTypeFilter])

  async function verify(id: string) {
    setBusy(id)
    setError('')
    setMessage('')
    const response = await fetch(`/api/admin/accounts/${id}/verify`, { method: 'POST' })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Verifikasi gagal.')
      setBusy(null)
      return
    }
    setMessage('Akun berhasil diverifikasi.')
    setBusy(null)
    await load()
  }

  async function setStatus(id: string, next: 'AKTIF' | 'NONAKTIF') {
    setBusy(id)
    setError('')
    setMessage('')
    const response = await fetch(`/api/admin/accounts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Perubahan status gagal.')
      setBusy(null)
      return
    }
    setMessage(next === 'AKTIF' ? 'Akun diaktifkan.' : 'Akun dinonaktifkan.')
    setBusy(null)
    await load()
  }

  async function changeRole(id: string, next: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL') {
    setBusy(id)
    setError('')
    setMessage('')
    const response = await fetch(`/api/admin/accounts/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: next }),
    })
    const result = await response.json()
    if (!response.ok) {
      setError(result.error ?? 'Perubahan role gagal.')
      setBusy(null)
      return
    }
    setMessage('Role pengurus diperbarui.')
    setBusy(null)
    await load()
  }

  const summary = useMemo(() => {
    return {
      total: users.length,
      pending: users.filter((u) => u.status === 'MENUNGGU_VERIFIKASI').length,
    }
  }, [users])
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => [user.name, user.email, user.phone, user.address].filter(Boolean).some((value) => value!.toLowerCase().includes(query)))
  }, [users, search])

  return (
    <CmsShell session={session ?? null} active="/cms/accounts" title="Manajemen akun warga" subtitle="Buat, verifikasi, dan kelola akses warga serta pengurus RW.">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total akun" value={summary.total} />
        <Stat label="Akun aktif" value={users.filter((user) => user.status === 'AKTIF').length} />
        <Stat label="Menunggu verifikasi" value={summary.pending} />
        <Stat label="Akun nonaktif" value={users.filter((user) => user.status === 'NONAKTIF').length} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, nomor HP, NIK, atau alamat..." className="h-11 min-w-[280px] flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none" />
        <label className="text-sm font-semibold text-slate-600">Status</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
          <option value="MENUNGGU_VERIFIKASI">Menunggu verifikasi</option>
          <option value="AKTIF">Aktif</option>
          <option value="NONAKTIF">Nonaktif</option>
          <option value="ALL">Semua</option>
        </select>
        <label className="ml-4 text-sm font-semibold text-slate-600">Tipe akun</label>
        <select value={accountTypeFilter} onChange={(e) => setAccountTypeFilter(e.target.value as typeof accountTypeFilter)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
          <option value="ALL">Semua</option>
          <option value="WARGA">Warga</option>
          <option value="PENGURUS">Pengurus</option>
        </select>
      </div>

      {error ? <div className="mb-4"><ErrorBanner message={error} /></div> : null}
      {message ? <p className="mb-4 text-sm text-emerald-700" role="status">{message}</p> : null}

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        {loading ? <Spinner /> : null}
        {!loading && visibleUsers.length === 0 ? <EmptyState title="Tidak ada akun" description="Belum ada akun pada filter saat ini." /> : null}
        <div className="space-y-3">
          {visibleUsers.map((u) => (
            <article key={u.id} className="rounded-2xl border border-slate-100 p-4 transition hover:border-[#C9C4FF] hover:bg-[#FCFBFF]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link href={`/cms/accounts/${u.id}`} className="text-base font-bold text-slate-900 hover:text-[#5B4BFF]">{u.name}</Link>
                  <p className="text-sm text-slate-500">{u.email ?? 'Tanpa email'} {u.phone ? `· ${u.phone}` : ''}</p>
                  <p className="mt-1 text-xs text-slate-400">{u.address || 'Alamat belum diisi'}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{u.accountType} · {STATUS_LABELS[u.status]}</span>
                  {u.role ? <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#5b4bff]">{ROLE_LABELS[u.role]}</span> : null}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/cms/accounts/${u.id}`} className="rounded-full border border-[#D9D5FF] px-4 py-1.5 text-xs font-semibold text-[#5B4BFF]">Lihat detail</Link>
                {u.status === 'MENUNGGU_VERIFIKASI' ? (
                  <button disabled={busy === u.id} onClick={() => verify(u.id)} className="rounded-full bg-[#5b4bff] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{busy === u.id ? 'Memproses...' : 'Verifikasi'}</button>
                ) : null}
                {u.status === 'AKTIF' && u.accountType === 'WARGA' ? (
                  <button disabled={busy === u.id} onClick={() => setStatus(u.id, 'NONAKTIF')} className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60">Nonaktifkan</button>
                ) : null}
                {u.status === 'NONAKTIF' ? (
                  <button disabled={busy === u.id} onClick={() => setStatus(u.id, 'AKTIF')} className="rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-60">Aktifkan</button>
                ) : null}
                {canChangeRoles && u.accountType === 'PENGURUS' ? (
                  <select value={u.role ?? ''} disabled={busy === u.id} onChange={(e) => changeRole(u.id, e.target.value as 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL')} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
                    {(['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'] as const).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </CmsShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
