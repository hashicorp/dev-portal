import { Product as ProductContext } from 'types/products'
import {
  getAllCollections,
  getNextCollectionInSidebar,
} from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
  CollectionLite as ClientCollectionLite,
  ProductOption,
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

export interface TutorialPageProps {
  tutorial: TutorialData
  product: TutorialPageProduct // controls the ProductSwitcher
  layoutProps: TutorialSidebarSidecarProps
  nextCollection?: ClientCollectionLite | null // if null, it is the last collection in the sidebar order
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
  const { collection, tutorialReference } = await getCurrentCollectionTutorial(
    product.slug,
    slug
  )
  const fullTutorialData = await getTutorial(tutorialReference.dbSlug)
  const { content: serializedContent, headings } = await serializeContent(
    fullTutorialData
  )
  const collectionContext = getCollectionContext(
    collection.data,
    fullTutorialData.collectionCtx
  )
  const layoutProps = {
    headings,
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, slug: product.slug },
      collection: {
        name: collection.data.shortName,
        slug: collection.filename,
      },
      tutorial: {
        name: fullTutorialData.name,
        slug: tutorialReference.filename,
      },
    }),
  }
  const lastTutorialIndex = collectionContext.current.tutorials.length - 1
  const isLastTutorial =
    collectionContext.current.tutorials[lastTutorialIndex].id ===
    fullTutorialData.id

  let nextCollection = undefined

  if (isLastTutorial) {
    nextCollection = await getNextCollectionInSidebar({
      product: product.slug,
      after: collectionContext.current.slug,
    })
  }

  return {
    props: stripUndefinedProperties({
      tutorial: {
        ...fullTutorialData,
        content: serializedContent,
        collectionCtx: collectionContext,
        headings,
        nextCollectionInSidebar: nextCollection,
      },
      product,
      layoutProps,
      nextCollection,
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
  // Only build collections where this product is the main 'theme'
  // @TODO once we implement the `theme` query option, remove the theme filtering
  // https://app.asana.com/0/1201903760348480/1201932088801131/f
  const filteredCollections = allCollections.filter((c) => c.theme === product)
  // go through all collections, get the collection slug
  const paths = filteredCollections.flatMap((collection) => {
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
