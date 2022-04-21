import { getCollectionSlug } from 'views/collection-view/helpers'
import {
  Collection as ClientCollection,
  themeIsProduct,
} from 'lib/learn-client/types'
import { ProductSlug } from 'types/products'
import { CollectionCardPropsWithId } from './types'

export function formatCollectionCard(
  collection: ClientCollection
): CollectionCardPropsWithId {
  return {
    id: collection.id,
    description: collection.description,
    heading: collection.name,
    productsUsed: parseProductsUsed(collection),
    tutorialCount: collection.tutorials.length,
    url: getCollectionSlug(collection.slug),
  }
}

/**
 * TODO: Designs show multiple productsUsed on collection cards.
 *
 * Should we parse the tutorials within a collection in order
 * to show a more complete list? Or will this result in more of a
 * "product icon overload" on these cards?
 */
function parseProductsUsed(collection: ClientCollection): ProductSlug[] {
  const theme = collection.theme
  if (themeIsProduct(theme)) {
    // For product themes, return the product slug,
    // which is compatible with dev-dot's ProductSlug types
    return [theme]
  } else {
    // For other themes, return "hcp", for a generic "H" logo
    return ['hcp']
  }
}
