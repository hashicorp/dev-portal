import { getTutorialSlug } from 'views/collection-view/helpers'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import {
	CollectionLite,
	ProductUsed,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { TutorialCardPropsWithId } from '../types'

/**
 * Formats tutorial data for use with the Tutorial Card component.
 */
export function formatTutorialCard(
	tutorial: ClientTutorialLite,
	/**
	 * Optional collection context.
	 * This is used for the tutorial URL, as well as progress display.
	 *
	 * Note that each tutorial has a "default" collection context,
	 * which we use if `collectionContext` is not provided.
	 *
	 * If `collectionContext` is provided, it overrides that default
	 * collection context. Note that `collectionContext` is not validated;
	 * please ensure it corresponds to a valid collection.
	 */
	collectionContext?: Pick<CollectionLite, 'id' | 'slug'>
): TutorialCardPropsWithId {
	const collection = collectionContext || tutorial.defaultContext
	return {
		id: tutorial.id,
		collectionId: collection.id,
		description: tutorial.description,
		duration: getReadableTime(tutorial.readTime),
		hasInteractiveLab: Boolean(tutorial.handsOnLab),
		hasVideo: Boolean(tutorial.video),
		heading: tutorial.name,
		url: getTutorialSlug(tutorial.slug, collection.slug),
		productsUsed: tutorial.productsUsed.map((p: ProductUsed) => p.product.slug),
	}
}
