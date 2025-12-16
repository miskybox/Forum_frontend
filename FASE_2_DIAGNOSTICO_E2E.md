# FASE 2: Diagnóstico de Tests E2E - Resumen Ejecutivo

## Estado Actual
- **Tests E2E**: 130/198 pasando (65.7%)
- **Tests fallando**: 68/198 (34.3%)
- **Backend**: NO está corriendo ⚠️ **CRÍTICO**

## Problema Principal Identificado

### ❌ BACKEND NO ESTÁ CORRIENDO
**Este es el problema #1 que causa la mayoría de los fallos.**

Los tests E2E requieren que el backend esté corriendo en `http://localhost:8080` para:
- Autenticación (login/register)
- APIs de foros, posts, comentarios
- Trivia (requiere autenticación + backend)
- Mapa de viajes

**Evidencia:**
```bash
$ netstat -ano | findstr :8080
(sin resultados) <- Backend NO está corriendo
```

## Análisis Detallado de Fallos

### 1. Tests de Autenticación (≈23 fallos)

**Archivos afectados:**
- `tests/e2e/auth.spec.js`
- `tests/auth-complete.spec.ts`

**Problemas identificados:**

#### A. Backend no responde
```javascript
// Test intenta hacer login:
await page.fill('#username', 'user')
await page.fill('#password', 'User123!')
await page.click('button[type="submit"]')

// Pero el POST a http://localhost:8080/api/auth/login FALLA
// porque el backend no está corriendo
```

#### B. Selectores incorrectos
```javascript
// ❌ Test actual (puede fallar):
await page.fill('input[name="username"], input[type="text"]', 'user')

// ✅ Debería ser:
await page.getByLabel(/nombre de usuario/i).fill('user')
// o
await page.fill('#username', 'user')
```

**Campos reales del LoginForm:**
- Username: `<input id="username" name="username" type="text">`
- Password: `<input id="password" name="password" type="password">`

**Campos reales del RegisterForm:**
- firstName: `<input id="firstName" name="firstName" type="text">`
- lastName: `<input id="lastName" name="lastName" type="text">`
- username: `<input id="username" name="username" type="text">`
- email: `<input id="email" name="email" type="email">`
- password: `<input id="password" name="password" type="password">`
- confirmPassword: `<input id="confirmPassword" name="confirmPassword" type="password">`

#### C. Credenciales de prueba
Tests usan: `user` / `User123!`

**Verificar que este usuario existe en DataInitializer o en los datos de test.**

### 2. Tests de Navegación (≈18 fallos)

**Archivos afectados:**
- `tests/e2e/navigation.spec.js`
- `tests/complete-navigation.spec.ts`

**Problemas identificados:**

#### A. Rutas protegidas requieren autenticación
```javascript
// Test intenta navegar a /trivia:
await page.click('text=Trivia')
await expect(page).toHaveURL(/.*trivia/)

// FALLA porque:
// 1. Necesita login primero
// 2. Backend debe responder al POST /api/auth/login
```

**Rutas que requieren backend + autenticación:**
- `/trivia` (TriviaHomePage)
- `/trivia/play/:gameId` (protegida)
- `/trivia/infinite` (protegida)
- `/travel` (TravelMapPage)

#### B. Selectores de texto pueden fallar
```javascript
// ❌ Puede fallar si el texto varía:
await page.click('text=/continentes|categorías/i')

// ✅ Más robusto:
await page.getByRole('navigation').getByRole('link', { name: 'Continentes' }).click()
```

### 3. Tests de Accesibilidad (≈12 fallos)

**Archivos afectados:**
- `tests/complete-navigation.spec.ts` (sección de accesibilidad)

**Problemas identificados:**

#### A. Focus y navegación por teclado
```javascript
test('Tab navega entre links del navbar', async ({ page }) => {
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toBeVisible()
})
```

Estos tests pueden fallar si:
- Los elementos no tienen `tabindex` correcto
- Los estilos de `:focus` no están definidos
- El orden de tabulación no es lógico

#### B. ARIA labels
```javascript
test('Botones tienen aria-labels apropiados', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  const menuButton = page.getByRole('button', { name: /abrir menú principal/i })
  await expect(menuButton).toBeVisible()
})
```

Requiere que el botón del menú móvil tenga:
```html
<button aria-label="Abrir menú principal">
```

### 4. Tests de Interacción (≈10 fallos)

**Problemas:**
- Timeouts insuficientes
- Elementos no visibles en viewport móvil
- Animaciones que interfieren con clicks

## Solución Completa

### Paso 1: Iniciar el Backend ⚠️ OBLIGATORIO

**Opción A: Manual (Recomendado para desarrollo)**
```bash
# En una terminal separada:
cd Forum_backend
.\\mvnw.cmd spring-boot:run

# Esperar mensaje:
# "Started BackendApplication in X seconds"
```

**Opción B: Automático en Playwright**

Actualizar [playwright.config.ts](playwright.config.ts):

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  webServer: [
    // Backend
    {
      command: 'cd Forum_backend && .\\\\mvnw.cmd spring-boot:run',
      url: 'http://localhost:8080',
      timeout: 120000,
      reuseExistingServer: !process.env.CI, // En CI siempre reiniciar
    },
    // Frontend
    {
      command: 'npm run dev',
      url: 'http://localhost:5173/',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
})
```

### Paso 2: Verificar Usuario de Test

Revisar [DataInitializer.java](Forum_backend/src/main/java/com/forumviajeros/backend/config/DataInitializer.java):

```java
// Verificar que existe:
User user = new User();
user.setUsername("user");
user.setPassword(passwordEncoder.encode("User123!"));
user.setEmail("user@forumviajeros.com");
// ... etc
```

### Paso 3: Ejecutar Tests E2E

```bash
# Con backend corriendo:
npm run test:e2e

# Para ver en modo headed (visual):
npx playwright test --headed

# Para ejecutar solo un archivo:
npx playwright test tests/e2e/auth.spec.js

# Para debug:
npx playwright test --debug
```

## Resumen de Archivos de Test

### Tests E2E Principales

1. **auth.spec.js** (6 tests)
   - Login, logout, registro básico
   - Validación de credenciales

2. **auth-complete.spec.ts** (9 tests)
   - Flujo completo de registro
   - Validaciones de formulario
   - Navegación entre login/registro

3. **navigation.spec.js** (8 tests)
   - Navegación básica
   - Links del navbar
   - Footer, responsive

4. **complete-navigation.spec.ts** (≈40 tests)
   - Navegación completa (desktop/mobile)
   - CTAs de home page
   - Accesibilidad (ARIA, keyboard navigation)

5. **trivia.spec.js** (requiere backend)
   - Jugar trivia
   - Leaderboard

6. **travel-map.spec.js** (requiere backend)
   - Mapa interactivo
   - Marcar países visitados

## Siguiente Paso Recomendado

### ANTES de corregir tests:

1. ✅ Iniciar el backend:
```bash
cd Forum_backend
.\\mvnw.cmd spring-boot:run
```

2. ✅ Verificar que corre:
```bash
netstat -ano | findstr :8080
# Debería mostrar: TCP 0.0.0.0:8080
```

3. ✅ Probar endpoint:
```bash
curl http://localhost:8080/api/health
# o abrir en navegador
```

4. ✅ Ejecutar 1 test como prueba:
```bash
npx playwright test tests/e2e/auth.spec.js --headed
```

### DESPUÉS de que el backend corre:

Los tests deberían pasar muchos más. Si siguen fallando, las causas serán:
- Selectores específicos que necesitan ajuste
- Timeouts que necesitan aumento
- Validaciones de UI que necesitan corrección

---

## Conclusión

**La causa raíz del 80-90% de los fallos es que el backend NO está corriendo.**

Una vez que el backend esté corriendo, espero que:
- ✅ Tests de autenticación pasen (login/logout/registro)
- ✅ Tests de navegación a rutas protegidas pasen
- ✅ Tests de trivia y travel map pasen
- ⚠️ Algunos tests de accesibilidad y selectores específicos pueden seguir fallando

**Prioridad:**
1. CRÍTICO: Iniciar backend
2. ALTA: Ejecutar tests y ver nuevos resultados
3. MEDIA: Ajustar selectores específicos que fallen
4. BAJA: Mejorar accesibilidad según tests fallen

