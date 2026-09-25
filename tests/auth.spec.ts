import { test, expect } from '@playwright/test'

test.describe('Auth navegación', () => {
  test('CTA Registrarse navega a /register', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const cta = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Registrarse' })
    await expect(cta).toBeVisible({ timeout: 10000 })
    await cta.click()
    await expect(page).toHaveURL(/\/register$/)
  })

  test('CTA Entrar navega a /login', async ({ page }) => {
    await page.goto('/')
    // Use the navbar link specifically by targeting within navigation
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })
})