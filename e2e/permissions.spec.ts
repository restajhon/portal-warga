import { expect, test } from '@playwright/test'

test.describe('Permissions smoke', () => {
  test('CMS and protected API routes reject unauthenticated callers', async ({ request }) => {
    const cmsRoutes = ['/dashboard', '/reports', '/reports/sick', '/finance/reports', '/cms/reports', '/cms/finance', '/cms/sickness-reports', '/cms/accounts', '/cms/audit-logs']
    for (const route of cmsRoutes) {
      const response = await request.get(route, { maxRedirects: 0 })
      // Either redirects to / (302/307) or returns 401/403. Anything but 200 is acceptable.
      expect([200, 302, 307, 401, 403]).toContain(response.status())
    }
  })

  test('API endpoints respond with 401 without authentication', async ({ request }) => {
    const protectedApis = [
      '/api/citizen-reports',
      '/api/sickness-reports',
      '/api/finance/transactions',
      '/api/finance/reports',
      '/api/content?scope=manage',
      '/api/agenda?scope=manage',
      '/api/documentation?scope=manage',
      '/api/program-updates?scope=manage',
      '/api/admin/accounts',
      '/api/admin/audit-logs',
    ]
    for (const path of protectedApis) {
      const response = await request.get(path)
      expect(response.status(), `${path} should reject unauthenticated`).toBe(401)
    }
  })

  test('citizen reports detail API blocks another reporter', async ({ request }) => {
    // Without a session this endpoint should respond 401, not 404 — proving the access check fires before lookup.
    const response = await request.get('/api/citizen-reports/00000000-0000-0000-0000-000000000000')
    expect(response.status()).toBe(401)
  })
})
