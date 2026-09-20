import { z } from 'zod'

export const documentationSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(500).optional(),
  mediaUrl: z.string().url(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export const programUpdateSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})
