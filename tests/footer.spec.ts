import { test, expect } from '@playwright/test'

test.describe('Footer navegación', () => {
  test('Link Foros navega a /forums', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Scroll al footer para asegurar que está visible
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    const footerLink = footer.getByRole('link', { name: 'Foros' })
    await expect(footer.getByText(/copyright by sigu/i)).toBeVisible()
    await expect(footerLink).toBeVisible({ timeout: 10000 })
    await footerLink.click()
    await expect(page).toHaveURL(/\/forums$/)
  })
})