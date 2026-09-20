import { describe, expect, it } from 'vitest'
import { accountStatusSchema, canChangeRole, canManageAccount, roleChangeSchema } from '@/lib/account-schema'

describe('accountStatusSchema', () => {
  it('accepts all known statuses', () => {
    for (const status of ['MENUNGGU_VERIFIKASI', 'AKTIF', 'NONAKTIF']) {
      expect(accountStatusSchema.safeParse({ status }).success).toBe(true)
    }
  })

  it('accepts an optional reason', () => {
    expect(accountStatusSchema.safeParse({ status: 'NONAKTIF', reason: 'Permintaan warga' }).success).toBe(true)
  })

  it('rejects unknown status', () => {
    expect(accountStatusSchema.safeParse({ status: 'BANNED' }).success).toBe(false)
  })
})

describe('roleChangeSchema', () => {
  it('accepts a pengurus role', () => {
    expect(roleChangeSchema.safeParse({ role: 'ADMIN' }).success).toBe(true)
  })

  it('rejects WARGA role', () => {
    expect(roleChangeSchema.safeParse({ role: 'WARGA' }).success).toBe(false)
  })
})

describe('canManageAccount', () => {
  const admin = { role: 'ADMIN' as const, accountType: 'PENGURUS' as const }
  const superAdmin = { role: 'SUPER_ADMIN' as const, accountType: 'PENGURUS' as const }
  const operasional = { role: 'OPERASIONAL' as const, accountType: 'PENGURUS' as const }
  const warga = { role: null, accountType: 'WARGA' as const }
  const pengurusOperasional = { role: 'OPERASIONAL' as const, accountType: 'PENGURUS' as const }

  it('lets Super Admin manage anyone', () => {
    expect(canManageAccount(superAdmin, warga)).toBe(true)
    expect(canManageAccount(superAdmin, pengurusOperasional)).toBe(true)
    expect(canManageAccount(superAdmin, { role: 'ADMIN', accountType: 'PENGURUS' })).toBe(true)
  })

  it('lets Admin manage warga and operasional only', () => {
    expect(canManageAccount(admin, warga)).toBe(true)
    expect(canManageAccount(admin, pengurusOperasional)).toBe(true)
    expect(canManageAccount(admin, { role: 'ADMIN', accountType: 'PENGURUS' })).toBe(false)
    expect(canManageAccount(admin, superAdmin)).toBe(false)
  })

  it('blocks operasional entirely', () => {
    expect(canManageAccount(operasional, warga)).toBe(false)
  })
})

describe('canChangeRole', () => {
  it('only allows Super Admin to change pengurus roles', () => {
    const pengurus = { accountType: 'PENGURUS' as const }
    expect(canChangeRole({ role: 'SUPER_ADMIN' }, pengurus)).toBe(true)
    expect(canChangeRole({ role: 'ADMIN' }, pengurus)).toBe(false)
    expect(canChangeRole({ role: 'OPERASIONAL' }, pengurus)).toBe(false)
  })

  it('does not apply to warga accounts', () => {
    expect(canChangeRole({ role: 'SUPER_ADMIN' }, { accountType: 'WARGA' })).toBe(false)
  })
})
