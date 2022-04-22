import { getTutorialSlug } from 'views/collection-view/helpers'
import {
  ProductUsed,
  TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { TutorialCardPropsWithId } from './types'

export function formatTutorialCard(
  tutorial: ClientTutorialLite,
  collectionSlug: string
): TutorialCardPropsWithId {
  return {
    id: tutorial.id,
    description: tutorial.description,
    duration: `${tutorial.readTime}min`,
    hasInteractiveLab: Boolean(tutorial.handsOnLab),
    hasVideo: Boolean(tutorial.video),
    heading: tutorial.name,
    url: getTutorialSlug(tutorial.slug, collectionSlug),
    productsUsed: tutorial.productsUsed.map((p: ProductUsed) => p.product.slug),
  }
}
