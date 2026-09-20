import { describe, expect, it } from 'vitest'
import { buildFinancePdf, buildFinanceXlsx } from '@/lib/finance-export'

const fixture = {
  reportTitle: 'Laporan November 2026',
  reportSummary: 'Penerimaan iuran dan sebagian pengeluaran operasional.',
  periodStart: new Date('2026-11-01T00:00:00.000Z'),
  periodEnd: new Date('2026-11-30T23:59:59.000Z'),
  rows: [
    {
      occurredAt: new Date('2026-11-05T08:30:00.000Z'),
      type: 'PEMASUKAN' as const,
      category: 'Iuran Warga',
      description: 'Iuran RT 03 bulan November',
      paymentMethod: 'CASH' as const,
      amount: 250_000,
    },
    {
      occurredAt: new Date('2026-11-12T13:15:00.000Z'),
      type: 'PENGELUARAN' as const,
      category: 'Kebersihan',
      description: 'Pembelian alat pel dan sabun',
      paymentMethod: 'TRANSFER' as const,
      amount: 75_500,
    },
  ],
  balance: 174_500,
  totalIncome: 250_000,
  totalExpense: 75_500,
}

describe('buildFinancePdf', () => {
  it('produces a non-empty PDF buffer', async () => {
    const buffer = await buildFinancePdf(fixture)
    expect(buffer.length).toBeGreaterThan(0)
    // PDF files start with the %PDF- magic bytes.
    expect(buffer.subarray(0, 5).toString('utf8')).toBe('%PDF-')
  })
})

describe('buildFinanceXlsx', () => {
  it('produces a non-empty XLSX buffer', () => {
    const buffer = buildFinanceXlsx(fixture)
    expect(buffer.length).toBeGreaterThan(0)
    // XLSX is a ZIP file (PK\x03\x04 magic bytes).
    expect(buffer[0]).toBe(0x50)
    expect(buffer[1]).toBe(0x4b)
    expect(buffer[2]).toBe(0x03)
    expect(buffer[3]).toBe(0x04)
  })
})
