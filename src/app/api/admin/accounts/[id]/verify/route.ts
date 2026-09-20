import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { canManageAccount } from '@/lib/account-schema'
import { writeAuditLog } from '@/lib/audit'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(session, 'account:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!session.user.role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })

  if (
    !canManageAccount(
      { role: session.user.role, accountType: 'PENGURUS' },
      { role: target.role, accountType: target.accountType },
    )
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (target.status === 'AKTIF') {
    return NextResponse.json({ error: 'Akun sudah dalam status aktif.' }, { status: 409 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: 'AKTIF', verifiedById: session.user.id },
    select: { id: true, status: true, verifiedById: true },
  })

  await writeAuditLog({
    actorId: session.user.id,
    action: 'ACCOUNT_VERIFIED',
    entityType: 'USER',
    entityId: id,
    metadata: { previousStatus: target.status, accountType: target.accountType },
  })

  return NextResponse.json({ data: updated })
}
