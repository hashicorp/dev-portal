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
	testEachCase([
		['/docs', 'waypoint', '/waypoint/docs'],
		['/api', 'vault', '/vault/api-docs'],
		['/docs/some/path', 'waypoint', '/waypoint/docs/some/path'],
		['/docs/some-doc.html', 'waypoint', '/waypoint/docs/some-doc'],
		['/api/index.html', 'waypoint', '/waypoint/api-docs'],
	])
})
