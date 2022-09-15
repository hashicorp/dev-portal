import path from 'path'
import { ProductSlug } from 'types/products'

/**
 *
 * This function handles rewrites for docs links in learn content
 * Refer to this whimsical for full mapping - https://whimsical.com/url-remaps-TqyEmfG6gYyiAZR1HWSWEL
 *
 * It accept a nodePath, which should be the url pathname only (e.g. just /docs, not vaultproject.io/docs)
 *
 * /docs								-->	/waypoint/docs
 * /api									--> /vault/api-docs
 * /docs/some-doc.html	--> /waypoint/docs/some-doc
 * /api/index.html			--> /waypoint/api-docs
 */

export function handleDocsLink(urlObject: URL, product: ProductSlug) {
	const { pathname } = urlObject
	const pathnameParts = pathname.split('/')
	const [, basePath, ...restParts] = pathnameParts

	const numRestParts = restParts.length
	if (numRestParts > 0) {
		const lastPart = restParts[numRestParts - 1]
		restParts[numRestParts - 1] = lastPart
			.replace('index.html', '')
			.replace('.html', '')
	}

	const finalBasePath = basePath === 'api' ? 'api-docs' : basePath
	const joinedParts = path.join(product, finalBasePath, ...restParts)
	return `/${joinedParts}`
}
