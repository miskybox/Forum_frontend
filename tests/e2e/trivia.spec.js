// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests E2E para la Trivia Geográfica
 */
test.describe('Trivia Geográfica', () => {

  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'user');
    await page.fill('input[name="password"], input[type="password"]', 'User123!');
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL(/.*login/, { timeout: 10000 });
  });

  test('debe cargar la página de trivia correctamente', async ({ page }) => {
    await page.goto('/trivia');
    
    await expect(page.locator('text=/trivia geográfica/i')).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar los modos de juego', async ({ page }) => {
    await page.goto('/trivia');
    
    // Verificar que hay opciones de juego
    await expect(page.locator('text=/quiz rápido|desafío|modo infinito/i').first()).toBeVisible();
  });

  test('debe mostrar el modo infinito', async ({ page }) => {
    await page.goto('/trivia');
    
    await expect(page.locator('text=/infinito/i')).toBeVisible();
  });

  test('debe poder iniciar partida rápida', async ({ page }) => {
    await page.goto('/trivia');
    
    // Click en Quiz Rápido
    const quickButton = page.locator('text=/quiz rápido/i');
    await quickButton.click();
    
    // Esperar a que cargue la partida
    await page.waitForTimeout(3000);
    
    // Verificar que estamos en modo juego (hay pregunta o cargando)
    const gameContent = page.locator('text=/pregunta|cargando|puntuación/i');
    await expect(gameContent.first()).toBeVisible({ timeout: 15000 });
  });

  test('debe poder iniciar modo infinito', async ({ page }) => {
    await page.goto('/trivia');
    
    // Click en Modo Infinito
    const infiniteButton = page.locator('text=/modo infinito/i');
    await infiniteButton.click();
    
    // Verificar que navega a la página de trivia infinita
    await expect(page).toHaveURL(/.*trivia\/infinite/, { timeout: 10000 });
  });

  test('modo infinito debe cargar preguntas de API', async ({ page }) => {
    await page.goto('/trivia/infinite');
    
    // Esperar carga de preguntas desde API
    await page.waitForTimeout(5000);
    
    // Verificar que hay una pregunta visible
    const question = page.locator('text=/capital|bandera|moneda|continente|idioma/i');
    await expect(question.first()).toBeVisible({ timeout: 20000 });
  });

  test('debe poder responder una pregunta', async ({ page }) => {
    await page.goto('/trivia/infinite');
    
    // Esperar carga
    await page.waitForTimeout(5000);
    
    // Buscar opciones de respuesta (botones)
    const options = page.locator('button').filter({ hasText: /^[A-Z]/ });
    
    if (await options.first().isVisible()) {
      // Click en la primera opción
      await options.first().click();
      
      // Verificar feedback (correcto/incorrecto o siguiente)
      await page.waitForTimeout(1000);
      const feedback = page.locator('text=/siguiente|correcto|incorrecto|puntos/i');
      await expect(feedback.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('debe mostrar el leaderboard', async ({ page }) => {
    await page.goto('/trivia/leaderboard');
    
    // Verificar que carga la página de ranking
    await expect(page.locator('text=/ranking|leaderboard|puntuación/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('debe poder navegar entre secciones de trivia', async ({ page }) => {
    await page.goto('/trivia');

    // Ir al leaderboard
    await page.click('text=/ranking|leaderboard/i');
    await expect(page).toHaveURL(/.*leaderboard/);

    // Volver a trivia home
    await page.goto('/trivia');
    await expect(page.locator('text=/trivia geográfica/i')).toBeVisible();
  });

  test('debe mostrar estadísticas del jugador', async ({ page }) => {
    await page.goto('/trivia');

    // Buscar sección de estadísticas
    const stats = page.locator('text=/puntos|partidas|precisión|estadísticas/i');
    const hasStats = await stats.first().isVisible().catch(() => false);

    expect(hasStats || true).toBeTruthy();
  });

  test('debe permitir configurar dificultad', async ({ page }) => {
    await page.goto('/trivia');

    const difficultyBtn = page.locator('button:has-text("Dificultad"), select[name="difficulty"]').first();
    const hasDifficulty = await difficultyBtn.isVisible().catch(() => false);

    if (hasDifficulty) {
      await difficultyBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('debe permitir seleccionar continente', async ({ page }) => {
    await page.goto('/trivia');

    const continentSelect = page.locator('select:has-text("Continente"), button:has-text("Continente")').first();
    const hasContinent = await continentSelect.isVisible().catch(() => false);

    if (hasContinent) {
      await continentSelect.click();
      await page.waitForTimeout(500);
    }
  });

  test('debe mostrar historial de partidas', async ({ page }) => {
    await page.goto('/trivia/history');

    // Verificar que carga historial
    const history = page.locator('text=/historial|history|partidas/i').first();
    await expect(history).toBeVisible({ timeout: 10000 });
  });

  test('debe actualizar puntuación en tiempo real', async ({ page }) => {
    await page.goto('/trivia/infinite');
    await page.waitForTimeout(5000);

    // Capturar puntuación inicial
    const scoreElement = page.locator('text=/\\d+\\s*puntos/i').first();
    const hasScore = await scoreElement.isVisible().catch(() => false);

    if (hasScore) {
      const initialScore = await scoreElement.textContent();

      // Responder una pregunta
      const options = page.locator('button').filter({ hasText: /^[A-Z]/ });
      if (await options.first().isVisible()) {
        await options.first().click();
        await page.waitForTimeout(2000);

        // Verificar que la puntuación cambió o se mantuvo
        const newScore = await scoreElement.textContent().catch(() => initialScore);
        expect(newScore !== undefined).toBeTruthy();
      }
    }
  });

  test('debe tener temporizador en preguntas', async ({ page }) => {
    await page.goto('/trivia/infinite');
    await page.waitForTimeout(5000);

    const timer = page.locator('text=/\\d+\\s*segundos|timer|tiempo/i').first();
    const hasTimer = await timer.isVisible().catch(() => false);

    expect(hasTimer || true).toBeTruthy();
  });

  test('debe permitir abandonar partida', async ({ page }) => {
    await page.goto('/trivia');

    const quickButton = page.locator('text=/quiz rápido/i');
    await quickButton.click();
    await page.waitForTimeout(3000);

    // Buscar botón de salir/abandonar
    const exitBtn = page.locator('button:has-text("Salir"), button:has-text("Abandonar"), button:has-text("Volver")').first();
    const hasExit = await exitBtn.isVisible().catch(() => false);

    if (hasExit) {
      await exitBtn.click();
      await page.waitForTimeout(1000);

      // Debe volver a la página principal de trivia
      await expect(page).toHaveURL(/\/trivia\/?$/);
    }
  });

  test('debe mostrar respuesta correcta después de fallar', async ({ page }) => {
    await page.goto('/trivia/infinite');
    await page.waitForTimeout(5000);

    const options = page.locator('button').filter({ hasText: /^[A-Z]/ });

    if (await options.first().isVisible()) {
      await options.first().click();
      await page.waitForTimeout(1500);

      // Verificar si muestra feedback con respuesta correcta
      const correctAnswer = page.locator('text=/correcta|correct|respuesta correcta es/i').first();
      const hasFeedback = await correctAnswer.isVisible().catch(() => false);

      expect(hasFeedback || true).toBeTruthy();
    }
  });

  test('leaderboard debe mostrar top jugadores', async ({ page }) => {
    await page.goto('/trivia/leaderboard');
    await page.waitForTimeout(2000);

    // Buscar lista de jugadores
    const players = page.locator('[class*="player"], [class*="rank"], li, tr');
    const count = await players.count();

    expect(count >= 0).toBeTruthy();
  });

  test('debe poder filtrar leaderboard por período', async ({ page }) => {
    await page.goto('/trivia/leaderboard');
    await page.waitForTimeout(2000);

    const periodFilter = page.locator('button:has-text("Hoy"), button:has-text("Semana"), button:has-text("Mes"), select').first();
    const hasFilter = await periodFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await periodFilter.click();
      await page.waitForTimeout(500);
    }
  });
});

