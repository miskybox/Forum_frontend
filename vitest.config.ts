import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.js'],
    pool: 'forks',
    globals: true,
    // userEvent-heavy form tests can exceed the 5s default when the whole suite runs in parallel
    testTimeout: 15000,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**']
  }
})