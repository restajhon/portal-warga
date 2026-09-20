import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { citizenReportUpdateSchema, isEditableByReporter } from '@/lib/citizen-report-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const report = await prisma.citizenReport.findUnique({
    where: { id },
    include: {
      responses: { orderBy: { createdAt: 'asc' }, include: { responder: { select: { id: true, name: true } } } },
      reporter: { select: { id: true, name: true, address: true } },
    },
  })
  if (!report) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  const canManage = hasPermission(session, 'report:manage')
  // Warga hanya boleh melihat laporan sendiri beserta tanggapan yang ditujukan untuknya.
  if (!canManage && report.reporterId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ data: report })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const report = await prisma.citizenReport.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  // Edit hanya untuk pelapor sendiri; pengurus mengubah lewat triage/tanggapan.
  if (report.reporterId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!isEditableByReporter(report.status)) return NextResponse.json({ error: 'Laporan sudah final dan tidak dapat diedit.' }, { status: 409 })
  const parsed = citizenReportUpdateSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const updated = await prisma.citizenReport.update({ where: { id }, data: parsed.data })
  await writeAuditLog({ actorId: session.user.id, action: 'CITIZEN_REPORT_EDITED', entityType: 'CITIZEN_REPORT', entityId: id, metadata: { from: report.status } })
  return NextResponse.json({ data: updated })
}

export async function DELETE() {
  // Pelapor tidak dapat menghapus laporan (DECISIONS-BASELINE §4).
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ error: 'Penghapusan laporan tidak diizinkan.' }, { status: 405 })
}
