import { Product as ProductContext } from 'types/products'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
  ProductOption,
  Tutorial as ClientTutorial,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from './helpers'

// @TODO just a stub - adjust page props interface
export interface TutorialPageProps {
  tutorial: ClientTutorial
  product: Pick<ProductContext, 'slug'>
}

export async function getTutorialPageProps(
  product: ProductOption,
  slug: [string, string]
): Promise<{ props: TutorialPageProps }> {
  /**
   * In the db, slug structure for tutorials is {product}/{tutorial-filename}
   * the tutorialSlug passed in is based on /{collection-name}/{tutorial-name}
   * from the params. So we can assume `slug` index 1 is always the tutorial name
   * */
  const dbSlug = `${product}/${slug[1]}`
  const tutorial = await getTutorial(dbSlug)
  const props = stripUndefinedProperties({
    tutorial,
    product: {
      slug: product,
    },
  })

  return {
    props,
  }
}

export interface TutorialPagePaths {
  params: {
    tutorialSlug: string[]
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
  // @TODO - clean this up or write notes...use reduce?
  const paths = allCollections.flatMap((collection) => {
    const collectionSlug = splitProductFromFilename(collection.slug)
    return collection.tutorials.map((tutorial) => {
      const tutorialSlug = splitProductFromFilename(tutorial.slug)

      return {
        params: { tutorialSlug: [collectionSlug, tutorialSlug] },
      }
    })
  })
  return paths
}
