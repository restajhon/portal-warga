import { z } from 'zod'

export const financeReportSchema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().max(1000).optional(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
})
