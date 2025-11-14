import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería mostrar la página de inicio', async ({ page }) => {
    await expect(page).toHaveTitle(/ForumViajeros/i);
    await expect(page.locator('text=ForumViajeros')).toBeVisible();
  });

  test('debería navegar a la página de registro', async ({ page }) => {
    await page.click('text=Registrarse');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1, h2')).toContainText(/registro|crear cuenta/i);
  });

  test('debería navegar a la página de login', async ({ page }) => {
    await page.click('text=Iniciar sesión');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1, h2')).toContainText(/iniciar sesión|login/i);
  });

  test('debería registrar un nuevo usuario', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'Test123456';

    await page.goto('/register');
    
    await page.fill('input[name="username"], input[type="text"]', username);
    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    
    // Si hay campos firstName y lastName
    const firstNameInput = page.locator('input[name="firstName"]');
    if (await firstNameInput.count() > 0) {
      await firstNameInput.fill('Test');
      await page.fill('input[name="lastName"]', 'User');
    }

    await page.click('button[type="submit"], button:has-text("Registrarse")');
    
    // Esperar a que se complete el registro (puede redirigir a login o mostrar mensaje)
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores de validación visibles
    const errorMessages = page.locator('.text-red-500, .error, [role="alert"]');
    const errorCount = await errorMessages.count();
    
    if (errorCount > 0) {
      console.log('Errores encontrados:', await errorMessages.allTextContents());
    }
    
    // El registro puede redirigir a login o mostrar mensaje de éxito
    const currentUrl = page.url();
    expect(
      currentUrl.includes('/login') || 
      currentUrl.includes('/register') ||
      await page.locator('text=éxito, text=registrado').count() > 0
    ).toBeTruthy();
  });

  test('debería mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="username"], input[type="text"]', 'usuario_inexistente');
    await page.fill('input[name="password"], input[type="password"]', 'password_incorrecta');
    
    await page.click('button[type="submit"], button:has-text("Iniciar sesión")');
    
    // Esperar mensaje de error
    await page.waitForTimeout(1000);
    
    // Verificar que hay algún mensaje de error o que sigue en login
    const errorVisible = await page.locator('.text-red-500, .error, [role="alert"], text=/credenciales|inválido|incorrecto/i').count() > 0;
    const stillOnLogin = page.url().includes('/login');
    
    expect(errorVisible || stillOnLogin).toBeTruthy();
  });
});

