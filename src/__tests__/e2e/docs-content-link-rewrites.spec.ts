/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { test, expect, Page, Locator } from '@playwright/test'
import { SIDEBAR_NAV_ELEMENT_ID, MAIN_ELEMENT_ID } from 'constants/element-ids'
import { ALL_PAGE_PATHS_OUTPUT_FILE_PATH } from '@scripts/docs-content-link-rewrites/constants'

const SIDEBAR_NAV_ANCHOR_SELECTOR = `${SIDEBAR_NAV_ELEMENT_ID} a`
const CONTENT_AREA_ANCHOR_SELECTOR = `${MAIN_ELEMENT_ID} a`

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

/**
 * Given a Playwright Locator for anchors, returns an array of hrefs.
 */
const gatherHrefsFromLocator = async (
	anchorLocator: Locator
): Promise<string[]> => {
	return anchorLocator.evaluateAll((anchors: HTMLAnchorElement[]) => {
		return (
			anchors
				// filter out anchor elements with empty hrefs (such as ones injected for headings)
				.filter((anchor: HTMLAnchorElement) => anchor.href?.length > 0)
				// pull the path, search query string, and anchor string for each non-empty href
				.map((anchor: HTMLAnchorElement) => {
					const { pathname = '', search = '', hash = '' } = new URL(anchor.href)
					return `${pathname}${search}${hash}`
				})
		)
	})
}

/**
 * Given the Playwright Page instance, the path of a page to test, and preview's
 * base url, returns an array of hrefs found in the content area of the page.
 */
const getHrefsForPreviewUrl = async ({
	pageInstance,
	pathToTest,
	previewBaseUrl,
}: {
	pageInstance: Page
	pathToTest: string
	previewBaseUrl: string
}): Promise<{ contentHrefs: string[]; sidebarNavHrefs: string[] }> => {
	// Go to the full page url
	const fullPageUrl = path.join(previewBaseUrl, pathToTest)
	await pageInstance.goto(fullPageUrl)

	// Gather up the pathname, search, and hash of each content area href
	const contentLinks = pageInstance.locator(CONTENT_AREA_ANCHOR_SELECTOR)
	const contentHrefs = await gatherHrefsFromLocator(contentLinks)

	// Gather up the pathname, search, and hash of each content area href
	const sidebarNavLinks = pageInstance.locator(SIDEBAR_NAV_ANCHOR_SELECTOR)
	const sidebarNavHrefs = await gatherHrefsFromLocator(sidebarNavLinks)

	// Return the gathered hrefs
	return { contentHrefs, sidebarNavHrefs }
}

test.describe('docs-content-link-rewrites', () => {
	// Pull inputs from the environment
	const { MAIN_BRANCH_PREVIEW_URL, PR_BRANCH_PREVIEW_URL } = process.env

	// Fail the suite if either required variable is not set
	test('Required environment variables are set', () => {
		expect(typeof MAIN_BRANCH_PREVIEW_URL).toBe('string')
		expect(MAIN_BRANCH_PREVIEW_URL).not.toHaveLength(0)
		expect(typeof PR_BRANCH_PREVIEW_URL).toBe('string')
		expect(PR_BRANCH_PREVIEW_URL).not.toHaveLength(0)
	})

	test.describe('Main assertions', () => {
		// Skip the rest of the tests if the required variables aren't set
		const shouldSkipNextTests =
			!MAIN_BRANCH_PREVIEW_URL || !PR_BRANCH_PREVIEW_URL
		test.skip(
			() => shouldSkipNextTests,
			'The `MAIN_BRANCH_PREVIEW_URL` and `PR_BRANCH_PREVIEW_URL` environment variables are required'
		)

		// Generate a test for each path in the imported JSON file
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const allPagePathsByBasePath = require(ALL_PAGE_PATHS_OUTPUT_FILE_PATH)
		const basePaths = Object.keys(allPagePathsByBasePath)
		basePaths.forEach((basePath: string) => {
			test.describe(basePath, () => {
				const pagePaths = allPagePathsByBasePath[basePath]
				pagePaths.forEach((pathToTest: string) => {
					test(pathToTest, async ({ page }: { page: Page }) => {
						console.log('Checking links on', path.join('/', pathToTest))

						// Get all anchor hrefs for the main branch's page
						const mainBranchHrefs = await getHrefsForPreviewUrl({
							pageInstance: page,
							pathToTest,
							previewBaseUrl: MAIN_BRANCH_PREVIEW_URL,
						})

						// Get all anchor hrefs for the pr branch's page
						const prBranchHrefs = await getHrefsForPreviewUrl({
							pageInstance: page,
							pathToTest,
							previewBaseUrl: PR_BRANCH_PREVIEW_URL,
						})

						// Assert that the hrefs are the same for both branches' preview pages
						expect(JSON.stringify(prBranchHrefs, null, 2)).toEqual(
							JSON.stringify(mainBranchHrefs, null, 2)
						)
					})
				})
			})
		})
	})
})
