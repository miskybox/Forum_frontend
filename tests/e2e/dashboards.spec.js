// @ts-check
import { test, expect } from '@playwright/test'
import { adminCredentials, moderatorCredentials } from './credentials.js'

async function loginWith(page, username, password) {
  await page.goto('/login')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('form button[type="submit"]').click()
  await expect(page).not.toHaveURL(/\/login/, { timeout: 20000 })
}

async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  )
  expect(overflow).toBeFalsy()
}

test.describe('Dashboards (Q2)', () => {
  test.describe.configure({ mode: 'serial' })

  test('invitado llega a login al abrir el panel de administración', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 20000 })
  })

  test('invitado llega a login al abrir el panel de moderación', async ({ page }) => {
    await page.goto('/moderator/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 20000 })
  })

  test('admin abre el panel y cambia de pestaña', async ({ page }) => {
    test.skip(!adminCredentials.password, 'Falta E2E_ADMIN_PASSWORD o ADMIN_PASSWORD')
    await loginWith(page, adminCredentials.username, adminCredentials.password)
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('heading', { name: /panel de administración|administration panel/i })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.getByRole('tab', { name: /usuarios|users/i })).toBeVisible()
    await page.getByRole('tab', { name: /usuarios|users/i }).click()
    await expect(page.getByRole('tab', { name: /usuarios|users/i })).toHaveAttribute('aria-selected', 'true')
    await page.setViewportSize({ width: 375, height: 812 })
    await expectNoHorizontalScroll(page)
  })

  test('moderador abre el panel de moderación', async ({ page }) => {
    test.skip(!moderatorCredentials.password, 'Falta E2E_MODERATOR_PASSWORD o MODERATOR_PASSWORD')
    await loginWith(page, moderatorCredentials.username, moderatorCredentials.password)
    await page.goto('/moderator/dashboard')
    await expect(page.getByRole('heading', { name: /panel de moderación|moderation panel/i })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.getByRole('tab', { name: /foros|forums/i })).toBeVisible()
  })
})
