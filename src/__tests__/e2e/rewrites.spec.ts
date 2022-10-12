import { test, expect } from '@playwright/test'

// This test is primarily to ensure that known dev-portal routes aren't exposed via io sites
test('should rewrite known dev-portal routes - different product', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.waypointproject.io',
			url: baseURL,
		},
	])
	const response = await page.goto('/vault')
	await expect(page.locator('head title')).toContainText(
		'Waypoint by HashiCorp'
	)
	expect(response.status()).toEqual(404)
})

test('should rewrite known dev-portal routes - same product', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.waypointproject.io',
			url: baseURL,
		},
	])
	const response = await page.goto('/waypoint/docs')
	await expect(page.locator('head title')).toContainText(
		'Waypoint by HashiCorp'
	)
	expect(response.status()).toEqual(404)
})
