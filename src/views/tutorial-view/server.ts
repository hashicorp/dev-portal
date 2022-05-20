import moize, { Options } from 'moize'
import { LearnProductData } from 'types/products'
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
import { getCollectionViewSidebarSections } from 'views/collection-view/server'

export interface TutorialPageProps {
  tutorial: TutorialData
  product: LearnProductData
  layoutProps: TutorialSidebarSidecarProps
  nextCollection?: ClientCollectionLite | null // if null, it is the last collection in the sidebar order
}

/**
 * Given a ProductData object (imported from src/data JSON files) and a tutorial
 * slug, fetches and returns the page props for
 * `/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}` pages.
 *
 * Returns the given ProductData object unmodified as the `product` page prop,
 * which is needed for other areas of the app to function.
 */
export async function getTutorialPageProps(
  product: LearnProductData,
  slug: [string, string]
): Promise<{ props: TutorialPageProps } | null> {
  const { collection, tutorialReference } = await getCurrentCollectionTutorial(
    product.slug as ProductOption,
    slug
  )

  // the tutorial doesn't exist in collection - return 404
  if (tutorialReference.dbSlug === null || collection.data === null) {
    return null
  }

  const fullTutorialData = await getTutorial(tutorialReference.dbSlug)
  // double guard if tutorial doesn't exist after call - return 404
  if (fullTutorialData === null) {
    return null
  }

  const { content: serializedContent, headings } = await serializeContent(
    fullTutorialData
  )
  const collectionContext = getCollectionContext(
    collection.data,
    fullTutorialData.collectionCtx
  )
  /**
   * @TODO this helper makes an API call to fetch all collections for the
   * current product. We plan to refactor the code in such a way so that this
   * API call is deferred to the client-side only when the data is needed to be
   * viewed. In this view, that means: on mobile, after opening the Sidebar, and
   * after clicking the level-up button at the top of the Sidebar.
   */
  const sidebarSections = await getCollectionViewSidebarSections(
    product,
    collection.data
  )
  const layoutProps = {
    headings,
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, filename: product.slug },
      collection: {
        name: collection.data.shortName,
        filename: collection.filename,
      },
      tutorial: {
        name: fullTutorialData.name,
        filename: tutorialReference.filename,
      },
    }),
    sidebarSections,
  }
  const lastTutorialIndex = collectionContext.current.tutorials.length - 1
  const isLastTutorial =
    collectionContext.current.tutorials[lastTutorialIndex].id ===
    fullTutorialData.id

  let nextCollection = undefined

  if (isLastTutorial) {
    nextCollection = await getNextCollectionInSidebar({
      product: product.slug as ProductOption,
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

// Caching the return value in memory for static builds to limit api calls
const moizeOpts: Options = {
  isPromise: true,
  maxSize: Infinity,
  isDeepEqual: true,
}
const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

export async function getTutorialPagePaths(
  product: ProductOption
): Promise<TutorialPagePaths[]> {
  const allCollections = await cachedGetAllCollections({
    product: { slug: product },
  })
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
