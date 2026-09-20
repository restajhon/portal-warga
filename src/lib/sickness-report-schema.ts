import { z } from 'zod'

export const SICKNESS_SEVERITIES = ['RINGAN', 'SEDANG', 'BERAT'] as const
export const SICKNESS_STATUSES = ['TERKIRIM', 'DITINJAU', 'DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'] as const

const MAX_FIELD = 2000

export const sicknessReportSchema = z.object({
  patientName: z.string().trim().min(2, 'Nama pasien wajib diisi.').max(120),
  patientAddress: z.string().trim().max(200).optional().or(z.literal('')),
  patientRt: z.string().trim().max(20).optional().or(z.literal('')),
  assistanceNeed: z.string().trim().min(5, 'Jelaskan kebutuhan bantuan.').max(500),
  severity: z.enum(SICKNESS_SEVERITIES),
  /** Sensitive fields (symptoms, medical notes, contact phone) — submitted with report. */
  symptoms: z.string().trim().min(5, 'Jelaskan gejala yang dialami.').max(MAX_FIELD),
  medicalNotes: z.string().trim().max(MAX_FIELD).optional().or(z.literal('')),
  contactPhone: z.string().trim().max(40).optional().or(z.literal('')),
})

export const sicknessReportUpdateSchema = sicknessReportSchema

export const sicknessReportStatusSchema = z.object({
  status: z.enum(SICKNESS_STATUSES),
})

export const sicknessReportResponseSchema = z.object({
  body: z.string().trim().min(3, 'Tanggapan minimal 3 karakter.').max(MAX_FIELD),
  status: z.enum(SICKNESS_STATUSES).optional(),
})

/** Statuses pengurus may move a sickness report to. */
const MANAGEABLE_SICKNESS_STATUSES = ['DITINJAU', 'DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'] as const

/** Allowed transitions for sickness reports — never back to TERKIRIM, terminal statuses are final. */
const SICKNESS_TRANSITIONS: Record<(typeof SICKNESS_STATUSES)[number], ReadonlyArray<(typeof SICKNESS_STATUSES)[number]>> = {
  TERKIRIM: ['DITINJAU', 'DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  DITINJAU: ['DIBANTU', 'SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  DIBANTU: ['SELESAI', 'TIDAK_DAPAT_DIPROSES'],
  SELESAI: [],
  TIDAK_DAPAT_DIPROSES: [],
}

export function isManageableSicknessStatus(status: (typeof SICKNESS_STATUSES)[number]) {
  return (MANAGEABLE_SICKNESS_STATUSES as readonly string[]).includes(status)
}

export function canTransitionSicknessTo(current: (typeof SICKNESS_STATUSES)[number], next: (typeof SICKNESS_STATUSES)[number]) {
  return SICKNESS_TRANSITIONS[current].includes(next)
}

/** Reporter may edit only while status is not terminal. */
export function isSicknessEditableByReporter(status: (typeof SICKNESS_STATUSES)[number]) {
  return status !== 'SELESAI' && status !== 'TIDAK_DAPAT_DIPROSES'
}

/** Publicly safe shape returned to warga list views — sensitive fields stripped. */
export type PublicSicknessReport = {
  id: string
  reporterId: string
  patientName: string
  patientAddress: string | null
  patientRt: string | null
  assistanceNeed: string
  severity: (typeof SICKNESS_SEVERITIES)[number]
  status: (typeof SICKNESS_STATUSES)[number]
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
}

export function toPublicSicknessReport<T extends PublicSicknessReport>(row: T): PublicSicknessReport {
  return {
    id: row.id,
    reporterId: row.reporterId,
    patientName: row.patientName,
    patientAddress: row.patientAddress,
    patientRt: row.patientRt,
    assistanceNeed: row.assistanceNeed,
    severity: row.severity,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    resolvedAt: row.resolvedAt,
  }
}
