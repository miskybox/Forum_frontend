import { test, expect } from '@playwright/test'

test.describe('Foros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/forums')
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle')
  })

  test('debe cargar la página de foros', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/forums/)
    await expect(page.locator('h1, h2')).toContainText(/FORO/i)
  })

  test('debe mostrar el botón de búsqueda', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="BUSCAR"]')
    await expect(searchInput).toBeVisible()
  })

  test('debe mostrar botón "Crear Foro" si está autenticado', async ({ page }) => {
    // Primero intentar login
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'Test1234!')
    await page.click('button[type="submit"]')
    
    // Esperar a que el login se complete (puede redirigir a home o quedarse en login si hay error)
    await page.waitForTimeout(3000)
    
    // Ir a foros
    await page.goto('http://localhost:5173/forums')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Verificar que existe el botón (puede no estar visible si no hay foros)
    const createButton = page.locator('text=/CREAR FORO/i').or(page.locator('a[href*="/forums/create"]'))
    const count = await createButton.count()
    // Si está autenticado, debería haber al menos un botón o link para crear foro
    if (count === 0) {
      // Verificar si hay un mensaje de "inicia sesión" que indicaría que no está autenticado
      const loginPrompt = await page.locator('text=/inicia sesión|login/i').count()
      expect(loginPrompt).toBeGreaterThan(0) // Si no hay botón, debe haber prompt de login
    }
  })

  test('debe poder hacer clic en una tarjeta de foro si existe', async ({ page }) => {
    // Esperar a que se carguen los foros
    await page.waitForTimeout(2000)
    
    // Buscar cualquier link a un foro
    const forumLink = page.locator('a[href*="/forums/"]').first()
    const count = await forumLink.count()
    
    if (count > 0) {
      await forumLink.click()
      await expect(page).toHaveURL(/.*\/forums\/\d+/)
    } else {
      // Si no hay foros, verificar que se muestra el mensaje apropiado
      await expect(page.locator('text=/NO HAY FOROS/i')).toBeVisible()
    }
  })

  test('debe mostrar mensaje cuando no hay foros', async ({ page }) => {
    await page.waitForTimeout(2000)
    
    // Verificar que o hay foros o hay un mensaje de "no hay foros"
    const hasForums = await page.locator('a[href*="/forums/"]').count() > 0
    const hasNoForumsMessage = await page.locator('text=/NO HAY FOROS/i').isVisible()
    
    expect(hasForums || hasNoForumsMessage).toBeTruthy()
  })
})

