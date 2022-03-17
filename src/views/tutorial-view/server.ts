import { GetStaticPathsResult } from 'next'
import { Product as ProductContext } from 'types/products'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { ProductOption } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from './utils'
import { serializeContent } from './utils/serialize-content'
import { TutorialViewProps, TutorialSidebarSidecarProps } from '.'
import { getCollectionContext } from './utils/get-collection-context'
import { getTutorialsBreadcrumb } from './utils/get-tutorials-breadcrumb'
import { getCurrentProduct } from './utils/get-current-product'

// @TODO just a stub - adjust page props interface
export interface TutorialPageProps {
  tutorial: TutorialViewProps
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
  productSlug: ProductOption,
  slug: [string, string]
): Promise<{ props: TutorialPageProps }> {
  /**
   * In the db, slug structure for tutorials is {product}/{tutorial-filename}
   * the tutorialSlug passed in is based on /{collection-name}/{tutorial-name}
   * from the params. So we can assume `slug` index 1 is always the tutorial name
   * */
  const [collectionFilename, tutorialFilename] = slug
  const tutorialDbSlug = `${productSlug}/${tutorialFilename}`
  const baseTutorialData = await getTutorial(tutorialDbSlug)
  const { content: serializedContent, headings } = await serializeContent(
    baseTutorialData
  )
  const collectionContext = getCollectionContext(
    productSlug,
    collectionFilename,
    baseTutorialData.collectionCtx
  )
  const product = getCurrentProduct(
    baseTutorialData.productsUsed,
    collectionContext.current.theme as ProductOption
  )
  const layoutProps = {
    headings,
    breadcrumbLinks: getTutorialsBreadcrumb({
      product,
      collection: {
        name: collectionContext.current.name,
        slug: collectionFilename,
      },
      tutorial: { name: baseTutorialData.name, slug: tutorialFilename },
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
  productSlug: ProductOption
): Promise<GetStaticPathsResult<TutorialPagePaths['params']>> {
  const allCollections = await getAllCollections({ product: productSlug })
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
  return {
    paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
    fallback: 'blocking',
  }
}
