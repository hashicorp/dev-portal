import moize, { Options } from 'moize'
import {
  Collection as ClientCollection,
  ProductOption,
  TutorialFullCollectionCtx as ClientTutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { getCollection } from 'lib/learn-client/api/collection'
import { CollectionContext } from '..'
import { formatCollectionCard } from 'components/collection-card/helpers'

/**
 * We need to get the database slug for this tutorial, which may belong in a different
 * product directory in the filesystem. For example a tutorial with slug : `consul/get-started`
 * may be reference in a vault collection. So we can't assume this current
 * product context is valid for the db slug path
 */

interface CurrentCollectionTutorial {
  collection: {
    filename: string
    data: ClientCollection
  }
  tutorialReference: {
    filename: string
    dbSlug: string
  }
}

// Caching the return value in memory for static builds to limit api calls
const moizeOpts: Options = {
  isPromise: true,
  maxSize: Infinity,
  isDeepEqual: true,
}
const cachedGetCollection = moize(getCollection, moizeOpts)

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
  const collection = await cachedGetCollection(collectionDbSlug)
  /**
   * This type is only `TutorialLite` which doesn't have the tutorial content
   * so we only need the slug to make another request to get the full tutorial data in server.ts
   */
  const currentTutorial = collection?.tutorials.find((t) =>
    t.slug.endsWith(tutorialFilename)
  )

  if (!currentTutorial) {
    console.error(
      `Tutorial filename: ${tutorialFilename} does not exist in collection: ${collectionDbSlug}`
    )
  }

  return {
    collection: {
      filename: collectionFilename,
      data: collection || null,
    },
    tutorialReference: {
      filename: tutorialFilename,
      dbSlug: currentTutorial?.slug || null,
    },
  }
}

// This function sets the default and filters the featured collections
export function getCollectionContext(
  currentCollection: ClientCollection,
  collectionCtx: ClientTutorialFullCollectionCtx['collectionCtx']
): CollectionContext {
  const featuredIn = collectionCtx.featuredIn
    .filter(
      (c) => c.id !== currentCollection.id && !c.slug.includes('onboarding') // filter out onboarding content for CS team
    )
    .map(formatCollectionCard)

  return {
    default: {
      id: collectionCtx.default.id,
      slug: collectionCtx.default.slug,
    },
    current: currentCollection,
    featuredIn,
  }
}
