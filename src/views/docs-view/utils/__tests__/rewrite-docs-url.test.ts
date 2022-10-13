import { ProductSlug } from 'types/products'
import { productSlugs } from 'lib/products'
import { rewriteDocsUrl } from '../product-url-adjusters'

describe('rewriteDocsUrl', () => {
	describe('/downloads links', () => {
		// there is no downloads link for hcp
		const productsToTest = productSlugs.filter((slug) => slug !== 'hcp')

		test.each(productsToTest)(
			'when currentProduct is %p',
			(productSlug: ProductSlug) => {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const productData = require(`data/${productSlug}.json`)
				const expectedOutput = `/${productSlug}/downloads`
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

	describe('Rewrite non-docs base paths to external links', () => {
		const testData = [
			{ input: '/pricing', expected: 'https://cloud.hashicorp.com/pricing' },
			{ input: '/sla', expected: 'https://cloud.hashicorp.com/sla' },
			{
				input: '/products/vault',
				expected: 'https://cloud.hashicorp.com/products/vault',
			},
			{ input: '/consul/docs/some-path', expected: '/consul/docs/some-path' }, // base case, it shouldn't get rewritten
			{ input: '#some-anchor-link', expected: '#some-anchor-link' }, // anchor links shouldn't get rewritten
		]
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const hcpProductData = require(`data/hcp.json`)

		test.each(testData)('Testing subpath', (item) => {
			expect(rewriteDocsUrl(item.input, hcpProductData)).toBe(item.expected)
		})
	})

	describe('does not rewrite folder-relative URLs', () => {
		const testData = [
			{ input: './docker', expected: './docker' },
			{ input: './lambda', expected: './lambda' },
		]
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const hcpProductData = require(`data/hcp.json`)

		test.each(testData)('Testing subpath', (item) => {
			expect(rewriteDocsUrl(item.input, hcpProductData)).toBe(item.expected)
		})
	})
})
