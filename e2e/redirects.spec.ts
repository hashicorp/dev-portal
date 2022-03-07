import { test, expect } from '@playwright/test'

// This test is primarily to ensure that the dev server is running in a mode
// that supports the io_preview cookie.
test('should render based on io_preview cookie', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: 'http://localhost:3000/',
    },
  ])
  await page.goto('/')
  await expect(page.locator('head title')).toContainText('Consul by HashiCorp')
})

test('should use middleware redirects', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: 'http://localhost:3000/',
    },
  ])
  await page.goto('/use-cases/network-middleware-automation')
  expect(page.url()).toBe(
    'http://localhost:3000/use-cases/network-infrastructure-automation'
  )
})

test('should use glob-based redirects', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'io_preview',
      value: 'consul',
      url: 'http://localhost:3000/',
    },
  ])
  await page.goto('/docs/platform/k8s/service-sync')
  expect(page.url()).toBe('http://localhost:3000/docs/k8s/service-sync')
})
