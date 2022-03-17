import { GetStaticPathsResult } from 'next'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { TutorialPageProduct } from 'views/tutorial-view/server'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { Product as ProductContext } from 'types/products'

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
  productSlug: ProductOption,
  slug: string
): Promise<{ props: CollectionPageProps }> {
  const collection = await getCollection(`${productSlug}/${slug}`)
  // For sidebar data
  const allProductCollections = await getAllCollections({
    product: productSlug,
  })
  const currentProduct = getProductFromCollectionTheme(collection)

  return {
    props: stripUndefinedProperties({
      collection: collection,
      allProductCollections,
      product: currentProduct,
    }),
  }
}

export async function getCollectionPaths(
  product: ProductOption
): Promise<GetStaticPathsResult<CollectionPagePath['params']>> {
  const collections = await getAllCollections({
    product,
  })
  const paths = collections.map((collection) => ({
    params: {
      collectionSlug: splitProductFromFilename(collection.slug),
    },
  }))

  return {
    paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
    fallback: 'blocking',
  }
}

// Get product based on collection theme
function getProductFromCollectionTheme(
  collection: ClientCollection
): ProductContext {
  let product

  for (let i = 0; i < collection.tutorials.length; i++) {
    if (product !== undefined) {
      break
    }

    const current = collection.tutorials[i].productsUsed.find(
      (p) => p.product.slug === collection.theme
    )

    if (current) {
      product = current.product
    }
  }

  return {
    slug: product.name,
    name: product.slug,
  } as ProductContext
}
