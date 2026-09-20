import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Masukkan email yang valid.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})

export type LoginInput = z.infer<typeof loginSchema>
