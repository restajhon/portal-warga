import { describe, expect, it } from 'vitest'
import { clearRateLimitBuckets, checkRateLimit } from '@/lib/rate-limit'

describe('checkRateLimit', () => {
  it('blocks after the configured limit', () => {
    clearRateLimitBuckets()
    expect(checkRateLimit('test', 2).allowed).toBe(true)
    expect(checkRateLimit('test', 2).allowed).toBe(true)
    expect(checkRateLimit('test', 2).allowed).toBe(false)
  })
})
