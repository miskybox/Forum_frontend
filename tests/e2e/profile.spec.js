// @ts-check
import { test, expect } from '@playwright/test';

/**
 * E2E tests for the signed-in user's profile, which acts as the user dashboard.
 * The app has no /dashboard route; the previous spec loaded the 404 page.
 *
 * Uses the viajero_demo session saved by tests/global-setup.ts to avoid the
 * /api/auth/login rate limit.
 */
test.use({ storageState: 'tests/.auth/user.json' });

test.describe('Perfil - Panel del usuario', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('carga el perfil del usuario', async ({ page }) => {
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('@viajero_demo').first()).toBeVisible();
  });

  test('muestra las estadísticas del usuario', async ({ page }) => {
    for (const label of [/publicaciones/i, /foros creados/i, /comentarios/i, /países visitados/i]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
  });

  test('el menú de usuario enlaza a Mi Perfil', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'User menu' }).click();
    await page.getByRole('menuitem', { name: /mi perfil/i }).click();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test('la pestaña Editar perfil muestra el formulario', async ({ page }) => {
    await page.getByRole('tab', { name: /editar perfil/i }).click();
    await expect(page.getByLabel(/nombre completo/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /actualizar perfil/i })).toBeVisible();
  });

  test('el botón Editar perfil de la cabecera abre la misma pestaña', async ({ page }) => {
    await page.getByRole('button', { name: /editar perfil/i }).first().click();
    await expect(page.getByRole('tab', { name: /editar perfil/i })).toHaveAttribute('aria-selected', 'true');
  });

  test('la tarjeta de territorio enlaza al mapa de viajes', async ({ page }) => {
    await page.getByRole('link', { name: /abrir mi mapa/i }).click();
    await expect(page).toHaveURL(/\/travel/);
  });
});

test.describe('Perfil - Responsive', () => {
  for (const [name, viewport] of [
    ['mobile', { width: 375, height: 667 }],
    ['tablet', { width: 768, height: 1024 }],
    ['desktop', { width: 1920, height: 1080 }],
  ]) {
    test(`se muestra correctamente en ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
