import { describe, expect, it } from 'vitest'
import {
  canTransitionSicknessTo,
  isManageableSicknessStatus,
  isSicknessEditableByReporter,
  sicknessReportResponseSchema,
  sicknessReportSchema,
  sicknessReportStatusSchema,
  toPublicSicknessReport,
} from '@/lib/sickness-report-schema'

describe('sicknessReportSchema', () => {
  it('accepts a valid submission including sensitive fields', () => {
    const result = sicknessReportSchema.safeParse({
      patientName: 'Budi Santoso',
      patientAddress: 'Jl. Mawar 12',
      patientRt: '03',
      assistanceNeed: 'Butuh bantuan makanan selama 3 hari',
      severity: 'SEDANG',
      symptoms: 'Demam tinggi dan batuk berdahak sejak 3 hari',
      medicalNotes: 'Ada riwayat asma',
      contactPhone: '08123456789',
    })
    expect(result.success).toBe(true)
  })

  it('rejects too-short symptoms', () => {
    expect(sicknessReportSchema.safeParse({
      patientName: 'Budi Santoso',
      assistanceNeed: 'Butuh bantuan makanan',
      severity: 'SEDANG',
      symptoms: 'hi',
    }).success).toBe(false)
  })

  it('rejects unknown severity', () => {
    expect(sicknessReportSchema.safeParse({
      patientName: 'Budi Santoso',
      assistanceNeed: 'Butuh bantuan makanan',
      severity: 'KRITIS',
      symptoms: 'Demam tinggi',
    }).success).toBe(false)
  })
})

describe('sicknessReportStatusSchema', () => {
  it('accepts known statuses', () => {
    expect(sicknessReportStatusSchema.safeParse({ status: 'DITINJAU' }).success).toBe(true)
    expect(sicknessReportStatusSchema.safeParse({ status: 'SELESAI' }).success).toBe(true)
  })

  it('rejects unknown statuses', () => {
    expect(sicknessReportStatusSchema.safeParse({ status: 'GHAIB' }).success).toBe(false)
  })
})

describe('sicknessReportResponseSchema', () => {
  it('accepts body only', () => {
    expect(sicknessReportResponseSchema.safeParse({ body: 'Akan kami bantu besok pagi.' }).success).toBe(true)
  })

  it('accepts body and optional status', () => {
    expect(sicknessReportResponseSchema.safeParse({ body: 'Tim RW sudah menyalurkan makanan.', status: 'DIBANTU' }).success).toBe(true)
  })

  it('rejects empty body', () => {
    expect(sicknessReportResponseSchema.safeParse({ body: '   ' }).success).toBe(false)
  })
})

describe('sickness status transitions', () => {
  it('walks the happy path terkirim → ditinjau → dibantu → selesai', () => {
    expect(canTransitionSicknessTo('TERKIRIM', 'DITINJAU')).toBe(true)
    expect(canTransitionSicknessTo('DITINJAU', 'DIBANTU')).toBe(true)
    expect(canTransitionSicknessTo('DIBANTU', 'SELESAI')).toBe(true)
  })

  it('never returns to TERKIRIM', () => {
    expect(canTransitionSicknessTo('DITINJAU', 'TERKIRIM')).toBe(false)
    expect(canTransitionSicknessTo('DIBANTU', 'TERKIRIM')).toBe(false)
  })

  it('blocks transitions out of terminal statuses', () => {
    expect(canTransitionSicknessTo('SELESAI', 'DIBANTU')).toBe(false)
    expect(canTransitionSicknessTo('TIDAK_DAPAT_DIPROSES', 'DITINJAU')).toBe(false)
  })

  it('keeps TERKIRIM out of pengurus management', () => {
    expect(isManageableSicknessStatus('TERKIRIM')).toBe(false)
    expect(isManageableSicknessStatus('DITINJAU')).toBe(true)
    expect(isManageableSicknessStatus('DIBANTU')).toBe(true)
  })

  it('lets reporter edit only before terminal status', () => {
    expect(isSicknessEditableByReporter('TERKIRIM')).toBe(true)
    expect(isSicknessEditableByReporter('DIBANTU')).toBe(true)
    expect(isSicknessEditableByReporter('SELESAI')).toBe(false)
    expect(isSicknessEditableByReporter('TIDAK_DAPAT_DIPROSES')).toBe(false)
  })
})

describe('toPublicSicknessReport', () => {
  it('strips sensitive details from the public shape', () => {
    const row = {
      id: 'r1',
      reporterId: 'u1',
      patientName: 'Budi',
      patientAddress: null,
      patientRt: null,
      assistanceNeed: 'Makanan',
      severity: 'SEDANG' as const,
      status: 'TERKIRIM' as const,
      createdAt: new Date('2026-09-01'),
      updatedAt: new Date('2026-09-02'),
      resolvedAt: null,
    }
    const pub = toPublicSicknessReport(row)
    expect(pub).toEqual(row)
    expect(Object.keys(pub).sort()).toEqual(
      ['assistanceNeed', 'createdAt', 'id', 'patientAddress', 'patientName', 'patientRt', 'reporterId', 'resolvedAt', 'severity', 'status', 'updatedAt'].sort(),
    )
  })
})
