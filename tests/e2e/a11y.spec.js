// @ts-check
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const publicRoutes = ['/', '/forums', '/login', '/about', '/contact', '/help', '/trivia', '/travel']

test.describe('Accesibilidad pública (Q4)', () => {
  for (const path of publicRoutes) {
    test(`axe wcag2a/aa en ${path}`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
    })
  }
})
