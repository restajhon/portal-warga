import { z } from 'zod'

export const documentationSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(500).optional(),
  mediaUrl: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export const programUpdateSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})
