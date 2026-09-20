import { describe, expect, it } from 'vitest'
import { buildAuditLogFilter } from '@/lib/audit'

describe('buildAuditLogFilter', () => {
  it('returns an empty filter when no parameters are provided', () => {
    expect(buildAuditLogFilter({})).toEqual({})
  })

  it('adds the action filter when supplied', () => {
    expect(buildAuditLogFilter({ action: 'ACCOUNT_VERIFIED' })).toEqual({ action: 'ACCOUNT_VERIFIED' })
  })

  it('combines entity type and actor filters', () => {
    expect(buildAuditLogFilter({ entityType: 'USER', actorId: 'u-1' })).toEqual({
      entityType: 'USER',
      actorId: 'u-1',
    })
  })

  it('translates date range into createdAt bounds', () => {
    const from = new Date('2026-09-01T00:00:00.000Z')
    const to = new Date('2026-09-30T23:59:59.000Z')
    const filter = buildAuditLogFilter({ from, to })
    expect(filter.createdAt).toEqual({ gte: from, lte: to })
  })

  it('handles a single-sided date range', () => {
    const from = new Date('2026-09-01T00:00:00.000Z')
    const to = new Date('2026-09-30T23:59:59.999Z')
    expect(buildAuditLogFilter({ from }).createdAt).toEqual({ gte: from })
    expect(buildAuditLogFilter({ to }).createdAt).toEqual({ lte: to })
  })
})
