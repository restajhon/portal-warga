import type { Session } from 'next-auth'
import { describe, expect, it } from 'vitest'
import { getPermissionsForRole, hasPermission } from '@/lib/auth/permissions'

function session(role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | undefined, accountType: 'WARGA' | 'PENGURUS'): Session {
  return {
    user: {
      id: 'u1',
      role,
      accountType,
      status: 'AKTIF',
      name: 'Tester',
      email: 'tester@example.com',
    },
    expires: '2099-01-01T00:00:00.000Z',
  }
}

describe('hasPermission', () => {
  it('grants Super Admin every permission', () => {
    expect(hasPermission(session('SUPER_ADMIN', 'PENGURUS'), 'account:manage')).toBe(true)
    expect(hasPermission(session('SUPER_ADMIN', 'PENGURUS'), 'finance:approve')).toBe(true)
    expect(hasPermission(session('SUPER_ADMIN', 'PENGURUS'), 'audit:read')).toBe(true)
    expect(hasPermission(session('SUPER_ADMIN', 'PENGURUS'), 'health:read')).toBe(true)
  })

  it('grants Admin account/content/report/health but not finance:approve or audit', () => {
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'account:manage')).toBe(true)
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'content:manage')).toBe(true)
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'report:manage')).toBe(true)
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'health:read')).toBe(true)
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'finance:approve')).toBe(false)
    expect(hasPermission(session('ADMIN', 'PENGURUS'), 'audit:read')).toBe(false)
  })

  it('lets Operasional only manage content/finance/report — no health, no approve', () => {
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'content:manage')).toBe(true)
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'finance:write')).toBe(true)
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'report:manage')).toBe(true)
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'health:read')).toBe(false)
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'finance:approve')).toBe(false)
    expect(hasPermission(session('OPERASIONAL', 'PENGURUS'), 'audit:read')).toBe(false)
  })

  it('denies Warga all CMS-level permissions', () => {
    expect(hasPermission(session(undefined, 'WARGA'), 'account:manage')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'content:manage')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'finance:write')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'finance:approve')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'report:manage')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'health:read')).toBe(false)
    expect(hasPermission(session(undefined, 'WARGA'), 'audit:read')).toBe(false)
  })

  it('returns false without a session', () => {
    expect(hasPermission(null, 'content:manage')).toBe(false)
  })
})

describe('getPermissionsForRole', () => {
  it('returns the expected permission set per role', () => {
    expect(getPermissionsForRole('SUPER_ADMIN').sort()).toEqual(
      ['account:manage', 'audit:read', 'content:manage', 'finance:approve', 'finance:write', 'health:read', 'report:manage', 'role:manage'].sort(),
    )
    expect(getPermissionsForRole('ADMIN').sort()).toEqual(
      ['account:manage', 'content:manage', 'finance:write', 'health:read', 'report:manage'].sort(),
    )
    expect(getPermissionsForRole('OPERASIONAL').sort()).toEqual(
      ['content:manage', 'finance:write', 'report:manage'].sort(),
    )
    expect(getPermissionsForRole('WARGA')).toEqual([])
  })
})
