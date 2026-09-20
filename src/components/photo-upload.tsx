/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'

export function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function select(file: File | undefined) {
    if (!file) return
    setBusy(true); setError('')
    const body = new FormData(); body.append('file', file)
    const response = await fetch('/api/uploads', { method: 'POST', body })
    const result = await response.json()
    if (!response.ok) setError(result.error ?? 'Foto gagal diunggah.')
    else onChange(result.data.url)
    setBusy(false)
  }
  return <div className="rounded-xl border border-dashed border-slate-300 p-3"><label className="block cursor-pointer"><span className="text-xs font-semibold text-slate-700">Foto (opsional)</span><span className="mt-2 block text-xs text-slate-500">JPG, PNG, WebP · maksimal 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-xs" onChange={event => void select(event.target.files?.[0])} disabled={busy}/></label>{busy ? <p className="mt-2 text-xs text-slate-500">Mengunggah foto...</p> : null}{error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}{value ? <img src={value} alt="Pratinjau foto" className="mt-3 h-24 w-full rounded-lg object-cover" /> : null}</div>
}
