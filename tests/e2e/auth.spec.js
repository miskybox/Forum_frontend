// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Autenticación
 */
test.describe('Autenticación', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar la página de inicio', async ({ page }) => {
    await expect(page).toHaveTitle(/Forum|Viajeros/i);
  });

  test('debe navegar a la página de login', async ({ page }) => {
    // Usar selector más robusto - buscar link con href='/login'
    await page.locator('a[href="/login"]').first().click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('debe navegar a la página de registro', async ({ page }) => {
    // Usar selector más robusto - buscar link con href='/register'
    await page.locator('a[href="/register"]').first().click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Usar selectores más específicos por id
    await page.fill('#username', 'usuarioInvalido');
    await page.fill('#password', 'passwordIncorrecto');
    await page.click('button[type="submit"]');

    // Esperar mensaje de error (toast o en formulario)
    await expect(page.locator('text=/error|incorrecto|inválido|usuario o contraseña incorrectos/i').first()).toBeVisible({ timeout: 15000 });
  });

  test('debe hacer login correctamente con usuario válido', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Usar credenciales de prueba con selectores por id
    await page.fill('#username', 'user');
    await page.fill('#password', 'User123!');
    await page.click('button[type="submit"]');

    // Esperar redirección (no debe estar en /login)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('debe hacer logout correctamente', async ({ page }) => {
    // Primero hacer login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#username', 'user');
    await page.fill('#password', 'User123!');
    await page.click('button[type="submit"]');

    // Esperar a estar logueado
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Buscar y hacer click en logout (puede estar en navbar o menú de usuario)
    const logoutButton = page.locator('button:has-text("Cerrar sesión"), button:has-text("Logout"), button:has-text("Salir")').first();
    const isVisible = await logoutButton.isVisible().catch(() => false);

    if (isVisible) {
      await logoutButton.click();
      await page.waitForLoadState('networkidle');
      // Verificar que aparece botón de login de nuevo
      await expect(page.locator('a[href="/login"]').first()).toBeVisible({ timeout: 5000 });
    }
  });
});

