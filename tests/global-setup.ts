import { request } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { adminCredentials, demoCredentials } from './e2e/credentials.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_DIR = path.join(__dirname, '.auth')
const APP_ORIGIN = 'http://localhost:5173'
const API_BASE_URL = 'http://localhost:8080'

/**
 * Loguea vía API (sin pasar por la UI) y guarda cookies + el flag de
 * localStorage que usa el frontend (authService: 'isAuthenticated') en un
 * storageState reutilizable por los tests. Evita que cada test tenga que
 * hacer login por su cuenta, lo cual además choca con el rate limiting de
 * /api/auth/login (máx. 5/min por IP, ver RateLimitingFilter en el backend).
 */
async function loginAndSave(username: string, password: string, outFile: string) {
  const apiContext = await request.newContext({ baseURL: API_BASE_URL })
  const csrfResponse = await apiContext.get('/api/health/data-status')
  if (!csrfResponse.ok()) {
    throw new Error(
      `[global-setup] No se pudo obtener el token CSRF (HTTP ${csrfResponse.status()}). ` +
      'Verifica que el backend esté corriendo en http://localhost:8080.'
    )
  }

  const csrfCookie = (await apiContext.storageState()).cookies.find(
    (cookie) => cookie.name === 'XSRF-TOKEN'
  )
  if (!csrfCookie) {
    throw new Error('[global-setup] El backend no entregó la cookie XSRF-TOKEN.')
  }

  const response = await apiContext.post('/api/auth/login', {
    data: { username, password },
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfCookie.value,
    },
  })

  if (!response.ok()) {
    throw new Error(
      `[global-setup] No se pudo loguear como '${username}' (HTTP ${response.status()}). ` +
      'Verifica que el backend esté corriendo en http://localhost:8080 y que el usuario exista.'
    )
  }

  const state = await apiContext.storageState()
  await apiContext.dispose()

  state.origins = [
    {
      origin: APP_ORIGIN,
      localStorage: [{ name: 'isAuthenticated', value: 'true' }],
    },
  ]

  fs.writeFileSync(outFile, JSON.stringify(state, null, 2))
}

export default async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true })

  await loginAndSave(demoCredentials.username, demoCredentials.password, path.join(AUTH_DIR, 'user.json'))
  await loginAndSave(adminCredentials.username, adminCredentials.password, path.join(AUTH_DIR, 'admin.json'))
}
