import { test, expect } from '@playwright/test'

// see redirect fixture at proxied-redirects/www.test-domain.io.redirects.js
test('should respect redirects specified for proxied domains', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.test-domain.io',
			url: baseURL,
		},
	])

	await page.goto('/source')
	const { pathname } = new URL(page.url())
	expect(pathname).toBe('/')
})
