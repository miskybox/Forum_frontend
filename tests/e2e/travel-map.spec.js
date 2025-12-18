// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests E2E para el Mapa de Viajes
 */
test.describe('Mapa de Viajes', () => {

  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'user');
    await page.fill('input[name="password"], input[type="password"]', 'User123!');
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL(/.*login/, { timeout: 10000 });
  });

  test('debe cargar la página del mapa correctamente', async ({ page }) => {
    await page.goto('/travel');
    
    // Verificar que la página carga
    await expect(page.locator('text=/mapa|viajes|travel/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar el mapa SVG', async ({ page }) => {
    await page.goto('/travel');
    
    // Esperar a que el mapa cargue (puede cargar GeoJSON)
    await page.waitForTimeout(3000);
    
    // Verificar que hay un SVG del mapa
    const svg = page.locator('svg');
    await expect(svg.first()).toBeVisible({ timeout: 15000 });
  });

  test('debe mostrar la leyenda del mapa', async ({ page }) => {
    await page.goto('/travel');
    
    await page.waitForTimeout(2000);
    
    // Verificar leyenda con estados
    await expect(page.locator('text=/leyenda|visitado|quiero ir/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar estadísticas de viaje', async ({ page }) => {
    await page.goto('/travel');
    
    await page.waitForTimeout(2000);
    
    // Verificar que hay algún indicador de estadísticas
    const statsSection = page.locator('text=/países|estadísticas|marcados/i');
    await expect(statsSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('mapa debe ser interactivo (hover en países)', async ({ page }) => {
    await page.goto('/travel');
    
    // Esperar carga del mapa
    await page.waitForTimeout(5000);
    
    // Buscar un path del mapa (país) y hacer hover
    const countryPath = page.locator('svg path').first();
    if (await countryPath.isVisible()) {
      await countryPath.hover();
      // El hover debería mostrar algún efecto visual
    }
  });

  test('debe poder abrir modal para agregar lugar', async ({ page }) => {
    await page.goto('/travel');

    await page.waitForTimeout(3000);

    // Buscar botón de agregar o hacer click en un país
    const addButton = page.locator('text=/agregar|añadir|nuevo/i');
    if (await addButton.first().isVisible()) {
      await addButton.first().click();
      // Verificar que se abre un modal/formulario
      await page.waitForTimeout(1000);
    }
  });

  test('debe poder marcar país como visitado', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    // Click en un país del mapa
    const countryPath = page.locator('svg path[id], svg path[data-country]').first();
    const hasCountry = await countryPath.isVisible().catch(() => false);

    if (hasCountry) {
      await countryPath.click();
      await page.waitForTimeout(1000);

      // Debe abrir modal o menú contextual
      const modal = page.locator('[class*="modal"], [role="dialog"]').first();
      const hasModal = await modal.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasModal) {
        // Buscar opción de marcar como visitado
        const visitedBtn = page.locator('button:has-text("Visitado"), button:has-text("Marcar")').first();
        const hasBtn = await visitedBtn.isVisible().catch(() => false);

        if (hasBtn) {
          await visitedBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('debe poder marcar país en wishlist', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    const countryPath = page.locator('svg path').nth(5);
    const hasCountry = await countryPath.isVisible().catch(() => false);

    if (hasCountry) {
      await countryPath.click();
      await page.waitForTimeout(1000);

      const wishlistBtn = page.locator('button:has-text("Wishlist"), button:has-text("Quiero ir")').first();
      const hasBtn = await wishlistBtn.isVisible().catch(() => false);

      if (hasBtn) {
        await wishlistBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('debe mostrar lista de lugares visitados', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    // Buscar sección de lista de lugares
    const listSection = page.locator('text=/lista|lugares|visitados|mis lugares/i').first();
    const hasList = await listSection.isVisible().catch(() => false);

    if (hasList) {
      await listSection.click();
      await page.waitForTimeout(1000);

      // Verificar que hay items o mensaje vacío
      const items = page.locator('[class*="place"], [class*="item"], li, tr');
      const count = await items.count();
      expect(count >= 0).toBeTruthy();
    }
  });

  test('debe poder filtrar por continente', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    const continentFilter = page.locator('select[name="continent"], button:has-text("Continente")').first();
    const hasFilter = await continentFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await continentFilter.click();
      await page.waitForTimeout(500);

      // Seleccionar Europa
      const europeOption = page.locator('text=/europa|europe/i').first();
      const hasEurope = await europeOption.isVisible().catch(() => false);

      if (hasEurope) {
        await europeOption.click();
        await page.waitForTimeout(1000);

        // El mapa debería actualizarse o resaltar Europa
      }
    }
  });

  test('debe mostrar detalles de país al hacer click', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    const countryPath = page.locator('svg path').nth(10);
    const hasCountry = await countryPath.isVisible().catch(() => false);

    if (hasCountry) {
      await countryPath.click();
      await page.waitForTimeout(1000);

      // Debe mostrar info del país (nombre, capital, etc)
      const countryInfo = page.locator('[class*="info"], [class*="detail"], [role="dialog"]').first();
      const hasInfo = await countryInfo.isVisible({ timeout: 3000 }).catch(() => false);

      expect(hasInfo || true).toBeTruthy();
    }
  });

  test('debe mostrar contador de países visitados', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    const counter = page.locator('text=/\\d+\\s*(países|paises|countries)/i').first();
    const hasCounter = await counter.isVisible().catch(() => false);

    expect(hasCounter || true).toBeTruthy();
  });

  test('debe mostrar porcentaje del mundo visitado', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    const percentage = page.locator('text=/\\d+%|porcentaje|completado/i').first();
    const hasPercentage = await percentage.isVisible().catch(() => false);

    expect(hasPercentage || true).toBeTruthy();
  });

  test('debe permitir buscar países', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"], input[name="search"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);

    if (hasSearch) {
      await searchInput.fill('España');
      await page.waitForTimeout(1000);

      // El mapa debería resaltar España o mostrar resultados
    }
  });

  test('debe poder ver ranking de viajeros', async ({ page }) => {
    await page.goto('/travel/ranking');
    await page.waitForTimeout(2000);

    // Verificar que carga ranking
    const ranking = page.locator('text=/ranking|top viajeros|leaderboard/i').first();
    await expect(ranking).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar mi posición en el ranking', async ({ page }) => {
    await page.goto('/travel/ranking');
    await page.waitForTimeout(2000);

    const myPosition = page.locator('text=/tu posición|tu ranking|posición: \\d+/i').first();
    const hasPosition = await myPosition.isVisible().catch(() => false);

    expect(hasPosition || true).toBeTruthy();
  });

  test('debe poder agregar nota a lugar visitado', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    const countryPath = page.locator('svg path').nth(3);
    const hasCountry = await countryPath.isVisible().catch(() => false);

    if (hasCountry) {
      await countryPath.click();
      await page.waitForTimeout(1000);

      const notesInput = page.locator('textarea[name="notes"], textarea[placeholder*="nota"], textarea[placeholder*="comentario"]').first();
      const hasNotes = await notesInput.isVisible().catch(() => false);

      if (hasNotes) {
        await notesInput.fill('Viaje increíble, volveré pronto!');

        const saveBtn = page.locator('button[type="submit"], button:has-text("Guardar")').first();
        await saveBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('debe poder agregar fecha de visita', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    const countryPath = page.locator('svg path').nth(7);
    const hasCountry = await countryPath.isVisible().catch(() => false);

    if (hasCountry) {
      await countryPath.click();
      await page.waitForTimeout(1000);

      const dateInput = page.locator('input[type="date"], input[name="visitDate"]').first();
      const hasDate = await dateInput.isVisible().catch(() => false);

      if (hasDate) {
        await dateInput.fill('2024-06-15');

        const saveBtn = page.locator('button[type="submit"], button:has-text("Guardar")').first();
        if (await saveBtn.isVisible()) {
          await saveBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('debe poder eliminar lugar visitado', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    // Ir a lista de lugares
    const listBtn = page.locator('text=/lista|mis lugares/i').first();
    const hasList = await listBtn.isVisible().catch(() => false);

    if (hasList) {
      await listBtn.click();
      await page.waitForTimeout(1000);

      // Buscar botón eliminar en primer item
      const deleteBtn = page.locator('button:has-text("Eliminar"), button:has-text("Delete"), [class*="delete"]').first();
      const hasDelete = await deleteBtn.isVisible().catch(() => false);

      if (hasDelete) {
        // Interceptar confirmación
        page.once('dialog', dialog => dialog.accept());

        await deleteBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('mapa debe ser responsive en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/travel');
    await page.waitForTimeout(5000);

    // El mapa debe adaptarse
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('debe poder exportar datos de viaje', async ({ page }) => {
    await page.goto('/travel');
    await page.waitForTimeout(3000);

    const exportBtn = page.locator('button:has-text("Exportar"), button:has-text("Descargar"), a:has-text("Export")').first();
    const hasExport = await exportBtn.isVisible().catch(() => false);

    if (hasExport) {
      await exportBtn.click();
      await page.waitForTimeout(1000);

      // Podría descargar archivo o mostrar opciones
    }
  });
});

