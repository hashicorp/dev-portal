import remark from 'remark'
import { cachedGetProductData } from 'lib/get-product-data'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'
import { getProductUrlAdjuster } from '../utils/product-url-adjusters'

describe('multiple remark plugins', () => {
	let waypointProduct
	let productUrlAdjuster

	beforeAll(() => {
		waypointProduct = cachedGetProductData('waypoint')
		productUrlAdjuster = getProductUrlAdjuster(waypointProduct)
	})

	describe('rewriteTutorialLinksPlugin, then remarkPluginAdjustLinkUrls', () => {
		test.each([
			['[Waypoint](https://waypointproject.io/)', '[Waypoint](/waypoint)'],
			['[Waypoint](/waypoint)', '[Waypoint](/waypoint)'],
			[
				'[Waypoint Tutorials](https://learn.hashicorp.com/waypoint)',
				'[Waypoint Tutorials](/waypoint/tutorials)',
			],
			[
				'[Waypoint Tutorials](/waypoint/tutorials)',
				'[Waypoint Tutorials](/waypoint/tutorials)',
			],
			[
				'[Some other link](https://kubernetes.io/docs/home/)',
				'[Some other link](https://kubernetes.io/docs/home/)',
			],
		])('%s -> %s', async (linkToProcess, expectedValue) => {
			const result = await remark()
				.use(rewriteTutorialLinksPlugin, {
					contentType: 'docs',
					tutorialMap: {},
				})
				.use(remarkPluginAdjustLinkUrls, { urlAdjustFn: productUrlAdjuster })
				.process(linkToProcess)

			// The link should be unchanged
			expect(result.contents).toMatch(expectedValue)
		})
	})
})
