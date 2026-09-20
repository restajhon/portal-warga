import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { buildFinancePdf, buildFinanceXlsx, type ExportRow } from '@/lib/finance-export'

/** GET /api/finance/reports/[id]/export?format=pdf|xlsx
 *  Only published reports are downloadable by warga. CMS users with finance:write
 *  may export draft/menunggu reports as well. Period filter narrows the rows
 *  within the report's window. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const url = new URL(request.url)
  const format = (url.searchParams.get('format') ?? 'pdf').toLowerCase()
  if (format !== 'pdf' && format !== 'xlsx') {
    return NextResponse.json({ error: 'Format tidak didukung.' }, { status: 400 })
  }

  const report = await prisma.financeReport.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Laporan tidak ditemukan.' }, { status: 404 })

  const canManage = hasPermission(session, 'finance:write')
  if (!canManage && report.status !== 'DIPUBLIKASIKAN') {
    return NextResponse.json({ error: 'Laporan belum dipublikasikan.' }, { status: 403 })
  }

  const fromParam = url.searchParams.get('from')
  const toParam = url.searchParams.get('to')
  const periodFrom = fromParam ? new Date(fromParam) : report.periodStart
  const periodTo = toParam ? new Date(toParam) : report.periodEnd
  if (Number.isNaN(periodFrom.getTime()) || Number.isNaN(periodTo.getTime())) {
    return NextResponse.json({ error: 'Periode tidak valid.' }, { status: 400 })
  }
  if (periodFrom > periodTo) {
    return NextResponse.json({ error: 'Periode awal harus sebelum periode akhir.' }, { status: 400 })
  }

  const transactions = await prisma.financeTransaction.findMany({
    where: { occurredAt: { gte: periodFrom, lte: periodTo } },
    orderBy: { occurredAt: 'asc' },
  })

  const rows: ExportRow[] = transactions.map((t) => ({
    occurredAt: t.occurredAt,
    type: t.type,
    category: t.category,
    description: t.description,
    paymentMethod: t.paymentMethod,
    amount: Number(t.amount),
  }))
  const totalIncome = rows.filter((r) => r.type === 'PEMASUKAN').reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = rows.filter((r) => r.type === 'PENGELUARAN').reduce((sum, r) => sum + r.amount, 0)
  const balance = totalIncome - totalExpense

  if (format === 'pdf') {
    const buffer = await buildFinancePdf({
      reportTitle: report.title,
      reportSummary: report.summary,
      periodStart: periodFrom,
      periodEnd: periodTo,
      rows,
      balance,
      totalIncome,
      totalExpense,
    })
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="laporan-keuangan-${report.id}.pdf"`,
      },
    })
  }

  const buffer = buildFinanceXlsx({
    reportTitle: report.title,
    reportSummary: report.summary,
    periodStart: periodFrom,
    periodEnd: periodTo,
    rows,
    balance,
    totalIncome,
    totalExpense,
  })
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="laporan-keuangan-${report.id}.xlsx"`,
    },
  })
}
