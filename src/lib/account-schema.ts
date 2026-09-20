import { z } from 'zod'

export const accountStatusSchema = z.object({
  status: z.enum(['MENUNGGU_VERIFIKASI', 'AKTIF', 'NONAKTIF']),
  reason: z.string().trim().max(500).optional(),
})

export const roleChangeSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL']),
})

/**
 * Returns true when the actor has sufficient privilege to modify the target account.
 * Super Admin can manage all pengurus; Admin can manage warga and OPERASIONAL but
 * not other Admin/Super Admin accounts. Operasional cannot manage accounts.
 */
export function canManageAccount(
  actor: { role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL'; accountType: 'WARGA' | 'PENGURUS' },
  target: { role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | null; accountType: 'WARGA' | 'PENGURUS' },
) {
  if (actor.accountType !== 'PENGURUS') return false
  if (actor.role === 'SUPER_ADMIN') return true
  if (actor.role === 'ADMIN') {
    if (target.accountType === 'WARGA') return true
    return target.role === 'OPERASIONAL'
  }
  return false
}

/** Only Super Admin may change the role of a pengurus account. */
export function canChangeRole(
  actor: { role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' },
  target: { accountType: 'WARGA' | 'PENGURUS' },
) {
  if (actor.role !== 'SUPER_ADMIN') return false
  return target.accountType === 'PENGURUS'
}
