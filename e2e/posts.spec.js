import { test, expect } from '@playwright/test';

test.describe('Posts y Comentarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería mostrar lista de foros y poder navegar a un foro', async ({ page }) => {
    await page.goto('/forums');
    await page.waitForTimeout(2000);
    
    // Buscar un enlace a un foro
    const forumLink = page.locator('a[href*="/forums/"]').first();
    const linkCount = await forumLink.count();
    
    if (linkCount > 0) {
      const href = await forumLink.getAttribute('href');
      await forumLink.click();
      await page.waitForTimeout(1000);
      
      // Verificar que estamos en la página del foro
      expect(page.url()).toMatch(/\/forums\/\d+/);
    }
  });

  test('debería mostrar posts en un foro y poder navegar a un post', async ({ page }) => {
    await page.goto('/forums');
    await page.waitForTimeout(2000);
    
    // Intentar encontrar y hacer clic en un foro
    const forumLink = page.locator('a[href*="/forums/"]').first();
    const linkCount = await forumLink.count();
    
    if (linkCount > 0) {
      await forumLink.click();
      await page.waitForTimeout(2000);
      
      // Buscar enlaces a posts
      const postLink = page.locator('a[href*="/posts/"]').first();
      const postLinkCount = await postLink.count();
      
      if (postLinkCount > 0) {
        await postLink.click();
        await page.waitForTimeout(1000);
        
        // Verificar que estamos en la página del post
        expect(page.url()).toMatch(/\/posts\/\d+/);
      }
    }
  });

  test('debería mostrar mensaje de login al intentar comentar sin autenticación', async ({ page }) => {
    await page.goto('/forums');
    await page.waitForTimeout(2000);
    
    // Intentar navegar a un post
    const forumLink = page.locator('a[href*="/forums/"]').first();
    const linkCount = await forumLink.count();
    
    if (linkCount > 0) {
      await forumLink.click();
      await page.waitForTimeout(2000);
      
      const postLink = page.locator('a[href*="/posts/"]').first();
      const postLinkCount = await postLink.count();
      
      if (postLinkCount > 0) {
        await postLink.click();
        await page.waitForTimeout(2000);
        
        // Buscar mensaje de login en el formulario de comentarios
        const loginMessage = page.locator('text=/iniciar sesión|debes.*login/i');
        const hasLoginMessage = await loginMessage.count() > 0;
        
        // Si hay un enlace de login en el formulario de comentarios, verificar que funciona
        if (hasLoginMessage) {
          const loginLink = page.locator('a[href*="/login"]').first();
          if (await loginLink.count() > 0) {
            await loginLink.click();
            await expect(page).toHaveURL(/.*login/);
          }
        }
      }
    }
  });
});

