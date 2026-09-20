import { describe, expect, it } from 'vitest'
import { loginSchema } from '@/lib/auth/login-schema'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'budi@example.com', password: 'Rahasia123!' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'bukan-email', password: 'Rahasia123!' }).success).toBe(false)
  })

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'budi@example.com', password: '' }).success).toBe(false)
  })
})
