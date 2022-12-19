import { expect, test } from '@playwright/test'

/**
 * Test to validate the fix made in https://github.com/hashicorp/dev-portal/pull/850
 * Validates that the links in the "Documentation" menu in the header are valid and result in 200s
 */
test('product "Documentation" menu renders correct links', async ({
	baseURL,
	page,
}) => {
	await page.goto(`${baseURL}/vault`)

	const navActivator = page.locator('header button', {
		has: page.locator('text=Documentation'),
	})

	await navActivator.hover()

	const dropdownId = await navActivator.getAttribute('aria-controls')

	const firstMenuItem = page.locator(`#${dropdownId} a`).first()

	const firstMenuItemUrl = await firstMenuItem.getAttribute('href')

	const response = await page.goto(`${baseURL}${firstMenuItemUrl}`)

	expect(response.status()).toBe(200)
})
