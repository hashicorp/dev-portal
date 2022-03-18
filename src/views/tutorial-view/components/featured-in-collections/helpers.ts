import { Collection as ClientCollection } from 'lib/learn-client/types'
import { CollectionCardProps } from '.'

export function formatCollectionCard(
  collection: ClientCollection
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
