import { Product as ProductContext } from 'types/products'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
  ProductOption,
  Collection as ClientCollection,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from './utils'
import { serializeContent } from './utils/serialize-content'
import { TutorialSidebarSidecarProps, TutorialData } from '.'
import {
  getCollectionContext,
  getCurrentCollectionTutorial,
} from './utils/get-collection-context'
import { getTutorialsBreadcrumb } from './utils/get-tutorials-breadcrumb'

// @TODO just a stub - adjust page props interface
export interface TutorialPageProps {
  tutorial: TutorialData
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
  const { currentCollection, currentTutorial } =
    await getCurrentCollectionTutorial(product.slug, slug)
  const baseTutorialData = await getTutorial(currentTutorial.data.slug)
  const { content: serializedContent, headings } = await serializeContent(
    baseTutorialData
  )
  const collectionContext = getCollectionContext(
    currentCollection.data as ClientCollection,
    baseTutorialData.collectionCtx
  )
  const layoutProps = {
    headings,
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, slug: product.slug },
      collection: {
        name: collectionContext.current.shortName,
        slug: currentCollection.filename,
      },
      tutorial: { name: baseTutorialData.name, slug: currentTutorial.filename },
    }),
  }

  /**
   * @TODO handle next / prev tutorial data
   * if is last tutorial in collection, call the endpoint to get next tutorial,
   * e.g. /products/terraform/collections?topLevelCategorySort=true&after=collection-slug&limit=1
   * https://app.asana.com/0/1201903760348480/1201932088801131/f
   *  */

  return {
    props: stripUndefinedProperties({
      tutorial: {
        ...baseTutorialData,
        content: serializedContent,
        collectionCtx: collectionContext,
        headings,
      },
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
