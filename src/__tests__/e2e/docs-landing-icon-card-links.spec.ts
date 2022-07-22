import { expect, test } from '@playwright/test'
import { __config } from '../../../.test/app-config'

// product data files
import hcpData from '../../data/hcp.json'
import nomadData from '../../data/nomad.json'
import vaultData from '../../data/vault.json'
import waypointData from '../../data/waypoint.json'

const BETA_PRODUCT_DATA = {
	hcp: hcpData,
	nomad: nomadData,
	vault: vaultData,
	waypoint: waypointData,
}

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

// For each beta product slug...
__config.dev_dot.beta_product_slugs.forEach((betaProductSlug) => {
	const productData = BETA_PRODUCT_DATA[betaProductSlug]

	// Generate a tests for each root docs path other than `docs`
	productData.rootDocsPaths.forEach(({ path, name }) => {
		// There is no IconCardLink for this path, ignore it
		if (path === 'docs') {
			return
		}

		// Create a test for this product + path
		const testName = `[/${betaProductSlug}/docs] ${name} \`IconCardLink\` goes to /${betaProductSlug}/${path}`
		test(testName, async ({ baseURL, page }) => {
			// Triple the available time for the test to ru
			test.slow()

			// Build expected page url from baseURL, product slug, and path
			const expectedPageUrl = `${baseURL}/${betaProductSlug}/${path}`

			// Load the /docs landing page
			await page.goto(`${baseURL}/${betaProductSlug}/docs`)

			// Get and click the anchor element rendered by IconCardLink
			await page
				.locator(`main header a[href="/${betaProductSlug}/${path}"]`, {
					hasText: name,
				})
				.click()

			// Wait for new url to load
			await page.waitForURL(expectedPageUrl)

			// Assert the correct page loaded
			await expect(page).toHaveURL(expectedPageUrl)
		})
	})
})
