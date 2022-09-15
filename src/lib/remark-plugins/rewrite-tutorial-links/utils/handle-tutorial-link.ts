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

import { SectionOption } from 'lib/learn-client/types'
import { SplitLearnPath } from '../types'

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
	 * Validate the given `nodePath` (via `url.pathname`), and parse out the
	 * `product` and `filename` if the given `nodePath` is valid.
	 */
	const pathnameParts = url.pathname.split('/') as SplitLearnPath
	const [emptyString, tutorialsPath, product, filename] = pathnameParts
	if (
		pathnameParts.length !== 4 ||
		emptyString !== '' ||
		tutorialsPath !== 'tutorials' ||
		(product as unknown) === '' ||
		filename === ''
	) {
		throw new Error('')
	}

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
		if (SectionOption[product]) {
			path = `/${product}/${collectionSlug}/${filename}`
		} else {
			path = `/${product}/tutorials/${collectionSlug}/${filename}`
		}
	} else {
		const tutorialSlug = [product, filename].join('/')
		path = tutorialMap[tutorialSlug]
	}

	/**
	 * If the path could not be determined, then the `tutorialSlug` was not found
	 * in the `tutorialMap`.
	 */
	if (!path) {
		return
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
