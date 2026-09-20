import { describe, expect, it } from 'vitest'
import { registerSchema } from '@/lib/auth/register-schema'

describe('registerSchema', () => {
  it('accepts a valid warga registration', () => {
    expect(registerSchema.safeParse({ name: 'Budi', email: 'budi@example.com', password: 'Rahasia123!', confirmPassword: 'Rahasia123!' }).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    expect(registerSchema.safeParse({ name: 'Budi', email: 'budi@example.com', password: 'Rahasia123!', confirmPassword: 'Berbeda123!' }).success).toBe(false)
  })
})
