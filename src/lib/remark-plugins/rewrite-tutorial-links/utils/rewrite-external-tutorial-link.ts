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

import { LearnProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { SectionOption } from 'lib/learn-client/types'
import {
	normalizeSlugForDevDot,
	normalizeSlugForTutorials,
} from 'lib/tutorials/normalize-product-like-slug'
import { SplitLearnPath } from '../types'

export function rewriteExternalTutorialLink(
	urlObject: URL,
	tutorialMap: { [key: string]: string }
) {
	/**
	 * Validate the given `nodePath` (via `url.pathname`), and parse out the
	 * `product` and `filename` if the given `nodePath` is valid.
	 */
	const pathnameParts = urlObject.pathname.split('/') as SplitLearnPath
	const [emptyString, tutorialsPath, product, filename] = pathnameParts
	const normalizedProductSlug = normalizeSlugForDevDot(product)
	if (
		pathnameParts.length !== 4 ||
		emptyString !== '' ||
		tutorialsPath !== 'tutorials' ||
		(product as unknown) === '' ||
		filename === ''
	) {
		throw new Error(
			`rewriteExternalTutorialLink received a URL with an invalid 'pathname': ${urlObject.pathname}`
		)
	}

	/**
	 * Construct the new URL's path.
	 *   - If a collection slug is provided via the `in` query string parameter,
	 * 	   then we build the path ourselves.
	 *   - Otherwise, we use the path that references the default collection from
	 *     the given `tutorialMap`.
	 */
	let path = ''
	const collectionSlugParam = urlObject.searchParams.get('in')
	if (collectionSlugParam) {
		const [alternateProductSlug, collectionSlug] =
			collectionSlugParam.split('/')
		const normalizedAlternateSlug = normalizeSlugForDevDot(alternateProductSlug)
		if (SectionOption[normalizedAlternateSlug]) {
			path = `/${normalizedAlternateSlug}/${collectionSlug}/${filename}`
		} else if (getIsBetaProduct(normalizedAlternateSlug as LearnProductSlug)) {
			path = `/${normalizedAlternateSlug}/tutorials/${collectionSlug}/${filename}`
		}
	} else if (
		SectionOption[normalizedProductSlug] ||
		getIsBetaProduct(normalizedProductSlug)
	) {
		// example: the map has keys with `cloud` instead of `hcp`
		const tutorialSlug = [
			normalizeSlugForTutorials(normalizedProductSlug),
			filename,
		].join('/')
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
	urlObject.searchParams.delete('in')

	/**
	 * Return the fully constructed URL.
	 *
	 * NOTE: `search` already includes the `?` character, and  `hash` already
	 * includes the `#` character.
	 */
	return `${path}${urlObject.search}${urlObject.hash}`
}
