import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { accountStatusSchema, canManageAccount } from '@/lib/account-schema'
import { writeAuditLog } from '@/lib/audit'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(session, 'account:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!session.user.role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const parsed = accountStatusSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

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

  if (target.status === parsed.data.status) {
    return NextResponse.json({ error: 'Akun sudah pada status tersebut.' }, { status: 409 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  })

  await writeAuditLog({
    actorId: session.user.id,
    action: 'ACCOUNT_STATUS_CHANGED',
    entityType: 'USER',
    entityId: id,
    metadata: { from: target.status, to: parsed.data.status, reason: parsed.data.reason ?? null },
  })

  return NextResponse.json({ data: updated })
}
