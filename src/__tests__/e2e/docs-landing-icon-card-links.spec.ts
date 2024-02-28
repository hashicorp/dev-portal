/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { expect, test } from '@playwright/test'
import packerData from '../../data/packer.json'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

// Generate a test for each root docs path other than `docs`
packerData.rootDocsPaths.forEach(({ path, name }) => {
	// There is no IconCardLink for the docs root path, ignore it
	if (path === 'docs') {
		return
	}

	// Create a test for this product + path
	const testName = `[/packer/docs] ${name} \`IconCardLink\` goes to /packer/${path}`
	test(testName, async ({ baseURL, page }) => {
		// Build expected page url from baseURL, product slug, and path
		const expectedPageUrl = `${baseURL}/packer/${path}`

		// Load the /packer/docs landing page before each test
		await page.goto(`${baseURL}/packer/docs`)

		// Click the `IconCardLink`'s list item element
		await page.locator('main header li', { hasText: name }).click()

		// Wait for the expected page URL to load
		await page.waitForURL(expectedPageUrl)

		// Assert the correct page loaded
		expect(page.url()).toBe(expectedPageUrl)
	})
})
