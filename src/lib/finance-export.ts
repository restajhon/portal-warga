import PDFDocument from 'pdfkit'
import * as XLSX from 'xlsx'

export type ExportRow = {
  occurredAt: Date
  type: 'PEMASUKAN' | 'PENGELUARAN'
  category: string
  description: string
  paymentMethod: 'CASH' | 'TRANSFER'
  amount: number
}

export type ExportPayload = {
  reportTitle: string
  reportSummary: string | null
  periodStart: Date
  periodEnd: Date
  rows: ExportRow[]
  balance: number
  totalIncome: number
  totalExpense: number
}

const TYPE_LABEL: Record<ExportRow['type'], string> = {
  PEMASUKAN: 'Pemasukan',
  PENGELUARAN: 'Pengeluaran',
}

const PAYMENT_LABEL: Record<ExportRow['paymentMethod'], string> = {
  CASH: 'Cash',
  TRANSFER: 'Transfer',
}

function formatIdDate(date: Date) {
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatIdCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

/**
 * Build a PDF buffer for the given finance report payload.
 * Streaming PDFKit into a buffer so the route can return a single response.
 */
export function buildFinancePdf(payload: ExportPayload): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(18).text('Portal Warga RW — Laporan Keuangan', { align: 'left' })
    doc.moveDown(0.3)
    doc.fontSize(12).text(payload.reportTitle)
    doc.fontSize(10).fillColor('#475569').text(
      `Periode ${formatIdDate(payload.periodStart)} – ${formatIdDate(payload.periodEnd)}`,
    )
    doc.moveDown(0.7)

    if (payload.reportSummary) {
      doc.fillColor('#0f172a').fontSize(10).text('Ringkasan:', { continued: false })
      doc.fillColor('#334155').fontSize(10).text(payload.reportSummary)
      doc.moveDown(0.6)
    }

    // Totals
    doc.fillColor('#0f172a').fontSize(11)
    doc.text(`Total Pemasukan: ${formatIdCurrency(payload.totalIncome)}`)
    doc.text(`Total Pengeluaran: ${formatIdCurrency(payload.totalExpense)}`)
    doc.text(`Saldo Akhir Periode: ${formatIdCurrency(payload.balance)}`)
    doc.moveDown(0.8)

    // Detail table — keep it readable with cell widths
    if (payload.rows.length === 0) {
      doc.fillColor('#94a3b8').fontSize(10).text('Tidak ada transaksi pada periode ini.')
    } else {
      const startX = 50
      const widths = { date: 80, type: 70, cat: 110, desc: 140, method: 50, amount: 90 }
      const headers = ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Metode', 'Nominal']

      function drawRow(values: string[], y: number, bold = false) {
        doc.fontSize(9).fillColor('#0f172a')
        const cells = [values[0], values[1], values[2], values[3], values[4], values[5]]
        doc.text(cells[0], startX, y, { width: widths.date })
        doc.text(cells[1], startX + widths.date, y, { width: widths.type })
        doc.text(cells[2], startX + widths.date + widths.type, y, { width: widths.cat })
        doc.text(cells[3], startX + widths.date + widths.type + widths.cat, y, { width: widths.desc })
        doc.text(cells[4], startX + widths.date + widths.type + widths.cat + widths.desc, y, { width: widths.method })
        doc.text(cells[5], startX + widths.date + widths.type + widths.cat + widths.desc + widths.method, y, {
          width: widths.amount,
          align: 'right',
        })
        doc.strokeColor('#e2e8f0').moveTo(startX, y + 14).lineTo(545, y + 14).stroke()
        void bold
      }

      drawRow(headers, doc.y, true)
      doc.moveDown(0.4)
      for (const row of payload.rows) {
        if (doc.y > 750) {
          doc.addPage()
        }
        const values = [
          row.occurredAt.toLocaleDateString('id-ID'),
          TYPE_LABEL[row.type],
          row.category,
          row.description,
          PAYMENT_LABEL[row.paymentMethod],
          formatIdCurrency(row.amount),
        ]
        drawRow(values, doc.y)
        doc.moveDown(0.4)
      }
    }

    doc.end()
  })
}

/**
 * Build an XLSX workbook for the given finance report payload.
 * Warga/Pengurus receives a workbook with a metadata sheet and a transactions sheet.
 */
export function buildFinanceXlsx(payload: ExportPayload): Buffer {
  const meta = [
    ['Portal Warga RW'],
    ['Laporan Keuangan'],
    [],
    ['Judul', payload.reportTitle],
    ['Periode', `${payload.periodStart.toISOString()} – ${payload.periodEnd.toISOString()}`],
    ['Ringkasan', payload.reportSummary ?? ''],
    [],
    ['Total Pemasukan', payload.totalIncome],
    ['Total Pengeluaran', payload.totalExpense],
    ['Saldo Akhir Periode', payload.balance],
  ]
  const txHeader = ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Metode', 'Nominal']
  const txBody = payload.rows.map((row) => [
    row.occurredAt.toISOString(),
    TYPE_LABEL[row.type],
    row.category,
    row.description,
    PAYMENT_LABEL[row.paymentMethod],
    row.amount,
  ])

  const workbook = XLSX.utils.book_new()
  const metaSheet = XLSX.utils.aoa_to_sheet(meta)
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Ringkasan')

  const txSheet = XLSX.utils.aoa_to_sheet([txHeader, ...txBody])
  // Mark date column as ISO date string for spreadsheet compatibility.
  for (let i = 1; i <= txBody.length; i += 1) {
    const cell = txSheet[`A${i + 1}`]
    if (cell) cell.t = 's'
  }
  XLSX.utils.book_append_sheet(workbook, txSheet, 'Transaksi')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
