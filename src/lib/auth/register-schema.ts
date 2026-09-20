import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama wajib diisi.'),
  email: z.string().trim().email('Masukkan email yang valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Konfirmasi password tidak sama.',
})

export type RegisterInput = z.infer<typeof registerSchema>
