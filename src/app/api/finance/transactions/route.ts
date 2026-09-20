import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { transactionSchema } from '@/lib/finance-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.financeTransaction.findMany({ orderBy: { occurredAt: 'desc' } })
  const balance = rows.reduce((total, row) => total + (row.type === 'PEMASUKAN' ? Number(row.amount) : -Number(row.amount)), 0)
  const data = rows.map((row) => ({ ...row, amount: row.amount.toString(), evidenceUrl: hasPermission(session, 'finance:write') ? row.evidenceUrl : undefined }))
  return NextResponse.json({ data, balance })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !hasPermission(session, 'finance:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = transactionSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const row = await prisma.financeTransaction.create({ data: { ...parsed.data, amount: parsed.data.amount, occurredAt: new Date(parsed.data.occurredAt), authorId: session.user.id } })
  await writeAuditLog({ actorId: session.user.id, action: 'FINANCE_TRANSACTION_CREATED', entityType: 'FINANCE_TRANSACTION', entityId: row.id, metadata: { type: row.type, paymentMethod: row.paymentMethod } })
  return NextResponse.json({ data: { ...row, amount: row.amount.toString() } }, { status: 201 })
}
