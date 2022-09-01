import { ProductOption, SectionOption } from 'lib/learn-client/types'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { CollectionCardPropsWithId } from 'components/collection-card'
import { TutorialData } from '..'

/**
 * When all products are loaded into dev dot, we don't need this function.
 *
 * It's current purpose is to prevent incorrect canonical urls pointing to
 * product paths that don't exist yet. The canonical url should always be the
 * default collection — however the default collection product may not have been
 * onboarded yet. This forces an alternative canonical url if that collection (product)
 * isn't in beta yet.
 */
export function getCanonicalCollectionSlug(
	tutorial: TutorialData,
	currentProductSlug: ProductOption | SectionOption
): string {
	// check if default has a beta product
	const defaultCollectionProduct = tutorial.collectionCtx.default.slug.split(
		'/'
	)[0] as ProductOption | SectionOption
	const defaultIsInBeta = getIsBetaProduct(defaultCollectionProduct)

	if (defaultIsInBeta) {
		return tutorial.collectionCtx.default.slug
	} else {
		// find the first collection that is in beta within 'featured collections'
		const firstInBetaFeaturedCollection =
			tutorial.collectionCtx.featuredIn?.find(
				(collection: CollectionCardPropsWithId) => {
					return collection.dbSlug.startsWith(currentProductSlug)
				}
			)

		// fallback to the current collection if the featured collections aren't defined
		return (
			firstInBetaFeaturedCollection?.dbSlug ||
			tutorial.collectionCtx.current.slug
		)
	}
}
