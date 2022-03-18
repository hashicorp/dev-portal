import {
  ProductOption,
  TutorialFullCollectionCtx as ClientTutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { CollectionContext } from '..'
import { formatCollectionCard } from '../components/featured-in-collections/helpers'

export function getCollectionContext(
  productSlug: ProductOption,
  filename: string,
  collectionCtx: ClientTutorialFullCollectionCtx['collectionCtx']
): CollectionContext {
  const collectionDbSlug = `${productSlug}/${filename}`
  const current = collectionCtx.featuredIn.find(
    ({ slug }) => slug === collectionDbSlug
  )
  const isDefault = current.id === collectionCtx.default.id
  const featuredIn = collectionCtx.featuredIn
    .filter((c) => c.id !== current.id)
    .map(formatCollectionCard)

  return {
    isDefault,
    current,
    featuredIn,
  }
}
