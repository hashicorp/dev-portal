import getIsBetaProduct from 'lib/get-is-beta-product'
import { rewriteExternalCollectionLink, rewriteExternalTutorialLink } from '.'

const rewriteExternalLearnLink = (
	urlObject: URL,
	tutorialMap: Record<string, string>
) => {
	let newUrl

	const { pathname } = urlObject
	const pathnameParts = pathname.split('/')

	let product
	if (pathnameParts.length === 2) {
		product = pathnameParts[1]
	} else if (
		pathnameParts[1] === 'tutorials' ||
		pathnameParts[1] === 'collections'
	) {
		product = pathnameParts[2]
	}

	const isBetaProduct = getIsBetaProduct(product)
	if (isBetaProduct) {
		// Regexes for each path type
		const collectionPathRegex = new RegExp('^/collections')
		const tutorialPathRegex = new RegExp('^/tutorials')
		const productHubPathRegex = new RegExp(`^/${product}/?$`)

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
	} else {
		newUrl = urlObject.toString()
	}

	return newUrl
}

export { rewriteExternalLearnLink }
