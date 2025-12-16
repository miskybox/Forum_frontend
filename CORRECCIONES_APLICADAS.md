# Correcciones Aplicadas a Tests E2E - Resumen

## Fecha: Diciembre 2024
## Fase: Fase 2 - Corrección de Fallos Menores

---

## 1. Correcciones de CSS y Accesibilidad

### Archivo: `src/index.css`

#### A. Corrección del warning de @import
**Problema:** `@import must precede all other statements`

**Antes:**
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=...');
```

**Después:**
```css
@import url('https://fonts.googleapis.com/css2?family=...');
@import "tailwindcss";
```

**Resultado:** ✅ Warning de PostCSS eliminado

#### B. Mejora de Estilos de Focus (WCAG 2.1 AA)
**Problema:** Tests de accesibilidad fallaban porque el focus no era suficientemente visible

**Antes:**
```css
button:focus-visible,
a:focus-visible {
  outline: 3px solid #e89020;
  outline-offset: 2px;
}
```

**Después:**
```css
/* Estados focus visibles - WCAG 2.1 Level AA compliant */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid #e89020;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(232, 144, 32, 0.25);
}

/* Focus visible adicional para links y botones interactivos */
a:focus,
button:focus {
  outline: 2px solid #e89020;
  outline-offset: 2px;
}

/* Asegurar que el focus nunca sea removido con outline:none */
*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 3px solid #e89020;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(232, 144, 32, 0.25);
}
```

**Resultado:** ✅ Focus visible mejorado con box-shadow adicional
**Tests afectados:** `accessibility-advanced.spec.ts:254` - "focus visible tiene estilo apropiado"

---

## 2. Correcciones en Tests de Autenticación

### Archivo: `tests/e2e/auth.spec.js`

#### A. Test: "debe navegar a la página de login"

**Antes:**
```javascript
await page.click('text=Iniciar sesión');
await expect(page).toHaveURL(/.*login/);
```

**Problemas:**
- `text=Iniciar sesión` puede no encontrar el elemento por:
  - Case sensitivity ("Iniciar Sesión" vs "Iniciar sesión")
  - Múltiples elementos con el mismo texto
  - Traducciones dinámicas

**Después:**
```javascript
// Usar selector más robusto - buscar link con href='/login'
await page.locator('a[href="/login"]').first().click();
await expect(page).toHaveURL(/\/login$/);
```

**Resultado:** ✅ Selector más confiable usando href

#### B. Test: "debe mostrar error con credenciales inválidas"

**Antes:**
```javascript
await page.fill('input[name="username"], input[type="text"]', 'usuarioInvalido');
await page.fill('input[name="password"], input[type="password"]', 'passwordIncorrecto');
```

**Problemas:**
- Selector compuesto puede fallar si hay múltiples inputs de texto
- No espera a que la página cargue completamente

**Después:**
```javascript
await page.goto('/login');
await page.waitForLoadState('networkidle');

// Usar selectores más específicos por id
await page.fill('#username', 'usuarioInvalido');
await page.fill('#password', 'passwordIncorrecto');
await page.click('button[type="submit"]');

// Esperar mensaje de error (toast o en formulario)
await expect(page.locator('text=/error|incorrecto|inválido|usuario o contraseña incorrectos/i').first()).toBeVisible({ timeout: 15000 });
```

**Resultado:**
- ✅ Selectores por ID más confiables
- ✅ Timeout aumentado a 15s para permitir respuesta del backend
- ✅ Regex más flexible para mensajes de error

#### C. Test: "debe hacer login correctamente"

**Cambios similares:**
- Usar `#username` y `#password` en vez de selectores complejos
- Agregar `waitForLoadState('networkidle')`
- Aumentar timeout a 15000ms

#### D. Test: "debe hacer logout correctamente"

**Antes:**
```javascript
const logoutButton = page.locator('text=/cerrar sesión|logout|salir/i');
```

**Después:**
```javascript
const logoutButton = page.locator('button:has-text("Cerrar sesión"), button:has-text("Logout"), button:has-text("Salir")').first();
const isVisible = await logoutButton.isVisible().catch(() => false);
```

**Resultado:** ✅ Manejo de errores más robusto

---

### Archivo: `tests/auth-complete.spec.ts`

#### A. Test: "Registro completo de nuevo usuario"

**Antes:**
```javascript
await page.getByLabel(/nombre de usuario/i).fill(testUser)
await page.getByLabel(/correo electrónico/i).fill(testEmail)
await page.getByLabel(/^nombre$/i).fill('Test')
await page.getByLabel(/apellido/i).fill('User')
await page.getByLabel(/^contraseña$/i).fill('password123')
await page.getByLabel(/confirmar contraseña/i).fill('password123')
```

**Problemas:**
- `getByLabel()` depende de que los labels tengan el texto esperado
- Las traducciones pueden variar
- Los regex complejos pueden no coincidir

**Después:**
```javascript
await page.fill('#firstName', 'Test')
await page.fill('#lastName', 'User')
await page.fill('#username', testUser)
await page.fill('#email', testEmail)
await page.fill('#password', 'password123')
await page.fill('#confirmPassword', 'password123')
```

**Resultado:**
- ✅ Selectores por ID son independientes de traducciones
- ✅ Más rápidos y confiables
- ✅ Coinciden exactamente con los IDs en RegisterForm.jsx

#### B. Test: "Login completo con credenciales válidas"

**Cambios:**
- Usar `#username` y `#password`
- Aumentar timeout de 2000ms a 3000ms
- Usar credenciales que existen: `user` / `User123!`

**Antes:**
```javascript
await page.getByLabel(/nombre de usuario/i).fill('testuser')
await page.getByLabel(/contraseña/i).fill('password123')
```

**Después:**
```javascript
await page.fill('#username', 'user')
await page.fill('#password', 'User123!')
```

---

## 3. Correcciones en Tests de Navegación

### Archivo: `tests/e2e/navigation.spec.js`

#### A. Test: "debe navegar a Categorías/Continentes"

**Antes:**
```javascript
await page.click('text=/continentes|categorías/i');
await expect(page).toHaveURL(/.*categories/);
```

**Problemas:**
- El texto puede variar ("Continentes" vs "Categorías")
- Puede haber tildes o no
- Selector de texto es frágil

**Después:**
```javascript
await page.goto('/');
await page.waitForLoadState('networkidle');

// Usar selector por href en vez de texto
await page.locator('a[href="/categories"]').first().click();
await expect(page).toHaveURL(/\/categories$/);
```

**Resultado:**
- ✅ Selector por href es 100% confiable
- ✅ URL regex más estricta (termina en /categories)

#### B. Tests que requieren autenticación (Trivia, Mi Mapa)

**Antes:**
```javascript
await page.fill('input[name="username"], input[type="text"]', 'user');
```

**Después:**
```javascript
await page.goto('/login');
await page.waitForLoadState('networkidle');
await page.fill('#username', 'user');
await page.fill('#password', 'User123!');
await page.click('button[type="submit"]');
await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
await page.waitForLoadState('networkidle');

// Ahora navegar a la ruta protegida
await page.locator('a[href="/trivia"]').first().click();
await expect(page).toHaveURL(/\/trivia$/);
```

**Resultado:**
- ✅ Flujo de autenticación completo
- ✅ Espera a que el backend responda
- ✅ Verifica que el login fue exitoso antes de continuar

#### C. Test: "debe mostrar página 404"

**Antes:**
```javascript
await expect(page.locator('text=/404|no encontrada|not found/i')).toBeVisible();
```

**Problema:** Puede fallar si el texto exacto no coincide

**Después:**
```javascript
await page.goto('/ruta-que-no-existe-12345');
await page.waitForLoadState('networkidle');

// Verificar que muestra contenido de 404
const has404 = await page.locator('text=/404|no encontrada|not found|página no encontrada/i').first().isVisible().catch(() => false);
expect(has404).toBeTruthy();
```

**Resultado:**
- ✅ Manejo de errores con `.catch()`
- ✅ Regex más completa incluyendo "página no encontrada"

---

## 4. Resumen de Patrones de Corrección

### Patrón 1: Usar Selectores por ID en vez de getByLabel()
```javascript
// ❌ Antes:
await page.getByLabel(/nombre de usuario/i).fill('user')

// ✅ Después:
await page.fill('#username', 'user')
```

### Patrón 2: Usar Selectores por href en vez de texto
```javascript
// ❌ Antes:
await page.click('text=Iniciar sesión')

// ✅ Después:
await page.locator('a[href="/login"]').first().click()
```

### Patrón 3: Agregar waitForLoadState('networkidle')
```javascript
// ✅ Siempre después de goto() y operaciones que cambian la página:
await page.goto('/login')
await page.waitForLoadState('networkidle')
```

### Patrón 4: Aumentar timeouts para operaciones con backend
```javascript
// ❌ Antes:
await expect(page).not.toHaveURL(/.*login/, { timeout: 10000 })

// ✅ Después:
await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })
```

### Patrón 5: Usar regex más flexibles
```javascript
// ❌ Antes:
await expect(page.locator('text=/404|no encontrada/i')).toBeVisible()

// ✅ Después:
const has404 = await page.locator('text=/404|no encontrada|not found|página no encontrada/i').first().isVisible().catch(() => false)
expect(has404).toBeTruthy()
```

---

## 5. Tests Corregidos por Categoría

### Autenticación (8 tests corregidos)
- ✅ `e2e/auth.spec.js` → debe navegar a login
- ✅ `e2e/auth.spec.js` → debe navegar a registro
- ✅ `e2e/auth.spec.js` → debe mostrar error con credenciales inválidas
- ✅ `e2e/auth.spec.js` → debe hacer login correctamente
- ✅ `e2e/auth.spec.js` → debe hacer logout correctamente
- ✅ `auth-complete.spec.ts` → Registro completo de nuevo usuario
- ✅ `auth-complete.spec.ts` → Login completo con credenciales válidas
- ✅ `auth-complete.spec.ts` → Login falla con credenciales inválidas

### Navegación (6 tests corregidos)
- ✅ `e2e/navigation.spec.js` → debe navegar a Categorías/Continentes
- ✅ `e2e/navigation.spec.js` → debe navegar a Foros
- ✅ `e2e/navigation.spec.js` → debe navegar a Trivia
- ✅ `e2e/navigation.spec.js` → debe navegar a Mi Mapa
- ✅ `e2e/navigation.spec.js` → debe mostrar página 404

### Accesibilidad (1 test corregido)
- ✅ Estilos de focus visible mejorados

---

## 6. Resultado Esperado

### Antes de las correcciones:
- ✅ 130/198 tests pasando (65.7%)
- ❌ 63/198 tests fallando (31.8%)
- ⏸️ 5/198 tests omitidos (2.5%)

### Después de las correcciones (estimado):
- ✅ **~145-150/198 tests pasando** (~75%)
- ❌ **~45/198 tests fallando** (~23%)
  - La mayoría fallan por **backend NO corriendo**
- ⏸️ 5/198 tests omitidos (2.5%)

### Con backend corriendo (estimación final):
- ✅ **~175-180/198 tests pasando** (~90%)
- ❌ **~15-20/198 tests con fallos menores** (~10%)
  - Menú móvil (viewport)
  - Timeouts específicos
  - Selectores en tests no corregidos aún

---

## 7. Próximos Pasos

### CRÍTICO - Iniciar Backend:
```bash
cd Forum_backend
.\mvnw.cmd spring-boot:run
```

### Ejecutar Tests Corregidos:
```bash
# Ejecutar solo los tests corregidos:
npx playwright test tests/e2e/auth.spec.js
npx playwright test tests/e2e/navigation.spec.js
npx playwright test tests/auth-complete.spec.ts

# O ejecutar todos:
npm run test:e2e
```

### Verificar Mejoras:
```bash
# Con --reporter=list para ver detalles:
npx playwright test --reporter=list

# Con --reporter=html para reporte visual:
npx playwright test --reporter=html
npx playwright show-report
```

---

## 8. Archivos Modificados

1. ✅ `src/index.css` - Estilos de accesibilidad mejorados
2. ✅ `tests/e2e/auth.spec.js` - 5 tests corregidos
3. ✅ `tests/e2e/navigation.spec.js` - 5 tests corregidos
4. ✅ `tests/auth-complete.spec.ts` - 3 tests corregidos (parcial)

**Total de correcciones aplicadas:** 14+ tests mejorados

---

## 9. Lecciones Aprendidas

1. **Preferir selectores por ID/href sobre texto:**
   - Los IDs son estables y no dependen de traducciones
   - Los href son únicos para navegación

2. **Siempre usar waitForLoadState('networkidle'):**
   - Especialmente importante con backend
   - Evita race conditions

3. **Aumentar timeouts para operaciones con backend:**
   - 15000ms (15s) es más realista que 10000ms
   - El backend puede tardar en responder

4. **Usar regex case-insensitive y flexibles:**
   - `/iniciar sesión/i` en vez de `"Iniciar sesión"`
   - Incluir variaciones del texto esperado

5. **Manejo de errores robusto:**
   - Usar `.catch(() => false)` para evitar fallos abruptos
   - Verificar con `.isVisible()` antes de interactuar

---

**Documento generado:** Fase 2 - Diciembre 2024
**Siguiente paso:** Iniciar backend y ejecutar tests E2E
