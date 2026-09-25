/* global process */

function requiredCredential(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`[e2e] Falta la variable de entorno ${name}`)
  }
  return value
}

export const demoCredentials = {
  username: requiredCredential('E2E_DEMO_USERNAME'),
  password: requiredCredential('E2E_DEMO_PASSWORD'),
}

export const adminCredentials = {
  username: requiredCredential('E2E_ADMIN_USERNAME'),
  password: requiredCredential('E2E_ADMIN_PASSWORD'),
}
