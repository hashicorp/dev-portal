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
	describe('when neither `search` nor `hash` are present', () => {
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
				[
					'/api/some/path/index.html',
					'waypoint',
					'/waypoint/api-docs/some/path',
				],
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

	describe('when `search` is present, and `hash` is NOT present', () => {
		testEachCase([
			['/docs?paramA=valueA', 'waypoint', '/waypoint/docs?paramA=valueA'],
			['/api?paramA=valueA', 'waypoint', '/waypoint/api-docs?paramA=valueA'],
			[
				'/docs/index.html?paramA=valueA',
				'waypoint',
				'/waypoint/docs?paramA=valueA',
			],
			[
				'/api/index.html?paramA=valueA',
				'waypoint',
				'/waypoint/api-docs?paramA=valueA',
			],
			[
				'/docs/page.html?paramA=valueA',
				'waypoint',
				'/waypoint/docs/page?paramA=valueA',
			],
			[
				'/api/page.html?paramA=valueA',
				'waypoint',
				'/waypoint/api-docs/page?paramA=valueA',
			],
		])
	})

	describe('when `search` is NOT present, and `hash` is present', () => {
		testEachCase([
			['/docs#test-hash', 'waypoint', '/waypoint/docs#test-hash'],
			['/api#test-hash', 'waypoint', '/waypoint/api-docs#test-hash'],
			['/docs/index.html#test-hash', 'waypoint', '/waypoint/docs#test-hash'],
			['/api/index.html#test-hash', 'waypoint', '/waypoint/api-docs#test-hash'],
			[
				'/docs/page.html#test-hash',
				'waypoint',
				'/waypoint/docs/page#test-hash',
			],
			[
				'/api/page.html#test-hash',
				'waypoint',
				'/waypoint/api-docs/page#test-hash',
			],
		])
	})

	describe('when both `search` and `hash` are present', () => {
		testEachCase([
			[
				'/docs?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/docs?paramA=valueA#test-hash',
			],
			[
				'/api?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/api-docs?paramA=valueA#test-hash',
			],
			[
				'/docs/index.html?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/docs?paramA=valueA#test-hash',
			],
			[
				'/api/index.html?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/api-docs?paramA=valueA#test-hash',
			],
			[
				'/docs/page.html?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/docs/page?paramA=valueA#test-hash',
			],
			[
				'/api/page.html?paramA=valueA#test-hash',
				'waypoint',
				'/waypoint/api-docs/page?paramA=valueA#test-hash',
			],
		])
	})
})
