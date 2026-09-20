import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  paymentMethod: z.enum(['CASH', 'TRANSFER']),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(3).max(500),
  amount: z.coerce.number().positive(),
  occurredAt: z.string().datetime(),
  evidenceUrl: z.string().url().optional(),
})
