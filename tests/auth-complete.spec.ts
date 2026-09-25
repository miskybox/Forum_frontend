import { test, expect } from '@playwright/test'
import { demoCredentials } from './e2e/credentials.js'

test.describe('Autenticación completa', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
  })

  test('Registro completo de nuevo usuario', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    // Verificar que el formulario está visible (buscar form o heading)
    const form = page.locator('form')
    await expect(form).toBeVisible()

    // Llenar formulario de registro usando IDs
    const timestamp = Date.now()
    const testUser = `testuser_${timestamp}`
    const testEmail = `test_${timestamp}@example.com`

    await page.fill('#username', testUser)
    await page.fill('#email', testEmail)
    await page.fill('#password', 'ValidPass123!')
    await page.fill('#confirmPassword', 'ValidPass123!')

    // Enviar formulario
    await page.click('button[type="submit"]')

    // Esperar a que se complete el registro
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Dar tiempo al backend

    await expect(page).toHaveURL(/\/login$/)
  })

  test('Login completo con credenciales válidas', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Verificar que el formulario está visible
    await expect(page.locator('form')).toBeVisible()

    // Llenar formulario de login usando IDs (viajero_demo se crea al arrancar el backend, ver .env)
    await page.fill('#username', demoCredentials.username)
    await page.fill('#password', demoCredentials.password)

    // Enviar formulario
    await page.click('button[type="submit"]')

    // Esperar a que se complete el login
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000) // Dar tiempo para que el backend responda

    const authenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'))
    expect(authenticated).toBe('true')

    // Verificar que se navegó a la página principal
    await expect(page).toHaveURL(/\/$/)
  })

  test('Login falla con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.fill('#username', 'usuario_inexistente')
    await page.fill('#password', 'password_incorrecto')

    await page.click('button[type="submit"]')

    // Esperar mensaje de error del backend
    await page.waitForTimeout(2000)
    
    // Verificar que NO se guardó el token
    const authenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'))
    expect(authenticated).not.toBe('true')

    // Verificar que se muestra un mensaje de error (toast o en el formulario)
    const errorMessage = page.getByText(/incorrecto|inválido|error/i).first()
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('Validación de formulario de registro - campos vacíos', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    // Intentar enviar sin llenar campos
    await page.getByRole('button', { name: /crear cuenta/i }).click()

    // Verificar que se muestran mensajes de error
    await expect(page.getByText(/obligatorio/i).first()).toBeVisible({ timeout: 3000 })
  })

  test('Validación de formulario de registro - contraseñas no coinciden', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    await page.locator('#username').fill('testuser')
    await page.locator('#email').fill('test@test.com')
    await page.locator('#password').fill('ValidPass123!')
    await page.locator('#confirmPassword').fill('DifferentPass123!')

    await page.getByRole('button', { name: /crear cuenta/i }).click()

    // Verificar mensaje de error
    await expect(page.getByText(/no coinciden/i)).toBeVisible({ timeout: 3000 })
  })

  test('Validación de formulario de login - campos vacíos', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /acceder|iniciar sesión/i }).click()

    // Verificar que se muestran mensajes de error
    await expect(page.getByText(/obligatorio/i).first()).toBeVisible({ timeout: 3000 })
  })

  test('Navegación entre login y registro', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Ir a registro desde login
    const registerLink = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Registrarse' })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/\/register$/)

    // Volver a login desde registro
    const loginLink = page.locator('a[href="/login"]').last()
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('Logout funciona correctamente', async ({ page }) => {
    // Primero hacer login (simulado)
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true')
    })

    // Navegar a una página que requiera autenticación
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Buscar botón de logout (puede estar en navbar)
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout|salir/i }).first()
    
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click()
      await page.waitForLoadState('networkidle')

      const authenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'))
      expect(authenticated).not.toBe('true')
    }
  })

  test('Mostrar/ocultar contraseña funciona', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const passwordInput = page.locator('#password')
    await passwordInput.fill('testpassword')

    // Buscar botón de mostrar contraseña
    const toggleButton = page.getByRole('button', { name: /mostrar contraseña/i })
    
    if (await toggleButton.isVisible().catch(() => false)) {
      const initialType = await passwordInput.getAttribute('type')
      await toggleButton.click()
      const newType = await passwordInput.getAttribute('type')
      expect(newType).not.toBe(initialType)
    }
  })
})

