import { test, expect } from '@playwright/test'

// This test is primarily to ensure that the dev server is running in a mode
// that supports the io_preview cookie.
test('should render based on io_preview cookie', async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: baseURL,
    },
  ])
  await page.goto('/')
  await expect(page.locator('head title')).toContainText('Consul by HashiCorp')
})

test('should use middleware redirects', async ({ page, context, baseURL }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: baseURL,
    },
  ])
  await page.goto('/use-cases/network-middleware-automation')
  const { pathname } = new URL(page.url())
  expect(pathname).toBe('/use-cases/network-infrastructure-automation')
})

test('should use glob-based redirects', async ({ page, context, baseURL }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: baseURL,
    },
  ])
  await page.goto('/security/index.html')
  const { pathname } = new URL(page.url())
  expect(pathname).toBe('/security')
})
