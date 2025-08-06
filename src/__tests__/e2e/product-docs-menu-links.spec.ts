/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { expect, test } from '@playwright/test'

/**
 * Test to validate the fix made in https://github.com/hashicorp/dev-portal/pull/850
 * Validates that the links in the "Documentation" menu in the header are valid and result in 200s
 */
test('product "Documentation" menu renders correct links', async ({
	baseURL,
	page,
}) => {
	await page.goto(`${baseURL}/terraform`)

	const navActivator = page
		.locator('header')
		.getByRole('button', { name: 'Documentation' })

	await navActivator.hover({ force: true })

	const dropdownId = await navActivator.getAttribute('aria-controls')

	const firstMenuItem = page.locator(`#${dropdownId} a`).first()

	const firstMenuItemUrl = await firstMenuItem.getAttribute('href')

	const response = await page.goto(`${baseURL}${firstMenuItemUrl}`)

	expect(response.status()).toBe(200)
})
