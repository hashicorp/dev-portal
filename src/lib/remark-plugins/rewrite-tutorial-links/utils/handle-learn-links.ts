import { ProductOption } from 'lib/learn-client/types'
import { getCollectionSlug } from 'views/collection-view/helpers'

/**
 * TUTORIAL PATH MAPPING:
 * /tutorials/{product}/{tutorial-name}  --> /{product}/tutorials/{collection-name}/{tutorial-name}
 *
 * Tutorial paths can also have query params to reference collections not in the default context:
 * /tutorials/${product}/{tutorial-name}?in=${product}/${collection-name} --> /{product}/tutorials/{collection-name}/{tutorial-name}
 *
 * And query params with anchor links
 * /tutorials/${product}/{tutorial-name}?in=${product}/${collection-name}#{anchor} --> /{product}/tutorials/{collection-name}/{tutorial-name}#{anchor}
 *
 * And regular anchor links
 * /tutorials/${product}/{tutorial-name}#{anchor} --> /{product}/tutorials/{collection-name}/{tutorial-name}#{anchor}
 */

type SplitLearnPath = [
	string, // the leading slash
	'collections' | 'tutorials',
	ProductOption,
	string
]

export function handleTutorialLink(
	nodePath: string,
	tutorialMap: { [key: string]: string }
) {
	/**
	 * Use the URL API to get each piece of the given `nodePath` that we need to
	 * examine.
	 */
	const url = new URL(nodePath, __config.dev_dot.canonical_base_url)

	/**
	 * Get the product slug and the tutorial's filename from the `pathname` piece
	 * of the given `nodePath`.
	 */
	const [, , product, filename] = url.pathname.split('/') as SplitLearnPath

	/**
	 * Construct the new URL's path.
	 *   - If a collection slug is provided via the `in` query string parameter,
	 * 	   then we build the path ourselves.
	 *   - Otherwise, we use the path that references the default collection from
	 *     the given `tutorialMap`.
	 */
	let path = ''
	const collectionSlugParam = url.searchParams.get('in')
	if (collectionSlugParam) {
		const collectionSlug = collectionSlugParam.split('/')[1]
		path = `/${product}/tutorials/${collectionSlug}/${filename}`
	} else {
		const tutorialSlug = [product, filename].join('/')
		path = tutorialMap[tutorialSlug]
	}

	/**
	 * Remove the `in` parameter from the give `nodePath`, since it's not needed
	 * on this platform.
	 */
	url.searchParams.delete('in')

	/**
	 * Return the fully constructed URL.
	 *
	 * NOTE: `search` already includes the `?` character, and  `hash` already
	 * includes the `#` character.
	 */
	return `${path}${url.search}${url.hash}`
}

/**
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 */

export function handleCollectionLink(nodePath: string) {
	const [, , product, filename] = nodePath.split('/') as SplitLearnPath

	return getCollectionSlug(`${product}/${filename}`)
}
