import { ProductSlug } from 'types/products'
import { productSlugs } from 'lib/products'
import { rewriteDocsUrl } from '../product-url-adjusters'

describe('rewriteDocsUrl', () => {
	describe('/downloads links', () => {
		test.each(productSlugs)(
			'when currentProduct is %p',
			(productSlug: ProductSlug) => {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const productData = require(`data/${productSlug}.json`)
				const expectedOutput =
					productSlug === 'hcp' ? '/downloads' : `/${productSlug}/downloads`
				expect(rewriteDocsUrl('/downloads', productData)).toBe(expectedOutput)

				// special case for vagrant vmware utility downloads page
				if (productSlug === 'vagrant') {
					expect(rewriteDocsUrl('/vmware/downloads', productData)).toBe(
						`/${productSlug}/downloads/vmware`
					)
				}
			}
		)
	})
})
