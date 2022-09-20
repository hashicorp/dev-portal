import { rewriteExternalDocsLink } from '../utils'

const getTestURLObject = (url: string) => {
	return new URL(url, __config.dev_dot.canonical_base_url)
}

const testEachCase = (cases: [string, string][]) => {
	test.each(cases)(
		'rewriteExternalDocsLink(%p, %p) returns %p',
		(input: string, expectedOutput: string) => {
			const testUrlObject = getTestURLObject(input)
			expect(rewriteExternalDocsLink(testUrlObject)).toBe(expectedOutput)
		}
	)
}

describe('rewriteExternalDocsLink', () => {
	describe('when the URL is not to an external docs site', () => {
		testEachCase([
			['/vault/api', undefined],
			['/waypoint/docs', undefined],
			['/vault/tutorials', undefined],
			['/waypoint/tutorials', undefined],
			['https://developer.hashicorp.com/vault/api', undefined],
			['https://developer.hashicorp.com/waypoint/docs', undefined],
			['https://learn.hashicorp.com/vault', undefined],
			['https://learn.hashicorp.com/waypoint', undefined],
		])
	})

	describe('when neither `search` nor `hash` are present', () => {
		describe('when the base path is not "api"', () => {
			testEachCase([
				['https://waypointproject.io/docs', '/waypoint/docs'],
				[
					'https://waypointproject.io/docs/some/path',
					'/waypoint/docs/some/path',
				],
			])
		})

		describe('when the base path is "api"', () => {
			testEachCase([
				['https://waypointproject.io/api', '/waypoint/api-docs'],
				[
					'https://waypointproject.io/api/some/path',
					'/waypoint/api-docs/some/path',
				],
			])
		})

		describe('when the page is "index.html"', () => {
			testEachCase([
				['https://waypointproject.io/docs/index.html', '/waypoint/docs'],
				[
					'https://waypointproject.io/docs/some/path/index.html',
					'/waypoint/docs/some/path',
				],
				['https://waypointproject.io/api/index.html', '/waypoint/api-docs'],
				[
					'https://waypointproject.io/api/some/path/index.html',
					'/waypoint/api-docs/some/path',
				],
			])
		})

		describe('when the page ends with ".html"', () => {
			testEachCase([
				['https://waypointproject.io/docs/page.html', '/waypoint/docs/page'],
				[
					'https://waypointproject.io/docs/some/path.html',
					'/waypoint/docs/some/path',
				],
				['https://waypointproject.io/api/page.html', '/waypoint/api-docs/page'],
				[
					'https://waypointproject.io/api/some/path.html',
					'/waypoint/api-docs/some/path',
				],
			])
		})
	})

	describe('when `search` is present, and `hash` is NOT present', () => {
		testEachCase([
			[
				'https://waypointproject.io/docs?paramA=valueA',
				'/waypoint/docs?paramA=valueA',
			],
			[
				'https://waypointproject.io/api?paramA=valueA',
				'/waypoint/api-docs?paramA=valueA',
			],
			[
				'https://waypointproject.io/docs/index.html?paramA=valueA',
				'/waypoint/docs?paramA=valueA',
			],
			[
				'https://waypointproject.io/api/index.html?paramA=valueA',
				'/waypoint/api-docs?paramA=valueA',
			],
			[
				'https://waypointproject.io/docs/page.html?paramA=valueA',
				'/waypoint/docs/page?paramA=valueA',
			],
			[
				'https://waypointproject.io/api/page.html?paramA=valueA',
				'/waypoint/api-docs/page?paramA=valueA',
			],
		])
	})

	describe('when `search` is NOT present, and `hash` is present', () => {
		testEachCase([
			['https://waypointproject.io/docs#test-hash', '/waypoint/docs#test-hash'],
			[
				'https://waypointproject.io/api#test-hash',
				'/waypoint/api-docs#test-hash',
			],
			[
				'https://waypointproject.io/docs/index.html#test-hash',
				'/waypoint/docs#test-hash',
			],
			[
				'https://waypointproject.io/api/index.html#test-hash',
				'/waypoint/api-docs#test-hash',
			],
			[
				'https://waypointproject.io/docs/page.html#test-hash',
				'/waypoint/docs/page#test-hash',
			],
			[
				'https://waypointproject.io/api/page.html#test-hash',
				'/waypoint/api-docs/page#test-hash',
			],
		])
	})

	describe('when both `search` and `hash` are present', () => {
		testEachCase([
			[
				'https://waypointproject.io/docs?paramA=valueA#test-hash',
				'/waypoint/docs?paramA=valueA#test-hash',
			],
			[
				'https://waypointproject.io/api?paramA=valueA#test-hash',
				'/waypoint/api-docs?paramA=valueA#test-hash',
			],
			[
				'https://waypointproject.io/docs/index.html?paramA=valueA#test-hash',
				'/waypoint/docs?paramA=valueA#test-hash',
			],
			[
				'https://waypointproject.io/api/index.html?paramA=valueA#test-hash',
				'/waypoint/api-docs?paramA=valueA#test-hash',
			],
			[
				'https://waypointproject.io/docs/page.html?paramA=valueA#test-hash',
				'/waypoint/docs/page?paramA=valueA#test-hash',
			],
			[
				'https://waypointproject.io/api/page.html?paramA=valueA#test-hash',
				'/waypoint/api-docs/page?paramA=valueA#test-hash',
			],
		])
	})
})
