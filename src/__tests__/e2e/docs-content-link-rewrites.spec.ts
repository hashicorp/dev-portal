import { test, expect } from '@playwright/test'
import waypointData from '../../../scripts/docs-content-link-rewrites/.generated/rewritten-links/waypoint.json'

/**
 * TODO abstract to accept inputs
 */

const STAGING_URL = 'https://waypoint-git-main-hashicorp.vercel.app/'
const PREVIEW_URL =
	'https://waypoint-git-docs-ambmigrate-link-formats-hashicorp.vercel.app/'

// Run all the tests generated in this file in parallel
test.describe.configure({ mode: 'parallel' })

/**
 * TODO this will not generate any tests in a PR
 */
Object.keys(waypointData ?? {}).forEach((fileName) => {
	const relativePath = fileName.replace(/\.mdx$/, '').replace(/\/index$/, '')
	const pathToTest = `waypoint${relativePath}`

	test(fileName, async ({ page }) => {
		/**
		 * GET STAGING LINKS
		 */
		await page.goto(`${STAGING_URL}${pathToTest}`)
		const stagingContentLinks = page.locator(
			'[class^="docs-view_mdxContent"] a'
		)
		const stagingHrefs = await stagingContentLinks.evaluateAll(
			(anchors: HTMLAnchorElement[]) =>
				anchors.map((anchor: HTMLAnchorElement) => {
					const { pathname = '', search = '', hash = '' } = new URL(anchor.href)
					return `${pathname}${search}${hash}`
				})
		)

		/**
		 * GET PREVIEW URL LINKS
		 */
		await page.goto(`${PREVIEW_URL}${pathToTest}`)
		const previewContentLinks = page.locator(
			'[class^="docs-view_mdxContent"] a'
		)
		const previewHrefs = await previewContentLinks.evaluateAll(
			(anchors: HTMLAnchorElement[]) =>
				anchors.map((anchor: HTMLAnchorElement) => {
					const { pathname = '', search = '', hash = '' } = new URL(anchor.href)
					return `${pathname}${search}${hash}`
				})
		)

		/**
		 * ASSERT STUFF
		 */
		expect(JSON.stringify(previewHrefs)).toEqual(JSON.stringify(stagingHrefs))
	})
})
