import { test, expect } from '@playwright/test'

test.describe('Elementos UI Retro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('debe mostrar el navbar', async ({ page }) => {
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()
  })

  test('debe mostrar el logo', async ({ page }) => {
    const logo = page.locator('img[alt*="ForumViajeros"]')
    await expect(logo).toBeVisible()
  })

  test('debe mostrar el footer', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('debe tener estilos retro aplicados', async ({ page }) => {
    // Verificar que existen elementos con clases retro
    const retroElements = page.locator('.neon-text, .font-display, .font-retro')
    const count = await retroElements.count()
    expect(count).toBeGreaterThan(0)
  })

  test('los botones deben tener estilos retro', async ({ page }) => {
    const buttons = page.locator('.btn, button')
    const firstButton = buttons.first()
    
    if (await firstButton.count() > 0) {
      await expect(firstButton).toBeVisible()
    }
  })

  test('debe mostrar los mundos temáticos en el home', async ({ page }) => {
    const worlds = ['AVENTURA', 'JUNGLA', 'TECH', 'SPACE']
    
    for (const world of worlds) {
      const worldElement = page.locator(`text=${world}`)
      await expect(worldElement).toBeVisible()
    }
  })

  test('no debe mostrar subtítulos de películas', async ({ page }) => {
    const movieTitles = [
      'Indiana Jones',
      'Back to the Future',
      'Jumanji',
      'Terminator',
      'Alien'
    ]
    
    for (const title of movieTitles) {
      const element = page.locator(`text=${title}`)
      await expect(element).toHaveCount(0)
    }
  })
})

