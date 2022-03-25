import { Collection, CollectionLite } from 'lib/learn-client/types'

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
      path: slug, // format
      name,
    }
  }

  if (!isLastTutorial) {
    const { slug, name } = currentCollection.tutorials[tutorialIndex + 1]
    nextTutorial = {
      path: slug, // format
      name,
    }
  }

  /**
   * get next and previous collections
   */
  const nextCollection = nextCollectionInSidebar
    ? {
        path: nextCollectionInSidebar.slug, //format
        name: nextCollectionInSidebar.shortName,
      }
    : undefined

  const collection = {
    current: {
      path: currentCollection.slug, //format
      name: currentCollection.shortName,
    },
    nextCollection,
    isLast: isLastTutorial && !nextCollection, // if next collection isn't defined and were on the last tutorial, the api returned null
  }

  {
    return {
      tutorial: {
        previous: previousTutorial,
        next: nextTutorial,
        isLast: isLastTutorial,
      },
      collection,
    }
  }
}
