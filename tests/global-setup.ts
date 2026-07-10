import { request } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
  const response = await apiContext.post('/api/auth/login', {
    data: { username, password },
    headers: { 'Content-Type': 'application/json' },
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

  await loginAndSave('viajero_demo', 'Demo1234!', path.join(AUTH_DIR, 'user.json'))
  await loginAndSave('admin_demo', 'FV_Admin_2026!', path.join(AUTH_DIR, 'admin.json'))
}
