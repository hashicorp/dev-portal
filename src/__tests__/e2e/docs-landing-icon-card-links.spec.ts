import { expect, test } from '@playwright/test'
import waypointData from '../../data/waypoint.json'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

// Generate a tests for each root docs path other than `docs`
waypointData.rootDocsPaths.forEach(({ path, name }) => {
	// There is no IconCardLink for the docs root path, ignore it
	if (path === 'docs') {
		return
	}

	// Create a test for this product + path
	const testName = `[/waypoint/docs] ${name} \`IconCardLink\` goes to /waypoint/${path}`
	test(testName, async ({ baseURL, page }) => {
		// Triple the available time for the test to ru
		test.slow()

		// Build expected page url from baseURL, product slug, and path
		const expectedPageUrl = `${baseURL}/waypoint/${path}`

		// Load the /docs landing page
		await page.goto(`${baseURL}/waypoint/docs`)

		// Get and click the anchor element rendered by IconCardLink
		await page
			.locator(`main header a[href="/waypoint/${path}"]`, {
				hasText: name,
			})
			.click()

		// Wait for new url to load
		await page.waitForURL(expectedPageUrl)

		// Assert the correct page loaded
		await expect(page).toHaveURL(expectedPageUrl)
	})
})
