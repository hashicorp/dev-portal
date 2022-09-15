/**
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 */

import { getCollectionSlug } from 'views/collection-view/helpers'
import { SplitLearnPath } from '../types'

const handleCollectionLink = (urlObject: URL) => {
	const { pathname, search, hash } = urlObject
	const pathParts = pathname.split('/')
	const [, , product, filename] = pathParts as SplitLearnPath
	const collectionSlug = getCollectionSlug(`${product}/${filename}`)

	return `${collectionSlug}${search}${hash}`
}

export { handleCollectionLink }
