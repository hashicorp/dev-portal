/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { productSlugsToHostNames } from 'lib/products'
import type { ProductSlug } from 'types/products'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'

/**
 * Determine whether the given `link` is a URL referencing product docs sites
 * that are external to the Learn and DevDot platform, and rewriteable to a page
 * within DevDot.
 */
const getIsRewriteableDocsLink = (link: string): boolean => {
	try {
		const urlObject = new URL(link)
		const { hostname, pathname } = urlObject

		/**
		 * Try to parse the product slug from the URL origin.
		 */
		const productSlug = Object.keys(productSlugsToHostNames).find(
			(productSlug: ProductSlug) => {
				const productHostName = productSlugsToHostNames[productSlug]
				return hostname.replace('www.', '') === productHostName
			}
		)

		/**
		 * If a product slug couldn't be parsed, then it's not a docs link.
		 */
		const isDocsHostname = !!productSlug
		if (!isDocsHostname) {
			return false
		}

		/**
		 * If there is no path, then it's a docs site home page.
		 */
		if (pathname === '/') {
			return true
		}

		/**
		 * Load the `basePaths` configured for the parsed product, and allow `api`
		 * as one of the product's accepted base paths if `api-docs` is accepted.
		 */
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const productData = PRODUCT_DATA_MAP[productSlug]
		const acceptedBasePaths = productData.basePaths
		if (acceptedBasePaths.includes('api-docs')) {
			acceptedBasePaths.push('api')
		}

		/**
		 * Check if the link's path begins with one of the product's accepted base
		 * paths.
		 */
		const isBasePathAccepted =
			acceptedBasePaths.length === 0 ||
			acceptedBasePaths.some((acceptedBasePath: string) => {
				return pathname.startsWith(`/${acceptedBasePath}`)
			})

		/**
		 * Return whether or not the base path is accepted.
		 */
		return isBasePathAccepted
	} catch (error) {
		/**
		 * If `link` isn't a fully valid URL, then it's not an external docs link.
		 */
		return false
	}
}

export { getIsRewriteableDocsLink }
