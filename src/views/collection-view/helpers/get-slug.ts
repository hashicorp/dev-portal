import { LearnProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { splitProductFromFilename } from 'views/tutorial-view/utils'

/**
 * takes db slug format --> waypoint/intro
 * and turns it to --> waypoint/tutorials/get-started-docker/intro
 *
 * We want to make sure to use the collection product in the path as
 * that sets the proper product context. The tutorial db slug may
 * reference a different product context
 */

export function getTutorialSlug(
	tutorialDbSlug: string,
	collectionDbSlug: string
): string {
	const [rawProduct, collectionFilename] = collectionDbSlug.split('/')
	const product = rawProduct == 'cloud' ? 'hcp' : rawProduct
	const tutorialFilename = splitProductFromFilename(tutorialDbSlug)

	if (product === 'well-architected-framework') {
		return `/${collectionDbSlug}/${tutorialFilename}`
	}

	return `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`
}

export function getCollectionSlug(collectionDbSlug: string): string {
	const [rawProduct, collectionFilename] = collectionDbSlug.split('/')
	const product = rawProduct == 'cloud' ? 'hcp' : rawProduct
	const isBetaProduct = getIsBetaProduct(product as LearnProductSlug | 'hcp')

	// @TODO genericize this to use 'topic' or 'section' instead of 'product'
	if (product === 'well-architected-framework') {
		return `/${collectionDbSlug}`
	}

	// if not a 'sanctioned product', link externally to Learn
	// interim solution for BETA where not all products are onboarded
	if (!isBetaProduct) {
		return `https://learn.hashicorp.com/collections/${collectionDbSlug}`
	}

	return `/${product}/tutorials/${collectionFilename}`
}
