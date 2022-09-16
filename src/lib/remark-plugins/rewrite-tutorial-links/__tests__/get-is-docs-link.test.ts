import { ProductSlug, RootDocsPath } from 'types/products'
import { productSlugsToHostNames } from 'lib/products'
import { getIsDocsLink } from '../utils/get-is-docs-link'

const testEachCase = (testCases: [string, boolean][]) => {
	test.each(testCases)(
		'getIsDocsLink(%p) returns %p',
		(input: string, expectedOutput: boolean) => {
			expect(getIsDocsLink(input)).toBe(expectedOutput)
		}
	)
}

describe('getIsDocsLink', () => {
	const generatedCases = []

	Object.keys(productSlugsToHostNames).forEach((slug: ProductSlug) => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const rootDocsPaths = require(`data/${slug}.json`).rootDocsPaths
		const hostname = productSlugsToHostNames[slug]

		generatedCases.push([hostname, false])
		generatedCases.push([`https://${hostname}`, true])
		generatedCases.push([`https://${hostname}/`, true])
		generatedCases.push([`https://www.${hostname}`, true])
		generatedCases.push([`https://www.${hostname}/`, true])
		generatedCases.push([
			`https://${hostname}/downloads`,
			slug === 'hcp' ? false : true,
		])
		generatedCases.push([
			`https://${hostname}/downloads/enterprise`,
			slug === 'hcp' ? false : true,
		])
		generatedCases.push([`https://${hostname}/not-a-docs-path`, false])

		rootDocsPaths.forEach(({ path }: RootDocsPath) => {
			if (path === 'api-docs') {
				generatedCases.push([`https://${hostname}/api`, true])
				generatedCases.push([`https://${hostname}/api/some-path`, true])
				generatedCases.push([`https://${hostname}/api-docs`, true])
				generatedCases.push([`https://${hostname}/api-docs/some-path`, true])
			} else {
				generatedCases.push([`https://${hostname}/${path}`, true])
				generatedCases.push([`https://${hostname}/${path}/some-path`, true])
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
		...generatedCases,
	])
})
