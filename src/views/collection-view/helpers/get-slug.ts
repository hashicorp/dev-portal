import getIsBetaProduct from 'lib/get-is-beta-product'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'

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
	const [rawProductSlug, collectionFilename] = collectionDbSlug.split('/')
	const tutorialFilename = splitProductFromFilename(tutorialDbSlug)

	// @TODO genericize this to use 'topic' or 'section' instead of 'product'
	if (rawProductSlug === 'well-architected-framework') {
		return `/${collectionDbSlug}/${tutorialFilename}`
	}

	const productSlug = normalizeSlugForDevDot(rawProductSlug)
	return `/${productSlug}/tutorials/${collectionFilename}/${tutorialFilename}`
}

export function getCollectionSlug(collectionDbSlug: string): string {
	const [rawProductSlug, collectionFilename] = collectionDbSlug.split('/')

	// @TODO genericize this to use 'topic' or 'section' instead of 'product'
	if (rawProductSlug === 'well-architected-framework') {
		return `/${collectionDbSlug}`
	}

	const productSlug = normalizeSlugForDevDot(rawProductSlug)
	const isBetaProduct = getIsBetaProduct(productSlug)

	// if not a 'sanctioned product', link externally to Learn
	// interim solution for BETA where not all products are onboarded
	if (isBetaProduct) {
		return `/${productSlug}/tutorials/${collectionFilename}`
	} else {
		return `https://learn.hashicorp.com/collections/${collectionDbSlug}`
	}
}
