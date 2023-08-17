/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs, productSlugsToHostNames } from 'lib/products'
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

	describe('does not rewrite tutorial links', () => {
		const testData = [
			{
				input:
					'/well-architected-framework/operational-excellence/operational-excellence-workspaces-projects',
				expected:
					'/well-architected-framework/operational-excellence/operational-excellence-workspaces-projects',
			},
			// special case for non devdot 'waf' link
			{
				input: 'https://aws.amazon.com/architecture/well-architected/',
				expected: 'https://aws.amazon.com/architecture/well-architected/',
			},
			{
				input: '/onboarding/tfcb-week-5/module-use',
				expected: '/onboarding/tfcb-week-5/module-use',
			},
			{
				input:
					'/boundary/tutorials/hcp-getting-started/hcp-getting-started-intro',
				expected:
					'/boundary/tutorials/hcp-getting-started/hcp-getting-started-intro',
			},
		]
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const hcpProductData = require(`data/hcp.json`)

		test.each(testData)('Testing subpath', (item) => {
			expect(rewriteDocsUrl(item.input, hcpProductData)).toBe(item.expected)
		})
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

	describe('does not rewrite .io home page links', () => {
		// Store an array of hostnames
		const hostnames = Object.values(productSlugsToHostNames)

		// For each product slug...
		productSlugs.forEach((productSlug: ProductSlug) => {
			// Fetch the product data object for `rewriteDocsUrl`
			const productData = cachedGetProductData(productSlug)

			// Test `rewriteDocsUrl` for each product data object
			describe(`under ${productSlug} content`, () => {
				test('does not rewrite `/`', () => {
					expect(rewriteDocsUrl('/', productData)).toBe('/')
				})

				// build up other test cases array
				const testCases = hostnames.map((dotIoHostName: string) => {
					const url = `https://${dotIoHostName}`
					return { input: { productData, url }, expected: url }
				})

				// execute each test
				test.each(testCases)('$input.url -> $expected', (testCase) => {
					const { input, expected } = testCase
					expect(rewriteDocsUrl(input.url, input.productData)).toBe(expected)
				})
			})
		})
	})

	describe('does not rewrite image links', () => {
		const testData = [
			'/pricing.png',
			'/img/sla.jpg',
			'/img/products/vault/sre.png',
			'hcp-dev.svg',
		]
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const nomadProductData = require(`data/nomad.json`)

		test.each(testData)('Testing subpath', (item) => {
			const processedUrl = rewriteDocsUrl(item, nomadProductData)
			expect(processedUrl).toBe(item)
		})
	})
})
