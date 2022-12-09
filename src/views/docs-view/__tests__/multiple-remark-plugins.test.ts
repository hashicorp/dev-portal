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

	test('rewriteTutorialLinksPlugin, then remarkPluginAdjustLinkUrls', async () => {
		const linkToProcess = '[Waypoint](/waypoint)'

		const result = await remark()
			.use(rewriteTutorialLinksPlugin, {
				contentType: 'docs',
				tutorialMap: {},
			})
			.use(remarkPluginAdjustLinkUrls, { urlAdjustFn: productUrlAdjuster })
			.process(linkToProcess)

		// The link should be unchanged
		expect(result.contents).toMatch(linkToProcess)
	})
})
