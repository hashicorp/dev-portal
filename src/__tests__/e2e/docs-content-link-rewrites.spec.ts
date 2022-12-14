import path from 'path'
import { test, expect } from '@playwright/test'
import { ALL_PAGE_PATHS_OUTPUT_FILE_PATH } from '../../../scripts/docs-content-link-rewrites/constants'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

test.describe('docs-content-link-rewrites', () => {
	// Pull inputs from the environment
	const { MAIN_BRANCH_PREVIEW_URL, PR_BRANCH_PREVIEW_URL } = process.env

	// Fail the suite if either required variable is not set
	test('Required environment variables are set', () => {
		expect(MAIN_BRANCH_PREVIEW_URL).toBeDefined()
		expect(PR_BRANCH_PREVIEW_URL).toBeDefined()
	})

	// Throw an error to skip the tests that require the environment variables
	const canRunTests = MAIN_BRANCH_PREVIEW_URL && PR_BRANCH_PREVIEW_URL
	if (!canRunTests) {
		throw new Error(
			'The `MAIN_BRANCH_PREVIEW_URL` and `PR_BRANCH_PREVIEW_URL` environment variables are required'
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const allPagePathsByBasePath = require(ALL_PAGE_PATHS_OUTPUT_FILE_PATH)

	// Generate a test for each path in the imported JSON file
	const basePaths = Object.keys(allPagePathsByBasePath)
	basePaths.forEach((basePath: string) => {
		test.describe(basePath, () => {
			const pagePaths = allPagePathsByBasePath[basePath]
			pagePaths.forEach((pagePathToTest: string) => {
				test(pagePathToTest, async ({ page }) => {
					console.log('Checking links on', path.join('/', pagePathToTest))

					// Get all anchor hrefs for the main branch's page
					const mainBranchPageUrl = path.join(
						MAIN_BRANCH_PREVIEW_URL,
						pagePathToTest
					)
					await page.goto(mainBranchPageUrl)
					const mainBranchContentLinks = page.locator(
						'[class^="docs-view_mdxContent"] a'
					)
					const mainBranchHrefs = await mainBranchContentLinks.evaluateAll(
						(anchors: HTMLAnchorElement[]) =>
							anchors.map((anchor: HTMLAnchorElement) => {
								const {
									pathname = '',
									search = '',
									hash = '',
								} = new URL(anchor.href)
								return `${pathname}${search}${hash}`
							})
					)

					// Get all anchor hrefs for the pr branch's page
					const prBranchPageUrl = path.join(
						PR_BRANCH_PREVIEW_URL,
						pagePathToTest
					)
					await page.goto(prBranchPageUrl)
					const prBranchContentLinks = page.locator(
						'[class^="docs-view_mdxContent"] a'
					)
					const prBranchHrefs = await prBranchContentLinks.evaluateAll(
						(anchors: HTMLAnchorElement[]) =>
							anchors.map((anchor: HTMLAnchorElement) => {
								const {
									pathname = '',
									search = '',
									hash = '',
								} = new URL(anchor.href)
								return `${pathname}${search}${hash}`
							})
					)

					// Assert that the hrefs are the same for both branches' preview pages
					expect(JSON.stringify(prBranchHrefs)).toEqual(
						JSON.stringify(mainBranchHrefs)
					)
				})
			})
		})
	})
})
