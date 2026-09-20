'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CmsShell } from '@/components/cms-shell'
import { EmptyState, ErrorBanner, Spinner } from '@/components/feedback'

export const dynamic = 'force-dynamic'

type Log = {
  id: string
  action: string
  entityType: string
  entityId: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  actor: { id: string; name: string; email: string; role: string | null } | null
}

export default function CmsAuditLogsPage() {
  const { data: session, status } = useSession()
  const [logs, setLogs] = useState<Log[]>([])
  const [action, setAction] = useState('')
  const [entityType, setEntityType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (action) params.set('action', action)
    if (entityType) params.set('entityType', entityType)
    params.set('limit', '100')
    const response = await fetch(`/api/admin/audit-logs?${params.toString()}`)
    if (!response.ok) {
      setError('Gagal memuat audit log. Pastikan Anda memiliki akses Super Admin.')
      setLoading(false)
      return
    }
    setLogs((await response.json()).data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated') void load()
  }, [status, action, entityType])

  return (
    <CmsShell session={session ?? null} active="/cms/audit-logs" title="Audit Log" subtitle="Riwayat aktivitas sensitif. Hanya Super Admin yang dapat melihat halaman ini.">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input placeholder="Filter action (mis. ACCOUNT_VERIFIED)" value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm" />
        <input placeholder="Filter entity type (mis. USER)" value={entityType} onChange={(e) => setEntityType(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm" />
        <button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Refresh</button>
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        {loading ? <Spinner /> : null}
        {!loading && logs.length === 0 ? <EmptyState title="Belum ada log" description="Tidak ada aktivitas tercatat untuk filter saat ini." /> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Waktu</th>
                <th className="py-2 pr-3">Aktor</th>
                <th className="py-2 pr-3">Aksi</th>
                <th className="py-2 pr-3">Entitas</th>
                <th className="py-2 pr-3">Detail</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                  <td className="py-2 pr-3">{log.actor ? `${log.actor.name} (${log.actor.role ?? '-'})` : 'Sistem'}</td>
                  <td className="py-2 pr-3 font-semibold text-slate-800">{log.action}</td>
                  <td className="py-2 pr-3 text-slate-600">{log.entityType}{log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ''}</td>
                  <td className="py-2 pr-3 text-xs text-slate-500">{log.metadata ? JSON.stringify(log.metadata) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </CmsShell>
  )
}
