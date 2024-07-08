/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'
import { __config } from '@test/app-config'

test('should render the proper page title and description', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/')
	expect(page).toHaveTitle(__config.dev_dot.meta.title)

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
	await page.goto('/nomad')
	await expect(page).toHaveTitle(`Nomad | ${__config.dev_dot.meta.title}`)
	expect(
		await page.locator('head meta[name="description"]').getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'Nomad'))

	expect(
		await page
			.locator('head meta[name="twitter:description"]')
			.getAttribute('content')
	).toEqual(__config.dev_dot.meta.description.replace('{product}', 'Nomad'))

	expect(
		await page.locator('head meta[property="og:image"]').getAttribute('content')
	).toContain('/og-image/nomad.jpg')
	expect(
		await page
			.locator('head meta[name="twitter:image"]')
			.getAttribute('content')
	).toContain('/og-image/nomad.jpg')

	// canonical
	await page.goto('/nomad?random=query')

	expect(await page.locator('head link[rel="canonical"]').count()).toEqual(1)

	expect(
		await page.locator('head link[rel="canonical"]').getAttribute('href')
	).toStrictEqual(`${__config.dev_dot.canonical_base_url}/nomad`)
})

test('install page should render the expected metadata', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/nomad/install')
	await expect(page).toHaveTitle(
		`Install | Nomad | ${__config.dev_dot.meta.title}`
	)
})

test('tutorials page should render the expected metadata', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/nomad/tutorials')
	await expect(page).toHaveTitle(
		`Tutorials | Nomad | ${__config.dev_dot.meta.title}`
	)
})
