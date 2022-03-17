import {
  Collection as ClientCollection,
  TutorialFullCollectionCtx as ClientTutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { CollectionContext } from '..'
import { formatCollectionCard } from '../components/featured-in-collections/helpers'

export function getCollectionContext(
  currentCollection: ClientCollection,
  collectionCtx: ClientTutorialFullCollectionCtx['collectionCtx']
): CollectionContext {
  const isDefault = currentCollection.id === collectionCtx.default.id
  const featuredIn = collectionCtx.featuredIn
    .filter((c) => c.id !== currentCollection.id)
    .map(formatCollectionCard)

  return {
    isDefault,
    current: currentCollection,
    featuredIn,
  }
}
