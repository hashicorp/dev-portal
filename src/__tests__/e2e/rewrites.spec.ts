import { test, expect } from '@playwright/test'

// This test is primarily to ensure that known dev-portal routes aren't exposed via io sites
test('should rewrite known dev-portal routes', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'waypoint',
      url: 'http://localhost:3000',
    },
  ])
  const response = await page.goto('/vault')
  await expect(page.locator('head title')).toContainText(
    'Waypoint by HashiCorp'
  )
  expect(response.status()).toEqual(404)
})
