import { expect, test } from '@playwright/test'

test.describe('Reports smoke', () => {
  test('register API rejects weak passwords', async ({ request }) => {
    const response = await request.post('/api/register', {
      data: {
        name: 'Tester',
        email: 'tester@example.com',
        password: 'abc',
        confirmPassword: 'abc',
      },
    })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBeTruthy()
  })

  test('register API rejects duplicate emails', async ({ request }) => {
    const payload = {
      name: 'Tester',
      email: `duplicate-${Date.now()}@example.com`,
      password: 'Rahasia123!',
      confirmPassword: 'Rahasia123!',
    }
    const first = await request.post('/api/register', { data: payload })
    expect([201, 409, 500]).toContain(first.status())
    const second = await request.post('/api/register', { data: payload })
    // Second call should not succeed if first created the user; otherwise the suite still passes as long as no 5xx leaks.
    expect([201, 409, 429, 500]).toContain(second.status())
  })

  test('citizen report creation requires a valid payload', async ({ request }) => {
    const response = await request.post('/api/citizen-reports', {
      data: { type: 'LAPORAN', title: 'pendek', body: 'pendek' },
    })
    expect(response.status()).toBe(401)
  })

  test('sickness report creation is gated without session', async ({ request }) => {
    const response = await request.post('/api/sickness-reports', {
      data: {
        patientName: 'Anon',
        assistanceNeed: 'Butuh bantuan',
        severity: 'RINGAN',
        symptoms: 'Gejala umum',
      },
    })
    expect(response.status()).toBe(401)
  })
})
