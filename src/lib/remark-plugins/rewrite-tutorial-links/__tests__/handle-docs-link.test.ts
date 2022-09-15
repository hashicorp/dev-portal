import { ProductSlug } from 'types/products'
import { handleDocsLink } from '../utils'

const getTestURLObject = (url: string) => {
	return new URL(url, __config.dev_dot.canonical_base_url)
}

const testEachCase = (cases: [string, ProductSlug, string][]) => {
	test.each(cases)(
		'handleDocsLink(%p, %p) returns %p',
		(input: string, productSlug: ProductSlug, expectedOutput: string) => {
			const testUrlObject = getTestURLObject(input)
			expect(handleDocsLink(testUrlObject, productSlug)).toBe(expectedOutput)
		}
	)
}

describe('handleDocsLink', () => {
	describe('when the base path is not "api"', () => {
		testEachCase([
			['/docs', 'waypoint', '/waypoint/docs'],
			['/docs/some/path', 'waypoint', '/waypoint/docs/some/path'],
		])
	})

	describe('when the base path is "api"', () => {
		testEachCase([
			['/api', 'waypoint', '/waypoint/api-docs'],
			['/api/some/path', 'waypoint', '/waypoint/api-docs/some/path'],
		])
	})

	describe('when the page is "index.html"', () => {
		testEachCase([
			['/docs/index.html', 'waypoint', '/waypoint/docs'],
			['/docs/some/path/index.html', 'waypoint', '/waypoint/docs/some/path'],
			['/api/index.html', 'waypoint', '/waypoint/api-docs'],
			['/api/some/path/index.html', 'waypoint', '/waypoint/api-docs/some/path'],
		])
	})

	describe('when the page ends with ".html"', () => {
		testEachCase([
			['/docs/page.html', 'waypoint', '/waypoint/docs/page'],
			['/docs/some/path.html', 'waypoint', '/waypoint/docs/some/path'],
			['/api/page.html', 'waypoint', '/waypoint/api-docs/page'],
			['/api/some/path.html', 'waypoint', '/waypoint/api-docs/some/path'],
		])
	})
})
