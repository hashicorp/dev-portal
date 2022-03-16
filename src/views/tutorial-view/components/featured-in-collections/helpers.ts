import { Collection } from 'lib/learn-client/types'
import { CollectionCardProps } from '.'

export function formatCollectionCard(
  collection: Collection
): CollectionCardProps {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    theme: collection.theme,
    numTutorials: collection.tutorials.length,
  }
}
