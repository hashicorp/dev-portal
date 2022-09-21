import { productSlugsToHostNames } from 'lib/products'
import { ProductData, ProductSlug } from 'types/products'

/**
 * Determine whether the given `link` is a URL referencing product docs sites
 * that are external to the Learn and DevDot platform, and rewriteable to a page
 * within DevDot.
 */
const getIsRewriteableDocsLink = (link: string): boolean => {
	try {
		const urlObject = new URL(link)
		const { hostname, pathname } = urlObject
		const basePath = pathname.split('/')[1]

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
		 * If there is no base path, then it's a docs site home page.
		 */
		if (basePath === '') {
			return true
		}

		/**
		 * Load the `basePaths` configured for the parsed product, and allow `api`
		 * as one of the product's accepted base paths if `api-docs` is accepted.
		 */
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const productData = require(`data/${productSlug}.json`) as ProductData
		const acceptedBasePaths = productData.basePaths
		if (acceptedBasePaths.includes('api-docs')) {
			acceptedBasePaths.push('api')
		}

		/**
		 * Check if the base path is one of the product's accepted base paths.
		 */
		const isBasePathAccepted =
			acceptedBasePaths.length === 0 ||
			acceptedBasePaths.some((acceptedBasePath: string) => {
				return basePath.startsWith(acceptedBasePath)
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
