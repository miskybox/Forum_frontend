// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Navegación General
 */
test.describe('Navegación', () => {

  test('debe cargar la página principal correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el navbar está presente
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    
    // Verificar elementos principales
    await expect(page.locator('text=/inicio|home/i').first()).toBeVisible();
  });

  test('debe navegar a Categorías/Continentes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Usar selector por href en vez de texto
    await page.locator('a[href="/categories"]').first().click();
    await expect(page).toHaveURL(/\/categories$/);
  });

  test('debe navegar a Foros', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Usar selector por href
    await page.locator('a[href="/forums"]').first().click();
    await expect(page).toHaveURL(/\/forums$/);
  });

  test('debe mostrar página 404 para rutas inexistentes', async ({ page }) => {
    await page.goto('/ruta-que-no-existe-12345');
    await page.waitForLoadState('networkidle');

    // Verificar que muestra contenido de 404 (puede ser h1 o cualquier texto con "404")
    const has404 = await page.locator('text=/404|no encontrada|not found|página no encontrada/i').first().isVisible().catch(() => false);
    expect(has404).toBeTruthy();
  });

  test('debe tener footer visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navbar debe ser responsive', async ({ page }) => {
    await page.goto('/');

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });
});

test.describe('Navegación (autenticado)', () => {
  test.use({ storageState: 'tests/.auth/user.json' });

  test('debe navegar a Trivia', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navegar a Trivia usando href
    await page.locator('a[href="/trivia"]').first().click();
    await expect(page).toHaveURL(/\/trivia$/);
    // Verificar que la página cargó
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('debe navegar a Mi Mapa', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navegar a Mi Mapa usando href
    await page.locator('a[href="/travel"]').first().click();
    await expect(page).toHaveURL(/\/travel$/);
  });
});

