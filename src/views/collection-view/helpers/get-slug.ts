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
	if (
		rawProductSlug === 'well-architected-framework' ||
		rawProductSlug === 'onboarding'
	) {
		return `/${collectionDbSlug}/${tutorialFilename}`
	}

	// rawProductSlug may be "cloud", needs to be "hcp" for Dev Dot purposes
	const productSlug = normalizeSlugForDevDot(rawProductSlug)
	return `/${productSlug}/tutorials/${collectionFilename}/${tutorialFilename}`
}

export function getCollectionSlug(collectionDbSlug: string): string {
	const [rawProductSlug, collectionFilename] = collectionDbSlug.split('/')

	// @TODO genericize this to use 'topic' or 'section' instead of 'product'
	if (
		rawProductSlug === 'well-architected-framework' ||
		rawProductSlug === 'onboarding'
	) {
		return `/${collectionDbSlug}`
	}

	// rawProductSlug may be "cloud", needs to be "hcp" for Dev Dot purposes
	const productSlug = normalizeSlugForDevDot(rawProductSlug)

	return `/${productSlug}/tutorials/${collectionFilename}`
}
