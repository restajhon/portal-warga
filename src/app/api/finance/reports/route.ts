import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { financeReportSchema } from '@/lib/finance-report-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await prisma.financeReport.findMany({ where: { status: 'DIPUBLIKASIKAN' }, orderBy: { periodStart: 'desc' } })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !hasPermission(session, 'finance:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = financeReportSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const report = await prisma.financeReport.create({ data: { ...parsed.data, periodStart: new Date(parsed.data.periodStart), periodEnd: new Date(parsed.data.periodEnd), authorId: session.user.id, status: 'MENUNGGU_APPROVAL' } })
  await writeAuditLog({ actorId: session.user.id, action: 'FINANCE_REPORT_SUBMITTED', entityType: 'FINANCE_REPORT', entityId: report.id })
  return NextResponse.json({ data: report }, { status: 201 })
}
