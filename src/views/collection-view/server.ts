import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/helpers'
import { TutorialPageProduct } from 'views/tutorial-view/server'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

export interface CollectionPageProps {
  collection: ClientCollection
  allProductCollections: ClientCollection[]
  product: CollectionPageProduct
}

export interface CollectionPagePath {
  params: {
    collectionSlug: string
  }
}

export type CollectionPageProduct = TutorialPageProduct

export async function getCollectionPageProps(
  product: CollectionPageProduct,
  slug: string
): Promise<{ props: CollectionPageProps }> {
  const collection = await getCollection(`${product.slug}/${slug}`)
  // For sidebar data
  const allProductCollections = await getAllCollections({
    product: product.slug,
  })

  return {
    props: stripUndefinedProperties({
      collection: collection,
      allProductCollections,
      product,
    }),
  }
}

export async function getCollectionPaths(
  product: ProductOption
): Promise<CollectionPagePath[]> {
  const collections = await getAllCollections({
    product,
  })
  const paths = collections.map((collection) => ({
    params: {
      collectionSlug: splitProductFromFilename(collection.slug),
    },
  }))

  return paths
}
