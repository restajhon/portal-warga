import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { sicknessReportSchema, toPublicSicknessReport } from '@/lib/sickness-report-schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scope = new URL(request.url).searchParams.get('scope')
  if (scope === 'manage') {
    if (!hasPermission(session, 'health:read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Sensitive details are never included here — list view is redacted.
    const reports = await prisma.sicknessReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reporter: { select: { id: true, name: true, address: true } } },
    })
    return NextResponse.json({ data: reports.map(toPublicSicknessReport) })
  }

  // Warga sees their own reports; helpers with health:read may also use this without `scope`.
  const reports = await prisma.sicknessReport.findMany({
    where: { reporterId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: reports.map(toPublicSicknessReport) })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rate = checkRateLimit(`sickness-report:${session.user.id}`, 3, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak laporan terkirim. Coba lagi nanti.' }, { status: 429 })
  }

  const parsed = sicknessReportSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { symptoms, medicalNotes, contactPhone, ...publicFields } = parsed.data

  // Create report + sensitive details atomically so partial writes never expose a half-state.
  const created = await prisma.$transaction(async (tx) => {
    const report = await tx.sicknessReport.create({
      data: {
        ...publicFields,
        patientAddress: publicFields.patientAddress || null,
        patientRt: publicFields.patientRt || null,
        reporterId: session.user.id,
      },
    })
    const details = await tx.sicknessReportDetail.create({
      data: {
        reportId: report.id,
        symptoms,
        medicalNotes: medicalNotes || null,
        contactPhone: contactPhone || null,
      },
    })
    return { report, detailsId: details.id }
  })

  await writeAuditLog({
    actorId: session.user.id,
    action: 'SICKNESS_REPORT_CREATED',
    entityType: 'SICKNESS_REPORT',
    entityId: created.report.id,
    metadata: { severity: created.report.severity, status: created.report.status, detailsId: created.detailsId },
  })

  return NextResponse.json({ data: toPublicSicknessReport(created.report) }, { status: 201 })
}
