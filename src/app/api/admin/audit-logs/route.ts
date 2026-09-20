import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { buildAuditLogFilter } from '@/lib/audit'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Audit log viewer is restricted to Super Admin per DECISIONS-BASELINE §7.
  if (!hasPermission(session, 'audit:read')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(request.url)
  const take = Math.min(Number(url.searchParams.get('limit') ?? 50), 200)

  const where = buildAuditLogFilter({
    action: url.searchParams.get('action') ?? undefined,
    entityType: url.searchParams.get('entityType') ?? undefined,
    actorId: url.searchParams.get('actorId') ?? undefined,
    from: url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : undefined,
    to: url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : undefined,
  })

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: { actor: { select: { id: true, name: true, email: true, role: true } } },
  })

  return NextResponse.json({ data: logs })
}
