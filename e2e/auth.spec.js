import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('debe mostrar formulario de login', async ({ page }) => {
    await page.click('text=/ACCEDER|Iniciar Sesión/i')
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('debe mostrar formulario de registro', async ({ page }) => {
    await page.click('text=/REGISTRARSE|Registrarse/i')
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
  })

  test('el campo usuario debe ser editable', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    const usernameInput = page.locator('input[name="username"]')
    
    await usernameInput.fill('testuser')
    await expect(usernameInput).toHaveValue('testuser')
  })

  test('el campo contraseña debe ser editable', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    const passwordInput = page.locator('input[name="password"]')
    
    await passwordInput.fill('Test1234!')
    await expect(passwordInput).toHaveValue('Test1234!')
  })

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="username"]', 'usuario_inexistente')
    await page.fill('input[name="password"]', 'password_incorrecta')
    await page.click('button[type="submit"]')
    
    // Esperar a que aparezca el mensaje de error (puede ser toast o mensaje en el formulario)
    await expect(
      page.locator('text=/incorrecto|error|inválid/i').or(page.locator('.toast-error'))
    ).toBeVisible({ timeout: 10000 })
  })

  test('debe validar campos requeridos', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.click('button[type="submit"]')
    
    // El formulario HTML5 debe prevenir el envío
    const usernameInput = page.locator('input[name="username"]')
    await expect(usernameInput).toHaveAttribute('required')
  })
})

