# Plan de Corrección de Tests E2E

## Problemas Identificados

### 1. Backend NO está corriendo (CRÍTICO)
- Los tests E2E intentan conectarse a `http://localhost:8080`
- El backend debe estar corriendo durante los tests E2E
- Sin backend, todas las autenticaciones y llamadas API fallan

### 2. Selectores de Tests No Coinciden con la UI Real
Los tests usan selectores genéricos que no siempre funcionan:
```javascript
// Test actual:
await page.fill('input[name="username"], input[type="text"]', 'user')

// Debería ser:
await page.getByLabel(/nombre de usuario/i).fill('user')
// o
await page.fill('#username', 'user')
```

### 3. Textos Esperados vs Textos Reales
- Tests buscan: "Iniciar sesión", "Registrarse", "Continentes"
- UI tiene traducciones con `t('auth.loginTitle')`, etc.
- Algunos tests son case-sensitive

### 4. Credenciales de Prueba
Tests usan: `user` / `User123!`
Necesitamos verificar que estos usuarios existen en BD de test

### 5. Navegación y Timing
- Faltan `waitForLoadState('networkidle')` en muchos tests
- Timeout de 10 segundos puede ser insuficiente para autenticación
- Rutas protegidas redirigen si no hay token

## Solución Propuesta

### Paso 1: Iniciar Backend Antes de Tests E2E
Modificar `playwright.config.ts` para iniciar backend automáticamente:
```typescript
webServer: [
  {
    command: 'cd Forum_backend && .\\mvnw.cmd spring-boot:run',
    url: 'http://localhost:8080/api/health',
    timeout: 120000,
    reuseExistingServer: true
  },
  {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: true
  }
]
```

### Paso 2: Usar Selectores Más Robustos
Cambiar de selectores CSS a selectores semánticos:
- `getByRole()` para botones y links
- `getByLabel()` para inputs
- `getByText()` para textos con regex case-insensitive

### Paso 3: Agregar Timeouts y Wait States
```javascript
await page.waitForLoadState('networkidle')
await page.waitForTimeout(1000) // Solo cuando sea necesario
```

### Paso 4: Crear Usuario de Test
Asegurar que existe `user / User123!` en DataInitializer

### Paso 5: Mejorar Assertions
Usar assertions más flexibles:
```javascript
// En vez de:
await expect(page).toHaveURL(/.*login/)

// Usar:
await expect(page).toHaveURL(/\/login$/)
```

## Tests por Categoría

### Autenticación (23 tests)
- ✅ Página de inicio carga
- ❌ Navegación a login (selector incorrecto)
- ❌ Navegación a registro (selector incorrecto)
- ❌ Login con credenciales inválidas (backend no corre)
- ❌ Login válido (backend no corre)
- ❌ Logout (backend no corre)
- ❌ Registro completo (backend no corre + selectores)
- ❌ Validaciones de formulario (selectores)

### Navegación (18 tests)
- ❌ Navegar a /categories (selector "Continentes" puede variar)
- ❌ Navegar a /forums
- ❌ Navegar a /trivia (requiere autenticación)
- ❌ Navegar a /travel (requiere autenticación)
- ✅ Página 404
- ❌ Footer visible
- ❌ Navbar responsive

### Accesibilidad (12 tests)
- ❌ ARIA labels (selectores específicos)
- ❌ Roles semánticos
- ❌ Navegación por teclado
- ❌ Focus styles

## Próximos Pasos

1. ✅ Documentar problemas
2. ⏳ Configurar inicio automático de backend
3. ⏳ Actualizar selectores en tests
4. ⏳ Verificar usuarios de test
5. ⏳ Ejecutar tests y validar
