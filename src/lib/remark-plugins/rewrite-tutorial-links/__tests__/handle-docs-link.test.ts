import { ProductSlug } from 'types/products'
import { handleDocsLink } from '../utils'

const testEachCase = (cases: [string, ProductSlug, string][]) => {
	test.each(cases)(
		'handleDocsLink(%p, %p) returns %p',
		(input: string, productSlug: ProductSlug, expectedOutput: string) => {
			expect(handleDocsLink(input, productSlug)).toBe(expectedOutput)
		}
	)
}

describe('handleDocsLink', () => {
	testEachCase([
		['/docs', 'waypoint', '/waypoint/docs'],
		['/api/', 'vault', '/vault/api-docs/'],
		['/docs/some-doc.html', 'waypoint', '/waypoint/docs/some-doc'],
		['/api/index.html', 'waypoint', '/waypoint/api'],
	])
})
