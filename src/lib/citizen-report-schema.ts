import { z } from 'zod'

export const CITIZEN_REPORT_TYPES = ['LAPORAN', 'KELUHAN', 'ASPIRASI', 'BANTUAN'] as const
export const CITIZEN_REPORT_STATUSES = ['TERKIRIM', 'DITINJAU', 'DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'] as const

export const citizenReportSchema = z.object({
  type: z.enum(CITIZEN_REPORT_TYPES),
  title: z.string().trim().min(3, 'Judul laporan wajib diisi.').max(160),
  body: z.string().trim().min(10, 'Isi laporan minimal 10 karakter.').max(2000),
})

export const citizenReportUpdateSchema = citizenReportSchema

export const citizenReportStatusSchema = z.object({
  status: z.enum(CITIZEN_REPORT_STATUSES),
})

export const citizenReportResponseSchema = z.object({
  body: z.string().trim().min(3, 'Tanggapan minimal 3 karakter.').max(2000),
  status: z.enum(CITIZEN_REPORT_STATUSES).optional(),
})

/** Statuses pengurus may move a report to, per DECISIONS-BASELINE §4. */
const MANAGEABLE_STATUSES = ['DITINJAU', 'DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'] as const

/** Allowed forward transitions; a report never returns to TERKIRIM. */
const ALLOWED_TRANSITIONS: Record<(typeof CITIZEN_REPORT_STATUSES)[number], ReadonlyArray<(typeof CITIZEN_REPORT_STATUSES)[number]>> = {
  TERKIRIM: ['DITINJAU', 'DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  DITINJAU: ['DIPROSES', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  DIPROSES: ['DITINJAU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  SELESAI: [],
  TIDAK_DAPAT_DIPROSES: [],
}

export function isManageableStatus(status: (typeof CITIZEN_REPORT_STATUSES)[number]) {
  return (MANAGEABLE_STATUSES as readonly string[]).includes(status)
}

export function canTransitionTo(current: (typeof CITIZEN_REPORT_STATUSES)[number], next: (typeof CITIZEN_REPORT_STATUSES)[number]) {
  return ALLOWED_TRANSITIONS[current].includes(next)
}

/** Pelapor boleh mengedit selama status belum terminal (selesai / tidak dapat diproses). */
export function isEditableByReporter(status: (typeof CITIZEN_REPORT_STATUSES)[number]) {
  return status !== 'SELESAI' && status !== 'TIDAK_DAPAT_DIPROSES'
}
