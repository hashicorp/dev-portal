import { splitProductFromFilename } from 'views/tutorial-view/utils'

/**
 * takes db slug format --> waypoint/intro
 * and turns it to --> waypoint/tutorials/get-started-docker/intro
 *
 * We want to make sure to use the collection product in the path as
 * that sets the proper product context. The tutorial db slug may
 * reference a different product context
 */

export function getTutorialSlug(
  tutorialDbSlug: string,
  collectionDbSlug: string
): string {
  const [product, collectionFilename] = collectionDbSlug.split('/')
  const tutorialFilename = splitProductFromFilename(tutorialDbSlug)
  return `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`
}

export function getCollectionSlug(tutorialDbSlug: string): string {
  const [product, collectionFilename] = tutorialDbSlug.split('/')
  return `/${product}/tutorials/${collectionFilename}`
}
