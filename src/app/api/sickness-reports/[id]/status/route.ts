import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { canTransitionSicknessTo, isManageableSicknessStatus, sicknessReportStatusSchema } from '@/lib/sickness-report-schema'
import { writeAuditLog } from '@/lib/audit'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // Operasional may not change sickness status — DECISIONS-BASELINE §5.
  if (!session || !hasPermission(session, 'health:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const parsed = sicknessReportStatusSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  if (!isManageableSicknessStatus(parsed.data.status)) {
    return NextResponse.json({ error: 'Status tujuan tidak dapat dipilih pengurus.' }, { status: 400 })
  }
  const current = await prisma.sicknessReport.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  if (current.status === parsed.data.status) {
    return NextResponse.json({ error: 'Laporan sudah berada pada status tersebut.' }, { status: 409 })
  }
  if (!canTransitionSicknessTo(current.status, parsed.data.status)) {
    return NextResponse.json({ error: 'Transisi status tidak valid dari status saat ini.' }, { status: 409 })
  }
  const updated = await prisma.sicknessReport.update({
    where: { id },
    data: {
      status: parsed.data.status,
      resolvedAt: parsed.data.status === 'SELESAI' || parsed.data.status === 'TIDAK_DAPAT_DIPROSES' ? new Date() : null,
    },
  })
  await writeAuditLog({
    actorId: session.user.id,
    action: 'SICKNESS_REPORT_STATUS_CHANGED',
    entityType: 'SICKNESS_REPORT',
    entityId: id,
    metadata: { from: current.status, to: parsed.data.status },
  })
  return NextResponse.json({ data: updated })
}
