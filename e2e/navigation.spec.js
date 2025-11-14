import { test, expect } from '@playwright/test';

test.describe('Navegación y Enlaces', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería verificar que todos los enlaces del navbar funcionan', async ({ page }) => {
    // Verificar enlaces principales
    await page.click('text=Inicio');
    await expect(page).toHaveURL('/');
    
    await page.click('text=Continentes');
    await expect(page).toHaveURL(/.*categories/);
    
    await page.click('text=Foros');
    await expect(page).toHaveURL(/.*forums/);
  });

  test('debería verificar enlaces del footer', async ({ page }) => {
    // Scroll al footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Verificar enlaces útiles
    await page.click('footer >> text=Continentes');
    await expect(page).toHaveURL(/.*categories/);
    
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.click('footer >> text=Foros');
    await expect(page).toHaveURL(/.*forums/);
    
    // Verificar enlaces legales
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.click('footer >> text=Política de Privacidad');
    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.locator('h1')).toContainText(/privacidad/i);
    
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.click('footer >> text=Términos y Condiciones');
    await expect(page).toHaveURL(/.*terms/);
    await expect(page.locator('h1')).toContainText(/términos/i);
    
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.click('footer >> text=Política de Cookies');
    await expect(page).toHaveURL(/.*cookies/);
    await expect(page.locator('h1')).toContainText(/cookies/i);
  });

  test('debería navegar desde página legal de vuelta al inicio', async ({ page }) => {
    await page.goto('/privacy');
    await page.click('text=Volver al inicio');
    await expect(page).toHaveURL('/');
    
    await page.goto('/terms');
    await page.click('text=Volver al inicio');
    await expect(page).toHaveURL('/');
    
    await page.goto('/cookies');
    await page.click('text=Volver al inicio');
    await expect(page).toHaveURL('/');
  });

  test('debería verificar que los enlaces protegidos redirigen a login', async ({ page }) => {
    // Intentar acceder a rutas protegidas sin autenticación
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*login/);
    
    await page.goto('/forums/create');
    await expect(page).toHaveURL(/.*login/);
  });

  test('debería verificar navegación desde home page', async ({ page }) => {
    await page.goto('/');
    
    // Verificar botones principales
    const exploreButton = page.locator('text=/explorar|continentes/i').first();
    if (await exploreButton.count() > 0) {
      await exploreButton.click();
      await expect(page).toHaveURL(/.*categories|forums/);
    }
  });
});

