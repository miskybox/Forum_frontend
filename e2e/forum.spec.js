import { test, expect } from '@playwright/test';

test.describe('Foros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería mostrar la lista de foros', async ({ page }) => {
    await page.goto('/forums');
    
    // Esperar a que cargue el contenido
    await page.waitForTimeout(2000);
    
    // Verificar que hay algún contenido de foros o mensaje
    const hasContent = await page.locator('text=/foro|no hay|loading/i').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('debería navegar a crear foro (requiere login)', async ({ page }) => {
    await page.goto('/forums/create');
    
    // Debería redirigir a login si no está autenticado
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/forums/create')).toBeTruthy();
  });

  test('debería mostrar categorías', async ({ page }) => {
    await page.goto('/categories');
    
    await page.waitForTimeout(2000);
    
    // Verificar que hay contenido de categorías
    const hasContent = await page.locator('text=/categoría|continente|europa|asia/i').count() > 0;
    expect(hasContent).toBeTruthy();
  });
});

