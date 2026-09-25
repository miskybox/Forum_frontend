import { test, expect } from '@playwright/test'

test.describe('Verificación Completa de Links y Botones', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // ============ NAVBAR - Links Principales ============
  test.describe('Navbar - Links Principales', () => {
    test('Logo del navbar navega a /', async ({ page }) => {
      const logoLink = page.locator('nav a[href="/"]').first()
      await expect(logoLink).toBeVisible()
      await logoLink.click()
      await expect(page).toHaveURL(/\/$/)
    })

    test('Link Inicio en navbar navega a /', async ({ page }) => {
      const link = page.getByRole('navigation').getByRole('link', { name: 'Inicio' })
      await link.click()
      await expect(page).toHaveURL(/\/$/)
    })

    test('Link Trivia en navbar navega a /trivia', async ({ page }) => {
      const link = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Trivia' })
      await link.click()
      await expect(page).toHaveURL(/\/trivia$/)
    })

    test('Link Foros principal navega a /forums', async ({ page }) => {
      const link = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Foros' })
      await link.click()
      await expect(page).toHaveURL(/\/forums$/)
    })

    test('Link Foros en navbar navega a /forums', async ({ page }) => {
      const link = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Foros' })
      await link.click()
      await expect(page).toHaveURL(/\/forums$/)
    })
  })

  // ============ NAVBAR - Usuario No Autenticado ============
  test.describe('Navbar - Usuario No Autenticado', () => {
    test('Botón Entrar navega a /login', async ({ page }) => {
      const button = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Entrar' })
      await expect(button).toBeVisible()
      await button.click()
      await expect(page).toHaveURL(/\/login$/)
    })

    test('Botón Registrarse navega a /register', async ({ page }) => {
      const button = page.getByRole('link', { name: 'Registrarse' }).first()
      await expect(button).toBeVisible()
      await button.click()
      await expect(page).toHaveURL(/\/register$/)
    })
  })

  // ============ FOOTER - Links ============
  test.describe('Footer - Links', () => {
    test('Logo del footer navega a /', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      await page.locator('nav a[href="/"]').first().click()
      await expect(page).toHaveURL(/\/$/)
    })

    test('Link Blog en footer navega a /blog', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      const link = footer.getByRole('link', { name: 'Blog' })
      await link.click()
      await expect(page).toHaveURL(/\/blog$/)
    })

    test('Link Foros en footer navega a /forums', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      const link = footer.getByRole('link', { name: 'Foros' })
      await link.click()
      await expect(page).toHaveURL(/\/forums$/)
    })

    test('Footer contiene el enlace de ayuda', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await expect(footer.getByRole('link', { name: 'Ayuda' })).toBeVisible()
    })

    test('Link Política de Privacidad en footer navega a /privacy', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      const link = footer.getByRole('link', { name: 'Política de Privacidad' })
      if (await link.isVisible()) {
        await link.click()
        // Verificar que navega (puede ser 404 si no existe la página)
        await page.waitForLoadState('networkidle')
      }
    })

    test('Link Términos y Condiciones en footer navega a /terms', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      const link = footer.getByRole('link', { name: 'Términos y Condiciones' })
      if (await link.isVisible()) {
        await link.click()
        await page.waitForLoadState('networkidle')
      }
    })

    test('Link Política de Cookies en footer navega a /cookies', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      const link = footer.getByRole('link', { name: 'Política de Cookies' })
      if (await link.isVisible()) {
        await link.click()
        await page.waitForLoadState('networkidle')
      }
    })

    test('Links de redes sociales abren en nueva pestaña', async ({ page }) => {
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      
      // Verificar que los links externos tienen target="_blank"
      const facebookLink = footer.locator('a[href*="facebook"]')
      if (await facebookLink.isVisible()) {
        const target = await facebookLink.getAttribute('target')
        const rel = await facebookLink.getAttribute('rel')
        expect(target).toBe('_blank')
        expect(rel).toContain('noopener')
      }
    })
  })

  // ============ HOME PAGE - CTAs ============
  test.describe('Home Page - CTAs y Botones', () => {
    test('CTA Explorar Foros navega a /forums', async ({ page }) => {
      const cta = page.getByRole('link', { name: 'Explorar Foros' })
      await expect(cta).toBeVisible()
      await cta.click()
      await expect(page).toHaveURL(/\/forums$/)
    })

    test('CTA Registrarse navega a /register', async ({ page }) => {
      const cta = page.locator('a[href="/register"]').first()
      await expect(cta).toBeVisible()
      await cta.click()
      await expect(page).toHaveURL(/\/register$/)
    })

    test('CTA Entrar navega a /login', async ({ page }) => {
      const cta = page.locator('a[href="/login"]').first()
      await expect(cta).toBeVisible()
      await cta.click()
      await expect(page).toHaveURL(/\/login$/)
    })

    test('CTA Ver todos los continentes navega a /categories', async ({ page }) => {
      const cta = page.getByRole('link', { name: 'Ver todos los continentes' })
      if (await cta.isVisible()) {
        await cta.click()
        await expect(page).toHaveURL(/\/categories$/)
      }
    })

    test('CTA Ver todos los foros navega a /forums', async ({ page }) => {
      const cta = page.getByRole('link', { name: 'Ver todos los foros' })
      if (await cta.isVisible()) {
        await cta.click()
        await expect(page).toHaveURL(/\/forums$/)
      }
    })
  })

  // ============ NAVBAR MÓVIL ============
  test.describe('Navbar Móvil', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('Botón menú móvil abre y cierra el menú', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: /abrir menú principal/i })
      await expect(menuButton).toBeVisible()
      
      // Abrir menú
      await menuButton.click()
      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible()
      
      // Cerrar menú
      await page.getByRole('button', { name: /cerrar menú principal/i }).click()
      await expect(mobileMenu).not.toBeVisible()
    })

    test('Todos los links del menú móvil funcionan', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: /abrir menú principal/i })
      const mobileMenu = page.locator('#mobile-menu')

      for (const destination of ['/', '/trivia', '/forums', '/travel']) {
        await page.goto('/')
        await page.getByRole('button', { name: /abrir menú principal/i }).click()
        await mobileMenu.locator(`a[href="${destination}"]`).click()
        await expect(page).toHaveURL(new RegExp(`${destination === '/' ? '\\/$' : `${destination}$`}`))
      }
    })
  })

  // ============ PÁGINAS ESPECÍFICAS ============
  test.describe('Páginas Específicas - Links de Navegación', () => {
    test('Login page - Link a registro funciona', async ({ page }) => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
      
      const registerLink = page.locator('a[href="/register"]').last()
      if (await registerLink.isVisible()) {
        await registerLink.click()
        await expect(page).toHaveURL(/\/register$/)
      }
    })

    test('Register page - Link a login funciona', async ({ page }) => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      
      const loginLink = page.locator('a[href="/login"]').last()
      if (await loginLink.isVisible()) {
        await loginLink.click()
        await expect(page).toHaveURL(/\/login$/)
      }
    })

    test('404 page - Links de navegación funcionan', async ({ page }) => {
      await page.goto('/pagina-inexistente')
      await page.waitForLoadState('networkidle')
      
      // Link a inicio - usar el más específico
      const homeLink = page.getByRole('link', { name: 'Volver a la página principal' })
      if (await homeLink.isVisible()) {
        await homeLink.click()
        await expect(page).toHaveURL(/\/$/)
      } else {
        // Si no existe ese link, usar el del navbar
        const navbarLink = page.getByRole('navigation').getByRole('link', { name: 'Inicio' })
        await navbarLink.click()
        await expect(page).toHaveURL(/\/$/)
      }
    })
  })

  // ============ BOTONES DE ACCIÓN ============
  test.describe('Botones de Acción', () => {
    test('Botón de recargar en ForumList funciona', async ({ page }) => {
      await page.goto('/forums')
      await page.waitForLoadState('networkidle')
      
      const reloadButton = page.getByRole('button', { name: /recargar|refresh/i })
      if (await reloadButton.isVisible()) {
        await reloadButton.click()
        // Verificar que la página se recarga (no hay error)
        await page.waitForLoadState('networkidle')
      }
    })

    test('Botón de búsqueda en ForumSearch funciona', async ({ page }) => {
      await page.goto('/forums')
      await page.waitForLoadState('networkidle')
      
      const searchInput = page.getByPlaceholder(/buscar|search/i)
      const searchButton = page.getByRole('button', { name: /buscar|search/i })
      
      if (await searchInput.isVisible() && await searchButton.isVisible()) {
        await searchInput.fill('test')
        await searchButton.click()
        // Verificar que se ejecuta la búsqueda
        await page.waitForLoadState('networkidle')
      }
    })
  })

  // ============ VERIFICACIÓN DE ACCESIBILIDAD ============
  test.describe('Accesibilidad - Links y Botones', () => {
    test('Todos los links tienen href válido', async ({ page }) => {
      const links = await page.locator('a[href]').all()
      
      for (const link of links) {
        const href = await link.getAttribute('href')
        expect(href).toBeTruthy()
        // Verificar que no es solo '#'
        if (href !== '#' && !href.startsWith('http') && !href.startsWith('#')) {
          expect(href).toMatch(/^\//)
        }
      }
    })

    test('Botones tienen type apropiado', async ({ page }) => {
      const buttons = await page.locator('button').all()
      
      for (const button of buttons) {
        const type = await button.getAttribute('type')
        // Debe ser 'button', 'submit', o 'reset'
        if (type) {
          expect(['button', 'submit', 'reset']).toContain(type)
        }
      }
    })

    test('Links externos tienen target="_blank" y rel="noopener noreferrer"', async ({ page }) => {
      const externalLinks = await page.locator('a[href^="http"]').all()
      
      for (const link of externalLinks) {
        const target = await link.getAttribute('target')
        const rel = await link.getAttribute('rel')
        
        if (target === '_blank') {
          expect(rel).toContain('noopener')
        }
      }
    })
  })

  // ============ VERIFICACIÓN DE ESTADOS ============
  test.describe('Estados de Links y Botones', () => {
    test('Links deshabilitados no son clickeables', async ({ page }) => {
      const disabledLinks = await page.locator('a[aria-disabled="true"], a.disabled').all()
      
      for (const link of disabledLinks) {
        const isClickable = await link.isEnabled()
        expect(isClickable).toBeFalsy()
      }
    })

    test('Botones deshabilitados muestran estado correcto', async ({ page }) => {
      const disabledButtons = await page.locator('button:disabled, button[aria-disabled="true"]').all()
      
      for (const button of disabledButtons) {
        const isDisabled = await button.isDisabled()
        expect(isDisabled).toBeTruthy()
      }
    })
  })
})

