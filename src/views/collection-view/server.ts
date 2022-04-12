import { LearnProductData } from 'types/products'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'

export interface CollectionPageProps {
  collection: ClientCollection
  allProductCollections: ClientCollection[]
  product: LearnProductData
  layoutProps: Pick<SidebarSidecarLayoutProps, 'headings' | 'breadcrumbLinks'>
}

export interface CollectionPagePath {
  params: {
    collectionSlug: string
  }
}

/**
 * Given a ProductData object (imported from src/data JSON files) and a
 * Collection slug, fetches and returns the page props for
 * `/{productSlug}/tutorials/{collectionSlug}` pages.
 *
 * Returns the given ProductData object unmodified as the `product` page prop,
 * which is needed for other areas of the app to function.
 */
export async function getCollectionPageProps(
  product: LearnProductData,
  slug: string
): Promise<{ props: CollectionPageProps }> {
  const collection = await getCollection(`${product.slug}/${slug}`)
  // For sidebar data
  const allProductCollections = await getAllCollections({
    product: { slug: product.slug, sidebarSort: true },
  })

  const layoutProps = {
    // @TODO integrate so the anchor tags track
    headings: [
      { title: 'Overview', slug: 'overview', level: 1 },
      { title: 'Tutorials', slug: 'tutorials', level: 1 },
    ],
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, filename: product.slug },
      collection: {
        name: collection.shortName,
        filename: splitProductFromFilename(collection.slug),
      },
    }),
  }

  return {
    props: stripUndefinedProperties({
      collection: collection,
      allProductCollections,
      product,
      layoutProps,
    }),
  }
}

export async function getCollectionPaths(
  product: ProductOption
): Promise<CollectionPagePath[]> {
  const collections = await getAllCollections({
    product: { slug: product },
  })
  // Only build collections where this product is the main 'theme'
  // @TODO once we implement the `theme` query option, remove the theme filtering
  // https://app.asana.com/0/1201903760348480/1201932088801131/f
  const filteredCollections = collections.filter((c) => c.theme === product)
  const paths = filteredCollections.map((collection) => ({
    params: {
      collectionSlug: splitProductFromFilename(collection.slug),
    },
  }))

  return paths
}
