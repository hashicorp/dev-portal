import { getTutorialSlug } from 'views/collection-view/helpers'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import {
  ProductUsed,
  TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { TutorialCardPropsWithId } from '../types'

export function formatTutorialCard(
  tutorial: ClientTutorialLite,
  collectionSlug?: string
): TutorialCardPropsWithId {
  const safeCollectionSlug = collectionSlug || tutorial.defaultContext.slug
  return {
    id: tutorial.id,
    description: tutorial.description,
    duration: getReadableTime(tutorial.readTime),
    hasInteractiveLab: Boolean(tutorial.handsOnLab),
    hasVideo: Boolean(tutorial.video),
    heading: tutorial.name,
    url: getTutorialSlug(tutorial.slug, safeCollectionSlug),
    productsUsed: tutorial.productsUsed.map((p: ProductUsed) => p.product.slug),
  }
}
