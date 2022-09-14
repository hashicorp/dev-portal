/**
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 */

import { getCollectionSlug } from 'views/collection-view/helpers'
import { SplitLearnPath } from '../types'

const handleCollectionLink = (nodePath: string) => {
	const [, , product, filename] = nodePath.split('/') as SplitLearnPath

	return getCollectionSlug(`${product}/${filename}`)
}

export { handleCollectionLink }
