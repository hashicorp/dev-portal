import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToHostNames } from 'lib/products'
import path from 'path'
import { ProductSlug } from 'types/products'

/**
 * Handles rewriting the `pathname` for a given URL object, which is intended to
 * be a URL to docs content.
 *
 * Refer to this whimsical for full mapping:
 * https://whimsical.com/url-remaps-TqyEmfG6gYyiAZR1HWSWEL
 *
 * Examples:
 *
 *   /docs								-->	/waypoint/docs
 *   /api									--> /vault/api-docs
 *   /docs/some-doc.html	--> /waypoint/docs/some-doc
 *   /api/index.html			--> /waypoint/api-docs
 */
export function rewriteExternalDocsLink(urlObject: URL) {
	/**
	 * Separate the different parts of the URL so they are analyzed in silos.
	 */
	const { hostname, pathname, search, hash } = urlObject

	/**
	 * Parse the product slug from the given `urlObject`'s hostname.
	 */
	const productSlug = Object.keys(productSlugsToHostNames).find(
		(productSlug: ProductSlug) => {
			const productHostName = productSlugsToHostNames[productSlug]
			return hostname.includes(productHostName)
		}
	) as ProductSlug

	/**
	 * Return early if the parsed `productSlug` is not a beta product.
	 */
	const isBetaProduct = productSlug && getIsBetaProduct(productSlug)
	if (!isBetaProduct) {
		return
	}

	/**
	 * @TODO validate that the pathname parts are valid? (Is any input invalid?)
	 */
	const pathnameParts = pathname.split('/')
	const [, basePath, ...restParts] = pathnameParts

	/**
	 * Remove `index.html` or a trailing `.html` from the last part of the given
	 * URL's pathname.
	 */
	const numRestParts = restParts.length
	if (numRestParts > 0) {
		const lastPart = restParts[numRestParts - 1]
		restParts[numRestParts - 1] = lastPart
			.replace('index.html', '')
			.replace('.html', '')
	}

	/**
	 * If the basePath (the first part of the given pathname) is `api`, then
	 * replace it with `api-docs`.
	 */
	const finalBasePath = basePath === 'api' ? 'api-docs' : basePath

	/**
	 * Join all the path parts back together. Using `path` to prevent leading or
	 * trailing `/` characters.
	 */
	const joinedParts = path.join(productSlug, finalBasePath, ...restParts)

	/**
	 * Piece the URL parts together.
	 */
	return `/${joinedParts}${search}${hash}`
}
