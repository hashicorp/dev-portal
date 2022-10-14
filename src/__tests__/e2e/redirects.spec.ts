import { test, expect } from '@playwright/test'

// This test is primarily to ensure that the dev server is running in a mode
// that supports the hc_dd_proxied_site cookie.
test('should render based on hc_dd_proxied_site cookie', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.consul.io',
			url: baseURL,
		},
	])
	await page.goto('/')
	await expect(page.locator('head title')).toContainText('Consul by HashiCorp')
})

test('should use middleware redirects', async ({ page, context, baseURL }) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.consul.io',
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
			name: 'hc_dd_proxied_site',
			value: 'www.consul.io',
			url: baseURL,
		},
	])
	await page.goto('/security/index.html')
	const { pathname } = new URL(page.url())
	expect(pathname).toBe('/security')
})

test('should use dev portal redirects', async ({ page, context, baseURL }) => {
	await page.goto('/hashicorp-cloud-platform')
	const { pathname } = new URL(page.url())
	expect(pathname).toBe('/hcp')
})
