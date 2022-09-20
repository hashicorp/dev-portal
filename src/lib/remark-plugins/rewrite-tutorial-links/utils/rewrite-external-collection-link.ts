/**
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 */

import { getCollectionSlug } from 'views/collection-view/helpers'
import { SplitLearnPath } from '../types'

const rewriteExternalCollectionLink = (urlObject: URL) => {
	/**
	 * Separate the different parts of the URL so they are analyzed in silos.
	 */
	const { pathname, search, hash } = urlObject

	/**
	 * Validate the `pathname` of the given `urlObject`, and parse out the
	 * `product` and `filename` if the given `nodePath` is valid.
	 */
	const pathnameParts = pathname.split('/')
	const [emptyString, collectionsPath, product, filename] =
		pathnameParts as SplitLearnPath
	if (
		pathnameParts.length !== 4 ||
		emptyString !== '' ||
		collectionsPath !== 'collections' ||
		(product as unknown) === '' ||
		filename === ''
	) {
		throw new Error(
			`rewriteExternalCollectionLink received a URL with an invalid 'pathname': ${pathname}`
		)
	}

	/**
	 * Get the collection slug for the parsed `product` and `filename`.
	 */
	const collectionSlug = getCollectionSlug(`${product}/${filename}`)

	/**
	 * Piece the URL parts together.
	 */
	return `${collectionSlug}${search}${hash}`
}

export { rewriteExternalCollectionLink }
