import moize, { Options } from 'moize'
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
import {
  CollectionCategorySidebarSection,
  formatSidebarCategorySections,
} from './helpers'
import { filterCollections } from '../product-tutorials-view/helpers'

export interface CollectionPageProps {
  collection: ClientCollection
  allProductCollections: ClientCollection[]
  product: LearnProductData
  layoutProps: CollectionLayout
}

export type CollectionLayout = Pick<
  SidebarSidecarLayoutProps,
  'breadcrumbLinks'
> & { sidebarSections: CollectionCategorySidebarSection[] }

export interface CollectionPagePath {
  params: {
    collectionSlug: string
  }
}

// Caching the return value in memory for static builds to limit api calls
const moizeOpts: Options = {
  isPromise: true,
  maxSize: Infinity,
  isDeepEqual: true,
}
const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

export async function getCollectionViewSidebarSections(
  product: LearnProductData,
  collection: ClientCollection
) {
  // use memo here
  const allProductCollections = await cachedGetAllCollections({
    product: { slug: product.slug, sidebarSort: true },
  })
  const filteredCollections = filterCollections(
    allProductCollections,
    product.slug
  )

  return formatSidebarCategorySections(filteredCollections, collection.slug)
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
): Promise<{ props: CollectionPageProps } | null> {
  const collection = await getCollection(`${product.slug}/${slug}`)

  // if null the api encountered a 404
  if (collection === null) {
    return null
  }

  const layoutProps = {
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, filename: product.slug },
      collection: {
        name: collection.shortName,
        filename: splitProductFromFilename(collection.slug),
      },
    }),
    sidebarSections: await getCollectionViewSidebarSections(
      product,
      collection
    ),
  }

  return {
    props: stripUndefinedProperties({
      collection: collection,
      product,
      layoutProps,
    }),
  }
}

export async function getCollectionPaths(
  product: ProductOption
): Promise<CollectionPagePath[]> {
  const collections = await cachedGetAllCollections({
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
