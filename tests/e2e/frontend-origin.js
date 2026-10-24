/* global process */
import { spawnSync } from 'node:child_process'

const LOCAL_VITE_PORTS = [5173, 5174, 5175, 5176]

/**
 * Vite usa el siguiente puerto libre si 5173 está ocupado.
 * Playwright debe apuntar al origen que realmente sirve el frontend.
 */
export function resolveFrontendOrigin() {
  const fromEnv = process.env.PLAYWRIGHT_BASE_URL
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  for (const port of LOCAL_VITE_PORTS) {
    const result = spawnSync(
      'curl',
      ['-sf', '-o', '/dev/null', '-m', '1', `http://127.0.0.1:${port}/`],
      { windowsHide: true },
    )
    if (result.status === 0) {
      return `http://localhost:${port}`
    }
  }

  return 'http://localhost:5173'
}
