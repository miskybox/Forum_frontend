// @ts-check
import { test, expect } from '@playwright/test'
import { demoCredentials } from './credentials.js'

test.describe.configure({ mode: 'serial' })

function uniqueUser() {
  const suffix = Date.now().toString(36)
  return {
    username: `e2e_${suffix}`,
    email: `e2e_${suffix}@forumviajeros.demo`,
    password: 'E2eTest1!',
  }
}

async function loginWith(page, username, password) {
  await page.goto('/login')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('form button[type="submit"]').click()
  await expect(page).not.toHaveURL(/\/login/, { timeout: 20000 })
}

test.describe('Flujos demo de comunidad', () => {
  test('muestra copyright by sigu y carga foros públicos', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByText(/copyright by sigu/i)).toBeVisible()

    await page.goto('/forums')
    await expect(page.locator('h1, h2').first()).toBeVisible()
    await expect(page.locator('a[href*="/forums/"]').first()).toBeVisible({ timeout: 15000 })
  })

  test('inicia sesión con la cuenta demo pública', async ({ page }) => {
    test.skip(!demoCredentials.password, 'Falta E2E_DEMO_PASSWORD o USER_PASSWORD')
    await loginWith(page, demoCredentials.username, demoCredentials.password)
    await expect(page.locator('a[href="/login"]')).toHaveCount(0)
  })

  test('registra un usuario, crea foro, post con tags y comentario', async ({ page }) => {
    test.setTimeout(90_000)
    const user = uniqueUser()
    await page.goto('/register')
    await page.locator('#username').fill(user.username)
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill(user.password)
    await page.locator('#confirmPassword').fill(user.password)
    await page.locator('form button[type="submit"]').click()
    await expect(page).toHaveURL(/\/login/, { timeout: 20000 })
    await loginWith(page, user.username, user.password)

    const forumTitle = `Foro E2E ${Date.now()}`
    await page.goto('/forums/create')
    await expect(page.locator('#title')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('#categoryId option:not([disabled])').first()).toBeAttached({ timeout: 15000 })
    await page.locator('#title').fill(forumTitle)
    await page.locator('#description').fill('Foro creado por el test e2e de comunidad.')
    await page.locator('#categoryId').selectOption({ index: 1 })
    await page.locator('form button[type="submit"]').click()
    await expect(page).toHaveURL(/\/forums\/\d+/, { timeout: 20000 })
    await expect(page.getByRole('heading', { name: forumTitle }).first()).toBeVisible()

    const forumUrl = page.url()
    const forumId = forumUrl.match(/\/forums\/(\d+)/)?.[1]
    expect(forumId).toBeTruthy()

    const postTitle = `Post E2E ${Date.now()}`
    await page.goto(`/forums/${forumId}/posts/create`)
    await page.locator('#title').fill(postTitle)
    await page.locator('#content').fill('Relato de prueba con etiqueta para el test e2e.')
    await page.locator('#tagInput').fill('e2eplaywright')
    await page.getByRole('button', { name: /^añadir$/i }).click()
    await expect(page.getByText('e2eplaywright')).toBeVisible()
    await page.getByRole('button', { name: /^publicar$/i }).click()
    await expect(page).toHaveURL(/\/posts\/\d+/, { timeout: 20000 })
    await expect(page.getByRole('heading', { name: postTitle }).first()).toBeVisible()
    await expect(page.getByText(/e2eplaywright/i).first()).toBeVisible()

    const commentText = `Comentario e2e ${Date.now()}`
    await page.locator('#comment-content').fill(commentText)
    await page.locator('form:has(#comment-content)').getByRole('button', { name: /publicar/i }).click()
    await expect(page.getByText(commentText)).toBeVisible({ timeout: 15000 })
  })
})
