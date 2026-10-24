// @ts-check
import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 720 },
]

const ROUTES = ['/', '/forums', '/login', '/trivia', '/travel', '/about']

test.describe('Pase responsive Q3', () => {
  for (const viewport of VIEWPORTS) {
    test(`sin scroll horizontal a ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      for (const route of ROUTES) {
        await page.goto(route, { waitUntil: 'domcontentloaded' })
        await expect(page.locator('main')).toBeVisible()
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        )
        expect(overflow, `${route} @ ${viewport.name}`).toBeFalsy()
      }
    })
  }
})
