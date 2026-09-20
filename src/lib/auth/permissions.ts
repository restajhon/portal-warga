import { redirect } from 'next/navigation'
import type { Session } from 'next-auth'

export type Permission =
  | 'account:manage'
  | 'content:manage'
  | 'finance:write'
  | 'finance:approve'
  | 'report:manage'
  | 'health:read'
  | 'audit:read'

const permissions: Record<Permission, Array<'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | 'WARGA'>> = {
  'account:manage': ['SUPER_ADMIN', 'ADMIN'],
  'content:manage': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'finance:write': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'finance:approve': ['SUPER_ADMIN'],
  'report:manage': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'health:read': ['SUPER_ADMIN', 'ADMIN'],
  'audit:read': ['SUPER_ADMIN'],
}

export function hasPermission(session: Session | null, permission: Permission) {
  if (!session?.user) return false
  const identity = session.user.accountType === 'WARGA' ? 'WARGA' : session.user.role
  return Boolean(identity && permissions[permission].includes(identity))
}

export function requirePermission(session: Session | null, permission: Permission) {
  if (!hasPermission(session, permission)) redirect('/forbidden')
}

export function getPermissionsForRole(role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | 'WARGA') {
  return Object.entries(permissions).filter(([, roles]) => roles.includes(role)).map(([name]) => name as Permission)
}
