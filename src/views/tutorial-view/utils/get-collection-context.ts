import {
  Collection as ClientCollection,
  ProductOption,
  TutorialLite as ClientTutorialLite,
  TutorialFullCollectionCtx as ClientTutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { getCollection } from 'lib/learn-client/api/collection'
import { CollectionContext } from '..'
import { formatCollectionCard } from '../components/featured-in-collections/helpers'

/**
 * We need to get the database slug for this tutorial, which may belong in a different
 * product directory in the filesystem. For example a tutorial with slug : `consul/get-started`
 * may be reference in a vault collection. So we can't assume this current
 * product context is valid for the db slug path
 *
 * @TODO - FOR PROD We will add a check in the content sync that
 * ensures no two files in a collection have the same filename
 */

interface CurrentCollectionTutorial {
  [key: string]: {
    filename: string
    data: ClientCollection | ClientTutorialLite
  }
}

export async function getCurrentCollectionTutorial(
  productSlug: ProductOption,
  tutorialSlug: [string, string]
): Promise<CurrentCollectionTutorial> {
  /**
   * In the db, slug structure for tutorials is {product}/{tutorial-filename}
   * the tutorialSlug passed in is based on /{collection-name}/{tutorial-name}
   * from the params. So we can assume `slug` index 1 is always the tutorial name
   * */
  const [collectionFilename, tutorialFilename] = tutorialSlug
  const collectionDbSlug = `${productSlug}/${collectionFilename}`
  const currentCollection = await getCollection(collectionDbSlug)
  const currentTutorial = currentCollection.tutorials.find((t) =>
    t.slug.endsWith(tutorialFilename)
  )

  if (!currentTutorial) {
    throw Error(
      `Tutorial filename: ${tutorialFilename} does not exist in collection: ${collectionDbSlug}`
    )
  }

  return {
    currentCollection: {
      filename: collectionFilename,
      data: currentCollection,
    },
    currentTutorial: {
      filename: tutorialFilename,
      data: currentTutorial,
    },
  }
}

// This function sets the default and filters the featured collections
export function getCollectionContext(
  currentCollection: ClientCollection,
  collectionCtx: ClientTutorialFullCollectionCtx['collectionCtx']
): CollectionContext {
  const isDefault = currentCollection.id === collectionCtx.default.id
  const featuredIn = collectionCtx.featuredIn
    .filter(
      (c) => c.id !== currentCollection.id && !c.slug.includes('onboarding') // filter out onboarding content for CS team
    )
    .map(formatCollectionCard)

  return {
    isDefault,
    current: currentCollection,
    featuredIn,
  }
}
