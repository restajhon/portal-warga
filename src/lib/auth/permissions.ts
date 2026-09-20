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
  | 'role:manage'

const permissions: Record<Permission, Array<'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | 'WARGA'>> = {
  'account:manage': ['SUPER_ADMIN', 'ADMIN'],
  'content:manage': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'finance:write': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'finance:approve': ['SUPER_ADMIN'],
  'report:manage': ['SUPER_ADMIN', 'ADMIN', 'OPERASIONAL'],
  'health:read': ['SUPER_ADMIN', 'ADMIN'],
  'audit:read': ['SUPER_ADMIN'],
  'role:manage': ['SUPER_ADMIN'],
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

/** Navigation entries shown in the CMS sidebar; gated by required permission. */
export type NavEntry = { href: string; label: string; permission: Permission }

export const CMS_NAV: NavEntry[] = [
  { href: '/cms/content', label: 'Berita & Pengumuman', permission: 'content:manage' },
  { href: '/cms/agenda', label: 'Agenda', permission: 'content:manage' },
  { href: '/cms/documentation', label: 'Dokumentasi', permission: 'content:manage' },
  { href: '/cms/program-updates', label: 'Program & Kegiatan', permission: 'content:manage' },
  { href: '/cms/reports', label: 'Laporan Warga', permission: 'report:manage' },
  { href: '/cms/sickness-reports', label: 'Laporan Sakit', permission: 'health:read' },
  { href: '/cms/finance', label: 'Keuangan RW', permission: 'finance:write' },
  { href: '/cms/accounts', label: 'Manajemen Akun', permission: 'account:manage' },
  { href: '/cms/audit-logs', label: 'Audit Log', permission: 'audit:read' },
]

export function navEntriesFor(session: Session | null): NavEntry[] {
  return CMS_NAV.filter((entry) => hasPermission(session, entry.permission))
}

