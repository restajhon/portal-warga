import { describe, expect, it } from 'vitest'
import {
  canTransitionTo,
  citizenReportResponseSchema,
  citizenReportSchema,
  isEditableByReporter,
  isManageableStatus,
} from '@/lib/citizen-report-schema'

describe('citizenReportSchema', () => {
  it('accepts a valid report submission', () => {
    expect(citizenReportSchema.safeParse({ type: 'KELUHAN', title: 'Lampu jalan mati', body: 'Lampu jalan di RT 03 mati sejak minggu lalu.' }).success).toBe(true)
  })

  it('rejects an unknown report type', () => {
    expect(citizenReportSchema.safeParse({ type: 'SARAN', title: 'Lampu jalan mati', body: 'Lampu jalan di RT 03 mati sejak minggu lalu.' }).success).toBe(false)
  })

  it('rejects a body that is too short', () => {
    expect(citizenReportSchema.safeParse({ type: 'LAPORAN', title: 'Lampu jalan mati', body: 'pendek' }).success).toBe(false)
  })
})

describe('citizenReportResponseSchema', () => {
  it('accepts a response with an optional status', () => {
    expect(citizenReportResponseSchema.safeParse({ body: 'Terima kasih, akan segera ditindaklanjuti.', status: 'DIPROSES' }).success).toBe(true)
  })

  it('accepts a response without a status change', () => {
    expect(citizenReportResponseSchema.safeParse({ body: 'Terima kasih atas laporannya.' }).success).toBe(true)
  })

  it('rejects an empty response body', () => {
    expect(citizenReportResponseSchema.safeParse({ body: '  ' }).success).toBe(false)
  })
})

describe('citizen report status rules', () => {
  it('walks the happy path terkirim → ditinjau → diproses → selesai', () => {
    expect(canTransitionTo('TERKIRIM', 'DITINJAU')).toBe(true)
    expect(canTransitionTo('DITINJAU', 'DIPROSES')).toBe(true)
    expect(canTransitionTo('DIPROSES', 'SELESAI')).toBe(true)
  })

  it('never returns to terkirim once triaged', () => {
    expect(canTransitionTo('DITINJAU', 'TERKIRIM')).toBe(false)
    expect(canTransitionTo('DIPROSES', 'TERKIRIM')).toBe(false)
  })

  it('blocks transitions out of terminal statuses', () => {
    expect(canTransitionTo('SELESAI', 'DITINJAU')).toBe(false)
    expect(canTransitionTo('SELESAI', 'DIPROSES')).toBe(false)
    expect(canTransitionTo('TIDAK_DAPAT_DIPROSES', 'DIPROSES')).toBe(false)
  })

  it('only lets pengurus manage non-terkirim target statuses', () => {
    expect(isManageableStatus('TERKIRIM')).toBe(false)
    expect(isManageableStatus('DITINJAU')).toBe(true)
    expect(isManageableStatus('TIDAK_DAPAT_DIPROSES')).toBe(true)
  })

  it('lets the reporter edit only before a terminal status', () => {
    expect(isEditableByReporter('TERKIRIM')).toBe(true)
    expect(isEditableByReporter('DIPROSES')).toBe(true)
    expect(isEditableByReporter('SELESAI')).toBe(false)
    expect(isEditableByReporter('TIDAK_DAPAT_DIPROSES')).toBe(false)
  })
})
