import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
      {message}
    </p>
  )
}

export function InfoBanner({ message }: { message: string }) {
  return (
    <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700">
      {message}
    </p>
  )
}

export function Spinner({ label = 'Memuat...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500" role="status">
      <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#5b4bff]" />
      <span>{label}</span>
    </div>
  )
}
