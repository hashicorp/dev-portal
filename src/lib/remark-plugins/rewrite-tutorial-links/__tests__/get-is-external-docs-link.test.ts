import { ProductSlug } from 'types/products'
import { productSlugsToHostNames } from 'lib/products'
import { getIsExternalDocsLink } from '../utils'

const testEachCase = (testCases: [string, boolean][]) => {
	test.each(testCases)(
		'getIsExternalDocsLink(%p) returns %p',
		(input: string, expectedOutput: boolean) => {
			expect(getIsExternalDocsLink(input)).toBe(expectedOutput)
		}
	)
}

describe('getIsExternalDocsLink', () => {
	const generatedCases = []

	Object.keys(productSlugsToHostNames).forEach((slug: ProductSlug) => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const basePaths = require(`data/${slug}.json`).basePaths
		const hostname = productSlugsToHostNames[slug]
		const origin = `https://${hostname}`

		generatedCases.push([hostname, false])
		generatedCases.push([origin, true])
		generatedCases.push([`/${slug}`, false])
		generatedCases.push([`/${slug}/docs`, false])
		generatedCases.push([`${origin}/`, true])
		generatedCases.push([`https://www.${hostname}`, true])
		generatedCases.push([`https://www.${hostname}/`, true])
		generatedCases.push([`${origin}/not-a-docs-path`, false])

		basePaths.forEach((path: string) => {
			if (path === 'api-docs') {
				generatedCases.push([`${origin}/api`, true])
				generatedCases.push([`${origin}/api?param=value`, true])
				generatedCases.push([`${origin}/api/some-path`, true])
				generatedCases.push([`${origin}/api/some-path?param=value`, true])
				generatedCases.push([`${origin}/api-docs`, true])
				generatedCases.push([`${origin}/api-docs?param=value`, true])
				generatedCases.push([`${origin}/api-docs/some-path`, true])
				generatedCases.push([`${origin}/api-docs/some-path?param=value`, true])
			} else {
				generatedCases.push([`${origin}/${path}`, true])
				generatedCases.push([`${origin}/${path}?param=value`, true])
				generatedCases.push([`${origin}/${path}/some-path`, true])
				generatedCases.push([`${origin}/${path}/some-path?param=value`, true])
			}
		})
	})

	testEachCase([
		[undefined, false],
		[null, false],
		['', false],
		['not-a-docs-link', false],
		['/', false],
		['https://learn.hashicorp.com/docs', false],
		['https://not-waypoint-site.io/docs', false],
		['https://cloud.hashicorp.com/api', false],
		['https://cloud.hashicorp.com/api-docs', false],
		...generatedCases,
	])
})
