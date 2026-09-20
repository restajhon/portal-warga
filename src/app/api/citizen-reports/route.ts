import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { citizenReportSchema } from '@/lib/citizen-report-schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const manage = new URL(request.url).searchParams.get('scope') === 'manage'
  if (manage) {
    if (!hasPermission(session, 'report:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const data = await prisma.citizenReport.findMany({ orderBy: { createdAt: 'desc' }, include: { reporter: { select: { id: true, name: true, address: true } } } })
    return NextResponse.json({ data })
  }
  const data = await prisma.citizenReport.findMany({ where: { reporterId: session.user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`citizen-report:${session.user.id}`, 5, 60_000)
  if (!rate.allowed) return NextResponse.json({ error: 'Terlalu banyak laporan terkirim. Coba lagi nanti.' }, { status: 429 })
  const parsed = citizenReportSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const report = await prisma.citizenReport.create({ data: { ...parsed.data, reporterId: session.user.id } })
  await writeAuditLog({ actorId: session.user.id, action: 'CITIZEN_REPORT_CREATED', entityType: 'CITIZEN_REPORT', entityId: report.id, metadata: { type: report.type } })
  return NextResponse.json({ data: report }, { status: 201 })
}
