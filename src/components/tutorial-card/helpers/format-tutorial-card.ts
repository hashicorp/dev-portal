import { getTutorialSlug } from 'views/collection-view/helpers'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import {
	ProductUsed,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { TutorialCardPropsWithId } from '../types'

/**
 * TODO:
 * We don't use tutorial.defaultContext if collectionSlug is provided.
 *
 * Should we consider making tutorial.defaultContext not required here?
 * Eg, even lite-er TutorialLite?
 * (maybe this only applies to dev-mess-around /profile/progress-test, tho)
 */
export function formatTutorialCard(
	tutorial: ClientTutorialLite,
	/**
	 * Optional collection slug, used for URL.
	 * Note that each tutorial has a "default" collection context,
	 * which we use if `collectionSlug` is not provided.
	 * If `collectionSlug` is provided, it overrides that default
	 * collection context. Note that `collectionSlug` is not validated;
	 * please ensure it corresponds to a valid collection.
	 */
	collectionSlug?: string
): TutorialCardPropsWithId {
	const safeCollectionSlug = collectionSlug || tutorial.defaultContext.slug
	return {
		id: tutorial.id,
		// TODO: handle case where collectionSlug is passed.
		// maybe tutorial.defaultContext should be renamed to tutorial.collectionContext?
		// and should be strictly required?
		collectionId: tutorial.defaultContext.id,
		description: tutorial.description,
		duration: getReadableTime(tutorial.readTime),
		hasInteractiveLab: Boolean(tutorial.handsOnLab),
		hasVideo: Boolean(tutorial.video),
		heading: tutorial.name,
		url: getTutorialSlug(tutorial.slug, safeCollectionSlug),
		productsUsed: tutorial.productsUsed.map((p: ProductUsed) => p.product.slug),
	}
}
