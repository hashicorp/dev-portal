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
	const { hash, searchParams, pathname } = new URL(
		nodePath,
		__config.dev_dot.canonical_base_url
	)

	/**
	 * Get the product slug and the tutorial's filename from the `pathname` piece
	 * of the given `nodePath`.
	 */
	const [, , product, filename] = pathname.split('/') as SplitLearnPath

	/**
	 * Construct the new URL's path.
	 *   - If a collection slug is provided via the `in` query string parameter,
	 * 	   then we build the path ourselves.
	 *   - Otherwise, we use the path that references the default collection from
	 *     the given `tutorialMap`.
	 */
	let path = ''
	const collectionSlugParam = searchParams.get('in')
	if (collectionSlugParam) {
		const collectionSlug = collectionSlugParam.split('/')[1]
		path = `/${product}/tutorials/${collectionSlug}/${filename}`
	} else {
		const tutorialSlug = [product, filename].join('/')
		path = tutorialMap[tutorialSlug]
	}

	/**
	 * Construct the full string of query parameters, ignoring the `in` param that
	 * is not needed on this platform.
	 *
	 * NOTE: searchParams.toString() is not used for this because it outputs
	 * encoded characters (such as the `/` character).
	 */
	let queryString = ''
	searchParams.forEach((value: string, key: string) => {
		// Ignore `in` param, we don't need it
		if (key === 'in') {
			return
		}

		// Determine the prefix needed for the current param
		const isFirstParam = queryString.length === 0
		if (isFirstParam) {
			queryString += '?'
		} else {
			queryString += '&'
		}

		// Append the param's key and value
		queryString += `${key}=${value}`
	})

	/**
	 * Return the fully constructed URL.
	 *
	 * NOTE: `hash` already includes the `#` character.
	 */
	return `${path}${queryString}${hash}`
}

/**
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 */

export function handleCollectionLink(nodePath: string) {
	const [, , product, filename] = nodePath.split('/') as SplitLearnPath

	return getCollectionSlug(`${product}/${filename}`)
}
