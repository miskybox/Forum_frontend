# Análisis de Fallos de Tests E2E

## Resumen Ejecutivo

**Total de tests:** 198
- ✅ **Pasando:** 130 (65.7%)
- ❌ **Fallando:** 63 (31.8%)
- ⏸️ **Omitidos:** 5 (2.5%)

## Categorías de Fallos

### 1. Tests de Autenticación (Backend NO corriendo) - 23 fallos

**Tests afectados:**
- ❌ `auth-complete.spec.ts` → Registro completo de nuevo usuario
- ❌ `auth-complete.spec.ts` → Login completo con credenciales válidas
- ❌ `auth-complete.spec.ts` → Login falla con credenciales inválidas
- ❌ `auth-complete.spec.ts` → Validación de formulario de registro - campos vacíos
- ❌ `auth-complete.spec.ts` → Validación de formulario de registro - contraseñas no coinciden
- ❌ `auth-complete.spec.ts` → Validación de formulario de login - campos vacíos
- ❌ `e2e/auth.spec.js` → debe navegar a la página de login
- ❌ `e2e/auth.spec.js` → debe mostrar error con credenciales inválidas
- ❌ `e2e/auth.spec.js` → debe hacer login correctamente con usuario válido
- ❌ `e2e/auth.spec.js` → debe hacer logout correctamente
- ❌ `auth-buttons-links.spec.ts` → Botones de formulario
- ❌ Otros 12 relacionados con auth

**Causa:** Backend no está corriendo en `http://localhost:8080`

**Solución:**
```bash
cd Forum_backend
.\mvnw.cmd spring-boot:run
```

### 2. Selectores Incorrectos - 15 fallos

#### A. Selector con texto que no existe o varía

**Tests afectados:**
- ❌ `e2e/auth.spec.js:17` → "debe navegar a la página de login"
- ❌ `e2e/navigation.spec.js:19` → "debe navegar a Categorías/Continentes"
- ❌ `complete-navigation.spec.ts:23` → "Link Continentes navega a /categories"
- ❌ `complete-navigation.spec.ts:33` → "Link Blog navega a /blog"

**Problema:**
```javascript
// ❌ Falla porque busca texto exacto:
await page.click('text=Iniciar sesión')

// El botón puede tener:
// - "Iniciar Sesión" (mayúscula en S)
// - Estar dentro de un <a> que contiene el texto
// - Estar traducido
```

**Solución:**
```javascript
// ✅ Usar selector más robusto con regex case-insensitive:
await page.getByRole('link', { name: /iniciar sesión/i }).click()

// O usar el locator específico:
await page.locator('a[href="/login"]').first().click()
```

#### B. Selector que encuentra múltiples elementos

**Tests afectados:**
- ❌ `complete-navigation.spec.ts:30` → "Botón Iniciar Sesión navega a /login"
- ❌ `complete-navigation.spec.ts:63` → "CTA Iniciar sesión navega a /login"

**Problema:**
```javascript
// ❌ Encuentra múltiples "Iniciar sesión" (navbar + hero + footer):
await page.getByRole('link', { name: 'Iniciar Sesión' }).click()
// Error: strict mode violation: locator resolved to 3 elements
```

**Solución:**
```javascript
// ✅ Ser más específico:
await page.getByRole('navigation').getByRole('link', { name: /iniciar sesión/i }).click()

// O usar .first() si cualquiera sirve:
await page.getByRole('link', { name: /iniciar sesión/i }).first().click()
```

### 3. Tests que Requieren Autenticación (Backend) - 18 fallos

**Tests afectados:**
- ❌ `e2e/navigation.spec.js:33` → "debe navegar a Trivia"
- ❌ `e2e/navigation.spec.js:49` → "debe navegar a Mi Mapa"
- ❌ `e2e/trivia.spec.js` → Todos los tests (8 tests)
- ❌ `e2e/travel-map.spec.js` → Todos los tests (8 tests)

**Causa:**
1. Backend no responde
2. Rutas protegidas requieren token JWT válido

**Flujo esperado:**
```javascript
// 1. Login (requiere backend)
await page.goto('/login')
await page.fill('#username', 'user')
await page.fill('#password', 'User123!')
await page.click('button[type="submit"]')
await page.waitForLoadState('networkidle')

// 2. Token se guarda en localStorage
// 3. Ahora puede acceder a rutas protegidas
await page.goto('/trivia')
```

### 4. Tests de Accesibilidad - 8 fallos

#### A. Focus Styles

**Test:** `accessibility-advanced.spec.ts:254` → "focus visible tiene estilo apropiado"

**Error:**
```
expect(hasFocusIndicator).toBeTruthy()
Received: false
```

**Problema:**
El test verifica que los elementos enfocados tengan estilos visibles:
```javascript
const focusStyles = await page.evaluate((selector) => {
  const element = document.querySelector(selector)
  element?.focus()
  const styles = window.getComputedStyle(element)
  return {
    outline: styles.outline,
    outlineWidth: styles.outlineWidth,
    boxShadow: styles.boxShadow
  }
}, 'a')

const hasFocusIndicator =
  focusStyles.outline !== 'none' ||
  focusStyles.outlineWidth !== '0px' ||
  focusStyles.boxShadow !== 'none'

expect(hasFocusIndicator).toBeTruthy()
```

**Causa:** Los estilos CSS no están definiendo `:focus` visible.

**Solución:** Agregar estilos en `index.css`:
```css
/* Focus visible para accesibilidad */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #00ffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.2);
}
```

#### B. Contraste de Botones

**Test:** `accessibility-advanced.spec.ts:341` → "botones tienen contraste suficiente con el fondo"

**Error:** Contraste insuficiente (< 4.5:1 para texto normal, < 3:1 para texto grande)

**Solución:** Verificar y ajustar colores en `tailwind.config.js` o CSS.

### 5. Tests de Navegación con Selector Específico - 10 fallos

**Tests afectados:**
- ❌ `complete-navigation.spec.ts:187` → "Botones tienen aria-labels apropiados"
- ❌ `auth-complete.spec.ts:130` → "Navegación entre login y registro"
- ❌ `auth-complete.spec.ts:172` → "Mostrar/ocultar contraseña funciona"

**Test ejemplo:**
```javascript
test('Navegación entre login y registro', async ({ page }) => {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  // Ir a registro desde login
  const registerLink = page.getByRole('link', { name: /regístrate|registrarse/i })
  await expect(registerLink).toBeVisible()
  await registerLink.click()
  await expect(page).toHaveURL(/\/register$/)
})
```

**Error:**
```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
```

**Causa:** El link en LoginPage puede tener texto diferente al esperado.

**En LoginPage.jsx:**
```javascript
<Link to="/register" className="...">
  <span className="flex items-center space-x-2">
    <span>🗺️</span>
    <span>{t('auth.registerButton')}</span>  // ← Traducción
  </span>
</Link>
```

**Solución:**
```javascript
// ✅ Usar selector por href:
const registerLink = page.locator('a[href="/register"]').first()
await expect(registerLink).toBeVisible()
await registerLink.click()
```

### 6. Timeouts Insuficientes - 5 fallos

**Tests afectados:**
- ❌ `user-experience.spec.ts:47` → "botones cambian de estilo al hacer hover"
- ❌ `responsive-design.spec.ts:139` → "inputs de formulario son del tamaño apropiado en móvil"

**Problema:**
```javascript
test('botones cambian de estilo al hacer hover', async ({ page }) => {
  await page.goto('/')
  const button = page.locator('button').first()

  // Obtener estilo inicial
  const initialColor = await button.evaluate(el =>
    window.getComputedStyle(el).backgroundColor
  )

  // Hacer hover
  await button.hover()

  // ❌ Error: No espera a que la transición CSS termine
  const hoverColor = await button.evaluate(el =>
    window.getComputedStyle(el).backgroundColor
  )

  expect(hoverColor).not.toBe(initialColor)
})
```

**Solución:**
```javascript
// ✅ Esperar a que la transición CSS termine:
await button.hover()
await page.waitForTimeout(300) // Esperar transición CSS
const hoverColor = await button.evaluate(el =>
  window.getComputedStyle(el).backgroundColor
)
```

### 7. Tests del Menú Móvil - 6 fallos

**Tests afectados:**
- ❌ `complete-navigation.spec.ts:106` → "Botón menú móvil abre el menú"
- ❌ `complete-navigation.spec.ts:115` → "Menú móvil - Link Inicio navega correctamente"
- ❌ `complete-navigation.spec.ts:121` → "Menú móvil - Link Continentes navega correctamente"

**Problema:**
```javascript
test('Botón menú móvil abre el menú', async ({ page }) => {
  // ❌ El viewport está en desktop (1280x720 por defecto)
  const menuButton = page.getByRole('button', { name: /abrir menú principal/i })
  await menuButton.click()

  const mobileMenu = page.locator('#mobile-menu')
  await expect(mobileMenu).toBeVisible()
})
```

**Causa:** El test no cambia el viewport a móvil, por lo que el botón móvil no está visible.

**Solución:**
```javascript
test.use({ viewport: { width: 375, height: 667 } })

test('Botón menú móvil abre el menú', async ({ page }) => {
  await page.goto('/')
  // Ahora sí hay viewport móvil
  const menuButton = page.getByRole('button', { name: /abrir menú principal/i })
  await expect(menuButton).toBeVisible()
  await menuButton.click()

  const mobileMenu = page.locator('#mobile-menu')
  await expect(mobileMenu).toBeVisible()
})
```

### 8. Test de 404 Fallando

**Test:** `e2e/navigation.spec.js:62` → "debe mostrar página 404 para rutas inexistentes"

**Error:**
```javascript
test('debe mostrar página 404 para rutas inexistentes', async ({ page }) => {
  await page.goto('/ruta-que-no-existe-12345')

  await expect(page.locator('text=/404|no encontrada|not found/i')).toBeVisible()
})
```

**Error:**
```
Error: expect(locator).toBeVisible()
Timed out 10000ms waiting
```

**Causa:** La página 404 puede no tener exactamente ese texto, o el router redirige.

**Verificar en NotFoundPage.jsx:**
```javascript
// Si el texto es diferente, actualizar el test
<h1>404 - Página no encontrada</h1>
```

## Resumen de Correcciones Necesarias

### Código Frontend (Prioridad Alta)

1. **Agregar estilos de focus visible** en `src/index.css`:
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #00ffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.2);
}
```

2. **Verificar contraste de colores** en botones primarios.

### Tests (Prioridad Alta)

1. **Corregir selectores en auth.spec.js y navigation.spec.js**:
   - Cambiar `text=Iniciar sesión` por `getByRole('link', { name: /iniciar sesión/i })`
   - Usar `.first()` cuando hay múltiples matches

2. **Agregar `.use({ viewport })` en tests móviles**

3. **Agregar `waitForTimeout()` en tests de hover/transiciones**

4. **Usar selectores por `href` en vez de texto traducido**

### Backend (Prioridad Crítica)

1. **Iniciar backend antes de tests E2E**:
```bash
cd Forum_backend
.\mvnw.cmd spring-boot:run
```

## Próximos Pasos

1. ✅ Iniciar backend
2. ⏳ Corregir estilos de accesibilidad
3. ⏳ Actualizar selectores en tests
4. ⏳ Re-ejecutar tests
5. ⏳ Validar que >90% pasen

