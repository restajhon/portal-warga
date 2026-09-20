import { expect, test } from '@playwright/test'

test.describe('Public pages smoke', () => {
  test('home page shows login form', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Masuk/ })).toBeVisible()
  })

  test('registration page shows required fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByLabel('Nama lengkap')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Konfirmasi password')).toBeVisible()
  })

  test('forbidden page is reachable', async ({ page }) => {
    await page.goto('/forbidden')
    await expect(page.getByRole('heading', { name: 'Akses ditolak' })).toBeVisible()
  })
})
