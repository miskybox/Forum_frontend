import { test, expect } from '@playwright/test'

test.describe('Home CTAs', () => {
  test('CTA Jugar Trivia navega a trivia', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const cta = page.getByRole('link', { name: 'Jugar Trivia' })
    await expect(cta).toBeVisible({ timeout: 10000 })
    await cta.click()
    await expect(page).toHaveURL(/\/trivia$/)
  })

  test('Explorar Foros navega a /forums', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explorar Foros' }).click()
    await expect(page).toHaveURL(/\/forums$/)
  })
})