import { z } from 'zod'

export const contentSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10),
  type: z.enum(['BERITA', 'PENGUMUMAN']),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})
