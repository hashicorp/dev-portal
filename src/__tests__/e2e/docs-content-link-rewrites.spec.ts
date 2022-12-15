import path from 'path'
import { test, expect, Page } from '@playwright/test'
import { ALL_PAGE_PATHS_OUTPUT_FILE_PATH } from '../../../scripts/docs-content-link-rewrites/constants'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

// TODO set an id from a constant, reference the constant here
const CONTENT_AREA_ANCHOR_SELECTOR = '[class^="docs-view_mdxContent"] a'

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
}) => {
	// Go to the full page url
	const fullPageUrl = path.join(previewBaseUrl, pathToTest)
	await pageInstance.goto(fullPageUrl)

	// Gather up the pathname, search, and hash of each href
	const contentLinks = pageInstance.locator(CONTENT_AREA_ANCHOR_SELECTOR)
	const hrefs = await contentLinks.evaluateAll(
		(anchors: HTMLAnchorElement[]) => {
			return anchors.map((anchor: HTMLAnchorElement) => {
				const { pathname = '', search = '', hash = '' } = new URL(anchor.href)
				return `${pathname}${search}${hash}`
			})
		}
	)

	// Return the gathered hrefs
	return hrefs
}

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
					expect(JSON.stringify(prBranchHrefs)).toEqual(
						JSON.stringify(mainBranchHrefs)
					)
				})
			})
		})
	})
})
