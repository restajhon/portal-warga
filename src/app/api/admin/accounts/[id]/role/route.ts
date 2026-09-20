import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { canChangeRole, roleChangeSchema } from '@/lib/account-schema'
import { writeAuditLog } from '@/lib/audit'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(session, 'account:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!session.user.role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Only Super Admin may change pengurus roles per DECISIONS-BASELINE §1.
  if (session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const parsed = roleChangeSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
  if (!canChangeRole({ role: session.user.role }, { accountType: target.accountType })) {
    return NextResponse.json({ error: 'Pengubahan role hanya untuk pengurus.' }, { status: 400 })
  }
  if (target.id === session.user.id && parsed.data.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Tidak dapat menurunkan role sendiri.' }, { status: 409 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, role: true, accountType: true },
  })

  await writeAuditLog({
    actorId: session.user.id,
    action: 'PENGURUS_ROLE_CHANGED',
    entityType: 'USER',
    entityId: id,
    metadata: { from: target.role, to: parsed.data.role },
  })

  return NextResponse.json({ data: updated })
}
