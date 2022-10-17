import { test, expect } from '@playwright/test'
import { __config } from '../../../.test/app-config'

test('should render the proper page title and description', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/')
	await expect(page.locator('head title')).toContainText(
		__config.dev_dot.meta.title
	)

	expect(
		await page.locator('head meta[name="description"]').getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'HashiCorp'))

	expect(
		await page
			.locator('head meta[name="twitter:description"]')
			.getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'HashiCorp'))

	expect(
		await page.locator('head meta[property="og:image"]').getAttribute('content')
	).toContain('/og-image/base.jpg')

	expect(
		await page
			.locator('head meta[name="twitter:image"]')
			.getAttribute('content')
	).toContain('/og-image/base.jpg')
})

test('product landing page should render the metadata', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/waypoint')
	await expect(page.locator('head title')).toContainText(
		`Waypoint | ${__config.dev_dot.meta.title}`
	)
	expect(
		await page.locator('head meta[name="description"]').getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'Waypoint'))

	expect(
		await page
			.locator('head meta[name="twitter:description"]')
			.getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'Waypoint'))

	expect(
		await page.locator('head meta[property="og:image"]').getAttribute('content')
	).toContain('/og-image/waypoint.jpg')
	expect(
		await page
			.locator('head meta[name="twitter:image"]')
			.getAttribute('content')
	).toContain('/og-image/waypoint.jpg')

	// canonical
	await page.goto('/waypoint?random=query')

	expect(await page.locator('head link[rel="canonical"]').count()).toEqual(1)

	expect(
		await page.locator('head link[rel="canonical"]').getAttribute('href')
	).toStrictEqual(`${__config.dev_dot.canonical_base_url}/waypoint`)
})

test('install page should render the expected metadata', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/waypoint/downloads')
	await expect(page.locator('head title')).toContainText(
		`Install | Waypoint | ${__config.dev_dot.meta.title}`
	)
})

test('tutorials page should render the expected metadata', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/waypoint/tutorials')
	await expect(page.locator('head title')).toContainText(
		`Tutorials | Waypoint | ${__config.dev_dot.meta.title}`
	)
})
