import { test, expect } from '@playwright/test'

test.describe('Navegación y Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('debe navegar a la página de inicio', async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.locator('h1')).toContainText(/FORUM|VIAJEROS/i)
  })

  test('debe navegar a la página de login', async ({ page }) => {
    await page.click('text=/ACCEDER|Iniciar Sesión/i')
    await expect(page).toHaveURL('http://localhost:5173/login')
    await expect(page.locator('h1')).toContainText(/ACCESO|LOGIN/i)
  })

  test('debe navegar a la página de registro', async ({ page }) => {
    await page.click('text=/REGISTRARSE|Registrarse/i')
    await expect(page).toHaveURL('http://localhost:5173/register')
    await expect(page.locator('h1')).toContainText(/REGISTRO/i)
  })

  test('debe navegar a la página de foros', async ({ page }) => {
    await page.click('text=Foros')
    await expect(page).toHaveURL(/.*\/forums/)
  })

  test('debe navegar a la página de trivia', async ({ page }) => {
    await page.click('text=Trivia')
    await expect(page).toHaveURL('http://localhost:5173/trivia')
  })

  test('debe navegar a la página de mapa de viajes', async ({ page }) => {
    await page.click('text=/MI MAPA|Mi Mapa/i')
    await expect(page).toHaveURL('http://localhost:5173/travel')
  })

  test('debe navegar a categorías desde el inicio', async ({ page }) => {
    await page.click('text=/CONTINENTES|Continentes/i')
    await expect(page).toHaveURL('http://localhost:5173/categories')
  })

  test('el logo debe llevar a la página de inicio', async ({ page }) => {
    await page.goto('http://localhost:5173/forums')
    await page.click('img[alt*="ForumViajeros"]')
    await expect(page).toHaveURL('http://localhost:5173/')
  })
})

test.describe('Botones de Acción', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('botón "Explorar Foros" debe funcionar', async ({ page }) => {
    await page.click('text=EXPLORAR FOROS')
    await expect(page).toHaveURL(/.*\/forums/)
  })

  test('botón "Jugar Trivia" debe funcionar', async ({ page }) => {
    await page.click('text=JUGAR TRIVIA')
    await expect(page).toHaveURL('http://localhost:5173/trivia')
  })

  test('botón "Mi Mapa" debe funcionar', async ({ page }) => {
    await page.click('text=MI MAPA')
    await expect(page).toHaveURL('http://localhost:5173/travel')
  })

  test('botones de mundos temáticos deben funcionar', async ({ page }) => {
    const worlds = ['AVENTURA', 'JUNGLA', 'TECH', 'SPACE']
    
    for (const world of worlds) {
      await page.goto('http://localhost:5173')
      await page.click(`text=${world}`)
      // Verificar que navega a alguna página válida
      await expect(page.url()).not.toBe('http://localhost:5173/')
    }
  })
})

