import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { canTransitionTo, citizenReportStatusSchema, isManageableStatus } from '@/lib/citizen-report-schema'
import { writeAuditLog } from '@/lib/audit'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session, 'report:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const parsed = citizenReportStatusSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  if (!isManageableStatus(parsed.data.status)) return NextResponse.json({ error: 'Status tujuan tidak dapat dipilih pengurus.' }, { status: 400 })
  const current = await prisma.citizenReport.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  if (current.status === parsed.data.status) return NextResponse.json({ error: 'Laporan sudah berada pada status tersebut.' }, { status: 409 })
  if (!canTransitionTo(current.status, parsed.data.status)) return NextResponse.json({ error: 'Transisi status tidak valid dari status saat ini.' }, { status: 409 })
  const report = await prisma.citizenReport.update({
    where: { id },
    data: { status: parsed.data.status, resolvedAt: parsed.data.status === 'SELESAI' || parsed.data.status === 'TIDAK_DAPAT_DIPROSES' ? new Date() : null },
  })
  await writeAuditLog({ actorId: session.user.id, action: 'CITIZEN_REPORT_STATUS_CHANGED', entityType: 'CITIZEN_REPORT', entityId: id, metadata: { from: current.status, to: parsed.data.status } })
  return NextResponse.json({ data: report })
}
