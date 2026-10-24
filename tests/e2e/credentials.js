/* global process */

function optionalCredential(...names) {
  for (const name of names) {
    const value = process.env[name]
    if (value) {
      return value
    }
  }
  return ''
}

export const demoCredentials = {
  username: optionalCredential('E2E_DEMO_USERNAME', 'USER_USERNAME') || 'viajero_demo',
  password: optionalCredential('E2E_DEMO_PASSWORD', 'USER_PASSWORD'),
}

export const adminCredentials = {
  username: optionalCredential('E2E_ADMIN_USERNAME', 'ADMIN_USERNAME') || 'admin_demo',
  password: optionalCredential('E2E_ADMIN_PASSWORD', 'ADMIN_PASSWORD'),
}

export const moderatorCredentials = {
  username: optionalCredential('E2E_MODERATOR_USERNAME', 'MODERATOR_USERNAME') || 'moderador_demo',
  password: optionalCredential('E2E_MODERATOR_PASSWORD', 'MODERATOR_PASSWORD'),
}
