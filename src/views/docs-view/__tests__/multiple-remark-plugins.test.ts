import remark from 'remark'
import { cachedGetProductData } from 'lib/get-product-data'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'
import { getProductUrlAdjuster } from '../utils/product-url-adjusters'

const URL_SUFFIXES = ['', '?param=value', '#heading', '?param=value#heading']

const testEachCase = (productUrlAdjuster, testCases) => {
	const allTestCases = []
	testCases.forEach(({ input, expected }) => {
		URL_SUFFIXES.forEach((suffix) => {
			allTestCases.push({
				input: `${input}${suffix}`,
				expected: `${expected}${suffix}`,
			})
		})
	})

	test.each(allTestCases)(
		'$input -> $expected',
		async ({ input, expected }) => {
			const result = await remark()
				.use(rewriteTutorialLinksPlugin, {
					contentType: 'docs',
					tutorialMap: {},
				})
				.use(remarkPluginAdjustLinkUrls, {
					urlAdjustFn: productUrlAdjuster,
				})
				.process(`[test](${input})`)
			expect(result.contents).toMatch(`[test](${expected})`)
		}
	)
}

describe('multiple remark plugins', () => {
	describe('rewriteTutorialLinksPlugin, then remarkPluginAdjustLinkUrls', () => {
		const waypointProduct = cachedGetProductData('waypoint')
		const productUrlAdjuster = getProductUrlAdjuster(waypointProduct)

		testEachCase(productUrlAdjuster, [
			{
				input: 'https://waypointproject.io/',
				expected: '/waypoint',
			},
			{
				input: '/waypoint',
				expected: '/waypoint',
			},
			{
				input: 'https://learn.hashicorp.com/waypoint',
				expected: '/waypoint/tutorials',
			},
			{
				input: '/waypoint/tutorials',
				expected: '/waypoint/tutorials',
			},
			{
				input: 'https://kubernetes.io/docs/home/',
				expected: 'https://kubernetes.io/docs/home/',
			},
		])
	})
})
