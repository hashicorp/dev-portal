import getIsBetaProduct from 'lib/get-is-beta-product'
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'
import {
	getIsExternalLearnLink,
	rewriteExternalCollectionLink,
	rewriteExternalTutorialLink,
} from '.'

const rewriteExternalLearnLink = (
	urlObject: URL,
	tutorialMap: Record<string, string>
) => {
	let newUrl

	/**
	 * If it's not a Learn link, don't return anything.
	 */
	if (!getIsExternalLearnLink(urlObject.toString())) {
		return
	}

	const { pathname, searchParams } = urlObject
	const pathnameParts = pathname.split('/')

	let product
	if (pathnameParts.length === 2) {
		product = normalizeSlugForDevDot(pathnameParts[1])
	} else if (pathnameParts[1] === 'tutorials' && searchParams.has('in')) {
		const [alternateSlug] = searchParams.get('in').split('/')
		product = normalizeSlugForDevDot(alternateSlug)
	} else if (
		pathnameParts[1] === 'tutorials' ||
		pathnameParts[1] === 'collections'
	) {
		product = normalizeSlugForDevDot(pathnameParts[2])
	}

	const isBetaProduct = getIsBetaProduct(product)
	if (isBetaProduct) {
		// Regexes for each path type
		const collectionPathRegex = new RegExp('^/collections')
		const tutorialPathRegex = new RegExp('^/tutorials')
		const productHubPathRegex = new RegExp(`^/${product}|cloud/?$`)

		// Derived path type booleans
		const isCollectionPath = collectionPathRegex.test(pathname)
		const isProductHubPath = productHubPathRegex.test(pathname)
		const isTutorialPath = tutorialPathRegex.test(pathname)

		if (isCollectionPath) {
			newUrl = rewriteExternalCollectionLink(urlObject)
		} else if (isTutorialPath) {
			newUrl = rewriteExternalTutorialLink(urlObject, tutorialMap)
		} else if (isProductHubPath) {
			newUrl = `/${product}/tutorials`
		}
	}

	return newUrl
}

export { rewriteExternalLearnLink }
