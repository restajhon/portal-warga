import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { isSicknessEditableByReporter, sicknessReportUpdateSchema, toPublicSicknessReport } from '@/lib/sickness-report-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const report = await prisma.sicknessReport.findUnique({
    where: { id },
    include: {
      responses: {
        orderBy: { createdAt: 'asc' },
        include: { responder: { select: { id: true, name: true } } },
      },
    },
  })
  if (!report) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })

  const canReadHealth = hasPermission(session, 'health:read')
  const isReporter = report.reporterId === session.user.id
  // Only the reporter or pengurus with health:read may view this report.
  if (!isReporter && !canReadHealth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let details: { symptoms: string; medicalNotes: string | null; contactPhone: string | null } | null = null
  if (canReadHealth) {
    const raw = await prisma.sicknessReportDetail.findUnique({ where: { reportId: id } })
    if (raw) {
      details = {
        symptoms: raw.symptoms,
        medicalNotes: raw.medicalNotes,
        contactPhone: raw.contactPhone,
      }
    }
    // Field-level access audit — record every detail fetch by who/when.
    await writeAuditLog({
      actorId: session.user.id,
      action: 'SICKNESS_REPORT_HEALTH_DETAIL_READ',
      entityType: 'SICKNESS_REPORT',
      entityId: id,
      metadata: { reporterId: report.reporterId },
    })
  }

  return NextResponse.json({ data: { ...toPublicSicknessReport(report), responses: report.responses, details } })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const report = await prisma.sicknessReport.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  if (report.reporterId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!isSicknessEditableByReporter(report.status)) {
    return NextResponse.json({ error: 'Laporan sudah final dan tidak dapat diedit.' }, { status: 409 })
  }

  const parsed = sicknessReportUpdateSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const { symptoms, medicalNotes, contactPhone, ...publicFields } = parsed.data

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.sicknessReport.update({
      where: { id },
      data: {
        ...publicFields,
        patientAddress: publicFields.patientAddress || null,
        patientRt: publicFields.patientRt || null,
      },
    })
    await tx.sicknessReportDetail.update({
      where: { reportId: id },
      data: {
        symptoms,
        medicalNotes: medicalNotes || null,
        contactPhone: contactPhone || null,
      },
    })
    return next
  })

  await writeAuditLog({
    actorId: session.user.id,
    action: 'SICKNESS_REPORT_EDITED',
    entityType: 'SICKNESS_REPORT',
    entityId: id,
    metadata: { from: report.status },
  })

  return NextResponse.json({ data: toPublicSicknessReport(updated) })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Same as citizen reports: deletion is not allowed.
  return NextResponse.json({ error: 'Penghapusan laporan tidak diizinkan.' }, { status: 405 })
}
