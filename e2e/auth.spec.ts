import { expect, test } from '@playwright/test'

test.describe('Auth smoke', () => {
  test('login page shows the portal heading and links to registration', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Masuk ke Portal RW' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Daftar' })).toBeVisible()
  })

  test('invalid credentials show generic error and stay on login', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Email').fill('tidak-ada@example.com')
    await page.getByLabel('Password').fill('password-salah')
    await page.getByRole('button', { name: /Masuk/ }).click()
    await expect(page.locator('p[role="alert"]')).toContainText(/Email atau password salah/i)
    await expect(page).toHaveURL(/\/$/)
  })

  test('registration form rejects mismatched passwords client-side', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Nama lengkap').fill('Tester')
    await page.getByLabel('Email').fill('tester@example.com')
    await page.getByLabel('Password', { exact: true }).fill('Rahasia123!')
    await page.getByLabel('Konfirmasi password').fill('Berbeda123!')
    await page.getByRole('button', { name: /Daftar/ }).click()
    await expect(page.locator('p[role="alert"]')).toContainText(/tidak sama/i)
  })

  test('protected routes redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    // Should redirect to login (/) because session is missing.
    await expect(page).toHaveURL(/\/$/)
  })
})
