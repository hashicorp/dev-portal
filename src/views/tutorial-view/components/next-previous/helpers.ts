import { Collection, CollectionLite } from 'lib/learn-client/types'
import {
  getCollectionSlug,
  getTutorialSlug,
} from 'views/collection-view/helpers'

interface GetNextPreviousParams {
  currentTutorialSlug: string
  currentCollection: Collection
  nextCollectionInSidebar: CollectionLite
}

export function getNextPrevious({
  currentTutorialSlug,
  currentCollection,
  nextCollectionInSidebar,
}: GetNextPreviousParams) {
  let previousTutorial
  let nextTutorial
  let isFirstTutorial = false
  let isLastTutorial = false

  /**
   * @TODO - interim state for 'final' link
   * This link shows on the last tutorial in the last collection in sidebar order
   * In learn, it links to a filtered advanced search page state
   * e.g. https://learn.hashicorp.com/search?product=waypoint&page=1
   *
   * Since don't have an advanced search page for beta, were linking folks back to the base
   * product tutorials page.
   *
   */
  const finalLink = `/${currentCollection.theme}/tutorials`

  /**
   * get next & previous tutorials
   */

  const tutorialIndex = currentCollection.tutorials.findIndex(
    (t) => t.slug === currentTutorialSlug
  )

  if (tutorialIndex === 0) {
    isFirstTutorial = true
  }

  if (tutorialIndex === currentCollection.tutorials.length - 1) {
    isLastTutorial = true
  }

  if (!isFirstTutorial) {
    const { slug, name } = currentCollection.tutorials[tutorialIndex - 1]
    previousTutorial = {
      path: getTutorialSlug(slug, currentCollection.slug),
      name,
    }
  }

  if (!isLastTutorial) {
    const { slug, name } = currentCollection.tutorials[tutorialIndex + 1]
    nextTutorial = {
      path: getTutorialSlug(slug, currentCollection.slug),
      name,
    }
  }

  /**
   * get next and previous collections
   */
  const nextCollection = nextCollectionInSidebar
    ? {
        path: getCollectionSlug(nextCollectionInSidebar.slug),
        name: nextCollectionInSidebar.shortName,
      }
    : undefined

  const collection = {
    current: {
      path: getCollectionSlug(currentCollection.slug),
      name: currentCollection.shortName,
    },
    next: nextCollection,
    isLast: isLastTutorial && !nextCollection, // if next collection isn't defined and were on the last tutorial, the api returned null
  }

  const data = {
    tutorial: {
      previous: previousTutorial,
      next: nextTutorial,
      isLast: isLastTutorial,
    },
    collection,
    finalLink,
  }

  return data
}
