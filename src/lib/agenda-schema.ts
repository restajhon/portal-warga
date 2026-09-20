import { z } from 'zod'

export const agendaSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(5),
  imageUrl: z.string().min(1).optional().or(z.literal('')),
  location: z.string().trim().max(200).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})
