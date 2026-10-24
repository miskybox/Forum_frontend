import { defineConfig } from '@playwright/test'
import { resolveFrontendOrigin } from './tests/e2e/frontend-origin.js'

const baseURL = resolveFrontendOrigin()


export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  globalSetup: './tests/global-setup.ts',
  // El backend aplica rate limiting a /api/auth/login por IP (máx. 5/min, ver
  // RateLimitingFilter). Con workers en paralelo, varios tests hacen login casi a
  // la vez desde la misma IP local y chocan contra el límite (429), dando falsos
  // negativos. Un solo worker evita ese choque.
  workers: 1,
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  webServer: {
    command: 'npm run dev',
    url: `${baseURL}/`,
    reuseExistingServer: true,
    timeout: 120000
  }
})