import { Product as ProductContext } from 'types/products'
import { TutorialSidebarSidecarProps } from 'layouts/tutorial-sidebar-sidecar'
import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from './utils'
import { serializeContent } from './utils/serialize-content'
import { TutorialViewProps } from '.'

// @TODO just a stub - adjust page props interface
export interface TutorialPageProps {
  tutorial: TutorialViewProps
  currentCollection: ClientCollection
  product: TutorialPageProduct // controls the ProductSwitcher
  layoutProps: TutorialSidebarSidecarProps
}

/**
 *  This slug needs to use the Learn product option enum,
 *  as the types in `ProductContext` slug aren't valid for the API req
 */
export interface TutorialPageProduct extends Pick<ProductContext, 'name'> {
  slug: ProductOption
}

export async function getTutorialPageProps(
  product: TutorialPageProduct,
  slug: [string, string]
): Promise<{ props: TutorialPageProps }> {
  /**
   * In the db, slug structure for tutorials is {product}/{tutorial-filename}
   * the tutorialSlug passed in is based on /{collection-name}/{tutorial-name}
   * from the params. So we can assume `slug` index 1 is always the tutorial name
   * */
  const [collectionFilename, tutorialFilename] = slug
  const tutorialDbSlug = `${product.slug}/${tutorialFilename}`
  const baseTutorialData = await getTutorial(tutorialDbSlug)
  const serializedContent = await serializeContent(baseTutorialData)
  const collectionDbSlug = `${product.slug}/${collectionFilename}`
  const currentCollectionData = await getCollection(collectionDbSlug) // for sidebar

  const layoutProps = {
    breadcrumbLinks: [
      { title: 'Developer', url: '/' },
      { title: product.name, url: `/${product.slug}` },
      { title: 'Tutorials', url: `/${product.slug}/tutorials` },
      {
        title: currentCollectionData.shortName,
        url: `/${product.slug}/tutorials/${currentCollectionData.slug}`,
      },
      {
        title: baseTutorialData.name,
        url: `/${product.slug}/tutorials/${currentCollectionData.slug}/${baseTutorialData.slug}`,
      },
    ],
  }

  // @TODO if is last tutorial in collection, call the endpoint to get next tutorial, other

  return {
    props: stripUndefinedProperties({
      tutorial: {
        ...baseTutorialData,
        content: serializedContent,
      },
      currentCollection: currentCollectionData,
      product,
      layoutProps,
    }),
  }
}

export interface TutorialPagePaths {
  params: {
    tutorialSlug: [string, string]
  }
}

/**
 * Not using ISR for now as Waypoint only has 22 tutorial routes, feels reasonable
 *
 * We'll need to accept an array of products until they are a
 * all setup, in which case we'll fetch all collections and run the map
 * We can't use the fathom analytics endpoint for ISR until we set it up
 */
export async function getTutorialPagePaths(
  product: ProductOption
): Promise<TutorialPagePaths[]> {
  const allCollections = await getAllCollections({ product })
  // go through all collections, get the collection slug
  const paths = allCollections.flatMap((collection) => {
    const collectionSlug = splitProductFromFilename(collection.slug)
    // go through the tutorials within this collection, create a path for each
    return collection.tutorials.map((tutorial) => {
      const tutorialSlug = splitProductFromFilename(tutorial.slug)

      return {
        params: {
          tutorialSlug: [collectionSlug, tutorialSlug] as [string, string],
        },
      }
    })
  })
  return paths
}
