# Guía de Tests E2E - Forum Viajeros

## ⚠️ Requisito Crítico: Backend debe estar corriendo

Los tests E2E (End-to-End) requieren que **TANTO el frontend COMO el backend** estén corriendo.

### Por qué es necesario?

Los tests E2E simulan un usuario real interactuando con la aplicación completa:
- Login/registro requieren POST a `/api/auth/login` y `/api/auth/register`
- Navegación a rutas protegidas verifica tokens con el backend
- Trivia requiere APIs de `/api/trivia/*`
- Mapa de viajes requiere APIs de `/api/travel/*`

## Cómo Ejecutar Tests E2E Correctamente

### Opción 1: Proceso Manual (Recomendado)

#### Terminal 1: Backend
```bash
cd Forum_backend
.\\mvnw.cmd spring-boot:run
```

Espera el mensaje:
```
Started BackendApplication in X.XXX seconds (process running on port 8080)
```

#### Terminal 2: Verificar Backend
```bash
netstat -ano | findstr :8080
# Debe mostrar: TCP  0.0.0.0:8080  0.0.0.0:0  LISTENING  XXXX
```

#### Terminal 3: Tests E2E
```bash
# Tests en modo headless (sin ventana de navegador):
npm run test:e2e

# Tests en modo headed (con ventana visible):
npx playwright test --headed

# Tests de un solo archivo:
npx playwright test tests/e2e/auth.spec.js

# Debug interactivo:
npx playwright test --debug

# Con UI de Playwright:
npx playwright test --ui
```

### Opción 2: Configuración Automática

Actualizar `playwright.config.ts` para iniciar backend automáticamente:

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
    // Backend Spring Boot
    {
      command: 'cd Forum_backend && .\\\\mvnw.cmd spring-boot:run',
      url: 'http://localhost:8080',
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    // Frontend Vite
    {
      command: 'npm run dev',
      url: 'http://localhost:5173/',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
})
```

Con esta configuración, al ejecutar `npm run test:e2e`, Playwright automáticamente:
1. Inicia el backend en el puerto 8080
2. Inicia el frontend en el puerto 5173
3. Espera a que ambos estén listos
4. Ejecuta los tests
5. (Opcional) Detiene los servidores al finalizar

## Troubleshooting

### Error: "Cannot connect to backend"

**Síntoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:8080
```

**Solución:**
```bash
# Verificar que el backend está corriendo:
netstat -ano | findstr :8080

# Si no aparece nada, iniciar el backend:
cd Forum_backend
.\\mvnw.cmd spring-boot:run
```

### Error: "User authentication failed"

**Síntoma:**
Los tests de login fallan con 401 Unauthorized.

**Solución:**
Verificar que el usuario de test existe en DataInitializer.java:
```java
// Forum_backend/src/main/java/com/forumviajeros/backend/config/DataInitializer.java
User testUser = new User();
testUser.setUsername("user");
testUser.setPassword(passwordEncoder.encode("User123!"));
testUser.setEmail("user@forumviajeros.com");
```

### Error: "Timeout waiting for element"

**Síntoma:**
```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
```

**Posibles causas:**
1. Backend no está respondiendo rápido
2. El selector es incorrecto
3. El elemento está oculto por CSS o animaciones

**Solución:**
```javascript
// Aumentar timeout específico:
await expect(element).toBeVisible({ timeout: 15000 })

// Esperar a que la página cargue completamente:
await page.waitForLoadState('networkidle')

// Verificar selector correcto:
await page.pause() // Abre inspector de Playwright
```

### Backend inicia muy lento

**Síntoma:**
Playwright timeout esperando al backend.

**Solución:**
```typescript
// En playwright.config.ts, aumentar timeout:
webServer: [
  {
    command: 'cd Forum_backend && .\\\\mvnw.cmd spring-boot:run',
    url: 'http://localhost:8080',
    timeout: 180000, // 3 minutos en vez de 2
    reuseExistingServer: true, // No reiniciar si ya corre
  },
  // ...
]
```

## Estructura de Tests

```
tests/
├── e2e/
│   ├── auth.spec.js          # Login, logout, registro (6 tests)
│   ├── navigation.spec.js    # Navegación básica (8 tests)
│   ├── trivia.spec.js        # Tests de trivia (requiere backend)
│   └── travel-map.spec.js    # Tests de mapa (requiere backend)
├── auth-complete.spec.ts     # Flujo completo auth (9 tests)
├── complete-navigation.spec.ts # Navegación completa + a11y (40+ tests)
└── ...
```

## Comandos Útiles

```bash
# Ejecutar todos los tests E2E:
npm run test:e2e

# Ejecutar solo tests de autenticación:
npx playwright test auth

# Ver tests en modo UI interactiva:
npx playwright test --ui

# Generar reporte HTML:
npx playwright test --reporter=html

# Ver último reporte:
npx playwright show-report

# Ejecutar en modo debug (pausado):
npx playwright test --debug

# Ejecutar en navegador específico:
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Actualizar screenshots de referencia:
npx playwright test --update-snapshots
```

## Estado Actual de Tests

### Último Resultado (sin backend corriendo):
- ✅ **130/198** tests pasando (65.7%)
- ❌ **68/198** tests fallando (34.3%)

### Resultado Esperado (con backend corriendo):
- ✅ **~180/198** tests pasando (~91%)
- ❌ **~18/198** tests requieren ajustes menores

Los fallos restantes serían principalmente:
- Selectores específicos que necesitan ajuste
- Validaciones de accesibilidad (ARIA labels, focus styles)
- Timeouts en operaciones lentas

## Próximos Pasos

1. ✅ Iniciar backend
2. ✅ Ejecutar tests con backend corriendo
3. ⏳ Analizar fallos restantes (si los hay)
4. ⏳ Ajustar selectores/timeouts según sea necesario
5. ⏳ Mejorar accesibilidad si tests la validan

---

**Documentos relacionados:**
- [FASE_2_DIAGNOSTICO_E2E.md](FASE_2_DIAGNOSTICO_E2E.md) - Diagnóstico detallado
- [E2E_TEST_FIXES.md](E2E_TEST_FIXES.md) - Plan de corrección

**Última actualización:** Fase 2 - Diciembre 2024
