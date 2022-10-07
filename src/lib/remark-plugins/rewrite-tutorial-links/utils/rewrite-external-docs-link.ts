import path from 'path'
import { ProductSlug } from 'types/products'
import { productSlugsToHostNames } from 'lib/products'
import { getIsRewriteableDocsLink } from './get-is-rewriteable-docs-link'

/**
 * Handles rewriting an external docs URL (from .io pages) to a DevDot internal
 * path.
 *
 * Refer to this whimsical for full mapping:
 * https://whimsical.com/url-remaps-TqyEmfG6gYyiAZR1HWSWEL
 *
 * Examples:
 *
 *   https://vaultproject.io/												--> /vault
 *   https://vaultproject.io/api										--> /vault/api-docs
 *   https://vaultproject.io/api/index.html					--> /waypoint/api-docs
 *   https://waypointproject.io/community						--> undefined
 *   https://waypointproject.io/										-->	/waypoint
 *   https://waypointproject.io/docs								-->	/waypoint/docs
 *   https://waypointproject.io/docs/some-doc.html	--> /waypoint/docs/some-doc
 *   https://waypointproject.io/community						--> undefined
 */
export function rewriteExternalDocsLink(urlObject: URL) {
	/**
	 * Return nothing if the link isn't an external docs link.
	 */
	const isRewritableDocsLink = getIsRewriteableDocsLink(urlObject.toString())
	if (!isRewritableDocsLink) {
		return
	}

	/**
	 * Separate the different parts of the URL so they are analyzed in silos.
	 */
	const { hostname, pathname, search, hash } = urlObject
	const pathnameParts = pathname.split('/')
	const [, basePath, ...restParts] = pathnameParts

	/**
	 * Parse the product slug from the given `urlObject`'s hostname.
	 */
	const productSlug = Object.keys(productSlugsToHostNames).find(
		(productSlug: ProductSlug) => {
			const productHostName = productSlugsToHostNames[productSlug]
			return hostname.replace('www.', '') === productHostName
		}
	) as ProductSlug

	/**
	 * If there is no `basePath`, then rewrite link to the product's landing page.
	 */
	if (basePath === '') {
		return `/${productSlug}`
	}

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
	const finalBasePath =
		basePath === 'api' ? 'api-docs' : basePath.replace('.html', '')

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
