import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { writeAuditLog } from '@/lib/audit'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session, 'finance:approve')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const body = await request.json()
  const action = body.action === 'approve' ? 'DISETUJUI' : body.action === 'publish' ? 'DIPUBLIKASIKAN' : null
  if (!action) return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 })
  const current = await prisma.financeReport.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })
  if (action === 'DISETUJUI' && current.status !== 'MENUNGGU_APPROVAL') return NextResponse.json({ error: 'Laporan belum berada pada status menunggu approval.' }, { status: 409 })
  if (action === 'DIPUBLIKASIKAN' && current.status !== 'DISETUJUI') return NextResponse.json({ error: 'Laporan harus disetujui sebelum dipublikasikan.' }, { status: 409 })
  const report = await prisma.financeReport.update({ where: { id }, data: { status: action, approvedAt: action === 'DISETUJUI' ? new Date() : undefined, publishedAt: action === 'DIPUBLIKASIKAN' ? new Date() : undefined } })
  await writeAuditLog({ actorId: session.user.id, action: `FINANCE_REPORT_${action}`, entityType: 'FINANCE_REPORT', entityId: id })
  return NextResponse.json({ data: report })
}
