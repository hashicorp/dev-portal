import { ProductSlug } from 'types/products'
import { productSlugsToHostNames } from 'lib/products'
import { rewriteExternalDocsLink } from '../utils'

const getTestURLObject = (url: string) => {
	return new URL(url, __config.dev_dot.canonical_base_url)
}

const URL_SUFFIXES = ['', '?param=value', '#heading', '?param=value#heading']

const testEachCase = (cases: [string, string][]) => {
	const allCases = []
	cases.forEach(([input, expected]) => {
		URL_SUFFIXES.forEach((suffix) => {
			allCases.push([
				typeof input === 'string' ? `${input}${suffix}` : input,
				typeof expected === 'string' ? `${expected}${suffix}` : expected,
			])
		})
	})

	test.each(allCases)('%p -> %p', (input: string, expectedOutput: string) => {
		const testUrlObject = getTestURLObject(input)
		expect(rewriteExternalDocsLink(testUrlObject)).toBe(expectedOutput)
	})
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

	describe('when the `basePath` is not rewriteable for the determined product', () => {
		testEachCase([
			['https://www.vaultproject.io/use-cases', undefined],
			['https://www.vaultproject.io/community', undefined],
			['https://www.vaultproject.io/some-random-base-path', undefined],
		])
	})

	describe('docs site home pages are rewritten to product landing pages', () => {
		testEachCase(
			Object.keys(productSlugsToHostNames).map((productSlug: ProductSlug) => {
				const hostname = `https://${productSlugsToHostNames[productSlug]}`
				const productLandingPath = `/${productSlug}`
				const expectedOutput = productLandingPath

				return [hostname, expectedOutput]
			})
		)
	})

	describe('when neither `search` nor `hash` are present', () => {
		describe('when the base path is not "api"', () => {
			testEachCase([
				['https://vaultproject.io/docs', '/vault/docs'],
				['https://waypointproject.io/docs', '/waypoint/docs'],
				['https://vaultproject.io/docs/some/path', '/vault/docs/some/path'],
				[
					'https://waypointproject.io/docs/some/path',
					'/waypoint/docs/some/path',
				],
			])
		})

		describe('when the base path is "api"', () => {
			testEachCase([
				['https://vaultproject.io/api', '/vault/api-docs'],
				['https://vaultproject.io/api/some/path', '/vault/api-docs/some/path'],
			])
		})

		describe('when the page is "index.html"', () => {
			testEachCase([
				['https://waypointproject.io/docs/index.html', '/waypoint/docs'],
				[
					'https://waypointproject.io/docs/some/path/index.html',
					'/waypoint/docs/some/path',
				],
				['https://vaultproject.io/api/index.html', '/vault/api-docs'],
				[
					'https://vaultproject.io/api/some/path/index.html',
					'/vault/api-docs/some/path',
				],
			])
		})

		describe('when the page ends with ".html"', () => {
			testEachCase([
				['https://www.terraform.io/downloads.html', '/terraform/downloads'],
				['https://waypointproject.io/docs/page.html', '/waypoint/docs/page'],
				[
					'https://waypointproject.io/docs/some/path.html',
					'/waypoint/docs/some/path',
				],
				['https://vaultproject.io/api/page.html', '/vault/api-docs/page'],
				[
					'https://vaultproject.io/api/some/path.html',
					'/vault/api-docs/some/path',
				],
			])
		})
	})
})
