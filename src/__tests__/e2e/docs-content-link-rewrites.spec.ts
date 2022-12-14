import path from 'path'
import { test, expect } from '@playwright/test'
import { getAllPagePaths } from 'lib/get-all-page-paths'

/**
 * TODO abstract to accept inputs
 */
const PRODUCT_SLUG = 'waypoint'
const MAIN_BRANCH_PREVIEW_URL =
	'https://waypoint-git-main-hashicorp.vercel.app/'
const PR_BRANCH_PREVIEW_URL =
	'https://waypoint-git-docs-ambmigrate-link-formats-hashicorp.vercel.app/'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

/**
 * TODO this will not generate any tests in a PR
 */
getAllPagePaths({
	basePath: 'docs',
	branchName: 'main',
	repoName: 'waypoint',
}).then((paths) => {
	test('TODO', () => {
		console.log(paths)
		expect(true).toBe(true)
	})
	// paths.forEach((pagePathToTest) => {
	// 	test(pagePathToTest, async ({ page }) => {
	// 		// Get all anchor hrefs for the main branch's page
	// 		const mainBranchPageUrl = path.join(
	// 			MAIN_BRANCH_PREVIEW_URL,
	// 			pagePathToTest
	// 		)
	// 		await page.goto(mainBranchPageUrl)
	// 		const mainBranchContentLinks = page.locator(
	// 			'[class^="docs-view_mdxContent"] a'
	// 		)
	// 		const mainBranchHrefs = await mainBranchContentLinks.evaluateAll(
	// 			(anchors: HTMLAnchorElement[]) =>
	// 				anchors.map((anchor: HTMLAnchorElement) => {
	// 					const {
	// 						pathname = '',
	// 						search = '',
	// 						hash = '',
	// 					} = new URL(anchor.href)
	// 					return `${pathname}${search}${hash}`
	// 				})
	// 		)

	// 		// Get all anchor hrefs for the pr branch's page
	// 		const prBranchPageUrl = path.join(PR_BRANCH_PREVIEW_URL, pagePathToTest)
	// 		await page.goto(prBranchPageUrl)
	// 		const prBranchContentLinks = page.locator(
	// 			'[class^="docs-view_mdxContent"] a'
	// 		)
	// 		const prBranchHrefs = await prBranchContentLinks.evaluateAll(
	// 			(anchors: HTMLAnchorElement[]) =>
	// 				anchors.map((anchor: HTMLAnchorElement) => {
	// 					const {
	// 						pathname = '',
	// 						search = '',
	// 						hash = '',
	// 					} = new URL(anchor.href)
	// 					return `${pathname}${search}${hash}`
	// 				})
	// 		)

	// 		// Assert that the hrefs are the same for both branch's preview pages
	// 		expect(JSON.stringify(prBranchHrefs)).toEqual(
	// 			JSON.stringify(mainBranchHrefs)
	// 		)
	// 	})
	// })
})
